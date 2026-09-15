import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import WashLogo from "../../components/common/WashLogo";
import {
  WASH_5W_ORGS,
  WASH_5W_ORG_TYPES,
  WASH_5W_DONORS,
  WASH_5W_DOMAINS,
  WASH_5W_ACTIVITIES_BY_DOMAIN,
  WASH_5W_ACTIVITY_DETAILS,
  WASH_5W_EMERGENCY_TYPES,
  WASH_5W_BENEFICIARY_TYPES,
  WASH_5W_STATUS_LIST,
  WASH_5W_SITE_TYPES,
  WASH_5W_HRP_LIST,
  WASH_5W_MONTHS,
  WASH_5W_STATES,
  WASH_5W_LGAS_BY_STATE,
  WASH_5W_WARDS_BY_LGA,
  cleanIndicator,
  cleanUnit,
} from "../../data/wash5wData";

export interface MatrixEntry {
  id: string;
  reportMonth: string;
  reportDate: string;
  orgName: string;
  acronym: string;
  orgType: string;
  donor: string;
  implPartners: string;
  state: string;
  pcode1: string;
  lga: string;
  pcode2: string;
  ward: string;
  pcode3: string;
  siteType: string;
  locationName: string;
  locationPop: string;
  latlong: string;
  emergType: string;
  domain: string;
  activity: string;
  indicator: string;
  unit: string;
  hrp: string;
  qtyPlanned: string;
  qtyAchieved: string;
  benefType: string;
  boys: string;
  girls: string;
  men: string;
  women: string;
  totalBenef: string;
  startDate: string;
  endDate: string;
  status: string;
  comments: string;
}

const REQUIRED_FIELDS: (keyof MatrixEntry)[] = [
  "reportMonth",
  "orgName",
  "state",
  "lga",
  "ward",
  "domain",
  "activity",
  "status",
];

const COLUMNS = [
  { key: "reportMonth", label: "Reporting Month" },
  { key: "reportDate", label: "Date of Reporting" },
  { key: "orgName", label: "Organisation Name" },
  { key: "acronym", label: "Acronym" },
  { key: "orgType", label: "Type" },
  { key: "donor", label: "Donor" },
  { key: "implPartners", label: "Implementing Partners" },
  { key: "state", label: "State" },
  { key: "pcode1", label: "Pcode_ADM1" },
  { key: "lga", label: "LGA" },
  { key: "pcode2", label: "Pcode_ADM2" },
  { key: "ward", label: "Ward" },
  { key: "pcode3", label: "Pcode_ADM3" },
  { key: "siteType", label: "Type of Location" },
  { key: "locationName", label: "Location Name" },
  { key: "locationPop", label: "Location Population" },
  { key: "latlong", label: "Latitude, Longitude" },
  { key: "emergType", label: "Intervention / Emergency Type" },
  { key: "domain", label: "WASH Domain" },
  { key: "activity", label: "Activity" },
  { key: "indicator", label: "Indicators" },
  { key: "unit", label: "Unit" },
  { key: "hrp", label: "Is HRP activity?" },
  { key: "qtyPlanned", label: "Quantity Planned" },
  { key: "qtyAchieved", label: "Quantity Achieved" },
  { key: "benefType", label: "Beneficiary Type" },
  { key: "boys", label: "#Beneficiary Boys" },
  { key: "girls", label: "#Beneficiary Girls" },
  { key: "men", label: "#Beneficiary Men" },
  { key: "women", label: "#Beneficiary Women" },
  { key: "totalBenef", label: "# Total Beneficiary" },
  { key: "startDate", label: "Starting date" },
  { key: "endDate", label: "End date" },
  { key: "status", label: "Status" },
  { key: "comments", label: "Comments" },
];

