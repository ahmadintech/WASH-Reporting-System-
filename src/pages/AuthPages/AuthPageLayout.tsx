import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#F3F4EF] dark:bg-gray-950 relative overflow-hidden">
      {/* Subtle decorative humanitarian/WASH backdrop circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-clay-500/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>

      <div className="fixed z-50 bottom-4 right-4">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
