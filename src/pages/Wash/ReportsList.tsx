import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { WashReport } from "../../types/wash";

export default function ReportsList() {
  const { reports, deleteReport, exportCsv } = useWashData();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<WashReport | null>(null);

  // Filter based on role:
  // If Partner, offer quick toggle between "My Organisation" and "All Public Reports"
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(currentUser.role === "partner");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (showOnlyMine && !r.orgName.toLowerCase().includes(currentUser.organization.toLowerCase())) {
        return false;
      }
      if (statusFilter && r.status !== statusFilter) return false;
      if (stateFilter && r.state !== stateFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match =
          r.orgName.toLowerCase().includes(q) ||
          r.activityType.toLowerCase().includes(q) ||
          r.lga.toLowerCase().includes(q) ||
          (r.settlement && r.settlement.toLowerCase().includes(q)) ||
          r.focalPoint.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [reports, showOnlyMine, currentUser.organization, statusFilter, stateFilter, searchTerm]);

  const handleDelete = (r: WashReport) => {
    if (confirm(`Delete 5W record for ${r.orgName} in ${r.lga}?`)) {
      deleteReport(r.id);
    }
  };

  return (
    <>
      <PageMeta
        title="5W Submissions Manager | WASH Sector North East Nigeria"
        description="Comprehensive 5W submissions directory and database for Borno, Adamawa, and Yobe"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <span>Database Records</span>
              <span>·</span>
              <span className="text-clay-600 dark:text-clay-400">{currentUser.roleTitle}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              All 5W Activity Submissions
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/submit-report"
              className="inline-flex items-center gap-1.5 rounded-lg bg-clay-500 hover:bg-clay-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all"
            >
              <span>+ New 5W Report</span>
            </Link>
            <button
              onClick={() => exportCsv(filtered)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search partner, activity, LGA, focal point..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">All States</option>
                <option value="Borno">Borno</option>
                <option value="Adamawa">Adamawa</option>
                <option value="Yobe">Yobe</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Planned">Planned</option>
              </select>
            </div>

            {currentUser.role === "partner" && (
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Only My Organisation's Reports</span>
              </label>
            )}
          </div>
        </div>

        {/* Table of submissions */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Organisation</th>
                  <th className="py-3.5 px-4 font-semibold">Activity & Indicator</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Period</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Total Reached</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                      No 5W records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-750 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">{r.orgName}</div>
                        <div className="text-[10px] text-gray-400">{r.focalPoint}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                          {r.activityType === "Other" ? r.activityOther || "Other" : r.activityType}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {r.quantity} {r.unit} · {r.indicatorDesc || "Standard 5W response"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {r.state} · {r.lga}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {r.settlement || r.ward || r.locationType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400">{r.period}</td>
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
                      <td className="py-3.5 px-4 font-mono font-bold text-right text-gray-900 dark:text-white">
                        {Number(r.total).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="rounded px-2 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
                          >
                            View
                          </button>
                          {(currentUser.role === "admin" ||
                            currentUser.role === "coordinator" ||
                            r.orgName.toLowerCase().includes(currentUser.organization.toLowerCase())) && (
                            <button
                              onClick={() => handleDelete(r)}
                              className="rounded px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                            >
                              Delete
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
        </div>

        {/* Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/70 dark:bg-gray-900/50">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                    Record {selectedReport.id}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
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

              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                  <div>
                    <span className="text-gray-400 text-[11px] uppercase">State & LGA</span>
                    <p className="font-bold text-gray-800 dark:text-white">{selectedReport.state}, {selectedReport.lga}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] uppercase">Location Type</span>
                    <p className="font-bold text-gray-800 dark:text-white">{selectedReport.locationType}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] uppercase">Quantity</span>
                    <p className="font-bold text-gray-800 dark:text-white">{selectedReport.quantity} {selectedReport.unit}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] uppercase">Focal Point</span>
                    <p className="font-bold text-gray-800 dark:text-white">{selectedReport.focalPoint} ({selectedReport.email})</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] uppercase">Population Group</span>
                    <p className="font-bold text-gray-800 dark:text-white">{selectedReport.populationGroup}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] uppercase">Total Beneficiaries</span>
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{Number(selectedReport.total).toLocaleString()}</p>
                  </div>
                </div>

                {selectedReport.indicatorDesc && (
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                      Indicator Description
                    </span>
                    <p className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300 text-xs">
                      {selectedReport.indicatorDesc}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end bg-gray-50/50 dark:bg-gray-900/50">
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
