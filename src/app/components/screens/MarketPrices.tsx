import { useState } from "react";
import { TrendingUp, TrendingDown, Bell, Search, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const crops = [
  { name: "Rice", price: 2100, unit: "per quintal", change: 5.2, msp: "₹2,040", isMyCrop: true, emoji: "🌾" },
  { name: "Coconut", price: 35, unit: "per unit", change: -2.1, msp: "₹28", isMyCrop: true, emoji: "🥥" },
  { name: "Pepper", price: 42500, unit: "per quintal", change: 8.5, msp: "—", isMyCrop: false, emoji: "🌶️" },
  { name: "Rubber", price: 158, unit: "per kg", change: 3.2, msp: "—", isMyCrop: false, emoji: "🌳" },
  { name: "Banana", price: 18, unit: "per kg", change: -1.5, msp: "—", isMyCrop: true, emoji: "🍌" },
  { name: "Turmeric", price: 7250, unit: "per quintal", change: 12.3, msp: "₹7,000", isMyCrop: false, emoji: "🌿" },
  { name: "Ginger", price: 4800, unit: "per quintal", change: -4.2, msp: "—", isMyCrop: false, emoji: "🫚" },
  { name: "Cardamom", price: 1250, unit: "per kg", change: 2.8, msp: "—", isMyCrop: false, emoji: "🌱" },
];

const riceHistory = [
  { day: "Mon", price: 1990 }, { day: "Tue", price: 2020 }, { day: "Wed", price: 2050 },
  { day: "Thu", price: 2010 }, { day: "Fri", price: 2080 }, { day: "Sat", price: 2060 }, { day: "Sun", price: 2100 },
];

const formatPrice = (p: number) => {
  if (p >= 1000) return `₹${(p / 1000).toFixed(1)}K`;
  return `₹${p}`;
};

export function MarketPrices() {
  const [tab, setTab] = useState<"my" | "all" | "trending">("my");
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);

  const filtered = crops.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "my") return matchSearch && c.isMyCrop;
    if (tab === "trending") return matchSearch && Math.abs(c.change) >= 3;
    return matchSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="px-3 py-1 bg-[var(--farmgpt-surface-green)] text-[var(--farmgpt-primary-green)] rounded-full" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              Monday, March 30, 2026
            </span>
            <span className="px-3 py-1 bg-[var(--farmgpt-surface-green)] text-[var(--farmgpt-primary-green)] rounded-full" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              📍 Thrissur Mandi
            </span>
          </div>
          <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.875rem" }}>
            Prices updated 15 minutes ago
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--farmgpt-text-secondary)]" />
            <input
              type="text"
              placeholder="Search crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white rounded-xl border border-[var(--border)] outline-none text-[var(--farmgpt-text-primary)]"
              style={{ fontSize: "0.875rem", width: 180 }}
            />
          </div>
          <button className="p-2 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--farmgpt-primary-green)] transition-colors">
            <RefreshCw size={18} className="text-[var(--farmgpt-text-secondary)]" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--farmgpt-primary-green)] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Bell size={16} />
            <span style={{ fontSize: "0.875rem" }}>Set Alert</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Crop List */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-5 bg-white rounded-xl p-1 w-fit shadow-sm border border-[var(--border)]">
            {([["my", "My Crops"], ["all", "All Crops"], ["trending", "Trending"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-5 py-2 rounded-lg transition-all"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: tab === key ? 600 : 400,
                  background: tab === key ? "var(--farmgpt-primary-green)" : "transparent",
                  color: tab === key ? "white" : "var(--farmgpt-text-secondary)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((crop, index) => (
              <motion.div
                key={crop.name}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => setSelectedCrop(crop)}
                className={`bg-white rounded-2xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedCrop.name === crop.name ? "ring-2 ring-[var(--farmgpt-primary-green)]" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{crop.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 600 }}>
                          {crop.name}
                        </h3>
                        {crop.isMyCrop && (
                          <span className="w-2 h-2 bg-[var(--farmgpt-accent-amber)] rounded-full" />
                        )}
                      </div>
                      <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.75rem" }}>
                        {crop.unit}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full`}
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      background: crop.change > 0 ? "#dcfce7" : "#fee2e2",
                      color: crop.change > 0 ? "#15803d" : "#dc2626",
                    }}
                  >
                    {crop.change > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {Math.abs(crop.change)}%
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[var(--farmgpt-primary-green)]" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>
                      {formatPrice(crop.price)}
                    </p>
                    {crop.msp !== "—" && (
                      <p className="text-[var(--farmgpt-text-secondary)] mt-1" style={{ fontSize: "0.75rem" }}>
                        MSP: {crop.msp}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.7rem" }}>vs yesterday</p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: crop.change > 0 ? "#15803d" : "#dc2626",
                      }}
                    >
                      {crop.change > 0 ? "+" : ""}
                      {(crop.price * crop.change / 100).toFixed(0).replace("-", "")} {crop.change > 0 ? "↑" : "↓"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Price Chart */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                {selectedCrop.emoji} {selectedCrop.name} — 7 Day Trend
              </h3>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[var(--farmgpt-primary-green)]"
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                {formatPrice(selectedCrop.price)}
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: "0.75rem",
                  background: selectedCrop.change > 0 ? "#dcfce7" : "#fee2e2",
                  color: selectedCrop.change > 0 ? "#15803d" : "#dc2626",
                }}
              >
                {selectedCrop.change > 0 ? "+" : ""}{selectedCrop.change}%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={riceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  formatter={(v: number) => [`₹${v}`, "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#2D6A4F"
                  strokeWidth={2.5}
                  fill="url(#colorPrice)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#2D6A4F" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Market Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-[var(--farmgpt-text-primary)] mb-4" style={{ fontSize: "1rem", fontWeight: 700 }}>
              Market Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: "Top Gainer", value: "Turmeric", sub: "+12.3%", color: "text-green-600" },
                { label: "Top Loser", value: "Ginger", sub: "-4.2%", color: "text-red-600" },
                { label: "Highest Price", value: "Pepper", sub: "₹42.5K/qtl", color: "text-[var(--farmgpt-primary-green)]" },
                { label: "My Crops", value: "3 crops", sub: "Rice, Coconut, Banana", color: "text-amber-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>{item.label}</span>
                  <div className="text-right">
                    <p className={`${item.color}`} style={{ fontSize: "0.875rem", fontWeight: 600 }}>{item.value}</p>
                    <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.7rem" }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
