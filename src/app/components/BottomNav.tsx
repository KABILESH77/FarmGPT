import { Home, MessageCircle, History, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: History, label: "History", path: "/history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--farmgpt-card-bg)] border-t border-[var(--border)] z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
            >
              <Icon
                size={24}
                className={
                  isActive
                    ? "text-[var(--farmgpt-primary-green)] mb-1"
                    : "text-[var(--farmgpt-text-secondary)] mb-1"
                }
              />
              <span
                className={`text-xs ${
                  isActive
                    ? "text-[var(--farmgpt-primary-green)] font-medium"
                    : "text-[var(--farmgpt-text-secondary)]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
