import { Link, useNavigate } from "react-router-dom";
import ariesLogo from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

export default function Header() {
  const [openMaster, setOpenMaster] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const masterRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const forceLogout = (msg?: string) => {
      localStorage.removeItem("admin_id");
      localStorage.removeItem("artoken");
      localStorage.removeItem("admin_user");
      delete axios.defaults.headers.common["Authorization"];
      if (msg) toast.error(msg);
      setOpenProfile(false);
      navigate("/");
    };

    try {
      const adminId = localStorage.getItem("admin_id");
      const token = localStorage.getItem("artoken");

      if (!adminId || !token) {
        return forceLogout("Session expired. Please login again.");
      }

      const res = await axios.post(
        `${apiUrl}/logout`,
        { admin_id: adminId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Logged out successfully");
        setOpenProfile(false);
        navigate("/admin/logout");
        localStorage.removeItem("admin_id");
        localStorage.removeItem("artoken");
        localStorage.removeItem("admin_user");
        delete axios.defaults.headers.common["Authorization"];
      } else {
        const errMsg =
          res.data?.error ||
          res.data?.message ||
          "Session expired. Please login again.";
        forceLogout(errMsg);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Session expired. Please login again.";
      forceLogout(msg);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (masterRef.current && !masterRef.current.contains(e.target as Node)) {
        setOpenMaster(false);
      }
      if (reportRef.current && !reportRef.current.contains(e.target as Node)) {
        setOpenReport(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="relative" ref={masterRef}>
            <button
              onClick={() => {
                setOpenMaster((p) => !p);
                setOpenReport(false);
                setOpenProfile(false);
              }}
              className="hover:text-orange-600 flex items-center gap-1"
              type="button"
            >
              Master ▼
            </button>

            {openMaster && (
              <div className="absolute top-7 left-0 bg-white shadow-lg border rounded-md w-48 py-2 z-50">
                {[

                  { to: "/admin/buissness-type", label: "Business Type" },
                  { to: "/admin/category", label: "Category" },
                  { to: "/admin/city", label: "City" },
                  { to: "/admin/department", label: "Department" },
                  { to: "/admin/expo", label: "Expo" },
                  { to: "/admin/industry", label: "Industry" },
                  { to: "/admin/state", label: "State" },
                  { to: "/admin/subcategory", label: "Subcategory" },
                  { to: "/admin/users", label: "User" },
                  { to: "/admin/visitor-category", label: "Visitor Category" },

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

          {/* REPORT (Dropdown) */}
          <div className="relative" ref={reportRef}>
            <button
              onClick={() => {
                setOpenReport((p) => !p);
                setOpenMaster(false);
                setOpenProfile(false);
              }}
              className="hover:text-orange-600 flex items-center gap-1"
              type="button"
            >
              Report ▼
            </button>

            {openReport && (
              <div className="absolute top-7 left-0 bg-white shadow-lg border rounded-md w-52 py-2 z-50">
                {[
                  { to: "/admin/report/visitor", label: "Visitor Report" },
                  { to: "/admin/report/exhibitor", label: "Exhibitor Report" },
                ].map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenReport(false)}
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link className="hover:text-orange-600" to="/admin/calling">
            Telling calling
          </Link>
        </nav>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setOpenProfile((p) => !p);
              setOpenMaster(false);
              setOpenReport(false);
            }}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
            type="button"
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

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                type="button"
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