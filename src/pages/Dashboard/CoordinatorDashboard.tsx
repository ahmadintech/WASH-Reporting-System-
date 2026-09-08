import React, { useState } from "react";
import { Link } from "react-router";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";

interface LgaGap {
  lga: string;
  state: "Borno" | "Adamawa" | "Yobe";
  severity: "Critical (Severity 4)" | "Severe (Severity 3)" | "Moderate (Severity 2)";
  pin: number;
  reached: number;
  gap: number;
  coveragePct: number;
  partners: string[];
}

const SAMPLE_LGA_GAPS: LgaGap[] = [
  {
    lga: "Bama",
    state: "Borno",
    severity: "Critical (Severity 4)",
    pin: 285000,
    reached: 78000,
    gap: 207000,
    coveragePct: 27.4,
    partners: ["IOM", "Solidarités", "FHI 360"],
  },
  {
    lga: "Gwoza",
    state: "Borno",
    severity: "Critical (Severity 4)",
    pin: 210000,
    reached: 62000,
    gap: 148000,
    coveragePct: 29.5,
    partners: ["NRC", "ACF", "UNICEF"],
  },
  {
    lga: "Monguno",
    state: "Borno",
    severity: "Critical (Severity 4)",
    pin: 195000,
    reached: 85000,
    gap: 110000,
    coveragePct: 43.6,
    partners: ["ACF", "IRC", "Solidarités"],
  },
  {
    lga: "Kala/Balge",
    state: "Borno",
    severity: "Critical (Severity 4)",
    pin: 85000,
    reached: 14000,
    gap: 71000,
    coveragePct: 16.5,
    partners: ["UNICEF"],
  },
  {
    lga: "Michika",
    state: "Adamawa",
    severity: "Severe (Severity 3)",
    pin: 145000,
    reached: 82000,
    gap: 63000,
    coveragePct: 56.6,
    partners: ["FHI 360", "DRC"],
  },
  {
    lga: "Mubi North",
    state: "Adamawa",
    severity: "Moderate (Severity 2)",
    pin: 130000,
    reached: 95000,
    gap: 35000,
    coveragePct: 73.1,
    partners: ["CRUDAN", "UNICEF"],
  },
  {
    lga: "Damaturu",
    state: "Yobe",
    severity: "Severe (Severity 3)",
    pin: 160000,
    reached: 88000,
    gap: 72000,
    coveragePct: 55.0,
    partners: ["IRC", "RUWASSA"],
  },
  {
    lga: "Gujba",
    state: "Yobe",
    severity: "Severe (Severity 3)",
    pin: 140000,
    reached: 68000,
    gap: 72000,
    coveragePct: 48.6,
    partners: ["DRC", "Solidarités"],
  },
];

