import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, MessageCircle, Mic, Camera, MessageSquare, TrendingUp, Shield, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export function Onboarding() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Ask in Your Language",
      description: "Chat in Malayalam, Tamil, or English. Voice and text supported.",
      color: "bg-green-50 text-green-700",
      iconBg: "bg-green-100",
    },
    {
      icon: Camera,
      title: "Crop Disease Diagnosis",
      description: "Upload a photo of your crop and get instant AI-powered disease analysis.",
      color: "bg-amber-50 text-amber-700",
      iconBg: "bg-amber-100",
    },
    {
      icon: TrendingUp,
      title: "Live Market Prices",
      description: "Real-time commodity prices from local mandis across Kerala and Tamil Nadu.",
      color: "bg-blue-50 text-blue-700",
      iconBg: "bg-blue-100",
    },
    {
      icon: Shield,
      title: "Expert Escalation",
      description: "Get connected with Krishibhavan officers when AI needs human expertise.",
      color: "bg-purple-50 text-purple-700",
      iconBg: "bg-purple-100",
    },
  ];

  const languages = [
    { code: "ml", name: "മലയാളം", label: "Malayalam", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", label: "Tamil", flag: "🇮🇳" },
    { code: "en", name: "English", label: "English", flag: "🇬🇧" },
  ];

  const stats = [
    { value: "2.4L+", label: "Farmers" },
    { value: "98%", label: "Accuracy" },
    { value: "3", label: "Languages" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-[var(--farmgpt-page-bg)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--farmgpt-primary-green)] rounded-xl flex items-center justify-center">
              <Leaf size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--farmgpt-primary-green)" }}>
              FarmGPT
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden md:block text-[var(--farmgpt-text-secondary)] hover:text-[var(--farmgpt-primary-green)] transition-colors" style={{ fontSize: "0.9rem" }}>
              Features
            </a>
            <a href="#languages" className="hidden md:block text-[var(--farmgpt-text-secondary)] hover:text-[var(--farmgpt-primary-green)] transition-colors" style={{ fontSize: "0.9rem" }}>
              Languages
            </a>
            <button
              onClick={() => navigate("/app/home")}
              className="px-5 py-2 bg-[var(--farmgpt-primary-green)] text-white rounded-full hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.9rem" }}
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen bg-gradient-to-br from-[var(--farmgpt-primary-green)] via-[#1B4332] to-[#081C15] flex items-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--farmgpt-accent-amber)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--farmgpt-light-green)]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--farmgpt-accent-amber)]/20 text-[var(--farmgpt-accent-amber)] rounded-full mb-6" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  🌾 AI-Powered Farming Assistant
                </span>
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-white mb-4"
                style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.15 }}
              >
                Your Digital
                <br />
                <span style={{ color: "var(--farmgpt-accent-amber)" }}>Farming Expert</span>
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-white/70 mb-6"
                style={{ fontSize: "1.125rem", lineHeight: 1.7 }}
              >
                Get expert crop advice, diagnose plant diseases, track market prices, and connect with
                Krishibhavan officers — all in your own language.
              </motion.p>

              {/* Malayalam tagline */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-white/50 mb-8"
                style={{ fontSize: "1rem" }}
              >
                നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി ഉദ്യോഗസ്ഥൻ
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate("/app/home")}
                  className="px-8 py-4 bg-[var(--farmgpt-accent-amber)] text-white rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-amber-900/30"
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/app/chat")}
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-all"
                  style={{ fontSize: "1rem" }}
                >
                  Try the Chat →
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex gap-8 mt-12"
              >
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</p>
                    <p className="text-white/50" style={{ fontSize: "0.75rem" }}>{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: App Preview Cards */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="hidden lg:flex flex-col gap-4"
            >
              {/* Chat preview */}
              <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[var(--farmgpt-accent-amber)] rounded-full flex items-center justify-center">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <span className="text-white/80" style={{ fontSize: "0.9rem" }}>AI Response</span>
                </div>
                <p className="text-white/90" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                  "For rice during vegetative stage, apply Urea at 50-60 kg/hectare split into two doses at 20-25 days and 40-45 days after transplanting..."
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 rounded-full">
                  <CheckCircle size={12} className="text-green-400" />
                  <span className="text-green-300" style={{ fontSize: "0.75rem" }}>High confidence</span>
                </div>
              </div>

              {/* Disease detection */}
              <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl">
                    🌿
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Tomato Leaf Curl Virus</p>
                    <p className="text-white/60" style={{ fontSize: "0.8rem" }}>Detected with 87% confidence</p>
                    <div className="flex gap-2 mt-2">
                      <div className="h-2 bg-[var(--farmgpt-accent-amber)] rounded-full" style={{ width: "87%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price card */}
              <div className="grid grid-cols-2 gap-3">
                {[{ name: "Rice", price: "₹2,100", change: "+5.2%" }, { name: "Coconut", price: "₹35", change: "-2.1%" }].map((crop) => (
                  <div key={crop.name} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                    <p className="text-white/60" style={{ fontSize: "0.75rem" }}>{crop.name}</p>
                    <p className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{crop.price}</p>
                    <p className={`${crop.change.startsWith("+") ? "text-green-400" : "text-red-400"}`} style={{ fontSize: "0.8rem" }}>{crop.change}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-[var(--farmgpt-text-primary)] mb-4" style={{ fontSize: "2.25rem", fontWeight: 800 }}>
              Everything a Farmer Needs
            </h2>
            <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "1.125rem" }}>
              Powered by AI, designed for simplicity
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-[var(--farmgpt-page-bg)] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className={feature.color.split(" ")[1]} />
                  </div>
                  <h3 className="text-[var(--farmgpt-text-primary)] mb-2" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    {feature.title}
                  </h3>
                  <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section id="languages" className="py-24 bg-[var(--farmgpt-page-bg)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[var(--farmgpt-text-primary)] mb-4" style={{ fontSize: "2.25rem", fontWeight: 800 }}>
              Choose Your Language
            </h2>
            <p className="text-[var(--farmgpt-text-secondary)] mb-12" style={{ fontSize: "1.125rem" }}>
              FarmGPT speaks your language
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-[var(--farmgpt-primary-green)] text-white shadow-xl shadow-green-900/20 scale-105"
                    : "bg-white text-[var(--farmgpt-text-primary)] shadow-md hover:shadow-lg"
                }`}
              >
                <span className="text-4xl">{lang.flag}</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{lang.name}</span>
                <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>{lang.label}</span>
                {selectedLanguage === lang.code && (
                  <CheckCircle size={20} className="text-[var(--farmgpt-accent-amber)]" />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            onClick={() => navigate("/app/home")}
            disabled={!selectedLanguage}
            className={`px-12 py-4 rounded-full transition-all ${
              selectedLanguage
                ? "bg-[var(--farmgpt-accent-amber)] text-white hover:opacity-90 shadow-lg shadow-amber-500/30"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            Continue to App →
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--farmgpt-primary-green)] text-white/70 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-[var(--farmgpt-accent-amber)]" />
            <span className="text-white" style={{ fontWeight: 600 }}>FarmGPT</span>
            <span style={{ fontSize: "0.8rem" }}>v1.2.0</span>
          </div>
          <p style={{ fontSize: "0.8rem" }}>Powered by AI for Indian Farmers · Kerala & Tamil Nadu</p>
        </div>
      </footer>
    </div>
  );
}
