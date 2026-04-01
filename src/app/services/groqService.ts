/**
 * groqService.ts
 * Digital Krishi Officer — Groq LLM service for FarmGPT
 *
 * Uses llama3-8b-8192 via Groq's OpenAI-compatible API.
 * Maintains conversation memory and injects farmer context into system prompt.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1–12
  if (month >= 6 && month <= 11) return "Kharif season (June–November) — main paddy cultivation";
  if (month >= 11 || month <= 3) return "Rabi season (November–March) — pulses & vegetables";
  return "Summer season (April–May) — off-season crops & coconut maintenance";
}

function buildSystemPrompt(): string {
  const season = getCurrentSeason();
  const now = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return `You are FarmGPT's Digital Krishi Officer — an expert, always-available agricultural advisor serving farmers in Kerala, India.

FARMER PROFILE:
- Name: Rajan Kumar
- Location: Valapad Village, Thrissur, Kerala
- Active crops: Rice, Coconut, Banana
- Current season: ${season}
- Date: ${now}

YOUR EXPERTISE DOMAINS:
1. CROP CALENDARS: Kerala Kharif (June–Nov) & Rabi (Nov–Mar) schedules, variety selection for Thrissur district
2. PEST & DISEASE ADVISORIES: Rice blast, brown planthopper, coconut rhinoceros beetle, banana fusarium wilt; both chemical and organic control methods with dosages
3. GOVERNMENT SCHEMES: PM-KISAN, AIMS Kerala (aims.kerala.gov.in), Krishibhavan subsidies, RKVY, crop insurance
4. SOIL & IRRIGATION: Soil health management, drip/sprinkler systems, water table in Thrissur region
5. MARKET PRICES: Thrissur APMC trends, MSP for paddy, coconut market cycles
6. WEATHER ADVISORY: Southwest & Northeast monsoon patterns, drought/flood preparedness for Thrissur

RESPONSE RULES:
1. Lead with PRACTICAL, LOCALIZED advice — never generic. Mention Thrissur/Kerala context.
2. Give specific quantities: dosages in kg/acre or ml/litre, timing in "days after sowing/transplanting".
3. For pest/disease: always offer BOTH chemical (brand name + dose) AND organic alternative.
4. For govt schemes: always mention the AIMS Kerala portal (aims.kerala.gov.in) where relevant.
5. If the problem is COMPLEX, needs physical inspection, or you are unsure → append exactly: [ESCALATE] on a new line at the very end.
6. Keep responses concise (max 200 words). Use emoji bullet points: 🌱 💧 🐛 ☀️ 🌾 💰 📋
7. LANGUAGE: Respond in the SAME LANGUAGE the farmer used. If they write in Malayalam or Tamil, reply in that script.
8. CONVERSATIONAL: Remember previous messages in this session. Build on what the farmer said earlier.
9. CONFIDENCE: End each response with one line: "Confidence: High ✅" or "Confidence: Medium ⚠️" or "Confidence: Low ❓"

You bridge the gap between farmers and the formal extension system. Be warm, respectful, and farmer-first.`;
}

export async function sendGroqMessage(
  messages: ChatMessage[],
  userMessage: string
): Promise<{ content: string; escalate: boolean; confidence: "high" | "medium" | "low" }> {
  if (!GROQ_API_KEY) {
    return {
      content:
        "⚠️ Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file.\n\nGet a free key at: https://console.groq.com/keys",
      escalate: false,
      confidence: "low",
    };
  }

  const systemMsg: ChatMessage = {
    role: "system",
    content: buildSystemPrompt(),
  };

  const fullMessages: ChatMessage[] = [
    systemMsg,
    ...messages,
    { role: "user", content: userMessage },
  ];

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: fullMessages,
      temperature: 0.6,
      max_tokens: 500,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Groq API error:", err);
    throw new Error(`Groq API returned ${res.status}: ${(err as { error?: { message?: string } }).error?.message ?? "Unknown error"}`);
  }

  const json = await res.json();
  const rawContent: string = json?.choices?.[0]?.message?.content ?? "I'm sorry, I could not generate a response.";

  // Detect escalation signal
  const escalate = rawContent.includes("[ESCALATE]");
  const cleanContent = rawContent.replace("[ESCALATE]", "").trim();

  // Detect confidence level from content
  let confidence: "high" | "medium" | "low" = "high";
  const lowerContent = cleanContent.toLowerCase();
  if (lowerContent.includes("confidence: medium") || lowerContent.includes("confidence: low")) {
    confidence = lowerContent.includes("confidence: medium") ? "medium" : "low";
  }

  return { content: cleanContent, escalate, confidence };
}

/** Smart suggestion generator — returns follow-up question chips based on last AI message */
export function getSuggestions(lastAiMessage: string, cropContext = "rice"): string[] {
  const lower = lastAiMessage.toLowerCase();

  if (lower.includes("fertilizer") || lower.includes("urea") || lower.includes("dap")) {
    return ["How much water after fertilizing?", "When is next dose?", "Organic alternative?", "Show nearby shops"];
  }
  if (lower.includes("pest") || lower.includes("insect") || lower.includes("spray")) {
    return ["Safe for bees?", "Dosage for 1 acre?", "Organic option?", "When to spray?"];
  }
  if (lower.includes("disease") || lower.includes("fungal") || lower.includes("virus")) {
    return ["How to prevent spread?", "Is it contagious?", "Talk to expert", "Show treatment steps"];
  }
  if (lower.includes("harvest") || lower.includes("yield")) {
    return ["Best market to sell?", "Current price?", "Storage tips?", "Next crop to plant?"];
  }
  if (lower.includes("scheme") || lower.includes("subsidy") || lower.includes("pm-kisan")) {
    return ["How to apply?", "Documents needed?", "AIMS Kerala portal", "Eligibility criteria"];
  }

  // Default suggestions based on crop
  return [
    `${cropContext} best practices`,
    "Current market price",
    "Weather advisory",
    "Talk to expert",
  ];
}
