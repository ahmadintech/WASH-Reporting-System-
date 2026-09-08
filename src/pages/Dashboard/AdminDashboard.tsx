import React, { useState } from "react";
import { Link } from "react-router";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { WashReport } from "../../types/wash";
import CountryMap from "../../components/ecommerce/CountryMap";

export default function AdminDashboard() {
  const { reports, deleteReport, exportCsv, resetToSampleData, stats } = useWashData();
  const { currentUser } = useAuth();

  // Local approval tracking state
  const [approvedIds, setApprovedIds] = useState<Set<string>>(() => {
    return new Set(reports.slice(0, 7).map((r) => r.id));
  });
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved" | "flagged">("all");
  const [isDataFreezeActive, setIsDataFreezeActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [selectedReport, setSelectedReport] = useState<WashReport | null>(null);
  const [trendTimeframe, setTrendTimeframe] = useState<"6M" | "1Y">("6M");

  const showToastMessage = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToastMessage(`Report record #${id.slice(-4)} has been verified & approved.`);
  };

  const handleFlag = (id: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToastMessage(`Report record #${id.slice(-4)} flagged for partner data audit.`);
  };

  const handleDelete = (r: WashReport) => {
    if (confirm(`Are you sure you want to remove the 5W submission by ${r.orgName} in ${r.lga}?`)) {
      deleteReport(r.id);
      showToastMessage(`Submission for ${r.orgName} deleted.`);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBroadcastModal(false);
    showToastMessage(`Circular broadcast dispatched to all 48 accredited partner focal points.`);
    setBroadcastSubject("");
    setBroadcastBody("");
  };

  const filteredQueue = reports.filter((r) => {
    const isApproved = approvedIds.has(r.id);
    const isFlagged = flaggedIds.has(r.id);
    if (filterTab === "approved") return isApproved;
    if (filterTab === "flagged") return isFlagged;
    if (filterTab === "pending") return !isApproved && !isFlagged;
    return true;
  });

  const pendingCount = reports.filter((r) => !approvedIds.has(r.id) && !flaggedIds.has(r.id)).length;
  const approvedCount = reports.filter((r) => approvedIds.has(r.id)).length;
  const flaggedCount = reports.filter((r) => flaggedIds.has(r.id)).length;

  // --- CHART CONFIGURATIONS ---

  // 1. Monthly Interventions Trend (Area Chart)
  const trendCategories =
    trendTimeframe === "6M"
      ? ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026"]
      : ["Sep '25", "Nov '25", "Jan '26", "Mar '26", "May '26", "Aug '26"];

  const trendSeries = [
    {
      name: "Water Supply (Boreholes/Trucking)",
      data: trendTimeframe === "6M" ? [18200, 22400, 26100, 31200, 38500, 49550] : [12000, 15000, 19000, 25000, 34000, 49550],
    },
    {
      name: "Sanitation (Latrines/Desludging)",
      data: trendTimeframe === "6M" ? [11400, 14200, 17800, 21500, 27300, 34200] : [8000, 10500, 13000, 18000, 24000, 34200],
    },
    {
      name: "Hygiene Promotion & NFI Kits",
      data: trendTimeframe === "6M" ? [14500, 19200, 24100, 29800, 36400, 44800] : [9500, 13200, 17500, 23000, 31000, 44800],
    },
  ];

  const trendOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#12707E", "#C1722F", "#10B981"],
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.35, opacityTo: 0.05 },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    xaxis: {
      categories: trendCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${(val / 1000).toFixed(0)}k`,
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      y: { formatter: (val) => `${val.toLocaleString()} beneficiaries` },
    },
  };

  // 2. HNRP Target vs Actual Reach (Column Bar Chart)
  const targetVsActualSeries = [
    {
      name: "Cluster Target (HNRP)",
      data: [75000, 50000, 45000, 35000, 25000],
    },
    {
      name: "Verified Reached",
      data: [49550, 34200, 44800, 29100, 18400],
    },
  ];

  const targetVsActualOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 290,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#E2E8F0", "#12707E"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: ["Water Supply", "Emergency Latrines", "Hygiene Kits", "Water Trucking", "Desludging & Waste"],
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${(val / 1000).toFixed(0)}k`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    tooltip: {
      y: { formatter: (val) => `${val.toLocaleString()} people` },
    },
  };

  // 3. Partner Compliance Donut Chart
  const complianceSeries = [78, 14, 8];
  const complianceOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#10B981", "#3B82F6", "#F43F5E"],
    labels: ["Approved On-Time", "Under QA Audit", "Pending / Overdue"],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Compliance",
              formatter: () => "91.8%",
              fontSize: "15px",
              fontWeight: 700,
              color: "#1E293B",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "11px",
      fontFamily: "Outfit",
    },
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

      {/* Top Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Sector Operations Command Desk
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Humanitarian response intelligence, partner accreditation & 5W audit governance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportCsv()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Master 5W CSV</span>
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span>Broadcast Circular</span>
          </button>

          <button
            onClick={() => {
              setIsDataFreezeActive(!isDataFreezeActive);
              showToastMessage(
                isDataFreezeActive
                  ? "Data freeze lifted. Partners can submit addendums."
                  : "Data freeze active. Submissions locked for final cluster reporting."
              );
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border cursor-pointer ${
              isDataFreezeActive
                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDataFreezeActive ? "bg-amber-500" : "bg-emerald-500"}`}></span>
            <span>{isDataFreezeActive ? "Cycle Locked" : "Submissions Open"}</span>
          </button>
        </div>
      </div>

      {/* Admin Strategic Metrics (TailAdmin Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>14.2%</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
              {stats.totalBeneficiaries.toLocaleString()}
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Verified Beneficiaries
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: "78%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Audited & verified from July cycle
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
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
              {stats.totalReports} <span className="text-sm font-medium text-gray-400">Records</span>
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              5W Submissions Queue
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "68%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">{approvedCount}</span> approved ·{" "}
            <span className="font-bold text-rose-600">{flaggedCount}</span> flagged ·{" "}
            <span className="font-bold text-brand-600">{pendingCount}</span> pending
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>4.35%</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
              91.8%
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Partner Compliance Rate
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: "91.8%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            24 INGOs · 18 NNGOs · 6 UN Agencies
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>0.43%</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
              99.4%
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Data Integrity Score
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "99.4%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            0 duplicate GPS points · 100% Ward mapped
          </p>
        </div>
      </div>



      {/* --- ANALYTICS & OPERATIONAL SIDEBAR GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Analytics Area (Left 8 Cols) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Monthly Interventions Response Trend Chart */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Monthly 5W Interventions & Response Trend
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Beneficiaries reached month-over-month across Water Supply, Sanitation, and Hygiene
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shrink-0">
                <button
                  onClick={() => setTrendTimeframe("6M")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    trendTimeframe === "6M"
                      ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Last 6 Months
                </button>
                <button
                  onClick={() => setTrendTimeframe("1Y")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    trendTimeframe === "1Y"
                      ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  1 Year View
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <Chart options={trendOptions} series={trendSeries} type="area" height={290} />
            </div>
          </div>

          {/* Dual Visuals: HNRP Target vs Actual + Partner Compliance Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Target vs Actual (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    HNRP Target vs Verified Reach
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cluster target benchmarks across 5 key humanitarian pillars
                  </p>
                </div>
              </div>
              <Chart options={targetVsActualOptions} series={targetVsActualSeries} type="bar" height={260} />
            </div>

            {/* Compliance Donut (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Partner Reporting Status
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  August 2026 cycle verification breakdown
                </p>
                <div className="flex items-center justify-center py-2">
                  <Chart options={complianceOptions} series={complianceSeries} type="donut" height={230} />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Timely Submissions:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">38 of 48 Partners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Admin Sidebar Widget (Right 4 Cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Real-time Sector Audit & Activity Feed */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Live Operational Audit Feed
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                Real-Time
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  actor: "Engr. Ahmed Lawan",
                  role: "Sector Administrator",
                  action: "Verified & approved 4 5W entries in Maiduguri",
                  time: "10m ago",
                  icon: "✓",
                  color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                },
                {
                  actor: "Solidarités International",
                  role: "Implementing Partner",
                  action: "Uploaded borehole rehabilitation report (8,620 reach)",
                  time: "35m ago",
                  icon: "↑",
                  color: "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400",
                },
                {
                  actor: "OCHA 5W Data Sync",
                  role: "Automated Gateway",
                  action: "Harmonized 9 cleaned indicators with HDX repository",
                  time: "2h ago",
                  icon: "⟳",
                  color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
                },
                {
                  actor: "Cluster Early Warning",
                  role: "Automated Alert",
                  action: "Cholera surge flag raised in Gwoza transit camp",
                  time: "4h ago",
                  icon: "⚠️",
                  color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
                },
                {
                  actor: "UNICEF Nigeria",
                  role: "UN Agency Lead",
                  action: "Dispatched 1,200 hygiene/NFI kits in Jere",
                  time: "6h ago",
                  icon: "📦",
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white truncate">{item.actor}</span>
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Early Warning & Cholera Surge Alert Widget */}
          <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-5 dark:border-rose-900/60 dark:from-rose-950/30 dark:to-orange-950/20 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-950 dark:text-rose-200">
                  Cholera & AWD Surge Warning
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                Active Alert
              </span>
            </div>
            <p className="text-xs text-rose-900/90 dark:text-rose-300">
              Cases detected above alert threshold in 2 critical LGAs:
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-rose-200/60 text-xs">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">Maiduguri (MMC)</span>
                  <span className="block text-[10px] text-rose-600 font-semibold">8 Confirmed AWD Cases</span>
                </div>
                <button
                  onClick={() => showToastMessage("Rapid Response Mechanism alert triggered for MMC.")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                >
                  Deploy RRM
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-rose-200/60 text-xs">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">Gwoza LGA</span>
                  <span className="block text-[10px] text-rose-600 font-semibold">6 Suspected Cases (Transit Camp)</span>
                </div>
                <button
                  onClick={() => showToastMessage("Rapid Response alert triggered for Gwoza.")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                >
                  Deploy RRM
                </button>
              </div>
            </div>
          </div>

          {/* Quick Admin Navigation & Tools */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Administrative Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/admin/users"
                className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/30 transition-all text-left"
              >
                <span className="block text-xs font-bold text-gray-900 dark:text-white">User Accounts</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">Manage 4 Roles</span>
              </Link>

              <Link
                to="/admin/settings"
                className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/30 transition-all text-left"
              >
                <span className="block text-xs font-bold text-gray-900 dark:text-white">Settings</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">Cycles & Units</span>
              </Link>

              <Link
                to="/reports-list"
                className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/30 transition-all text-left"
              >
                <span className="block text-xs font-bold text-gray-900 dark:text-white">Reports Master</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">Master Database</span>
              </Link>

              <Link
                to="/coverage-dashboard"
                className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850 hover:bg-brand-50 hover:border-brand-200 dark:hover:bg-brand-950/30 transition-all text-left"
              >
                <span className="block text-xs font-bold text-gray-900 dark:text-white">Gap Matrix</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">65 LGA Hotspots</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- GEOGRAPHIC COVERAGE & MAP TIER --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Vector Map & State Matrix (8 cols) */}
        <div className="xl:col-span-8 rounded-3xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                BAY States Geographic Coverage & Vector Density
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Spatial footprint of active humanitarian interventions across Borno, Adamawa, and Yobe
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full shrink-0">
              65 Operational LGAs Mapped
            </span>
          </div>

          {/* Interactive Vector Map Container */}
          <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 my-3">
            <div className="h-[210px] w-full flex items-center justify-center">
              <CountryMap />
            </div>
          </div>

          {/* State-by-State Operational Matrix Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900 dark:text-white">Borno State</span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                  High Need
                </span>
              </div>
              <div className="mt-2 text-xl font-black text-gray-900 dark:text-white font-mono">
                28,450 <span className="text-[11px] font-normal text-gray-400">Reached</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">27 LGAs · 18 Active Partners</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900 dark:text-white">Adamawa State</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  Medium
                </span>
              </div>
              <div className="mt-2 text-xl font-black text-gray-900 dark:text-white font-mono">
                12,850 <span className="text-[11px] font-normal text-gray-400">Reached</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">21 LGAs · 14 Active Partners</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900 dark:text-white">Yobe State</span>
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-1.5 py-0.5 rounded">
                  Medium
                </span>
              </div>
              <div className="mt-2 text-xl font-black text-gray-900 dark:text-white font-mono">
                8,250 <span className="text-[11px] font-normal text-gray-400">Reached</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">17 LGAs · 11 Active Partners</p>
            </div>
          </div>
        </div>

        {/* Target Demographics Breakdown (4 cols) */}
        <div className="xl:col-span-4 rounded-3xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Target Population Reach
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Displaced vs Host Community Assistance Ratio
            </p>

            <div className="space-y-4">
              {[
                { label: "IDPs in Formal / Informal Camps", pct: 48, count: "23,784", color: "bg-brand-500" },
                { label: "Vulnerable Host Communities", pct: 32, count: "15,856", color: "bg-amber-500" },
                { label: "Returnees & Resettled Persons", pct: 15, count: "7,432", color: "bg-emerald-500" },
                { label: "Refugees & Cross-Border Groups", pct: 5, count: "2,478", color: "bg-purple-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900 dark:text-white">PWD Inclusion Ratio:</span>
              <span className="block text-[11px] text-gray-400">Persons with disabilities</span>
            </div>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              7.2% (3,567 reached)
            </span>
          </div>
        </div>
      </div>

      {/* --- 5W VERIFICATION & APPROVAL QUEUE TABLE --- */}
      <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                5W Submissions Quality & Approval Desk
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Review, verify, and approve partner reports before inclusion in official OCHA 5W master dataset.
            </p>
          </div>

          {/* Queue Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(["all", "pending", "approved", "flagged"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterTab === tab
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {tab === "all"
                    ? reports.length
                    : tab === "pending"
                    ? pendingCount
                    : tab === "approved"
                    ? approvedCount
                    : flaggedCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Verification Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Partner / Focal Point</th>
                <th className="py-3.5 px-4 font-semibold">Activity & Indicator</th>
                <th className="py-3.5 px-4 font-semibold">Location (LGA · Ward)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Beneficiaries</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Verification</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    No records found matching "{filterTab}" filter.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((r) => {
                  const isApproved = approvedIds.has(r.id);
                  const isFlagged = flaggedIds.has(r.id);

                  return (
                    <tr key={r.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">{r.orgName}</div>
                        <div className="text-[10px] text-gray-400">{r.focalPoint} · {r.email}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                          {r.activityType}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {r.quantity} {r.unit}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {r.state} · {r.lga}
                        </div>
                        <div className="text-[10px] text-gray-400">{r.settlement || r.ward || "General"}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-right text-gray-900 dark:text-white">
                        {Number(r.total).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
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
                      <td className="py-3.5 px-4 text-center">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approved
                          </span>
                        ) : isFlagged ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                            Pending Audit
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            title="Inspect Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {!isApproved && (
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                              title="Verify and Approve"
                            >
                              Approve
                            </button>
                          )}

                          {!isFlagged && (
                            <button
                              onClick={() => handleFlag(r.id)}
                              className="px-2 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
                              title="Flag for Correction"
                            >
                              Flag
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(r)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete Submission"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Broadcast Circular to All Partners
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Dispatch an official sector notification to all 48 focal points in Borno, Adamawa, and Yobe.
            </p>
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Circular Subject
                </label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. August Reporting Deadline Extension & Cholera Guidance"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Circular Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Dear Partners, please be advised that..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer"
                >
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Record Audit: {selectedReport.id}
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedReport.orgName} — {selectedReport.activityType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400">Location</span>
                <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                  {selectedReport.state} · {selectedReport.lga}
                </p>
                <p className="text-gray-500 text-[11px]">{selectedReport.settlement || selectedReport.ward}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400">Total Beneficiaries</span>
                <p className="font-black text-rose-600 text-lg font-mono mt-0.5">
                  {Number(selectedReport.total).toLocaleString()}
                </p>
                <p className="text-gray-500 text-[11px]">
                  {selectedReport.women} Women · {selectedReport.girls} Girls · {selectedReport.men} Men · {selectedReport.boys} Boys
                </p>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400">Description & Indicator</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedReport.indicatorDesc || "Standard 5W response."}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
