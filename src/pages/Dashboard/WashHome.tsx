import React from "react";
import { useNavigate } from "react-router";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";

/* ─── number formatter ─────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

/* ─── colour tokens ─────────────────────────────────────────────── */
const T = {
  tealDeep: "#0B3C46",
  teal:     "#12707E",
  tealSoft: "#E4F0EF",
  clay:     "#C1722F",
  claySoft: "#F3DFC9",
  green:    "#3F7D4E",
  greenSoft:"#E4F1E6",
  ink:      "#16262A",
  inkSoft:  "#4B5D60",
  line:     "#D8DDD4",
  surf:     "#FFFFFF",
  subtle:   "#F3F4EF",
};

/* ─── SVG icons ─────────────────────────────────────────────────── */
const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IcoFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IcoBar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IcoUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoClip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const IcoDrop = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);
const IcoShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IcoInfo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IcoMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IcoCal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoWarn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ─── 5W steps data ─────────────────────────────────────────────── */
const STEPS = [
  { code:"01 · WHO",      label:"Your organisation",  desc:"Name, type and focal point submitting the report.",     icon:<IcoUsers /> },
  { code:"02 · WHAT",     label:"The activity",        desc:"Water, sanitation or hygiene intervention delivered.",  icon:<IcoDrop /> },
  { code:"03 · WHERE",    label:"The location",        desc:"State, LGA, ward and settlement of delivery.",          icon:<IcoPin /> },
  { code:"04 · WHEN",     label:"The period",          desc:"Reporting month, status, and activity dates.",          icon:<IcoCal /> },
  { code:"05 · FOR WHOM", label:"The beneficiaries",   desc:"Population group and sex/age disaggregation.",          icon:<IcoHeart /> },
];

/* ─── Hero button ─────────────────────────────────────────────────── */
function HeroBtn({ id, primary, label, icon, onClick }: { id:string; primary:boolean; label:string; icon:React.ReactNode; onClick:()=>void }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button id={id} onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: primary ? (hov?"#a85d24":"#C1722F") : (hov?"rgba(255,255,255,0.16)":"rgba(255,255,255,0.08)"),
        color:"#fff",
        border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.35)",
        borderRadius:9, padding:"13px 22px", fontWeight: primary?700:600, fontSize:14,
        cursor:"pointer", display:"flex", alignItems:"center", gap:8,
        transition:"background .15s", fontFamily:"inherit",
      }}
    >
      {icon} {label} {primary && <IcoArrow />}
    </button>
  );
}

/* ─── Action card ─────────────────────────────────────────────────── */
function ActionCard({ id, tag, tagColor, tagBg, title, desc, cta, icon, accent, onClick }:
  { id:string; tag:string; tagColor:string; tagBg:string; title:string; desc:string; cta:string; icon:React.ReactNode; accent:string; onClick:()=>void }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button id={id} onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:T.surf, border:`1.5px solid ${hov?accent:T.line}`, borderRadius:14,
        padding:"22px 22px 20px", cursor:"pointer", textAlign:"left", outline:"none", width:"100%",
        transform:hov?"translateY(-3px)":"translateY(0)",
        boxShadow:hov?"0 10px 28px rgba(0,0,0,0.09)":"none",
        transition:"border-color .15s, transform .14s, box-shadow .15s",
        fontFamily:"inherit",
      }}
    >
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:tagColor,background:tagBg,padding:"3px 10px",borderRadius:5,letterSpacing:"0.05em",fontWeight:600}}>{tag}</span>
        <span style={{color:tagColor,opacity:0.7}}>{icon}</span>
      </div>
      <h3 style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:17,margin:"0 0 8px",color:T.tealDeep,fontWeight:700}}>{title}</h3>
      <p style={{fontSize:13.5,color:T.inkSoft,margin:"0 0 18px",lineHeight:1.55}}>{desc}</p>
      <span style={{fontSize:13,fontWeight:700,color:accent,display:"flex",alignItems:"center",gap:6}}>{cta} <IcoArrow /></span>
    </button>
  );
}

/* ─── Quick pill ──────────────────────────────────────────────────── */
function Pill({ label, color, onClick }: { label:string; color:string; onClick:()=>void }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        fontSize:12, fontWeight:600, padding:"5px 12px", borderRadius:20, color:"#fff",
        background:color, border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:5,
        opacity:hov?0.8:1, transition:"opacity .15s", fontFamily:"inherit",
      }}
    >
      {label} <IcoArrow />
    </button>
  );
}

