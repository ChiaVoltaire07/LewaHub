import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { adminApi } from "../services/adminApi";
import type { AdminUser, LoginCredentials } from "../types";

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const response = await adminApi.getMe();
    if (response.ok && response.data.admin) {
      setAdmin(response.data.admin);
    } else {
      setAdmin(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await adminApi.login(credentials);

    if (!response.ok) {
      return { success: false, error: response.error };
    }

    if (response.data?.admin) {
      setAdmin(response.data.admin);
      return { success: true };
    }

    return { success: false, error: "Login failed" };
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: admin !== null,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
