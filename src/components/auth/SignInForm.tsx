import React, { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useAuth, PRESET_USERS } from "../../context/AuthContext";
import { UserRole } from "../../types/wash";

export default function SignInForm() {
  const [email, setEmail] = useState("coordinator@washsector-ne.org");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("coordinator");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(PRESET_USERS[role].email);
    setPassword("wash2026!secret");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered sector email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, selectedRole);
      setLoading(false);
      navigate("/");
    }, 400);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 backdrop-blur-sm">
      {/* Centered Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="p-2.5 rounded-xl bg-[#F0F7F7] dark:bg-gray-800 border border-[#C9E1DF] dark:border-gray-700 shadow-sm mb-3.5">
          <img
            src="/images/logo/wash-logo.png"
            alt="WASH Sector Nigeria"
            className="h-14 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "./images/logo/wash-logo.png";
            }}
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-700 mb-2">
          <span>Borno · Adamawa · Yobe</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          5W Activity Reporting Platform
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
          Sign in with your authorized humanitarian sector credentials to submit or review 5W response data.
        </p>
      </div>

      {/* Quick Role Selection for Demonstration / Testing */}
      <div className="mb-5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 text-center">
          Select Role Demo Account:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleRoleSelect("admin")}
            className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
              selectedRole === "admin"
                ? "bg-red-50 text-red-700 border-red-400 dark:bg-red-950/40 dark:text-red-300 shadow-sm ring-2 ring-red-400/30"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            }`}
          >
            <div className="font-bold">Admin</div>
            <div className="text-[10px] opacity-80">Sector Lead</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("coordinator")}
            className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
              selectedRole === "coordinator"
                ? "bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-950/40 dark:text-brand-300 shadow-sm ring-2 ring-brand-400/30"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            }`}
          >
            <div className="font-bold">Coordinator</div>
            <div className="text-[10px] opacity-80">State Cluster</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("partner")}
            className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
              selectedRole === "partner"
                ? "bg-clay-50 text-clay-700 border-clay-400 dark:bg-clay-950/40 dark:text-clay-300 shadow-sm ring-2 ring-clay-400/30"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            }`}
          >
            <div className="font-bold">Partner</div>
            <div className="text-[10px] opacity-80">Implementing</div>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Sector Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="focalpoint@organisation.org"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeIcon className="size-5 fill-current" />
              ) : (
                <EyeCloseIcon className="size-5 fill-current" />
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
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember this device</span>
          </label>
          <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline cursor-pointer">
            Need access? Contact IM
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-lg bg-clay-500 hover:bg-clay-600 text-white font-semibold py-2.5 px-4 text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In to Platform →</span>
          )}
        </button>
      </form>

      {/* Security & Access Notice (No signup allowed) */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong>Restricted Platform</strong>: Account creation is managed directly by the WASH Cluster Information Management team. Self-registration is disabled.
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
          Helpdesk: <span className="text-brand-600 dark:text-brand-400">im@washsector-ne.org</span>
        </p>
      </div>
    </div>
  );
}
