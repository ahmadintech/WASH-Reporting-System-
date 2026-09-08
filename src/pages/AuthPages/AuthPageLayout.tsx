import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-6 sm:p-10 md:p-14 py-12 md:py-16 bg-[#F3F4EF] dark:bg-gray-950 relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-clay-500/10 blur-3xl pointer-events-none"></div>

      {/* Top spacer to balance vertical alignment */}
      <div className="w-full"></div>

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