export default function CoordinatorDashboard() {
  const { stats, exportCsv } = useWashData();
  const { currentUser } = useAuth();

  const [stateFilter, setStateFilter] = useState<string>("All");
  const [selectedLgaForReview, setSelectedLgaForReview] = useState<LgaGap | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredGaps = SAMPLE_LGA_GAPS.filter((g) => {
    if (stateFilter !== "All" && g.state !== stateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-99999 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-brand-400"></span>
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <Link
          to="/coverage-dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
        >
          <span>View Coverage Matrix</span>
        </Link>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all"
        >
          <span>+ Register Partner</span>
        </Link>
        <button
          onClick={() => exportCsv()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all"
        >
          <span>Export Cluster Gap Report</span>
        </button>
      </div>

      {/* Emergency Alerts & Meeting Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cholera Alert */}
        

      </div>

      {/* Operational KPI Grid (TailAdmin Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: HNRP 2026 Target Reach */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
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
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
              64.2%
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              HNRP 2026 Target Reach
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-brand-600 h-full rounded-full" style={{ width: "64.2%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            2.44M of 3.8M target reached across BAY States
          </p>
        </div>

        {/* Card 2: Priority-1 Gap LGAs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              <span>High Gap</span>
              <svg className="w-3 h-3 fill-current rotate-180" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-rose-600 dark:text-rose-400 font-mono">
              4 <span className="text-sm font-medium text-gray-400">LGAs</span>
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Priority-1 Gap LGAs
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: "35%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Bama, Gwoza, Monguno, Kala/Balge with &lt; 40% coverage
          </p>
        </div>

        {/* Card 3: Active Field Projects */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
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
              142 <span className="text-sm font-medium text-gray-400">Sites</span>
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Active Field Projects
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "82%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Across 26 LGAs with 0 duplication detected
          </p>
        </div>

        {/* Card 4: Reporting Partners */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <span>2.59%</span>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 10 10">
                <path d="M5 0L10 7H0L5 0Z" />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">
              {stats.totalPartners} <span className="text-sm font-medium text-gray-400">Active</span>
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mt-1">
              Reporting Partners
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: "91.8%" }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            INGOs, NNGOs and UN Agencies reporting
          </p>
        </div>
      </div>

      {/* Sub-Sector Performance Gauges */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            WASH Sub-Sector Response Progress vs HNRP Targets
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Inter-agency delivery across the 4 key humanitarian cluster pillars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { pillar: "Water Supply", pct: 48, reached: "1,008,000", target: "2,100,000", color: "bg-blue-600", text: "text-blue-600" },
            { pillar: "Emergency Sanitation", pct: 41, reached: "656,000", target: "1,600,000", color: "bg-amber-600", text: "text-amber-600" },
            { pillar: "Hygiene Promotion & Kits", pct: 72, reached: "1,800,000", target: "2,500,000", color: "bg-emerald-600", text: "text-emerald-600" },
            { pillar: "Institutional WASH", pct: 35, reached: "158 PHCs/Schools", target: "450 PHCs/Schools", color: "bg-purple-600", text: "text-purple-600" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.pillar}</span>
                <span className={`text-xs font-black font-mono ${item.text}`}>{item.pct}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2.5 overflow-hidden">
                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }}></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                <span>{item.reached}</span>
                <span>Goal: {item.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5W Submissions & Priority Gap Table */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        {/* State filter buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-2">Filter State:</span>
          {["All", "Borno", "Adamawa", "Yobe"].map((st) => (
            <button
              key={st}
              onClick={() => setStateFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stateFilter === st
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">LGA & State</th>
                <th className="py-3.5 px-4 font-semibold">Severity Index</th>
                <th className="py-3.5 px-4 font-semibold text-right">People In Need (PIN)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Reached</th>
                <th className="py-3.5 px-4 font-semibold text-right">Unmet Gap</th>
                <th className="py-3.5 px-4 font-semibold text-center">Coverage</th>
                <th className="py-3.5 px-4 font-semibold">Active Partners</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredGaps.map((g, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 dark:text-white">{g.lga}</span>
                    <span className="block text-[10px] text-gray-400">{g.state} State</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        g.severity.includes("Critical")
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                          : g.severity.includes("Severe")
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                      }`}
                    >
                      {g.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right text-gray-700 dark:text-gray-300">
                    {g.pin.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                    {g.reached.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-right text-rose-600 dark:text-rose-400">
                    {g.gap.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-xs">{g.coveragePct}%</span>
                    <div className="w-16 mx-auto bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          g.coveragePct < 35 ? "bg-rose-500" : g.coveragePct < 60 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${g.coveragePct}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {g.partners.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedLgaForReview(g);
                        showToast(`Coordinating surge assistance for ${g.lga}.`);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
                    >
                      Prioritize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedLgaForReview && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Priority Surge Assessment: {selectedLgaForReview.lga} ({selectedLgaForReview.state})
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Current coverage is at {selectedLgaForReview.coveragePct}%. An estimated {selectedLgaForReview.gap.toLocaleString()} people require emergency assistance.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Severity:</span>
                <span className="font-bold text-rose-600">{selectedLgaForReview.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Operating Agencies:</span>
                <span className="font-bold">{selectedLgaForReview.partners.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recommended Action:</span>
                <span className="font-bold text-brand-600">Convene Ad-hoc LGA Working Group</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedLgaForReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedLgaForReview(null);
                  showToast(`Request sent to ${selectedLgaForReview.partners.join(", ")} for gap analysis.`);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-md"
              >
                Dispatch Cluster Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
