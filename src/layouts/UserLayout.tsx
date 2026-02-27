import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  LayoutDashboard,
  Map,
  FileText,
  BarChart3,
  Trophy,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import ChatAssistant from "@/components/ChatAssistant";
const userNavItems = [
  { label: "Dashboard", path: "/user", icon: LayoutDashboard, end: true },
  { label: "Smart Map", path: "/user/map", icon: Map },
  { label: "Report Issue", path: "/user/report", icon: FileText },
  { label: "Clean Score", path: "/user/clean-score", icon: BarChart3 },
  { label: "Leaderboard", path: "/user/leaderboard", icon: Trophy },
  { label: "AI Assistant", path: "/user/assistant", icon: MessageCircle },
  { label: "Profile", path: "/user/profile", icon: User },
];

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hide chat assistant on map page
  const isMapPage = location.pathname === "/user/map";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else if (user?.role !== "citizen") {
      navigate("/select-role");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = userNavItems.map(item => ({
    name: item.label,
    url: item.path,
    icon: item.icon
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal Header for Logo and actions */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Namma Madurai</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user?.avatar || "U"}
            </div>
            <span className="text-sm font-medium">{user?.name || "User"}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Top Navigation Bar (Tubelight) */}
      <NavBar items={navItems} />

      {/* Main content */}
      <div className={`flex flex-1 flex-col overflow-hidden ${isMapPage ? 'pt-0 pb-0 sm:pt-16 sm:pb-0' : 'pt-4 pb-24 sm:pt-20 sm:pb-8'}`}>
        <main className={`flex-1 overflow-hidden ${isMapPage ? 'px-0' : 'px-4 lg:px-8 overflow-y-auto'}`}>
          <Outlet />
        </main>
      </div>

      {/* Chat Assistant - hidden on map page */}
      {!isMapPage && <ChatAssistant />}
    </div>
  );
};

export default UserLayout;
