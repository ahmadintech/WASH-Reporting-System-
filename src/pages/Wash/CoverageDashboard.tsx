import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { WashReport, ALL_ACTIVITIES } from "../../types/wash";
import {
  WASH_5W_LGAS_BY_STATE,
  WASH_5W_STATUS_LIST,
  WASH_5W_BENEFICIARY_TYPES,
  WASH_5W_DOMAINS,
} from "../../data/wash5wData";

/* ─── Standard Design Tokens (Outfit & Palette) ───────────────────── */
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
  ink:         "#132327",
  inkMuted:    "#485B60",
  inkLight:    "#728489",
  white:       "#FFFFFF",
};

export default function CoverageDashboard() {
  const { reports, exportCsv } = useWashData();

  // Filters state - public interactive observatory
  const [filterDomain, setFilterDomain] = useState<string>("");
  const [filterState, setFilterState] = useState<string>("");
  const [filterLga, setFilterLga] = useState<string>("");
  const [filterActivity, setFilterActivity] = useState<string>("");
  const [filterPeriod, setFilterPeriod] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPopGroup, setFilterPopGroup] = useState<string>("");
  const [filterOrg, setFilterOrg] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Record Inspection Modal state
  const [selectedReport, setSelectedReport] = useState<WashReport | null>(null);

  // Dynamic LGAs based on selected state
  const availableLgas = useMemo(() => {
    if (filterState && WASH_5W_LGAS_BY_STATE[filterState]) {
      return WASH_5W_LGAS_BY_STATE[filterState].map((l) => l.name);
    }
    const all: string[] = [];
    Object.values(WASH_5W_LGAS_BY_STATE).forEach((lgas) => {
      lgas.forEach((l) => all.push(l.name));
    });
    return Array.from(new Set(all)).sort();
  }, [filterState]);

  // Available unique periods
  const availablePeriods = useMemo(() => {
    const set = new Set<string>();
    reports.forEach((r) => {
      if (r.period) set.add(r.period);
    });
    return Array.from(set).sort().reverse();
  }, [reports]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterDomain) count++;
    if (filterState) count++;
    if (filterLga) count++;
    if (filterActivity) count++;
    if (filterPeriod) count++;
    if (filterStatus) count++;
    if (filterPopGroup) count++;
    if (filterOrg) count++;
    if (searchTerm) count++;
    return count;
  }, [
    filterDomain,
    filterState,
    filterLga,
    filterActivity,
    filterPeriod,
    filterStatus,
    filterPopGroup,
    filterOrg,
    searchTerm,
  ]);

  // Filtered dataset
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterDomain && r.domain && r.domain !== filterDomain) return false;
      if (filterState && r.state !== filterState) return false;
      if (filterLga && r.lga.toLowerCase() !== filterLga.toLowerCase()) return false;
      if (filterActivity && r.activityType !== filterActivity) return false;
      if (filterPeriod && r.period !== filterPeriod) return false;
      if (filterStatus && r.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
      if (
        filterPopGroup &&
        r.populationGroup &&
        !r.populationGroup.toLowerCase().includes(filterPopGroup.toLowerCase())
      ) {
        return false;
      }
      if (filterOrg && !r.orgName.toLowerCase().includes(filterOrg.trim().toLowerCase())) {
        return false;
      }
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
          r.orgName.toLowerCase().includes(query) ||
          r.activityType.toLowerCase().includes(query) ||
          r.state.toLowerCase().includes(query) ||
          r.lga.toLowerCase().includes(query) ||
          (r.ward && r.ward.toLowerCase().includes(query)) ||
          (r.settlement && r.settlement.toLowerCase().includes(query)) ||
          (r.focalPoint && r.focalPoint.toLowerCase().includes(query)) ||
          (r.donor && r.donor.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [
    reports,
    filterDomain,
    filterState,
    filterLga,
    filterActivity,
    filterPeriod,
    filterStatus,
    filterPopGroup,
    filterOrg,
    searchTerm,
  ]);

  // Paginated dataset
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage]);

  // Filtered statistics
  const statReports = filteredReports.length;
  const statBeneficiaries = filteredReports.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const statPartners = new Set(filteredReports.map((r) => r.orgName.trim()).filter(Boolean)).size;
  const statLgas = new Set(filteredReports.filter((r) => r.lga).map((r) => `${r.state}|${r.lga}`)).size;

  // Demographics
  const statWomen = filteredReports.reduce((acc, r) => acc + (Number(r.women) || 0), 0);
  const statGirls = filteredReports.reduce((acc, r) => acc + (Number(r.girls) || 0), 0);
  const statMen = filteredReports.reduce((acc, r) => acc + (Number(r.men) || 0), 0);
  const statBoys = filteredReports.reduce((acc, r) => acc + (Number(r.boys) || 0), 0);
  const statPwd = filteredReports.reduce((acc, r) => acc + (Number(r.pwd) || 0), 0);
  const femaleTotal = statWomen + statGirls;
  const femalePct = statBeneficiaries > 0 ? Math.round((femaleTotal / statBeneficiaries) * 100) : 0;

  // IDP beneficiaries reached
  const statIdps = filteredReports
    .filter((r) => r.populationGroup && r.populationGroup.toLowerCase().includes("idp"))
    .reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const idpPct = statBeneficiaries > 0 ? Math.round((statIdps / statBeneficiaries) * 100) : 0;

  // Chart data: Beneficiaries by State
  const stateTotals = useMemo(() => {
    const counts: Record<string, number> = { Borno: 0, Adamawa: 0, Yobe: 0 };
    filteredReports.forEach((r) => {
      if (counts[r.state] !== undefined) {
        counts[r.state] += Number(r.total) || 0;
      }
    });
    return counts;
  }, [filteredReports]);

  const maxStateTotal = Math.max(...Object.values(stateTotals), 1);

  // Chart data: Reports by Activity Type
  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReports.forEach((r) => {
      const act = r.activityType === "Other" ? r.activityOther || "Other" : r.activityType;
      counts[act] = (counts[act] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [filteredReports]);

  const maxActivityCount = Math.max(...activityCounts.map((a) => a[1]), 1);

  // Chart data: Status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Completed: 0,
      Ongoing: 0,
      Planned: 0,
      Suspended: 0,
    };
    filteredReports.forEach((r) => {
      const s = (r.status || "Planned").toLowerCase();
      if (s.includes("complete")) counts.Completed++;
      else if (s.includes("ongoing")) counts.Ongoing++;
      else if (s.includes("suspend")) counts.Suspended++;
      else counts.Planned++;
    });
    return counts;
  }, [filteredReports]);

  // Chart data: Domain Reach
  const domainTotals = useMemo(() => {
    const counts: Record<string, number> = {
      "Water Supply": 0,
      "Sanitation": 0,
      "Hygiene Promotion": 0,
      "WASH in Institutions": 0,
    };
    filteredReports.forEach((r) => {
      const d = r.domain || "Water Supply";
      if (counts[d] !== undefined) {
        counts[d] += Number(r.total) || 0;
      } else {
        counts["Water Supply"] += Number(r.total) || 0;
      }
    });
    return counts;
  }, [filteredReports]);

  const resetFilters = () => {
    setFilterDomain("");
    setFilterState("");
    setFilterLga("");
    setFilterActivity("");
    setFilterPeriod("");
    setFilterStatus("");
    setFilterPopGroup("");
    setFilterOrg("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const statusBadge = (status: string) => {
    const s = (status || "planned").toLowerCase();
    let bg = "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    let dot = "bg-amber-500";
    if (s.includes("complete")) {
      bg = "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      dot = "bg-emerald-500";
    } else if (s.includes("ongoing")) {
      bg = "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800";
      dot = "bg-sky-500";
    } else if (s.includes("suspend")) {
      bg = "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
      dot = "bg-rose-500";
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {status || "Planned"}
      </span>
    );
  };

  return (
    <>
      <PageMeta
        title="Coverage Dashboard | WASH Sector North East Nigeria"
        description="Public 5W response coverage monitoring observatory, partner interventions and beneficiary demographics across Borno, Adamawa, and Yobe states."
      />

      <div className="space-y-6 pb-16 font-sans">
        {/* ════════════════════════════════════════════════════════════════
            1. HERO OBSERVATORY HEADER (Public Read-Only Banner)
        ════════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-teal-800/30 bg-gradient-to-r from-[#061B20] via-[#0B3C46] to-[#12707E] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
          <div className="absolute left-1/2 bottom-0 -mb-12 w-64 h-64 rounded-full bg-teal-400/10 pointer-events-none blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Public Response Observatory
                </span>
                <span className="text-teal-300">·</span>
                <span className="bg-teal-900/80 border border-teal-400/30 text-teal-200 text-xs font-mono px-2.5 py-0.5 rounded-md font-semibold">
                  BAY STATES · 2026 CYCLE
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif leading-tight">
                WASH Response Coverage Dashboard
              </h1>
              <p className="mt-2 text-sm sm:text-base text-teal-100/90 leading-relaxed">
                Aggregated multi-agency water, sanitation, and hygiene assistance across Borno, Adamawa, and Yobe states. 
                Data synchronized in real-time from official 5W partner submissions.
              </p>
            </div>

            {/* Header Right: Read-Only Actions (CSV Export & Submit Report Navigation) */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => exportCsv(filteredReports)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all backdrop-blur-md shadow-sm"
                title="Download current filtered dataset as CSV"
              >
                <svg className="w-4 h-4 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export 5W Data (CSV)</span>
              </button>

              <Link
                to="/submit-report"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C1722F] hover:bg-[#A75D22] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Submit 5W Report</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            2. QUICK DOMAIN PILLS
        ════════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono mr-1">
            Domain:
          </span>
          {[
            { label: "All Interventions", value: "" },
            { label: "Water Supply", value: "Water Supply" },
            { label: "Sanitation", value: "Sanitation" },
            { label: "Hygiene Promotion", value: "Hygiene Promotion" },
            { label: "WASH in Institutions", value: "WASH in Institutions" },
          ].map((d) => {
            const active = filterDomain === d.value;
            return (
              <button
                key={d.label}
                type="button"
                onClick={() => {
                  setFilterDomain(d.value);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  active
                    ? "bg-teal-900 text-white border-teal-900 shadow-xs"
                    : "bg-white text-gray-700 hover:bg-teal-50 border-gray-200 hover:border-teal-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            3. 7 CORE HUMANITARIAN KPI CARDS
        ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {/* Card 1: Reports Submitted */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200/80 dark:border-gray-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Reports</span>
              <span className="w-2 h-2 rounded-full bg-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B3C46] dark:text-white mt-2 font-mono">
              {statReports.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              5W records matched
            </div>
          </div>

          {/* Card 2: Beneficiaries Reached */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-teal-200/80 dark:border-teal-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-900 dark:text-teal-300">People Reached</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-teal-800 dark:text-teal-300 mt-2 font-mono">
              {statBeneficiaries.toLocaleString()}
            </div>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 font-medium">
              Verified reach
            </div>
          </div>

          {/* Card 3: Partners Reporting */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200/80 dark:border-gray-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Partners</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">
              {statPartners}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Reporting agencies
            </div>
          </div>

          {/* Card 4: LGAs Covered */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200/80 dark:border-gray-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">LGAs</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">
              {statLgas} <span className="text-xs text-gray-400 font-normal">/ 65</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Admin-2 areas
            </div>
          </div>

          {/* Card 5: IDPs Reached */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-200/80 dark:border-amber-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">IDPs Assisted</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                {idpPct}%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 mt-2 font-mono">
              {statIdps.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
              Displaced persons
            </div>
          </div>

          {/* Card 6: Women & Girls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-rose-200/80 dark:border-rose-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-900 dark:text-rose-300">Women &amp; Girls</span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-900/60 px-1.5 py-0.5 rounded">
                {femalePct}%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-rose-800 dark:text-rose-300 mt-2 font-mono">
              {femaleTotal.toLocaleString()}
            </div>
            <div className="text-[11px] text-rose-700 dark:text-rose-400 mt-1">
              Female reach ratio
            </div>
          </div>

          {/* Card 7: PWD */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-200/80 dark:border-purple-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">Disabilities (PWD)</span>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-300 mt-2 font-mono">
              {statPwd.toLocaleString()}
            </div>
            <div className="text-[11px] text-purple-700 dark:text-purple-400 mt-1">
              Inclusion metric
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            4. MULTI-DIMENSIONAL FILTER BAR (Public Read-Only Filters)
        ════════════════════════════════════════════════════════════════ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-700 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
                Multi-Dimensional 5W Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount} Active
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-teal-800 dark:text-teal-300 hover:text-teal-950 hover:underline inline-flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search partner, LGA, ward..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none"
              />
            </div>

            {/* State Filter */}
            <div>
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setFilterLga("");
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              >
                <option value="">All States (Borno, Adamawa, Yobe)</option>
                <option value="Borno">Borno State</option>
                <option value="Adamawa">Adamawa State</option>
                <option value="Yobe">Yobe State</option>
              </select>
            </div>

            {/* Dynamic LGA Filter */}
            <div>
              <select
                value={filterLga}
                onChange={(e) => {
                  setFilterLga(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              >
                <option value="">
                  {filterState ? `All LGAs in ${filterState}` : "All LGAs (Select State to filter)"}
                </option>
                {availableLgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Type Filter */}
            <div>
              <select
                value={filterActivity}
                onChange={(e) => {
                  setFilterActivity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              >
                <option value="">All Activity Types</option>
                {ALL_ACTIVITIES.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {/* Reporting Period */}
            <div>
              <select
                value={filterPeriod}
                onChange={(e) => {
                  setFilterPeriod(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              >
                <option value="">All Reporting Periods</option>
                {availablePeriods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Implementation Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              >
                <option value="">All Statuses</option>
                {WASH_5W_STATUS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Population Group */}
            <div>
              <select
                value={filterPopGroup}
                onChange={(e) => {
                  setFilterPopGroup(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              >
                <option value="">All Population Groups</option>
                {WASH_5W_BENEFICIARY_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Organization Filter */}
            <div>
              <input
                type="text"
                placeholder="Filter by reporting partner..."
                value={filterOrg}
                onChange={(e) => {
                  setFilterOrg(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            5. ANALYTICAL CHARTS & VISUALIZATIONS (4 Core Breakdown Cards)
        ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Beneficiaries by State */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
                  Beneficiaries Reached by State
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Borno, Adamawa, and Yobe reach comparison
                </p>
              </div>
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 font-mono">
                Total: {statBeneficiaries.toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(stateTotals).map(([st, total]) => {
                const pct = Math.round((total / maxStateTotal) * 100) || 0;
                const share = statBeneficiaries > 0 ? Math.round((total / statBeneficiaries) * 100) : 0;
                return (
                  <div key={st}>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-gray-800 dark:text-gray-200 font-bold">{st} State</span>
                      <span className="font-mono text-gray-600 dark:text-gray-300">
                        {total.toLocaleString()} ({share}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-teal-700 to-teal-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Domain Reach Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
                  Intervention Reach by Domain
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Volume of assistance delivered per technical pillar
                </p>
              </div>
              <span className="text-xs font-mono text-gray-400">4 Pillars</span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(domainTotals).map(([domain, val]) => {
                const share = statBeneficiaries > 0 ? Math.round((val / statBeneficiaries) * 100) : 0;
                return (
                  <div key={domain}>
                    <div className="flex items-center justify-between text-xs mb-1 font-medium">
                      <span className="text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{domain}</span>
                      <span className="font-mono text-gray-600 dark:text-gray-300">
                        {val.toLocaleString()} ({share}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-[#C1722F]"
                        style={{ width: `${Math.min(100, share)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Demographic Reach Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
                  Demographic Breakdown
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Gender and inclusion ratios of people assisted
                </p>
              </div>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 font-mono">
                {femalePct}% Female
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-900">
                <div className="text-[11px] font-semibold text-pink-700 dark:text-pink-400 uppercase">Women</div>
                <div className="text-base font-bold text-pink-950 dark:text-pink-200 font-mono mt-1">
                  {statWomen.toLocaleString()}
                </div>
                <div className="text-[10px] text-pink-600 dark:text-pink-400 mt-0.5">
                  {statBeneficiaries > 0 ? Math.round((statWomen / statBeneficiaries) * 100) : 0}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900">
                <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase">Girls</div>
                <div className="text-base font-bold text-rose-950 dark:text-rose-200 font-mono mt-1">
                  {statGirls.toLocaleString()}
                </div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                  {statBeneficiaries > 0 ? Math.round((statGirls / statBeneficiaries) * 100) : 0}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900">
                <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase">Men</div>
                <div className="text-base font-bold text-blue-950 dark:text-blue-200 font-mono mt-1">
                  {statMen.toLocaleString()}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                  {statBeneficiaries > 0 ? Math.round((statMen / statBeneficiaries) * 100) : 0}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-900">
                <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 uppercase">Boys</div>
                <div className="text-base font-bold text-sky-950 dark:text-sky-200 font-mono mt-1">
                  {statBoys.toLocaleString()}
                </div>
                <div className="text-[10px] text-sky-600 dark:text-sky-400 mt-0.5">
                  {statBeneficiaries > 0 ? Math.round((statBoys / statBeneficiaries) * 100) : 0}%
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 uppercase">PWD</div>
                <div className="text-base font-bold text-purple-950 dark:text-purple-200 font-mono mt-1">
                  {statPwd.toLocaleString()}
                </div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5">
                  {statBeneficiaries > 0 ? Math.round((statPwd / statBeneficiaries) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Chart 4: Implementation Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
                  Activity Status Distribution
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Delivery progress across all verified records
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                {statusCounts.Completed} Completed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                <div className="text-[11px] font-semibold text-emerald-800 uppercase">Completed</div>
                <div className="text-xl font-bold text-emerald-900 font-mono mt-1">
                  {statusCounts.Completed}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200">
                <div className="text-[11px] font-semibold text-sky-800 uppercase">Ongoing</div>
                <div className="text-xl font-bold text-sky-900 font-mono mt-1">
                  {statusCounts.Ongoing}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                <div className="text-[11px] font-semibold text-amber-800 uppercase">Planned</div>
                <div className="text-xl font-bold text-amber-900 font-mono mt-1">
                  {statusCounts.Planned}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200">
                <div className="text-[11px] font-semibold text-rose-800 uppercase">Suspended</div>
                <div className="text-xl font-bold text-rose-900 font-mono mt-1">
                  {statusCounts.Suspended}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            6. AGGREGATED 5W RESPONSE MATRIX TABLE (Public Read-Only View)
        ════════════════════════════════════════════════════════════════ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  5W Operational Response Matrix
                </h3>
                <span className="bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  {filteredReports.length} records
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Click any row or view button to inspect the full 5W record breakdown (WHO, WHAT, WHERE, WHEN, FOR WHOM)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportCsv(filteredReports)}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 dark:text-teal-300 dark:hover:text-white border border-teal-300 dark:border-teal-700 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Filtered (CSV)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 uppercase font-mono text-[11px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3.5 px-4">Partner &amp; Type</th>
                  <th className="py-3.5 px-4">Activity &amp; Domain</th>
                  <th className="py-3.5 px-4">Location (LGA, Ward)</th>
                  <th className="py-3.5 px-4">Period &amp; Status</th>
                  <th className="py-3.5 px-4">Target Group</th>
                  <th className="py-3.5 px-4 text-right">Beneficiaries</th>
                  <th className="py-3.5 px-4 text-center">Inspect Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="max-w-sm mx-auto">
                        <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No matching 5W reports found</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Try adjusting or clearing your search and filter options.
                        </p>
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 text-xs font-bold text-teal-800 dark:text-teal-400 hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReport(r)}
                      className="hover:bg-teal-50/40 dark:hover:bg-teal-950/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white">
                        <div className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                          {r.orgName}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">
                          {r.orgType || "NGO"} · {r.donor || "Unspecified Donor"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={r.activityType}>
                          {r.activityType === "Other" ? r.activityOther || "Other" : r.activityType}
                        </div>
                        <div className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                          {r.domain || "Water Supply"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                          {r.state}, {r.lga}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {r.ward || r.settlement || "General Ward"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold mb-1">
                          {r.period || "Current Cycle"}
                        </div>
                        {statusBadge(r.status)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                        <span className="truncate block max-w-[140px]" title={r.populationGroup || "General"}>
                          {r.populationGroup || "Host community"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                        <div className="text-sm">{(Number(r.total) || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                          {Number(r.women) || 0}W · {Number(r.girls) || 0}G · {Number(r.men) || 0}M
                        </div>
                      </td>
                      {/* PURE PUBLIC VIEW ACTION ONLY - NO DELETE OR EDIT */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedReport(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 transition-colors"
                          title="Inspect 5W Metadata"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing <span className="font-bold text-gray-800 dark:text-gray-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {Math.min(currentPage * itemsPerPage, filteredReports.length)}
                </span>{" "}
                of <span className="font-bold text-gray-800 dark:text-gray-200">{filteredReports.length}</span> reports
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  if (
                    pNum === 1 ||
                    pNum === totalPages ||
                    (pNum >= currentPage - 1 && pNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => setCurrentPage(pNum)}
                        className={`px-3 py-1 text-xs font-semibold rounded border ${
                          currentPage === pNum
                            ? "bg-teal-800 text-white border-teal-800"
                            : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  }
                  if (pNum === currentPage - 2 || pNum === currentPage + 2) {
                    return <span key={pNum} className="px-1 text-xs text-gray-400">...</span>;
                  }
                  return null;
                })}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            7. 5W RECORD INSPECTION MODAL (Detailed Humanitarian Breakdown)
        ════════════════════════════════════════════════════════════════ */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs uppercase text-teal-300 tracking-wider">
                      5W Inspection Record
                    </span>
                    <span className="text-teal-400">·</span>
                    <span className="text-xs font-mono bg-teal-800/80 px-2 py-0.5 rounded text-teal-200">
                      ID: {selectedReport.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif">
                    {selectedReport.orgName} — {selectedReport.activityType}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0 ml-3"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body: 5 Official Humanitarian Dimensions */}
              <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* 1. WHO */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center font-mono">1</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 font-mono">
                      WHO — Reporting &amp; Implementing Agencies
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Reporting Org</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.orgName}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Org Classification</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.orgType || "NGO"}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Donor Partner</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.donor || "Direct / Cluster"}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Focal Point</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.focalPoint || "Cluster Secretariat"}</div>
                    </div>
                  </div>
                </div>

                {/* 2. WHAT */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center font-mono">2</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 font-mono">
                      WHAT — Domain, Activity &amp; Output Indicators
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Technical Domain</div>
                      <div className="font-bold text-teal-800 dark:text-teal-300 mt-0.5">{selectedReport.domain || "Water Supply"}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:col-span-2">
                      <div className="text-gray-400 text-[11px]">Activity Undertaken</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                        {selectedReport.activityType === "Other" ? selectedReport.activityOther : selectedReport.activityType}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Key Indicator</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5 truncate" title={selectedReport.indicator}>
                        {selectedReport.indicator || "Standard 5W Metric"}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Quantity Planned</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5 font-mono">
                        {selectedReport.qtyPlanned || "—"} {selectedReport.unit || ""}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Quantity Achieved</div>
                      <div className="font-bold text-teal-800 dark:text-teal-300 mt-0.5 font-mono">
                        {selectedReport.qtyAchieved || "—"} {selectedReport.unit || ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. WHERE */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center font-mono">3</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 font-mono">
                      WHERE — Geographical Coordinates &amp; Administrative Hierarchy
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">State (Admin 1)</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.state}</div>
                      {selectedReport.pcode1 && (
                        <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 mt-0.5">P-Code: {selectedReport.pcode1}</div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">LGA (Admin 2)</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.lga}</div>
                      {selectedReport.pcode2 && (
                        <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 mt-0.5">P-Code: {selectedReport.pcode2}</div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Ward (Admin 3)</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.ward || "—"}</div>
                      {selectedReport.pcode3 && (
                        <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 mt-0.5">P-Code: {selectedReport.pcode3}</div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Site / Settlement</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                        {selectedReport.settlement || selectedReport.locationType || "Community site"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. WHEN */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center font-mono">4</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 font-mono">
                      WHEN — Timeline &amp; Delivery Status
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Reporting Period</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5 font-mono">{selectedReport.period || "2026 Cycle"}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Activity Status</div>
                      <div className="mt-1">{statusBadge(selectedReport.status)}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">Start Date</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5 font-mono">{selectedReport.startDate || "—"}</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[11px]">End Date</div>
                      <div className="font-bold text-gray-900 dark:text-white mt-0.5 font-mono">{selectedReport.endDate || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* 5. FOR WHOM */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center font-mono">5</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 font-mono">
                      FOR WHOM — Beneficiary Demographics &amp; Population Group
                    </h4>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg border border-teal-200 dark:border-teal-800 text-xs mb-2">
                    <span className="text-teal-800 dark:text-teal-300 font-semibold">Target Population Group: </span>
                    <span className="font-bold text-teal-950 dark:text-white">{selectedReport.populationGroup || "Host Community"}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[10px]">Women</div>
                      <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{(Number(selectedReport.women) || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[10px]">Girls</div>
                      <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{(Number(selectedReport.girls) || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[10px]">Men</div>
                      <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{(Number(selectedReport.men) || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-gray-400 text-[10px]">Boys</div>
                      <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{(Number(selectedReport.boys) || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200">
                      <div className="text-purple-700 dark:text-purple-300 text-[10px] font-bold">PWD</div>
                      <div className="font-bold text-purple-900 dark:text-purple-200 font-mono mt-0.5">{(Number(selectedReport.pwd) || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 rounded-lg border border-teal-300">
                      <div className="text-teal-800 dark:text-teal-300 text-[10px] font-bold">Total Reached</div>
                      <div className="font-extrabold text-teal-950 dark:text-white font-mono mt-0.5">{(Number(selectedReport.total) || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Operational Notes */}
                {selectedReport.comments && (
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600 text-xs">
                    <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-mono text-[10px]">Field Notes / Constraints:</span>
                    <p className="mt-1 text-gray-600 dark:text-gray-300 leading-relaxed italic">
                      "{selectedReport.comments}"
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-100 dark:bg-gray-700/60 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono">
                  Standard WASH Sector 5W Monitoring Record
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
