import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { WashReport, ALL_ACTIVITIES } from "../../types/wash";
import {
  WASH_5W_LGAS_BY_STATE,
  WASH_5W_STATUS_LIST,
  WASH_5W_BENEFICIARY_TYPES,
  WASH_5W_DOMAINS,
} from "../../data/wash5wData";

export default function CoverageDashboard() {
  const { reports, deleteReport, exportCsv } = useWashData();
  const { currentUser, isAuthenticated } = useAuth();

  // Filters state - open & interactive for all users (public, partner, coordinator, admin)
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

  // Detail Modal state
  const [selectedReport, setSelectedReport] = useState<WashReport | null>(null);

  // Dynamic LGAs based on selected state
  const availableLgas = useMemo(() => {
    if (filterState && WASH_5W_LGAS_BY_STATE[filterState]) {
      return WASH_5W_LGAS_BY_STATE[filterState].map((l) => l.name);
    }
    // All LGAs combined
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

  // Filtered stats
  const statReports = filteredReports.length;
  const statBeneficiaries = filteredReports.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const statPartners = new Set(filteredReports.map((r) => r.orgName.trim()).filter(Boolean)).size;
  const statLgas = new Set(filteredReports.filter((r) => r.lga).map((r) => `${r.state}|${r.lga}`)).size;

  // Additional stats: Demographics
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
      .slice(0, 7);
  }, [filteredReports]);

  const maxActivityCount = Math.max(...activityCounts.map((a) => a[1]), 1);

  // Chart data: Status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Completed: 0, Ongoing: 0, Planned: 0, Suspended: 0 };
    filteredReports.forEach((r) => {
      const s = r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase() : "Planned";
      if (counts[s] !== undefined) counts[s]++;
      else counts.Planned++;
    });
    return counts;
  }, [filteredReports]);

  const handleClearFilters = () => {
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

  const handleDelete = (r: WashReport) => {
    const canDelete =
      currentUser?.role === "admin" ||
      currentUser?.role === "coordinator" ||
      (currentUser?.role === "partner" &&
        r.orgName.toLowerCase().includes((currentUser.organization || "").toLowerCase()));

    if (!canDelete) {
      alert("Permission notice: Please sign in with appropriate administrative credentials to delete this report.");
      return;
    }

    if (confirm(`Delete 5W response record for "${r.orgName} — ${r.activityType} (${r.lga})"? This cannot be undone.`)) {
      deleteReport(r.id);
    }
  };

  const statusBadge = (status: string) => {
    const s = (status || "planned").toLowerCase();
    let bg = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    if (s.includes("complete")) {
      bg = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    } else if (s.includes("ongoing")) {
      bg = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    } else if (s.includes("suspend")) {
      bg = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${bg}`}>
        {status || "Planned"}
      </span>
    );
  };

  return (
    <>
      <PageMeta
        title="Coverage Dashboard | WASH Sector North East Nigeria"
        description="Public 5W response coverage monitoring matrix, partner interventions and beneficiary demographics across Borno, Adamawa, and Yobe states."
      />

      <div className="space-y-6 pb-12">
        {/* Top Header Card mirroring WASH 5W Reporting Platform HTML */}
        <div className="rounded-xl border border-teal-800/20 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-teal-300 uppercase tracking-widest font-semibold">
                  Response Monitoring Matrix
                </span>
                <span className="text-teal-400">·</span>
                <span className="bg-teal-700/60 border border-teal-500/40 text-teal-200 text-[11px] font-mono px-2 py-0.5 rounded font-medium">
                  BORNO · ADAMAWA · YOBE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
                Coverage Dashboard
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
                Aggregated WASH humanitarian interventions, sector reach, and geographical coverage.
                All data is synchronized with the approved 5W sector monitoring framework.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                to="/submit-report"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Submit 5W Report</span>
              </Link>
              <button
                onClick={() => exportCsv(filteredReports)}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV ({filteredReports.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/70">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-700 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                Interactive Filters
              </h2>
              {activeFilterCount > 0 && (
                <span className="bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <span>Reset all filters</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {/* State */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                State
              </label>
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setFilterLga("");
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
              >
                <option value="">All States</option>
                <option value="Borno">Borno ({reports.filter((r) => r.state === "Borno").length})</option>
                <option value="Adamawa">Adamawa ({reports.filter((r) => r.state === "Adamawa").length})</option>
                <option value="Yobe">Yobe ({reports.filter((r) => r.state === "Yobe").length})</option>
              </select>
            </div>

            {/* LGA */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                LGA
              </label>
              <select
                value={filterLga}
                onChange={(e) => {
                  setFilterLga(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
              >
                <option value="">All LGAs ({availableLgas.length})</option>
                {availableLgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Activity Type
              </label>
              <select
                value={filterActivity}
                onChange={(e) => {
                  setFilterActivity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
              >
                <option value="">All Activities</option>
                {ALL_ACTIVITIES.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {/* Reporting Period */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Reporting Period
              </label>
              <select
                value={filterPeriod}
                onChange={(e) => {
                  setFilterPeriod(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
              >
                <option value="">All Periods</option>
                {availablePeriods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Population Group
              </label>
              <select
                value={filterPopGroup}
                onChange={(e) => {
                  setFilterPopGroup(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
              >
                <option value="">All Groups</option>
                {WASH_5W_BENEFICIARY_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Organisation / Partner Search */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Partner / Org
              </label>
              <input
                type="text"
                value={filterOrg}
                onChange={(e) => {
                  setFilterOrg(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search partner name..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stat Cards - Snapshot Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Reports Filtered */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Reports Submitted
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-teal-900 dark:text-teal-200 font-mono">
              {statReports.toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">active submissions</div>
          </div>

          {/* Beneficiaries Reached */}
          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Beneficiaries Reached
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {statBeneficiaries.toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">individuals assisted</div>
          </div>

          {/* Partners Active */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Partners Reporting
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-teal-900 dark:text-teal-200 font-mono">
              {statPartners.toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">accredited agencies</div>
          </div>

          {/* LGAs Covered */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              LGAs Covered
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400 font-mono">
              {statLgas.toLocaleString()}
              <span className="text-xs text-gray-400 font-normal ml-1">/ 65</span>
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">across BAY states</div>
          </div>

          {/* IDPs Reached */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              IDPs Assisted
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-teal-900 dark:text-teal-200 font-mono">
              {statIdps.toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-teal-700 dark:text-teal-400 font-medium">
              {idpPct}% of total reached
            </div>
          </div>

          {/* Women & Girls Reached */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Women &amp; Girls
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300 font-mono">
              {femaleTotal.toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-purple-600 dark:text-purple-400 font-medium">
              {femalePct}% female ratio
            </div>
          </div>

          {/* PWD Reached */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Persons with Disabilities
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-teal-900 dark:text-teal-200 font-mono">
              {statPwd.toLocaleString()}
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">vulnerability focus</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Chart 1: Beneficiaries by State */}
          <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700/60">
              <div>
                <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                  Beneficiaries Reached by State
                </h3>
                <p className="text-[11px] text-gray-400">Distribution across Borno, Adamawa and Yobe</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded">
                {statBeneficiaries.toLocaleString()} Total
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {Object.entries(stateTotals).map(([st, count]) => {
                const pct = statBeneficiaries > 0 ? Math.round((count / statBeneficiaries) * 100) : 0;
                const barWidth = Math.round((count / maxStateTotal) * 100);
                return (
                  <div key={st} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-800 dark:text-white font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                        {st} State
                      </span>
                      <span className="font-mono text-teal-900 dark:text-teal-300">
                        {count.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-5 bg-gray-100 dark:bg-gray-700/70 rounded-md overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-teal-700 to-teal-500 rounded-sm transition-all duration-500"
                        style={{ width: `${Math.max(barWidth, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Reports by Activity Type */}
          <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700/60">
              <div>
                <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                  Top Activities Reported
                </h3>
                <p className="text-[11px] text-gray-400">Breakdown of interventions submitted</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded">
                {statReports} Submissions
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {activityCounts.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No activity data for current filter</div>
              ) : (
                activityCounts.map(([act, count]) => {
                  const barWidth = Math.round((count / maxActivityCount) * 100);
                  return (
                    <div key={act} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs font-medium" title={act}>
                          {act}
                        </span>
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0">
                          {count} {count === 1 ? "report" : "reports"}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 dark:bg-gray-700/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(barWidth, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chart 3: Demographics Breakdown */}
          <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700/60">
              <div>
                <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                  Demographic Breakdown (FOR WHOM)
                </h3>
                <p className="text-[11px] text-gray-400">Age, gender and vulnerability matrix</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded">
                {statBeneficiaries.toLocaleString()} Individuals
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40">
                <div className="text-[10px] uppercase font-bold text-pink-700 dark:text-pink-300">Women (18+)</div>
                <div className="text-base font-bold font-mono text-pink-800 dark:text-pink-200 mt-1">
                  {statWomen.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">Girls (&lt;18)</div>
                <div className="text-base font-bold font-mono text-indigo-800 dark:text-indigo-200 mt-1">
                  {statGirls.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Men (18+)</div>
                <div className="text-base font-bold font-mono text-blue-800 dark:text-blue-200 mt-1">
                  {statMen.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40">
                <div className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-300">Boys (&lt;18)</div>
                <div className="text-base font-bold font-mono text-cyan-800 dark:text-cyan-200 mt-1">
                  {statBoys.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Combined Gender Proportional Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Gender &amp; Age Distribution</span>
                <span>{femalePct}% Female / {100 - femalePct}% Male</span>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-700">
                <div
                  style={{ width: `${statBeneficiaries > 0 ? (statWomen / statBeneficiaries) * 100 : 25}%` }}
                  className="bg-pink-500 h-full"
                  title={`Women: ${statWomen.toLocaleString()}`}
                />
                <div
                  style={{ width: `${statBeneficiaries > 0 ? (statGirls / statBeneficiaries) * 100 : 25}%` }}
                  className="bg-purple-500 h-full"
                  title={`Girls: ${statGirls.toLocaleString()}`}
                />
                <div
                  style={{ width: `${statBeneficiaries > 0 ? (statMen / statBeneficiaries) * 100 : 25}%` }}
                  className="bg-blue-500 h-full"
                  title={`Men: ${statMen.toLocaleString()}`}
                />
                <div
                  style={{ width: `${statBeneficiaries > 0 ? (statBoys / statBeneficiaries) * 100 : 25}%` }}
                  className="bg-cyan-500 h-full"
                  title={`Boys: ${statBoys.toLocaleString()}`}
                />
              </div>
            </div>
          </div>

          {/* Chart 4: Implementation Status Breakdown */}
          <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700/60">
              <div>
                <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                  Activity Implementation Status
                </h3>
                <p className="text-[11px] text-gray-400">Progress against planned milestones</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                {statusCounts.Completed} Completed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Completed</div>
                <div className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-200 mt-1">
                  {statusCounts.Completed}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  {statReports > 0 ? Math.round((statusCounts.Completed / statReports) * 100) : 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 text-center">
                <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Ongoing</div>
                <div className="text-2xl font-bold font-mono text-blue-800 dark:text-blue-200 mt-1">
                  {statusCounts.Ongoing}
                </div>
                <div className="text-[10px] text-blue-600 mt-0.5">
                  {statReports > 0 ? Math.round((statusCounts.Ongoing / statReports) * 100) : 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30 text-center">
                <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">Planned</div>
                <div className="text-2xl font-bold font-mono text-amber-800 dark:text-amber-200 mt-1">
                  {statusCounts.Planned}
                </div>
                <div className="text-[10px] text-amber-600 mt-0.5">
                  {statReports > 0 ? Math.round((statusCounts.Planned / statReports) * 100) : 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-center">
                <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300">Suspended</div>
                <div className="text-2xl font-bold font-mono text-rose-800 dark:text-rose-200 mt-1">
                  {statusCounts.Suspended}
                </div>
                <div className="text-[10px] text-rose-600 mt-0.5">
                  {statReports > 0 ? Math.round((statusCounts.Suspended / statReports) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregated Reports Table Card */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Aggregated Reports</span>
                <span className="text-xs font-mono font-normal text-gray-500">
                  ({filteredReports.length} {filteredReports.length === 1 ? "record" : "records"})
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct humanitarian field response log across Borno, Adamawa, and Yobe
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Quick in-table search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter table..."
                  className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:border-teal-600 focus:outline-none w-48 sm:w-60"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => exportCsv(filteredReports)}
                className="rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/60 px-3.5 py-1.5 text-xs font-bold border border-teal-200 dark:border-teal-800 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Partner</th>
                  <th className="py-3.5 px-4 font-semibold">Activity</th>
                  <th className="py-3.5 px-4 font-semibold">State</th>
                  <th className="py-3.5 px-4 font-semibold">LGA / Ward</th>
                  <th className="py-3.5 px-4 font-semibold">Period</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Population Group</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Beneficiaries</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                        No reports match the current filters yet.
                      </div>
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 underline"
                      >
                        Clear filters to see all reports
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-teal-50/30 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(r)}
                    >
                      <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white">
                        <div className="font-semibold text-teal-950 dark:text-teal-200">{r.orgName}</div>
                        <div className="text-[10px] text-gray-400">{r.orgType || "NGO"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300">
                        <div className="font-medium">
                          {r.activityType === "Other" ? r.activityOther || "Other" : r.activityType}
                        </div>
                        {r.domain && <div className="text-[10px] text-teal-600 dark:text-teal-400">{r.domain}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 dark:text-gray-200 font-medium">
                        {r.state}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                        <div>{r.lga}</div>
                        {r.ward && <div className="text-[10px] text-gray-400">{r.ward}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {r.period || "—"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {statusBadge(r.status)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                        <span className="truncate block max-w-[140px]" title={r.populationGroup || "General"}>
                          {r.populationGroup || "Host community"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                        <div>{(Number(r.total) || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {Number(r.women) || 0}W · {Number(r.men) || 0}M
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(r)}
                            className="p-1 rounded text-teal-700 hover:text-teal-900 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40"
                            title="View Full 5W Record"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {(currentUser?.role === "admin" ||
                            currentUser?.role === "coordinator" ||
                            (currentUser?.role === "partner" &&
                              r.orgName.toLowerCase().includes((currentUser.organization || "").toLowerCase()))) && (
                            <button
                              type="button"
                              onClick={() => handleDelete(r)}
                              className="p-1 rounded text-rose-600 hover:text-rose-800 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40"
                              title="Delete Record"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredReports.length > itemsPerPage && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between gap-3 text-xs text-gray-500">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} records
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Previous
                </button>
                <span className="px-2 font-mono font-bold text-gray-800 dark:text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full 5W Record Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase">
                    5W Record Inspection
                  </span>
                  <span>·</span>
                  {statusBadge(selectedReport.status)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedReport.orgName}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedReport.activityType} ({selectedReport.state} — {selectedReport.lga})
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content Sections */}
            <div className="space-y-4 text-xs">
              {/* WHO */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">
                  1. WHO — Implementing Agency &amp; Governance
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block">Organisation:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.orgName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Classification:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.orgType || "NGO"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Donor Partner:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.donor || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Focal Person:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.focalPoint || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Contact Email:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.email || "—"}</span>
                  </div>
                </div>
              </div>

              {/* WHAT */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">
                  2. WHAT — Intervention Details &amp; Quantity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <span className="text-gray-400 block">Activity:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.activityType}</span>
                  </div>
                  {selectedReport.domain && (
                    <div>
                      <span className="text-gray-400 block">Domain:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.domain}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block">Output Quantity:</span>
                    <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">
                      {selectedReport.quantity || "—"} {selectedReport.unit || ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Delivery Modality:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.modality || "In-kind"}</span>
                  </div>
                </div>
              </div>

              {/* WHERE */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">
                  3. WHERE — Location &amp; Settlement
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block">State:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.state}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">LGA:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.lga}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Ward:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.ward || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Settlement / Camp:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.settlement || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Location Setting:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.locationType || "Host community"}</span>
                  </div>
                </div>
              </div>

              {/* WHEN */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">
                  4. WHEN — Reporting Timeline
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <span className="text-gray-400 block font-sans">Period:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.period || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-sans">Start Date:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.startDate || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-sans">End Date:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedReport.endDate || "—"}</span>
                  </div>
                </div>
              </div>

              {/* FOR WHOM */}
              <div className="rounded-xl border border-teal-200 dark:border-teal-800 p-4 bg-teal-50/40 dark:bg-teal-950/20">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-2">
                  5. FOR WHOM — Beneficiary Demographics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center mb-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 block">Women (18+)</span>
                    <span className="font-bold font-mono text-gray-900 dark:text-white">
                      {(Number(selectedReport.women) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 block">Girls (&lt;18)</span>
                    <span className="font-bold font-mono text-gray-900 dark:text-white">
                      {(Number(selectedReport.girls) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 block">Men (18+)</span>
                    <span className="font-bold font-mono text-gray-900 dark:text-white">
                      {(Number(selectedReport.men) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 block">Boys (&lt;18)</span>
                    <span className="font-bold font-mono text-gray-900 dark:text-white">
                      {(Number(selectedReport.boys) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 block">PWD</span>
                    <span className="font-bold font-mono text-gray-900 dark:text-white">
                      {(Number(selectedReport.pwd) || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-teal-200 dark:border-teal-800">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Total Individuals Reached:</span>
                  <span className="text-base font-bold font-mono text-teal-700 dark:text-teal-300">
                    {(Number(selectedReport.total) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-[11px] text-gray-400 font-mono">
                ID: {selectedReport.id}
              </span>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
