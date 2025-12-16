// import {
//     createContext,
//     useContext,
//     useState,
//     useEffect,
// } from "react";
// import type { ReactNode } from "react";

// // 👉 Define your user type (you can modify this later)
// export interface User {
//     id?: number;
//     email?: string;
//     name?: string;
//     [key: string]: any;
// }

// // 👉 What AuthContext will store
// interface AuthContextType {
//     user: User | null;
//     token: string | null;
//     login: (userData: User, authToken: string) => void;
//     logout: () => void;
// }

// // Create AuthContext
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Props for provider
// interface AuthProviderProps {
//     children: ReactNode;
// }

// // Provider Component
// export const UserAuthProvider = ({ children }: AuthProviderProps) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [token, setToken] = useState<string | null>(null);

//     useEffect(() => {
//         if (typeof window === "undefined") return;

//         const storedUser = localStorage.getItem("User_Id");
//         const storedToken = localStorage.getItem("user_token");

//         if (storedUser && storedToken) {
//             try {
//                 setUser(JSON.parse(storedUser));
//                 setToken(storedToken);
//             } catch (error) {
//                 console.error("Invalid stored user JSON:", error);
//                 localStorage.removeItem("User_Id");
//             }
//         }
//     }, []);

//     const login = (userData: User, authToken: string) => {
//         setUser(userData);
//         setToken(authToken);
//         console.log(authToken, "authtoken")
//         localStorage.setItem("user", JSON.stringify(userData));
//         localStorage.setItem("user_token", authToken);
//     };

//     const logout = () => {
//         setUser(null);
//         setToken(null);

//         localStorage.removeItem("User_Id");
//         localStorage.removeItem("user_token");
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Hook to use context
// export const useAuth = (): AuthContextType => {
//     const ctx = useContext(AuthContext);
//     if (!ctx) {
//         throw new Error("useAuth must be used inside AuthProvider");
//     }
//     return ctx;
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
export interface AppUser {
    id?: number;
    email?: string;
    name?: string;
    mobile?: string;
    [key: string]: any;
}

interface UserAuthContextType {
    user: AppUser | null;
    token: string | null;
    userLogin: (userData: AppUser, token: string) => void;
    userLogout: () => void;
}

// ---------------- Context ----------------
const UserAuthContext = createContext<UserAuthContextType | undefined>(
    undefined
);

// ---------------- Provider ----------------
export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("usertoken");

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("usertoken");
            }
        }
    }, []);

    const userLogin = (userData: AppUser, token: string) => {
        setUser(userData);
        setToken(token);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("usertoken", token);
    };

    const userLogout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("usertoken");
    };

    return (
        <UserAuthContext.Provider
            value={{ user, token, userLogin, userLogout }}
        >
            {children}
        </UserAuthContext.Provider>
    );
};

// ---------------- Hook ----------------
export const useUserAuth = (): UserAuthContextType => {
    const ctx = useContext(UserAuthContext);
    if (!ctx) {
        throw new Error("useUserAuth must be used inside UserAuthProvider");
    }
    return ctx;
};
