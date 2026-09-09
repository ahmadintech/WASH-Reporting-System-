import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile } from "../types/wash";

export interface UserPermissions {
  canApproveReports: boolean;
  canExportMasterData: boolean;
  canConfigureSettings: boolean;
  canManageUsers: boolean;
  canSubmit5W: boolean;
}

export interface ManagedUser extends UserProfile {
  status: "Active" | "Suspended";
  permissions: UserPermissions;
  createdAt: string;
}

interface AuthContextType {
  currentUser: UserProfile;
  login: (email: string, role?: UserRole) => boolean;
  loginAsRole: (role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  users: ManagedUser[];
  addUser: (user: Omit<ManagedUser, "id" | "createdAt">) => ManagedUser;
  updateUser: (id: string, updates: Partial<ManagedUser>) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  admin: {
    id: "usr_admin",
    name: "WASH Admin",
    email: "admin@washsector-ne.org",
    role: "admin",
    roleTitle: "Sector Administrator",
    organization: "WASH Sector North East Nigeria",
    organizationType: "Government / UN Co-Lead",
    state: "Borno",
    lga: "Maiduguri",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Admin"
  },
  coordinator: {
    id: "usr_coordinator",
    name: "WASH State Coordinator",
    email: "coordinator@washsector-ne.org",
    role: "coordinator",
    roleTitle: "State Coordinator",
    organization: "WASH Cluster Coordination Desk",
    organizationType: "UN / Coordination Desk",
    state: "Borno",
    lga: "Maiduguri",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Coordinator"
  },
  partner: {
    id: "usr_partner",
    name: "WASH Partner",
    email: "partner@solidarites.org",
    role: "partner",
    roleTitle: "Implementing Partner",
    organization: "Solidarités International",
    organizationType: "International NGO",
    state: "Borno",
    lga: "Maiduguri",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Partner"
  }
};

export const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    ...PRESET_USERS.admin,
    status: "Active",
    createdAt: "2026-01-10",
    permissions: {
      canApproveReports: true,
      canExportMasterData: true,
      canConfigureSettings: true,
      canManageUsers: true,
      canSubmit5W: false,
    },
  },
  {
    ...PRESET_USERS.coordinator,
    status: "Active",
    createdAt: "2026-01-15",
    permissions: {
      canApproveReports: true,
      canExportMasterData: true,
      canConfigureSettings: false,
      canManageUsers: false,
      canSubmit5W: false,
    },
  },
  {
    ...PRESET_USERS.partner,
    status: "Active",
    createdAt: "2026-02-01",
    permissions: {
      canApproveReports: false,
      canExportMasterData: false,
      canConfigureSettings: false,
      canManageUsers: false,
      canSubmit5W: true,
    },
  },
  {
    id: "usr_unicef",
    name: "UNICEF Partner",
    email: "gadebayo@unicef.org",
    role: "partner",
    roleTitle: "WASH Emergency Specialist",
    organization: "UNICEF Nigeria",
    organizationType: "UN Agency",
    state: "Borno",
    lga: "Jere",
    status: "Active",
    createdAt: "2026-02-10",
    permissions: {
      canApproveReports: false,
      canExportMasterData: false,
      canConfigureSettings: false,
      canManageUsers: false,
      canSubmit5W: true,
    },
  },
  {
    id: "usr_acf",
    name: "ACF Partner",
    email: "tmansoor@actionagainsthunger.org",
    role: "partner",
    roleTitle: "Field Coordinator",
    organization: "Action Against Hunger (ACF)",
    organizationType: "International NGO",
    state: "Borno",
    lga: "Monguno",
    status: "Active",
    createdAt: "2026-02-14",
    permissions: {
      canApproveReports: false,
      canExportMasterData: false,
      canConfigureSettings: false,
      canManageUsers: false,
      canSubmit5W: true,
    },
  },
];

const AUTH_STORAGE_KEY = "wash-auth-user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role && (parsed.role === "admin" || parsed.role === "coordinator" || parsed.role === "partner")) {
          return { ...PRESET_USERS[parsed.role as UserRole], ...parsed };
        }
      }
    } catch {
      // ignore
    }
    return PRESET_USERS.coordinator; // default to coordinator
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("wash-auth-token") === "true";
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = (email: string, explicitRole?: UserRole): boolean => {
    let chosenRole: UserRole = explicitRole || 'partner';
    const lower = email.toLowerCase();
    if (!explicitRole) {
      if (lower.includes("admin")) chosenRole = "admin";
      else if (lower.includes("coord") || lower.includes("lead")) chosenRole = "coordinator";
      else chosenRole = "partner";
    }

    const base = PRESET_USERS[chosenRole];
    const user: UserProfile = {
      ...base,
      email: email || base.email,
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("wash-auth-token", "true");
    return true;
  };

  const loginAsRole = (role: UserRole): boolean => {
    const user = PRESET_USERS[role];
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("wash-auth-token", "true");
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("wash-auth-token");
  };

  const switchRole = (role: UserRole) => {
    const user = PRESET_USERS[role];
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("wash-auth-token", "true");
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const USERS_STORAGE_KEY = "wash-managed-users";

  const [users, setUsers] = useState<ManagedUser[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MANAGED_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  const addUser = (userData: Omit<ManagedUser, "id" | "createdAt">): ManagedUser => {
    const newUser: ManagedUser = {
      ...userData,
      id: "usr_" + Date.now().toString(36),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<ManagedUser>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          // If current logged-in user is updated, update currentUser as well
          if (currentUser.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, status: u.status === "Active" ? "Suspended" : "Active" };
        }
        return u;
      })
    );
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsRole,
        logout,
        switchRole,
        isAuthenticated,
        users,
        addUser,
        updateUser,
        updateCurrentUser,
        deleteUser,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
