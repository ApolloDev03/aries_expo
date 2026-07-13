import { Link, useNavigate } from "react-router-dom";
import ariesLogo from "../assets/logo.png";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../config";

type Department = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  mobile: string;
  address?: string;

  // Old API support
  Department?: string;

  // New API support
  departments?: Department[];
  department_ids?: number[];
  department_names?: string[];
  primary_department?: string;
  primary_department_id?: number | null;
};

const getStoredUser = (): User => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}") as User;
  } catch (error) {
    console.error("User localStorage parse error:", error);
    return {} as User;
  }
};

const getStoredDepartments = (user: User): Department[] => {
  try {
    const storedDepartments = JSON.parse(
      localStorage.getItem("user_departments") || "[]"
    );

    let departmentList: Department[] = [];

    // First priority: user_departments from localStorage
    if (Array.isArray(storedDepartments)) {
      departmentList = storedDepartments
        .map((department: any) => ({
          id: Number(department?.id || 0),
          name: String(department?.name || "").trim(),
        }))
        .filter(
          (department: Department) =>
            department.id > 0 && department.name !== ""
        );
    }

    // Second priority: departments inside user object
    if (
      departmentList.length === 0 &&
      Array.isArray(user?.departments)
    ) {
      departmentList = user.departments
        .map((department: any) => ({
          id: Number(department?.id || 0),
          name: String(department?.name || "").trim(),
        }))
        .filter(
          (department: Department) =>
            department.id > 0 && department.name !== ""
        );
    }

    // Old API fallback
    if (
      departmentList.length === 0 &&
      user?.Department &&
      user.Department.trim() !== ""
    ) {
      departmentList = [
        {
          id: 0,
          name: user.Department.trim(),
        },
      ];
    }

    // Remove duplicate departments
    return departmentList.filter(
      (department, index, array) =>
        array.findIndex(
          (item) =>
            item.name.toLowerCase() === department.name.toLowerCase()
        ) === index
    );
  } catch (error) {
    console.error("Department localStorage parse error:", error);
    return [];
  }
};

