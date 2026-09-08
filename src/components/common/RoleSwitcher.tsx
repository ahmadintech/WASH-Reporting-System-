import React, { useState, useRef, useEffect } from "react";
import { useAuth, PRESET_USERS } from "../../context/AuthContext";
import { UserRole } from "../../types/wash";

export const RoleSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentUser, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles: { role: UserRole; label: string; badgeColor: string; desc: string }[] = [
    {
      role: "admin",
      label: "Admin",
      badgeColor: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
      desc: "Full system administration, validate & delete reports, manage sector settings",
    },
    {
      role: "coordinator",
      label: "Coordinator",
      badgeColor: "bg-brand-100 text-brand-700 border-brand-200 dark:bg-brand-900/40 dark:text-brand-300",
      desc: "State & LGA coordination, validate partner reports, access full coverage analytics",
    },
    {
      role: "partner",
      label: "Partner",
      badgeColor: "bg-clay-100 text-clay-700 border-clay-200 dark:bg-clay-900/40 dark:text-clay-300",
      desc: "Submit monthly 5W reports, track own submissions, view response data",
    },
  ];

  const currentBadge = roles.find((r) => r.role === currentUser.role)?.badgeColor || "bg-brand-100 text-brand-700";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all shadow-sm ${
          compact ? "py-1 px-2.5 text-[11px]" : "py-1.5 px-3"
        } ${currentBadge} border-current/20 hover:opacity-90`}
        title="Click to switch user role (Admin, Coordinator, Partner)"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse"></span>
        <span className="capitalize">Role: {currentUser.role}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 z-99999 dark:border-gray-700 dark:bg-gray-800">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/60 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Switch Active Role
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">
              {currentUser.name} ({currentUser.roleTitle})
            </p>
          </div>

          <div className="space-y-1">
            {roles.map((item) => {
              const isSelected = currentUser.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full flex flex-col items-start p-2.5 rounded-lg text-left transition-all ${
                    isSelected
                      ? "bg-brand-50/80 border border-brand-200 dark:bg-brand-900/30 dark:border-brand-700/50"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-bold text-gray-800 dark:text-white capitalize flex items-center gap-1.5">
                      {item.label}
                      {isSelected && (
                        <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded font-medium">
                          Active
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {PRESET_USERS[item.role].organization.slice(0, 20)}...
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 px-2 py-1 text-center">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              Role permissions are enforced across all views
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
