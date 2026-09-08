import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAuth, ManagedUser, UserPermissions } from "../../context/AuthContext";
import { useWashData } from "../../context/WashDataContext";
import { UserRole } from "../../types/wash";

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, currentUser } = useAuth();
  const { states, getLgasForState } = useWashData();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [toast, setToast] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // Helper to sanitize state
  const sanitizeState = (st?: string): "Borno" | "Adamawa" | "Yobe" => {
    if (!st) return "Borno";
    if (st.includes("Adamawa")) return "Adamawa";
    if (st.includes("Yobe")) return "Yobe";
    return "Borno";
  };

  const isCoordinator = currentUser?.role === "coordinator";
  const userScopeState = sanitizeState(currentUser?.state);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newOrgType, setNewOrgType] = useState("International NGO");
  const [newState, setNewState] = useState<string>(() => userScopeState);
  const [newLga, setNewLga] = useState(() => getLgasForState(userScopeState)[0] || "Maiduguri");
  const [newRole, setNewRole] = useState<UserRole>("partner");

  // Edit user state
  const [editRole, setEditRole] = useState<UserRole>("partner");
  const [editStatus, setEditStatus] = useState<"Active" | "Suspended">("Active");
  const [editState, setEditState] = useState("Borno");
  const [editLga, setEditLga] = useState("Maiduguri");
  const [editPermissions, setEditPermissions] = useState<UserPermissions>({
    canApproveReports: false,
    canExportMasterData: false,
    canConfigureSettings: false,
    canManageUsers: false,
    canSubmit5W: true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAddModal = () => {
    setNewState(userScopeState);
    setNewLga(getLgasForState(userScopeState)[0] || "");
    setNewRole("partner");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditStatus(user.status);
    const userState = user.state || states[0] || "Borno";
    setEditState(userState);
    setEditLga(user.lga || getLgasForState(userState)[0] || "");
    setEditPermissions({ ...user.permissions });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      role: editRole,
      status: editStatus,
      state: editState,
      lga: editLga,
      permissions: editPermissions,
      roleTitle:
        editRole === "admin"
          ? "Sector Administrator"
          : editRole === "coordinator"
          ? "State Coordinator"
          : "Implementing Partner",
    });
    showToast(`User ${editingUser.name}'s role, location, and permissions updated.`);
    setEditingUser(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const defaultPerms: UserPermissions = {
      canApproveReports: newRole === "admin" || newRole === "coordinator",
      canExportMasterData: newRole === "admin" || newRole === "coordinator",
      canConfigureSettings: newRole === "admin",
      canManageUsers: newRole === "admin",
      canSubmit5W: newRole === "partner",
    };

    addUser({
      name: newName.trim(),
      email: newEmail.trim(),
      organization: newOrg.trim() || "Independent WASH Actor",
      organizationType: newOrgType,
      state: newState,
      lga: newLga,
      role: newRole,
      roleTitle:
        newRole === "admin"
          ? "Sector Administrator"
          : newRole === "coordinator"
          ? "State Coordinator"
          : "Implementing Partner",
      status: "Active",
      permissions: defaultPerms,
    });

    showToast(`Registered new user ${newName} (${newRole}) for ${newState} / ${newLga}.`);
    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewOrg("");
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "All" && u.role !== roleFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.organization.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const coordCount = users.filter((u) => u.role === "coordinator").length;
  const partnerCount = users.filter((u) => u.role === "partner").length;

  return (
    <>
      <PageMeta
        title="User & Role Management | WASH Sector NE Nigeria"
        description="Administer sector users, assign system roles, and configure security permissions."
      />
      <PageBreadcrumb pageTitle="User & Role Management" />

      {toast && (
        <div className="fixed top-20 right-6 z-99999 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Accounts</span>
            <h3 className="mt-2 text-2xl font-black text-gray-900 dark:text-white font-mono">
              {users.length}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Active platform identities</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Administrators</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                Full Auth
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {adminCount}
            </h3>
            <p className="mt-1 text-xs text-gray-400">System governance & audit</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Coordinators</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                Cluster
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
              {coordCount}
            </h3>
            <p className="mt-1 text-xs text-gray-400">BAY state coordination</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Implementing Partners</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                5W Submitters
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {partnerCount}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Field reporting organizations</p>
          </div>
        </div>

        {/* User Management Table Card */}
        <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Accredited User Accounts
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Assign roles, modify permissions, or deactivate accounts.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold shadow-sm transition-all shrink-0"
            >
              <span>+ Register New User</span>
            </button>
          </div>

          {/* Filters and search */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-850">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, organization..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                {["All", "admin", "coordinator", "partner"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      roleFilter === r
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">User & Identity</th>
                  <th className="py-3.5 px-4 font-semibold">Organization</th>
                  <th className="py-3.5 px-4 font-semibold">State Hub</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Assigned Role</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Permissions</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                              u.role === "admin"
                                ? "bg-rose-600"
                                : u.role === "coordinator"
                                ? "bg-brand-600"
                                : "bg-emerald-600"
                            }`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-gray-400 block">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{u.organization}</span>
                        <span className="text-[10px] text-gray-400 block">{u.organizationType}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 block text-xs">
                          {u.state || "Borno"}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-medium">
                          LGA: {u.lga || "All LGAs"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                              : u.role === "coordinator"
                              ? "bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.permissions?.canApproveReports && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                              Approve
                            </span>
                          )}
                          {u.permissions?.canExportMasterData && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              Export
                            </span>
                          )}
                          {u.permissions?.canConfigureSettings && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                              Settings
                            </span>
                          )}
                          {u.permissions?.canManageUsers && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                              Users
                            </span>
                          )}
                          {u.permissions?.canSubmit5W && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              Submit 5W
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
                          >
                            Edit Role
                          </button>
                          {!isCurrent && (
                            <>
                              <button
                                onClick={() => {
                                  toggleUserStatus(u.id);
                                  showToast(`Status toggled for ${u.name}.`);
                                }}
                                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                {u.status === "Active" ? "Suspend" : "Activate"}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Permanently remove ${u.name}?`)) {
                                    deleteUser(u.id);
                                    showToast(`User ${u.name} removed.`);
                                  }
                                }}
                                className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Register New Platform User
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Add a new agency focal point, partner, coordinator, or sector administrator.
            </p>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Halima Usman"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@agency.org"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="partner">Partner (5W Submitter)</option>
                    {!isCoordinator && <option value="coordinator">Coordinator (Desk Lead)</option>}
                    {!isCoordinator && <option value="admin">Administrator (Full Access)</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="e.g. Mercy Corps"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Organization Type
                  </label>
                  <select
                    value={newOrgType}
                    onChange={(e) => setNewOrgType(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="International NGO">International NGO</option>
                    <option value="National NGO">National NGO</option>
                    <option value="UN Agency">UN Agency</option>
                    <option value="Government / State Actor">Government / State Actor</option>
                    <option value="Red Cross / Red Crescent">Red Cross / Red Crescent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Operational State
                  </label>
                  <select
                    value={newState}
                    onChange={(e) => {
                      const st = e.target.value;
                      setNewState(st);
                      const lgas = getLgasForState(st);
                      setNewLga(lgas[0] || "");
                    }}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Assigned LGA
                  </label>
                  <select
                    value={newLga}
                    onChange={(e) => setNewLga(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {getLgasForState(newState).map((lg) => (
                      <option key={lg} value={lg}>
                        {lg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role & Permissions Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Edit Role & Permissions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Managing permissions for <strong className="text-gray-900 dark:text-white">{editingUser.name}</strong> ({editingUser.email})
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Assign System Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => {
                    const r = e.target.value as UserRole;
                    setEditRole(r);
                    // Automatically adjust default permissions based on role
                    setEditPermissions({
                      canApproveReports: r === "admin" || r === "coordinator",
                      canExportMasterData: r === "admin" || r === "coordinator",
                      canConfigureSettings: r === "admin",
                      canManageUsers: r === "admin",
                      canSubmit5W: r === "partner",
                    });
                  }}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                >
                  <option value="admin">Administrator (Sector Lead & Audit)</option>
                  <option value="coordinator">Coordinator (Cluster Desk & Review)</option>
                  <option value="partner">Partner (Field Reporting Focal Point)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Operational State
                  </label>
                  <select
                    value={editState}
                    onChange={(e) => {
                      const st = e.target.value;
                      setEditState(st);
                      const lgas = getLgasForState(st);
                      setEditLga(lgas[0] || "");
                    }}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Assigned LGA
                  </label>
                  <select
                    value={editLga}
                    onChange={(e) => setEditLga(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {getLgasForState(editState).map((lg) => (
                      <option key={lg} value={lg}>
                        {lg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Granular Permissions
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canApproveReports}
                      onChange={(e) =>
                        setEditPermissions({ ...editPermissions, canApproveReports: e.target.checked })
                      }
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Verify & Approve 5W Reports</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canExportMasterData}
                      onChange={(e) =>
                        setEditPermissions({ ...editPermissions, canExportMasterData: e.target.checked })
                      }
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Export Full Sector Master Dataset</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canConfigureSettings}
                      onChange={(e) =>
                        setEditPermissions({ ...editPermissions, canConfigureSettings: e.target.checked })
                      }
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Access Sector Configuration & Parameters</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canManageUsers}
                      onChange={(e) =>
                        setEditPermissions({ ...editPermissions, canManageUsers: e.target.checked })
                      }
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Register Users & Assign System Roles</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPermissions.canSubmit5W}
                      onChange={(e) =>
                        setEditPermissions({ ...editPermissions, canSubmit5W: e.target.checked })
                      }
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Submit 5W Field Activity Reports</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
