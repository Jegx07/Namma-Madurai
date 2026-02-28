import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  LayoutDashboard,
  FileText,
  Trash2,
  BarChart3,
  Users,
  Thermometer,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

const adminNavItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "All Reports", path: "/admin/reports", icon: FileText },
  { label: "Smart Bin Monitor", path: "/admin/bins", icon: Trash2 },
  { label: "Area Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Assign Workers", path: "/admin/workers", icon: Users },
  { label: "Heatmap Intelligence", path: "/admin/heatmap", icon: Thermometer },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else if (user?.role !== "admin") {
      navigate("/select-role");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - darker admin theme */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-black/60 backdrop-blur-xl shadow-[4px_0_30px_rgba(0,0,0,0.5)] transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4 bg-black/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <img src="/2.png" alt="Logo" className="h-8 w-8 object-contain drop-shadow-md" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-widest uppercase text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">NAMMA MADURAI</span>
              <p className="text-[10px] text-primary tracking-[0.2em] font-mono">ADMIN.SYS</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-slate-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-mono tracking-wide transition-all ${isActive
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>

          {/* Admin section */}
          <div className="border-t border-white/10 p-4 bg-black/20">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border border-primary/30 shadow-[0_0_10px_rgba(74,222,128,0.2)] text-sm font-bold text-primary">
                {user?.avatar || "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || "Admin"}
                </p>
                <p className="truncate text-xs text-slate-400">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col bg-transparent relative">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-black/40 px-4 lg:hidden backdrop-blur-md">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-slate-300">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-sm">
              <img src="/2.png" alt="Logo" className="h-6 w-6 object-contain drop-shadow-sm" />
            </div>
            <span className="font-bold tracking-widest text-sm uppercase text-white shadow-sm">NAMMA MADURAI</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-transparent relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
