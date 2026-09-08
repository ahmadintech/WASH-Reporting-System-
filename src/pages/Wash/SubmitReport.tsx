import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import {
  LGA_BY_STATE,
  ACTIVITY_CATEGORIES,
  POPULATION_GROUPS,
  LOCATION_TYPES,
  UNITS,
  ORG_TYPES,
} from "../../types/wash";

export default function SubmitReport() {
  const { addReport } = useWashData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Active section tracker
  const [activeSection, setActiveSection] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  // 01 WHO
  const [orgName, setOrgName] = useState(currentUser.organization || "");
  const [orgType, setOrgType] = useState(currentUser.organizationType || "International NGO");
  const [focalPoint, setFocalPoint] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [donor, setDonor] = useState("");

  // 02 WHAT
  const [activityType, setActivityType] = useState("");
  const [activityOther, setActivityOther] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [unit, setUnit] = useState("");
  const [indicatorDesc, setIndicatorDesc] = useState("");

  // 03 WHERE
  const [state, setState] = useState<"Borno" | "Adamawa" | "Yobe">("Borno");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [settlement, setSettlement] = useState("");
  const [locationType, setLocationType] = useState("IDP camp / camp-like setting");

  // 04 WHEN
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [status, setStatus] = useState<"Planned" | "Ongoing" | "Completed">("Completed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 05 FOR WHOM
  const [populationGroup, setPopulationGroup] = useState("IDPs in camps");
  const [pwd, setPwd] = useState<number>(0);
  const [men, setMen] = useState<number>(0);
  const [women, setWomen] = useState<number>(0);
  const [boys, setBoys] = useState<number>(0);
  const [girls, setGirls] = useState<number>(0);

  // Auto-calculated total
  const totalBeneficiaries = (Number(men) || 0) + (Number(women) || 0) + (Number(boys) || 0) + (Number(girls) || 0);

  // Demographic percentages
  const pctMen = totalBeneficiaries > 0 ? Math.round(((Number(men) || 0) / totalBeneficiaries) * 100) : 0;
  const pctWomen = totalBeneficiaries > 0 ? Math.round(((Number(women) || 0) / totalBeneficiaries) * 100) : 0;
  const pctBoys = totalBeneficiaries > 0 ? Math.round(((Number(boys) || 0) / totalBeneficiaries) * 100) : 0;
  const pctGirls = totalBeneficiaries > 0 ? Math.max(0, 100 - (pctMen + pctWomen + pctBoys)) : 0;

  const availableLgas = LGA_BY_STATE[state] || [];

  // Validation status for each of the 5 sections
  const isSec1Valid = Boolean(orgName.trim() && orgType && focalPoint.trim() && email.trim());
  const isSec2Valid = Boolean(activityType && (activityType !== "Other" || activityOther.trim()) && Number(quantity) > 0 && unit);
  const isSec3Valid = Boolean(state && lga && locationType);
  const isSec4Valid = Boolean(period && status);
  const isSec5Valid = Boolean(populationGroup && totalBeneficiaries > 0);

  const completedSectionsCount = [isSec1Valid, isSec2Valid, isSec3Valid, isSec4Valid, isSec5Valid].filter(Boolean).length;

  const scrollToSection = (id: string, index: number) => {
    setActiveSection(index);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStateChange = (selectedState: "Borno" | "Adamawa" | "Yobe") => {
    setState(selectedState);
    setLga(""); // Reset LGA selection when state changes
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear this 5W activity form?")) {
      setOrgName(currentUser.organization || "");
      setFocalPoint(currentUser.name || "");
      setEmail(currentUser.email || "");
      setDonor("");
      setActivityType("");
      setActivityOther("");
      setQuantity("");
      setUnit("");
      setIndicatorDesc("");
      setLga("");
      setWard("");
      setSettlement("");
      setStartDate("");
      setEndDate("");
      setPwd(0);
      setMen(0);
      setWomen(0);
      setBoys(0);
      setGirls(0);
      setActiveSection(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activityType) {
      alert("Please select an activity type in Section 02 (WHAT).");
      scrollToSection("sec-what", 1);
      return;
    }
    if (!lga) {
      alert(`Please select an LGA in ${state} in Section 03 (WHERE).`);
      scrollToSection("sec-where", 2);
      return;
    }
    if (totalBeneficiaries <= 0) {
      if (!window.confirm("Total beneficiaries is 0. Are you sure you want to submit without disaggregated reach data?")) {
        scrollToSection("sec-whom", 4);
        return;
      }
    }

    addReport({
      orgName: orgName.trim(),
      orgType,
      focalPoint: focalPoint.trim(),
      email: email.trim(),
      donor: donor.trim(),
      activityType,
      activityOther: activityOther.trim(),
      quantity: Number(quantity) || 0,
      unit,
      indicatorDesc: indicatorDesc.trim(),
      state,
      lga,
      ward: ward.trim(),
      settlement: settlement.trim(),
      locationType,
      period,
      status,
      startDate,
      endDate,
      populationGroup,
      pwd: Number(pwd) || 0,
      men: Number(men) || 0,
      women: Number(women) || 0,
      boys: Number(boys) || 0,
      girls: Number(girls) || 0,
      total: totalBeneficiaries,
      submittedByRole: currentUser.role,
      submittedByEmail: currentUser.email,
    });

    setToastMessage("5W Activity Report submitted successfully!");
    setTimeout(() => {
      setToastMessage(null);
      navigate("/coverage-dashboard");
    }, 1200);
  };

  const sectionsNav = [
    { id: "sec-who", num: "01", label: "WHO", title: "Organisation", valid: isSec1Valid },
    { id: "sec-what", num: "02", label: "WHAT", title: "Activity", valid: isSec2Valid },
    { id: "sec-where", num: "03", label: "WHERE", title: "Location", valid: isSec3Valid },
    { id: "sec-when", num: "04", label: "WHEN", title: "Period", valid: isSec4Valid },
    { id: "sec-whom", num: "05", label: "FOR WHOM", title: "Beneficiaries", valid: isSec5Valid },
  ];

  return (
    <>
      <PageMeta
        title="Submit 5W Report | WASH Sector North East Nigeria"
        description="Submit monthly WASH response data across Borno, Adamawa, and Yobe"
      />

      {/* Expanded container for maximum screen efficiency */}
      <div className="w-full space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-99999 rounded-xl bg-emerald-700 text-white px-5 py-3.5 shadow-2xl flex items-center gap-3 border border-emerald-500 animate-bounce">
            <svg className="w-6 h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <div className="text-sm font-bold">{toastMessage}</div>
              <div className="text-xs text-emerald-100">Redirecting to Coverage Dashboard...</div>
            </div>
          </div>
        )}

        {/* Sleek Top Stepper & Matrix Navigation Bar */}
        <div className="sticky top-16 z-30 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/90 dark:border-gray-700 shadow-sm p-3.5 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* 5W Section Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 flex-1">
              {sectionsNav.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id, idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeSection === idx
                      ? "bg-brand-600 text-white shadow-sm ring-2 ring-brand-500/30"
                      : "bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        activeSection === idx
                          ? "bg-white/20 text-white"
                          : "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300"
                      }`}
                    >
                      {sec.num}
                    </span>
                    <span className="truncate">{sec.label}</span>
                  </div>
                  {sec.valid ? (
                    <span
                      title="Section requirements satisfied"
                      className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        activeSection === idx ? "bg-white text-brand-600" : "bg-emerald-500 text-white"
                      }`}
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      title="Incomplete section"
                      className={`shrink-0 w-2 h-2 rounded-full ${
                        activeSection === idx ? "bg-white/40" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Quick Status / Total Pill & Direct Action */}
            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  Total Reached:
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  {totalBeneficiaries.toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                {completedSectionsCount}/5 Complete
              </div>
            </div>
          </div>
        </div>

        {/* Main 5W Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= 01 WHO ================= */}
          <div
            id="sec-who"
            className={`rounded-2xl border bg-white dark:bg-gray-800/95 p-6 sm:p-8 shadow-sm transition-all duration-200 ${
              activeSection === 0
                ? "border-brand-500 ring-2 ring-brand-500/10 shadow-md"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(0)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-700 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                  01
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>WHO — Reporting Organisation</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Implementing agency, institutional classification, focal point, and donor partner
                  </p>
                </div>
              </div>
              <div>
                {isSec1Valid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Section Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Required Fields Pending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Organisation Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Action Against Hunger (ACF), UNICEF, Solidarités"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Organisation Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Donor / Funding Stream
                </label>
                <input
                  type="text"
                  value={donor}
                  onChange={(e) => setDonor(e.target.value)}
                  placeholder="e.g. BHA / USAID, ECHO, NHF, CERF"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Focal Point Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={focalPoint}
                  onChange={(e) => setFocalPoint(e.target.value)}
                  placeholder="Full name of reporting officer"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Focal Point Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="focalpoint@organisation.org"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ================= 02 WHAT ================= */}
          <div
            id="sec-what"
            className={`rounded-2xl border bg-white dark:bg-gray-800/95 p-6 sm:p-8 shadow-sm transition-all duration-200 ${
              activeSection === 1
                ? "border-brand-500 ring-2 ring-brand-500/10 shadow-md"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(1)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-700 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                  02
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>WHAT — Activity & Output Metrics</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    WASH sub-sector intervention, output quantity delivered, and technical specifications
                  </p>
                </div>
              </div>
              <div>
                {isSec2Valid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Section Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Required Fields Pending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Standard Activity Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="">Select standard WASH intervention</option>
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <optgroup key={cat.category} label={cat.category}>
                      {cat.activities.map((act) => (
                        <option key={act} value={act}>
                          {act}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Other">Other customized activity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Quantity Delivered <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Unit of Measurement <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="">Select Unit</option>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {activityType === "Other" && (
                <div className="col-span-full">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Specify Custom Activity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activityOther}
                    onChange={(e) => setActivityOther(e.target.value)}
                    placeholder="Describe specific intervention"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              )}

              <div className="col-span-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Indicator & Technical Description
                </label>
                <textarea
                  rows={2}
                  value={indicatorDesc}
                  onChange={(e) => setIndicatorDesc(e.target.value)}
                  placeholder="Detailed description of works delivered, technical specs (e.g., motorized borehole yield, chlorination dosing 0.5mg/L, latrine stances, or kit components)"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all resize-y"
                />
              </div>
            </div>
          </div>

          {/* ================= 03 WHERE ================= */}
          <div
            id="sec-where"
            className={`rounded-2xl border bg-white dark:bg-gray-800/95 p-6 sm:p-8 shadow-sm transition-all duration-200 ${
              activeSection === 2
                ? "border-brand-500 ring-2 ring-brand-500/10 shadow-md"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(2)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-700 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                  03
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>WHERE — Geographical Location</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Operational state, Local Government Area (LGA), ward, and settlement or camp name
                  </p>
                </div>
              </div>
              <div>
                {isSec3Valid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Section Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Required Fields Pending
                  </span>
                )}
              </div>
            </div>

            {/* Quick State Selector Buttons */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Operational State <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["Borno", "Adamawa", "Yobe"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStateChange(st)}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      state === st
                        ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span>{st}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                        state === st
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {LGA_BY_STATE[st].length} LGAs
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  LGA in {state} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="">Select LGA ({availableLgas.length} available)</option>
                  {availableLgas.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Location Setting Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  {LOCATION_TYPES.map((lt) => (
                    <option key={lt} value={lt}>
                      {lt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Ward
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Bolori II, Hausari, Galtimari"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="col-span-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Settlement / Camp / Community Name
                </label>
                <input
                  type="text"
                  value={settlement}
                  onChange={(e) => setSettlement(e.target.value)}
                  placeholder="e.g. Bakassi IDP Camp, Stadium Camp, Teachers Village, Custom House IDP Settlement"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ================= 04 WHEN ================= */}
          <div
            id="sec-when"
            className={`rounded-2xl border bg-white dark:bg-gray-800/95 p-6 sm:p-8 shadow-sm transition-all duration-200 ${
              activeSection === 3
                ? "border-brand-500 ring-2 ring-brand-500/10 shadow-md"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(3)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-700 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                  04
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>WHEN — Reporting Period & Timeline</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reporting month cycle, implementation phase status, and activity milestones
                  </p>
                </div>
              </div>
              <div>
                {isSec4Valid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Section Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Required Fields Pending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Reporting Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Implementation Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-900/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                  {(["Completed", "Ongoing", "Planned"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                        status === st
                          ? st === "Completed"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : st === "Ongoing"
                            ? "bg-sky-600 text-white shadow-sm"
                            : "bg-amber-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Activity Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Activity End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ================= 05 FOR WHOM ================= */}
          <div
            id="sec-whom"
            className={`rounded-2xl border bg-white dark:bg-gray-800/95 p-6 sm:p-8 shadow-sm transition-all duration-200 ${
              activeSection === 4
                ? "border-brand-500 ring-2 ring-brand-500/10 shadow-md"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(4)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-700 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                  05
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>FOR WHOM — Disaggregated Beneficiaries (SADD)</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Population classification, sex and age disaggregated reach, and persons with disabilities
                  </p>
                </div>
              </div>
              <div>
                {isSec5Valid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Section Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Reach Data Required
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Target Population Group <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={populationGroup}
                  onChange={(e) => setPopulationGroup(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  {POPULATION_GROUPS.map((pg) => (
                    <option key={pg} value={pg}>
                      {pg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Persons with Disabilities Reached (PWD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={pwd}
                  onChange={(e) => setPwd(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>

            {/* Sex & Age Disaggregation (SADD) 4 Cards */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                Sex & Age Disaggregation (SADD)
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1.5">
                    <span>Men (18+)</span>
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{pctMen}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={men}
                    onChange={(e) => setMen(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-3 py-2 text-base font-mono font-bold text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-900 dark:text-rose-200 mb-1.5">
                    <span>Women (18+)</span>
                    <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400">{pctWomen}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={women}
                    onChange={(e) => setWomen(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-lg border border-rose-200 dark:border-rose-800 bg-white dark:bg-gray-900 px-3 py-2 text-base font-mono font-bold text-gray-900 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1.5">
                    <span>Boys (&lt;18)</span>
                    <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">{pctBoys}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={boys}
                    onChange={(e) => setBoys(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 px-3 py-2 text-base font-mono font-bold text-gray-900 dark:text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1.5">
                    <span>Girls (&lt;18)</span>
                    <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400">{pctGirls}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={girls}
                    onChange={(e) => setGirls(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 px-3 py-2 text-base font-mono font-bold text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Total Beneficiaries Showcase & Demographic Distribution Bar */}
            <div className="rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Total Calculated Beneficiaries
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Sum of Men + Women + Boys + Girls
                    </div>
                  </div>
                </div>

                <div className="font-mono text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 tracking-tight">
                  {totalBeneficiaries.toLocaleString()}
                </div>
              </div>

              {/* Progress segments breakdown */}
              {totalBeneficiaries > 0 && (
                <div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                    <div style={{ width: `${pctMen}%` }} className="bg-blue-500 h-full transition-all" title={`Men: ${pctMen}%`} />
                    <div style={{ width: `${pctWomen}%` }} className="bg-rose-500 h-full transition-all" title={`Women: ${pctWomen}%`} />
                    <div style={{ width: `${pctBoys}%` }} className="bg-amber-500 h-full transition-all" title={`Boys: ${pctBoys}%`} />
                    <div style={{ width: `${pctGirls}%` }} className="bg-purple-500 h-full transition-all" title={`Girls: ${pctGirls}%`} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Men ({pctMen}%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Women ({pctWomen}%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Boys ({pctBoys}%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Girls ({pctGirls}%)
                      </span>
                    </div>
                    <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {pwd > 0 ? `PWD: ${pwd.toLocaleString()} (${Math.round((pwd / totalBeneficiaries) * 100)}%)` : "No PWD reported"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Submitted reports update the Borno, Adamawa & Yobe response matrix in real-time.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-brand-600 hover:bg-brand-700 px-8 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Submit 5W Report</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
