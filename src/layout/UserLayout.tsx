import { Outlet } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

export default function UserLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100">
      <UserHeader />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
      <UserFooter />
    </div>
  );
}
