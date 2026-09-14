import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { WashLogo } from "../components/common/WashLogo";
import Footer from "../components/footer/Footer";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "5W Reporting", path: "/submit-report" },
  ];

  const isCurrent = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F5] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Top Brand Bar & Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 shadow-md backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
            : "bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3">
            {/* Brand Title */}
            <Link to="/" className="flex items-center gap-3.5 group shrink-0 text-decoration-none">
              <div className="transition-transform group-hover:scale-105">
                <WashLogo size="md" showText={false} />
              </div>
              <div className="border-l border-gray-200 dark:border-gray-700 pl-3.5 hidden sm:block">
                <h1 className="text-sm sm:text-base font-bold text-teal-950 dark:text-white leading-tight font-serif tracking-tight">
                  North East Nigeria Response
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono mt-0.5">
                  5W Activity Reporting Platform · <span className="text-gray-500 dark:text-gray-400">BAY States</span>
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Tabs: Home, Dashboard, 5W Reporting */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 bg-gray-100/90 dark:bg-gray-800/90 rounded-xl border border-gray-200/60 dark:border-gray-700">
              {navItems.map((item) => {
                const active = isCurrent(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      active
                        ? "bg-teal-800 text-white shadow-xs"
                        : "text-gray-700 dark:text-gray-300 hover:text-teal-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Access Bar / Authentication Action */}
            <div className="flex items-center gap-2.5">
              {isAuthenticated && (currentUser?.role === "admin" || currentUser?.role === "coordinator") ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex flex-col items-end text-right">
                    <span className="text-xs font-bold text-teal-950 dark:text-white">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 uppercase font-semibold">
                      {currentUser.role === "admin" ? "Sector Admin" : "State Coordinator"}
                    </span>
                  </div>
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Admin Console</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-teal-700/40 text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Admin sign in</span>
                </Link>
              )}

              {/* Mobile hamburger menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle Navigation"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
              {navItems.map((item) => {
                const active = isCurrent(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      active
                        ? "bg-teal-800 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-lg text-sm font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 mt-2"
                >
                  Go to Coordinator / Admin Dashboard →
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Public Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
