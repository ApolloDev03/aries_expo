import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();

    // ✅ get from localStorage
    const adminId = localStorage.getItem("admin_id");
    const token = localStorage.getItem("artoken"); // (optional but recommended)

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
