import React, { createContext, useContext, useState, useEffect } from "react";
import {
  WashReport,
  INITIAL_WASH_REPORTS,
  ACTIVITY_CATEGORIES,
  UNITS,
  LOCATION_TYPES,
  POPULATION_GROUPS,
  LGA_BY_STATE,
  INITIAL_WARDS_BY_LGA,
} from "../types/wash";

export interface ProgramCategory {
  category: string;
  activities: string[];
}

export interface ReportingConfig {
  activeCycle: string; // e.g. "2026-08"
  deadlineDate: string; // e.g. "2026-09-12"
  isFreezeActive: boolean;
  notes?: string;
}

export interface SystemConfig {
  platformTitle: string;
  leadAgency: string;
  operationalContext: string;
  defaultState: "Borno" | "Adamawa" | "Yobe";
  requireGps: boolean;
  requirePwd: boolean;
  autoSaveDrafts: boolean;
  draftIntervalSeconds: number;
  enableDeadlineReminders: boolean;
  reminderDaysBefore: number;
  choleraAlertThreshold: number;
  replyToEmail: string;
  enableHdxSync: boolean;
  hdxApiKey: string;
  enablePublicDashboard: boolean;
  dataRetentionDays: number;
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  platformTitle: "WASH 5W Activity Reporting Platform",
  leadAgency: "UNICEF / Federal Ministry of Water Resources",
  operationalContext: "North East Nigeria (BAY States Humanitarian Response)",
  defaultState: "Borno",
  requireGps: true,
  requirePwd: true,
  autoSaveDrafts: true,
  draftIntervalSeconds: 30,
  enableDeadlineReminders: true,
  reminderDaysBefore: 3,
  choleraAlertThreshold: 5,
  replyToEmail: "washcluster.nigeria@unicef.org",
  enableHdxSync: false,
  hdxApiKey: "",
  enablePublicDashboard: true,
  dataRetentionDays: 365,
};

interface WashDataContextType {
  reports: WashReport[];
  addReport: (report: Omit<WashReport, "id" | "submittedAt">) => WashReport;
  deleteReport: (id: string) => boolean;
  exportCsv: (customReports?: WashReport[]) => void;
  resetToSampleData: () => void;
  // Dynamic parameters managed by Admin
  activityCategories: ProgramCategory[];
  addCategory: (category: string) => void;
  addActivity: (category: string, activity: string) => void;
  removeActivity: (category: string, activity: string) => void;
  units: string[];
  addUnit: (unit: string) => void;
  removeUnit: (unit: string) => void;
  locationTypes: string[];
  addLocationType: (locType: string) => void;
  removeLocationType: (locType: string) => void;
  populationGroups: string[];
  addPopulationGroup: (group: string) => void;
  removePopulationGroup: (group: string) => void;
  reportingConfig: ReportingConfig;
  updateReportingConfig: (config: Partial<ReportingConfig>) => void;
  systemConfig: SystemConfig;
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  resetAllSettingsToDefault: () => void;
  exportSettingsJson: () => void;
  // Dynamic location hierarchy managed by Admin
  states: string[];
  addState: (stateName: string) => void;
  removeState: (stateName: string) => void;
  lgasByState: Record<string, string[]>;
  getLgasForState: (stateName: string) => string[];
  addLga: (stateName: string, lgaName: string) => void;
  removeLga: (stateName: string, lgaName: string) => void;
  wardsByLga: Record<string, string[]>;
  getWardsForLga: (stateName: string, lgaName: string) => string[];
  addWard: (stateName: string, lgaName: string, wardName: string) => void;
  removeWard: (stateName: string, lgaName: string, wardName: string) => void;
  stats: {
    totalReports: number;
    totalBeneficiaries: number;
    totalPartners: number;
    totalLgas: number;
  };
}

const STORAGE_KEY = "wash-5w-reports";
const SETTINGS_STORAGE_KEY = "wash-sector-settings";

const WashDataContext = createContext<WashDataContextType | undefined>(undefined);

