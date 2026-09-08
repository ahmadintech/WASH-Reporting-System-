import { Link, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { RoleSwitcher } from "../../components/common/RoleSwitcher";

export default function Home() {
  const { stats, reports } = useWashData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const recentReports = reports.slice(0, 5);

  return (
    <>
      <PageMeta
        title="WASH Sector North East Nigeria — 5W Activity Reporting Platform"
        description="Sector coordination, coverage analytics, and 5W reporting for Borno, Adamawa, and Yobe states"
      />

      <div className="space-y-6">
        {/* Role & Context Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3.5 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-700">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Welcome, {currentUser.name}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-clay-50 dark:bg-clay-950/50 text-clay-700 dark:text-clay-400 border border-clay-200 dark:border-clay-800">
                  {currentUser.roleTitle}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Logged in as <strong className="text-gray-700 dark:text-gray-200">{currentUser.organization}</strong> · Region: Borno, Adamawa & Yobe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Active Role:</span>
            <RoleSwitcher />
          </div>
        </div>

        {/* Hero Section from wash-5w-reporting-platform.html */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B3C46] to-[#12707E] p-6 sm:p-10 text-white shadow-xl">
          {/* Background decorative circles */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
          <div className="absolute right-20 -bottom-20 h-48 w-48 rounded-full bg-clay-500/20 blur-xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#BFE3DD] backdrop-blur-sm border border-white/20 mb-4">
              Sector coordination · Borno · Adamawa · Yobe
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white mb-3">
              One home for every WASH partner's 5W reporting and coverage data.
            </h1>
            <p className="text-sm sm:text-base text-[#DCEEEC] leading-relaxed mb-6">
              Submit your monthly activity data in minutes, and see who is doing what, where, across the North East Nigeria response — updated as soon as partners report.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/submit-report"
                className="inline-flex items-center gap-2 rounded-xl bg-clay-500 hover:bg-clay-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Submit a 5W report</span>
                <span>→</span>
              </Link>
              <Link
                to="/coverage-dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all"
              >
                <span>Open coverage dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Snapshot Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Reports on record
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-brand-700 dark:text-brand-300 font-mono">
              {stats.totalReports.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">Across BAY states</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Beneficiaries reached
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-brand-700 dark:text-brand-300 font-mono">
              {stats.totalBeneficiaries.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">People assisted</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Partners reporting
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-brand-700 dark:text-brand-300 font-mono">
              {stats.totalPartners.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">INGOs, NNGOs & UN</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              LGAs covered
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-brand-700 dark:text-brand-300 font-mono">
              {stats.totalLgas.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">Out of 65 North East LGAs</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/submit-report")}
            className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm transition-all hover:border-brand-500 hover:shadow-md"
          >
            <span className="inline-block rounded-md bg-clay-100 dark:bg-clay-950/50 px-2.5 py-1 text-xs font-bold text-clay-700 dark:text-clay-400">
              Report Activity
            </span>
            <h3 className="mt-3 text-lg font-bold text-brand-950 dark:text-white group-hover:text-brand-600 transition-colors">
              Submit your monthly 5W data
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Log this month's interventions — who delivered what, where, when, and for whom — using the unified North East sector template.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
              <span>Go to submission form</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>

          <div
            onClick={() => navigate("/coverage-dashboard")}
            className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm transition-all hover:border-brand-500 hover:shadow-md"
          >
            <span className="inline-block rounded-md bg-brand-100 dark:bg-brand-950/50 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-400">
              Coverage Analytics
            </span>
            <h3 className="mt-3 text-lg font-bold text-brand-950 dark:text-white group-hover:text-brand-600 transition-colors">
              Explore coverage dashboard
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Filter response data by state, LGA, activity and period, review the full 5W table, and export filtered datasets directly to CSV.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
              <span>Go to dashboard</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </div>

        {/* How 5W reporting works strip */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 mb-4 flex items-center gap-2">
            <span>How 5W reporting works</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="rounded-lg border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/40 p-3.5">
              <span className="font-mono text-xs font-bold text-clay-600 dark:text-clay-400">01 · WHO</span>
              <h4 className="font-bold text-gray-800 dark:text-white text-sm mt-1">Your Organisation</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Name, agency type and focal point submitting.</p>
            </div>

            <div className="rounded-lg border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/40 p-3.5">
              <span className="font-mono text-xs font-bold text-clay-600 dark:text-clay-400">02 · WHAT</span>
              <h4 className="font-bold text-gray-800 dark:text-white text-sm mt-1">The Activity</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Water, sanitation, hygiene or institutional WASH.</p>
            </div>

            <div className="rounded-lg border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/40 p-3.5">
              <span className="font-mono text-xs font-bold text-clay-600 dark:text-clay-400">03 · WHERE</span>
              <h4 className="font-bold text-gray-800 dark:text-white text-sm mt-1">The Location</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">State, LGA, ward and settlement of delivery.</p>
            </div>

            <div className="rounded-lg border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/40 p-3.5">
              <span className="font-mono text-xs font-bold text-clay-600 dark:text-clay-400">04 · WHEN</span>
              <h4 className="font-bold text-gray-800 dark:text-white text-sm mt-1">The Period</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reporting month, status and activity dates.</p>
            </div>

            <div className="rounded-lg border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/40 p-3.5">
              <span className="font-mono text-xs font-bold text-clay-600 dark:text-clay-400">05 · FOR WHOM</span>
              <h4 className="font-bold text-gray-800 dark:text-white text-sm mt-1">The Beneficiaries</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Disaggregated by sex, age and population group.</p>
            </div>
          </div>
        </div>

        {/* Sector Resources & Sector Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 mb-3">
              Sector Guidance & Timelines
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 leading-relaxed">
              <li>
                5W reporting is due by the <strong>last working day of every month</strong>, covering activities in the month just concluded.
              </li>
              <li>
                Use one submission per activity, per location, per reporting period — submit multiple records for multi-site interventions.
              </li>
              <li>
                Beneficiary figures should reflect unique individuals reached in the reporting period only, avoiding cumulative double-counting.
              </li>
              <li>
                All submitted data is standardized and synthesized into the Humanitarian Needs and Response Plan (HNRP) monitoring system.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 mb-3">
              Sector Contacts
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Sector Coordinator</span>
                <span className="font-medium text-gray-900 dark:text-white">coordinator@washsector-ne.org</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Information Management</span>
                <span className="font-medium text-gray-900 dark:text-white">im@washsector-ne.org</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Reporting Helpdesk</span>
                <span className="font-medium text-gray-900 dark:text-white">+234 803 123 4567</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Coordination Meeting</span>
                <span className="font-medium text-brand-600 dark:text-brand-400">Bi-weekly, Maiduguri Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Recent 5W Submissions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest humanitarian activities reported across Borno, Adamawa and Yobe
              </p>
            </div>
            <Link
              to="/coverage-dashboard"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View all reports ({reports.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-semibold">Partner</th>
                  <th className="pb-3 font-semibold">Activity</th>
                  <th className="pb-3 font-semibold">State & LGA</th>
                  <th className="pb-3 font-semibold">Period</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Beneficiaries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentReports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-750">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{r.orgName}</td>
                    <td className="py-3 text-gray-700 dark:text-gray-300">
                      {r.activityType === "Other" ? r.activityOther || "Other" : r.activityType}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {r.state} · {r.lga}
                    </td>
                    <td className="py-3 font-mono text-gray-500">{r.period}</td>
                    <td className="py-3">
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
                    <td className="py-3 font-mono font-bold text-gray-900 dark:text-white text-right">
                      {Number(r.total).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
