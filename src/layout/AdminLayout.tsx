import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100">
      <Header />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
