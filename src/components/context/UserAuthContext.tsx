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
