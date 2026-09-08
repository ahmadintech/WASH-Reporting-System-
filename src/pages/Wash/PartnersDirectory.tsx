import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";

export default function PartnersDirectory() {
  const { reports } = useWashData();
  const [searchTerm, setSearchTerm] = useState("");

  const partners = useMemo(() => {
    const map = new Map<string, {
      name: string;
      type: string;
      focalPoint: string;
      email: string;
      states: Set<string>;
      lgas: Set<string>;
      reportsCount: number;
      totalBeneficiaries: number;
    }>();

    reports.forEach((r) => {
      const key = r.orgName.trim();
      if (!map.has(key)) {
        map.set(key, {
          name: key,
          type: r.orgType,
          focalPoint: r.focalPoint,
          email: r.email,
          states: new Set(),
          lgas: new Set(),
          reportsCount: 0,
          totalBeneficiaries: 0,
        });
      }
      const entry = map.get(key)!;
      if (r.state) entry.states.add(r.state);
      if (r.lga) entry.lgas.add(r.lga);
      entry.reportsCount += 1;
      entry.totalBeneficiaries += Number(r.total) || 0;
    });

    return Array.from(map.values()).sort((a, b) => b.totalBeneficiaries - a.totalBeneficiaries);
  }, [reports]);

  const filteredPartners = useMemo(() => {
    if (!searchTerm) return partners;
    const q = searchTerm.toLowerCase();
    return partners.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.focalPoint.toLowerCase().includes(q)
    );
  }, [partners, searchTerm]);

  return (
    <>
      <PageMeta
        title="Partners Directory | WASH Sector North East Nigeria"
        description="Active WASH humanitarian reporting partners across Borno, Adamawa, and Yobe"
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <span>Humanitarian Coordination</span>
              <span>·</span>
              <span className="text-clay-600 dark:text-clay-400">Sector Partners</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              WASH Reporting Partners Directory ({partners.length})
            </h1>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search partner or focal point..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-base border border-brand-200 dark:border-brand-700/60">
                    {p.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                    {p.type}
                  </span>
                </div>

                <h3 className="mt-3 font-bold text-base text-gray-900 dark:text-white leading-snug">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Focal Point: <strong className="text-gray-700 dark:text-gray-300">{p.focalPoint}</strong>
                </p>
                <p className="text-xs text-brand-600 dark:text-brand-400 truncate mt-0.5 font-mono">
                  {p.email}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap gap-1.5">
                  {Array.from(p.states).map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300"
                    >
                      {st}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {p.lgas.size} LGAs
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {p.reportsCount} {p.reportsCount === 1 ? "report" : "reports"} on file
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {p.totalBeneficiaries.toLocaleString()} assisted
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
