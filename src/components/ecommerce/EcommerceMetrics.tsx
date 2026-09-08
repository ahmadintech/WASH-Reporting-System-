import {
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  TableIcon,
  PieChartIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useWashData } from "../../context/WashDataContext";

export default function EcommerceMetrics() {
  const { stats } = useWashData();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {/* Metric 1: Beneficiaries Reached */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-xs">
        <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
          <GroupIcon className="size-6" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Beneficiaries Reached
            </span>
            <h4 className="mt-2 font-bold text-gray-900 text-title-sm dark:text-white font-mono">
              {stats.totalBeneficiaries.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            14.2%
          </Badge>
        </div>
      </div>

      {/* Metric 2: 5W Reports Submitted */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-xs">
        <div className="flex items-center justify-center w-12 h-12 bg-clay-50 rounded-xl dark:bg-clay-950/40 text-clay-600 dark:text-clay-400">
          <TableIcon className="size-6" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              5W Reports Filed
            </span>
            <h4 className="mt-2 font-bold text-gray-900 text-title-sm dark:text-white font-mono">
              {stats.totalReports.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            100%
          </Badge>
        </div>
      </div>

      {/* Metric 3: Active Reporting Partners */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-xs">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
          <BoxIconLine className="size-6" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Reporting Partners
            </span>
            <h4 className="mt-2 font-bold text-gray-900 text-title-sm dark:text-white font-mono">
              {stats.totalPartners.toLocaleString()}
            </h4>
          </div>
          <span className="text-xs text-gray-400 font-medium">INGOs / UN</span>
        </div>
      </div>

      {/* Metric 4: Response LGAs Covered */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-xs">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
          <PieChartIcon className="size-6" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              LGAs Covered
            </span>
            <h4 className="mt-2 font-bold text-gray-900 text-title-sm dark:text-white font-mono">
              {stats.totalLgas} <span className="text-xs text-gray-400 font-normal">/ 65</span>
            </h4>
          </div>
          <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">BAY States</span>
        </div>
      </div>
    </div>
  );
}
