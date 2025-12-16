import { Link } from "react-router-dom";
// import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import ariesLogo from "../assets/logo.png";
import { useState } from "react";

export default function UserHeader() {
//   const [openMaster, setOpenMaster] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
//   const [openOthers, setOpenOthers] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // logout();
    navigate("/logout");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* LEFT SIDE LOGO */}
      <Link to="/admin">
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
        <div className="relative">
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

              <Link
                to="/admin/edit-profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpenProfile(false)}
              >
                Change Password
              </Link>

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
