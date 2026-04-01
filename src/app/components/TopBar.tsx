import { useLocation } from "react-router";
import { Bell, Search, Loader2 } from "lucide-react";
import { useLanguage, Lang } from "../context/LanguageContext";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/app/home": { title: "Dashboard", subtitle: "Your farming overview" },
  "/app": { title: "Dashboard", subtitle: "Your farming overview" },
  "/app/chat": { title: "AI Chat", subtitle: "Ask your farming questions" },
  "/app/image-diagnosis": { title: "Crop Diagnosis", subtitle: "Identify diseases from photos" },
  "/app/market-prices": { title: "Market Prices", subtitle: "Live commodity prices" },
  "/app/agri-officer": { title: "Expert Consultation", subtitle: "Connect with agri officers" },
  "/app/history": { title: "Query History", subtitle: "Your past consultations" },
  "/app/profile": { title: "Profile & Settings", subtitle: "Manage your account" },
};

export function TopBar() {
  const location = useLocation();
  const { language, setLanguage, t, translateBatch, isTranslating } = useLanguage();

  const raw = pageTitles[location.pathname] ?? { title: "FarmGPT", subtitle: "" };

  /** When user clicks a language button, pre-warm the cache for all page titles */
  const handleLanguageChange = async (lang: Lang) => {
    await setLanguage(lang);
    // Pre-translate all page labels so they're instant after the first switch
    const allTexts = Object.values(pageTitles).flatMap((p) => [p.title, p.subtitle]);
    await translateBatch(allTexts);
    // Force re-render by toggling language again (cache is now warm)
    await setLanguage(lang);
  };

  return (
    <header className="h-16 bg-white border-b border-[var(--border)] flex items-center px-6 gap-4 shrink-0 shadow-sm z-10">
      {/* Page Title */}
      <div className="flex-1">
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, lineHeight: 1.2, color: "var(--farmgpt-text-primary)" }}>
          {t(raw.title)}
        </h2>
        <p style={{ fontSize: "0.75rem", color: "var(--farmgpt-text-secondary)", lineHeight: 1 }}>
          {t(raw.subtitle)}
        </p>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={16} className="absolute left-3 text-[var(--farmgpt-text-secondary)]" />
        <input
          type="text"
          placeholder={t("Search queries...")}
          className="pl-9 pr-4 py-2 bg-[var(--farmgpt-surface-green)] rounded-full outline-none text-[var(--farmgpt-text-primary)] placeholder:text-[var(--farmgpt-text-secondary)]"
          style={{ fontSize: "0.875rem", width: 220 }}
        />
      </div>

      {/* Language Toggle */}
      <div className="flex items-center bg-[var(--farmgpt-surface-green)] rounded-full p-1 gap-0.5">
        {(["ML", "TA", "EN"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={isTranslating}
            className={`px-3 py-1 rounded-full transition-all`}
            style={{
              fontSize: "0.8rem",
              fontWeight: language === lang ? 600 : 400,
              background: language === lang ? "var(--farmgpt-primary-green)" : "transparent",
              color: language === lang ? "white" : "var(--farmgpt-text-secondary)",
            }}
          >
            {lang}
          </button>
        ))}
        {isTranslating && (
          <Loader2 size={14} className="animate-spin text-[var(--farmgpt-primary-green)] ml-1" />
        )}
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-full hover:bg-[var(--farmgpt-surface-green)] transition-colors">
        <Bell size={20} className="text-[var(--farmgpt-text-secondary)]" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--farmgpt-accent-amber)] rounded-full" />
      </button>

      {/* Location Tag */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[var(--farmgpt-surface-green)] rounded-full">
        <span style={{ fontSize: "0.75rem", color: "var(--farmgpt-primary-green)", fontWeight: 500 }}>
          📍 {t("Thrissur, Kerala")}
        </span>
      </div>
    </header>
  );
}
