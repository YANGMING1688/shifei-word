import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserAccount {
  emailOrPhone: string;
  username: string;
  passwordHash: string; // Stored simple hash for security
  computeCredits: number;
  membership: "none" | "sprint" | "monthly" | "advisor";
  createdAt: string;
  activeContainerId?: string;
}

interface AuthContextProps {
  user: UserAccount | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "register";
  setAuthModalTab: (tab: "login" | "register") => void;
  register: (emailOrPhone: string, username: string, passwordHash: string) => Promise<{ success: boolean; error?: string }>;
  login: (emailOrPhone: string, passwordHash: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserCredits: (credits: number) => void;
  updateUserMembership: (membership: "none" | "sprint" | "monthly" | "advisor") => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Simple hash helper to avoid storing plain passwords (helps secure demo accounts in localStorage)
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  // Load current session from localStorage on startup
  useEffect(() => {
    const activeSession = localStorage.getItem("opc_active_user");
    if (activeSession) {
      try {
        const key = JSON.parse(activeSession);
        const accountsJson = localStorage.getItem("opc_user_accounts");
        if (accountsJson) {
          const accounts: Record<string, UserAccount> = JSON.parse(accountsJson);
          if (accounts[key]) {
            setUser(accounts[key]);
          }
        }
      } catch (e) {
        localStorage.removeItem("opc_active_user");
      }
    }
  }, []);

  const register = async (emailOrPhone: string, username: string, passwordHash: string) => {
    // Artificial latency for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sanitizedKey = emailOrPhone.toLowerCase().trim();
    if (!sanitizedKey || !username || !passwordHash) {
      return { success: false, error: "empty_fields" };
    }

    const accountsJson = localStorage.getItem("opc_user_accounts") || "{}";
    let accounts: Record<string, UserAccount> = {};
    try {
      accounts = JSON.parse(accountsJson);
    } catch (e) {
      accounts = {};
    }

    if (accounts[sanitizedKey]) {
      return { success: false, error: "user_exists" };
    }

    // New user initial profile
    const newUser: UserAccount = {
      emailOrPhone: sanitizedKey,
      username: username.trim(),
      passwordHash: simpleHash(passwordHash),
      computeCredits: 5000, // Free tier initial credits
      membership: "none",
      createdAt: new Date().toISOString(),
      activeContainerId: "con_" + Math.random().toString(36).substring(2, 10),
    };

    accounts[sanitizedKey] = newUser;
    localStorage.setItem("opc_user_accounts", JSON.stringify(accounts));
    localStorage.setItem("opc_active_user", JSON.stringify(sanitizedKey));
    setUser(newUser);

    return { success: true };
  };

  const login = async (emailOrPhone: string, passwordHash: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const sanitizedKey = emailOrPhone.toLowerCase().trim();
    if (!sanitizedKey || !passwordHash) {
      return { success: false, error: "empty_fields" };
    }

    const accountsJson = localStorage.getItem("opc_user_accounts");
    if (!accountsJson) {
      return { success: false, error: "invalid_credentials" };
    }

    try {
      const accounts: Record<string, UserAccount> = JSON.parse(accountsJson);
      const targetUser = accounts[sanitizedKey];
      if (!targetUser || targetUser.passwordHash !== simpleHash(passwordHash)) {
        return { success: false, error: "invalid_credentials" };
      }

      localStorage.setItem("opc_active_user", JSON.stringify(sanitizedKey));
      setUser(targetUser);
      return { success: true };
    } catch (e) {
      return { success: false, error: "system_error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("opc_active_user");
    setUser(null);
  };

  const updateUserCredits = (credits: number) => {
    if (!user) return;
    const updated = { ...user, computeCredits: credits };
    setUser(updated);

    const accountsJson = localStorage.getItem("opc_user_accounts");
    if (accountsJson) {
      try {
        const accounts: Record<string, UserAccount> = JSON.parse(accountsJson);
        accounts[user.emailOrPhone] = updated;
        localStorage.setItem("opc_user_accounts", JSON.stringify(accounts));
      } catch (e) {
        console.error("Failed to update user credits in localStorage", e);
      }
    }
  };

  const updateUserMembership = (membership: "none" | "sprint" | "monthly" | "advisor") => {
    if (!user) return;
    
    // Grant extra credits based on membership
    let extraCredits = 0;
    if (membership === "sprint") extraCredits = 15000;
    if (membership === "monthly") extraCredits = 50000;
    if (membership === "advisor") extraCredits = 150000;

    const updated: UserAccount = { 
      ...user, 
      membership, 
      computeCredits: user.computeCredits + extraCredits 
    };
    setUser(updated);

    const accountsJson = localStorage.getItem("opc_user_accounts");
    if (accountsJson) {
      try {
        const accounts: Record<string, UserAccount> = JSON.parse(accountsJson);
        accounts[user.emailOrPhone] = updated;
        localStorage.setItem("opc_user_accounts", JSON.stringify(accounts));
      } catch (e) {
        console.error("Failed to update user membership in localStorage", e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        register,
        login,
        logout,
        updateUserCredits,
        updateUserMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
