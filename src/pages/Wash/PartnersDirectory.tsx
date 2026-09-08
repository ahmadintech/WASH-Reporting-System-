import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";
import { useAuth } from "../../context/AuthContext";
import { LGA_BY_STATE } from "../../types/wash";

export default function PartnersDirectory() {
  const { reports } = useWashData();
  const { currentUser, addUser, users } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const sanitizeState = (st?: string): "Borno" | "Adamawa" | "Yobe" => {
    if (!st) return "Borno";
    if (st.includes("Adamawa")) return "Adamawa";
    if (st.includes("Yobe")) return "Yobe";
    return "Borno";
  };

  // Modal State for Registering New Partner
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("International NGO");
  const [focalPoint, setFocalPoint] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"Borno" | "Adamawa" | "Yobe">(() =>
    sanitizeState(currentUser?.state)
  );
  const [selectedLga, setSelectedLga] = useState<string>("Maiduguri");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const isCoordinatorOrAdmin = currentUser.role === "admin" || currentUser.role === "coordinator";

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

    // Include partners from registered users context
    users.forEach((u) => {
      if (u.role === "partner" || u.organizationType.includes("NGO") || u.organizationType.includes("UN")) {
        const key = u.organization.trim();
        if (key && !map.has(key)) {
          map.set(key, {
            name: key,
            type: u.organizationType || "Implementing Partner",
            focalPoint: u.name,
            email: u.email,
            states: new Set(u.state ? [u.state] : ["Borno"]),
            lgas: new Set(u.lga ? [u.lga] : []),
            reportsCount: 0,
            totalBeneficiaries: 0,
          });
        }
      }
    });

    // Aggregate report metrics
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
  }, [reports, users]);

  const isCoordinator = currentUser.role === "coordinator";
  const userStateScope = sanitizeState(currentUser?.state);

  const [stateTab, setStateTab] = useState<string>(() =>
    isCoordinator ? userStateScope : "All"
  );

  const filteredPartners = useMemo(() => {
    let result = partners;

    if (stateTab !== "All") {
      result = result.filter((p) => p.states.has(stateTab));
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.focalPoint.toLowerCase().includes(q)
      );
    }
    return result;
  }, [partners, searchTerm, stateTab]);

  const handleRegisterPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !focalPoint || !email) {
      showToast("Please complete all required fields.");
      return;
    }

    addUser({
      name: focalPoint,
      email: email,
      role: "partner",
      roleTitle: `${orgType} Focal Point`,
      organization: orgName,
      organizationType: orgType,
      state: state,
      lga: selectedLga,
      status: "Active",
      permissions: {
        canApproveReports: false,
        canExportMasterData: false,
        canConfigureSettings: false,
        canManageUsers: false,
        canSubmit5W: true,
      },
    });

    showToast(`Partner organization ${orgName} registered successfully!`);
    setIsModalOpen(false);
    setOrgName("");
    setFocalPoint("");
    setEmail("");
  };

  // Safe LGAs array resolution to prevent runtime crashes
  const currentValidState: "Borno" | "Adamawa" | "Yobe" = sanitizeState(state);
  const availableLgas = LGA_BY_STATE[currentValidState] || LGA_BY_STATE["Borno"];

  return (
    <>
      <PageMeta
        title="Partners | WASH Sector North East Nigeria"
        description="Active WASH humanitarian reporting partners across Borno, Adamawa, and Yobe"
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-99999 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <span>Humanitarian Coordination</span>
              <span>·</span>
              <span className="text-clay-600 dark:text-clay-400">
                {isCoordinator ? `${userStateScope} State Partners` : "Sector Partners"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Partners ({filteredPartners.length})
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search partner or focal point..."
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:outline-none"
              />
            </div>

            {isCoordinatorOrAdmin && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Register New Partner</span>
              </button>
            )}
          </div>
        </div>

        {/* State Desk Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl w-fit">
          {isCoordinator && (
            <button
              onClick={() => setStateTab(userStateScope)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stateTab === userStateScope
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              My State ({userStateScope})
            </button>
          )}
          {["All", "Borno", "Adamawa", "Yobe"].map((st) => {
            if (isCoordinator && st === userStateScope) return null; // Avoid duplicate tab
            return (
              <button
                key={st}
                onClick={() => setStateTab(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  stateTab === st
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {st === "All" ? "All BAY States" : `${st} State`}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-base border border-brand-200 dark:border-brand-700/60">
                    {p.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
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

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-1.5">
                  {Array.from(p.states).map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300"
                    >
                      {st}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {p.lgas.size} LGAs
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
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

      {/* Partner Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-brand-50/50 to-transparent dark:from-brand-950/20">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Accredit & Register New Partner
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Register implementing partner for {currentValidState} State 5W reporting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRegisterPartner} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Partner Organization Name *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. International Rescue Committee"
                  required
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Organization Type *
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="International NGO">International NGO</option>
                    <option value="National NGO">National NGO</option>
                    <option value="UN Agency">UN Agency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Operational State Hub *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      const st = sanitizeState(e.target.value);
                      setState(st);
                      setSelectedLga(LGA_BY_STATE[st][0]);
                    }}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Borno">Borno State</option>
                    <option value="Adamawa">Adamawa State</option>
                    <option value="Yobe">Yobe State</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Focal Point Name *
                  </label>
                  <input
                    type="text"
                    value={focalPoint}
                    onChange={(e) => setFocalPoint(e.target.value)}
                    placeholder="e.g. Ibrahim Lawan"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Focal Point Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. focal@partner.org"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Primary LGA Operational Field Base
                </label>
                <select
                  value={selectedLga}
                  onChange={(e) => setSelectedLga(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                >
                  {availableLgas.map((l) => (
                    <option key={l} value={l}>
                      {l} LGA
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Accredit & Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
