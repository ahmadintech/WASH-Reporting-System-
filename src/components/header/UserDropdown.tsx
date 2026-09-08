import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleSignOut = () => {
    closeDropdown();
    logout();
    navigate("/signin");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="mr-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-xs shadow-sm">
          {currentUser.name.charAt(0)}
        </div>

        <div className="hidden text-left xl:block mr-2">
          <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
            {currentUser.name}
          </span>
          <span className="block text-[10px] font-semibold text-clay-600 dark:text-clay-400 uppercase tracking-wider">
            {currentUser.role}
          </span>
        </div>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="16"
          height="16"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 flex w-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-800 z-99999"
      >
        <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {currentUser.name}
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {currentUser.role}
            </span>
          </div>
          <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
            {currentUser.email}
          </span>
          <span className="block text-[11px] text-gray-400 mt-0.5 font-medium">
            {currentUser.organization}
          </span>
        </div>

        {/* Quick Role Switch in User Profile */}
        <div className="py-2.5 border-b border-gray-100 dark:border-gray-700">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">
            Switch Current Role:
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                switchRole("admin");
                closeDropdown();
              }}
              className={`py-1 text-[11px] font-bold rounded ${
                currentUser.role === "admin"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                switchRole("coordinator");
                closeDropdown();
              }}
              className={`py-1 text-[11px] font-bold rounded ${
                currentUser.role === "coordinator"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Coordinator
            </button>
            <button
              onClick={() => {
                switchRole("partner");
                closeDropdown();
              }}
              className={`py-1 text-[11px] font-bold rounded ${
                currentUser.role === "partner"
                  ? "bg-clay-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Partner
            </button>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 mt-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-lg transition-colors text-left"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign out of session</span>
        </button>
      </Dropdown>
    </div>
  );
}
