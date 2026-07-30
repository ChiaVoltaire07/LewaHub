import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { apiRequest } from "../lib/api";

interface Admin {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  login: (email: string, password: string, keepSignedIn?: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = sessionStorage.getItem("admin_token");
  const storedAdmin = stored ? (() => {
    try {
      const payload = JSON.parse(atob(stored.split(".")[1]));
      return { id: payload.sub || payload.id || "", email: payload.email || "", name: payload.name };
    } catch {
      return null;
    }
  })() : null;

  const [token, setToken] = useState<string | null>(stored);
  const [admin, setAdmin] = useState<Admin | null>(storedAdmin);

  const login = useCallback(async (email: string, password: string, keepSignedIn = false) => {
    const res = await apiRequest<{ token: string; admin: Admin }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setAdmin(res.admin);
    if (keepSignedIn) {
      localStorage.setItem("admin_token", res.token);
    } else {
      sessionStorage.setItem("admin_token", res.token);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token");
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}