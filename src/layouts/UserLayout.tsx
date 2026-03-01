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
  GraduationCap,
  Building2,
  Award,
  Shield,
  ChevronDown,
  TrendingUp,
  ArrowLeftRight,
  Activity,
  Zap,
  Sparkles
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

const youthNavItems = [
  { label: "Registration", path: "/user/youth/registration", icon: Building2 },
  { label: "Dashboard", path: "/user/youth/dashboard", icon: LayoutDashboard },
  { label: "City Leaderboard", path: "/user/youth/leaderboard", icon: Trophy },
  { label: "Awards", path: "/user/youth/awards", icon: Award },
  { label: "Admin Oversight", path: "/user/youth/admin", icon: Shield },
];

const criNavItems = [
  { label: "CRI Overview", path: "/user/cri/overview", icon: Activity },
  { label: "Ward Rankings", path: "/user/cri/rankings", icon: Trophy },
  { label: "Trend Analytics", path: "/user/cri/trends", icon: TrendingUp },
  { label: "Ward Comparison", path: "/user/cri/compare", icon: ArrowLeftRight },
];

const cppeNavItems = [
  { label: "Performance Board", path: "/user/cppe/performance", icon: BarChart3 },
  { label: "Movement Tracker", path: "/user/cppe/movement", icon: TrendingUp },
  { label: "Weekly Highlights", path: "/user/cppe/highlights", icon: Sparkles },
  { label: "Momentum Map", path: "/user/cppe/momentum-map", icon: Map },
];

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [youthOpen, setYouthOpen] = useState(location.pathname.includes('/youth'));
  const [criOpen, setCriOpen] = useState(location.pathname.includes('/cri'));
  const [cppeOpen, setCppeOpen] = useState(location.pathname.includes('/cppe'));

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
    <div className="flex min-h-screen bg-[#000000] text-white font-['Inter',sans-serif]">
      {/* Sidebar overlay (visible on all breakpoints when open) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Hover activation zone for sidebar */}
      <div
        className="fixed inset-y-0 left-0 w-6 z-40 hidden sm:block cursor-e-resize"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      {/* Sidebar (hidden by default, open on toggle or hover) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[rgba(26,242,193,0.12)] bg-[#0A1210] transition-transform duration-300 ease-in-out shadow-2xl sm:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-[rgba(26,242,193,0.1)] px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(26,242,193,0.08)] backdrop-blur-md shadow-sm">
              <img src="/2.png" alt="Logo" className="h-7 w-7 object-contain drop-shadow-sm" />
            </div>
            <span className="text-lg font-bold text-[#E8F0ED] tracking-tight">NAMMA MADURAI</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-[rgba(232,240,237,0.4)] hover:text-[#1AF2C1] hover:bg-[rgba(26,242,193,0.08)] rounded-full h-8 w-8"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <nav className="space-y-1.5">
              {userNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive
                      ? "bg-[rgba(26,242,193,0.1)] text-[#1AF2C1]"
                      : "text-[rgba(232,240,237,0.5)] hover:bg-[rgba(26,242,193,0.05)] hover:text-[#E8F0ED]"
                    }`
                  }
                >
                  <item.icon className={`h-5 w-5 ${location.pathname === item.path || (item.end && location.pathname === '/user') ? 'text-[#1AF2C1]' : 'text-[rgba(232,240,237,0.3)]'}`} />
                  {item.label}
                </NavLink>
              ))}

              {/* Youth Program Section */}
              <div className="pt-3 mt-3 border-t border-[rgba(26,242,193,0.08)]">
                <button
                  onClick={() => setYouthOpen(!youthOpen)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${location.pathname.includes('/youth')
                      ? 'bg-[rgba(26,242,193,0.1)] text-[#1AF2C1]'
                      : 'text-[rgba(232,240,237,0.5)] hover:bg-[rgba(26,242,193,0.05)] hover:text-[#E8F0ED]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className={`h-5 w-5 ${location.pathname.includes('/youth') ? 'text-[#1AF2C1]' : 'text-[rgba(232,240,237,0.3)]'}`} />
                    Youth Program
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${youthOpen ? 'rotate-180' : ''}`} />
                </button>
                {youthOpen && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    {youthNavItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive
                            ? 'bg-[rgba(26,242,193,0.1)] text-[#1AF2C1]'
                            : 'text-[rgba(232,240,237,0.4)] hover:bg-[rgba(26,242,193,0.05)] hover:text-[#E8F0ED]'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Civic Reputation Section */}
              <div className="pt-3 mt-3 border-t border-gray-100">
                <button
                  onClick={() => setCriOpen(!criOpen)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${location.pathname.includes('/cri')
                      ? 'bg-[rgba(26,242,193,0.1)] text-[#1AF2C1]'
                      : 'text-[rgba(232,240,237,0.5)] hover:bg-[rgba(26,242,193,0.05)] hover:text-[#E8F0ED]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity className={`h-5 w-5 ${location.pathname.includes('/cri') ? 'text-[#1AF2C1]' : 'text-[rgba(232,240,237,0.3)]'}`} />
                    Civic Reputation
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${criOpen ? 'rotate-180' : ''}`} />
                </button>
                {criOpen && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    {criNavItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Civic Momentum (CPPE) Section */}
              <div className="pt-3 mt-3 border-t border-gray-100">
                <button
                  onClick={() => setCppeOpen(!cppeOpen)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${location.pathname.includes('/cppe')
                      ? 'bg-[rgba(26,242,193,0.1)] text-[#1AF2C1]'
                      : 'text-[rgba(232,240,237,0.5)] hover:bg-[rgba(26,242,193,0.05)] hover:text-[#E8F0ED]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Zap className={`h-5 w-5 ${location.pathname.includes('/cppe') ? 'text-[#1AF2C1]' : 'text-[rgba(232,240,237,0.3)]'}`} />
                    Civic Momentum
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${cppeOpen ? 'rotate-180' : ''}`} />
                </button>
                {cppeOpen && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    {cppeNavItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* User section */}
          <div className="border-t border-[rgba(26,242,193,0.08)] p-5 bg-[rgba(10,18,16,0.5)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(26,242,193,0.1)] text-sm font-bold text-[#1AF2C1] border border-[rgba(26,242,193,0.2)]">
                {user?.avatar || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-[#E8F0ED]">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs font-medium text-[rgba(232,240,237,0.4)]">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10 rounded-xl bg-[rgba(26,242,193,0.05)] border-[rgba(26,242,193,0.12)] text-[rgba(232,240,237,0.6)] hover:bg-[rgba(26,242,193,0.1)] hover:text-[#1AF2C1] shadow-sm font-medium"
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[rgba(26,242,193,0.1)] bg-[#0A1210]/95 backdrop-blur-lg px-4 lg:px-6 shadow-lg" style={{ boxShadow: '0 4px 30px -10px rgba(0,0,0,0.5)' }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(26,242,193,0.08)] backdrop-blur-md shadow-sm">
                <img src="/2.png" alt="Logo" className="h-7 w-7 object-contain drop-shadow-sm" />
              </div>
              <span className="font-bold text-[#E8F0ED] tracking-tight text-lg">NAMMA MADURAI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-[#E8F0ED] leading-none mb-1">{user?.name || "User"}</span>
              <span className="text-xs font-semibold text-[#1AF2C1] uppercase tracking-wider">{user?.role === 'citizen' ? 'Citizen' : ''}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(26,242,193,0.1)] border border-[rgba(26,242,193,0.2)] text-sm font-bold text-[#1AF2C1] shadow-sm cursor-pointer hover:bg-[rgba(26,242,193,0.2)] transition-colors">
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
