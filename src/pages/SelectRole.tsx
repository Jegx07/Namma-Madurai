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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#f7f8f6] p-4 text-[#1a2e1d] font-sans selection:bg-green-200">

      {/* Background Circuit/Line Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left lines */}
        <svg className="absolute top-1/3 -left-8 h-64 opacity-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 L50,100 L70,80 L120,80 L140,60 L200,60" stroke="#2c4d32" strokeWidth="2" strokeLinejoin="round" />
          <path d="M0,120 L40,120 L60,100 L110,100 L130,80 L200,80" stroke="#2c4d32" strokeWidth="1" strokeLinejoin="round" />
          <circle cx="200" cy="60" r="3" fill="#2c4d32" />
          <circle cx="200" cy="80" r="2" fill="#2c4d32" />
        </svg>
        {/* Right lines */}
        <svg className="absolute top-1/4 -right-8 h-48 opacity-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <path d="M0,100 L50,100 L70,80 L120,80 L140,60 L200,60" stroke="#2c4d32" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="200" cy="60" r="3" fill="#2c4d32" />
        </svg>
        {/* Bottom Left decorative */}
        <svg className="absolute bottom-10 left-10 h-32 opacity-10" viewBox="0 0 100 100" fill="none">
          <path d="M50 100 V30 M30 100 V50 M70 100 V60 M10 100 V80 M90 100 V70" stroke="#2c4d32" strokeWidth="1" />
          <path d="M40 30 L50 20 L60 30 Z" fill="#2c4d32" />
        </svg>
        {/* Bottom Right decorative (Temple) */}
        <svg className="absolute bottom-4 right-8 h-24 opacity-20" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="80" width="60" height="20" stroke="#b28c40" strokeWidth="1" />
          <rect x="30" y="60" width="40" height="20" stroke="#b28c40" strokeWidth="1" />
          <rect x="40" y="40" width="20" height="20" stroke="#b28c40" strokeWidth="1" />
          <path d="M45 40 L50 30 L55 40 Z" fill="#b28c40" />
          <path d="M35 80 V100" stroke="#b28c40" strokeWidth="1" />
          <path d="M65 80 V100" stroke="#b28c40" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        {/* Top Banner Button */}
        <div className="mb-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#44654b] via-[#334d38] to-[#273d2b] px-12 py-3 shadow-[0_10px_20px_-5px_rgba(39,61,43,0.5)] ring-1 ring-[#5c8a66] ring-offset-2 ring-offset-[#f7f8f6]">
            {/* Subtle light sweep */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_10%,rgba(255,255,255,0.1)_20%,transparent_30%)]"></div>
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full bg-[#1b2f21] p-1 border border-[#64906d]">
                <MapPin className="h-4 w-4 text-[#89eaa0]" />
              </div>
              <span className="font-semibold tracking-wide text-white">Namma Madurai</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative w-full">
          {/* Glowing Green Border Background */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-[#80d096] to-[#519f66] opacity-60 mix-blend-multiply blur-[2px]"></div>

          <div className="relative rounded-xl border border-[#aecda4] bg-[#f8faf8] p-8 shadow-2xl sm:p-12">

            {/* Inner bottom decorative elements */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 overflow-hidden rounded-b-xl opacity-10">
              <svg className="absolute -left-4 bottom-0 h-32" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                <path d="M20 100 V40 M30 100 V60 M10 100 V80" stroke="#1d4d29" strokeWidth="2" opacity="0.5" />
              </svg>
              <svg className="absolute -right-4 bottom-0 h-32" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                <rect x="60" y="70" width="30" height="30" stroke="#b89341" strokeWidth="1" />
                <rect x="70" y="50" width="10" height="20" stroke="#b89341" strokeWidth="1" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0f2416] sm:text-4xl">
                How will you use the platform?
              </h1>
              <p className="mt-2 text-[#465d4b]">
                Select your role to continue to {mode === "signup" ? "create your account" : "sign in"}.
              </p>
            </div>

            <div className="relative z-10 mt-10 grid gap-6 sm:grid-cols-2">
              {/* Citizen Card */}
              <button
                onClick={() => handleRoleSelect("citizen")}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#86d499] hover:shadow-xl hover:shadow-[#6ec083]/20"
              >
                {/* Circuit background overlay */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5">
                  <svg width="100%" height="100%">
                    <path d="M0,20 L30,20 L40,30 L100,30" fill="none" stroke="#000" strokeWidth="1" />
                  </svg>
                </div>

                <div className="relative mb-6">
                  {/* Green glowing orb */}
                  <div className="absolute inset-0 scale-150 rounded-full bg-green-400/20 blur-xl transition-all duration-300 group-hover:bg-green-400/30"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5">
                    <User className="h-7 w-7 text-[#21813e]" />
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-[#14301d]">Citizen</h3>
                <p className="mb-6 h-12 text-sm leading-relaxed text-[#59765e]">
                  Report issues, explore the map, track cleanliness scores
                </p>

                <div className="flex items-center gap-1 font-semibold text-[#278643] transition-colors group-hover:text-[#185e2e]">
                  Continue as Citizen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => handleRoleSelect("admin")}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#dbba65] hover:shadow-xl hover:shadow-[#c49f3e]/20"
              >
                {/* Circuit background overlay */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5">
                  <svg width="100%" height="100%" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M0,20 L30,20 L40,30 L100,30" fill="none" stroke="#000" strokeWidth="1" />
                  </svg>
                </div>

                <div className="relative mb-6">
                  {/* Gold glowing orb */}
                  <div className="absolute inset-0 scale-150 rounded-full bg-amber-400/20 blur-xl transition-all duration-300 group-hover:bg-amber-400/30"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f8df93] to-[#c49830] shadow-md ring-1 ring-black/5">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-[#86661e]">Administrator</h3>
                <p className="mb-6 h-12 text-sm leading-relaxed text-[#7f6c44]">
                  Manage reports, monitor bins, assign workers, view analytics
                </p>

                <div className="flex items-center gap-1 font-semibold text-[#aa842a] transition-colors group-hover:text-[#785b18]">
                  Continue as Admin
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-[#59765e]">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          </span>
          {mode === "signup" ? (
            <Link
              to="/select-role?mode=signin"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#21813e] to-[#2fac55] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(47,172,85,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(47,172,85,0.6)]"
            >
              Sign in
            </Link>
          ) : (
            <Link
              to="/select-role?mode=signup"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#21813e] to-[#2fac55] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(47,172,85,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(47,172,85,0.6)]"
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
