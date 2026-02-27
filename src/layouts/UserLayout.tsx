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
  MoreVertical
} from "lucide-react";
import { useState, useEffect } from "react";
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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar overlay (visible on all breakpoints when open) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (hidden by default, open on toggle) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-sidebar transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">Namma Madurai</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {userNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {user?.avatar || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Universal header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/20 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-semibold tracking-wide">Namma Madurai</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="ml-1 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium leading-none">{user?.name || "User"}</span>
              <span className="text-xs text-muted-foreground">{user?.role === 'citizen' ? 'Citizen' : ''}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
              {user?.avatar || "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-hidden ${isMapPage ? 'px-0' : 'overflow-y-auto px-4 lg:px-8 py-4 sm:py-8'}`}>
          <Outlet />
        </main>
      </div>

      {/* Chat Assistant */}
      {!isMapPage && <ChatAssistant />}
    </div>
  );
};

export default UserLayout;
