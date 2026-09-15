import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function PowerBiExport() {
  const { reports, exportCsv } = useWashData();

  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const webConnectorUrl = `${window.location.origin}/api/v1/powerbi/5w-live-feed.json`;
  const apiKey = "wash-live-token-bha-unicef-2026-9f8a3c";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webConnectorUrl);
    setCopiedUrl(true);
    showToast("Live Power BI Web Connector URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    showToast("API Authentication Key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleOpenPowerBi = () => {
    window.open("https://app.powerbi.com", "_blank", "noopener,noreferrer");
    showToast("Opening Microsoft Power BI Service in a new window...");
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `WASH_5W_BAY_PowerBI_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Power BI JSON dataset downloaded successfully.");
  };

  // Filtered reports for preview
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchState = selectedState === "All" || r.state === selectedState;
      const matchStatus = selectedStatus === "All" || r.status === selectedStatus;
      return matchState && matchStatus;
    });
  }, [reports, selectedState, selectedStatus]);

  // Aggregate Metrics
  const totalBeneficiaries = useMemo(() => {
    return filteredReports.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  }, [filteredReports]);

  const totalBoys = useMemo(() => filteredReports.reduce((acc, r) => acc + (Number(r.boys) || 0), 0), [filteredReports]);
  const totalGirls = useMemo(() => filteredReports.reduce((acc, r) => acc + (Number(r.girls) || 0), 0), [filteredReports]);
  const totalMen = useMemo(() => filteredReports.reduce((acc, r) => acc + (Number(r.men) || 0), 0), [filteredReports]);
  const totalWomen = useMemo(() => filteredReports.reduce((acc, r) => acc + (Number(r.women) || 0), 0), [filteredReports]);

  const uniquePartners = useMemo(() => {
    return new Set(filteredReports.map((r) => r.orgName)).size;
  }, [filteredReports]);

  const uniqueLgas = useMemo(() => {
    return new Set(filteredReports.map((r) => r.lga)).size;
  }, [filteredReports]);

  // Demographics Donut Chart
  const genderDonutSeries = [totalGirls, totalBoys, totalWomen, totalMen];
  const genderDonutOptions: ApexOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    labels: ["Girls (<18)", "Boys (<18)", "Women (18+)", "Men (18+)"],
    colors: ["#EC4899", "#3B82F6", "#8B5CF6", "#10B981"],
    legend: { position: "bottom", fontSize: "12px" },
    dataLabels: { enabled: true, formatter: (val) => `${Number(val).toFixed(1)}%` },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Beneficiaries",
              formatter: () => totalBeneficiaries.toLocaleString(),
            },
          },
        },
      },
    },
  };

  // Interventions by State Bar Chart
  const stateCounts = useMemo(() => {
    const borno = filteredReports.filter((r) => r.state === "Borno").length;
    const adamawa = filteredReports.filter((r) => r.state === "Adamawa").length;
    const yobe = filteredReports.filter((r) => r.state === "Yobe").length;
    return [borno, adamawa, yobe];
  }, [filteredReports]);

  const stateBarOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%", distributed: true } },
    colors: ["#C1722F", "#12707E", "#2E7D47"],
    xaxis: { categories: ["Borno", "Adamawa", "Yobe"] },
    dataLabels: { enabled: true },
    legend: { show: false },
    yaxis: { title: { text: "Activity Submissions" } },
  };

  return (
    <>
      <PageMeta
        title="Microsoft Power BI Connector & Export | WASH Sector Admin"
        description="Directly connect or export live North East Nigeria 5W humanitarian response data into Microsoft Power BI Desktop & Service."
      />

      <div className="w-full space-y-6 max-w-[1440px] mx-auto pb-16 font-sans">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-6 right-6 z-99999 rounded-xl bg-gray-900 text-white px-5 py-4 shadow-2xl flex items-center gap-3 border border-amber-500 animate-in fade-in slide-in-from-top duration-300">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-gray-950 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-amber-400">Power BI Connector</div>
              <div className="text-xs text-gray-200 mt-0.5">{toast}</div>
            </div>
          </div>
        )}



        {/* Live Connector & Integration Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Web Connector URL */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Live Web Connector</h3>
                  <p className="text-[11px] text-gray-500">Power BI Desktop Get Data → Web</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Endpoint URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webConnectorUrl}
                  className="w-full text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold shrink-0 hover:bg-gray-800 transition-all cursor-pointer"
                >
                  {copiedUrl ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Provides auto-refreshing REST payload with full column schemas and validated P-Codes for Borno, Adamawa, and Yobe states.
            </p>
          </div>

          {/* Card 2: Authentication Credentials */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">API Authentication</h3>
                  <p className="text-[11px] text-gray-500">Bearer Token / Basic Auth</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                AUTHORIZED
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Connector Token</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="w-full text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold shrink-0 hover:bg-gray-800 transition-all cursor-pointer"
                >
                  {copiedKey ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Use as HTTP Header <code className="text-[11px] bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">Authorization: Bearer</code> in Power BI Advanced Data Source settings.
            </p>
          </div>

          {/* Card 3: Refresh Frequency & Status */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Scheduled Sync</h3>
                  <p className="text-[11px] text-gray-500">Power BI Gateway Sync</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                HOURLY
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span>Active 5W Records:</span>
                <strong className="font-mono font-bold text-gray-900 dark:text-white">{reports.length} entries</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span>Last Gateway Sync:</span>
                <span className="font-mono text-gray-700 dark:text-gray-400">Just now</span>
              </div>
              <div className="flex justify-between py-1">
                <span>DirectQuery Mode:</span>
                <span className="text-emerald-600 font-bold">Supported</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Connection Guide Banner */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-6">
          <h3 className="text-sm font-bold text-amber-950 dark:text-amber-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.5 2h-3c-.28 0-.5.22-.5.5v19c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5v-19c0-.28-.22-.5-.5-.5zm-6 7h-3c-.28 0-.5.22-.5.5v12c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5zm12-4h-3c-.28 0-.5.22-.5.5v16c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5v-16c0-.28-.22-.5-.5-.5z" />
            </svg>
            <span>How to Connect this 5W Data in Microsoft Power BI Desktop (4 Easy Steps):</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 space-y-1">
              <div className="font-mono font-bold text-amber-700 dark:text-amber-400">STEP 1</div>
              <div className="font-bold text-gray-900 dark:text-white">Get Data in Power BI</div>
              <p className="text-gray-500">In Power BI Desktop ribbon, click <strong>Get Data</strong> → select <strong>Web</strong> (or <strong>Text/CSV</strong>).</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 space-y-1">
              <div className="font-mono font-bold text-amber-700 dark:text-amber-400">STEP 2</div>
              <div className="font-bold text-gray-900 dark:text-white">Paste Live URL</div>
              <p className="text-gray-500">Paste the <strong>Live Web Connector URL</strong> above or select the exported master CSV file.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 space-y-1">
              <div className="font-mono font-bold text-amber-700 dark:text-amber-400">STEP 3</div>
              <div className="font-bold text-gray-900 dark:text-white">Transform &amp; Type</div>
              <p className="text-gray-500">Power Query automatically detects State, LGA P-Codes, and numeric beneficiary reach.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 space-y-1">
              <div className="font-mono font-bold text-amber-700 dark:text-amber-400">STEP 4</div>
              <div className="font-bold text-gray-900 dark:text-white">Publish to Power BI Service</div>
              <p className="text-gray-500">Click <strong>Publish</strong> to deploy the interactive dashboard to your agency workspace.</p>
            </div>
          </div>
        </div>

        {/* Interactive Power BI Report Canvas Preview */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md overflow-hidden">
          {/* Canvas Header Toolbar */}
          <div className="bg-gray-100 dark:bg-gray-800/80 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Interactive Power BI Dashboard Visualizer (BAY States 5W Model)
                </h3>
                <p className="text-[11px] text-gray-500">Live preview of visuals rendered by Power BI DAX expressions</p>
              </div>
            </div>

            {/* Slicers Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>State Slicer:</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="All">All BAY States</option>
                  <option value="Borno">Borno</option>
                  <option value="Adamawa">Adamawa</option>
                  <option value="Yobe">Yobe</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenPowerBi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Full Power BI Canvas</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Canvas KPI Cards */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Beneficiaries Reached</div>
                <div className="text-2xl font-extrabold text-teal-800 dark:text-teal-300 font-serif mt-1">
                  {totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-[10px] text-teal-600 font-bold mt-1">DAX: SUM(Beneficiaries[Total])</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Reporting Partners</div>
                <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 font-serif mt-1">
                  {uniquePartners}
                </div>
                <div className="text-[10px] text-blue-600 font-bold mt-1">DAX: DISTINCTCOUNT(Org[Name])</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Operational LGAs Covered</div>
                <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 font-serif mt-1">
                  {uniqueLgas}
                </div>
                <div className="text-[10px] text-amber-600 font-bold mt-1">DAX: DISTINCTCOUNT(Location[LGA])</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Activities in Scope</div>
                <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 font-serif mt-1">
                  {filteredReports.length}
                </div>
                <div className="text-[10px] text-purple-600 font-bold mt-1">DAX: COUNTROWS(5W_Activities)</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
                  Beneficiary Gender &amp; Age Disaggregation (Donut Visual)
                </h4>
                <Chart options={genderDonutOptions} series={genderDonutSeries} type="donut" height={280} />
              </div>

              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
                  Intervention Volume by BAY State (Bar Visual)
                </h4>
                <Chart options={stateBarOptions} series={[{ name: "Activities", data: stateCounts }]} type="bar" height={280} />
              </div>
            </div>

            {/* Power BI Data Model Schema Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Pre-Configured Data Model Schema (Ready for Power BI Relationships)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
                  <thead className="bg-gray-50 dark:bg-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 uppercase border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3">Table Name</th>
                      <th className="px-4 py-3">Key Column</th>
                      <th className="px-4 py-3">Attributes &amp; Measures</th>
                      <th className="px-4 py-3">Relationship Cardinality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    <tr>
                      <td className="px-4 py-2.5 font-bold font-mono text-amber-700 dark:text-amber-400">Fact_5W_Activities</td>
                      <td className="px-4 py-2.5 font-mono">Activity_ID</td>
                      <td className="px-4 py-2.5">Quantity, Total_Reached, Boys, Girls, Men, Women, Status, Period</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">Central Fact Table</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold font-mono text-teal-700 dark:text-teal-400">Dim_Geography</td>
                      <td className="px-4 py-2.5 font-mono">LGA_PCode</td>
                      <td className="px-4 py-2.5">State_Name, State_PCode, LGA_Name, Ward, Latitude, Longitude</td>
                      <td className="px-4 py-2.5 text-xs text-emerald-600 font-semibold">1-to-Many with Fact</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold font-mono text-blue-700 dark:text-blue-400">Dim_Partners</td>
                      <td className="px-4 py-2.5 font-mono">Org_Acronym</td>
                      <td className="px-4 py-2.5">Org_Name, Org_Type (INGO/NNGO/UN), Donor, Focal_Point, Email</td>
                      <td className="px-4 py-2.5 text-xs text-emerald-600 font-semibold">1-to-Many with Fact</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-bold font-mono text-purple-700 dark:text-purple-400">Dim_Sector_Indicators</td>
                      <td className="px-4 py-2.5 font-mono">Indicator_Code</td>
                      <td className="px-4 py-2.5">Domain (Water/Sanitation/Hygiene), Indicator_Desc, Unit, HRP_Pillar</td>
                      <td className="px-4 py-2.5 text-xs text-emerald-600 font-semibold">1-to-Many with Fact</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with return links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Admin Governance Console</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenPowerBi}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Launch Microsoft Power BI Now</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