export const WashDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<WashReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_WASH_REPORTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  const addReport = (reportData: Omit<WashReport, "id" | "submittedAt">): WashReport => {
    const newReport: WashReport = {
      ...reportData,
      id: "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      submittedAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const deleteReport = (id: string): boolean => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const resetToSampleData = () => {
    setReports(INITIAL_WASH_REPORTS);
  };

  const exportCsv = (customReports?: WashReport[]) => {
    const list = customReports || reports;
    if (list.length === 0) {
      alert("No reports to export.");
      return;
    }

    const cols: (keyof WashReport)[] = [
      "orgName",
      "orgType",
      "focalPoint",
      "email",
      "donor",
      "activityType",
      "activityOther",
      "quantity",
      "unit",
      "indicatorDesc",
      "state",
      "lga",
      "ward",
      "settlement",
      "locationType",
      "period",
      "status",
      "startDate",
      "endDate",
      "populationGroup",
      "men",
      "women",
      "boys",
      "girls",
      "pwd",
      "total",
    ];

    const csvRows = [cols.join(",")];
    list.forEach((r) => {
      csvRows.push(
        cols
          .map((col) => {
            const val = r[col] !== undefined && r[col] !== null ? String(r[col]).replace(/"/g, '""') : "";
            return `"${val}"`;
          })
          .join(",")
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `WASH_5W_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic Settings State
  const [activityCategories, setActivityCategories] = useState<ProgramCategory[]>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_categories`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ACTIVITY_CATEGORIES;
  });

  const [units, setUnits] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_units`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return UNITS;
  });

  const [locationTypes, setLocationTypes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_location_types`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return LOCATION_TYPES;
  });

  const [populationGroups, setPopulationGroups] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_pop_groups`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return POPULATION_GROUPS;
  });

  const [reportingConfig, setReportingConfig] = useState<ReportingConfig>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_config`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      activeCycle: "2026-08",
      deadlineDate: "2026-09-12",
      isFreezeActive: false,
      notes: "August 2026 monthly reporting round for Borno, Adamawa, and Yobe states.",
    };
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_system_config`);
      if (saved) return { ...DEFAULT_SYSTEM_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SYSTEM_CONFIG;
  });

  const [states, setStates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_states`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ["Borno", "Adamawa", "Yobe"];
  });

  const [lgasByState, setLgasByState] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_lgas`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return LGA_BY_STATE;
  });

  const [wardsByLga, setWardsByLga] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_wards`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WARDS_BY_LGA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_categories`, JSON.stringify(activityCategories));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_units`, JSON.stringify(units));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_location_types`, JSON.stringify(locationTypes));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_pop_groups`, JSON.stringify(populationGroups));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_config`, JSON.stringify(reportingConfig));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_system_config`, JSON.stringify(systemConfig));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_states`, JSON.stringify(states));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_lgas`, JSON.stringify(lgasByState));
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}_wards`, JSON.stringify(wardsByLga));
    } catch {
      // ignore
    }
  }, [activityCategories, units, locationTypes, populationGroups, reportingConfig, systemConfig, states, lgasByState, wardsByLga]);

  const updateSystemConfig = (cfg: Partial<SystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...cfg }));
  };

  const exportSettingsJson = () => {
    const payload = {
      systemConfig,
      reportingConfig,
      activityCategories,
      units,
      locationTypes,
      populationGroups,
      states,
      lgasByState,
      wardsByLga,
      exportedAt: new Date().toISOString(),
      version: "2.0.0",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WASH_Sector_Configuration_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAllSettingsToDefault = () => {
    setSystemConfig(DEFAULT_SYSTEM_CONFIG);
    setReportingConfig({
      activeCycle: "2026-08",
      deadlineDate: "2026-09-12",
      isFreezeActive: false,
      notes: "August 2026 monthly reporting round for Borno, Adamawa, and Yobe states.",
    });
    setActivityCategories(ACTIVITY_CATEGORIES);
    setUnits(UNITS);
    setLocationTypes(LOCATION_TYPES);
    setPopulationGroups(POPULATION_GROUPS);
    setStates(["Borno", "Adamawa", "Yobe"]);
    setLgasByState(LGA_BY_STATE);
    setWardsByLga(INITIAL_WARDS_BY_LGA);
  };

  const addCategory = (category: string) => {
    if (!category.trim()) return;
    setActivityCategories((prev) => {
      if (prev.some((c) => c.category.toLowerCase() === category.toLowerCase())) return prev;
      return [...prev, { category: category.trim(), activities: [] }];
    });
  };

  const addActivity = (category: string, activity: string) => {
    if (!activity.trim()) return;
    setActivityCategories((prev) =>
      prev.map((c) => {
        if (c.category.toLowerCase() === category.toLowerCase()) {
          if (c.activities.some((a) => a.toLowerCase() === activity.toLowerCase())) return c;
          return { ...c, activities: [...c.activities, activity.trim()] };
        }
        return c;
      })
    );
  };

  const removeActivity = (category: string, activity: string) => {
    setActivityCategories((prev) =>
      prev.map((c) => {
        if (c.category.toLowerCase() === category.toLowerCase()) {
          return { ...c, activities: c.activities.filter((a) => a !== activity) };
        }
        return c;
      })
    );
  };

  const addUnit = (unit: string) => {
    if (!unit.trim()) return;
    setUnits((prev) => {
      if (prev.some((u) => u.toLowerCase() === unit.toLowerCase())) return prev;
      return [...prev, unit.trim()];
    });
  };

  const removeUnit = (unit: string) => {
    setUnits((prev) => prev.filter((u) => u !== unit));
  };

  const addLocationType = (locType: string) => {
    if (!locType.trim()) return;
    setLocationTypes((prev) => {
      if (prev.some((l) => l.toLowerCase() === locType.toLowerCase())) return prev;
      return [...prev, locType.trim()];
    });
  };

  const removeLocationType = (locType: string) => {
    setLocationTypes((prev) => prev.filter((l) => l !== locType));
  };

  const addPopulationGroup = (group: string) => {
    if (!group.trim()) return;
    setPopulationGroups((prev) => {
      if (prev.some((g) => g.toLowerCase() === group.toLowerCase())) return prev;
      return [...prev, group.trim()];
    });
  };

  const removePopulationGroup = (group: string) => {
    setPopulationGroups((prev) => prev.filter((g) => g !== group));
  };

  // Location Hierarchy Handlers
  const addState = (stateName: string) => {
    const trimmed = stateName.trim();
    if (!trimmed) return;
    if (states.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setStates((prev) => [...prev, trimmed]);
    setLgasByState((prev) => ({ ...prev, [trimmed]: [] }));
  };

  const removeState = (stateName: string) => {
    setStates((prev) => prev.filter((s) => s.toLowerCase() !== stateName.toLowerCase()));
  };

  const getLgasForState = (stateName: string): string[] => {
    // Check direct key or case-insensitive match
    if (lgasByState[stateName]) return lgasByState[stateName];
    const match = Object.keys(lgasByState).find((k) => k.toLowerCase() === stateName.toLowerCase());
    return match ? lgasByState[match] : [];
  };

  const addLga = (stateName: string, lgaName: string) => {
    const trimmed = lgaName.trim();
    if (!trimmed) return;
    setLgasByState((prev) => {
      // Find matching state key
      const key = Object.keys(prev).find((k) => k.toLowerCase() === stateName.toLowerCase()) || stateName;
      const existing = prev[key] || [];
      if (existing.some((l) => l.toLowerCase() === trimmed.toLowerCase())) return prev;
      return {
        ...prev,
        [key]: [...existing, trimmed],
      };
    });
  };

  const removeLga = (stateName: string, lgaName: string) => {
    setLgasByState((prev) => {
      const key = Object.keys(prev).find((k) => k.toLowerCase() === stateName.toLowerCase()) || stateName;
      return {
        ...prev,
        [key]: (prev[key] || []).filter((l) => l.toLowerCase() !== lgaName.toLowerCase()),
      };
    });
  };

  const getWardsForLga = (stateName: string, lgaName: string): string[] => {
    const compositeKey = `${stateName}_${lgaName}`;
    if (wardsByLga[compositeKey] && wardsByLga[compositeKey].length > 0) {
      return wardsByLga[compositeKey];
    }
    // Try simple lgaName key
    if (wardsByLga[lgaName] && wardsByLga[lgaName].length > 0) {
      return wardsByLga[lgaName];
    }
    // Case-insensitive match on lgaName
    const matchKey = Object.keys(wardsByLga).find((k) => k.toLowerCase() === lgaName.toLowerCase());
    if (matchKey && wardsByLga[matchKey].length > 0) {
      return wardsByLga[matchKey];
    }
    // Standard baseline wards for LGAs without custom ward configuration
    return ["Central Ward", "North Ward", "South Ward", "East Ward", "West Ward"];
  };

  const addWard = (stateName: string, lgaName: string, wardName: string) => {
    const trimmed = wardName.trim();
    if (!trimmed) return;
    const compositeKey = `${stateName}_${lgaName}`;
    setWardsByLga((prev) => {
      const existing = prev[compositeKey] || prev[lgaName] || [];
      if (existing.some((w) => w.toLowerCase() === trimmed.toLowerCase())) return prev;
      const updated = [...existing, trimmed];
      return {
        ...prev,
        [compositeKey]: updated,
        [lgaName]: updated,
      };
    });
  };

  const removeWard = (stateName: string, lgaName: string, wardName: string) => {
    const compositeKey = `${stateName}_${lgaName}`;
    setWardsByLga((prev) => {
      const existing = prev[compositeKey] || prev[lgaName] || [];
      const updated = existing.filter((w) => w.toLowerCase() !== wardName.toLowerCase());
      return {
        ...prev,
        [compositeKey]: updated,
        [lgaName]: updated,
      };
    });
  };

  const updateReportingConfig = (config: Partial<ReportingConfig>) => {
    setReportingConfig((prev) => ({ ...prev, ...config }));
  };

  const totalReports = reports.length;
  const totalBeneficiaries = reports.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const totalPartners = new Set(reports.map((r) => r.orgName.trim()).filter(Boolean)).size;
  const totalLgas = new Set(reports.filter((r) => r.lga).map((r) => `${r.state}|${r.lga}`)).size;

  return (
    <WashDataContext.Provider
      value={{
        reports,
        addReport,
        deleteReport,
        exportCsv,
        resetToSampleData,
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
        stats: {
          totalReports,
          totalBeneficiaries,
          totalPartners,
          totalLgas,
        },
      }}
    >
      {children}
    </WashDataContext.Provider>
  );
};

export const useWashData = (): WashDataContextType => {
  const context = useContext(WashDataContext);
  if (!context) {
    throw new Error("useWashData must be used within a WashDataProvider");
  }
  return context;
};
