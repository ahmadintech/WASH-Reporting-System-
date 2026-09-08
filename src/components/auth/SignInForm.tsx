import React, { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/wash";

export default function SignInForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@washsector-ne.org");
  const [password, setPassword] = useState("admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingRole, setLoggingRole] = useState<UserRole | null>(null);

  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (role: UserRole) => {
    setLoggingRole(role);
    setLoading(true);
    setTimeout(() => {
      loginAsRole(role);
      setLoading(false);
      navigate("/");
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, selectedRole);
      setLoading(false);
      navigate("/");
    }, 250);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 backdrop-blur-md">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="p-3 rounded-2xl bg-[#F0F7F7] dark:bg-gray-800/80 border border-[#C9E1DF] dark:border-gray-700 shadow-sm mb-3">
          <img
            src="/images/logo/wash-logo.png"
            alt="WASH Sector Nigeria"
            className="h-14 sm:h-16 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "./images/logo/wash-logo.png";
            }}
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          WASH 5W Reporting System
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
          North East Nigeria Humanitarian Response · Borno, Adamawa & Yobe States
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organisation.org"
            className="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 pr-11 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeIcon className="size-4 fill-current" />
              ) : (
                <EyeCloseIcon className="size-4 fill-current" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember session</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading && !loggingRole ? (
            <>
              <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In with Credentials</span>
          )}
        </button>

        {/* Quick Demo Access Badges under Sign In with Credentials button with padding top */}
        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Quick Demo Access
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("admin")}
              title="Sign in instantly as Sector Administrator"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 hover:shadow-xs active:scale-95 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80 dark:hover:bg-rose-900/60 disabled:opacity-50 cursor-pointer"
            >
              {loading && loggingRole === "admin" ? (
                <svg className="animate-spin h-3.5 w-3.5 text-rose-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              )}
              <span>Sector Admin</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("coordinator")}
              title="Sign in instantly as WASH Coordinator"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100 hover:border-brand-300 hover:shadow-xs active:scale-95 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800/80 dark:hover:bg-brand-900/60 disabled:opacity-50 cursor-pointer"
            >
              {loading && loggingRole === "coordinator" ? (
                <svg className="animate-spin h-3.5 w-3.5 text-brand-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              )}
              <span>WASH Coordinator</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("partner")}
              title="Sign in instantly as Implementing Partner"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-xs active:scale-95 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80 dark:hover:bg-emerald-900/60 disabled:opacity-50 cursor-pointer"
            >
              {loading && loggingRole === "partner" ? (
                <svg className="animate-spin h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
              <span>Implementing Partner</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
