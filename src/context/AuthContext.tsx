import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile } from "../types/wash";

interface AuthContextType {
  currentUser: UserProfile;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  admin: {
    id: "usr_admin",
    name: "Engr. Ahmed Lawan",
    email: "admin@washsector-ne.org",
    role: "admin",
    roleTitle: "Sector Administrator",
    organization: "WASH Sector North East Nigeria",
    organizationType: "Government / UN Co-Lead",
    state: "Borno (Regional Hub)",
    avatar: "/images/user/owner.jpg"
  },
  coordinator: {
    id: "usr_coordinator",
    name: "Fatima Bello",
    email: "coordinator@washsector-ne.org",
    role: "coordinator",
    roleTitle: "State Coordinator",
    organization: "WASH Cluster Coordination Desk",
    organizationType: "UN / Coordination Desk",
    state: "Borno · Adamawa · Yobe",
    avatar: "/images/user/owner.jpg"
  },
  partner: {
    id: "usr_partner",
    name: "Ibrahim Mustapha",
    email: "partner@solidarites.org",
    role: "partner",
    roleTitle: "Implementing Partner",
    organization: "Solidarités International",
    organizationType: "International NGO",
    state: "Borno",
    avatar: "/images/user/owner.jpg"
  }
};

const AUTH_STORAGE_KEY = "wash-auth-user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return PRESET_USERS.coordinator; // default to coordinator
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("wash-auth-token") !== "false";
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

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("wash-auth-token");
  };

  const switchRole = (role: UserRole) => {
    const user = PRESET_USERS[role];
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("wash-auth-token", "true");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        isAuthenticated,
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
