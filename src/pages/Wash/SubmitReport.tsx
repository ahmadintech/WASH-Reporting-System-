import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { ActivityRecord } from "../../types/wash";
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
  getStatePcode,
  getLgaPcode,
  getWardPcode,
} from "../../data/wash5wData";

export default function SubmitReport() {
  const { addReport, reportingConfig } = useWashData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeTabRecordId, setActiveTabRecordId] = useState<string>("rec-1");

  // ==========================================
  // 01 WHO — REPORTING ORGANISATION (SHARED)
  // ==========================================
  const initialOrg = currentUser.organization || "Action Against Hunger";
  const matchedOrg = WASH_5W_ORGS.find(
    (o) => o.name.toLowerCase() === initialOrg.toLowerCase()
  );

  const [orgName, setOrgName] = useState(initialOrg);
  const [acronym, setAcronym] = useState(matchedOrg ? matchedOrg.acronym : "AAH");
  const [orgType, setOrgType] = useState(currentUser.organizationType || "International NGO");
  const [focalPoint, setFocalPoint] = useState(currentUser.name || "");
  const [phone, setPhone] = useState("+234 ");
  const [email, setEmail] = useState(currentUser.email || "");
  const [donor, setDonor] = useState("USAID - BHA");
  const [implPartners, setImplPartners] = useState("");
  const [reportMonth, setReportMonth] = useState(
    WASH_5W_MONTHS.find((m) => m.includes("2026")) || "January 2026"
  );
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));

  // Handle Org change & autofill acronym
  const handleOrgChange = (newOrgName: string) => {
    setOrgName(newOrgName);
    const found = WASH_5W_ORGS.find((o) => o.name === newOrgName);
    if (found) {
      setAcronym(found.acronym);
    }
  };

  // ==========================================
  // ACTIVITY RECORDS (WHERE, WHAT, FOR WHOM, WHEN)
  // ==========================================
  const userAssignedState: "Borno" | "Adamawa" | "Yobe" = (() => {
    if (currentUser.state) {
      const match = WASH_5W_STATES.find(
        (s) => s.name.toLowerCase() === currentUser.state?.toLowerCase()
      );
      if (match) return match.name;
    }
    return "Borno";
  })();

  const createBlankRecord = (index: number): ActivityRecord => {
    const defaultState = userAssignedState;
    const p1 = getStatePcode(defaultState);
    const lgas = WASH_5W_LGAS_BY_STATE[defaultState] || [];
    const defaultLgaObj =
      lgas.find((l) => l.name.toLowerCase() === currentUser.lga?.toLowerCase()) ||
      lgas[0] || { name: "Maiduguri", pcode: "NG008021" };
    const p2 = defaultLgaObj.pcode;
    const wards = WASH_5W_WARDS_BY_LGA[defaultLgaObj.name] || [];
    const defaultWardObj = wards[0] || { name: "", pcode: "" };

    const defaultDomain = "Water";
    const defaultActs = WASH_5W_ACTIVITIES_BY_DOMAIN[defaultDomain] || [];
    const defaultAct = defaultActs[0] || "Borehole Construction";
    const details = WASH_5W_ACTIVITY_DETAILS[`${defaultDomain}|||${defaultAct}`];

    return {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recordNumber: index,
      isExpanded: true,

      // WHERE
      state: defaultState,
      pcode1: p1,
      lga: defaultLgaObj.name,
      pcode2: p2,
      ward: defaultWardObj.name,
      pcode3: defaultWardObj.pcode,
      siteType: "IDPs Camp",
      locationName: "",
      locationPop: "",
      latlong: "",

      // WHAT
      emergType: "Conflict",
      domain: defaultDomain,
      activityType: defaultAct,
      indicator: details ? cleanIndicator(details.indicator) : "",
      unit: details ? cleanUnit(details.unit) : "Boreholes",
      hrp: "Yes",
      qtyPlanned: 1,
      qtyAchieved: 1,

      // FOR WHOM
      benefType: "IDPs",
      populationGroup: "IDPs in camps",
      boys: 0,
      girls: 0,
      men: 0,
      women: 0,
      pwd: 0,
      total: 0,

      // WHEN
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      status: "Completed",
      comments: "",
    };
  };

  const [records, setRecords] = useState<ActivityRecord[]>([createBlankRecord(1)]);

  // Add new record
  const handleAddNewRecord = () => {
    const nextNumber = records.length + 1;
    const newRec = createBlankRecord(nextNumber);
    setRecords((prev) => [...prev, newRec]);
    setActiveTabRecordId(newRec.id);
    setToastMessage({
      title: `Record #${nextNumber} added`,
      subtitle: "WHO details are automatically carried over. Fill the activity fields below.",
    });
    setTimeout(() => setToastMessage(null), 3000);

    // Scroll to the new record form smoothly
    setTimeout(() => {
      const el = document.getElementById(`record-card-${newRec.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Duplicate record
  const handleDuplicateRecord = (recToDup: ActivityRecord) => {
    const nextNumber = records.length + 1;
    const duplicated: ActivityRecord = {
      ...recToDup,
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recordNumber: nextNumber,
      isExpanded: true,
      comments: recToDup.comments ? `${recToDup.comments} (Copy)` : "",
    };
    setRecords((prev) => [...prev, duplicated]);
    setActiveTabRecordId(duplicated.id);
    setToastMessage({
      title: `Record #${recToDup.recordNumber} Duplicated`,
      subtitle: `Created Record #${nextNumber}. You can now modify location or quantities.`,
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete record
  const handleDeleteRecord = (id: string) => {
    if (records.length <= 1) {
      alert("At least one activity record is required.");
      return;
    }
    const target = records.find((r) => r.id === id);
    if (!target) return;

    if (window.confirm(`Are you sure you want to remove Record #${target.recordNumber}?`)) {
      setRecords((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        return filtered.map((r, idx) => ({ ...r, recordNumber: idx + 1 }));
      });
      if (activeTabRecordId === id) {
        const remaining = records.filter((r) => r.id !== id);
        if (remaining.length > 0) {
          setActiveTabRecordId(remaining[0].id);
        }
      }
      setToastMessage({
        title: "Record removed",
      });
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Update specific record field
  const updateRecord = <K extends keyof ActivityRecord>(
    id: string,
    field: K,
    value: ActivityRecord[K]
  ) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;

        const updated = { ...rec, [field]: value };

        // Cascading State Change
        if (field === "state") {
          const stateName = value as string;
          updated.pcode1 = getStatePcode(stateName);
          const lgas = WASH_5W_LGAS_BY_STATE[stateName] || [];
          updated.lga = lgas[0]?.name || "";
          updated.pcode2 = lgas[0]?.pcode || "";
          const wards = WASH_5W_WARDS_BY_LGA[updated.lga] || [];
          updated.ward = wards[0]?.name || "";
          updated.pcode3 = wards[0]?.pcode || "";
        }

        // Cascading LGA Change
        if (field === "lga") {
          const lgaName = value as string;
          updated.pcode2 = getLgaPcode(updated.state, lgaName);
          const wards = WASH_5W_WARDS_BY_LGA[lgaName] || [];
          updated.ward = wards[0]?.name || "";
          updated.pcode3 = wards[0]?.pcode || "";
        }

        // Cascading Ward Change
        if (field === "ward") {
          const wardName = value as string;
          updated.pcode3 = getWardPcode(updated.lga, wardName);
        }

        // Cascading Domain Change
        if (field === "domain") {
          const domName = value as string;
          const acts = WASH_5W_ACTIVITIES_BY_DOMAIN[domName] || [];
          updated.activityType = acts[0] || "";
          const details = WASH_5W_ACTIVITY_DETAILS[`${domName}|||${updated.activityType}`];
          updated.indicator = details ? cleanIndicator(details.indicator) : "";
          updated.unit = details ? cleanUnit(details.unit) : "Items";
        }

        // Cascading Activity Change
        if (field === "activityType") {
          const actName = value as string;
          const details = WASH_5W_ACTIVITY_DETAILS[`${updated.domain}|||${actName}`];
          updated.indicator = details ? cleanIndicator(details.indicator) : "";
          updated.unit = details ? cleanUnit(details.unit) : "Items";
        }

        // Auto-calculate Total Beneficiaries
        if (["boys", "girls", "men", "women"].includes(field as string)) {
          const b = Number(field === "boys" ? value : rec.boys) || 0;
          const g = Number(field === "girls" ? value : rec.girls) || 0;
          const m = Number(field === "men" ? value : rec.men) || 0;
          const w = Number(field === "women" ? value : rec.women) || 0;
          updated.total = b + g + m + w;
        }

        return updated;
      })
    );
  };

  const toggleExpand = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isExpanded: !r.isExpanded } : r))
    );
  };

  // Grand totals across all records
  const totalBeneficiariesAll = records.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

  // Validation
  const isWhoValid = Boolean(orgName.trim() && orgType && focalPoint.trim() && email.trim());

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWhoValid) {
      alert("Please complete all required fields in the Reporting Organisation (WHO) section.");
      const el = document.getElementById("sec-who");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r.state || !r.lga) {
        alert(`Record #${r.recordNumber}: Please select a valid State and LGA.`);
        setActiveTabRecordId(r.id);
        const el = document.getElementById(`record-card-${r.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (!r.domain || !r.activityType) {
        alert(`Record #${r.recordNumber}: Please select a WASH Domain and Activity.`);
        setActiveTabRecordId(r.id);
        const el = document.getElementById(`record-card-${r.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (totalBeneficiariesAll <= 0) {
      if (
        !window.confirm(
          "Total beneficiaries across records is 0. Are you sure you want to submit without demographic reach figures?"
        )
      ) {
        return;
      }
    }

    // Submit all records to WashDataContext
    records.forEach((rec) => {
      addReport({
        // WHO (Shared)
        orgName: orgName.trim(),
        acronym: acronym.trim(),
        orgType,
        focalPoint: focalPoint.trim(),
        phone: phone.trim(),
        email: email.trim(),
        donor: donor.trim(),
        implPartners: implPartners.trim(),
        reportMonth,
        reportDate,

        // WHAT
        domain: rec.domain,
        emergType: rec.emergType,
        activityType: rec.activityType,
        indicator: rec.indicator,
        indicatorDesc: rec.indicator,
        unit: rec.unit,
        hrp: rec.hrp,
        qtyPlanned: Number(rec.qtyPlanned) || 0,
        qtyAchieved: Number(rec.qtyAchieved) || 0,
        quantity: Number(rec.qtyAchieved) || 0,

        // WHERE
        state: rec.state,
        pcode1: rec.pcode1,
        lga: rec.lga,
        pcode2: rec.pcode2,
        ward: rec.ward,
        pcode3: rec.pcode3,
        siteType: rec.siteType,
        locationType: rec.siteType,
        locationName: rec.locationName,
        settlement: rec.locationName,
        locationPop: rec.locationPop,
        latlong: rec.latlong,

        // WHEN
        period: reportMonth || reportingConfig.activeCycle,
        status: rec.status,
        startDate: rec.startDate,
        endDate: rec.endDate,
        comments: rec.comments,

        // FOR WHOM
        benefType: rec.benefType,
        populationGroup: rec.populationGroup,
        pwd: Number(rec.pwd) || 0,
        men: Number(rec.men) || 0,
        women: Number(rec.women) || 0,
        boys: Number(rec.boys) || 0,
        girls: Number(rec.girls) || 0,
        total: Number(rec.total) || 0,

        submittedByRole: currentUser.role,
        submittedByEmail: currentUser.email,
      });
    });

    setToastMessage({
      title: `${records.length} 5W Activity ${records.length === 1 ? "Record" : "Records"} Submitted!`,
      subtitle: "Synchronized with Borno, Adamawa & Yobe 5W response monitoring matrix.",
    });

    setTimeout(() => {
      navigate("/reports-list");
    }, 1200);
  };

  // Save drafts
  const handleSaveDraft = () => {
    records.forEach((rec) => {
      addReport({
        orgName: orgName.trim() || currentUser.organization,
        acronym: acronym.trim(),
        orgType: orgType || currentUser.organizationType,
        focalPoint: focalPoint.trim() || currentUser.name,
        phone: phone.trim(),
        email: email.trim() || currentUser.email,
        donor: donor.trim(),
        implPartners: implPartners.trim(),
        reportMonth,
        reportDate,

        domain: rec.domain,
        emergType: rec.emergType,
        activityType: rec.activityType || "Emergency WASH intervention",
        indicator: rec.indicator,
        indicatorDesc: rec.indicator,
        unit: rec.unit || "Items",
        hrp: rec.hrp,
        qtyPlanned: Number(rec.qtyPlanned) || 0,
        qtyAchieved: Number(rec.qtyAchieved) || 0,
        quantity: Number(rec.qtyAchieved) || 0,

        state: rec.state,
        pcode1: rec.pcode1,
        lga: rec.lga || "Maiduguri",
        pcode2: rec.pcode2,
        ward: rec.ward,
        pcode3: rec.pcode3,
        siteType: rec.siteType,
        locationType: rec.siteType,
        locationName: rec.locationName,
        settlement: rec.locationName,
        locationPop: rec.locationPop,
        latlong: rec.latlong,

        period: reportMonth || reportingConfig.activeCycle,
        status: "Planned",
        startDate: rec.startDate,
        endDate: rec.endDate,
        comments: rec.comments,

        benefType: rec.benefType,
        populationGroup: rec.populationGroup || "IDPs",
        pwd: Number(rec.pwd) || 0,
        men: Number(rec.men) || 0,
        women: Number(rec.women) || 0,
        boys: Number(rec.boys) || 0,
        girls: Number(rec.girls) || 0,
        total: Number(rec.total) || 0,

        submittedByRole: currentUser.role,
        submittedByEmail: currentUser.email,
      });
    });

    setToastMessage({
      title: `${records.length} Draft ${records.length === 1 ? "Record" : "Records"} Saved`,
      subtitle: "Saved to local drafts. You can edit and submit at any time.",
    });

    setTimeout(() => {
      navigate("/reports-list");
    }, 1200);
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm("Clear all activity records and reset form?")) {
      setRecords([createBlankRecord(1)]);
      setActiveTabRecordId("rec-1");
      setImplPartners("");
    }
  };

  // Export Matrix CSV
  const handleExportSessionCsv = () => {
    const headers = [
      "Record #",
      "Reporting Month",
      "Reporting Date",
      "Organisation",
      "Acronym",
      "Type",
      "Donor",
      "State",
      "Pcode_ADM1",
      "LGA",
      "Pcode_ADM2",
      "Ward",
      "Pcode_ADM3",
      "Location Type",
      "Location Name",
      "Domain",
      "Activity",
      "Indicator",
      "Unit",
      "Qty Planned",
      "Qty Achieved",
      "Beneficiary Type",
      "Boys",
      "Girls",
      "Men",
      "Women",
      "Total Beneficiaries",
      "PWD",
      "Status",
      "Start Date",
      "End Date",
      "Comments",
    ];

    const rows = records.map((r) => [
      r.recordNumber,
      `"${reportMonth}"`,
      `"${reportDate}"`,
      `"${orgName}"`,
      `"${acronym}"`,
      `"${orgType}"`,
      `"${donor}"`,
      `"${r.state}"`,
      `"${r.pcode1}"`,
      `"${r.lga}"`,
      `"${r.pcode2}"`,
      `"${r.ward}"`,
      `"${r.pcode3}"`,
      `"${r.siteType}"`,
      `"${r.locationName}"`,
      `"${r.domain}"`,
      `"${r.activityType}"`,
      `"${(r.indicator || "").replace(/"/g, '""')}"`,
      `"${r.unit}"`,
      r.qtyPlanned,
      r.qtyAchieved,
      `"${r.benefType}"`,
      r.boys,
      r.girls,
      r.men,
      r.women,
      r.total,
      r.pwd,
      `"${r.status}"`,
      `"${r.startDate}"`,
      `"${r.endDate}"`,
      `"${(r.comments || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `WASH_5W_Matrix_${acronym || "Session"}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage({
      title: "Matrix CSV Downloaded",
      subtitle: `${records.length} records exported in standard 5W format`,
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <>
      <PageMeta
        title="Submit 5W Report | WASH Sector North East Nigeria"
        description="Official WASH Sector Response Monitoring Matrix (5W) reporting tool for Adamawa, Borno & Yobe"
      />

      <div className="w-full space-y-6 max-w-[1440px] mx-auto pb-16 font-sans">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-99999 rounded-xl bg-teal-800 text-white px-5 py-4 shadow-2xl flex items-center gap-3 border border-teal-500 animate-in fade-in slide-in-from-top duration-300">
            <div className="w-9 h-9 rounded-lg bg-teal-700/80 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold">{toastMessage.title}</div>
              {toastMessage.subtitle && (
                <div className="text-xs text-teal-100 mt-0.5">{toastMessage.subtitle}</div>
              )}
            </div>
          </div>
        )}

        {/* Top Header Card matching the official 5W Reporting Tool style */}
        <header className="rounded-2xl bg-gradient-to-r from-teal-900 via-[#0e5450] to-[#0a3b39] text-white p-6 sm:p-8 shadow-md border border-teal-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-950/60 border border-teal-600/40 text-[11px] font-mono tracking-wider text-teal-200 uppercase font-semibold">
                <span>WASH SECTOR · NIGERIA — ADAMAWA, BORNO &amp; YOBE (BAY STATES)</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium tracking-tight text-white">
                5W Response Monitoring Matrix
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90 max-w-3xl leading-relaxed">
                Log monthly response activities — who delivered what, where, when, and for whom —
                using the sector-standard operational monitoring matrix.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-inner border border-teal-200/50">
                <WashLogo className="h-10 w-auto" />
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{showInstructions ? "Hide Instructions" : "Partner Instructions"}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Partner Instructions */}
          {showInstructions && (
            <div className="mt-6 pt-5 border-t border-teal-700/60 text-xs sm:text-sm text-teal-50 space-y-2 bg-teal-950/40 p-4 rounded-xl border border-teal-600/30">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span>Instructions for implementing partners:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-teal-100/90 pl-1">
                <li>
                  <strong className="text-white">Reporting Organisation (WHO):</strong> Filled in once at the top. It automatically applies to all activity records submitted in this session.
                </li>
                <li>
                  <strong className="text-white">Multiple Activity Records:</strong> Click the <span className="bg-teal-700 px-1.5 py-0.5 rounded text-white font-mono">+ Add New Record</span> button to add more entries (e.g. multiple sites, boreholes, latrines, or hygiene kits).
                </li>
                <li>
                  <strong className="text-white">Autofill Fields:</strong> P-Codes, Sector Indicators, and Units of Measurement are automatically calculated when you select a State, LGA, Domain, and Activity.
                </li>
                <li>
                  <strong className="text-white">Disaggregated Reach:</strong> Enter boys, girls, men, and women beneficiaries. The total is calculated automatically.
                </li>
              </ul>
            </div>
          )}
        </header>

        {/* Global Action & Summary Sticky Strip */}
        <div className="sticky top-16 z-30 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/90 dark:border-gray-700 shadow-sm p-3.5 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Records Summary Pills */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mr-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span>Active Entries ({records.length}):</span>
              </span>

              {records.map((rec) => {
                const isActive = activeTabRecordId === rec.id;
                const hasValidLocation = Boolean(rec.state && rec.lga);
                const hasValidActivity = Boolean(rec.domain && rec.activityType);
                const isReady = hasValidLocation && hasValidActivity;

                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => {
                      setActiveTabRecordId(rec.id);
                      const el = document.getElementById(`record-card-${rec.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-teal-700 text-white shadow-sm ring-2 ring-teal-600/30"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? "bg-teal-800 text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {rec.recordNumber}
                    </span>
                    <span className="max-w-[130px] truncate">
                      {rec.activityType || rec.domain || `Record #${rec.recordNumber}`}
                    </span>
                    <span
                      title={isReady ? "Activity entry complete" : "Pending required fields"}
                      className={`w-2 h-2 rounded-full ${
                        isReady ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                  </button>
                );
              })}

              {/* Add New Record Button in Top Strip */}
              <button
                type="button"
                onClick={handleAddNewRecord}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-600/40 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Record</span>
              </button>
            </div>

            {/* Quick Metrics & Matrix Button */}
            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-xl">
                <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  Total Reached:
                </div>
                <div className="font-mono text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                  {totalBeneficiariesAll.toLocaleString()}
                </div>
              </div>

              <a
                href="#session-matrix-table"
                className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1"
              >
                <span>View Matrix</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: WHO — REPORTING ORGANISATION (CARRIES OVER TO ALL RECORDS)   */}
        {/* ========================================================================= */}
        <section
          id="sec-who"
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-teal-950/20 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-800 text-white font-mono text-sm font-bold flex items-center justify-center shadow-xs">
                WHO
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Reporting Organisation &amp; Focal Point</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Filled once — automatically carries over into all activity records below
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 border border-teal-300 dark:border-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>Common to all records</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Reporting Month */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Reporting Month <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all font-medium"
                >
                  {WASH_5W_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Reporting */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Date of Reporting <span className="text-gray-400 text-[11px] font-normal">(DD/MM/YYYY)</span>
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all"
                />
              </div>

              {/* Organisation Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Organisation Name <span className="text-amber-600 dark:text-amber-400">*</span>
                  <span className="text-gray-400 text-[11px] font-normal ml-1">(141 accredited partners or custom)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="wash-orgs-list"
                    required
                    value={orgName}
                    onChange={(e) => handleOrgChange(e.target.value)}
                    placeholder="Search or select organisation name..."
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all font-semibold"
                  />
                  <datalist id="wash-orgs-list">
                    {WASH_5W_ORGS.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.acronym ? `${o.acronym} — ${o.name}` : o.name}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Acronym */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Acronym <span className="text-gray-400 text-[11px] font-normal">(Autofill)</span>
                </label>
                <input
                  type="text"
                  value={acronym}
                  onChange={(e) => setAcronym(e.target.value)}
                  placeholder="e.g. AAH"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3.5 py-2.5 text-sm font-mono font-bold text-gray-800 dark:text-gray-200 focus:border-teal-600 focus:outline-none"
                />
              </div>

              {/* Type of Organisation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Type of Organisation <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <select
                  required
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all"
                >
                  {WASH_5W_ORG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Focal Point Contact Name <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={focalPoint}
                  onChange={(e) => setFocalPoint(e.target.value)}
                  placeholder="Full name of reporting officer"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all font-mono"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Focal Point Official Email <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="focalpoint@organisation.org"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all"
                />
              </div>

              {/* Donor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Donor / Funding Stream
                </label>
                <select
                  value={donor}
                  onChange={(e) => setDonor(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all"
                >
                  <option value="">Select Donor...</option>
                  {WASH_5W_DONORS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Implementing Partners */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Implementing Partners <span className="text-gray-400 text-[11px] font-normal">(Free text)</span>
                </label>
                <input
                  type="text"
                  value={implPartners}
                  onChange={(e) => setImplPartners(e.target.value)}
                  placeholder="e.g. RUWASSA, Local CBOs"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: ACTIVITY RECORDS (WHERE, WHAT, FOR WHOM, WHEN)                */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Activity Records ({records.length})</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  — Each record represents one activity entry in the 5W matrix
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                WHO organisation details above are automatically tied to all records.
              </p>
            </div>

            {/* Prominent "+ Add New Record" button */}
            <button
              type="button"
              id="btn-add-record"
              onClick={handleAddNewRecord}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add New Record</span>
            </button>
          </div>

          {/* Render each Activity Record Form Card */}
          {records.map((rec) => {
            const availableLgas = WASH_5W_LGAS_BY_STATE[rec.state] || [];
            const availableWards = WASH_5W_WARDS_BY_LGA[rec.lga] || [];
            const availableActivities = WASH_5W_ACTIVITIES_BY_DOMAIN[rec.domain] || [];

            // Disaggregation percentages
            const pctMen = rec.total > 0 ? Math.round(((Number(rec.men) || 0) / rec.total) * 100) : 0;
            const pctWomen = rec.total > 0 ? Math.round(((Number(rec.women) || 0) / rec.total) * 100) : 0;
            const pctBoys = rec.total > 0 ? Math.round(((Number(rec.boys) || 0) / rec.total) * 100) : 0;
            const pctGirls = rec.total > 0 ? Math.max(0, 100 - (pctMen + pctWomen + pctBoys)) : 0;

            return (
              <div
                key={rec.id}
                id={`record-card-${rec.id}`}
                className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-gray-800 overflow-hidden shadow-sm ${
                  activeTabRecordId === rec.id
                    ? "border-teal-600 ring-2 ring-teal-600/15 shadow-md"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setActiveTabRecordId(rec.id)}
              >
                {/* Record Card Header with controls */}
                <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-teal-700 text-white font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      #{rec.recordNumber}
                    </span>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>
                          {rec.activityType || "New 5W Activity"}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium">
                          {rec.domain}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {rec.state} · {rec.lga || "Select LGA"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Reach: <strong className="text-emerald-700 dark:text-emerald-300">{rec.total.toLocaleString()}</strong> beneficiaries
                        {rec.qtyAchieved ? ` · Achieved: ${rec.qtyAchieved} ${rec.unit}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this record */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      title="Duplicate this record (makes an exact copy of location & activity)"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateRecord(rec);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      <span>Duplicate</span>
                    </button>

                    {records.length > 1 && (
                      <button
                        type="button"
                        title="Remove this record"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecord(rec.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(rec.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title={rec.isExpanded !== false ? "Collapse" : "Expand"}
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          rec.isExpanded !== false ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form fields body (collapsible) */}
                {rec.isExpanded !== false && (
                  <div className="p-6 sm:p-7 space-y-7">
                    {/* Notice in each record */}
                    <div className="rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 px-4 py-2.5 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Record #{rec.recordNumber} Organisation:</span>
                        <span>{orgName} ({acronym}) · {orgType} · Donor: {donor || "Not specified"}</span>
                      </div>
                      <span className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">Auto-linked to WHO</span>
                    </div>

                    {/* ---------- WHERE ---------- */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-xs">
                          WHERE
                        </span>
                        <span>Geographic Location &amp; Settlement Site</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* State */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            State <span className="text-amber-600">*</span>
                          </label>
                          <select
                            required
                            value={rec.state}
                            onChange={(e) => updateRecord(rec.id, "state", e.target.value as any)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            {WASH_5W_STATES.map((s) => (
                              <option key={s.name} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Pcode1 */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Pcode_ADM1 <span className="text-gray-400 font-normal text-[11px]">(Autofill)</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={rec.pcode1}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3.5 py-2 text-sm font-mono text-gray-600 dark:text-gray-300"
                          />
                        </div>

                        {/* LGA */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            LGA <span className="text-amber-600">*</span>
                          </label>
                          <select
                            required
                            value={rec.lga}
                            onChange={(e) => updateRecord(rec.id, "lga", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none font-medium"
                          >
                            <option value="">Select LGA...</option>
                            {availableLgas.map((l) => (
                              <option key={l.name} value={l.name}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Pcode2 */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Pcode_ADM2 <span className="text-gray-400 font-normal text-[11px]">(Autofill)</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={rec.pcode2}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3.5 py-2 text-sm font-mono text-gray-600 dark:text-gray-300"
                          />
                        </div>

                        {/* Ward */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Ward <span className="text-amber-600">*</span>
                          </label>
                          <select
                            value={rec.ward}
                            onChange={(e) => updateRecord(rec.id, "ward", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            <option value="">Select Ward...</option>
                            {availableWards.map((w) => (
                              <option key={w.name} value={w.name}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Pcode3 */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Pcode_ADM3 <span className="text-gray-400 font-normal text-[11px]">(Autofill)</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={rec.pcode3}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3.5 py-2 text-sm font-mono text-gray-600 dark:text-gray-300"
                          />
                        </div>

                        {/* Location Type */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Type of Location
                          </label>
                          <select
                            value={rec.siteType}
                            onChange={(e) => updateRecord(rec.id, "siteType", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            {WASH_5W_SITE_TYPES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Location Name */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Location Name / Settlement
                          </label>
                          <input
                            type="text"
                            value={rec.locationName}
                            onChange={(e) => updateRecord(rec.id, "locationName", e.target.value)}
                            placeholder="e.g. Stadium Camp, Muna Garage"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>

                        {/* Location Population */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Location Population
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.locationPop}
                            onChange={(e) => updateRecord(rec.id, "locationPop", e.target.value)}
                            placeholder="e.g. 15000"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>

                        {/* Latitude, Longitude */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Latitude, Longitude <span className="text-gray-400 font-normal text-[11px]">(GPS coordinates for facilities)</span>
                          </label>
                          <input
                            type="text"
                            value={rec.latlong}
                            onChange={(e) => updateRecord(rec.id, "latlong", e.target.value)}
                            placeholder="e.g. 11.8464, 13.1603"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm font-mono text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ---------- WHAT ---------- */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-xs">
                          WHAT
                        </span>
                        <span>WASH Technical Domain &amp; Activity Output</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Emergency Type */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Intervention / Emergency Type
                          </label>
                          <select
                            value={rec.emergType}
                            onChange={(e) => updateRecord(rec.id, "emergType", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            {WASH_5W_EMERGENCY_TYPES.map((et) => (
                              <option key={et} value={et}>
                                {et}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* WASH Domain */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            WASH Domain <span className="text-amber-600">*</span>
                          </label>
                          <select
                            required
                            value={rec.domain}
                            onChange={(e) => updateRecord(rec.id, "domain", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm font-bold text-teal-800 dark:text-teal-300 focus:border-teal-600 focus:outline-none"
                          >
                            {WASH_5W_DOMAINS.map((dm) => (
                              <option key={dm} value={dm}>
                                {dm}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Activity */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Standard Activity <span className="text-amber-600">*</span>
                          </label>
                          <select
                            required
                            value={rec.activityType}
                            onChange={(e) => updateRecord(rec.id, "activityType", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm font-medium text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            {availableActivities.map((act) => (
                              <option key={act} value={act}>
                                {act}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Indicator */}
                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Sector Indicator <span className="text-gray-400 font-normal text-[11px]">(Autofill)</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={rec.indicator}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-700 dark:text-gray-300"
                          />
                        </div>

                        {/* Unit */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Unit <span className="text-gray-400 font-normal text-[11px]">(Autofill)</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={rec.unit}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300"
                          />
                        </div>

                        {/* Is HRP */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Is HRP Activity?
                          </label>
                          <select
                            value={rec.hrp}
                            onChange={(e) => updateRecord(rec.id, "hrp", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            {WASH_5W_HRP_LIST.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity Planned */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Quantity Planned
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.qtyPlanned}
                            onChange={(e) => updateRecord(rec.id, "qtyPlanned", e.target.value)}
                            placeholder="0"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>

                        {/* Quantity Achieved */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Quantity Achieved / Delivered <span className="text-amber-600">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={rec.qtyAchieved}
                            onChange={(e) => updateRecord(rec.id, "qtyAchieved", e.target.value)}
                            placeholder="0"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm font-bold text-teal-800 dark:text-teal-300 focus:border-teal-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ---------- FOR WHOM ---------- */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-xs">
                          FOR WHOM
                        </span>
                        <span>Disaggregated Beneficiaries Reached</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* Beneficiary Type */}
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Beneficiary Type
                          </label>
                          <select
                            value={rec.benefType}
                            onChange={(e) => updateRecord(rec.id, "benefType", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          >
                            {WASH_5W_BENEFICIARY_TYPES.map((bt) => (
                              <option key={bt} value={bt}>
                                {bt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Men (18+) */}
                        <div>
                          <label className="block text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                            Men (18+)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.men}
                            onChange={(e) => updateRecord(rec.id, "men", Number(e.target.value) || 0)}
                            className="w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 px-3 py-2 text-sm font-mono font-bold text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        {/* Women (18+) */}
                        <div>
                          <label className="block text-xs font-semibold text-rose-800 dark:text-rose-300 mb-1">
                            Women (18+)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.women}
                            onChange={(e) => updateRecord(rec.id, "women", Number(e.target.value) || 0)}
                            className="w-full rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 px-3 py-2 text-sm font-mono font-bold text-gray-900 dark:text-white focus:border-rose-500 focus:outline-none"
                          />
                        </div>

                        {/* Boys (<18) */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                            Boys (&lt;18)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.boys}
                            onChange={(e) => updateRecord(rec.id, "boys", Number(e.target.value) || 0)}
                            className="w-full rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 px-3 py-2 text-sm font-mono font-bold text-gray-900 dark:text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        {/* Girls (<18) */}
                        <div>
                          <label className="block text-xs font-semibold text-purple-800 dark:text-purple-300 mb-1">
                            Girls (&lt;18)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.girls}
                            onChange={(e) => updateRecord(rec.id, "girls", Number(e.target.value) || 0)}
                            className="w-full rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 px-3 py-2 text-sm font-mono font-bold text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        {/* Total Beneficiaries for this record */}
                        <div className="lg:col-span-4 bg-gray-50 dark:bg-gray-900/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-gray-700 dark:text-gray-300">
                              Calculated Total:
                            </span>
                            <span className="font-mono text-base font-extrabold text-teal-800 dark:text-teal-200">
                              {rec.total.toLocaleString()}
                            </span>
                          </div>
                          {rec.total > 0 && (
                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
                              <div style={{ width: `${pctMen}%` }} className="bg-blue-500 h-full" title={`Men: ${pctMen}%`} />
                              <div style={{ width: `${pctWomen}%` }} className="bg-rose-500 h-full" title={`Women: ${pctWomen}%`} />
                              <div style={{ width: `${pctBoys}%` }} className="bg-amber-500 h-full" title={`Boys: ${pctBoys}%`} />
                              <div style={{ width: `${pctGirls}%` }} className="bg-purple-500 h-full" title={`Girls: ${pctGirls}%`} />
                            </div>
                          )}
                        </div>

                        {/* PWD */}
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                            People with Disabilities (PWD)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rec.pwd}
                            onChange={(e) => updateRecord(rec.id, "pwd", Number(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 px-3 py-2 text-sm font-mono font-bold text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ---------- WHEN ---------- */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-xs">
                          WHEN
                        </span>
                        <span>Implementation Timeline &amp; Status</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Start Date */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Starting Date
                          </label>
                          <input
                            type="date"
                            value={rec.startDate}
                            onChange={(e) => updateRecord(rec.id, "startDate", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={rec.endDate}
                            onChange={(e) => updateRecord(rec.id, "endDate", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Status <span className="text-amber-600">*</span>
                          </label>
                          <select
                            required
                            value={rec.status}
                            onChange={(e) => updateRecord(rec.id, "status", e.target.value as any)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none font-semibold"
                          >
                            {WASH_5W_STATUS_LIST.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Comments */}
                        <div className="md:col-span-2 lg:col-span-4">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Comments / Operational Notes
                          </label>
                          <textarea
                            rows={2}
                            value={rec.comments}
                            onChange={(e) => updateRecord(rec.id, "comments", e.target.value)}
                            placeholder="Add any specific context, handover details, or water testing results..."
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Button to Add Record */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddNewRecord}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border-2 border-dashed border-teal-600/50 hover:border-teal-600 text-teal-800 dark:text-teal-200 font-bold text-sm shadow-xs hover:shadow-md transition-all active:scale-[0.99] w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add Another Activity Record</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: LIVE 5W RESPONSE MATRIX TABLE                                 */}
        {/* ========================================================================= */}
        <section
          id="session-matrix-table"
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-teal-50/20 dark:from-gray-800 dark:to-teal-950/20 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Response Monitoring Matrix (5W) — Live Preview</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Summary of all {records.length} activity entries prepared for submission
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportSessionCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300 min-w-[1200px]">
              <thead className="bg-[#0a3b39] text-[#dff0eb] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-3">#</th>
                  <th className="px-3.5 py-3">State</th>
                  <th className="px-3.5 py-3">LGA</th>
                  <th className="px-3.5 py-3">Ward</th>
                  <th className="px-3.5 py-3">Location Type</th>
                  <th className="px-3.5 py-3">Domain</th>
                  <th className="px-3.5 py-3">Activity</th>
                  <th className="px-3.5 py-3 text-right">Achieved</th>
                  <th className="px-3.5 py-3">Unit</th>
                  <th className="px-3.5 py-3 text-right">Beneficiaries</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-3.5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-sans">
                {records.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors"
                  >
                    <td className="px-3.5 py-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {rec.recordNumber}
                    </td>
                    <td className="px-3.5 py-3 font-semibold">{rec.state}</td>
                    <td className="px-3.5 py-3">{rec.lga}</td>
                    <td className="px-3.5 py-3 text-gray-500 dark:text-gray-400">{rec.ward || "—"}</td>
                    <td className="px-3.5 py-3">{rec.siteType}</td>
                    <td className="px-3.5 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium text-[11px]">
                        {rec.domain}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-medium max-w-[200px] truncate" title={rec.activityType}>
                      {rec.activityType}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono font-bold">
                      {rec.qtyAchieved || 0}
                    </td>
                    <td className="px-3.5 py-3 text-gray-500">{rec.unit}</td>
                    <td className="px-3.5 py-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {rec.total.toLocaleString()}
                    </td>
                    <td className="px-3.5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : rec.status === "In progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTabRecordId(rec.id);
                            const el = document.getElementById(`record-card-${rec.id}`);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="px-2 py-1 rounded text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateRecord(rec)}
                          className="px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                        >
                          Copy
                        </button>
                        {records.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="px-2 py-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs"
                          >
                            Del
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SUBMISSION BAR                                                            */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span>
              Submitting saves <strong>{records.length} activity {records.length === 1 ? "record" : "records"}</strong> for <strong>{orgName}</strong> ({acronym}) into the North East Nigeria WASH 5W database.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Form
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-3 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 text-sm font-bold hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save Draft ({records.length})</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Submit All Records ({records.length})</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
