import { Link } from "react-router";
import { useWashData } from "../../context/WashDataContext";

export default function RecentOrders() {
  const { reports } = useWashData();
  const recentReports = reports.slice(0, 6);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs">
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Recent 5W Field Activity Reports
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Verified humanitarian field response entries
          </p>
        </div>
        <Link
          to="/coverage-dashboard"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
        >
          View Full Matrix ({reports.length}) →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/70 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="py-3.5 px-5 font-semibold">Partner</th>
              <th className="py-3.5 px-5 font-semibold">Intervention</th>
              <th className="py-3.5 px-5 font-semibold">Location</th>
              <th className="py-3.5 px-5 font-semibold">Period</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold text-right">Beneficiaries</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentReports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <td className="py-3.5 px-5 font-bold text-gray-900 dark:text-white">
                  <div>{r.orgName}</div>
                  <div className="text-[10px] text-gray-400 font-normal">{r.focalPoint}</div>
                </td>
                <td className="py-3.5 px-5 text-gray-700 dark:text-gray-300 font-medium max-w-[200px] truncate">
                  {r.activityType === "Other" ? r.activityOther || "Other" : r.activityType}
                </td>
                <td className="py-3.5 px-5 text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{r.state}</span> · {r.lga}
                </td>
                <td className="py-3.5 px-5 font-mono text-gray-500">{r.period}</td>
                <td className="py-3.5 px-5">
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
                <td className="py-3.5 px-5 font-mono font-bold text-right text-gray-900 dark:text-white">
                  {Number(r.total).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
