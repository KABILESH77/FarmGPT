import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

// Chat uses its own internal scrolling, so main should be overflow-hidden for it
const OVERFLOW_HIDDEN_PATHS = ["/app/chat"];

export function WebLayout() {
  const location = useLocation();
  const isOverflowHidden = OVERFLOW_HIDDEN_PATHS.includes(location.pathname);

  return (
    <div className="flex h-screen bg-[var(--farmgpt-page-bg)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main
          className={`flex-1 min-h-0 ${
            isOverflowHidden ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
