import React, { useState, useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { WashReport, ALL_ACTIVITIES } from "../../types/wash";

export default function CoverageDashboard() {
  const { reports, deleteReport, exportCsv } = useWashData();
  const { currentUser } = useAuth();
  const isPartner = currentUser.role === "partner";

  // Filters state - targeted on state & community for partners
  const [filterState, setFilterState] = useState<string>(isPartner ? (currentUser.state || "Borno") : "");
  const [filterLga, setFilterLga] = useState<string>(isPartner ? (currentUser.lga || "Maiduguri") : "");
  const [filterActivity, setFilterActivity] = useState<string>("");
  const [filterPeriod, setFilterPeriod] = useState<string>("");
  const [filterOrg, setFilterOrg] = useState<string>(isPartner ? currentUser.organization : "");

  // Modal detail view
  const [selectedReport, setSelectedReport] = useState<WashReport | null>(null);

  // Available unique periods
  const availablePeriods = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.period).filter(Boolean))).sort().reverse();
  }, [reports]);

  // Filtered dataset
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterState && r.state !== filterState) return false;
      if (filterLga && r.lga.toLowerCase() !== filterLga.toLowerCase()) return false;
      if (filterActivity && r.activityType !== filterActivity) return false;
      if (filterPeriod && r.period !== filterPeriod) return false;
      if (filterOrg && !r.orgName.toLowerCase().includes(filterOrg.trim().toLowerCase())) return false;
      return true;
    });
  }, [reports, filterState, filterLga, filterActivity, filterPeriod, filterOrg]);

  // Filtered stats
  const statReports = filteredReports.length;
  const statBeneficiaries = filteredReports.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const statPartners = new Set(filteredReports.map((r) => r.orgName.trim()).filter(Boolean)).size;
  const statLgas = new Set(filteredReports.filter((r) => r.lga).map((r) => `${r.state}|${r.lga}`)).size;

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

  const handleClearFilters = () => {
    setFilterState(isPartner ? (currentUser.state || "Borno") : "");
    setFilterLga(isPartner ? (currentUser.lga || "Maiduguri") : "");
    setFilterActivity("");
    setFilterPeriod("");
    setFilterOrg(isPartner ? currentUser.organization : "");
  };

  const handleDelete = (r: WashReport) => {
    // Permission check
    const canDelete =
      currentUser.role === "admin" ||
      currentUser.role === "coordinator" ||
      (currentUser.role === "partner" && r.orgName.toLowerCase().includes(currentUser.organization.toLowerCase()));

    if (!canDelete) {
      alert("Permission denied: You can only delete reports submitted by your own organisation.");
      return;
    }

    if (confirm(`Delete 5W report for "${r.orgName} - ${r.activityType} (${r.lga})"? This cannot be undone.`)) {
      deleteReport(r.id);
    }
  };

  return (
    <>
      <PageMeta
        title="Analytics | WASH Sector North East Nigeria"
        description="Filter and analyze 5W response coverage and humanitarian interventions"
      />

      <div className="space-y-6">
        {/* Header Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <span>Response Coverage & Monitoring</span>
              {isPartner && (
                <>
                  <span>·</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                    {currentUser.organization} Community Operations ({currentUser.lga || "Maiduguri"}, {currentUser.state || "Borno"})
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportCsv(filteredReports)}
              className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV ({filteredReports.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                State
              </label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                disabled={isPartner}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {!isPartner && <option value="">All States</option>}
                <option value="Borno">Borno</option>
                <option value="Adamawa">Adamawa</option>
                <option value="Yobe">Yobe</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Activity Type
              </label>
              <select
                value={filterActivity}
                onChange={(e) => setFilterActivity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">All Activities</option>
                {ALL_ACTIVITIES.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Reporting Month
              </label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">All Periods</option>
                {availablePeriods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Organisation / Partner
              </label>
              <input
                type="text"
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
                placeholder="Search partner name..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-2 px-3 text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Live Filter-Aware Stat Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Reports Filtered
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-brand-700 dark:text-brand-300 font-mono">
              {statReports.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">matching criteria</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Beneficiaries Reached
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {statBeneficiaries.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">individuals assisted</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Partners Active
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-brand-700 dark:text-brand-300 font-mono">
              {statPartners.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">organisations</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              LGAs Covered
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-clay-600 dark:text-clay-400 font-mono">
              {statLgas.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">local government areas</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Beneficiaries by State */}
          <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
                Beneficiaries Reached by State
              </h3>
              <span className="text-xs font-mono text-gray-400">Deep Teal (#12707E)</span>
            </div>

            <div className="space-y-4 pt-2">
              {Object.entries(stateTotals).map(([st, count]) => {
                const pct = Math.round((count / maxStateTotal) * 100);
                return (
                  <div key={st} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-800 dark:text-white font-bold">{st} State</span>
                      <span className="font-mono text-brand-700 dark:text-brand-300">
                        {count.toLocaleString()} beneficiaries
                      </span>
                    </div>
                    <div className="w-full h-5 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden p-0.5">
                      <div
                        className="h-full bg-brand-500 dark:bg-brand-400 rounded-md transition-all duration-500"
                        style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reports by Activity Type */}
          <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
                Top Activities Reported
              </h3>
              <span className="text-xs font-mono text-gray-400">WASH Clay (#C1722F)</span>
            </div>

            <div className="space-y-3 pt-1">
              {activityCounts.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No activity data for current filter</div>
              ) : (
                activityCounts.map(([act, count]) => {
                  const pct = Math.round((count / maxActivityCount) * 100);
                  return (
                    <div key={act} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs font-medium">
                          {act}
                        </span>
                        <span className="font-mono font-bold text-clay-600 dark:text-clay-400 shrink-0">
                          {count} {count === 1 ? "report" : "reports"}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-clay-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* All Submitted Reports Table */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                All Submitted 5W Reports ({filteredReports.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct humanitarian field response log across Borno, Adamawa and Yobe
              </p>
            </div>
            <button
              onClick={() => exportCsv(filteredReports)}
              className="rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-900/60 px-3.5 py-1.5 text-xs font-semibold border border-brand-200 dark:border-brand-700/60 transition-colors"
            >
              Download Full CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Partner</th>
                  <th className="py-3.5 px-4 font-semibold">Activity</th>
                  <th className="py-3.5 px-4 font-semibold">State</th>
                  <th className="py-3.5 px-4 font-semibold">LGA</th>
                  <th className="py-3.5 px-4 font-semibold">Period</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Target Group</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Beneficiaries</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                      No reports match the current filters yet.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-750 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white">
                        <div className="font-semibold">{r.orgName}</div>
                        <div className="text-[10px] text-gray-400">{r.orgType}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 dark:text-gray-200 max-w-[200px] truncate" title={r.activityType}>
                        {r.activityType === "Other" ? r.activityOther || "Other" : r.activityType}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 font-medium">{r.state}</td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">{r.lga}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-500">{r.period}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : r.status === "Ongoing"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">{r.populationGroup}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-right text-gray-900 dark:text-white">
                        {Number(r.total).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="rounded px-2 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            className="rounded px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/70 dark:bg-gray-900/50">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                    5W Report Details · {selectedReport.id}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedReport.orgName} — {selectedReport.activityType}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">State & LGA</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedReport.state}, {selectedReport.lga}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Ward & Settlement</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedReport.ward || "—"} / {selectedReport.settlement || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Period & Status</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedReport.period} ({selectedReport.status})
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Quantity / Units</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedReport.quantity} {selectedReport.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Focal Point</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedReport.focalPoint}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Donor / Funding</span>
                    <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                      {selectedReport.donor || "Not specified"}
                    </p>
                  </div>
                </div>

                {selectedReport.indicatorDesc && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                      Indicator & Description
                    </span>
                    <p className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                      {selectedReport.indicatorDesc}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                    Beneficiaries Disaggregation
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="text-[10px] text-gray-400">Men (18+)</div>
                      <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                        {Number(selectedReport.men || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="text-[10px] text-gray-400">Women (18+)</div>
                      <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                        {Number(selectedReport.women || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="text-[10px] text-gray-400">Boys (&lt;18)</div>
                      <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                        {Number(selectedReport.boys || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="text-[10px] text-gray-400">Girls (&lt;18)</div>
                      <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                        {Number(selectedReport.girls || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">Total</div>
                      <div className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                        {Number(selectedReport.total || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2 bg-gray-50/50 dark:bg-gray-900/50">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
