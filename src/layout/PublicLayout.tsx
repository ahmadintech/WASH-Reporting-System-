import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useWashData } from "../context/WashDataContext";
import { useAuth } from "../context/AuthContext";

/* ─── Colour Palette (Identical to LandingPage) ─────────────────── */
const T = {
  tealDarkest: "#061B20",
  tealDeep:    "#0B3C46",
  teal:        "#12707E",
  tealMedium:  "#1D8A99",
  tealLight:   "#4EAAB6",
  tealSoft:    "#E4F2F1",
  tealSubtle:  "#F0F7F6",
  clay:        "#C1722F",
  clayHover:   "#A75D22",
  claySoft:    "#FDF1E6",
  sand:        "#F7F4EE",
  green:       "#2E7D47",
  greenSoft:   "#E6F4EA",
  line:        "#E1E6E2",
  lineDark:    "#D0D8D4",
  ink:         "#132327",
  inkMuted:    "#485B60",
  inkLight:    "#728489",
  white:       "#FFFFFF",
  bgSubtle:    "#F8FAFA",
};

/* ─── Standard Typography Tokens ───────────────────────────────── */
const FONT_PRIMARY = "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_MONO = "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, Arial, sans-serif";

/* ─── Official Dashboard Logo Component ─────────────────────────── */
function DashboardLogo({ size = 38, darkBg = false }: { size?: number; darkBg?: boolean }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: darkBg ? "rgba(255,255,255,0.95)" : "transparent",
      padding: darkBg ? "6px 12px" : "0",
      borderRadius: darkBg ? 10 : 0,
      boxShadow: darkBg ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    }}>
      <img
        src="/images/logo/wash-logo.png"
        alt="WASH Sector North East Nigeria Logo"
        style={{
          height: size,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "./images/logo/wash-logo.png";
        }}
      />
    </div>
  );
}

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const IcoArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IcoClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IcoMail = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IcoPhone = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IcoBarChart = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IcoXTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IcoLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const IcoYouTube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const IcoGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reportingConfig } = useWashData();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Public nav links strictly: Home, Dashboard, 5W Reporting
  const navItems = [
    { label: "Home", href: "/", icon: "fa-regular fa-compass" },
    { label: "Dashboard", href: "/coverage-dashboard", icon: "fa-solid fa-chart-pie" },
    { label: "5W Reporting", href: "/submit-report", icon: "fa-solid fa-file-pen" },
  ];

  const isCurrent = (href: string) => {
    if (href === "/") {
      return location.pathname === "/" || location.pathname === "/home" || location.pathname === "/landing";
    }
    if (href === "/coverage-dashboard") {
      return location.pathname === "/coverage-dashboard" || location.pathname === "/dashboard";
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const handleNavClick = (href: string) => {
    if (isCurrent(href) && href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  const deadline = reportingConfig?.deadlineDate
    ? new Date(reportingConfig.deadlineDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "End of Month";

  const daysLeft = reportingConfig?.deadlineDate
    ? Math.max(0, Math.ceil((new Date(reportingConfig.deadlineDate).getTime() - Date.now()) / 86_400_000))
    : null;

  const isLanding = location.pathname === "/" || location.pathname === "/home" || location.pathname === "/landing";

  return (
    <div style={{
      minHeight: "100vh",
      background: isLanding ? T.white : "#F8FAFA",
      color: T.ink,
      fontFamily: FONT_PRIMARY,
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ══════════════════════════════════════════════════════════════════
          1. TOP ANNOUNCEMENT BANNER (Full Width - Identical to Landing)
      ══════════════════════════════════════════════════════════════════ */}
      {bannerVisible && (
        <div style={{
          background: reportingConfig?.isFreezeActive
            ? "linear-gradient(90deg, #8C2B22 0%, #A8382E 100%)"
            : "linear-gradient(90deg, #0B3C46 0%, #12707E 50%, #C1722F 100%)",
          color: T.white,
          fontSize: 14,
          fontWeight: 500,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          position: "relative",
          zIndex: 101,
          boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 1360, width: "100%", margin: "0 auto", justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{
              background: "rgba(255,255,255,0.22)",
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: FONT_MONO,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {reportingConfig?.isFreezeActive ? "SYSTEM FREEZE" : "ACTIVE CYCLE"}
            </span>

            {windowWidth >= 768 && (
              reportingConfig?.isFreezeActive ? (
                <span style={{ fontSize: 14 }}>The current reporting window is paused for sector data reconciliation. Contact IM team for emergency updates.</span>
              ) : (
                <span style={{ fontSize: 14 }}>
                  <strong>{reportingConfig?.activeCycle || "2026 Cycle"}</strong> reporting is active. Next submission deadline: <strong>{deadline}</strong>
                  {daysLeft !== null && ` (${daysLeft === 0 ? "Today is the last day" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`})`}.
                </span>
              )
            )}

            {!reportingConfig?.isFreezeActive && location.pathname !== "/submit-report" && (
              <button
                onClick={() => navigate("/submit-report")}
                style={{
                  background: "rgba(255,255,255,0.25)",
                  border: "1px solid rgba(255,255,255,0.45)",
                  color: T.white,
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  marginLeft: 8,
                  fontFamily: FONT_PRIMARY,
                  transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.38)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              >
                Submit Now <IcoArrowRight size={13} />
              </button>
            )}

            <button
              onClick={() => setBannerVisible(false)}
              aria-label="Dismiss banner"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.85)",
                cursor: "pointer",
                padding: 4,
                position: "absolute",
                right: 18,
                display: "flex",
                alignItems: "center",
              }}
            >
              <IcoClose />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          2. STICKY TOP NAVBAR (Strictly Identical to Landing Page)
      ══════════════════════════════════════════════════════════════════ */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: navScrolled ? "rgba(255, 255, 255, 0.98)" : T.white,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${navScrolled ? T.line : "#E5ECE9"}`,
        boxShadow: navScrolled ? "0 4px 20px rgba(11, 60, 70, 0.07)" : "0 1px 2px rgba(0,0,0,0.02)",
        transition: "all .2s ease-in-out",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          padding: "0 clamp(12px, 2.5vw, 32px)",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          {/* Brand Logo & Context (Far Left: Compact & Professional) */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              textDecoration: "none",
              minWidth: 0,
              flexShrink: 1,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <DashboardLogo size={38} />
            </div>
            {windowWidth >= 640 && (
              <div style={{ borderLeft: `1.5px solid #D5DFDC`, paddingLeft: 10, minWidth: 0 }}>
                <div style={{
                  fontFamily: FONT_PRIMARY,
                  fontSize: "clamp(14px, 1.4vw, 16.5px)",
                  fontWeight: 700,
                  color: T.tealDeep,
                  letterSpacing: "-0.2px",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  WASH Sector North East Nigeria
                </div>
                <div style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9.5,
                  color: "#5B767C",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: 2,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  5W Activity Reporting &amp; Response Coverage Platform
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Menu (Rendered ONLY on Desktop >= 1024px) */}
          {windowWidth >= 1024 && (
            <nav style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {navItems.map((item) => {
                const active = isCurrent(item.href);
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    style={{
                      background: active ? "rgba(18, 112, 126, 0.08)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "none",
                      color: active ? T.tealDeep : "#3F565C",
                      fontSize: 14.5,
                      fontWeight: 700,
                      padding: "8px 16px",
                      borderRadius: 8,
                      transition: "all .15s ease",
                      whiteSpace: "nowrap",
                      fontFamily: FONT_PRIMARY,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = T.tealDeep;
                      e.currentTarget.style.background = "rgba(18, 112, 126, 0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = active ? T.tealDeep : "#3F565C";
                      e.currentTarget.style.background = active ? "rgba(18, 112, 126, 0.08)" : "transparent";
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Group */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

            {/* If Authenticated Staff (Admin or Coordinator) */}
            {isAuthenticated && (currentUser?.role === "admin" || currentUser?.role === "coordinator") ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: windowWidth >= 768 ? "flex" : "none", flexDirection: "column", alignItems: "flex-end", marginRight: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.tealDeep, lineHeight: 1.2 }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: FONT_MONO, color: T.clay, textTransform: "uppercase", fontWeight: 700 }}>
                    {currentUser.role === "admin" ? "Sector Admin" : "State Coordinator"}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  style={{
                    background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
                    color: T.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: FONT_PRIMARY,
                    boxShadow: "0 2px 8px rgba(11, 60, 70, 0.18)",
                    transition: "all .15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #12707E 0%, #1D8A99 100%)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(11, 60, 70, 0.28)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(11, 60, 70, 0.18)";
                  }}
                >
                  Workspace Console <IcoArrowRight size={14} />
                </button>
                <button
                  onClick={logout}
                  style={{
                    background: "transparent",
                    border: "1px solid #D5DFDC",
                    borderRadius: 8,
                    padding: "7px 12px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#5B767C",
                    cursor: "pointer",
                    fontFamily: FONT_PRIMARY,
                    transition: "all .15s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#C1722F";
                    e.currentTarget.style.borderColor = "#C1722F";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "#5B767C";
                    e.currentTarget.style.borderColor = "#D5DFDC";
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Public Actions */
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {windowWidth >= 640 && (
                  <>
                    {/* Primary Button depending on active page */}
                    {location.pathname === "/submit-report" ? (
                      <button
                        onClick={() => navigate("/coverage-dashboard")}
                        style={{
                          background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
                          color: T.white,
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontSize: 13.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: FONT_PRIMARY,
                          boxShadow: "0 2px 8px rgba(11, 60, 70, 0.18)",
                          transition: "all .15s ease",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #12707E 0%, #1D8A99 100%)";
                          e.currentTarget.style.boxShadow = "0 4px 14px rgba(11, 60, 70, 0.28)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(11, 60, 70, 0.18)";
                        }}
                      >
                        Go to Dashboard <IcoArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        id="navbar-dashboard-btn"
                        onClick={() => navigate("/coverage-dashboard")}
                        style={{
                          background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
                          color: T.white,
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontSize: 13.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: FONT_PRIMARY,
                          boxShadow: "0 2px 8px rgba(11, 60, 70, 0.18)",
                          transition: "all .15s ease",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #12707E 0%, #1D8A99 100%)";
                          e.currentTarget.style.boxShadow = "0 4px 14px rgba(11, 60, 70, 0.28)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(11, 60, 70, 0.18)";
                        }}
                      >
                        Go to Dashboard <IcoArrowRight size={14} />
                      </button>
                    )}

                    {/* Clean Sign In Button */}
                    <button
                      onClick={() => navigate("/signin")}
                      style={{
                        background: "transparent",
                        border: "1.5px solid #CFE5E2",
                        borderRadius: 8,
                        padding: "7px 14px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.tealDeep,
                        cursor: "pointer",
                        fontFamily: FONT_PRIMARY,
                        transition: "all .15s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#F0F7F6";
                        e.currentTarget.style.borderColor = T.teal;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#CFE5E2";
                      }}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Mobile/Tablet Hamburger Toggle (Rendered ONLY on Viewports < 1024px) */}
            {windowWidth < 1024 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                style={{
                  background: mobileMenuOpen ? "rgba(18, 112, 126, 0.08)" : "#F0F7F6",
                  border: "1.5px solid #CFE5E2",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: T.tealDeep,
                  fontSize: 17,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                }}
              >
                <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer (Rendered ONLY on Viewports < 1024px when opened) */}
        {windowWidth < 1024 && mobileMenuOpen && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid #E5ECE9",
              borderBottom: "2px solid #12707E",
              boxShadow: "0 16px 32px rgba(11, 60, 70, 0.14)",
              padding: "18px 20px 22px",
              boxSizing: "border-box",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {navItems.map(item => {
                const active = isCurrent(item.href);
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(item.href);
                    }}
                    style={{
                      background: active ? "rgba(18, 112, 126, 0.08)" : "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      color: active ? T.tealDeep : "#2C4044",
                      fontSize: 15.5,
                      fontWeight: 700,
                      padding: "12px 16px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      fontFamily: FONT_PRIMARY,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = T.tealDeep;
                      e.currentTarget.style.background = "rgba(18, 112, 126, 0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = active ? T.tealDeep : "#2C4044";
                      e.currentTarget.style.background = active ? "rgba(18, 112, 126, 0.08)" : "transparent";
                    }}
                  >
                    <i className={item.icon} style={{ color: T.teal, width: 22, fontSize: 16 }}></i>
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Actions in Drawer */}
            <div style={{ borderTop: "1px solid #E5ECE9", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#F0F7F6",
                border: "1px solid #CFE5E2",
                borderRadius: 20,
                padding: "5px 12px",
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 700,
                color: T.tealDeep,
                alignSelf: "flex-start",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E7D47" }} />
                BORNO · ADAMAWA · YOBE
              </div>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/admin/dashboard");
                  }}
                  style={{
                    background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
                    color: T.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 20px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    boxShadow: "0 2px 8px rgba(11, 60, 70, 0.2)",
                    fontFamily: FONT_PRIMARY,
                  }}
                >
                  Admin & Coordinator Console <IcoArrowRight size={15} />
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/coverage-dashboard");
                    }}
                    style={{
                      background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
                      color: T.white,
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 20px",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      boxShadow: "0 2px 8px rgba(11, 60, 70, 0.2)",
                      fontFamily: FONT_PRIMARY,
                    }}
                  >
                    Go to Dashboard <IcoArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/signin");
                    }}
                    style={{
                      background: "transparent",
                      border: "1.5px solid #CFE5E2",
                      borderRadius: 8,
                      padding: "10px 16px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: T.tealDeep,
                      cursor: "pointer",
                      width: "100%",
                      fontFamily: FONT_PRIMARY,
                    }}
                  >
                    Staff Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          3. MAIN CONTENT (Unified Layout Container)
      ══════════════════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: isLanding ? T.white : "#F8FAFA",
        padding: isLanding ? 0 : "28px clamp(14px, 2.5vw, 32px) 64px",
      }}>
        <div style={{
          maxWidth: isLanding ? "100%" : 1440,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}>
          <Outlet />
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          4. OFFICIAL WASH SECTOR 4-COLUMN FOOTER (Identical to Landing)
      ══════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: "#061B20",
        color: "#E4F2F1",
        padding: "64px clamp(16px, 4vw, 48px) 32px",
        fontFamily: FONT_PRIMARY,
        width: "100%",
        boxSizing: "border-box",
      }}>
        <div style={{ width: "100%", maxWidth: 1360, margin: "0 auto" }}>

          {/* Main 4-Column Footer Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: 48,
            paddingBottom: 48,
          }}>

            {/* Column 1: Brand & Sector Focus */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <DashboardLogo size={50} darkBg={true} />
                <div style={{ fontFamily: FONT_PRIMARY, fontSize: 20, fontWeight: 800, color: T.white, lineHeight: 1.25 }}>
                  WASH Sector North East Nigeria
                </div>
              </div>

              <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.7, color: "#C0D7DC", margin: "0 0 20px" }}>
                The WASH Sector coordinates humanitarian water, sanitation, and hygiene assistance across the conflict-affected states of Borno, Adamawa, and Yobe in North East Nigeria.
              </p>

              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#E2F6F3",
                padding: "4px 0",
                fontFamily: FONT_PRIMARY,
                lineHeight: 1.6,
              }}>
                <i className="fa-solid fa-location-dot" style={{ color: "#E09A52", marginRight: 10, fontSize: 16 }}></i>
                <strong style={{ color: T.white }}>Active Nodes:</strong> Maiduguri Central, Yola, Damaturu Sub-Offices.
              </div>
            </div>

            {/* Column 2: Platform Navigation */}
            <div>
              <h4 style={{
                fontFamily: FONT_PRIMARY,
                fontSize: 16.5,
                fontWeight: 700,
                color: T.white,
                margin: "0 0 22px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Platform Navigation
              </h4>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 15.5, lineHeight: 2.3 }}>
                <li>
                  <button
                    onClick={() => {
                      if (location.pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        navigate("/");
                      }
                    }}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Portal Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/submit-report")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Submit 5W Monthly Report
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/coverage-dashboard")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Response Coverage Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/coverage-dashboard")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Partner Response Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signin")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Staff & Coordinator Access
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Key Resources & Technical Guidelines */}
            <div>
              <h4 style={{
                fontFamily: FONT_PRIMARY,
                fontSize: 16.5,
                fontWeight: 700,
                color: T.white,
                margin: "0 0 22px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Key Resources &amp; TWGs
              </h4>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 15, lineHeight: 2.3 }}>
                <li style={{ color: "#A2BFC4" }}>
                  Water Quality Technical Working Group
                </li>
                <li style={{ color: "#A2BFC4" }}>
                  Sanitation &amp; Sludge Management Protocol
                </li>
                <li style={{ color: "#A2BFC4" }}>
                  Hygiene Promotion in Cholera Outbreaks
                </li>
                <li style={{ color: "#A2BFC4" }}>
                  WASH in Primary Health Facilities (PHC)
                </li>
                <li style={{ color: "#A2BFC4" }}>
                  Humanitarian Response Plan (HRP) Matrix
                </li>
              </ul>
            </div>

            {/* Column 4: Simple Contact & Helpdesk */}
            <div>
              <h4 style={{
                fontFamily: FONT_PRIMARY,
                fontSize: 16.5,
                fontWeight: 700,
                color: T.white,
                margin: "0 0 22px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Sector Helpdesk
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "#4EAAB6", marginTop: 3, flexShrink: 0 }}><IcoMail size={18} /></span>
                  <div>
                    <div style={{ fontSize: 12, fontFamily: FONT_MONO, textTransform: "uppercase", color: "#8EACB2", fontWeight: 700, letterSpacing: "0.04em" }}>
                      Cluster Secretariat Email
                    </div>
                    <a href="mailto:washcluster.nigeria@unicef.org" style={{ color: "#6FE0EE", textDecoration: "none", fontWeight: 600, fontSize: 15.5 }}>
                      washcluster.nigeria@unicef.org
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "#C1722F", marginTop: 3, flexShrink: 0 }}><IcoBarChart size={18} /></span>
                  <div>
                    <div style={{ fontSize: 12, fontFamily: FONT_MONO, textTransform: "uppercase", color: "#8EACB2", fontWeight: 700, letterSpacing: "0.04em" }}>
                      Information Management
                    </div>
                    <a href="mailto:im@washsector-ne.org" style={{ color: "#D1ECE8", textDecoration: "none", fontSize: 15 }}>
                      im@washsector-ne.org
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "#E09A52", marginTop: 3, flexShrink: 0 }}><IcoPhone size={18} /></span>
                  <div>
                    <div style={{ fontSize: 12, fontFamily: FONT_MONO, textTransform: "uppercase", color: "#8EACB2", fontWeight: 700, letterSpacing: "0.04em" }}>
                      Emergency Hotline
                    </div>
                    <a href="tel:+23480092744357" style={{ color: "#F7D8B5", fontFamily: FONT_MONO, fontWeight: 700, textDecoration: "none", fontSize: 15.5 }}>
                      +234 (0) 800-WASH-HELP
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Institutional Co-Lead & Socials Bar */}
          <div style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 28,
            paddingBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 15 }}>
              <span style={{
                fontFamily: FONT_MONO,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#4EAAB6",
                background: "rgba(78, 170, 182, 0.14)",
                padding: "4px 10px",
                borderRadius: 5,
                fontSize: 12.5,
              }}>
                Co-led by:
              </span>
              <span style={{ color: T.white, fontWeight: 600 }}>Federal Ministry of Water Resources</span>
              <span style={{ color: "#4EAAB6", opacity: 0.6 }}>·</span>
              <span style={{ color: T.white, fontWeight: 600 }}>UNICEF Nigeria</span>
              <span style={{ color: "#4EAAB6", opacity: 0.6 }}>·</span>
              <span style={{ color: T.white, fontWeight: 600 }}>UN OCHA</span>
            </div>

            {/* Social Media Links */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#8EACB2", fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                Connect:
              </span>
              {[
                { label: "Twitter / X", icon: <IcoXTwitter />, href: "https://twitter.com/UNICEFNigeria" },
                { label: "LinkedIn",   icon: <IcoLinkedIn />, href: "https://www.linkedin.com/company/unicef-nigeria" },
                { label: "YouTube",    icon: <IcoYouTube />,  href: "https://www.youtube.com/user/unicefnigeria" },
                { label: "ReliefWeb",  icon: <IcoGlobe />,    href: "https://reliefweb.int/country/nga" },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C2E8E4",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = T.clay;
                    e.currentTarget.style.borderColor = T.clay;
                    e.currentTarget.style.color = T.white;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color = "#C2E8E4";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Bar: Copyright Notice */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 26,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: 14,
            color: "#83A2A8",
          }}>
            <div>
              © 2026 WASH Sector North East Nigeria. All rights reserved. Managed under the humanitarian cluster approach.
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
