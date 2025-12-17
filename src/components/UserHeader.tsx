import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ariesLogo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../config";

export default function UserHeader() {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("user_id"); // or admin_id based on your app

      if (!userId) {
        navigate("/logout");
        return;
      }

      const res = await axios.post(`${apiUrl}/user/logout`, {
        user_id: userId,
      });

      if (res.data?.success) {
        // ✅ Clear auth data
        localStorage.removeItem("artoken");
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");

        toast.success("Logged out successfully");

        // ✅ Redirect to login
        navigate("/logout");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        
  
        if (
          profileRef.current &&
          !profileRef.current.contains(e.target as Node)
        ) {
          setOpenProfile(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* LEFT SIDE LOGO */}
      <Link to="/users">
        <img src={ariesLogo} className="h-12 cursor-pointer" />
      </Link>

      <div className="flex items-center gap-4">
        {/* TOP NAV MENU */}
        <nav className="flex gap-6 text-sm font-semibold">
          <Link className="hover:text-orange-600" to="/users">
            Dashboard
          </Link>

          <Link className="hover:text-orange-600" to="/users/my-expo">
            My Expo
          </Link>

        </nav>

        {/* LOGOUT BUTTON */}
        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
          >
            👤
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-48 py-2 z-50">
              <Link
                to="/users/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpenProfile(false)}
              >
                Profile
              </Link>

              {/* <Link
                to="/users/edit-profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpenProfile(false)}
              >
                Change Password
              </Link> */}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
