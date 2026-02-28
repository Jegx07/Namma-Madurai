import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { MapPin, User, Shield, ArrowRight } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin"; // signin or signup

  const handleRoleSelect = (role: "citizen" | "admin") => {
    // Store the selected role in sessionStorage for use after authentication
    sessionStorage.setItem("pending_role", role);

    // Navigate to sign in or sign up based on mode
    if (mode === "signup") {
      navigate("/signup");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 font-sans selection:bg-green-700"
      style={{ background: 'linear-gradient(135deg, #0a0f0d 0%, #0d1a14 25%, #111f18 50%, #0a1610 75%, #080e0b 100%)' }}
    >

      {/* ═══ Radial Glow Orbs ═══ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] left-[50%] h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
      </div>

      {/* ═══ Neon Circuit Lines ═══ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-40" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-g">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-b">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Green diagonal lines */}
          <path d="M-50,180 L200,180 L230,150 L400,150 L430,180 L600,180 L630,150 L800,150 L830,180 L1000,180 L1030,150 L1250,150"
            stroke="#22c55e" strokeWidth="1.5" filter="url(#glow-g)" strokeLinejoin="round" />
          <circle cx="230" cy="150" r="3" fill="#22c55e" filter="url(#glow-g)" />
          <circle cx="630" cy="150" r="3" fill="#22c55e" filter="url(#glow-g)" />
          <circle cx="1030" cy="150" r="3" fill="#22c55e" filter="url(#glow-g)" />

          {/* Blue diagonal lines */}
          <path d="M-50,620 L150,620 L180,590 L350,590 L380,560 L550,560 L580,590 L750,590 L780,620 L950,620 L980,590 L1250,590"
            stroke="#06b6d4" strokeWidth="1.5" filter="url(#glow-b)" strokeLinejoin="round" />
          <circle cx="380" cy="560" r="3" fill="#06b6d4" filter="url(#glow-b)" />
          <circle cx="780" cy="620" r="3" fill="#06b6d4" filter="url(#glow-b)" />

          {/* Vertical green circuit */}
          <path d="M850,0 L850,80 L800,130 L800,250 L750,300"
            stroke="#22c55e" strokeWidth="1" opacity="0.5" filter="url(#glow-g)" strokeLinejoin="round" />
          <circle cx="800" cy="130" r="2.5" fill="#22c55e" opacity="0.5" />

          {/* Left vertical blue circuit */}
          <path d="M0,350 L60,350 L90,320 L180,320 L210,290 L280,290"
            stroke="#06b6d4" strokeWidth="1" opacity="0.4" filter="url(#glow-b)" strokeLinejoin="round" />
          <circle cx="210" cy="290" r="2.5" fill="#06b6d4" opacity="0.4" />

          {/* Bottom left green circuit */}
          <path d="M120,800 L170,750 L170,680 L220,630 L320,630"
            stroke="#22c55e" strokeWidth="1" opacity="0.35" filter="url(#glow-g)" strokeLinejoin="round" />
        </svg>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* ═══ Meenakshi Amman Temple - White Line Art ═══ */}
        <svg className="absolute bottom-4 right-6 h-44 w-32 opacity-15" viewBox="0 0 140 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="250" width="130" height="25" rx="2" stroke="white" strokeWidth="1" />
          <line x1="5" y1="260" x2="135" y2="260" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <rect x="15" y="220" width="110" height="30" rx="1" stroke="white" strokeWidth="1" />
          <line x1="35" y1="220" x2="35" y2="250" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <line x1="70" y1="220" x2="70" y2="250" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <line x1="105" y1="220" x2="105" y2="250" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <rect x="25" y="190" width="90" height="30" rx="1" stroke="white" strokeWidth="1" />
          <rect x="40" y="195" width="15" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="62" y="195" width="15" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="84" y="195" width="15" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="32" y="160" width="76" height="30" rx="1" stroke="white" strokeWidth="1" />
          <rect x="40" y="130" width="60" height="30" rx="1" stroke="white" strokeWidth="1" />
          <rect x="48" y="100" width="44" height="30" rx="1" stroke="white" strokeWidth="1" />
          <rect x="54" y="75" width="32" height="25" rx="1" stroke="white" strokeWidth="1" />
          <path d="M58 75 L70 40 L82 75" stroke="white" strokeWidth="1" fill="none" />
          <path d="M67 40 L70 25 L73 40" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="70" cy="22" r="3" stroke="white" strokeWidth="0.8" fill="none" />
          <line x1="70" y1="19" x2="70" y2="15" stroke="white" strokeWidth="0.8" />
          <path d="M68 15 L70 10 L72 15" stroke="white" strokeWidth="0.5" fill="none" />
          <line x1="20" y1="220" x2="20" y2="250" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="120" y1="220" x2="120" y2="250" stroke="white" strokeWidth="1.5" opacity="0.7" />
        </svg>

        {/* Star accents */}
        <svg className="absolute top-[12%] right-[10%] opacity-25" width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#22c55e" />
        </svg>
        <svg className="absolute bottom-[20%] left-[6%] opacity-18" width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#06b6d4" />
        </svg>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">

        {/* NAMMA MADURAI Badge */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-xl px-10 py-3 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center gap-2.5">
              <img src="/2.png" alt="Logo" style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'white', padding: '2px', objectFit: 'contain' }} />
              <span className="font-semibold tracking-wider text-white/90 text-sm uppercase">NAMMA MADURAI</span>
            </div>
          </div>
        </div>

        {/* ═══ Glassmorphism Card ═══ */}
        <div className="relative w-full">
          {/* Outer glow */}
          <div className="absolute -inset-[1px] rounded-2xl opacity-40 blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.4), rgba(6,182,212,0.2), rgba(34,197,94,0.3))' }} />

          <div className="relative rounded-2xl p-8 shadow-2xl sm:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >

            <div className="text-center">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How will you use the platform?
              </h1>
              <p className="mt-2 text-white/50">
                Select your role to continue to {mode === "signup" ? "create your account" : "sign in"}.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {/* Citizen Card */}
              <button
                onClick={() => handleRoleSelect("citizen")}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <div className="relative mb-6">
                  {/* Green glowing orb */}
                  <div className="absolute inset-0 scale-150 rounded-full opacity-40 blur-xl transition-all duration-300 group-hover:opacity-60"
                    style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(34,197,94,0.4)', boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}>
                    <User className="h-7 w-7 text-emerald-400" />
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">Citizen</h3>
                <p className="mb-6 h-12 text-sm leading-relaxed text-white/40">
                  Report issues, explore the map, track cleanliness scores
                </p>

                <div className="flex items-center gap-1 font-semibold text-emerald-400/80 transition-colors group-hover:text-emerald-400">
                  Continue as Citizen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => handleRoleSelect("admin")}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(202,138,4,0.15)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(202,138,4,0.12) 0%, rgba(202,138,4,0.04) 100%)',
                  border: '1px solid rgba(202,138,4,0.2)',
                }}
              >
                <div className="relative mb-6">
                  {/* Gold glowing orb */}
                  <div className="absolute inset-0 scale-150 rounded-full opacity-40 blur-xl transition-all duration-300 group-hover:opacity-60"
                    style={{ background: 'radial-gradient(circle, #ca8a04, transparent)' }} />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
                    style={{ background: 'linear-gradient(135deg, rgba(250,204,21,0.3), rgba(202,138,4,0.4))', border: '2px solid rgba(202,138,4,0.4)', boxShadow: '0 0 20px rgba(202,138,4,0.15)' }}>
                    <Shield className="h-7 w-7 text-yellow-400" />
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">Administrator</h3>
                <p className="mb-6 h-12 text-sm leading-relaxed text-white/40">
                  Manage reports, monitor bins, assign workers, view analytics
                </p>

                <div className="flex items-center gap-1 font-semibold text-yellow-500/80 transition-colors group-hover:text-yellow-400">
                  Continue as Admin
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-white/40">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          </span>
          {mode === "signup" ? (
            <Link
              to="/select-role?mode=signin"
              className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #166534, #14532d)',
                boxShadow: '0 0 20px rgba(34,197,94,0.2)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              Sign in
            </Link>
          ) : (
            <Link
              to="/select-role?mode=signup"
              className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #166534, #14532d)',
                boxShadow: '0 0 20px rgba(34,197,94,0.2)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              Create one
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
