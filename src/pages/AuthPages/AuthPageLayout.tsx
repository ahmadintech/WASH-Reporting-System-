import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-6 sm:p-10 md:p-14 py-8 md:py-12 bg-[#F3F4EF] dark:bg-gray-950 relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-clay-500/10 blur-3xl pointer-events-none"></div>

      {/* Top back arrow button */}
      <div className="w-full max-w-md mx-auto flex items-center justify-start relative z-20 mb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-brand-700 dark:text-gray-300 dark:hover:text-brand-400 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:bg-white dark:hover:bg-gray-900 transition-all group cursor-pointer"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-2xl relative z-10 my-auto">
        {children}
      </div>

      {/* Footer at the bottom */}
      <footer className="relative z-10 mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-widest uppercase bg-white/80 dark:bg-gray-900/80 text-brand-800 dark:text-brand-300 border border-gray-200/80 dark:border-gray-800 shadow-xs backdrop-blur-xs">
          <span>Borno · Adamawa · Yobe</span>
        </div>
      </footer>

      <div className="fixed z-50 bottom-4 right-4">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
