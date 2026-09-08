import React, { useState } from "react";
import { Link } from "react-router";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { WashReport } from "../../types/wash";

export default function PartnerDashboard() {
  const { reports, deleteReport, exportCsv } = useWashData();
  const { currentUser } = useAuth();

  const [selectedReport, setSelectedReport] = useState<WashReport | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Filter reports strictly for this partner's community (organization, LGA, and State)
  const myReports = reports.filter((r) => {
    const matchesOrg = r.orgName.toLowerCase().includes(currentUser.organization.toLowerCase());
    const matchesState = !currentUser.state || r.state === currentUser.state;
    const matchesLga = !currentUser.lga || r.lga.toLowerCase() === currentUser.lga.toLowerCase();
    return matchesOrg && matchesState && matchesLga;
  });

  const myBeneficiaries = myReports.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
  const myWomen = myReports.reduce((sum, r) => sum + (Number(r.women) || 0), 0);
  const myMen = myReports.reduce((sum, r) => sum + (Number(r.men) || 0), 0);
  const myGirls = myReports.reduce((sum, r) => sum + (Number(r.girls) || 0), 0);
  const myBoys = myReports.reduce((sum, r) => sum + (Number(r.boys) || 0), 0);
  const myPwd = myReports.reduce((sum, r) => sum + (Number(r.pwd) || 0), 0);

  const myLgas = Array.from(new Set(myReports.map((r) => r.lga)));

  const handleDownloadTemplate = () => {
    // Generate sample 5W Excel/CSV template download
    const templateHeaders = [
      "Partner Name",
      "Organization Type",
      "Focal Point",
      "Email",
      "Donor",
      "Activity Category",
      "Activity Type",
      "Quantity",
      "Unit",
      "State",
      "LGA",
      "Ward",
      "Settlement / Camp Name",
      "Location Type",
      "Period (YYYY-MM)",
      "Status",
      "Men",
      "Women",
      "Boys",
      "Girls",
      "PWD",
      "Total Beneficiaries",
    ].join(",");

    const sampleRow = [
      `"${currentUser.organization}"`,
      `"${currentUser.organizationType}"`,
      `"${currentUser.name}"`,
      `"${currentUser.email}"`,
      '"BHA / USAID"',
      '"Water Supply"',
      '"Borehole rehabilitation"',
      "4",
      '"Boreholes"',
      `"${currentUser.state || "Borno"}"`,
      `"${currentUser.lga || "Maiduguri"}"`,
      '"Bolori II"',
      '"Bakassi IDP Camp"',
      '"IDP camp / camp-like setting"',
      '"2026-08"',
      '"Completed"',
      "2150",
      "2480",
      "1890",
      "2100",
      "120",
      "8620",
    ].join(",");

    const blob = new Blob([`${templateHeaders}\n${sampleRow}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `WASH_5W_Blank_Template_2026_${currentUser.organization.replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Official 5W Reporting Template downloaded successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-99999 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Community Field Operations Desk</span>
            <span>·</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {currentUser.lga || "Maiduguri"}, {currentUser.state || "Borno"} State
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Deadline Notice Card & Top Actions */}
      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              August 2026 Reporting Window Active
            </span>
            <p className="text-xs text-emerald-950 dark:text-emerald-200 mt-0.5">
              Monthly 5W submission window closes in <strong>4 days</strong>. All field activities completed in August must be submitted before the deadline for OCHA synchronization.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 shadow-xs hover:bg-emerald-50 dark:hover:bg-gray-700/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download 5W Template</span>
          </button>

          <Link
            to="/submit-report"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Submit New 5W Activity</span>
          </Link>
        </div>
      </div>

      {/* Organization Specific Community KPIs (TailAdmin Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>11.01%</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {myBeneficiaries.toLocaleString()}
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Community Beneficiaries
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "84%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Directly reached in {currentUser.lga || "Maiduguri"} projects
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>9.05%</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
              {myReports.length} <span className="text-sm font-medium text-gray-400">Records</span>
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Community Submissions
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: "100%" }}></div>
          </div>
          <p className="mt-2 text-xs text-emerald-600 font-bold">
            ✓ 100% Verified for {currentUser.lga || "Maiduguri"}
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-purple-500 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
              <span>Primary</span>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono truncate">
              {currentUser.lga || "Maiduguri"}
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Operational Community
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: "75%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {currentUser.state || "Borno"} State · IDP & Host settlements
          </p>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>Verified</span>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              Active
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Accreditation Status
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Verified Implementing Partner · NE Hub
          </p>
        </div>
      </div>

      {/* My Organization's Active Submissions */}
      <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Our Community 5W Activity Records
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Field activities reported by {currentUser.organization} in {currentUser.lga || "Maiduguri"}, {currentUser.state || "Borno"}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCsv(myReports)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Export My 5W Submissions
            </button>
            <Link
              to="/submit-report"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs"
            >
              + Add Record
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Activity & Indicator</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Donor</th>
                <th className="py-3.5 px-4 font-semibold">Period</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Beneficiaries</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {myReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    No 5W records filed for this period yet.
                  </td>
                </tr>
              ) : (
                myReports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 dark:text-white">{r.activityType}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
                        {r.quantity} {r.unit} · {r.indicatorDesc || "Emergency WASH response"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {r.state} · {r.lga}
                      </div>
                      <div className="text-[10px] text-gray-400">{r.settlement || r.ward}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-400">
                      {r.donor || "Unspecified"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400">
                      {r.period}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
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
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this submission record?")) {
                              deleteReport(r.id);
                              showToast("Record removed.");
                            }
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* Disaggregated Demographics & Guidelines Split Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Demographics Breakdown (6 cols) */}
        <div className="xl:col-span-6 rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            Our Beneficiary Disaggregation Profile
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Gender and age breakdown across our active projects
          </p>

          <div className="space-y-3">
            {[
              { label: "Women (18+)", val: myWomen, total: myBeneficiaries, color: "bg-rose-500" },
              { label: "Men (18+)", val: myMen, total: myBeneficiaries, color: "bg-blue-500" },
              { label: "Girls (<18)", val: myGirls, total: myBeneficiaries, color: "bg-amber-500" },
              { label: "Boys (<18)", val: myBoys, total: myBeneficiaries, color: "bg-emerald-500" },
              { label: "People with Disabilities (PWD)", val: myPwd, total: myBeneficiaries, color: "bg-purple-500" },
            ].map((d, idx) => {
              const pct = myBeneficiaries > 0 ? ((d.val / myBeneficiaries) * 100).toFixed(1) : "0.0";
              return (
                <div key={idx} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{d.label}</span>
                    <span className="font-mono font-bold">{d.val.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                    <div className={`${d.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner Guidelines & Support Desk (6 cols) */}
        <div className="xl:col-span-6 rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Partner Guidelines & Resources
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Standard operating procedures for emergency WASH in North East Nigeria
            </p>

            <div className="space-y-3">
              {[
                { title: "5W Activity Reporting Handbook 2026", desc: "Detailed indicators, definitions, and verification criteria", tag: "PDF" },
                { title: "Sphere Standards: Emergency Water & Sanitation", desc: "Minimum 15L/person/day and 1:20 latrine stance ratios", tag: "Guide" },
                { title: "Water Quality Testing & Chlorination SOPs", desc: "Free residual chlorine standards in cholera alert zones", tag: "Protocol" },
              ].map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => showToast(`Opening ${res.title}...`)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 hover:bg-gray-100/70 dark:hover:bg-gray-800 cursor-pointer transition-all"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{res.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{res.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {res.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Helpdesk Contact */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need help with indicators?</span>
            <button
              onClick={() => showToast("Contacting WASH Coordination Desk focal point...")}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Contact Sector Coordination Desk →
            </button>
          </div>
        </div>
      </div>

      {/* Submission Receipt Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Official 5W Submission Receipt
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Record #{selectedReport.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 dark:bg-gray-800 p-3.5 rounded-xl">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Activity Details</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.activityType}</p>
                <p className="text-gray-500 mt-0.5">{selectedReport.indicatorDesc || "Standard response"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReport.state} · {selectedReport.lga}</p>
                  <p className="text-gray-500 text-[11px]">{selectedReport.settlement || "General"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Beneficiaries Reached</span>
                  <p className="font-black text-emerald-600 text-lg font-mono mt-0.5">
                    {Number(selectedReport.total).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
