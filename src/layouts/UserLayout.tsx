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
    <div className="flex min-h-screen bg-[#f3f4f6] text-slate-800 font-sans">
      {/* Sidebar overlay (visible on all breakpoints when open) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (hidden by default, open on toggle) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out shadow-2xl sm:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Namma Madurai</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full h-8 w-8"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-5">
            <nav className="space-y-1.5">
              {userNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className={`h-5 w-5 ${location.pathname === item.path || (item.end && location.pathname === '/user') ? 'text-emerald-600' : 'text-gray-400'}`} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-gray-100 p-5 bg-gray-50/50">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 border border-emerald-200/50">
                {user?.avatar || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs font-medium text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10 rounded-xl bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm font-medium"
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-bold text-gray-900 tracking-tight text-lg">Namma Madurai</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="ml-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name || "User"}</span>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{user?.role === 'citizen' ? 'Citizen' : ''}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200/50 text-sm font-bold text-emerald-700 shadow-sm cursor-pointer hover:bg-emerald-200 transition-colors">
              {user?.avatar || "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-hidden ${isMapPage ? 'px-0' : 'overflow-y-auto'}`}>
          <Outlet />
        </main>
      </div>

      {/* Chat Assistant */}
      {!isMapPage && <ChatAssistant />}
    </div>
  );
};

export default UserLayout;
