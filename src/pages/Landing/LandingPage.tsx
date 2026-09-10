import React, { useState, useEffect, useRef } from "react";
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

/* ─── Standard Typography Token ──────────────────────────────────── */
const FONT_PRIMARY = "'Outfit', 'Inter', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

/* ─── Number Formatter ─────────────────────────────────────────── */
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const IcoArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IcoCheck = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcoAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IcoClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IcoWaterDrop = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const IcoShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IcoUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcoMapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IcoCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IcoHeart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IcoDocument = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IcoBarChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

/* ─── Social Media Icons ─────────────────────────────────────────── */
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

/* ─── Official Dashboard Logo Component ─────────────────────────── */
function DashboardLogo({ size = 48, darkBg = false }: { size?: number; darkBg?: boolean }) {
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

/* ─── Animated Counter Hook (Cubic Ease-Out) ─────────────────────── */
function useAnimatedCounter(target: number, isVisible: boolean, duration = 1800) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp: number | null = null;
    let rafId: number;

    const step = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out curve: swift rise followed by smooth glide into target
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(easeOut * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, isVisible, duration]);

  return current;
}

/* ─── Animated Stat Metric Card ───────────────────────────────────── */
function StatCard({
  label,
  targetValue,
  icon,
  accent,
  accentSoft,
  gradient,
  tag,
  subtext,
  isVisible,
}: {
  label: string;
  targetValue: number;
  icon: React.ReactNode;
  accent: string;
  accentSoft: string;
  gradient: string;
  tag: string;
  subtext: string;
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const animatedValue = useAnimatedCounter(targetValue, isVisible, 1800);
  const displayValue = fmtNum(animatedValue);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.white,
        border: `1.5px solid ${hovered ? accent : T.line}`,
        borderRadius: 16,
        padding: "26px 22px 22px",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 12px 28px -4px ${accent}25, 0 4px 12px rgba(11, 60, 70, 0.06)`
          : "0 2px 10px rgba(11, 60, 70, 0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3.5,
          background: gradient,
        }}
      />

      {/* Top Row: Icon + Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: accentSoft,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11.5,
            fontWeight: 700,
            color: accent,
            background: accentSoft,
            padding: "4px 10px",
            borderRadius: 14,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: `1px solid ${accent}25`,
          }}
        >
          {tag}
        </span>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: T.inkMuted,
          fontWeight: 700,
          fontFamily: FONT_PRIMARY,
          marginTop: 18,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      {/* Big Animated Wow Value */}
      <div
        style={{
          fontFamily: FONT_PRIMARY,
          fontSize: "clamp(34px, 3.2vw, 42px)",
          fontWeight: 800,
          color: hovered ? accent : T.tealDeep,
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
          transition: "color 0.2s ease",
          display: "flex",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        <span>{displayValue}</span>
        {isVisible && (
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: accent,
              display: "inline-block",
              marginLeft: 2,
              opacity: 0.85,
            }}
          />
        )}
      </div>

      {/* Subtext info */}
      <div
        style={{
          fontSize: 13,
          color: T.inkLight,
          marginTop: 8,
          lineHeight: 1.45,
          fontFamily: FONT_PRIMARY,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>{subtext}</span>
      </div>
    </div>
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
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
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
    <div style={{ minHeight: "100vh", background: T.white, color: T.ink, fontFamily: FONT_PRIMARY, width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>

      {/* ══════════════════════════════════════════════════════════════════
          1. TOP ANNOUNCEMENT BANNER (Full Width)
      ══════════════════════════════════════════════════════════════════ */}
      {bannerVisible && (
        <div style={{
          background: reportingConfig.isFreezeActive
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
              {reportingConfig.isFreezeActive ? "SYSTEM FREEZE" : "ACTIVE CYCLE"}
            </span>

            {windowWidth >= 768 && (
              reportingConfig.isFreezeActive ? (
                <span style={{ fontSize: 14 }}>The current reporting window is paused for sector data reconciliation. Contact IM team for emergency updates.</span>
              ) : (
                <span style={{ fontSize: 14 }}>
                  <strong>{reportingConfig.activeCycle || "2026 Cycle"}</strong> reporting is active. Next submission deadline: <strong>{deadline}</strong>
                  {daysLeft !== null && ` (${daysLeft === 0 ? "Today is the last day" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`})`}.
                </span>
              )
            )}

            {!reportingConfig.isFreezeActive && (
              <button
                onClick={() => handleAction("/submit-report")}
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
          2. STICKY TOP NAVBAR (Responsive, Professional & Expanded)
      ══════════════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════════════
          2. STICKY TOP NAVBAR (Strict Responsive Rendering & Compact Brand)
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
            <nav style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
              {[
                { label: "Overview", href: "#overview" },
                { label: "5W Architecture", href: "#5w-framework" },
                { label: "BAY Coverage", href: "#coverage" },
                { label: "Core Pillars", href: "#pillars" },
                { label: "Resources & Hubs", href: "#resources" },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    color: "#3F565C",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "7px 11px",
                    borderRadius: 7,
                    transition: "all .15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = T.tealDeep;
                    e.currentTarget.style.background = "rgba(18, 112, 126, 0.07)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "#3F565C";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right Action Group */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Operational States Badge (Rendered ONLY on Large Desktop >= 1340px) */}
            {windowWidth >= 1340 && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "#F0F7F6",
                border: "1.5px solid #CFE5E2",
                borderRadius: 20,
                padding: "4px 11px",
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 700,
                color: T.tealDeep,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E7D47" }} />
                BORNO · ADAMAWA · YOBE
              </div>
            )}

            {/* Main CTA: Go to Dashboard (Rendered on Desktop & Tablets >= 640px) */}
            {(windowWidth >= 640) && (
              <button
                id="navbar-dashboard-btn"
                onClick={() => handleAction("/dashboard")}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              {[
                { label: "Overview", href: "#overview", icon: "fa-regular fa-compass" },
                { label: "5W Architecture", href: "#5w-framework", icon: "fa-solid fa-cubes" },
                { label: "BAY Coverage", href: "#coverage", icon: "fa-solid fa-map-location-dot" },
                { label: "Core Pillars", href: "#pillars", icon: "fa-solid fa-layer-group" },
                { label: "Resources & Hubs", href: "#resources", icon: "fa-regular fa-folder-open" },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: "#2C4044",
                    fontSize: 15,
                    fontWeight: 600,
                    padding: "10px 14px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = T.tealDeep;
                    e.currentTarget.style.background = "rgba(18, 112, 126, 0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "#2C4044";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <i className={item.icon} style={{ color: T.teal, width: 20, textAlign: "center" }}></i>
                  {item.label}
                </a>
              ))}
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

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAction("/dashboard");
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
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          3. HERO SECTION (Outfit Font Everywhere)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="overview" style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(4, 20, 24, 0.90) 0%, rgba(8, 45, 53, 0.86) 50%, rgba(4, 20, 24, 0.92) 100%), url('/images/wash_hero_bg.jpg') center/cover no-repeat",
        color: T.white,
        padding: "88px 24px 96px",
        overflow: "hidden",
        width: "100%",
      }}>
        {/* Subtle Decorative Geometric Circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, left: -60, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,138,153,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1360, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 960 }}>
            {/* Context Badge (Smaller, clean typography, Material Icon) */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.20)",
              backdropFilter: "blur(6px)",
              borderRadius: 30,
              padding: "5px 14px",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#C2E8E4",
              marginBottom: 22,
              fontFamily: FONT_MONO,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#8AE0D5" }}>account_balance</span>
              <span>UNICEF · Federal Ministry of Water Resources</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>Inter-Agency Coordination</span>
            </div>

            {/* Main Headline (Clean Outfit Font) */}
            <h1 style={{
              fontFamily: FONT_PRIMARY,
              fontSize: "clamp(36px, 5.2vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              margin: "0 0 24px",
              color: T.white,
            }}>
              One Unified Platform for Humanitarian WASH Response in North East Nigeria.
            </h1>

            {/* Description Subtitle */}
            <p style={{
              fontFamily: FONT_PRIMARY,
              fontSize: "clamp(17px, 2.1vw, 21px)",
              lineHeight: 1.65,
              color: "#D6F0ED",
              margin: "0 0 42px",
              maxWidth: 820,
              fontWeight: 400,
            }}>
              Empowering over 40 accredited humanitarian partners to record, visualize, and analyze
              life-saving Water, Sanitation, and Hygiene activities across Borno, Adamawa, and Yobe states.
              Eliminating coverage gaps and maximizing emergency response reach.
            </p>

            {/* Primary Action Buttons (Material Icons) */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <button
                id="hero-submit-btn"
                onClick={() => handleAction("/submit-report")}
                style={{
                  background: T.clay,
                  color: T.white,
                  border: "none",
                  borderRadius: 10,
                  padding: "16px 30px",
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: FONT_PRIMARY,
                  boxShadow: "0 4px 18px rgba(193, 114, 47, 0.4)",
                  transition: "all .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = T.clayHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.clay)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>description</span>
                Submit Monthly 5W Report
                <span className="material-symbols-outlined" style={{ fontSize: 19 }}>arrow_forward</span>
              </button>

              <button
                id="hero-coverage-btn"
                onClick={() => handleAction("/coverage-dashboard")}
                style={{
                  background: "rgba(255, 255, 255, 0.14)",
                  color: T.white,
                  border: "1.5px solid rgba(255, 255, 255, 0.35)",
                  borderRadius: 10,
                  padding: "16px 26px",
                  fontSize: 15.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: FONT_PRIMARY,
                  backdropFilter: "blur(4px)",
                  transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.24)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>analytics</span>
                Explore Coverage Dashboard
              </button>

              <button
                id="hero-partners-btn"
                onClick={() => handleAction("/partners")}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#C2E8E4",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 10,
                  padding: "16px 24px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FONT_PRIMARY,
                  backdropFilter: "blur(4px)",
                  transition: "color .15s, border-color .15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = T.white;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#C2E8E4";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 19 }}>groups</span>
                Partner Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. THE 5W METHODOLOGY SECTION (Outfit Font Everywhere)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="5w-framework" style={{
        padding: "80px 24px 96px",
        background: T.bgSubtle,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>

          {/* ── 4 STATS CARDS DIRECTLY ABOVE 5W TITLE (Animated Count on Scroll) ── */}
          <div
            ref={statsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 22,
              marginBottom: 56,
            }}
          >
            <StatCard
              label="Reports On Record"
              targetValue={stats.totalReports}
              isVisible={statsVisible}
              icon={<IcoDocument />}
              accent={T.teal}
              accentSoft={T.tealSoft}
              gradient="linear-gradient(135deg, #12707E 0%, #1D8A99 100%)"
              tag="Verified 5W"
              subtext="Validated monthly submissions"
            />
            <StatCard
              label="Beneficiaries Reached"
              targetValue={stats.totalBeneficiaries}
              isVisible={statsVisible}
              icon={<IcoHeart />}
              accent={T.clay}
              accentSoft={T.claySoft}
              gradient="linear-gradient(135deg, #C1722F 0%, #D8823E 100%)"
              tag="Individuals Served"
              subtext="Host & IDP community individuals"
            />
            <StatCard
              label="Reporting Partners"
              targetValue={stats.totalPartners}
              isVisible={statsVisible}
              icon={<IcoUsers />}
              accent={T.tealMedium}
              accentSoft="#E0F2F1"
              gradient="linear-gradient(135deg, #1D8A99 0%, #4EAAB6 100%)"
              tag="Accredited Leads"
              subtext="Active UN, INGO & NGO agencies"
            />
            <StatCard
              label="LGAs Actively Covered"
              targetValue={stats.totalLgas}
              isVisible={statsVisible}
              icon={<IcoMapPin />}
              accent={T.green}
              accentSoft={T.greenSoft}
              gradient="linear-gradient(135deg, #2E7D47 0%, #3F9A5F 100%)"
              tag="Priority LGAs"
              subtext="Targeted local government areas"
            />
          </div>

          <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 60px" }}>
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              fontWeight: 700,
              color: T.teal,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Inter-Agency Information Management
            </div>
            <h2 style={{
              fontFamily: FONT_PRIMARY,
              fontSize: "clamp(32px, 4vw, 44px)",
              fontWeight: 800,
              color: T.tealDeep,
              margin: "0 0 16px",
              lineHeight: 1.18,
            }}>
              How the 5W Framework Operates
            </h2>
            <p style={{ fontSize: 17, color: T.inkMuted, lineHeight: 1.65, margin: 0, fontFamily: FONT_PRIMARY }}>
              The 5W matrix is the globally recognized humanitarian cluster standard that ensures accountability,
              prevents overlap, and directs emergency resources to the most vulnerable individuals.
            </p>
          </div>

          {/* 5W Interactive Step Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
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
                  borderRadius: 16,
                  padding: "30px 24px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform .2s, box-shadow .2s, border-color .2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 14px 32px rgba(11, 60, 70, 0.1)";
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
                  fontFamily: FONT_PRIMARY,
                  fontSize: 54,
                  fontWeight: 800,
                  color: "#EFF3F2",
                  userSelect: "none",
                  lineHeight: 1,
                }}>
                  {step.num}
                </div>

                <div style={{ color: step.accent, marginBottom: 18 }}>
                  {step.icon}
                </div>

                <div style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  color: step.accent,
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}>
                  {step.num} · {step.code}
                </div>

                <h3 style={{
                  fontFamily: FONT_PRIMARY,
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.tealDeep,
                  margin: "0 0 12px",
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: 14.5,
                  color: T.inkMuted,
                  lineHeight: 1.6,
                  margin: 0,
                  position: "relative",
                  zIndex: 1,
                  fontFamily: FONT_PRIMARY,
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
        padding: "96px 24px",
        background: T.white,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 52 }}>
            <div>
              <div style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                fontWeight: 700,
                color: T.clay,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}>
                Geographic Operational Footprint
              </div>
              <h2 style={{
                fontFamily: FONT_PRIMARY,
                fontSize: "clamp(30px, 3.8vw, 42px)",
                fontWeight: 800,
                color: T.tealDeep,
                margin: 0,
                lineHeight: 1.2,
              }}>
                Response Coverage Across Borno, Adamawa &amp; Yobe
              </h2>
            </div>

            <button
              onClick={() => handleAction("/coverage-dashboard")}
              style={{
                background: T.tealSoft,
                color: T.tealDeep,
                border: "1.5px solid #C4E3DF",
                borderRadius: 8,
                padding: "12px 22px",
                fontSize: 14.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_PRIMARY,
              }}
            >
              Open Interactive State Map <IcoArrowRight size={16} />
            </button>
          </div>

          {/* 3 State Highlight Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 28,
          }}>
            {[
              {
                state: "Borno State",
                hub: "Maiduguri Coordination Hub",
                tag: "High Priority",
                tagBg: "#FDE8E8",
                tagColor: "#9B1C1C",
                desc: "Epicenter of humanitarian response with sustained water trucking, daily borehole chlorination, and camp sanitation.",
                priorityNeeds: ["Emergency Desludging", "Solar Borehole Rehabilitation", "Chlorination at Water Points"],
                lgas: "Maiduguri, Jere, Gwoza, Bama, Monguno, Dikwa",
              },
              {
                state: "Adamawa State",
                hub: "Yola Sub-Cluster Desk",
                tag: "Flood & Returnees",
                tagBg: "#FEF08A",
                tagColor: "#713F12",
                desc: "Assisting vulnerable returnees and riverine flood settlements along the Benue basin with clean water and hygiene kits.",
                priorityNeeds: ["Flood Drainage Systems", "Family Hygiene Kit Distribution", "Household Water Treatment"],
                lgas: "Yola North, Yola South, Mubi, Michika, Fufore",
              },
              {
                state: "Yobe State",
                hub: "Damaturu Sub-Cluster Desk",
                tag: "Drought & Water Quality",
                tagBg: T.tealSoft,
                tagColor: T.tealDeep,
                desc: "Arid zone interventions prioritizing deep motorized aquifer schemes, water testing, and clinic WASH systems.",
                priorityNeeds: ["Deep Motorized Boreholes", "Clinic WASH Infrastructure", "Community Hygiene Clubs"],
                lgas: "Damaturu, Potiskum, Bade, Gujba, Geidam",
              },
            ].map(item => (
              <div
                key={item.state}
                style={{
                  background: T.white,
                  border: `1.5px solid ${T.line}`,
                  borderRadius: 16,
                  padding: "34px 30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(11,60,70,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ fontFamily: FONT_PRIMARY, fontSize: 26, fontWeight: 800, color: T.tealDeep, margin: 0 }}>
                      {item.state}
                    </h3>
                    <span style={{ fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: item.tagBg, color: item.tagColor, fontFamily: FONT_MONO }}>
                      {item.tag}
                    </span>
                  </div>

                  <div style={{ fontSize: 15, color: T.teal, fontWeight: 600, marginBottom: 16, fontFamily: FONT_MONO, display: "flex", alignItems: "center" }}>
                    <i className="fa-solid fa-location-dot" style={{ color: "#C1722F", marginRight: 8, fontSize: 15 }}></i>
                    {item.hub}
                  </div>

                  <p style={{ fontSize: 16, color: T.inkMuted, lineHeight: 1.65, margin: "0 0 24px", fontFamily: FONT_PRIMARY }}>
                    {item.desc}
                  </p>

                  <div style={{ borderTop: `1.5px solid #EEF2F1`, paddingTop: 20, marginBottom: 20 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: T.tealDeep, marginBottom: 12, fontFamily: FONT_PRIMARY }}>
                      Priority Interventions:
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 15.5, color: T.ink, lineHeight: 1.9, fontFamily: FONT_PRIMARY }}>
                      {item.priorityNeeds.map(need => (
                        <li key={need} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <i className="fa-solid fa-circle-check" style={{ color: T.teal, fontSize: 14 }}></i>
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: `1.5px solid #EEF2F1`, paddingTop: 18, fontSize: 14.5, color: T.inkMuted, fontFamily: FONT_PRIMARY, display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <i className="fa-solid fa-map-pin" style={{ color: "#C1722F", fontSize: 14, marginTop: 3 }}></i>
                  <div>
                    <strong style={{ color: T.tealDeep }}>Key LGAs:</strong> {item.lgas}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. CORE STRATEGIC PILLARS SECTION (Outfit Font)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pillars" style={{
        padding: "96px 24px",
        background: T.tealSubtle,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 56px" }}>
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              fontWeight: 700,
              color: T.teal,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Strategic Humanitarian Objectives
            </div>
            <h2 style={{
              fontFamily: FONT_PRIMARY,
              fontSize: "clamp(32px, 3.8vw, 42px)",
              fontWeight: 800,
              color: T.tealDeep,
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}>
              Four Core Pillars of Sector Delivery
            </h2>
            <p style={{ fontSize: 17, color: T.inkMuted, lineHeight: 1.65, margin: 0, fontFamily: FONT_PRIMARY }}>
              All 5W activity reports align with one of the four sector operational pillars defined under the Humanitarian Response Plan (HRP).
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 22,
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
                  borderRadius: 16,
                  padding: "30px 24px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: pillar.color,
                  marginBottom: 14,
                }} />

                <h3 style={{
                  fontFamily: FONT_PRIMARY,
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.tealDeep,
                  margin: "0 0 12px",
                }}>
                  {pillar.title}
                </h3>

                <p style={{ fontSize: 14.5, color: T.inkMuted, lineHeight: 1.65, margin: "0 0 20px", fontFamily: FONT_PRIMARY }}>
                  {pillar.desc}
                </p>

                <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16 }}>
                  {pillar.points.map(pt => (
                    <div key={pt} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: T.ink, marginBottom: 8, fontFamily: FONT_PRIMARY }}>
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
        padding: "96px 24px",
        background: T.white,
        borderBottom: `1px solid ${T.line}`,
        width: "100%",
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 36 }}>

            {/* Left Column: Reporting Calendar & Technical Guidelines */}
            <div style={{ background: T.bgSubtle, border: `1.5px solid ${T.line}`, borderRadius: 16, padding: "36px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ color: T.teal }}><IcoDocument /></span>
                <h3 style={{ fontFamily: FONT_PRIMARY, fontSize: 22, fontWeight: 700, color: T.tealDeep, margin: 0 }}>
                  Reporting Cadence &amp; Rules
                </h3>
              </div>

              <p style={{ fontSize: 15, color: T.inkMuted, lineHeight: 1.65, marginBottom: 24, fontFamily: FONT_PRIMARY }}>
                Every accredited organization operating in Borno, Adamawa, or Yobe is required to submit monthly 5W returns in accordance with sector guidelines:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
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
                  <div key={rule.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ color: T.green, marginTop: 3 }}><IcoCheck /></span>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: T.tealDeep, fontFamily: FONT_PRIMARY }}>{rule.title}</div>
                      <div style={{ fontSize: 13.5, color: T.inkMuted, lineHeight: 1.55, fontFamily: FONT_PRIMARY }}>{rule.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 22, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleAction("/submit-report")}
                  style={{
                    background: T.clay,
                    color: T.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "11px 22px",
                    fontSize: 14.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: FONT_PRIMARY,
                  }}
                >
                  Open 5W Submission Form <IcoArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right Column: Coordination Focal Points & Meetings */}
            <div style={{ background: T.bgSubtle, border: `1.5px solid ${T.line}`, borderRadius: 16, padding: "36px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ color: T.teal }}><IcoUsers /></span>
                <h3 style={{ fontFamily: FONT_PRIMARY, fontSize: 22, fontWeight: 700, color: T.tealDeep, margin: 0 }}>
                  Coordination Hubs &amp; Contacts
                </h3>
              </div>

              <p style={{ fontSize: 15, color: T.inkMuted, lineHeight: 1.65, marginBottom: 24, fontFamily: FONT_PRIMARY }}>
                Reach out to sector focal points for technical assistance, coordination meeting agendas, or reporting helpdesk:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
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
                  <div key={c.role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.line}`, paddingBottom: 12 }}>
                    <span style={{ fontSize: 14, color: T.inkMuted, fontFamily: FONT_PRIMARY }}>{c.role}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.tealDeep, fontFamily: c.type === "email" ? FONT_MONO : FONT_PRIMARY }}>
                      {c.type === "email" ? (
                        <a href={`mailto:${c.contact}`} style={{ color: T.teal, textDecoration: "none" }}>{c.contact}</a>
                      ) : (
                        c.contact
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.inkMuted, marginBottom: 12, fontFamily: FONT_PRIMARY }}>
                  Quick Navigation Links:
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => handleAction("/reports-list")} style={{ background: T.white, border: `1px solid ${T.line}`, padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: T.tealDeep, cursor: "pointer", fontFamily: FONT_PRIMARY }}>
                    Reports Archive
                  </button>
                  <button onClick={() => handleAction("/partners")} style={{ background: T.white, border: `1px solid ${T.line}`, padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: T.tealDeep, cursor: "pointer", fontFamily: FONT_PRIMARY }}>
                    Partner Roster
                  </button>
                  <button onClick={() => handleAction("/coverage-dashboard")} style={{ background: T.white, border: `1px solid ${T.line}`, padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: T.tealDeep, cursor: "pointer", fontFamily: FONT_PRIMARY }}>
                    Coverage Metrics
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          9. FULL-WIDTH CALL TO ACTION BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0B3C46 0%, #12707E 100%)",
        color: T.white,
        padding: "80px 24px",
        textAlign: "center",
        width: "100%",
        position: "relative",
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.32)",
            borderRadius: 30,
            padding: "6px 18px",
            fontSize: 13,
            fontFamily: FONT_MONO,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 20,
            color: "#C2E8E4",
          }}>
            Humanitarian Accountability
          </div>

          <h2 style={{
            fontFamily: FONT_PRIMARY,
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 800,
            margin: "0 0 20px",
            lineHeight: 1.2,
          }}>
            Are You Delivering Life-Saving WASH Activities in the North East?
          </h2>

          <p style={{
            fontSize: 18,
            color: "#D6F0ED",
            lineHeight: 1.65,
            margin: "0 auto 38px",
            maxWidth: 740,
            fontFamily: FONT_PRIMARY,
          }}>
            Make sure your interventions are reflected in inter-agency coverage maps, sector bulletins,
            and donor humanitarian funding overviews.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              id="cta-submit-btn"
              onClick={() => handleAction("/submit-report")}
              style={{
                background: T.clay,
                color: T.white,
                border: "none",
                borderRadius: 10,
                padding: "16px 34px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT_PRIMARY,
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = T.clayHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.clay)}
            >
              Submit Your 5W Data Now <IcoArrowRight size={17} />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: T.white,
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  borderRadius: 10,
                  padding: "16px 30px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_PRIMARY,
                }}
              >
                Access Coordinator Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: T.white,
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  borderRadius: 10,
                  padding: "16px 30px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_PRIMARY,
                }}
              >
                Partner Login Portal
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          10. STANDARD MULTI-COLUMN WEBSITE FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      {/* =========================================================================
          SECTION 7: STREAMLINED & ACCESSIBLE FOOTER
          Clean, legible, and simple with increased typography
      ========================================================================== */}
      <footer style={{
        background: "#071B20",
        color: "#A2BFC4",
        padding: "72px clamp(20px, 3.5vw, 48px) 36px",
        width: "100%",
        borderTop: "3px solid #C1722F",
        fontFamily: FONT_PRIMARY,
      }}>
        <div style={{ width: "100%" }}>

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

              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#9BB7BC", margin: "0 0 20px" }}>
                The WASH Sector coordinates humanitarian water, sanitation, and hygiene assistance across the conflict-affected states of Borno, Adamawa, and Yobe in North East Nigeria.
              </p>

              <div style={{
                fontSize: 13.5,
                color: "#C2E8E4",
                background: "rgba(255,255,255,0.05)",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: FONT_MONO,
                lineHeight: 1.5,
              }}>
                <i className="fa-solid fa-location-dot" style={{ color: "#E09A52", marginRight: 10, fontSize: 14 }}></i>
                <strong>Active Nodes:</strong> Maiduguri Central, Yola, Damaturu Sub-Offices.
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
                  <a
                    href="#overview"
                    style={{ color: "#A2BFC4", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Portal Overview
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => handleAction("/submit-report")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Submit 5W Monthly Report
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAction("/coverage-dashboard")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Response Coverage Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAction("/partners")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    Humanitarian Partner Roster
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAction("/reports-list")}
                    style={{ background: "none", border: "none", padding: 0, color: "#A2BFC4", cursor: "pointer", fontSize: 15.5, fontFamily: FONT_PRIMARY, transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A2BFC4")}
                  >
                    All Submitted Reports
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

          {/* Bottom Bar: Copyright & Humanitarian Principles */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 26,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 14,
            color: "#83A2A8",
          }}>
            <div>
              © 2026 WASH Sector North East Nigeria. All rights reserved. Managed under the humanitarian cluster approach.
            </div>

            <div style={{ display: "flex", gap: 16, fontFamily: FONT_PRIMARY, fontWeight: 500, fontSize: 13.5, color: "#A2BFC4" }}>
              <span>Humanity</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>Neutrality</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>Impartiality</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>Operational Independence</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