export default function SubmitReport() {
  const { addReport } = useWashData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [toastMessage, setToastMessage] = useState<{
    title: string;
    subtitle?: string;
    isError?: boolean;
  } | null>(null);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(() => {
    return (
      location.search.includes("form=true") ||
      location.search.includes("start=true") ||
      location.hash === "#form"
    );
  });

  // ========================================================
  // 1. PARTNER CONTACT CARD (WHO)
  // ========================================================
  const initialOrg = currentUser.organization || "";
  const matchedOrg = WASH_5W_ORGS.find(
    (o) => o.name.toLowerCase() === initialOrg.toLowerCase()
  );

  const [pcOrg, setPcOrg] = useState(initialOrg);
  const [pcAcronym, setPcAcronym] = useState(matchedOrg ? matchedOrg.acronym : "");
  const [pcType, setPcType] = useState(currentUser.organizationType || "");
  const [pcContact, setPcContact] = useState("");
  const [pcPhone, setPcPhone] = useState("+234 ");
  const [pcEmail, setPcEmail] = useState("");

  const handlePcOrgChange = (newOrgName: string) => {
    setPcOrg(newOrgName);
    const found = WASH_5W_ORGS.find((o) => o.name === newOrgName);
    setPcAcronym(found ? found.acronym : "");
  };

  // ========================================================
  // 2. ENTRY FORM STATE & CASCADING DROPDOWNS
  // ========================================================
  const createBlankFormData = (): MatrixEntry => ({
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    reportMonth: "",
    reportDate: new Date().toISOString().slice(0, 10),
    orgName: "",
    acronym: "",
    orgType: "",
    donor: "",
    implPartners: "",
    state: "",
    pcode1: "",
    lga: "",
    pcode2: "",
    ward: "",
    pcode3: "",
    siteType: "",
    locationName: "",
    locationPop: "",
    latlong: "",
    emergType: "",
    domain: "",
    activity: "",
    indicator: "",
    unit: "",
    hrp: "",
    qtyPlanned: "",
    qtyAchieved: "",
    benefType: "",
    boys: "",
    girls: "",
    men: "",
    women: "",
    totalBenef: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    status: "",
    comments: "",
  });

  const [formData, setFormData] = useState<MatrixEntry>(createBlankFormData());
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const [entries, setEntries] = useState<MatrixEntry[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Apply Partner Contact Org to Entry Form
  const handleApplyOrgToForm = () => {
    if (!pcOrg && !pcType) {
      showToast("Fill in the reporting organisation details first.", undefined, true);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      orgName: pcOrg || prev.orgName,
      acronym: pcAcronym || prev.acronym,
      orgType: pcType || prev.orgType,
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      if (pcOrg) delete next.orgName;
      return next;
    });
    showToast("Organisation details applied to the entry form.");
  };

  // Toast trigger
  const showToast = (title: string, subtitle?: string, isError?: boolean) => {
    setToastMessage({ title, subtitle, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Available LGAs, Wards, and Activities based on current form selection
  const availableLgas = formData.state ? WASH_5W_LGAS_BY_STATE[formData.state] || [] : [];
  const availableWards = formData.lga ? WASH_5W_WARDS_BY_LGA[formData.lga] || [] : [];
  const availableActivities = formData.domain ? WASH_5W_ACTIVITIES_BY_DOMAIN[formData.domain] || [] : [];

  // Cascading Handler: Organisation change in Entry Form
  const handleFormOrgChange = (newOrg: string) => {
    const orgObj = WASH_5W_ORGS.find((o) => o.name === newOrg);
    setFormData((prev) => ({
      ...prev,
      orgName: newOrg,
      acronym: orgObj ? orgObj.acronym : "",
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      delete next.orgName;
      return next;
    });
  };

  // Cascading Handler: State change
  const handleStateChange = (newState: string) => {
    const stateObj = WASH_5W_STATES.find((s) => s.name === newState);
    setFormData((prev) => ({
      ...prev,
      state: newState,
      pcode1: stateObj ? stateObj.pcode : "",
      lga: "",
      pcode2: "",
      ward: "",
      pcode3: "",
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      delete next.state;
      return next;
    });
  };

  // Cascading Handler: LGA change
  const handleLgaChange = (newLga: string) => {
    const lgas = WASH_5W_LGAS_BY_STATE[formData.state] || [];
    const lgaObj = lgas.find((l) => l.name === newLga);
    setFormData((prev) => ({
      ...prev,
      lga: newLga,
      pcode2: lgaObj ? lgaObj.pcode : "",
      ward: "",
      pcode3: "",
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      delete next.lga;
      return next;
    });
  };

  // Cascading Handler: Ward change
  const handleWardChange = (newWard: string) => {
    const wards = WASH_5W_WARDS_BY_LGA[formData.lga] || [];
    const wardObj = wards.find((w) => w.name === newWard);
    setFormData((prev) => ({
      ...prev,
      ward: newWard,
      pcode3: wardObj ? wardObj.pcode : "",
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      delete next.ward;
      return next;
    });
  };

  // Cascading Handler: Domain change
  const handleDomainChange = (newDomain: string) => {
    setFormData((prev) => ({
      ...prev,
      domain: newDomain,
      activity: "",
      indicator: "",
      unit: "",
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      delete next.domain;
      return next;
    });
  };

  // Cascading Handler: Activity change
  const handleActivityChange = (newActivity: string) => {
    const details = WASH_5W_ACTIVITY_DETAILS[`${formData.domain}|||${newActivity}`];
    setFormData((prev) => ({
      ...prev,
      activity: newActivity,
      indicator: details ? cleanIndicator(details.indicator) : "",
      unit: details ? cleanUnit(details.unit) : "",
    }));
    setInvalidFields((prev) => {
      const next = { ...prev };
      delete next.activity;
      return next;
    });
  };

  // Demographic reach & recalculate total
  const handleDemographicChange = (field: "boys" | "girls" | "men" | "women", val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val };
      const b = parseInt(field === "boys" ? val : prev.boys) || 0;
      const g = parseInt(field === "girls" ? val : prev.girls) || 0;
      const m = parseInt(field === "men" ? val : prev.men) || 0;
      const w = parseInt(field === "women" ? val : prev.women) || 0;
      const sum = b + g + m + w;
      if (sum > 0) {
        updated.totalBenef = String(sum);
      }
      return updated;
    });
  };

  // Validation function
  const validateForm = (): boolean => {
    const newInvalid: Record<string, boolean> = {};
    let ok = true;

    REQUIRED_FIELDS.forEach((key) => {
      const val = formData[key];
      if (!val || String(val).trim() === "") {
        newInvalid[key] = true;
        ok = false;
      }
    });

    setInvalidFields(newInvalid);
    return ok;
  };

  // Reset form
  const handleResetForm = () => {
    setFormData(createBlankFormData());
    setInvalidFields({});
    setEditIndex(null);
  };

  // Add / Save entry to matrix
  const handleAddOrSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(
        "Please complete the highlighted required fields.",
        "Missing: Month, Org, State, LGA, Ward, Domain, Activity, or Status",
        true
      );
      return;
    }

    if (editIndex !== null) {
      // Edit existing entry
      setEntries((prev) => {
        const copy = [...prev];
        copy[editIndex] = { ...formData };
        return copy;
      });
      setEditIndex(null);
      showToast("Changes saved to matrix entry.");
    } else {
      // Add new entry
      setEntries((prev) => [...prev, { ...formData }]);
      showToast("Entry saved to the matrix below.");
    }

    handleResetForm();

    // Scroll to matrix table smoothly
    setTimeout(() => {
      const tableEl = document.getElementById("session-matrix-table");
      if (tableEl) tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // Edit existing entry from matrix
  const handleEditEntry = (idx: number) => {
    const target = entries[idx];
    if (!target) return;

    setFormData({ ...target });
    setEditIndex(idx);
    setInvalidFields({});

    // Scroll smoothly to entry form
    setTimeout(() => {
      const formEl = document.getElementById("entry-form");
      if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Delete entry from matrix
  const handleDeleteEntry = (idx: number) => {
    if (window.confirm(`Are you sure you want to remove entry #${idx + 1}?`)) {
      setEntries((prev) => prev.filter((_, i) => i !== idx));
      if (editIndex === idx) {
        handleResetForm();
      }
      showToast(`Entry #${idx + 1} removed from matrix.`);
    }
  };

  // Clear all entries
  const handleClearAllEntries = () => {
    if (entries.length === 0) return;
    if (
      window.confirm(
        `Remove all ${entries.length} entries from this session? This cannot be undone.`
      )
    ) {
      setEntries([]);
      handleResetForm();
      showToast("All matrix entries cleared.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (entries.length === 0) {
      showToast("No entries to export yet.", undefined, true);
      return;
    }

    const rows = [COLUMNS.map((c) => c.label)];
    entries.forEach((e) => {
      rows.push(COLUMNS.map((c) => String(e[c.key as keyof MatrixEntry] || "")));
    });

    const csvContent =
      "\uFEFF" +
      rows
        .map((r) =>
          r
            .map((v) => {
              const s = String(v).replace(/"/g, '""');
              return /[",\n]/.test(s) ? `"${s}"` : s;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wash_5w_matrix_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("CSV downloaded successfully.");
  };

  // Export to XLSX using SheetJS
  const handleExportXLSX = () => {
    if (entries.length === 0) {
      showToast("No entries to export yet.", undefined, true);
      return;
    }

    const XLSX = (window as any).XLSX;
    if (!XLSX) {
      handleExportCSV();
      showToast("Excel export library unavailable — exported as CSV instead.", undefined, true);
      return;
    }

    try {
      const rows = [COLUMNS.map((c) => c.label)];
      entries.forEach((e) => {
        rows.push(COLUMNS.map((c) => String(e[c.key as keyof MatrixEntry] || "")));
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = COLUMNS.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "1_MATRIX");

      const pcRows = [
        ["Response Monitoring (5W)"],
        [],
        ["Organisation Name:", pcOrg],
        ["Acronym:", pcAcronym],
        ["Type of organisation:", pcType],
        ["Contact Name:", pcContact],
        ["Phone Number:", pcPhone],
        ["Email of the contact:", pcEmail],
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(pcRows);
      XLSX.utils.book_append_sheet(wb, ws2, "1_Partner Contact");

      XLSX.writeFile(wb, `wash_5w_matrix_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast("Excel workbook (.xlsx) downloaded successfully.");
    } catch (err) {
      console.error(err);
      handleExportCSV();
    }
  };

  // Submit all matrix records into the central platform context
  const handleSubmitAllToPlatform = () => {
    if (entries.length === 0) {
      showToast("Please add at least one entry to the matrix first.", undefined, true);
      return;
    }

    entries.forEach((e) => {
      addReport({
        orgName: e.orgName || pcOrg,
        acronym: e.acronym || pcAcronym,
        orgType: e.orgType || pcType,
        focalPoint: pcContact || currentUser.name,
        phone: pcPhone,
        email: pcEmail || currentUser.email,
        donor: e.donor,
        implPartners: e.implPartners,
        reportMonth: e.reportMonth,
        reportDate: e.reportDate,

        domain: e.domain,
        emergType: e.emergType,
        activityType: e.activity,
        indicator: e.indicator,
        indicatorDesc: e.indicator,
        unit: e.unit,
        hrp: e.hrp,
        qtyPlanned: Number(e.qtyPlanned) || 0,
        qtyAchieved: Number(e.qtyAchieved) || 0,
        quantity: Number(e.qtyAchieved) || 0,

        state: (e.state as "Borno" | "Adamawa" | "Yobe") || "Borno",
        pcode1: e.pcode1,
        lga: e.lga,
        pcode2: e.pcode2,
        ward: e.ward,
        pcode3: e.pcode3,
        siteType: e.siteType,
        locationType: e.siteType || "Community",
        locationName: e.locationName,
        settlement: e.locationName,
        locationPop: e.locationPop,
        latlong: e.latlong,

        period: e.reportMonth || "2026-01",
        status: (e.status as any) || "Completed",
        startDate: e.startDate,
        endDate: e.endDate,
        comments: e.comments,

        benefType: e.benefType,
        populationGroup: e.benefType || "IDPs",
        pwd: 0,
        boys: Number(e.boys) || 0,
        girls: Number(e.girls) || 0,
        men: Number(e.men) || 0,
        women: Number(e.women) || 0,
        total: Number(e.totalBenef) || 0,

        submittedByRole: currentUser.role,
        submittedByEmail: currentUser.email,
      });
    });

    showToast(
      `${entries.length} 5W Activity ${entries.length === 1 ? "Record" : "Records"} Submitted!`,
      "Synchronized with central Borno, Adamawa & Yobe 5W response monitoring matrix."
    );

    setTimeout(() => {
      navigate("/reports-list");
    }, 1200);
  };

  // Calculate total beneficiaries in current session
  const sessionTotalBeneficiaries = entries.reduce(
    (sum, e) => sum + (parseInt(e.totalBenef) || 0),
    0
  );

  return (
    <>
      <PageMeta
        title="Submit 5W Report | WASH Sector North East Nigeria"
        description="Official WASH Sector Response Monitoring Matrix (5W) reporting tool for Adamawa, Borno & Yobe"
      />

      <div className="w-full space-y-6 max-w-[1340px] mx-auto pb-16 font-sans">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-6 right-6 z-99999 rounded-xl px-5 py-4 shadow-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top duration-300 ${
              toastMessage.isError
                ? "bg-rose-900 text-white border-rose-500"
                : "bg-teal-900 text-white border-teal-500"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                toastMessage.isError ? "bg-rose-800" : "bg-teal-800"
              }`}
            >
              {toastMessage.isError ? (
                <svg className="w-5 h-5 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-sm font-bold">{toastMessage.title}</div>
              {toastMessage.subtitle && (
                <div className="text-xs text-teal-100/90 mt-0.5">{toastMessage.subtitle}</div>
              )}
            </div>
          </div>
        )}

        {!showForm ? (
          /* ================================================================
             HOW THE 5W FRAMEWORK OPERATES (INTRODUCTORY LANDING SCREEN)
             ================================================================ */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Banner / Hero Card */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-950 via-[#0B3C46] to-[#12707E] text-white p-8 sm:p-12 shadow-xl border border-teal-800/80 relative overflow-hidden">
              <div className="relative z-10 max-w-4xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-900/90 border border-teal-500/40 text-xs font-mono tracking-wider text-teal-300 uppercase font-bold">
                  <span>Inter-Agency Information Management</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif">
                  How the 5W Framework Operates
                </h1>
                <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed font-sans max-w-3xl">
                  The 5W matrix is the globally recognized humanitarian cluster standard that ensures accountability, prevents overlap, and directs emergency resources to the most vulnerable individuals.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Open 5W Reporting Form</span>
                    <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/coverage-dashboard")}
                    className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-chart-pie mr-1"></i>
                    <span>Response Coverage Dashboard</span>
                  </button>
                </div>
              </div>

              <div className="absolute right-6 top-6 hidden lg:block opacity-10 pointer-events-none">
                <WashLogo className="h-56 w-auto" />
              </div>
            </div>

            {/* 5W Interactive Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {[
                {
                  num: "01",
                  code: "WHO",
                  title: "The Lead & Partner",
                  desc: "Accredited humanitarian agency, implementing NGO, donor, and operational field focal point.",
                  accent: "#12707E",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                },
                {
                  num: "02",
                  code: "WHAT",
                  title: "The Intervention",
                  desc: "Specific sector activity: water supply construction, latrine desludging, or hygiene kit distribution.",
                  accent: "#1D8A99",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                },
                {
                  num: "03",
                  code: "WHERE",
                  title: "The Exact Location",
                  desc: "State, LGA, ward, IDP camp or host community, accompanied by validated GPS coordinates.",
                  accent: "#C1722F",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  num: "04",
                  code: "WHEN",
                  title: "The Implementation Period",
                  desc: "Active monthly cycle, project start and completion dates, and continuous activity status.",
                  accent: "#2E7D47",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  num: "05",
                  code: "FOR WHOM",
                  title: "The Beneficiaries",
                  desc: "Target population: IDPs, returnees, host communities with disaggregated sex and age indicators.",
                  accent: "#7E3A9E",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
              ].map((step) => (
                <div
                  key={step.code}
                  className="relative rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div
                    className="absolute top-2 right-4 font-serif font-extrabold text-5xl select-none opacity-10"
                    style={{ color: step.accent }}
                  >
                    {step.num}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ background: step.accent }}
                      >
                        {step.icon}
                      </div>
                      <span
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded-md"
                        style={{
                          color: step.accent,
                          backgroundColor: `${step.accent}15`,
                        }}
                      >
                        {step.code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 font-serif">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ================================================================
             5W REPORTING FORM INTERFACE (MATCHES REFERENCE TEMPLATE EXACTLY)
             ================================================================ */
          <div className="space-y-7 animate-in fade-in duration-300">
            {/* Top Toolbar / Instructions Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a3b39] text-[#eef6f4] px-6 py-4 rounded-xl shadow-sm">
              <div>
                <h1 className="text-lg sm:text-xl font-serif font-semibold text-white">
                  Complete each section — Who, What, Where, When, For Whom — to submit a valid 5W report.
                </h1>
                <p className="text-xs text-[#a9d6cd] mt-0.5">
                  Official Sector Response Monitoring Matrix (5W) — Adamawa, Borno &amp; Yobe
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowInstructions((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-800/80 hover:bg-teal-700/80 border border-teal-600/40 text-xs font-semibold text-teal-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{showInstructions ? "Hide instructions" : "Instructions for partners"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-teal-200 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>5W Overview</span>
                </button>
              </div>
            </div>

            {/* Collapsible Instructions Box */}
            {showInstructions && (
              <div className="rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/30 p-5 text-xs text-teal-900 dark:text-teal-200 space-y-2">
                <h4 className="font-bold text-sm text-teal-950 dark:text-teal-100">Instructions for partners:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Please fill in the details carefully — this data feeds the sector's response monitoring and advocacy.</li>
                  <li>Use the provided dropdowns rather than typing free text where one is offered.</li>
                  <li>Fields marked &ldquo;autofill&rdquo; are calculated for you once you make a selection — you don't need to edit them.</li>
                  <li>After filling an activity entry, click <strong>&ldquo;Add entry to matrix&rdquo;</strong> to save it into the matrix table below.</li>
                </ul>
              </div>
            )}

            {/* ======================================================== */}
            {/* PARTNER CONTACT CARD (REPORTING ORGANISATION)            */}
            {/* ======================================================== */}
            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0a3b39] dark:text-teal-300">
                    Reporting organisation
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Filled in once — carries over into new activity entries below.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* pc-org */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Organisation Name <span className="text-gray-400 font-normal">(Select in the dropdown list)</span>
                    </label>
                    <select
                      value={pcOrg}
                      onChange={(e) => handlePcOrgChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                    >
                      <option value="">Select organisation...</option>
                      {WASH_5W_ORGS.map((o) => (
                        <option key={o.name} value={o.name}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* pc-acronym */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Acronym <span className="text-gray-400 font-normal">(Autofill)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={pcAcronym}
                      placeholder="Autofilled"
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  {/* pc-type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Type of organisation <span className="text-gray-400 font-normal">(Select in the dropdown list)</span>
                    </label>
                    <select
                      value={pcType}
                      onChange={(e) => setPcType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                    >
                      <option value="">Select type...</option>
                      {WASH_5W_ORG_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* pc-contact */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={pcContact}
                      onChange={(e) => setPcContact(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  {/* pc-phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={pcPhone}
                      onChange={(e) => setPcPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  {/* pc-email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Email of the contact
                    </label>
                    <input
                      type="email"
                      value={pcEmail}
                      onChange={(e) => setPcEmail(e.target.value)}
                      placeholder="name@organisation.org"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Apply button */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleApplyOrgToForm}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0e5450] text-[#0e5450] dark:text-teal-300 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>Use for new entries</span>
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Copies organisation, acronym and type into the form below.
                  </span>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* ENTRY FORM (NEW / EDIT ACTIVITY ENTRY)                   */}
            {/* ======================================================== */}
            <section
              id="entry-form"
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0a3b39] dark:text-teal-300 flex items-center gap-2">
                    <span>{editIndex !== null ? `Edit activity entry (#${editIndex + 1})` : "New activity entry"}</span>
                    {editIndex !== null && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                        Editing Mode
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    One row of the matrix — repeat for every activity, location, and reporting month.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddOrSaveEntry} className="p-6 space-y-7">
                {/* ---------- WHO ---------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0e5450] dark:text-teal-300 bg-[#dcece9] dark:bg-teal-950/80 border border-[#bfdcd6] dark:border-teal-800 px-2.5 py-1 rounded">
                      WHO
                    </span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* f-month */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Reporting Month <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        value={formData.reportMonth}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, reportMonth: e.target.value }));
                          setInvalidFields((prev) => {
                            const next = { ...prev };
                            delete next.reportMonth;
                            return next;
                          });
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                          invalidFields.reportMonth
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">Select month...</option>
                        {WASH_5W_MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-date */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Date of Reporting <span className="text-gray-400 font-normal">(DD/MM/YYYY)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.reportDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, reportDate: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-org */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Organisation Name <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        value={formData.orgName}
                        onChange={(e) => handleFormOrgChange(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                          invalidFields.orgName
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">Select organisation...</option>
                        {WASH_5W_ORGS.map((o) => (
                          <option key={o.name} value={o.name}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-acronym */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Acronym <span className="text-gray-400 font-normal">(Autofill)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.acronym}
                        placeholder="Autofill"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {/* f-orgtype */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label>
                      <select
                        value={formData.orgType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, orgType: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      >
                        <option value="">Select type...</option>
                        {WASH_5W_ORG_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-donor */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Donor
                      </label>
                      <select
                        value={formData.donor}
                        onChange={(e) => setFormData((prev) => ({ ...prev, donor: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      >
                        <option value="">Select donor...</option>
                        {WASH_5W_DONORS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-implpartners (wide) */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Implementing Partners
                      </label>
                      <input
                        type="text"
                        value={formData.implPartners}
                        onChange={(e) => setFormData((prev) => ({ ...prev, implPartners: e.target.value }))}
                        placeholder="Free text"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ---------- WHERE ---------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0e5450] dark:text-teal-300 bg-[#dcece9] dark:bg-teal-950/80 border border-[#bfdcd6] dark:border-teal-800 px-2.5 py-1 rounded">
                      WHERE
                    </span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* f-state */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        State <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                          invalidFields.state
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">Select state...</option>
                        {WASH_5W_STATES.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-pcode1 */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Pcode_ADM1 <span className="text-gray-400 font-normal">(Automatically filled)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.pcode1}
                        placeholder="Autofilled"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {/* f-lga */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        LGA <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        disabled={!formData.state || availableLgas.length === 0}
                        value={formData.lga}
                        onChange={(e) => handleLgaChange(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 ${
                          invalidFields.lga
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">
                          {!formData.state ? "Select state first" : "Select LGA..."}
                        </option>
                        {availableLgas.map((l) => (
                          <option key={l.name} value={l.name}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-pcode2 */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Pcode_ADM2 <span className="text-gray-400 font-normal">(Automatically filled)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.pcode2}
                        placeholder="Autofilled"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {/* f-ward */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Ward <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        disabled={!formData.lga || availableWards.length === 0}
                        value={formData.ward}
                        onChange={(e) => handleWardChange(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 ${
                          invalidFields.ward
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">
                          {!formData.lga
                            ? "Select LGA first"
                            : availableWards.length === 0
                            ? "No ward available"
                            : "Select Ward..."}
                        </option>
                        {availableWards.map((w) => (
                          <option key={w.name} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-pcode3 */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Pcode_ADM3 <span className="text-gray-400 font-normal">(Automatically filled)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.pcode3}
                        placeholder="Autofilled"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {/* f-sitetype */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Type of Location
                      </label>
                      <select
                        value={formData.siteType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, siteType: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      >
                        <option value="">Select location type...</option>
                        {WASH_5W_SITE_TYPES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-locname */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Location Name
                      </label>
                      <input
                        type="text"
                        value={formData.locationName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, locationName: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-locpop */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Location Population
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.locationPop}
                        onChange={(e) => setFormData((prev) => ({ ...prev, locationPop: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-latlong */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Latitude, Longitude <span className="text-gray-400 font-normal">(Boreholes, wells &amp; sanitation facilities)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.latlong}
                        onChange={(e) => setFormData((prev) => ({ ...prev, latlong: e.target.value }))}
                        placeholder="e.g. 11.8464, 13.1603"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ---------- WHAT ---------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0e5450] dark:text-teal-300 bg-[#dcece9] dark:bg-teal-950/80 border border-[#bfdcd6] dark:border-teal-800 px-2.5 py-1 rounded">
                      WHAT
                    </span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* f-emerg */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Intervention / Emergency Type
                      </label>
                      <select
                        value={formData.emergType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, emergType: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      >
                        <option value="">Select type...</option>
                        {WASH_5W_EMERGENCY_TYPES.map((et) => (
                          <option key={et} value={et}>
                            {et}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-domain */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        WASH Domain <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        value={formData.domain}
                        onChange={(e) => handleDomainChange(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                          invalidFields.domain
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600 font-semibold"
                        }`}
                      >
                        <option value="">Select domain...</option>
                        {WASH_5W_DOMAINS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-activity */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Activity <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        disabled={!formData.domain || availableActivities.length === 0}
                        value={formData.activity}
                        onChange={(e) => handleActivityChange(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 ${
                          invalidFields.activity
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">
                          {!formData.domain ? "Select domain first" : "Select activity..."}
                        </option>
                        {availableActivities.map((act) => (
                          <option key={act} value={act}>
                            {act}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-indicator (wide) */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Indicators <span className="text-gray-400 font-normal">(Automatically filled)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.indicator}
                        placeholder="Autofilled from activity selection"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {/* f-unit */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Unit <span className="text-gray-400 font-normal">(Automatically filled)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.unit}
                        placeholder="Autofilled"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    {/* f-hrp */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Is HRP activity?
                      </label>
                      <select
                        value={formData.hrp}
                        onChange={(e) => setFormData((prev) => ({ ...prev, hrp: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      >
                        <option value="">Select...</option>
                        {WASH_5W_HRP_LIST.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-qtyplanned */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Quantity Planned
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.qtyPlanned}
                        onChange={(e) => setFormData((prev) => ({ ...prev, qtyPlanned: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-qtyachieved */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Quantity Achieved
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.qtyAchieved}
                        onChange={(e) => setFormData((prev) => ({ ...prev, qtyAchieved: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ---------- WHOM ---------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0e5450] dark:text-teal-300 bg-[#dcece9] dark:bg-teal-950/80 border border-[#bfdcd6] dark:border-teal-800 px-2.5 py-1 rounded">
                      WHOM
                    </span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* f-beneftype */}
                    <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Beneficiary Type
                      </label>
                      <select
                        value={formData.benefType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, benefType: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      >
                        <option value="">Select type...</option>
                        {WASH_5W_BENEFICIARY_TYPES.map((bt) => (
                          <option key={bt} value={bt}>
                            {bt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-boys */}
                    <div>
                      <label className="block text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                        #Beneficiary Boys
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.boys}
                        onChange={(e) => handleDemographicChange("boys", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-girls */}
                    <div>
                      <label className="block text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                        #Beneficiary Girls
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.girls}
                        onChange={(e) => handleDemographicChange("girls", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-men */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                        #Beneficiary Men
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.men}
                        onChange={(e) => handleDemographicChange("men", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-women */}
                    <div>
                      <label className="block text-xs font-semibold text-rose-700 dark:text-rose-300 mb-1">
                        #Beneficiary Women
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.women}
                        onChange={(e) => handleDemographicChange("women", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-total */}
                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-6">
                      <label className="block text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                        # Total Beneficiary{" "}
                        <span className="text-gray-400 font-normal">
                          (Auto-calculated — edit if disaggregation unavailable)
                        </span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.totalBenef}
                        onChange={(e) => setFormData((prev) => ({ ...prev, totalBenef: e.target.value }))}
                        className="w-full max-w-sm rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 px-3 py-2 text-sm font-mono font-bold text-emerald-950 dark:text-emerald-200 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ---------- WHEN ---------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0e5450] dark:text-teal-300 bg-[#dcece9] dark:bg-teal-950/80 border border-[#bfdcd6] dark:border-teal-800 px-2.5 py-1 rounded">
                      WHEN
                    </span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* f-startdate */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Starting date <span className="text-gray-400 font-normal">(DD/MM/YYYY)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-enddate */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        End date <span className="text-gray-400 font-normal">(DD/MM/YYYY)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* f-status */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Status <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, status: e.target.value }));
                          setInvalidFields((prev) => {
                            const next = { ...prev };
                            delete next.status;
                            return next;
                          });
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                          invalidFields.status
                            ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-teal-600"
                        }`}
                      >
                        <option value="">Select status...</option>
                        {WASH_5W_STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* f-comments (wide) */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Comments
                      </label>
                      <textarea
                        rows={2}
                        value={formData.comments}
                        onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                        placeholder="Additional operational context or notes..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="submit"
                    id="add-entry-btn"
                    className="px-5 py-2.5 rounded-lg bg-[#0e5450] hover:bg-[#0a3b39] text-white text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    {editIndex !== null ? "Save changes to entry" : "Add entry to matrix"}
                  </button>

                  <button
                    type="button"
                    id="reset-form-btn"
                    onClick={handleResetForm}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Clear form
                  </button>

                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    Required fields are marked <span className="text-rose-600 font-bold">*</span>
                  </span>
                </div>
              </form>
            </section>

            {/* ======================================================== */}
            {/* LIVE 5W RESPONSE MATRIX TABLE                            */}
            {/* ======================================================== */}
            <section
              id="session-matrix-table"
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#0a3b39] dark:text-teal-300 flex items-center gap-2">
                    <span>Response Monitoring Matrix (5W)</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200">
                      {entries.length} {entries.length === 1 ? "entry" : "entries"}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Reached: <strong className="text-emerald-700 dark:text-emerald-300">{sessionTotalBeneficiaries.toLocaleString()}</strong> beneficiaries across entries
                  </p>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportXLSX}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-teal-700 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download XLSX</span>
                  </button>

                  {entries.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllEntries}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmitAllToPlatform}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0e5450] hover:bg-[#0a3b39] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit Matrix to Platform ({entries.length})</span>
                  </button>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                {entries.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto text-gray-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="font-semibold text-sm">No entries in the matrix yet</div>
                    <div className="text-xs max-w-sm mx-auto">
                      Fill in the activity details above and click <strong>&ldquo;Add entry to matrix&rdquo;</strong> to build your monthly response dataset.
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse min-w-[2200px]">
                    <thead className="bg-[#0a3b39] text-[#eef6f4] font-mono text-[11px] uppercase tracking-wider sticky top-0">
                      <tr>
                        {COLUMNS.map((col) => (
                          <th key={col.key} className="px-3.5 py-3 border-r border-teal-800/50 whitespace-nowrap">
                            {col.label}
                          </th>
                        ))}
                        <th className="px-3.5 py-3 text-center sticky right-0 bg-[#0a3b39] shadow-l">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 font-sans">
                      {entries.map((entry, idx) => (
                        <tr
                          key={entry.id || idx}
                          className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                        >
                          {COLUMNS.map((col) => {
                            const val = entry[col.key as keyof MatrixEntry] || "";
                            const isNum = [
                              "locationPop",
                              "qtyPlanned",
                              "qtyAchieved",
                              "boys",
                              "girls",
                              "men",
                              "women",
                              "totalBenef",
                            ].includes(col.key);
                            const isCode = ["pcode1", "pcode2", "pcode3"].includes(col.key);

                            return (
                              <td
                                key={col.key}
                                className={`px-3.5 py-2.5 border-r border-gray-100 dark:border-gray-700/60 ${
                                  isNum
                                    ? "text-right font-mono font-medium"
                                    : isCode
                                    ? "font-mono text-gray-500 text-[11px]"
                                    : "text-gray-800 dark:text-gray-200 whitespace-nowrap"
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}

                          {/* Row Action buttons (sticky right) */}
                          <td className="px-3.5 py-2.5 text-center sticky right-0 bg-white dark:bg-gray-800 shadow-l">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditEntry(idx)}
                                className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-[#0e5450] dark:text-teal-300 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEntry(idx)}
                                className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* Sector Footer Note */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">
              Built from the official WASH Sector 5W reporting template — Adamawa, Borno &amp; Yobe.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
