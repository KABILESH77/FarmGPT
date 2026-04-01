import { useState } from "react";
import { useNavigate } from "react-router";
import { Globe, Bell, Phone, MapPin, History, MessageSquare, Star, Edit2, Camera, ChevronRight, Save } from "lucide-react";
import { motion } from "motion/react";

export function Profile() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("Rajan Kumar");

  const crops = ["Rice", "Coconut", "Banana"];

  const settingsItems = [
    { icon: Globe, label: "Language", value: "മലയാളം (Malayalam)", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Bell, label: "Notification Preferences", value: "All alerts enabled", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Phone, label: "Linked Phone", value: "+91 98765 43210", color: "text-green-600", bg: "bg-green-50" },
    { icon: MapPin, label: "Farm Location", value: "Valapad Village, Thrissur · Red soil, 2.5 acres", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: History, label: "Query History", value: "124 total queries", color: "text-indigo-600", bg: "bg-indigo-50", action: () => navigate("/app/history") },
  ];

  const stats = [
    { label: "Total Queries", value: "124", icon: "💬" },
    { label: "Crops Tracked", value: "3", icon: "🌾" },
    { label: "Consultations", value: "8", icon: "👨‍⚕️" },
    { label: "Member Since", value: "2024", icon: "📅" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Profile Info */}
        <div className="space-y-5">
          {/* Profile Card */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-[var(--farmgpt-surface-green)] rounded-full flex items-center justify-center text-5xl">
                  👨‍🌾
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--farmgpt-primary-green)] rounded-full flex items-center justify-center shadow-md">
                  <Camera size={14} className="text-white" />
                </button>
              </div>

              {editName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-[var(--farmgpt-primary-green)] rounded-lg px-3 py-1 outline-none text-center"
                    style={{ fontSize: "1.125rem", fontWeight: 700 }}
                    autoFocus
                  />
                  <button
                    onClick={() => setEditName(false)}
                    className="p-1.5 bg-[var(--farmgpt-primary-green)] rounded-lg"
                  >
                    <Save size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {name}
                  </h2>
                  <button onClick={() => setEditName(true)} className="p-1 hover:bg-[var(--farmgpt-surface-green)] rounded-lg transition-colors">
                    <Edit2 size={15} className="text-[var(--farmgpt-text-secondary)]" />
                  </button>
                </div>
              )}
              <p className="text-[var(--farmgpt-text-secondary)] flex items-center gap-1.5 mt-1" style={{ fontSize: "0.875rem" }}>
                <MapPin size={14} />
                Valapad Village, Thrissur
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {stats.map((s, i) => (
                <div key={i} className="bg-[var(--farmgpt-page-bg)] rounded-xl p-3 text-center">
                  <span className="text-xl">{s.icon}</span>
                  <p className="text-[var(--farmgpt-text-primary)] mt-1" style={{ fontSize: "1.125rem", fontWeight: 700 }}>{s.value}</p>
                  <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.7rem" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Crops */}
            <div className="bg-[var(--farmgpt-surface-green)] rounded-2xl p-4">
              <p className="text-[var(--farmgpt-text-secondary)] mb-3" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                REGISTERED CROPS
              </p>
              <div className="flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <span
                    key={crop}
                    className="px-3 py-1.5 bg-white text-[var(--farmgpt-primary-green)] rounded-full"
                    style={{ fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {crop}
                  </span>
                ))}
                <button className="px-3 py-1.5 border-2 border-dashed border-[var(--farmgpt-primary-green)] text-[var(--farmgpt-primary-green)] rounded-full"
                  style={{ fontSize: "0.875rem" }}>
                  + Add crop
                </button>
              </div>
            </div>
          </motion.div>

          {/* Feedback Card */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-[var(--farmgpt-accent-amber)]" />
              </div>
              <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                Rate FarmGPT
              </h3>
            </div>
            <p className="text-[var(--farmgpt-text-secondary)] mb-4" style={{ fontSize: "0.875rem" }}>
              How would you rate your experience?
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onMouseEnter={() => setHoveredRating(r)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(r)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      r <= (hoveredRating || rating)
                        ? "text-[var(--farmgpt-accent-amber)] fill-[var(--farmgpt-accent-amber)]"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button className="w-full py-3 bg-[var(--farmgpt-primary-green)] text-white rounded-xl hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Submit Feedback
            </button>
          </motion.div>
        </div>

        {/* Right: Settings */}
        <div className="lg:col-span-2">
          <h2 className="text-[var(--farmgpt-text-primary)] mb-6" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Settings & Preferences
          </h2>

          <div className="space-y-3 mb-8">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.07, duration: 0.3 }}
                  onClick={item.action}
                  className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={22} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      {item.label}
                    </p>
                    <p className="text-[var(--farmgpt-text-secondary)] truncate" style={{ fontSize: "0.8rem" }}>
                      {item.value}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-[var(--farmgpt-text-secondary)] shrink-0" />
                </motion.button>
              );
            })}
          </div>

          {/* About / App Info */}
          <div className="bg-[var(--farmgpt-primary-green)] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🌿</div>
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 700 }}>FarmGPT v1.2.0</p>
                <p className="text-white/70" style={{ fontSize: "0.8rem" }}>Powered by AI for Indian Farmers</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Languages", value: "3" },
                { label: "Crops Covered", value: "200+" },
                { label: "Districts", value: "14" },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                  <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</p>
                  <p className="text-white/70" style={{ fontSize: "0.7rem" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-white/60" style={{ fontSize: "0.75rem" }}>
              Kerala Agricultural University Partner · KAU Certified Data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
