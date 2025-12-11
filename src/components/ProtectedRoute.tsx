import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    // const { token } = useAuth();           // ⬅️ get token from context
    // const location = useLocation();

    // // If not logged in, redirect to login page
    // if (!token) {
    //     return (
    //         <Navigate
    //             to="/"
    //             replace
    //             state={{ from: location }}      // optional: so you can go back after login
    //         />
    //     );
    // }

    // If logged in, render the protected children
    return <>{children}</>;
}