export default function UserHeader() {
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const userDetail = useMemo(() => getStoredUser(), []);

  const departments = useMemo(
    () => getStoredDepartments(userDetail),
    [userDetail]
  );

  const [activeDepartment, setActiveDepartment] = useState<string>(() => {
    const savedActiveDepartment =
      localStorage.getItem("active_department") || "";

    const primaryDepartment =
      localStorage.getItem("primary_department") ||
      userDetail?.primary_department ||
      "";

    const preferredDepartment =
      savedActiveDepartment || primaryDepartment;

    const matchedDepartment = departments.find(
      (department) =>
        department.name.toLowerCase() ===
        preferredDepartment.trim().toLowerCase()
    );

    return matchedDepartment?.name || departments[0]?.name || "";
  });

  const normalizedActiveDepartment = activeDepartment
    .trim()
    .toLowerCase();

  const isCallingDepartment =
    normalizedActiveDepartment === "calling";

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDepartment = event.target.value;

    setActiveDepartment(selectedDepartment);
    localStorage.setItem(
      "active_department",
      selectedDepartment
    );

    setOpenUpload(false);
    setOpenProfile(false);

    /*
     * Notify other components, such as UserDashboard,
     * that the selected department changed.
     */
    window.dispatchEvent(
      new CustomEvent("active-department-change", {
        detail: selectedDepartment,
      })
    );

    navigate("/users");
  };

  const handleLogout = async () => {
    try {
      const userId =
        localStorage.getItem("User_Id") ||
        localStorage.getItem("user_id") ||
        "";

      await axios
        .post(`${apiUrl}/user/logout`, {
          user_id: userId,
        })
        .catch(() => {});

      localStorage.removeItem("usertoken");
      localStorage.removeItem("user");
      localStorage.removeItem("User_Id");
      localStorage.removeItem("user_id");

      localStorage.removeItem("user_departments");
      localStorage.removeItem("department_ids");
      localStorage.removeItem("department_names");
      localStorage.removeItem("primary_department");
      localStorage.removeItem("primary_department_id");
      localStorage.removeItem("active_department");

      localStorage.removeItem("user_lat");
      localStorage.removeItem("user_lng");
      localStorage.removeItem("location_permission");

      toast.success("Logged out successfully");
      navigate("/logout");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.clear();

      toast.error("Logout failed, but local session cleared");
      navigate("/logout");
    }
  };

  useEffect(() => {
    if (
      activeDepartment &&
      !localStorage.getItem("active_department")
    ) {
      localStorage.setItem(
        "active_department",
        activeDepartment
      );
    }
  }, [activeDepartment]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }

      if (
        uploadRef.current &&
        !uploadRef.current.contains(event.target as Node)
      ) {
        setOpenUpload(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      {/* LEFT SIDE LOGO */}
      <Link to="/users">
        <img
          src={ariesLogo}
          className="h-12 cursor-pointer"
          alt="Aries Logo"
        />
      </Link>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-5 text-sm font-semibold">
          {/* DEPARTMENT SELECT */}
          {departments.length > 0 && (
            <div className="flex items-center gap-2">
          
              <select
                id="active-department"
                value={activeDepartment}
                onChange={handleDepartmentChange}
                className="min-w-[145px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-[#2e56a6] focus:ring-2 focus:ring-blue-100"
              >
                {departments.map((department) => (
                  <option
                    key={`${department.id}-${department.name}`}
                    value={department.name}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CALLING DEPARTMENT MENU */}
          {isCallingDepartment ? (
            <>
              <Link
                className="hover:text-orange-600"
                to="/users"
              >
                Dashboard
              </Link>

              <Link
                className="hover:text-orange-600"
                to="/users/new-clients"
              >
                My Call
              </Link>
            </>
          ) : (
            /* OTHER DEPARTMENT MENU */
            <>
              <Link
                className="hover:text-orange-600"
                to="/users"
              >
                Dashboard
              </Link>

              <Link
                className="hover:text-orange-600"
                to="/users/my-expo"
              >
                My Expo
              </Link>

              <Link
                className="hover:text-orange-600"
                to="/users/expectedvisitor"
              >
                Expected Visitor
              </Link>

              <Link
                className="hover:text-orange-600"
                to="/users/expectedexhibitor"
              >
                Expected Exhibitors
              </Link>

              {/* UPLOAD DROPDOWN */}
              <div className="relative" ref={uploadRef}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenUpload((current) => !current)
                  }
                  className="flex items-center gap-1 hover:text-orange-600"
                >
                  Upload

                  <span className="text-xs">
                    {openUpload ? "▲" : "▼"}
                  </span>
                </button>

                {openUpload && (
                  <div className="absolute left-0 z-50 mt-2 w-56 rounded-md border bg-white py-2 shadow-lg">
                    <Link
                      to="/users/upload-visitor"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-orange-600"
                      onClick={() => setOpenUpload(false)}
                    >
                      Visitor
                    </Link>

                    <Link
                      to="/users/upload-Exhibitors"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-orange-600"
                      onClick={() => setOpenUpload(false)}
                    >
                      Exhibitor
                    </Link>

                    <Link
                      to="/users/upload-ExhibitorExhibitors"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-orange-600"
                      onClick={() => setOpenUpload(false)}
                    >
                      Expected Exhibitor
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          <p className="whitespace-nowrap">
            Welcome,{" "}
            <span className="capitalize text-[#2e56a6]">
              {userDetail?.name || "User"}
            </span>
          </p>
        </nav>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() =>
              setOpenProfile((current) => !current)
            }
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-300"
          >
            👤
          </button>

          {openProfile && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white py-2 shadow-lg">
              <div className="border-b px-4 py-2">
                <p className="text-xs text-gray-500">
                  Active Department
                </p>

                <p className="text-sm font-semibold text-[#2e56a6]">
                  {activeDepartment || "-"}
                </p>
              </div>

              <Link
                to="/users/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpenProfile(false)}
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
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