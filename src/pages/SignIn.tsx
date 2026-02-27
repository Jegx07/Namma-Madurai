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

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
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

          <div className="relative rounded-xl border border-[#aecda4] bg-[#f8faf8] p-8 shadow-2xl">

            {/* Inner bottom decorative elements */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 overflow-hidden rounded-b-xl opacity-10">
              <svg className="absolute -left-4 bottom-0 h-32" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                <path d="M20 100 V40 M30 100 V60 M10 100 V80" stroke="#1d4d29" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>

            <div className="relative z-10 text-center mb-6">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0f2416]">
                Vaanga
              </h1>
              <p className="mt-1 text-sm text-[#465d4b]">
                Sign in to continue to your dashboard
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#f1f1f1] to-[#dcdcdc] border border-[#cfcfcf] py-2.5 font-medium text-[#444] shadow-inner transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#d8e4da]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#f8faf8] px-2 text-[#7f9885]">
                    or continue with email
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-200">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-[#2d4432]">Email</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#7dbb8c] bg-[#eef5ef] px-4 py-2 text-[#1a2e1d] placeholder:text-[#8ea995] focus:border-[#4d865c] focus:outline-none focus:ring-2 focus:ring-[#86d499]/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-[#2d4432]">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-[#21813e] hover:underline"
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
                      className="w-full rounded-lg border border-[#7dbb8c] bg-[#eef5ef] pl-4 pr-16 py-2 text-[#1a2e1d] placeholder:text-[#8ea995] focus:border-[#4d865c] focus:outline-none focus:ring-2 focus:ring-[#86d499]/50"
                    />
                    <div className="absolute right-3 flex items-center gap-2 text-[#7f9885]">
                      <Lock className="h-4 w-4" />
                      <EyeOff className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative mt-2 flex w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#4a6b51] via-[#334d38] to-[#203324] px-4 py-2.5 font-semibold text-white shadow-[0_4px_10px_rgba(40,64,45,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ring-1 ring-[#5c8a66] ring-offset-1 ring-offset-[#f8faf8]"
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

              <div className="mt-4 text-center text-sm text-[#465d4b]">
                Don't have an account?{" "}
                <Link to="/select-role?mode=signup" className="relative font-medium text-[#21813e]">
                  Create one
                  {/* Subtle glowing shadow for text */}
                  <span className="absolute inset-0 blur-sm bg-[#86d499]/30 -z-10 rounded"></span>
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
