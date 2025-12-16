import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

// ---------------- Types ----------------
export interface AdminUser {
  id?: number;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  adminLogin: (userData: AdminUser, token: string) => void;
  adminLogout: () => void;
}

// ---------------- Context ----------------
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

// ---------------- Provider ----------------
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    const storedToken = localStorage.getItem("artoken");

    if (storedUser && storedToken) {
      try {
        setAdmin(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("artoken");
      }
    }
  }, []);

  const adminLogin = (userData: AdminUser, token: string) => {
    setAdmin(userData);
    setToken(token);

    localStorage.setItem("admin_user", JSON.stringify(userData));
    localStorage.setItem("artoken", token);
  };

  const adminLogout = () => {
    setAdmin(null);
    setToken(null);

    localStorage.removeItem("admin_user");
    localStorage.removeItem("artoken");
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// ---------------- Hook ----------------
export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
};
