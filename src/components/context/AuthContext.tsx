// import  {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
// } from "react";
// import type { ReactNode } from "react";

// // 👉 Define your user type (you can modify this later)
// export interface User {
//   id?: number;
//   email?: string;
//   name?: string;
//   [key: string]: any;
// }

// // 👉 What AuthContext will store
// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (userData: User, authToken: string) => void;
//   logout: () => void;
// }

// // Create AuthContext
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Props for provider
// interface AuthProviderProps {
//   children: ReactNode;
// }

// // Provider Component
// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("artoken");

//     if (storedUser && storedToken) {
//       try {
//         setUser(JSON.parse(storedUser));
//         setToken(storedToken);
//       } catch (error) {
//         console.error("Invalid stored user JSON:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   const login = (userData: User, authToken: string) => {
//     setUser(userData);
//     setToken(authToken);

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("artoken", authToken);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);

//     localStorage.removeItem("user");
//     localStorage.removeItem("artoken");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use context
// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }
//   return ctx;
// };

// export { AuthContext };


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
