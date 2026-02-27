import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Minimal Header for Logo and actions */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-xl lg:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <MapPin className="h-5 w-5 text-primary drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
          </div>
          <span className="text-lg font-bold text-white tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Namma Madurai</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary shadow-[0_0_10px_rgba(74,222,128,0.2)]">
              {user?.avatar || "U"}
            </div>
            <span className="text-sm font-medium text-slate-300 font-mono tracking-wide">{user?.name || "User"}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-slate-400 hover:text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline font-mono tracking-widest text-[10px] uppercase">Logout</span>
          </Button>
        </div>
      </header>

      {/* Top Navigation Bar (Tubelight) */}
      <NavBar items={navItems} />

      {/* Main content */}
      <div className="flex flex-1 flex-col pt-4 pb-24 sm:pt-20 sm:pb-8">
        <main className="flex-1 overflow-y-auto px-4 lg:px-8">
          <Outlet />
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};

export default UserLayout;
