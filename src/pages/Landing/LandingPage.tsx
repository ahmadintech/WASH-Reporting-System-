import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";

/* ─── Colour Palette ─────────────────────────────────────────────── */
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

/* ─── Number Formatter ─────────────────────────────────────────── */
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const IcoArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IcoCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcoAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IcoClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IcoWaterDrop = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const IcoShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IcoUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcoMapPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IcoCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IcoHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IcoDocument = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IcoBarChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IcoMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const IcoPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IcoDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* ─── WASH Logo Mark ─────────────────────────────────────────────── */
function WashLogoMark({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#0B3C46" />
      <path d="M22 8c0 0-10 7-10 14a10 10 0 0 0 20 0C32 15 22 8 22 8z" fill="#12707E" />
      <path d="M22 14c0 0-6 4-6 8.5a6 6 0 0 0 12 0C28 18 22 14 22 14z" fill="#BFE3DD" />
      <path d="M15 26h14M17 29.5h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Main Landing Page Component ────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { stats, reportingConfig, systemConfig } = useWashData();
  const { isAuthenticated } = useAuth();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAction = (path: string) => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      navigate(path);
    }
  };

  const deadline = reportingConfig.deadlineDate
    ? new Date(reportingConfig.deadlineDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "End of Month";

  const daysLeft = reportingConfig.deadlineDate
    ? Math.max(0, Math.ceil((new Date(reportingConfig.deadlineDate).getTime() - Date.now()) / 86_400_000))
    : null;

  return (
    <div style={{ minHeight: "100vh", background: T.white, color: T.ink, fontFamily: "'IBM Plex Sans', system-ui, -apple-system, sans-serif" }}>

      {/* ══════════════════════════════════════════════════════════════════
          1. TOP ANNOUNCEMENT BANNER (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      {bannerVisible && (
        <div style={{
          background: reportingConfig.isFreezeActive
            ? "linear-gradient(90deg, #8C2B22 0%, #A8382E 100%)"
            : "linear-gradient(90deg, #0B3C46 0%, #12707E 50%, #C1722F 100%)",
          color: T.white,
          fontSize: 13,
          fontWeight: 500,
          padding: "9px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          position: "relative",
          zIndex: 101,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 1320, width: "100%", margin: "0 auto", justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{
              background: "rgba(255,255,255,0.2)",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              {reportingConfig.isFreezeActive ? "SYSTEM FREEZE" : "ACTIVE CYCLE"}
            </span>

            {reportingConfig.isFreezeActive ? (
              <span>The current reporting window is paused for sector data reconciliation. Contact IM team for emergency updates.</span>
            ) : (
              <span>
                <strong>{reportingConfig.activeCycle || "2026 Cycle"}</strong> reporting is active. Next submission deadline: <strong>{deadline}</strong>
                {daysLeft !== null && ` (${daysLeft === 0 ? "Today is the last day" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`})`}.
              </span>
            )}

            {!reportingConfig.isFreezeActive && (
              <button
                onClick={() => handleAction("/submit-report")}
                style={{
                  background: "rgba(255,255,255,0.22)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: T.white,
                  borderRadius: 20,
                  padding: "3px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginLeft: 6,
                  transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
              >
                Submit Now <IcoArrowRight size={12} />
              </button>
            )}

            <button
              onClick={() => setBannerVisible(false)}
              aria-label="Dismiss banner"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                padding: 4,
                position: "absolute",
                right: 16,
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
          2. STICKY TOP NAVBAR (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: navScrolled ? "rgba(255, 255, 255, 0.98)" : T.white,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${navScrolled ? T.line : "transparent"}`,
        boxShadow: navScrolled ? "0 4px 20px rgba(11, 60, 70, 0.06)" : "none",
        transition: "all .2s ease-in-out",
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}>
          {/* Brand Logo & Context */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <WashLogoMark size={44} />
            <div style={{ borderLeft: `1.5px solid ${T.line}`, paddingLeft: 14 }}>
              <div style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: T.tealDeep,
                letterSpacing: "-0.2px",
                lineHeight: 1.15,
              }}>
                WASH Sector North East Nigeria
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: T.inkMuted,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginTop: 2,
              }}>
                5W Activity Reporting &amp; Coverage Platform
              </div>
            </div>
          </div>

          {/* Navigation Menu (Desktop) */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
            <a href="#overview" style={{ textDecoration: "none", color: T.inkMuted, fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 6, transition: "color .15s" }}>
              Overview
            </a>
            <a href="#5w-framework" style={{ textDecoration: "none", color: T.inkMuted, fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 6, transition: "color .15s" }}>
              5W Architecture
            </a>
            <a href="#coverage" style={{ textDecoration: "none", color: T.inkMuted, fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 6, transition: "color .15s" }}>
              BAY Coverage
            </a>
            <a href="#pillars" style={{ textDecoration: "none", color: T.inkMuted, fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 6, transition: "color .15s" }}>
              Core Pillars
            </a>
            <a href="#resources" style={{ textDecoration: "none", color: T.inkMuted, fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 6, transition: "color .15s" }}>
              Resources &amp; Hubs
            </a>
          </nav>

          {/* Right Action Group */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Operational States Badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: T.tealSoft,
              border: "1px solid #C4E3DF",
              borderRadius: 6,
              padding: "5px 12px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              color: T.tealDeep,
              letterSpacing: "0.04em",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
              BORNO · ADAMAWA · YOBE
            </div>

            {/* Main CTA: Go to Dashboard or Sign In */}
            {isAuthenticated ? (
              <button
                id="navbar-dashboard-btn"
                onClick={() => navigate("/dashboard")}
                style={{
                  background: T.tealDeep,
                  color: T.white,
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 2px 8px rgba(11, 60, 70, 0.15)",
                  transition: "background .15s, transform .1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = T.teal)}
                onMouseLeave={e => (e.currentTarget.style.background = T.tealDeep)}
              >
                Go to Dashboard <IcoArrowRight size={15} />
              </button>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={() => navigate("/signin")}
                style={{
                  background: T.clay,
                  color: T.white,
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 2px 8px rgba(193, 114, 47, 0.2)",
                  transition: "background .15s, transform .1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = T.clayHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.clay)}
              >
                Partner Sign In <IcoArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          3. HERO SECTION (Full Width Edge-to-Edge with Deep Gradient)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="overview" style={{
        position: "relative",
        background: "linear-gradient(135deg, #061B20 0%, #0B3C46 50%, #12707E 100%)",
        color: T.white,
        padding: "76px 24px 84px",
        overflow: "hidden",
        width: "100%",
      }}>
        {/* Subtle Decorative Geometric Circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, left: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,138,153,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840 }}>
            {/* Context Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 30,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 600,
              color: "#C2E8E4",
              marginBottom: 20,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              <span>🏛️ UNICEF · Federal Ministry of Water Resources</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span>Inter-Agency Coordination</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "clamp(30px, 4.4vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.6px",
              margin: "0 0 20px",
              color: T.white,
            }}>
              One Unified Platform for Humanitarian WASH Response in North East Nigeria.
            </h1>

            {/* Description Subtitle */}
            <p style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              lineHeight: 1.6,
              color: "#D2ECE9",
              margin: "0 0 36px",
              maxWidth: 720,
            }}>
              Empowering over 40 accredited humanitarian partners to record, visualize, and analyze
              life-saving Water, Sanitation, and Hygiene activities across Borno, Adamawa, and Yobe states.
              Eliminating coverage gaps and maximizing emergency response reach.
            </p>

            {/* Primary Action Buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button
                id="hero-submit-btn"
                onClick={() => handleAction("/submit-report")}
                style={{
                  background: T.clay,
                  color: T.white,
                  border: "none",
                  borderRadius: 9,
                  padding: "15px 28px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 4px 16px rgba(193, 114, 47, 0.35)",
                  transition: "all .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = T.clayHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.clay)}
              >
                <IcoDocument /> Submit Monthly 5W Report <IcoArrowRight />
              </button>

              <button
                id="hero-coverage-btn"
                onClick={() => handleAction("/coverage-dashboard")}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  color: T.white,
                  border: "1px solid rgba(255, 255, 255, 0.32)",
                  borderRadius: 9,
                  padding: "15px 26px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.22)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)")}
              >
                <IcoBarChart /> Explore Coverage Dashboard
              </button>

              <button
                id="hero-partners-btn"
                onClick={() => handleAction("/partners")}
                style={{
                  background: "transparent",
                  color: "#C2E8E4",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: 9,
                  padding: "15px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "color .15s, border-color .15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = T.white;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#C2E8E4";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                }}
              >
                <IcoShield /> Partner Directory
              </button>
            </div>
          </div>

          {/* ── LIVE STATS STRIP (Integrated Hero Bar) ── */}
          <div style={{
            marginTop: 56,
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: 14,
            padding: "24px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#BFE3DD" }}>
                <IcoDocument />
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8D8D3", fontWeight: 600 }}>
                  Reports On Record
                </div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: T.white }}>
                  {fmtNum(stats.totalReports)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#BFE3DD" }}>
                <IcoHeart />
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8D8D3", fontWeight: 600 }}>
                  Beneficiaries Reached
                </div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: T.white }}>
                  {fmtNum(stats.totalBeneficiaries)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#BFE3DD" }}>
                <IcoUsers />
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8D8D3", fontWeight: 600 }}>
                  Reporting Partners
                </div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: T.white }}>
                  {fmtNum(stats.totalPartners)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#BFE3DD" }}>
                <IcoMapPin />
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8D8D3", fontWeight: 600 }}>
                  LGAs Actively Covered
                </div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: T.white }}>
                  {fmtNum(stats.totalLgas)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. EMERGENCY SURVEILLANCE & FIELD FOCUS BANNER (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: T.claySoft,
        borderTop: `1px solid #F5DECB`,
        borderBottom: `1px solid #F5DECB`,
        padding: "20px 24px",
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1320,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: T.clay, color: T.white, padding: "8px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
              <IcoAlert /> AWD/CHOLERA SURVEILLANCE
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#6A3810", lineHeight: 1.4 }}>
              <strong>Active Cholera Prevention Protocol:</strong> Partner reporting is prioritized for high-risk displacement camps and flood-prone host communities in Maiduguri, Jere, and Damaturu.
            </p>
          </div>

          <button
            onClick={() => handleAction("/coverage-dashboard")}
            style={{
              background: T.clay,
              color: T.white,
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            View Hotspot LGAs <IcoArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. THE 5W METHODOLOGY SECTION (Full Width, Soft Background)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="5w-framework" style={{
        padding: "80px 24px",
        background: T.bgSubtle,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 52px" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              color: T.teal,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Inter-Agency Information Management
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 34,
              fontWeight: 700,
              color: T.tealDeep,
              margin: "0 0 14px",
            }}>
              How the 5W Framework Operates
            </h2>
            <p style={{ fontSize: 15.5, color: T.inkMuted, lineHeight: 1.6, margin: 0 }}>
              The 5W matrix is the globally recognized humanitarian cluster standard that ensures accountability,
              prevents overlap, and directs emergency resources to the most vulnerable individuals.
            </p>
          </div>

          {/* 5W Interactive Step Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 18,
          }}>
            {[
              {
                num: "01",
                code: "WHO",
                title: "The Lead & Partner",
                desc: "Accredited humanitarian agency, implementing NGO, donor, and operational field focal point.",
                icon: <IcoUsers />,
                accent: T.teal,
              },
              {
                num: "02",
                code: "WHAT",
                title: "The Intervention",
                desc: "Specific sector activity: water supply construction, latrine desludging, or hygiene kit distribution.",
                icon: <IcoWaterDrop />,
                accent: T.tealMedium,
              },
              {
                num: "03",
                code: "WHERE",
                title: "The Exact Location",
                desc: "State, LGA, ward, IDP camp or host community, accompanied by validated GPS coordinates.",
                icon: <IcoMapPin />,
                accent: T.clay,
              },
              {
                num: "04",
                code: "WHEN",
                title: "The Implementation Period",
                desc: "Active monthly cycle, project start and completion dates, and continuous activity status.",
                icon: <IcoCalendar />,
                accent: T.green,
              },
              {
                num: "05",
                code: "FOR WHOM",
                title: "The Beneficiaries",
                desc: "Target population: IDPs, returnees, host communities with disaggregated sex and age indicators.",
                icon: <IcoHeart />,
                accent: "#7E3A9E",
              },
            ].map(step => (
              <div
                key={step.code}
                style={{
                  background: T.white,
                  border: `1.5px solid ${T.line}`,
                  borderRadius: 14,
                  padding: "26px 22px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform .2s, box-shadow .2s, border-color .2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(11, 60, 70, 0.08)";
                  e.currentTarget.style.borderColor = step.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = T.line;
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 14,
                  right: 18,
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#EFF3F2",
                  userSelect: "none",
                  lineHeight: 1,
                }}>
                  {step.num}
                </div>

                <div style={{ color: step.accent, marginBottom: 16 }}>
                  {step.icon}
                </div>

                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: step.accent,
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}>
                  {step.num} · {step.code}
                </div>

                <h3 style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: T.tealDeep,
                  margin: "0 0 10px",
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: 13.5,
                  color: T.inkMuted,
                  lineHeight: 1.55,
                  margin: 0,
                  position: "relative",
                  zIndex: 1,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. STATE OPERATIONAL COVERAGE: BAY STATES (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="coverage" style={{
        padding: "80px 24px",
        background: T.white,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 44 }}>
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                color: T.clay,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}>
                Geographic Operational Footprint
              </div>
              <h2 style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 32,
                fontWeight: 700,
                color: T.tealDeep,
                margin: 0,
              }}>
                Response Coverage Across Borno, Adamawa &amp; Yobe
              </h2>
            </div>

            <button
              onClick={() => handleAction("/coverage-dashboard")}
              style={{
                background: T.tealSoft,
                color: T.tealDeep,
                border: "1px solid #C4E3DF",
                borderRadius: 8,
                padding: "10px 18px",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Open Interactive State Map <IcoArrowRight size={14} />
            </button>
          </div>

          {/* 3 State Highlight Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}>
            {[
              {
                state: "Borno State",
                hub: "Maiduguri Coordination Hub",
                tag: "High Priority",
                tagBg: "#FDE8E8",
                tagColor: "#9B1C1C",
                desc: "Epicenter of the humanitarian crisis. Heavy concentration of formal & informal IDP sites requiring sustained water trucking, daily borehole chlorination, and intensive camp sanitation.",
                priorityNeeds: ["Emergency Desludging", "Solar Borehole Rehabilitation", "Chlorination at Water Points"],
                lgas: "Maiduguri, Jere, Gwoza, Bama, Monguno, Dikwa",
              },
              {
                state: "Adamawa State",
                hub: "Yola Sub-Cluster Desk",
                tag: "Flood Response & Returnees",
                tagBg: "#FEF08A",
                tagColor: "#713F12",
                desc: "Supporting vulnerable returnee communities and flood-impacted riverine settlements along the Benue basin with community water systems and cholera prevention kits.",
                priorityNeeds: ["Flood Drainage Systems", "Family Hygiene Kit Distribution", "Household Water Treatment"],
                lgas: "Yola North, Yola South, Mubi North, Michika, Fufore",
              },
              {
                state: "Yobe State",
                hub: "Damaturu Sub-Cluster Desk",
                tag: "Drought & Water Quality",
                tagBg: T.tealSoft,
                tagColor: T.tealDeep,
                desc: "Arid zone interventions focused on deep aquifer motorized water schemes, water quality testing labs, and institutional WASH installations in primary health care clinics.",
                priorityNeeds: ["Deep Motorized Boreholes", "Clinic WASH Infrastructure", "Community Hygiene Clubs"],
                lgas: "Damaturu, Potiskum, Bade, Gujba, Geidam",
              },
            ].map(item => (
              <div
                key={item.state}
                style={{
                  background: T.bgSubtle,
                  border: `1.5px solid ${T.line}`,
                  borderRadius: 14,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 21, fontWeight: 700, color: T.tealDeep, margin: 0 }}>
                      {item.state}
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: item.tagBg, color: item.tagColor, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {item.tag}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: T.teal, fontWeight: 600, marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
                    📍 {item.hub}
                  </div>

                  <p style={{ fontSize: 13.5, color: T.inkMuted, lineHeight: 1.6, margin: "0 0 20px" }}>
                    {item.desc}
                  </p>

                  <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.inkMuted, marginBottom: 8 }}>
                      Priority Interventions:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: T.ink, lineHeight: 1.6 }}>
                      {item.priorityNeeds.map(need => (
                        <li key={need}>{need}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 14, fontSize: 12, color: T.inkMuted }}>
                  <strong>Key LGAs:</strong> {item.lgas}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. CORE STRATEGIC PILLARS SECTION (Full Width, Soft Teal)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pillars" style={{
        padding: "80px 24px",
        background: T.tealSubtle,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 48px" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              color: T.teal,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Strategic Humanitarian Objectives
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: T.tealDeep,
              margin: "0 0 12px",
            }}>
              Four Core Pillars of Sector Delivery
            </h2>
            <p style={{ fontSize: 15, color: T.inkMuted, lineHeight: 1.6, margin: 0 }}>
              All 5W activity reports align with one of the four sector operational pillars defined under the Humanitarian Response Plan (HRP).
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {[
              {
                title: "1. Water Supply Infrastructure",
                color: T.teal,
                bg: T.white,
                desc: "Construction, solarization, and ongoing operation of motorized boreholes, emergency water trucking in high-influx camps, pipeline extensions, and free residual chlorine monitoring.",
                points: ["Solar Borehole Pumping", "Chlorination Monitoring", "Emergency Water Trucking"],
              },
              {
                title: "2. Emergency & Dignified Sanitation",
                color: T.green,
                bg: T.white,
                desc: "Gender-segregated emergency and semi-permanent latrines, accessible facilities for persons with reduced mobility, camp desludging operations, and solid waste collection.",
                points: ["Gender-Segregated Latrines", "Regular Camp Desludging", "Solid Waste Management"],
              },
              {
                title: "3. Hygiene & Disease Prevention",
                color: T.clay,
                bg: T.white,
                desc: "House-to-house hygiene sensitization, cholera awareness campaigns, distribution of standard hygiene kits, safe water storage jerrycans, and menstrual hygiene management items.",
                points: ["Standard Hygiene Kits", "Cholera Early Warning", "Menstrual Hygiene Support"],
              },
              {
                title: "4. Institutional WASH Services",
                color: "#6D28D9",
                bg: T.white,
                desc: "Provision of comprehensive water and sanitation facilities in Primary Health Centers (PHCs), Cholera Treatment Units (CTUs), emergency schools, and nutrition centers.",
                points: ["Health Clinic WASH", "Temporary Learning Spaces", "Nutrition Center Points"],
              },
            ].map(pillar => (
              <div
                key={pillar.title}
                style={{
                  background: pillar.bg,
                  border: `1.5px solid ${T.line}`,
                  borderRadius: 14,
                  padding: "26px 22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: pillar.color,
                  marginBottom: 12,
                }} />

                <h3 style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: T.tealDeep,
                  margin: "0 0 10px",
                }}>
                  {pillar.title}
                </h3>

                <p style={{ fontSize: 13.5, color: T.inkMuted, lineHeight: 1.6, margin: "0 0 16px" }}>
                  {pillar.desc}
                </p>

                <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>
                  {pillar.points.map(pt => (
                    <div key={pt} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: T.ink, marginBottom: 6 }}>
                      <span style={{ color: pillar.color }}><IcoCheck /></span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          8. SECTOR GOVERNANCE & COORDINATION HUBS (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="resources" style={{
        padding: "80px 24px",
        background: T.white,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 32 }}>

            {/* Left Column: Reporting Calendar & Technical Guidelines */}
            <div style={{ background: T.bgSubtle, border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "32px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ color: T.teal }}><IcoDocument /></span>
                <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: T.tealDeep, margin: 0 }}>
                  Reporting Cadence &amp; Rules
                </h3>
              </div>

              <p style={{ fontSize: 14, color: T.inkMuted, lineHeight: 1.6, marginBottom: 20 }}>
                Every accredited organization operating in Borno, Adamawa, or Yobe is required to submit monthly 5W returns in accordance with sector guidelines:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                {[
                  {
                    title: "Submission Timetable",
                    text: `Reports are strictly due by the last working day of every calendar month. Next cycle deadline: ${deadline}.`,
                  },
                  {
                    title: "Granular Site Reporting",
                    text: "Submit separate entries for every specific settlement, ward, and IDP camp. Avoid aggregating figures across entire LGAs.",
                  },
                  {
                    title: "Monthly Beneficiary Count",
                    text: "Beneficiary counts must indicate unique individuals reached in that reporting month, not cumulative annual totals.",
                  },
                  {
                    title: "Technical Validation",
                    text: "The Information Management team verifies coordinates against official administrative boundaries before data goes live.",
                  },
                ].map(rule => (
                  <div key={rule.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: T.green, marginTop: 2 }}><IcoCheck /></span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.tealDeep }}>{rule.title}</div>
                      <div style={{ fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>{rule.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleAction("/submit-report")}
                  style={{
                    background: T.clay,
                    color: T.white,
                    border: "none",
                    borderRadius: 7,
                    padding: "9px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Open 5W Submission Form <IcoArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column: Coordination Focal Points & Meetings */}
            <div style={{ background: T.bgSubtle, border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "32px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ color: T.teal }}><IcoUsers /></span>
                <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: T.tealDeep, margin: 0 }}>
                  Coordination Hubs &amp; Contacts
                </h3>
              </div>

              <p style={{ fontSize: 14, color: T.inkMuted, lineHeight: 1.6, marginBottom: 20 }}>
                Reach out to sector focal points for technical assistance, coordination meeting agendas, or reporting helpdesk:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                {[
                  {
                    role: "National Sector Lead Agency",
                    contact: "Federal Ministry of Water Resources & UNICEF",
                    type: "lead",
                  },
                  {
                    role: "Sector Coordinator (Maiduguri)",
                    contact: "coordinator@washsector-ne.org",
                    type: "email",
                  },
                  {
                    role: "Information Management Officer (IMO)",
                    contact: "im@washsector-ne.org",
                    type: "email",
                  },
                  {
                    role: "Reporting Helpdesk Hotline",
                    contact: "+234 000 000 0000 / Field Ext: 224",
                    type: "phone",
                  },
                  {
                    role: "Bi-weekly Coordination Meeting",
                    contact: "Every Alternate Tuesday · 10:00 AM (Hybrid)",
                    type: "cal",
                  },
                ].map(c => (
                  <div key={c.role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.line}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: T.inkMuted }}>{c.role}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.tealDeep, fontFamily: c.type === "email" ? "'IBM Plex Mono', monospace" : "inherit" }}>
                      {c.type === "email" ? (
                        <a href={`mailto:${c.contact}`} style={{ color: T.teal, textDecoration: "none" }}>{c.contact}</a>
                      ) : (
                        c.contact
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.inkMuted, marginBottom: 10 }}>
                  Quick Navigation Links:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => handleAction("/reports-list")} style={{ background: T.white, border: `1px solid ${T.line}`, padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: T.tealDeep, cursor: "pointer" }}>
                    Reports Archive
                  </button>
                  <button onClick={() => handleAction("/partners")} style={{ background: T.white, border: `1px solid ${T.line}`, padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: T.tealDeep, cursor: "pointer" }}>
                    Partner Roster
                  </button>
                  <button onClick={() => handleAction("/coverage-dashboard")} style={{ background: T.white, border: `1px solid ${T.line}`, padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: T.tealDeep, cursor: "pointer" }}>
                    Coverage Metrics
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          9. FULL-WIDTH CALL TO ACTION BANNER (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
        color: T.white,
        padding: "68px 24px",
        textAlign: "center",
        width: "100%",
        position: "relative",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 30,
            padding: "4px 14px",
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 16,
            color: "#C2E8E4",
          }}>
            Humanitarian Accountability
          </div>

          <h2 style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 700,
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}>
            Are You Delivering Life-Saving WASH Activities in the North East?
          </h2>

          <p style={{
            fontSize: 16,
            color: "#D2ECE9",
            lineHeight: 1.6,
            margin: "0 auto 32px",
            maxWidth: 680,
          }}>
            Make sure your interventions are reflected in inter-agency coverage maps, sector bulletins,
            and donor humanitarian funding overviews.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              id="cta-submit-btn"
              onClick={() => handleAction("/submit-report")}
              style={{
                background: T.clay,
                color: T.white,
                border: "none",
                borderRadius: 9,
                padding: "14px 30px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = T.clayHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.clay)}
            >
              Submit Your 5W Data Now <IcoArrowRight />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: T.white,
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 9,
                  padding: "14px 26px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Access Coordinator Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: T.white,
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 9,
                  padding: "14px 26px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Partner Login Portal
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          10. STANDARD MULTI-COLUMN WEBSITE FOOTER (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: T.tealDarkest,
        color: "#C2D4D8",
        padding: "64px 24px 32px",
        width: "100%",
        borderTop: "3px solid #C1722F",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          {/* Top Footer Row: Branding & Endorsements */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 24,
            paddingBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <WashLogoMark size={46} />
              <div>
                <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: T.white }}>
                  WASH Sector North East Nigeria
                </div>
                <div style={{ fontSize: 12, color: "#8EACB2", fontFamily: "'IBM Plex Mono', monospace" }}>
                  5W Activity Reporting &amp; Humanitarian Response Coverage
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 12, color: "#9CB8BD", flexWrap: "wrap" }}>
              <span>Co-led by:</span>
              <span style={{ color: T.white, fontWeight: 600 }}>Federal Ministry of Water Resources</span>
              <span>·</span>
              <span style={{ color: T.white, fontWeight: 600 }}>UNICEF Nigeria</span>
              <span>·</span>
              <span style={{ color: T.white, fontWeight: 600 }}>UN OCHA</span>
            </div>
          </div>

          {/* Middle Footer: 4 Multi-Columns */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 36,
            padding: "44px 0 40px",
          }}>
            {/* Column 1: Mandate */}
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: T.white, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sector Mandate
              </h4>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#8EACB2", margin: "0 0 14px" }}>
                The WASH Sector coordinates humanitarian water, sanitation, and hygiene assistance across the conflict-affected states of Borno, Adamawa, and Yobe in North East Nigeria.
              </p>
              <div style={{ fontSize: 12, color: "#5F7F85" }}>
                Active Operational Nodes: Maiduguri Central, Yola Sub-Office, Damaturu Sub-Office.
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: T.white, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Platform Navigation
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, lineHeight: 2.2 }}>
                <li><a href="#overview" style={{ color: "#A2C1C6", textDecoration: "none" }}>Portal Overview</a></li>
                <li><button onClick={() => handleAction("/submit-report")} style={{ background: "none", border: "none", padding: 0, color: "#A2C1C6", cursor: "pointer", fontSize: 13 }}>Submit 5W Monthly Report</button></li>
                <li><button onClick={() => handleAction("/coverage-dashboard")} style={{ background: "none", border: "none", padding: 0, color: "#A2C1C6", cursor: "pointer", fontSize: 13 }}>Response Coverage Dashboard</button></li>
                <li><button onClick={() => handleAction("/reports-list")} style={{ background: "none", border: "none", padding: 0, color: "#A2C1C6", cursor: "pointer", fontSize: 13 }}>All Submitted Reports</button></li>
                <li><button onClick={() => handleAction("/partners")} style={{ background: "none", border: "none", padding: 0, color: "#A2C1C6", cursor: "pointer", fontSize: 13 }}>Humanitarian Partner Roster</button></li>
              </ul>
            </div>

            {/* Column 3: Response Pillars & Resources */}
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: T.white, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Key Resources &amp; TWGs
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, lineHeight: 2.2 }}>
                <li><span style={{ color: "#A2C1C6" }}>Water Quality Technical Working Group</span></li>
                <li><span style={{ color: "#A2C1C6" }}>Sanitation &amp; Sludge Management Protocol</span></li>
                <li><span style={{ color: "#A2C1C6" }}>Hygiene Promotion in Cholera Outbreaks</span></li>
                <li><span style={{ color: "#A2C1C6" }}>WASH in Primary Health Facilities (PHC)</span></li>
                <li><span style={{ color: "#A2C1C6" }}>Humanitarian Response Plan (HRP) Matrix</span></li>
              </ul>
            </div>

            {/* Column 4: Helpdesk & Coordination */}
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: T.white, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sector Helpdesk
              </h4>
              <div style={{ fontSize: 13, color: "#8EACB2", lineHeight: 1.8 }}>
                <div><strong>Email:</strong> <a href={`mailto:${systemConfig.replyToEmail}`} style={{ color: "#61CCD8", textDecoration: "none" }}>{systemConfig.replyToEmail}</a></div>
                <div><strong>Lead Coordinator:</strong> coordinator@washsector-ne.org</div>
                <div><strong>Information Management:</strong> im@washsector-ne.org</div>
                <div><strong>Emergency Hotline:</strong> {systemConfig.emergencyContact}</div>
                <div style={{ marginTop: 12 }}>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "rgba(46, 125, 71, 0.2)",
                    color: "#57CE7F",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                    ● SYSTEM STATUS: ONLINE &amp; OPERATIONAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Humanitarian Principles */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 12,
            color: "#6D8D93",
          }}>
            <div>
              © 2026 WASH Sector North East Nigeria. All rights reserved. Managed under the humanitarian cluster approach.
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <span>Humanity</span>
              <span>·</span>
              <span>Neutrality</span>
              <span>·</span>
              <span>Impartiality</span>
              <span>·</span>
              <span>Operational Independence</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
