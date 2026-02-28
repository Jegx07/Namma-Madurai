import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, BarChart3, Trash2, Sparkles } from "lucide-react";
import { ScrollHero } from "@/components/ScrollHero";

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-white/10 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/20">
              <img src="/2.png" alt="Logo" className="h-full w-full object-contain p-0.5" />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">NAMMA MADURAI</span>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-4">
            <Link to="/select-role?mode=signin">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">
                Sign In
              </Button>
            </Link>
            <Link to="/select-role?mode=signup">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border-0 transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Cinematic Scroll Hero Section */}
      <ScrollHero />

      {/* Features Preview Section */}
      <section className="relative overflow-hidden bg-[#050505] py-24 text-white">
        {/* Subtle Background Elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,80,60,0.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="container relative z-10">
          <div className="mb-16 flex flex-col items-center justify-center text-center">
            <h2 className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm">
              <Sparkles className="h-4 w-4" /> Platform Capabilities
            </h2>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl">
              Next-Gen Civic <span className="text-transparent border-b-2 border-emerald-500 bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Intelligence</span>
            </h3>
            <p className="mt-6 max-w-[600px] text-zinc-400 md:text-lg">
              Empowering citizens and authorities with state-of-the-art tools to build a smarter, cleaner city ecosystem.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-20">
            {[
              {
                icon: MapPin,
                title: "Smart Civic Map",
                desc: "Interactive 3D map interface to accurately locate and manage public utilities across the city.",
                color: "from-blue-500/20 to-blue-500/0",
                iconColor: "text-blue-400",
                glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
                borderColor: "group-hover:border-blue-500/40"
              },
              {
                icon: FileText,
                title: "AI Waste Reporting",
                desc: "Instant issue reporting with automated AI-powered waste classification and intelligent routing.",
                color: "from-emerald-500/20 to-emerald-500/0",
                iconColor: "text-emerald-400",
                glowColor: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
                borderColor: "group-hover:border-emerald-500/40"
              },
              {
                icon: BarChart3,
                title: "Clean Score Dashboard",
                desc: "Track area-wise cleanliness with real-time analytics, heatmaps, and predictive AI insights.",
                color: "from-purple-500/20 to-purple-500/0",
                iconColor: "text-purple-400",
                glowColor: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
                borderColor: "group-hover:border-purple-500/40"
              },
              {
                icon: Trash2,
                title: "Smart Bin Monitoring",
                desc: "IoT-enabled civic bins equipped with real-time fill level sensors and predictive dispatching.",
                color: "from-orange-500/20 to-orange-500/0",
                iconColor: "text-orange-400",
                glowColor: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
                borderColor: "group-hover:border-orange-500/40"
              },
            ].map(({ icon: Icon, title, desc, color, iconColor, borderColor, glowColor }) => (
              <div
                key={title}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] ${borderColor} ${glowColor}`}
              >
                {/* Internal Glow on Hover */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-2xl pointer-events-none`} />
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-100 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:border-white/20">
                    <Icon className={`h-7 w-7 ${iconColor} drop-shadow-[0_0_10px_currentColor]`} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-white/90">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 h-[1px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="container relative z-10 flex flex-col items-center gap-6 py-12 text-center text-sm text-zinc-500 md:flex-row md:justify-between">
          <p>© 2026 NAMMA MADURAI – Smart Civic Intelligence Platform</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/architecture" className="hover:text-emerald-400 transition-colors">
              Architecture
            </Link>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Powered by Google Cloud
            </span>
            <span className="hover:text-zinc-300 transition-colors cursor-default">Smart City Initiative</span>
            <span className="hover:text-zinc-300 transition-colors cursor-default">Hackathon Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
