import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Mic, Camera, Leaf, CloudRain, DollarSign, FileText, ChevronRight, ArrowUpRight, Sprout, BarChart2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";

export function Home() {
  const navigate = useNavigate();
  const { t, language, translateBatch } = useLanguage();

  // Pre-warm translation cache for all strings on this page whenever language changes
  useEffect(() => {
    const allTexts = [
      "Good morning, Rajan 👋",
      "📍 Valapad Village, Thrissur, Kerala",
      "Weather looks good today — ideal for irrigation. Your rice crop needs attention based on yesterday's query.",
      "Ask your farming question in any language...",
      "Quick Actions",
      "Crop Advice", "Get expert recommendations",
      "Weather", "7-day farm forecast",
      "Market Prices", "Live commodity rates",
      "Gov Schemes", "AIMS Kerala portal",
      "Diagnose Crop", "AI disease detection",
      "Yield Tracker", "Monitor harvest data",
      "My Crop Prices", "View all",
      "Rice", "Coconut", "Banana",
      "Recent Queries", "View all",
      "What pesticide should I use for tomato leaf curl?",
      "When is the best time to harvest rice?",
      "Current price of coconut in Thrissur market",
      "How to control whitefly in tomato plants?",
      "2 hours ago", "Yesterday", "2 days ago", "March 28",
      "Crop", "Harvest", "Market", "Pest Control",
      "Queries This Month", "+8 this week",
      "Crops Monitored", "Rice, Coconut, Banana",
      "Active Consultations", "In review",
      "Market Alerts", "+3 new today",
    ];
    translateBatch(allTexts);
  }, [language, translateBatch]);

  const quickActions = [
    { icon: Leaf, label: "Crop Advice", desc: "Get expert recommendations", color: "bg-green-50 text-green-700 border-green-100", path: "/app/chat", external: false },
    { icon: CloudRain, label: "Weather", desc: "7-day farm forecast", color: "bg-blue-50 text-blue-700 border-blue-100", path: "/app/chat", external: false },
    { icon: DollarSign, label: "Market Prices", desc: "Live commodity rates", color: "bg-amber-50 text-amber-700 border-amber-100", path: "/app/market-prices", external: false },
    { icon: FileText, label: "Gov Schemes", desc: "AIMS Kerala portal", color: "bg-purple-50 text-purple-700 border-purple-100", path: "https://www.aims.kerala.gov.in/", external: true },
    { icon: Camera, label: "Diagnose Crop", desc: "AI disease detection", color: "bg-rose-50 text-rose-700 border-rose-100", path: "/app/image-diagnosis", external: false },
    { icon: BarChart2, label: "Yield Tracker", desc: "Monitor harvest data", color: "bg-teal-50 text-teal-700 border-teal-100", path: "/app/history", external: false },
  ];

  const recentQueries = [
    { question: "What pesticide should I use for tomato leaf curl?", time: "2 hours ago", category: "Crop", categoryColor: "bg-green-100 text-green-700" },
    { question: "When is the best time to harvest rice?", time: "Yesterday", category: "Harvest", categoryColor: "bg-amber-100 text-amber-700" },
    { question: "Current price of coconut in Thrissur market", time: "2 days ago", category: "Market", categoryColor: "bg-blue-100 text-blue-700" },
    { question: "How to control whitefly in tomato plants?", time: "March 28", category: "Pest Control", categoryColor: "bg-red-100 text-red-700" },
  ];

  const stats = [
    { label: "Queries This Month", value: "24", icon: "💬", change: "+8 this week" },
    { label: "Crops Monitored", value: "3", icon: "🌾", change: "Rice, Coconut, Banana" },
    { label: "Active Consultations", value: "1", icon: "👨‍⚕️", change: "In review" },
    { label: "Market Alerts", value: "5", icon: "📈", change: "+3 new today" },
  ];

  const marketHighlights = [
    { name: "Rice", price: "₹2,100", change: +5.2 },
    { name: "Coconut", price: "₹35", change: -2.1 },
    { name: "Banana", price: "₹18", change: -1.5 },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-[var(--farmgpt-primary-green)] to-[#1B4332] rounded-3xl p-8 mb-8 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 flex items-center justify-end pr-8">
          <Sprout size={120} className="text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              👨‍🌾
            </div>
            <div>
              <h2 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{t("Good morning, Rajan 👋")}</h2>
              <p className="text-white/70" style={{ fontSize: "0.875rem" }}>{t("📍 Valapad Village, Thrissur, Kerala")}</p>
            </div>
          </div>
          <p className="text-white/80 mb-6" style={{ fontSize: "0.9rem", maxWidth: 480 }}>
            {t("Weather looks good today — ideal for irrigation. Your rice crop needs attention based on yesterday's query.")}
          </p>

          {/* Ask Box */}
          <div
            onClick={() => navigate("/app/chat")}
            className="flex items-center gap-3 bg-white rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all max-w-xl"
          >
            <div className="flex-1">
              <input
                type="text"
                placeholder={t("Ask your farming question in any language...")}
                className="w-full bg-transparent outline-none text-[var(--farmgpt-text-secondary)]"
                style={{ fontSize: "0.9rem" }}
                readOnly
              />
            </div>
            <button className="p-2 bg-[var(--farmgpt-surface-green)] rounded-full">
              <Mic size={18} className="text-[var(--farmgpt-primary-green)]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate("/app/image-diagnosis"); }}
              className="p-2 bg-[var(--farmgpt-surface-green)] rounded-full"
            >
              <Camera size={18} className="text-[var(--farmgpt-primary-green)]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className="px-2 py-0.5 bg-[var(--farmgpt-surface-green)] rounded-full"
                style={{ fontSize: "0.7rem", color: "var(--farmgpt-primary-green)" }}
              >
                {t(stat.change)}
              </span>
            </div>
            <p className="text-[var(--farmgpt-text-primary)] mb-1" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>
              {stat.value}
            </p>
            <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>
              {t(stat.label)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              {t("Quick Actions")}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.07, duration: 0.3 }}
                  onClick={() => {
                    if (action.external) {
                      window.open(action.path, "_blank", "noopener,noreferrer");
                    } else {
                      navigate(action.path);
                    }
                  }}
                  className={`flex flex-col items-start p-5 rounded-2xl border text-left hover:shadow-md transition-all group ${action.color}`}
                >
                  <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{t(action.label)}</p>
                  <p className="opacity-70 mt-0.5" style={{ fontSize: "0.75rem" }}>{t(action.desc)}</p>
                  {action.external && (
                    <span className="mt-2 text-xs opacity-60 flex items-center gap-1">
                      <ArrowUpRight size={11} /> kerala.gov.in
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Market + Recent */}
        <div className="space-y-6">
          {/* Market Highlights */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                {t("My Crop Prices")}
              </h3>
              <button
                onClick={() => navigate("/app/market-prices")}
                className="flex items-center gap-1 text-[var(--farmgpt-primary-green)]"
                style={{ fontSize: "0.8rem" }}
              >
                {t("View all")} <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {marketHighlights.map((crop, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.875rem" }}>{t(crop.name)}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--farmgpt-text-primary)" }}>
                      {crop.price}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "0.75rem",
                        background: crop.change > 0 ? "#dcfce7" : "#fee2e2",
                        color: crop.change > 0 ? "#15803d" : "#dc2626",
                      }}
                    >
                      {crop.change > 0 ? "+" : ""}{crop.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Queries */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                {t("Recent Queries")}
              </h3>
              <button
                onClick={() => navigate("/app/history")}
                className="text-[var(--farmgpt-primary-green)]"
                style={{ fontSize: "0.8rem" }}
              >
                {t("View all")}
              </button>
            </div>
            <div className="space-y-3">
              {recentQueries.map((query, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate("/app/chat")}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--farmgpt-page-bg)] cursor-pointer transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--farmgpt-text-primary)] truncate" style={{ fontSize: "0.8rem" }}>
                      {t(query.question)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full ${query.categoryColor}`} style={{ fontSize: "0.65rem" }}>
                        {t(query.category)}
                      </span>
                      <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.7rem" }}>
                        {t(query.time)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--farmgpt-text-secondary)] shrink-0 group-hover:text-[var(--farmgpt-primary-green)] transition-colors mt-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
