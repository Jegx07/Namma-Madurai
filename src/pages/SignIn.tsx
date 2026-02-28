import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Loader2, Lock, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword, selectRole, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get the pre-selected role from sessionStorage
  const pendingRole = sessionStorage.getItem("pending_role") as "citizen" | "admin" | null;

  const navigateAfterAuth = () => {
    if (pendingRole) {
      selectRole(pendingRole);
      sessionStorage.removeItem("pending_role");
      navigate(pendingRole === "admin" ? "/admin" : "/user");
    } else {
      // Fallback if no role was selected (direct access to /signin)
      navigate("/select-role?mode=signin");
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError(err.message || "Failed to send reset email.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      navigateAfterAuth();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigateAfterAuth();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 font-sans selection:bg-green-700"
      style={{ background: 'linear-gradient(135deg, #0a0f0d 0%, #0d1a14 25%, #111f18 50%, #0a1610 75%, #080e0b 100%)' }}
    >

      {/* ═══ Animated Radial Glow Orbs ═══ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
        <div className="absolute top-[50%] left-[60%] h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
      </div>

      {/* ═══ Neon Circuit Lines ═══ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <svg className="absolute top-0 left-0 w-full h-full opacity-40" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Green diagonal lines */}
          <path d="M-50,200 L200,200 L230,170 L400,170 L430,200 L600,200 L630,170 L800,170 L830,200 L1000,200 L1030,170 L1250,170"
            stroke="#22c55e" strokeWidth="1.5" filter="url(#glow-green)" strokeLinejoin="round" />
          <circle cx="230" cy="170" r="3" fill="#22c55e" filter="url(#glow-green)" />
          <circle cx="630" cy="170" r="3" fill="#22c55e" filter="url(#glow-green)" />
          <circle cx="1030" cy="170" r="3" fill="#22c55e" filter="url(#glow-green)" />

          {/* Blue diagonal lines */}
          <path d="M-50,600 L150,600 L180,570 L350,570 L380,540 L550,540 L580,570 L750,570 L780,600 L950,600 L980,570 L1250,570"
            stroke="#06b6d4" strokeWidth="1.5" filter="url(#glow-blue)" strokeLinejoin="round" />
          <circle cx="380" cy="540" r="3" fill="#06b6d4" filter="url(#glow-blue)" />
          <circle cx="780" cy="600" r="3" fill="#06b6d4" filter="url(#glow-blue)" />

          {/* Green circuit - top right diagonal */}
          <path d="M800,0 L750,50 L750,120 L700,170 L700,250 L650,300"
            stroke="#22c55e" strokeWidth="1" opacity="0.6" filter="url(#glow-green)" strokeLinejoin="round" />
          <circle cx="750" cy="120" r="2.5" fill="#22c55e" opacity="0.6" />
          <circle cx="700" cy="250" r="2.5" fill="#22c55e" opacity="0.6" />

          {/* Blue circuit - left diagonal */}
          <path d="M0,400 L80,400 L110,370 L200,370 L230,340 L300,340"
            stroke="#06b6d4" strokeWidth="1" opacity="0.5" filter="url(#glow-blue)" strokeLinejoin="round" />
          <circle cx="230" cy="340" r="2.5" fill="#06b6d4" opacity="0.5" />

          {/* Green circuit - bottom left */}
          <path d="M100,800 L150,750 L150,680 L200,630 L300,630"
            stroke="#22c55e" strokeWidth="1" opacity="0.4" filter="url(#glow-green)" strokeLinejoin="round" />

          {/* Blue circuit - top */}
          <path d="M400,0 L400,60 L450,110 L450,180"
            stroke="#06b6d4" strokeWidth="1" opacity="0.4" filter="url(#glow-blue)" strokeLinejoin="round" />
          <circle cx="450" cy="110" r="2" fill="#06b6d4" opacity="0.4" />
        </svg>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* ═══ Meenakshi Amman Temple - White Line Art ═══ */}
        <svg className="absolute bottom-4 right-6 h-48 w-36 opacity-20" viewBox="0 0 140 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base platform */}
          <rect x="5" y="250" width="130" height="25" rx="2" stroke="white" strokeWidth="1" />
          <line x1="5" y1="260" x2="135" y2="260" stroke="white" strokeWidth="0.5" opacity="0.5" />

          {/* First tier */}
          <rect x="15" y="220" width="110" height="30" rx="1" stroke="white" strokeWidth="1" />
          <line x1="35" y1="220" x2="35" y2="250" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <line x1="70" y1="220" x2="70" y2="250" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <line x1="105" y1="220" x2="105" y2="250" stroke="white" strokeWidth="0.5" opacity="0.5" />

          {/* Second tier */}
          <rect x="25" y="190" width="90" height="30" rx="1" stroke="white" strokeWidth="1" />
          <rect x="40" y="195" width="15" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="62" y="195" width="15" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="84" y="195" width="15" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />

          {/* Third tier */}
          <rect x="32" y="160" width="76" height="30" rx="1" stroke="white" strokeWidth="1" />
          <path d="M45 165 L50 160 L55 165" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M65 165 L70 160 L75 165" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M85 165 L90 160 L95 165" stroke="white" strokeWidth="0.5" fill="none" />

          {/* Fourth tier */}
          <rect x="40" y="130" width="60" height="30" rx="1" stroke="white" strokeWidth="1" />
          <rect x="52" y="135" width="8" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="65" y="135" width="8" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="78" y="135" width="8" height="20" rx="1" stroke="white" strokeWidth="0.5" opacity="0.6" />

          {/* Fifth tier */}
          <rect x="48" y="100" width="44" height="30" rx="1" stroke="white" strokeWidth="1" />
          <path d="M55 105 L58 100 L61 105" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M72 105 L75 100 L78 105" stroke="white" strokeWidth="0.5" fill="none" />

          {/* Sixth tier */}
          <rect x="54" y="75" width="32" height="25" rx="1" stroke="white" strokeWidth="1" />

          {/* Gopuram crown */}
          <path d="M58 75 L70 40 L82 75" stroke="white" strokeWidth="1" fill="none" />
          <path d="M62 55 L70 42 L78 55" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />

          {/* Kalasam (top finial) */}
          <path d="M67 40 L70 25 L73 40" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="70" cy="22" r="3" stroke="white" strokeWidth="0.8" fill="none" />
          <line x1="70" y1="19" x2="70" y2="15" stroke="white" strokeWidth="0.8" />
          <path d="M68 15 L70 10 L72 15" stroke="white" strokeWidth="0.5" fill="none" />

          {/* Side pillars */}
          <line x1="20" y1="220" x2="20" y2="250" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="120" y1="220" x2="120" y2="250" stroke="white" strokeWidth="1.5" opacity="0.7" />

          {/* Decorative dots */}
          <circle cx="30" cy="235" r="1" fill="white" opacity="0.4" />
          <circle cx="110" cy="235" r="1" fill="white" opacity="0.4" />
          <circle cx="70" cy="235" r="1" fill="white" opacity="0.4" />
        </svg>

        {/* Small star accents */}
        <svg className="absolute top-[15%] right-[12%] opacity-30" width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#22c55e" />
        </svg>
        <svg className="absolute bottom-[25%] left-[8%] opacity-20" width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#06b6d4" />
        </svg>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">

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

        {/* ═══ Glassmorphism Login Card ═══ */}
        <div className="relative w-full">
          {/* Outer glow */}
          <div className="absolute -inset-[1px] rounded-2xl opacity-50 blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.4), rgba(6,182,212,0.2), rgba(34,197,94,0.3))' }} />

          <div className="relative rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >

            <div className="text-center mb-7">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
                Vaanga🙏🏻
              </h1>
              <p className="mt-1.5 text-sm text-white/50">
                Sign in to continue to your dashboard
              </p>
            </div>

            <div className="space-y-4">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white/80 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 text-white/30" style={{ background: 'transparent' }}>
                    or continue with email
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-xl p-3 text-sm text-red-300"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl p-3 text-sm text-emerald-300"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-white/60">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none transition-shadow"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(34,197,94,0.5)'; e.target.style.boxShadow = '0 0 15px rgba(34,197,94,0.15), inset 0 1px 2px rgba(0,0,0,0.2)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(34,197,94,0.2)'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.2)'; }}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-white/60">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl pl-4 pr-16 py-2.5 text-white placeholder:text-white/25 focus:outline-none transition-shadow"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(34,197,94,0.5)'; e.target.style.boxShadow = '0 0 15px rgba(34,197,94,0.15), inset 0 1px 2px rgba(0,0,0,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(34,197,94,0.2)'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.2)'; }}
                    />
                    <div className="absolute right-3 flex items-center gap-2 text-white/25">
                      <Lock className="h-4 w-4" />
                      <EyeOff className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative mt-3 flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #166534 0%, #14532d 50%, #1a3a2a 100%)',
                    boxShadow: '0 0 20px rgba(34,197,94,0.2), 0 4px 15px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-sm text-white/40">
                Don't have an account?{" "}
                <Link to="/select-role?mode=signup" className="font-medium text-emerald-400/80 hover:text-emerald-400 transition-colors">
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
