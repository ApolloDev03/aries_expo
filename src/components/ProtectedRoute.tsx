// import { Navigate } from "react-router-dom";
// import { getToken } from "../utils/auth";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    //   return getToken() ? <>{children}</> : <Navigate to="/" replace />;
    return <>{children}</>;
}
