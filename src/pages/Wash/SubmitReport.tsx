import React, { useState } from "react";
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

  // Active section index for pentagon highlight (0 to 4, or -1)
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

  // Pentagon nodes calculation (5 nodes for 5W)
  const cx = 23, cy = 23, r = 15;
  const pentNodes = Array.from({ length: 5 }).map((_, i) => {
    const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
    return {
      x: cx + r * Math.cos(ang),
      y: cy + r * Math.sin(ang),
    };
  });

  const availableLgas = LGA_BY_STATE[state] || [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value as "Borno" | "Adamawa" | "Yobe";
    setState(newState);
    setLga(""); // Reset LGA selection when state changes
  };

  const handleReset = () => {
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
    setActiveSection(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activityType) {
      alert("Please select an activity type.");
      return;
    }
    if (!lga) {
      alert(`Please select an LGA in ${state}.`);
      return;
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

    setToastMessage("Report submitted successfully — thank you!");
    setTimeout(() => {
      setToastMessage(null);
      navigate("/coverage-dashboard");
    }, 1500);
  };

  return (
    <>
      <PageMeta
        title="Submit 5W Report | WASH Sector North East Nigeria"
        description="Submit monthly WASH response data across Borno, Adamawa, and Yobe"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Pentagon signature progress header */}
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <svg className="shrink-0" width="46" height="46" viewBox="0 0 46 46">
            {pentNodes.map((p, i) => {
              const next = pentNodes[(i + 1) % 5];
              return (
                <line
                  key={`edge-${i}`}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="#12707E"
                  strokeWidth="1.6"
                  opacity="0.5"
                />
              );
            })}
            {pentNodes.map((p, i) => (
              <circle
                key={`node-${i}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                className={`transition-all duration-300 ${
                  activeSection === i
                    ? "fill-clay-500 stroke-2 stroke-white scale-125"
                    : "fill-brand-500"
                }`}
              />
            ))}
          </svg>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Complete each of the five sections —{" "}
            <strong className="text-brand-700 dark:text-brand-300">
              01 Who, 02 What, 03 Where, 04 When, 05 For Whom
            </strong>{" "}
            — to submit a valid humanitarian 5W activity report.
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-99999 rounded-xl bg-brand-700 text-white px-5 py-3 shadow-2xl flex items-center gap-3 animate-bounce">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= 01 WHO ================= */}
          <div
            className={`rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 ${
              activeSection === 0
                ? "border-brand-500 ring-2 ring-brand-500/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(0)}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-clay-100 text-clay-700 dark:bg-clay-950/40 dark:text-clay-300">
                  01 · WHO
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Reporting Organisation
                </h2>
              </div>
              <span className="text-xs text-gray-400">The partner delivering the activity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Organisation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Solidarités International"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Organisation Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Focal Point Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={focalPoint}
                  onChange={(e) => setFocalPoint(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Focal Point Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="focalpoint@organisation.org"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Donor / Funding Source
                </label>
                <input
                  type="text"
                  value={donor}
                  onChange={(e) => setDonor(e.target.value)}
                  placeholder="e.g. BHA / USAID, ECHO, NHF, CERF, FCDO"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* ================= 02 WHAT ================= */}
          <div
            className={`rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 ${
              activeSection === 1
                ? "border-brand-500 ring-2 ring-brand-500/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(1)}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-clay-100 text-clay-700 dark:bg-clay-950/40 dark:text-clay-300">
                  02 · WHAT
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Activity Details
                </h2>
              </div>
              <span className="text-xs text-gray-400">The specific intervention delivered</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Activity Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Select Activity</option>
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <optgroup key={cat.category} label={cat.category}>
                      {cat.activities.map((act) => (
                        <option key={act} value={act}>
                          {act}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Other">Other activity</option>
                </select>
              </div>

              {activityType === "Other" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Specify Other Activity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activityOther}
                    onChange={(e) => setActivityOther(e.target.value)}
                    placeholder="Describe custom activity"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Quantity Delivered <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Select Unit</option>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Indicator / Activity Description
                </label>
                <textarea
                  rows={2}
                  value={indicatorDesc}
                  onChange={(e) => setIndicatorDesc(e.target.value)}
                  placeholder="Brief description of what was delivered, standard specifications, or HNRP indicator reference"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-y"
                />
              </div>
            </div>
          </div>

          {/* ================= 03 WHERE ================= */}
          <div
            className={`rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 ${
              activeSection === 2
                ? "border-brand-500 ring-2 ring-brand-500/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(2)}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-clay-100 text-clay-700 dark:bg-clay-950/40 dark:text-clay-300">
                  03 · WHERE
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Location (Borno · Adamawa · Yobe)
                </h2>
              </div>
              <span className="text-xs text-gray-400">Down to ward and settlement</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={state}
                  onChange={handleStateChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Borno">Borno</option>
                  <option value="Adamawa">Adamawa</option>
                  <option value="Yobe">Yobe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  LGA in {state} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {LOCATION_TYPES.map((lt) => (
                    <option key={lt} value={lt}>
                      {lt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Ward
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Bolori II"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Settlement / Camp Name
                </label>
                <input
                  type="text"
                  value={settlement}
                  onChange={(e) => setSettlement(e.target.value)}
                  placeholder="e.g. Bakassi IDP Camp, Stadium Camp, Galtimari Community"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* ================= 04 WHEN ================= */}
          <div
            className={`rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 ${
              activeSection === 3
                ? "border-brand-500 ring-2 ring-brand-500/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(3)}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-clay-100 text-clay-700 dark:bg-clay-950/40 dark:text-clay-300">
                  04 · WHEN
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Reporting Period & Timing
                </h2>
              </div>
              <span className="text-xs text-gray-400">Month and status of delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Reporting Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Planned" | "Ongoing" | "Completed")}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* ================= 05 FOR WHOM ================= */}
          <div
            className={`rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 ${
              activeSection === 4
                ? "border-brand-500 ring-2 ring-brand-500/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onFocus={() => setActiveSection(4)}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-clay-100 text-clay-700 dark:bg-clay-950/40 dark:text-clay-300">
                  05 · FOR WHOM
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Beneficiaries Reached (Disaggregated)
                </h2>
              </div>
              <span className="text-xs text-gray-400">Sex and age breakdown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Population Group <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={populationGroup}
                  onChange={(e) => setPopulationGroup(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {POPULATION_GROUPS.map((pg) => (
                    <option key={pg} value={pg}>
                      {pg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Persons with Disabilities Reached (PWD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={pwd}
                  onChange={(e) => setPwd(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Sex & Age breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Men (18+)
                </label>
                <input
                  type="number"
                  min="0"
                  value={men}
                  onChange={(e) => setMen(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Women (18+)
                </label>
                <input
                  type="number"
                  min="0"
                  value={women}
                  onChange={(e) => setWomen(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Boys (&lt;18)
                </label>
                <input
                  type="number"
                  min="0"
                  value={boys}
                  onChange={(e) => setBoys(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Girls (&lt;18)
                </label>
                <input
                  type="number"
                  min="0"
                  value={girls}
                  onChange={(e) => setGirls(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Total Beneficiaries Chip */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3.5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-medium">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Total Beneficiaries (Auto-calculated sum)</span>
              </div>
              <span className="font-mono text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-200">
                {totalBeneficiaries.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="rounded-lg bg-clay-500 hover:bg-clay-600 px-7 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Submit 5W Report →
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Submitted reports are instantly synchronized with the North East Nigeria WASH 5W coordination platform.
          </p>
        </form>
      </div>
    </>
  );
}
