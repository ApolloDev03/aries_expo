import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Header />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
