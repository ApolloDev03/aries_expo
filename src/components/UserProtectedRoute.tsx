import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function UserProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();

    // ✅ get from localStorage
    const adminId = localStorage.getItem("User_Id");
    const token = localStorage.getItem("user_token"); // (optional but recommended)

    // ✅ if not logged in -> redirect
    if (!adminId || !token) {
        return (
            <Navigate
                to="/"          // change if your login route is "/"
                replace
                state={{ from: location }}
            />
        );
    }

    return <>{children}</>;
}
