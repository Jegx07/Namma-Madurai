import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Smart Map", path: "/map" },
  { label: "Report Issue", path: "/report" },
  { label: "Clean Score", path: "/dashboard" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Admin", path: "/admin" },
  { label: "Architecture", path: "/architecture" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <img src="/2.png" alt="NAMMA MADURAI Logo" className="h-8 w-8 object-contain drop-shadow-md" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">NAMMA MADURAI</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                className="text-sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t bg-background p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
