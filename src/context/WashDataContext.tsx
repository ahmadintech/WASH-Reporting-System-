import React, { createContext, useContext, useState, useEffect } from "react";
import { WashReport, INITIAL_WASH_REPORTS } from "../types/wash";

interface WashDataContextType {
  reports: WashReport[];
  addReport: (report: Omit<WashReport, "id" | "submittedAt">) => WashReport;
  deleteReport: (id: string) => boolean;
  exportCsv: (customReports?: WashReport[]) => void;
  resetToSampleData: () => void;
  stats: {
    totalReports: number;
    totalBeneficiaries: number;
    totalPartners: number;
    totalLgas: number;
  };
}

const STORAGE_KEY = "wash-5w-reports";

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
