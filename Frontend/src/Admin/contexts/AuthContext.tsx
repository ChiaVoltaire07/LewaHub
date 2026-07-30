import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { adminLogin } from "../lib/api";

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
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check sessionStorage and localStorage for existing token
  const stored = sessionStorage.getItem("admin_token") || localStorage.getItem("admin_token");
  const storedAdmin = stored
    ? (() => {
        try {
          const payload = JSON.parse(atob(stored.split(".")[1]));
          return {
            id: payload.sub || payload.id || "",
            email: payload.email || "",
            name: payload.name,
          };
        } catch {
          return null;
        }
      })()
    : null;

  const [token, setToken] = useState<string | null>(stored);
  const [admin, setAdmin] = useState<Admin | null>(storedAdmin);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string, keepSignedIn = false) => {
      try {
        setError(null);
        const response = await adminLogin(email, password);

        if (response.error) {
          setError(response.error);
          throw new Error(response.error);
        }

        const { token: newToken, admin: adminData } = response;
        setToken(newToken);
        setAdmin(adminData);

        // Store token based on keepSignedIn preference
        if (keepSignedIn) {
          localStorage.setItem("admin_token", newToken);
          sessionStorage.removeItem("admin_token");
        } else {
          sessionStorage.setItem("admin_token", newToken);
          localStorage.removeItem("admin_token");
        }
      } catch (err: any) {
        const errorMsg = err.message || "Login failed";
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    setError(null);
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token");
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}