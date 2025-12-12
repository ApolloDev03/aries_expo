// import { Link } from "react-router-dom";
// // import { logout } from "../utils/auth";
// import { useNavigate } from "react-router-dom";
// import ariesLogo from "../assets/logo.png";
// import { useState } from "react";

// export default function Header() {
//   const [openMaster, setOpenMaster] = useState(false);
//   const [openProfile, setOpenProfile] = useState(false);
//   const [openOthers, setOpenOthers] = useState(false);

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // logout();
//     navigate("/logout");
//   };

//   return (
//     <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
//       {/* LEFT SIDE LOGO */}
//       <Link to="/admin">
//         <img src={ariesLogo} className="h-12 cursor-pointer" />
//       </Link>

//       <div className="flex items-center gap-4">
//         {/* TOP NAV MENU */}
//         <nav className="flex gap-6 text-sm font-semibold">
//           <Link className="hover:text-orange-600" to="/admin">
//             Dashboard
//           </Link>

//           {/* Master Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenMaster(!openMaster)}
//               className="hover:text-orange-600 flex items-center gap-1"
//             >
//               Master ▼
//             </button>

//             {openMaster && (
//               <div className="absolute top-7 left-0 bg-white shadow-lg border rounded-md w-40 py-2 z-50">
//                 <Link
//                   to="/admin/city"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenMaster(false)}
//                 >
//                   City
//                 </Link>

//                 <Link
//                   to="/admin/industry"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenMaster(false)}
//                 >
//                   Industry
//                 </Link>

//                 <Link
//                   to="/admin/expo"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenMaster(false)}
//                 >
//                   Expo
//                 </Link>

//                 <Link
//                   to="/admin/users"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenMaster(false)}
//                 >
//                   User
//                 </Link>

//                 <Link
//                   to="/admin/department"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenMaster(false)}
//                 >
//                   Department
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Others Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenOthers(!openOthers)}
//               className="hover:text-orange-600 flex items-center gap-1"
//             >
//               Others ▼
//             </button>

//             {openOthers && (
//               <div className="absolute top-7 left-0 bg-white shadow-lg border rounded-md w-44 py-2 z-50">

//                 <Link
//                   to="/admin/city"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenOthers(false)}
//                 >
//                   City Master
//                 </Link>

//                 <Link
//                   to="/admin/users"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenOthers(false)}
//                 >
//                   Form 1
//                 </Link>

//                 <Link
//                   to="/admin/form2"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenOthers(false)}
//                 >
//                   Form 2
//                 </Link>

//                 <Link
//                   to="/admin/industry"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                   onClick={() => setOpenOthers(false)}
//                 >
//                   Industry Master
//                 </Link>

//               </div>
//             )}
//           </div>

//         </nav>

//         {/* LOGOUT BUTTON */}
//         {/* PROFILE DROPDOWN */}
//         <div className="relative">
//           <button
//             onClick={() => setOpenProfile(!openProfile)}
//             className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
//           >
//             👤
//           </button>

//           {openProfile && (
//             <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-48 py-2 z-50">
//               <Link
//                 to="/admin/profile"
//                 className="block px-4 py-2 hover:bg-gray-100"
//                 onClick={() => setOpenProfile(false)}
//               >
//                 Profile
//               </Link>

//               <Link
//                 to="/admin/edit-profile"
//                 className="block px-4 py-2 hover:bg-gray-100"
//                 onClick={() => setOpenProfile(false)}
//               >
//                 Change Password
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
import { Link, useNavigate } from "react-router-dom";
import ariesLogo from "../assets/logo.png";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

export default function Header() {
  const [openMaster, setOpenMaster] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openOthers, setOpenOthers] = useState(false);

  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const adminId = localStorage.getItem("admin_id");

      if (!adminId) {
        toast.error("Admin ID not found");
        return;
      }

      const res = await axios.post(`${apiUrl}/logout`, {
        admin_id: adminId,
      });

      if (res.data?.success) {
        // ✅ clear auth
        localStorage.removeItem("admin_id");
        localStorage.removeItem("artoken");
        localStorage.removeItem("user");

        delete axios.defaults.headers.common["Authorization"];

        toast.success(res.data?.message || "Logged out successfully");

        setOpenProfile(false);
        navigate("/admin/logout");
      } else {
        toast.error(res.data?.message || "Logout failed");
      }
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Logout failed";

      toast.error(msg);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* LEFT SIDE LOGO */}
      <Link to="/admin">
        <img src={ariesLogo} className="h-12 cursor-pointer" />
      </Link>

      <div className="flex items-center gap-4">
        {/* TOP NAV */}
        <nav className="flex gap-6 text-sm font-semibold">
          <Link className="hover:text-orange-600" to="/admin">
            Dashboard
          </Link>

          {/* MASTER */}
          <div className="relative">
            <button
              onClick={() => setOpenMaster(!openMaster)}
              className="hover:text-orange-600 flex items-center gap-1"
            >
              Master ▼
            </button>

            {openMaster && (
              <div className="absolute top-7 left-0 bg-white shadow-lg border rounded-md w-40 py-2 z-50">
                {[
                  { to: "/admin/city", label: "City" },
                  { to: "/admin/industry", label: "Industry" },
                  { to: "/admin/expo", label: "Expo" },
                  { to: "/admin/users", label: "User" },
                  { to: "/admin/department", label: "Department" },
                ].map((m) => (
                  <Link
                    key={m.to}
                    to={m.to}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenMaster(false)}
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* OTHERS */}
          <div className="relative">
            <button
              onClick={() => setOpenOthers(!openOthers)}
              className="hover:text-orange-600 flex items-center gap-1"
            >
              Others ▼
            </button>

            {openOthers && (
              <div className="absolute top-7 left-0 bg-white shadow-lg border rounded-md w-44 py-2 z-50">
                <Link
                  to="/admin/city"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenOthers(false)}
                >
                  City Master
                </Link>
                <Link
                  to="/admin/users"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenOthers(false)}
                >
                  Form 1
                </Link>
                <Link
                  to="/admin/form2"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenOthers(false)}
                >
                  Form 2
                </Link>
                <Link
                  to="/admin/industry"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenOthers(false)}
                >
                  Industry Master
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* PROFILE */}
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
                to="/admin/profile"
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
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
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
