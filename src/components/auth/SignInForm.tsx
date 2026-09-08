import React, { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email);
      setLoading(false);
      navigate("/");
    }, 400);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12 md:p-14 backdrop-blur-sm">
      {/* Centered Brand Logo */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="p-3.5 rounded-2xl bg-[#F0F7F7] dark:bg-gray-800/80 border border-[#C9E1DF] dark:border-gray-700 shadow-sm">
          <img
            src="/images/logo/wash-logo.png"
            alt="WASH Sector Nigeria"
            className="h-16 md:h-18 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "./images/logo/wash-logo.png";
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
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

      {/* Form Fields with increased height */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organisation.org"
            className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-11 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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

        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember me</span>
          </label>
          <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline cursor-pointer">
            Forgot password?
          </span>
        </div>

        {/* Green Login Button matching the WASH logo green */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-4 rounded-xl bg-[#3F7D4E] hover:bg-[#346941] active:bg-[#2B5635] text-white font-bold py-3 px-5 text-sm sm:text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
}
