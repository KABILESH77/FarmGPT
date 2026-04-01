import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Lang = "ML" | "TA" | "EN";

const LANG_NAMES: Record<Lang, string> = {
  EN: "English",
  ML: "Malayalam",
  TA: "Tamil",
};

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY as string;

// Cache translated strings to avoid redundant API calls
const cache: Record<string, string> = {};

/**
 * Uses Gemini API (Google AI Studio key) to translate an array of texts
 * in a single request. Returns translated strings in the same order.
 */
async function translateBatchViaGemini(
  texts: string[],
  targetLang: Lang
): Promise<string[]> {
  if (!texts.length) return texts;
  if (targetLang === "EN") return texts;

  if (!API_KEY) {
    console.warn("VITE_GOOGLE_TRANSLATE_API_KEY is not set in your .env file.");
    return texts;
  }

  const langName = LANG_NAMES[targetLang];
  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join("\n");

  const prompt = `Translate the following numbered UI strings to ${langName}. 
Return ONLY the translations in the same numbered format. Do not add any explanation or extra text.
Keep numbers, emojis, currency symbols (₹), and proper nouns as-is.

${numbered}`;

  // Retry up to 3 times with exponential backoff for quota errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Use gemini-1.5-flash-8b — highest free-tier quota (1500 req/day, 15 RPM)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1 },
          }),
        }
      );

      if (res.status === 429) {
        // Rate limited — wait and retry
        const waitMs = (attempt + 1) * 3000;
        console.warn(`Rate limited. Retrying in ${waitMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (!res.ok) {
        const err = await res.json();
        console.error("Gemini API error:", err);
        return texts;
      }

      const json = await res.json();
      const raw: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // Parse "1. translated text" lines
      const lines = raw.split("\n").filter((l: string) => l.trim());
      const translated: string[] = texts.map((original, i) => {
        const match = lines.find((l: string) =>
          l.match(new RegExp(`^${i + 1}[.):]`))
        );
        if (match) {
          return match.replace(new RegExp(`^${i + 1}[.):.]\\s*`), "").trim();
        }
        return original;
      });

      return translated;
    } catch (err) {
      if (attempt === 2) {
        console.error("Translation failed after 3 attempts:", err);
        return texts;
      }
      await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
    }
  }

  return texts;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LanguageContextValue {
  language: Lang;
  setLanguage: (lang: Lang) => Promise<void>;
  t: (text: string) => string;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "EN",
  setLanguage: async () => {},
  t: (text) => text,
  translateBatch: async (texts) => texts,
  isTranslating: false,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>("EN");
  const [isTranslating, setIsTranslating] = useState(false);
  // Bump this counter to force re-renders after cache is warmed
  const [cacheVersion, setCacheVersion] = useState(0);

  /** Synchronous lookup — returns cached translation or original */
  const t = useCallback(
    (text: string): string => {
      if (language === "EN") return text;
      const cacheKey = `${language}::${text}`;
      return cache[cacheKey] ?? text;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, cacheVersion]
  );

  /** Translate a batch of strings for the current language, warm the cache, trigger re-render */
  const translateBatch = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (language === "EN") return texts;

      // Split into texts that need translation vs already cached
      const uncached = texts.filter((txt) => !cache[`${language}::${txt}`]);

      if (uncached.length > 0) {
        const results = await translateBatchViaGemini(uncached, language);
        // Store results in cache
        uncached.forEach((original, i) => {
          cache[`${language}::${original}`] = results[i] ?? original;
        });
        // Trigger re-render so t() picks up new values
        setCacheVersion((v) => v + 1);
      }

      return texts.map((txt) => cache[`${language}::${txt}`] ?? txt);
    },
    [language]
  );

  const setLanguage = useCallback(async (lang: Lang) => {
    setIsTranslating(true);
    setLanguageState(lang);
    await new Promise((r) => setTimeout(r, 30));
    setIsTranslating(false);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, translateBatch, isTranslating }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
