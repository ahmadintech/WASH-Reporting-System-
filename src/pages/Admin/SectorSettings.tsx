import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useWashData } from "../../context/WashDataContext";

type SettingsTab = "programs" | "cycles" | "system" | "alerts" | "integrations" | "locations";

export default function SectorSettings() {
  const {
    activityCategories,
    addCategory,
    addActivity,
    removeActivity,
    units,
    addUnit,
    removeUnit,
    locationTypes,
    addLocationType,
    removeLocationType,
    populationGroups,
    addPopulationGroup,
    removePopulationGroup,
    reportingConfig,
    updateReportingConfig,
    systemConfig,
    updateSystemConfig,
    resetAllSettingsToDefault,
    exportSettingsJson,
    states,
    addState,
    removeState,
    lgasByState,
    getLgasForState,
    addLga,
    removeLga,
    wardsByLga,
    getWardsForLga,
    addWard,
    removeWard,
  } = useWashData();

  const [activeTab, setActiveTab] = useState<SettingsTab>("programs");
  const [toast, setToast] = useState<string | null>(null);

  // Location Tab Inputs
  const [selectedLocState, setSelectedLocState] = useState(states[0] || "Borno");
  const [selectedLocLga, setSelectedLocLga] = useState(() => getLgasForState(states[0] || "Borno")[0] || "Maiduguri");
  const [newStateInput, setNewStateInput] = useState("");
  const [newLgaInput, setNewLgaInput] = useState("");
  const [newWardInput, setNewWardInput] = useState("");

  // 5W Parameters inputs
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCatForNewAct, setSelectedCatForNewAct] = useState(
    activityCategories[0]?.category || "Water Supply"
  );
  const [newActivityName, setNewActivityName] = useState("");
  const [newUnitName, setNewUnitName] = useState("");
  const [newLocType, setNewLocType] = useState("");
  const [newPopGroup, setNewPopGroup] = useState("");

  // Cycle config inputs
  const [cycleMonth, setCycleMonth] = useState(reportingConfig.activeCycle);
  const [cycleDeadline, setCycleDeadline] = useState(reportingConfig.deadlineDate);
  const [freezeToggle, setFreezeToggle] = useState(reportingConfig.isFreezeActive);
  const [cycleNotes, setCycleNotes] = useState(reportingConfig.notes || "");

  // System config inputs
  const [platformTitle, setPlatformTitle] = useState(systemConfig.platformTitle);
  const [leadAgency, setLeadAgency] = useState(systemConfig.leadAgency);
  const [operationalContext, setOperationalContext] = useState(systemConfig.operationalContext);
  const [defaultState, setDefaultState] = useState<"Borno" | "Adamawa" | "Yobe">(systemConfig.defaultState);
  const [requireGps, setRequireGps] = useState(systemConfig.requireGps);
  const [requirePwd, setRequirePwd] = useState(systemConfig.requirePwd);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(systemConfig.autoSaveDrafts);
  const [draftIntervalSeconds, setDraftIntervalSeconds] = useState(systemConfig.draftIntervalSeconds);

  // Alerts config inputs
  const [enableDeadlineReminders, setEnableDeadlineReminders] = useState(systemConfig.enableDeadlineReminders);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(systemConfig.reminderDaysBefore);
  const [choleraAlertThreshold, setCholeraAlertThreshold] = useState(systemConfig.choleraAlertThreshold);
  const [replyToEmail, setReplyToEmail] = useState(systemConfig.replyToEmail);

  // Integrations config inputs
  const [enableHdxSync, setEnableHdxSync] = useState(systemConfig.enableHdxSync);
  const [hdxApiKey, setHdxApiKey] = useState(systemConfig.hdxApiKey);
  const [enablePublicDashboard, setEnablePublicDashboard] = useState(systemConfig.enablePublicDashboard);
  const [dataRetentionDays, setDataRetentionDays] = useState(systemConfig.dataRetentionDays);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Handlers for 5W params
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName);
    showToast(`Program category "${newCategoryName}" created.`);
    setNewCategoryName("");
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;
    addActivity(selectedCatForNewAct, newActivityName);
    showToast(`Added "${newActivityName}" under ${selectedCatForNewAct}.`);
    setNewActivityName("");
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;
    addUnit(newUnitName);
    showToast(`Unit "${newUnitName}" added to 5W parameters.`);
    setNewUnitName("");
  };

  const handleAddLocType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocType.trim()) return;
    addLocationType(newLocType);
    showToast(`Location type "${newLocType}" added.`);
    setNewLocType("");
  };

  const handleAddPopGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPopGroup.trim()) return;
    addPopulationGroup(newPopGroup);
    showToast(`Target population group "${newPopGroup}" added.`);
    setNewPopGroup("");
  };

  // Location Handlers
  const handleAddStateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStateInput.trim()) return;
    addState(newStateInput.trim());
    setSelectedLocState(newStateInput.trim());
    showToast(`State "${newStateInput.trim()}" added to platform.`);
    setNewStateInput("");
  };

  const handleRemoveStateAction = (st: string) => {
    if (confirm(`Remove state "${st}" and its associated LGAs?`)) {
      removeState(st);
      if (selectedLocState === st) {
        const remaining = states.filter((s) => s.toLowerCase() !== st.toLowerCase());
        setSelectedLocState(remaining[0] || "");
      }
      showToast(`State "${st}" removed.`);
    }
  };

  const handleAddLgaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLgaInput.trim() || !selectedLocState) return;
    addLga(selectedLocState, newLgaInput.trim());
    setSelectedLocLga(newLgaInput.trim());
    showToast(`LGA "${newLgaInput.trim()}" added to ${selectedLocState}.`);
    setNewLgaInput("");
  };

  const handleRemoveLgaAction = (lga: string) => {
    if (confirm(`Remove LGA "${lga}" from ${selectedLocState}?`)) {
      removeLga(selectedLocState, lga);
      showToast(`LGA "${lga}" removed from ${selectedLocState}.`);
    }
  };

  const handleAddWardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWardInput.trim() || !selectedLocState || !selectedLocLga) return;
    addWard(selectedLocState, selectedLocLga, newWardInput.trim());
    showToast(`Ward "${newWardInput.trim()}" added to ${selectedLocLga}.`);
    setNewWardInput("");
  };

  const handleRemoveWardAction = (ward: string) => {
    if (confirm(`Remove ward "${ward}" from ${selectedLocLga}?`)) {
      removeWard(selectedLocState, selectedLocLga, ward);
      showToast(`Ward "${ward}" removed.`);
    }
  };

  // Handler for Cycle
  const handleSaveCycle = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportingConfig({
      activeCycle: cycleMonth,
      deadlineDate: cycleDeadline,
      isFreezeActive: freezeToggle,
      notes: cycleNotes,
    });
    showToast("Reporting cycle and deadline parameters saved.");
  };

  // Handler for System Config
  const handleSaveSystemConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      platformTitle,
      leadAgency,
      operationalContext,
      defaultState,
      requireGps,
      requirePwd,
      autoSaveDrafts,
      draftIntervalSeconds,
    });
    showToast("General system configuration updated successfully.");
  };

  // Handler for Alerts Config
  const handleSaveAlertsConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      enableDeadlineReminders,
      reminderDaysBefore,
      choleraAlertThreshold,
      replyToEmail,
    });
    showToast("Alerts and automated notifications configured.");
  };

  // Handler for Integrations Config
  const handleSaveIntegrationsConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      enableHdxSync,
      hdxApiKey,
      enablePublicDashboard,
      dataRetentionDays,
    });
    showToast("Integration and data exchange settings saved.");
  };

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to restore all platform settings, cycles, and parameters to default?")) {
      resetAllSettingsToDefault();
      setCycleMonth("2026-08");
      setCycleDeadline("2026-09-12");
      setFreezeToggle(false);
      setPlatformTitle("WASH 5W Activity Reporting Platform");
      setLeadAgency("UNICEF / Federal Ministry of Water Resources");
      setOperationalContext("North East Nigeria (BAY States Humanitarian Response)");
      setDefaultState("Borno");
      setRequireGps(true);
      setRequirePwd(true);
      setAutoSaveDrafts(true);
      setDraftIntervalSeconds(30);
      setEnableDeadlineReminders(true);
      setReminderDaysBefore(3);
      setCholeraAlertThreshold(5);
      setReplyToEmail("washcluster.nigeria@unicef.org");
      setEnableHdxSync(false);
      setEnablePublicDashboard(true);
      showToast("Platform configurations reset to factory defaults.");
    }
  };

  return (
    <>
      <PageMeta
        title="Settings & System Configurations | WASH Sector NE Nigeria"
        description="Configure standard 5W programs, activities, units, reporting deadlines, automated alerts, and platform integrations."
      />
      <PageBreadcrumb pageTitle="Settings & Configurations" />

      {/* Floating Toast Notice */}
      {toast && (
        <div className="fixed top-20 right-6 z-99999 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800 mb-6 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("programs")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "programs"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Programs & 5W Parameters
        </button>

        <button
          onClick={() => setActiveTab("cycles")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "cycles"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Reporting Cycles & Deadlines
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "system"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          General System Configuration
        </button>

        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "alerts"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Alerts & Notification Rules
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "integrations"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Integrations & Data Backup
        </button>

        <button
          onClick={() => setActiveTab("locations")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "locations"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Locations (States, LGAs & Wards)
        </button>
      </div>

      {/* TAB 1: PROGRAMS & 5W PARAMETERS */}
      {activeTab === "programs" && (
        <div className="space-y-6">
          {/* Sub-sector activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Standard WASH Interventions by Sub-Sector
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                These options dynamically populate Section 02 (WHAT) of the 5W reporting form for implementing partners.
              </p>

              <div className="space-y-5">
                {activityCategories.map((cat) => (
                  <div
                    key={cat.category}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-brand-700 dark:text-brand-300">
                        {cat.category} ({cat.activities.length} Interventions)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.activities.map((act) => (
                        <span
                          key={act}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-2xs"
                        >
                          <span>{act}</span>
                          <button
                            type="button"
                            onClick={() => removeActivity(cat.category, act)}
                            className="text-gray-400 hover:text-red-500 font-bold ml-1"
                            title="Remove intervention"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Add Activity to Sub-Sector
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Append a new standard intervention to an existing cluster category.
                </p>

                <form onSubmit={handleAddActivity} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Sub-Sector Category
                    </label>
                    <select
                      value={selectedCatForNewAct}
                      onChange={(e) => setSelectedCatForNewAct(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                    >
                      {activityCategories.map((c) => (
                        <option key={c.category} value={c.category}>
                          {c.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      New Activity Description
                    </label>
                    <input
                      type="text"
                      required
                      value={newActivityName}
                      onChange={(e) => setNewActivityName(e.target.value)}
                      placeholder="e.g. Solar Mini-Grid Water Kiosk"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-xs cursor-pointer"
                  >
                    + Add Activity
                  </button>
                </form>
              </div>

              {/* Add New Category */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Create New Sub-Sector Category
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Add a new thematic cluster area (e.g. Solar Electrification, Cholera Wash-in-Health).
                </p>

                <form onSubmit={handleAddCategory} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Flood Rapid Response"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 transition-all shadow-xs cursor-pointer"
                  >
                    + Create Category
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Units and Locations grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Units */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Units of Measurement ({units.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Valid metric units selectable in Section 02.
              </p>

              <form onSubmit={handleAddUnit} className="flex gap-2 mb-4">
                <input
                  type="text"
                  required
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="e.g. Handwashing Stations"
                  className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shrink-0 hover:bg-brand-700 cursor-pointer"
                >
                  Add Unit
                </button>
              </form>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {units.map((u) => (
                  <span
                    key={u}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <span>{u}</span>
                    <button
                      type="button"
                      onClick={() => removeUnit(u)}
                      className="text-gray-400 hover:text-red-500 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Locations & Groups */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Location Types & Target Demographics
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Valid settlements and beneficiary population categories.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Location Types
                  </label>
                  <form onSubmit={handleAddLocType} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      required
                      value={newLocType}
                      onChange={(e) => setNewLocType(e.target.value)}
                      placeholder="e.g. Transit center / border point"
                      className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shrink-0 hover:bg-brand-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-1.5">
                    {locationTypes.map((lt) => (
                      <span
                        key={lt}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        <span>{lt}</span>
                        <button
                          type="button"
                          onClick={() => removeLocationType(lt)}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Population Groups
                  </label>
                  <form onSubmit={handleAddPopGroup} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      required
                      value={newPopGroup}
                      onChange={(e) => setNewPopGroup(e.target.value)}
                      placeholder="e.g. Cross-border asylum seekers"
                      className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shrink-0 hover:bg-brand-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-1.5">
                    {populationGroups.map((pg) => (
                      <span
                        key={pg}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        <span>{pg}</span>
                        <button
                          type="button"
                          onClick={() => removePopulationGroup(pg)}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTING CYCLES & DEADLINES */}
      {activeTab === "cycles" && (
        <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            Sector Reporting Cycle & Submission Deadlines
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Configure the current active 5W reporting cycle, cutoff date, and operational freeze for North East Nigeria partners.
          </p>

          <form onSubmit={handleSaveCycle} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Active Reporting Cycle (Month)
                </label>
                <input
                  type="month"
                  required
                  value={cycleMonth}
                  onChange={(e) => setCycleMonth(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs sm:text-sm text-gray-900 dark:text-white font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">Designates the operational round period.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Partner Submission Deadline
                </label>
                <input
                  type="date"
                  required
                  value={cycleDeadline}
                  onChange={(e) => setCycleDeadline(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs sm:text-sm text-gray-900 dark:text-white font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">Partners will see this deadline cutoff date.</p>
              </div>
            </div>

            {/* Cycle Lock / Freeze Toggle */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Cycle Submissions Freeze
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    When enabled, partner field submissions are locked pending sector data cleaning and verification.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freezeToggle}
                    onChange={(e) => setFreezeToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
              {freezeToggle && (
                <div className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
                  ⚠️ Freeze Active: Submissions for this round are locked across all 48 accredited agencies.
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Sector Circular / Round Guidance Note
              </label>
              <textarea
                rows={3}
                value={cycleNotes}
                onChange={(e) => setCycleNotes(e.target.value)}
                placeholder="e.g. Please prioritize reporting on Flood Early Warning and Cholera Surge Response activities in Maiduguri, Jere and Bama..."
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Save Cycle & Deadlines
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: GENERAL SYSTEM CONFIGURATION */}
      {activeTab === "system" && (
        <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            Platform Identity & Form Governance Rules
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Configure system branding, operational defaults, and validation strictness across all 5W modules.
          </p>

          <form onSubmit={handleSaveSystemConfig} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Platform Title
              </label>
              <input
                type="text"
                required
                value={platformTitle}
                onChange={(e) => setPlatformTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Sector Lead Body / Agency
                </label>
                <input
                  type="text"
                  required
                  value={leadAgency}
                  onChange={(e) => setLeadAgency(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Operational Context Scope
                </label>
                <input
                  type="text"
                  required
                  value={operationalContext}
                  onChange={(e) => setOperationalContext(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Default State for New Records
              </label>
              <select
                value={defaultState}
                onChange={(e) => setDefaultState(e.target.value as "Borno" | "Adamawa" | "Yobe")}
                className="w-full sm:w-1/2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
              >
                <option value="Borno">Borno State</option>
                <option value="Adamawa">Adamawa State</option>
                <option value="Yobe">Yobe State</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                5W Field Form Validation Controls
              </h4>

              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Require GPS Coordinates Verification</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Ensures partner entries provide valid latitude/longitude within BAY state bounds.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireGps}
                    onChange={(e) => setRequireGps(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Enforce PWD Disaggregation</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Mandates entry of Persons with Disabilities reached in Section 05.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requirePwd}
                    onChange={(e) => setRequirePwd(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Form Auto-Save in Browser</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Periodically saves incomplete field report progress locally to prevent data loss.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSaveDrafts}
                    onChange={(e) => setAutoSaveDrafts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Save System Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: ALERTS & NOTIFICATIONS */}
      {activeTab === "alerts" && (
        <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            Automated Alerts & Early Warning Thresholds
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Configure automated cluster circular triggers, cholera outbreak warning badges, and deadline reminders.
          </p>

          <form onSubmit={handleSaveAlertsConfig} className="space-y-5">
            <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/50 dark:border-brand-900 dark:bg-brand-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brand-950 dark:text-brand-100">
                    Automated Deadline Reminders
                  </h4>
                  <p className="text-[11px] text-brand-800 dark:text-brand-300">
                    Dispatches countdown reminders to accredited partner focal points ahead of cutoff.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDeadlineReminders}
                    onChange={(e) => setEnableDeadlineReminders(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {enableDeadlineReminders && (
                <div className="mt-3 pt-3 border-t border-brand-200/60 dark:border-brand-900/60">
                  <label className="block text-xs font-semibold text-brand-900 dark:text-brand-200 mb-1">
                    Send Reminder (Days Prior to Deadline)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={reminderDaysBefore}
                    onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
                    className="w-32 rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-bold"
                  />
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/30">
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-100 mb-1">
                Cholera / AWD Emergency Surge Alert Threshold
              </h4>
              <p className="text-[11px] text-rose-800 dark:text-rose-300 mb-3">
                Minimum confirmed cases in any single LGA required to trigger the high-priority warning banner on the Coordinator Desk.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={choleraAlertThreshold}
                  onChange={(e) => setCholeraAlertThreshold(Number(e.target.value))}
                  className="w-32 rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-bold"
                />
                <span className="text-xs text-rose-900 dark:text-rose-200 font-medium">Cases per LGA</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Cluster Helpdesk & Reply-To Email
              </label>
              <input
                type="email"
                required
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
              />
              <p className="text-[11px] text-gray-400 mt-1">Address displayed on automated notifications for partner queries.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Save Alerts Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: INTEGRATIONS & DATA BACKUP */}
      {activeTab === "integrations" && (
        <div className="space-y-6 max-w-3xl">
          {/* HDX Integration */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Humanitarian Data Exchange (HDX) Connector
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Harmonize monthly 5W master indicators directly with UN OCHA HDX repository.
            </p>

            <form onSubmit={handleSaveIntegrationsConfig} className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Enable Automated HDX Dataset Feed</div>
                  <div className="text-[11px] text-gray-400">Syncs cleaned monthly master 5W CSVs upon admin approval.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableHdxSync}
                    onChange={(e) => setEnableHdxSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  HDX API Key
                </label>
                <input
                  type="password"
                  value={hdxApiKey}
                  onChange={(e) => setHdxApiKey(e.target.value)}
                  placeholder="Enter OCHA HDX organization API key..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs font-mono text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs cursor-pointer"
                >
                  Save Integration Settings
                </button>
              </div>
            </form>
          </div>

          {/* Configuration Snapshot Backup & Factory Reset */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Configuration Snapshot & Backup
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Export full system setup, program trees, and parameters, or restore factory standards.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={exportSettingsJson}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Configuration JSON</span>
              </button>

              <button
                type="button"
                onClick={handleFactoryReset}
                className="py-3 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 transition-all cursor-pointer"
              >
                Restore Factory Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LOCATIONS (STATES, LGAS & WARDS) */}
      {activeTab === "locations" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-r from-brand-50/70 to-emerald-50/50 dark:from-brand-950/40 dark:to-emerald-950/20 p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Administrative Boundary Hierarchy (States · LGAs · Wards)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                    Live 5W Sync
                  </span>
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 max-w-3xl">
                  Configure the official geographic hierarchy of the North East humanitarian response. States and LGAs defined here automatically populate user profile registrations in User Management, and strictly bind the 5W reporting dropdowns and ward selectors for field partners.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  {states.length} Active States
                </span>
              </div>
            </div>
          </div>

          {/* 3-Column Interactive Location Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Panel 1: States */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs flex flex-col h-[580px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>1. Operational States</span>
                    <span className="text-xs text-brand-600 dark:text-brand-400">({states.length})</span>
                  </h4>
                  <p className="text-[11px] text-gray-400">Select state to manage LGAs</p>
                </div>
              </div>

              {/* States List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {states.map((st) => {
                  const isSelected = selectedLocState.toLowerCase() === st.toLowerCase();
                  const lgaCount = getLgasForState(st).length;
                  return (
                    <div
                      key={st}
                      onClick={() => {
                        setSelectedLocState(st);
                        const lgas = getLgasForState(st);
                        setSelectedLocLga(lgas[0] || "");
                      }}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-50 dark:bg-brand-950/50 border-brand-500 shadow-xs text-brand-900 dark:text-white ring-1 ring-brand-500/20"
                          : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? "bg-brand-600 ring-2 ring-brand-400/40" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        <span className="font-bold text-xs">{st}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                          {lgaCount} LGAs
                        </span>
                        {states.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveStateAction(st);
                            }}
                            title={`Remove ${st}`}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add State Form */}
              <form onSubmit={handleAddStateSubmit} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                  Add New State Hub
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStateInput}
                    onChange={(e) => setNewStateInput(e.target.value)}
                    placeholder="e.g. Taraba"
                    className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    Add State
                  </button>
                </div>
              </form>
            </div>

            {/* Panel 2: LGAs in Selected State */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs flex flex-col h-[580px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>2. LGAs in {selectedLocState}</span>
                    <span className="text-xs text-brand-600 dark:text-brand-400">
                      ({getLgasForState(selectedLocState).length})
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-400">Select LGA to manage wards</p>
                </div>
              </div>

              {/* LGA List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {getLgasForState(selectedLocState).length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No LGAs registered in {selectedLocState} yet. Add one below.
                  </div>
                ) : (
                  getLgasForState(selectedLocState).map((lga) => {
                    const isSelected = selectedLocLga.toLowerCase() === lga.toLowerCase();
                    const wardCount = getWardsForLga(selectedLocState, lga).length;
                    return (
                      <div
                        key={lga}
                        onClick={() => setSelectedLocLga(lga)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-50 dark:bg-brand-950/50 border-brand-500 shadow-xs text-brand-900 dark:text-white ring-1 ring-brand-500/20"
                            : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">{lga}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-mono">
                            {wardCount} Wards
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLgaAction(lga);
                            }}
                            title={`Remove ${lga}`}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add LGA Form */}
              <form onSubmit={handleAddLgaSubmit} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                  Add New LGA in {selectedLocState}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLgaInput}
                    onChange={(e) => setNewLgaInput(e.target.value)}
                    placeholder="e.g. Gubio"
                    className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    Add LGA
                  </button>
                </div>
              </form>
            </div>

            {/* Panel 3: Wards in Selected LGA */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs flex flex-col h-[580px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>3. Wards in {selectedLocLga || "Selected LGA"}</span>
                    <span className="text-xs text-brand-600 dark:text-brand-400">
                      ({selectedLocLga ? getWardsForLga(selectedLocState, selectedLocLga).length : 0})
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-400">{selectedLocState} · Automated in 5W form</p>
                </div>
              </div>

              {/* Wards List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {!selectedLocLga ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    Select an LGA from panel 2 to view and manage its wards.
                  </div>
                ) : getWardsForLga(selectedLocState, selectedLocLga).length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No custom wards configured for {selectedLocLga}. Add one below.
                  </div>
                ) : (
                  getWardsForLga(selectedLocState, selectedLocLga).map((ward) => (
                    <div
                      key={ward}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-800 dark:text-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-xs">{ward}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveWardAction(ward)}
                        title={`Remove ward ${ward}`}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Ward Form */}
              <form onSubmit={handleAddWardSubmit} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                  Add Ward in {selectedLocLga || "LGA"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWardInput}
                    onChange={(e) => setNewWardInput(e.target.value)}
                    placeholder="e.g. Hausari II"
                    disabled={!selectedLocLga}
                    className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!selectedLocLga}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    Add Ward
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
