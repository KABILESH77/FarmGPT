import { createBrowserRouter } from "react-router";
import { Onboarding } from "./components/screens/Onboarding";
import { Home } from "./components/screens/Home";
import { Chat } from "./components/screens/Chat";
import { ImageDiagnosis } from "./components/screens/ImageDiagnosis";
import { MarketPrices } from "./components/screens/MarketPrices";
import { AgriOfficer } from "./components/screens/AgriOfficer";
import { Profile } from "./components/screens/Profile";
import { History } from "./components/screens/History";
import { WebLayout } from "./components/WebLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/app",
    Component: WebLayout,
    children: [
      { index: true, Component: Home },
      { path: "home", Component: Home },
      { path: "chat", Component: Chat },
      { path: "history", Component: History },
      { path: "profile", Component: Profile },
      { path: "image-diagnosis", Component: ImageDiagnosis },
      { path: "market-prices", Component: MarketPrices },
      { path: "agri-officer", Component: AgriOfficer },
    ],
  },
]);