/* ─── Section title ───────────────────────────────────────────────── */
function STitle({ text }: { text: string }) {
  return (
    <h2 style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:15,color:T.tealDeep,margin:"0 0 16px",display:"flex",alignItems:"center",gap:12,fontWeight:700}}>
      {text}
      <span style={{flex:1,height:1,background:T.line,display:"block"}} />
    </h2>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export default function WashHome() {
  const navigate = useNavigate();
  const { stats, reportingConfig, systemConfig } = useWashData();
  const { currentUser, isAuthenticated } = useAuth();

  const handleNav = (path: string) => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      navigate(path);
    }
  };

  const isPartner = currentUser?.role === "partner";

  const deadline = reportingConfig.deadlineDate
    ? new Date(reportingConfig.deadlineDate).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })
    : "—";

  const daysLeft = reportingConfig.deadlineDate
    ? Math.max(0, Math.ceil((new Date(reportingConfig.deadlineDate).getTime() - Date.now()) / 86_400_000))
    : null;

  const showDeadline = !reportingConfig.isFreezeActive && daysLeft !== null && daysLeft <= 7;

  const cards = [
    { id:"card-submit",    tag:"Report",    tagColor:T.clay,    tagBg:T.claySoft,  title:"Submit your 5W data",                desc:"Log this month's activities — who delivered what, where, when, and for whom — using the standard sector template.", cta:"Go to submission form",   icon:<IcoClip />,   accent:T.clay,    path:"/submit-report" },
    { id:"card-dash",      tag:"Dashboard", tagColor:T.teal,    tagBg:T.tealSoft,  title:"View the coverage dashboard",         desc:"Filter response data by state, LGA, activity and period, review the full report table, and export to CSV.",          cta:"Go to dashboard",         icon:<IcoBar />,    accent:T.teal,    path:"/coverage-dashboard" },
    { id:"card-reports",   tag:"Reports",   tagColor:T.inkSoft, tagBg:T.subtle,    title:"Browse all submitted reports",         desc:"View, filter and manage the full list of 5W submissions. Admins can delete duplicate or erroneous entries.",           cta:"View reports list",       icon:<IcoFile />,   accent:T.inkSoft, path:"/reports-list" },
    ...(!isPartner ? [{ id:"card-partners", tag:"Partners", tagColor:T.green, tagBg:T.greenSoft, title:"Partner organisation directory", desc:"Accredited WASH partners active in Borno, Adamawa, and Yobe. Manage contacts and organisation profiles.", cta:"View partner directory", icon:<IcoShield />, accent:T.green, path:"/partners" }] : []),
  ];

  const contacts = [
    { role:"WASH Sector Coordinator", value:"coordinator@washsector-ne.org", type:"email" as const },
    { role:"Information Management",  value:"im@washsector-ne.org",          type:"email" as const },
    { role:"Reporting helpdesk",      value:"+234 000 000 0000",             type:"phone" as const },
    { role:"Coordination meeting",    value:"Biweekly, Maiduguri",           type:"cal"   as const },
    { role:"Reply-to email",          value:systemConfig.replyToEmail,       type:"email" as const },
  ];

  return (
    <div style={{fontFamily:"'IBM Plex Sans',system-ui,sans-serif",lineHeight:1.5,color:T.ink}}>

      {/* deadline banner */}
      {showDeadline && (
        <div style={{background:"linear-gradient(90deg,#C1722F,#D4893C)",color:"#fff",borderRadius:10,padding:"12px 20px",marginBottom:18,display:"flex",alignItems:"center",gap:10,fontSize:13.5,fontWeight:500}}>
          <IcoWarn />
          <span><strong>Reporting deadline approaching!</strong>&nbsp; Reports are due by <strong>{deadline}</strong> — {daysLeft===0?"today is the last day.":`${daysLeft} day${daysLeft===1?"":"s"} remaining.`}</span>
          <button onClick={()=>handleNav("/submit-report")} style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.45)",color:"#fff",borderRadius:7,padding:"6px 14px",cursor:"pointer",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",fontFamily:"inherit"}}>
            Submit now <IcoArrow />
          </button>
        </div>
      )}

      {/* freeze banner */}
      {reportingConfig.isFreezeActive && (
        <div style={{background:"#F7E5E2",border:"1px solid #f0b8b2",color:"#B94A3D",borderRadius:10,padding:"12px 20px",marginBottom:18,display:"flex",alignItems:"center",gap:10,fontSize:13.5}}>
          <IcoWarn /><span><strong>Reporting window is currently frozen.</strong>&nbsp; New submissions are paused. Contact the sector coordinator for more information.</span>
        </div>
      )}

      {/* ── hero ── */}
      <div style={{background:"linear-gradient(135deg,#0B3C46 0%,#12707E 100%)",borderRadius:16,padding:"46px 40px",color:"#fff",position:"relative",overflow:"hidden",marginBottom:20}}>
        <div style={{position:"absolute",right:-60,top:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}} />
        <div style={{position:"absolute",right:80,bottom:-80,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}} />
        <div style={{position:"absolute",left:-40,bottom:-40,width:160,height:160,borderRadius:"50%",background:"rgba(18,112,126,0.3)",pointerEvents:"none"}} />
        <div style={{position:"absolute",top:20,right:24,fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#BFE3DD",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",padding:"6px 14px",borderRadius:6,letterSpacing:"0.06em",whiteSpace:"nowrap"}}>
          {systemConfig.leadAgency}
        </div>
        <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11.5,letterSpacing:"0.1em",textTransform:"uppercase",color:"#BFE3DD",margin:"0 0 10px"}}>
          Sector coordination · Borno · Adamawa · Yobe
        </p>
        <h1 style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:"clamp(22px,3.5vw,32px)",fontWeight:700,margin:"0 0 14px",maxWidth:620,lineHeight:1.2}}>
          One home for every WASH partner's 5W reporting and coverage data.
        </h1>
        <p style={{maxWidth:560,color:"#DCEEEC",fontSize:14.5,margin:"0 0 28px",lineHeight:1.55}}>
          Submit your monthly activity data in minutes, and see who is doing what, where, across the North East Nigeria response — updated as soon as partners report.
        </p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",position:"relative",zIndex:1}}>
          <HeroBtn id="hero-submit" primary label="Submit a 5W report" icon={<IcoClip />} onClick={()=>handleNav("/submit-report")} />
          <HeroBtn id="hero-dash"   primary={false} label="Open coverage dashboard" icon={<IcoBar />} onClick={()=>handleNav("/coverage-dashboard")} />
        </div>
      </div>

      {/* ── snapshot strip ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:1,background:T.line,border:`1px solid ${T.line}`,borderRadius:12,overflow:"hidden",marginBottom:24}}>
        {[
          { label:"Reports on record",    value:fmt(stats.totalReports),       icon:<IcoFile /> },
          { label:"Beneficiaries reached",value:fmt(stats.totalBeneficiaries), icon:<IcoHeart /> },
          { label:"Partners reporting",   value:fmt(stats.totalPartners),       icon:<IcoUsers /> },
          { label:"LGAs covered",         value:fmt(stats.totalLgas),           icon:<IcoPin /> },
        ].map(s=>(
          <div key={s.label} style={{background:T.surf,padding:"18px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{color:T.teal,opacity:.7}}>{s.icon}</span>
              <span style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em",color:T.inkSoft}}>{s.label}</span>
            </div>
            <div style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:28,color:T.tealDeep,fontWeight:700,letterSpacing:"-0.5px"}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── action cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:28}}>
        {cards.map(c=><ActionCard key={c.id} {...c} onClick={()=>handleNav(c.path)} />)}
      </div>

      {/* ── 5W steps ── */}
      <div style={{marginBottom:28}}>
        <STitle text="How 5W reporting works" />
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:12}}>
          {STEPS.map((s,i)=>(
            <div key={s.code} style={{background:T.surf,border:`1px solid ${T.line}`,borderRadius:12,padding:"16px 16px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-6,bottom:-14,fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:70,fontWeight:700,color:T.subtle,lineHeight:1,pointerEvents:"none",userSelect:"none"}}>
                {String(i+1).padStart(2,"0")}
              </div>
              <div style={{marginBottom:10,color:T.teal}}>{s.icon}</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:T.clay,letterSpacing:"0.05em",marginBottom:6}}>{s.code}</div>
              <h4 style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:13.5,margin:"0 0 5px",color:T.tealDeep,fontWeight:700}}>{s.label}</h4>
              <p style={{fontSize:12,color:T.inkSoft,margin:0,lineHeight:1.5,position:"relative"}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── info grid ── */}
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1.4fr) minmax(0,1fr)",gap:16,marginBottom:8}}>

        {/* resources */}
        <div style={{background:T.surf,border:`1px solid ${T.line}`,borderRadius:12,padding:"22px 24px"}}>
          <h3 style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:15,margin:"0 0 16px",color:T.tealDeep,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:T.teal}}><IcoInfo /></span> Sector resources &amp; reporting rules
          </h3>
          <ul style={{margin:0,padding:0,listStyle:"none"}}>
            {[
              { icon:"📅", text:<span>5W reporting is due by the <strong>last working day of every month</strong>, covering the month just ended. Next deadline: <strong>{deadline}</strong></span> },
              { icon:"📋", text:"Use one submission per activity, per location, per reporting month — submit multiple reports for multiple sites." },
              { icon:"👥", text:"Beneficiary figures should reflect people reached in the current reporting month only, not cumulative totals." },
              { icon:"⚡", text:`Active reporting cycle: ${reportingConfig.activeCycle||"—"}${reportingConfig.notes?" — "+reportingConfig.notes:""}` },
            ].map((item,i,arr)=>(
              <li key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13.5,lineHeight:1.55,paddingBottom:12,marginBottom:12,borderBottom:i<arr.length-1?"1px solid #EEF0EA":"none",color:T.ink}}>
                <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div style={{paddingTop:14,borderTop:"1px solid #EEF0EA"}}>
            <p style={{fontSize:11.5,color:T.inkSoft,margin:"0 0 10px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>Activity categories</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[
                {label:"Water Supply",      color:T.teal,    bg:T.tealSoft},
                {label:"Sanitation",         color:T.green,   bg:T.greenSoft},
                {label:"Hygiene",            color:T.clay,    bg:T.claySoft},
                {label:"Institutional WASH", color:T.inkSoft, bg:T.subtle},
              ].map(cat=>(
                <span key={cat.label} style={{fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,color:cat.color,background:cat.bg}}>{cat.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* contacts */}
        <div style={{background:T.surf,border:`1px solid ${T.line}`,borderRadius:12,padding:"22px 24px"}}>
          <h3 style={{fontFamily:"'Space Grotesk',system-ui,sans-serif",fontSize:15,margin:"0 0 16px",color:T.tealDeep,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:T.teal}}><IcoUsers /></span> Sector contacts
          </h3>
          {contacts.map((c,i)=>(
            <div key={c.role} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13.5,padding:"10px 0",borderBottom:i<contacts.length-1?"1px solid #EEF0EA":"none",gap:10}}>
              <span style={{color:T.inkSoft,flexShrink:0}}>{c.role}</span>
              <span style={{color:T.tealDeep,display:"flex",alignItems:"center",gap:6,fontWeight:500}}>
                {c.type==="email"?<span style={{color:T.teal}}><IcoMail /></span>:c.type==="phone"?<span style={{color:T.clay}}><IcoPhone /></span>:<span style={{color:T.green}}><IcoCal /></span>}
                {c.type==="email"?<a href={`mailto:${c.value}`} style={{color:T.teal,textDecoration:"none"}}>{c.value}</a>:c.value}
              </span>
            </div>
          ))}
          <div style={{marginTop:18,paddingTop:16,borderTop:"1px solid #EEF0EA"}}>
            <p style={{fontSize:11.5,color:T.inkSoft,margin:"0 0 10px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>Quick links</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              <Pill label="Submit Report" color={T.clay}    onClick={()=>handleNav("/submit-report")} />
              <Pill label="Coverage Map"  color={T.teal}    onClick={()=>handleNav("/coverage-dashboard")} />
              <Pill label="All Reports"   color={T.inkSoft} onClick={()=>handleNav("/reports-list")} />
              {!isPartner && <Pill label="Partners" color={T.green} onClick={()=>handleNav("/partners")} />}
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <p style={{fontSize:11.5,color:T.inkSoft,marginTop:20,paddingTop:16,borderTop:`1px solid ${T.line}`,textAlign:"center"}}>
        {systemConfig.platformTitle} · {systemConfig.operationalContext} · Lead agency: {systemConfig.leadAgency}
      </p>
    </div>
  );
}
