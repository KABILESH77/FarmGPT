import { useNavigate, useLocation } from "react-router";
import { Home, MessageCircle, Camera, TrendingUp, Phone, History, User, Leaf, ChevronRight } from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/app/home" },
  { icon: MessageCircle, label: "AI Chat", path: "/app/chat" },
  { icon: Camera, label: "Crop Diagnosis", path: "/app/image-diagnosis" },
  { icon: TrendingUp, label: "Market Prices", path: "/app/market-prices" },
  { icon: Phone, label: "Expert Help", path: "/app/agri-officer" },
  { icon: History, label: "History", path: "/app/history" },
  { icon: User, label: "Profile", path: "/app/profile" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-[var(--farmgpt-primary-green)] flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--farmgpt-accent-amber)] rounded-xl flex items-center justify-center">
            <Leaf size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.2 }}>
              FarmGPT
            </h1>
            <p className="text-white/60" style={{ fontSize: "0.7rem" }}>AI Agriculture Advisory</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === "/app/home" && location.pathname === "/app");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[var(--farmgpt-accent-amber)]" : ""} />
              <span style={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <ChevronRight size={16} className="ml-auto text-white/50" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        className="p-4 border-t border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => navigate("/app/profile")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            👨‍🌾
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Rajan Kumar</p>
            <p className="text-white/60 truncate" style={{ fontSize: "0.75rem" }}>Thrissur, Kerala</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
