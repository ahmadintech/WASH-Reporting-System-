import React from "react";
import { Link } from "react-router";

interface WashLogoProps {
  className?: string;
  showText?: boolean;
  isLink?: boolean;
  size?: "sm" | "md" | "lg";
}

export const WashLogo: React.FC<WashLogoProps> = ({
  className = "",
  showText = true,
  isLink = true,
  size = "md",
}) => {
  const heightClass = {
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
  }[size];

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/images/logo/wash-logo.png"
        alt="WASH Sector Nigeria Logo"
        className={`${heightClass} w-auto object-contain rounded drop-shadow-sm`}
        onError={(e) => {
          // fallback if absolute path differs
          (e.target as HTMLImageElement).src = "./images/logo/wash-logo.png";
        }}
      />
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-bold tracking-tight text-brand-700 dark:text-brand-100 text-sm md:text-base leading-tight">
            WASH Sector
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-clay-600 dark:text-clay-400">
            North East Nigeria
          </span>
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};
