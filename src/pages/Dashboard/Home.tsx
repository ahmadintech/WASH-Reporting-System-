import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import CoordinatorDashboard from "./CoordinatorDashboard";
import PartnerDashboard from "./PartnerDashboard";
import CoverageDashboard from "../Wash/CoverageDashboard";

export default function Home() {
  const { currentUser, isAuthenticated } = useAuth();
  const role = currentUser?.role || "partner";

  // Tab switch: Management Console vs 5W Coverage Matrix
  const [activeTab, setActiveTab] = useState<"management" | "coverage">("management");

  return (
    <>
      <PageMeta
        title="WASH Response Coverage Dashboard | North East Nigeria"
        description="Sector activities, response coverage and coordination monitoring for Borno, Adamawa and Yobe."
      />

      {/* Role specific quick-switcher for Admin / Coordinator / Partner */}
      {isAuthenticated && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setActiveTab("coverage")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === "coverage"
                  ? "bg-teal-800 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              5W Coverage Dashboard
            </button>
            <button
              onClick={() => setActiveTab("management")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === "management"
                  ? "bg-teal-800 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              {role === "admin"
                ? "Admin Governance Console"
                : role === "coordinator"
                ? "Coordination Desk Console"
                : "Partner Console"}
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Active view:{" "}
            <span className="font-semibold text-teal-800 dark:text-teal-300">
              {activeTab === "coverage"
                ? "5W Response Monitoring Matrix"
                : role === "admin"
                ? "Administration"
                : role === "coordinator"
                ? "Coordination"
                : "Partner Reporting"}
            </span>
          </div>
        </div>
      )}

      {/* Main View: If management tab active, show admin/coordinator/partner console; otherwise show full Coverage Dashboard */}
      {activeTab === "management" && isAuthenticated ? (
        role === "admin" ? (
          <AdminDashboard />
        ) : role === "coordinator" ? (
          <CoordinatorDashboard />
        ) : (
          <PartnerDashboard />
        )
      ) : (
        <CoverageDashboard />
      )}
    </>
  );
}
