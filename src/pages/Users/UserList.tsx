import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";


type StatusType = "active" | "inactive";

interface UserData {
  id: number;
  name: string;
  mobile: string;
  address: string;
  email: string; // ✅ ensure always exists
  department_id?: number | null;
  department?: string;
  expo_count?: number;
  status: StatusType;
  iStatus?: number;
}

interface Department {
  id: number;
  name: string;
}

export default function UserMaster() {
  const navigate = useNavigate();

  // ---------------- Helpers ----------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("artoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getApiMessage = (err: any, fallback = "Something went wrong") => {
    // supports: message, error, errors(object), validation arrays, etc.
    const d = err?.response?.data;

    if (typeof d?.message === "string" && d.message) return d.message;
    if (typeof d?.error === "string" && d.error) return d.error;

    // Laravel style: errors: {field: ["msg1", "msg2"]}
    if (d?.errors && typeof d.errors === "object") {
      const firstKey = Object.keys(d.errors)[0];
      const firstVal = d.errors[firstKey];
      if (Array.isArray(firstVal) && firstVal.length) return firstVal[0];
      if (typeof firstVal === "string") return firstVal;
    }

    if (typeof err?.message === "string" && err.message) return err.message;
    return fallback;
  };

  // ---------------- Form States ----------------
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(""); // ✅ add user email
  const [departmentId, setDepartmentId] = useState<string>("");
  const [password, setPassword] = useState("");

  // ---------------- Search + Pagination ----------------
  const [searchMobile, setSearchMobile] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // ---------------- Data ----------------
  const [users, setUsers] = useState<UserData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // ---------------- UI ----------------
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<UserData | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUserId, setPasswordUserId] = useState<number | null>(null);

  // ---------------- Fetch Departments ----------------
  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      const res = await axios.post(
        `${apiUrl}/DepartList`,
        {},
        { headers: { ...getAuthHeaders() } }
      );

      const list: Department[] = (res.data?.data || []).map((d: any) => ({
        id: Number(d.id),
        name: String(d.name),
      }));

      setDepartments(list);
      return list;
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "Department list fetch failed"));
      setDepartments([]);
      return [];
    }
  };

  // ---------------- Fetch Users ----------------
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/UserList`,
        {},
        { headers: { ...getAuthHeaders() } }
      );

      const list: UserData[] = (res.data?.data || []).map((u: any) => {
        const rawStatus = Number(u.iStatus ?? u.status ?? 1);

        // ✅ email mapping (fallback keys)
        const mappedEmail =
          u.email ?? u.user_email ?? u.Email ?? u.mail ?? u.userEmail ?? "";

        return {
          id: Number(u.Userid ?? u.Usersid ?? u.id),
          name: String(u.name ?? ""),
          mobile: String(u.mobile ?? ""),
          address: String(u.address ?? ""),
          email: String(mappedEmail ?? ""), // ✅ always set
          department: String(u.departname ?? u.department ?? ""),
          department_id: u.depart_id ? Number(u.depart_id) : null,
          expo_count: u.expo_count ? Number(u.expo_count) : 0,
          iStatus: rawStatus,
          status: rawStatus === 1 ? "active" : "inactive",
        };
      });

      setUsers(list);
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "User list fetch failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Add User ----------------
  const handleSave = async () => {
    if (!name || !mobile || !address || !departmentId || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Mobile must be 10 digits");
      return;
    }
    // ✅ optional email validation (only if filled)
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter valid email");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        mobile,
        address,
        email, // ✅ send email
        department_id: departmentId,
        password,
      };

      const res = await axios.post(`${apiUrl}/UserAdd`, payload, {
        headers: { ...getAuthHeaders() },
      });

      if (res.data?.success) {
        toast.success(res.data?.message || "User Added Successfully");
        setName("");
        setMobile("");
        setAddress("");
        setEmail(""); // ✅ reset
        setDepartmentId("");
        setPassword("");
        await fetchUsers();
      } else {
        toast.error(res.data?.message || "User add failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "User add failed"));
    } finally {
      setSaving(false);
    }
  };

  // ---------------- Open Edit (Usershow) ----------------
  const openEdit = async (userId: number) => {
    try {
      setLoading(true);

      const deptList =
        departments.length > 0 ? departments : await fetchDepartments();

      const res = await axios.post(
        `${apiUrl}/Usershow`,
        { user_id: String(userId) },
        { headers: { ...getAuthHeaders() } }
      );

      const row = res.data?.data?.[0];
      if (!row) {
        const fallback = users.find((u) => u.id === userId);
        if (fallback) setEditData(fallback);
        setIsEditOpen(true);
        return;
      }

      const deptName = String(row.department ?? row.departname ?? "").trim();

      const matchedDept = deptList.find(
        (d) => d.name.trim().toLowerCase() === deptName.toLowerCase()
      );

      // ✅ email mapping from Usershow response
      const mappedEmail =
        row.email ?? row.user_email ?? row.Email ?? row.mail ?? "";

      setEditData({
        id: Number(row.Usersid ?? row.Userid ?? row.id ?? userId),
        name: String(row.name ?? ""),
        mobile: String(row.mobile ?? ""),
        address: String(row.address ?? ""),
        email: String(mappedEmail ?? ""), // ✅ set in edit modal
        department: deptName,
        department_id: matchedDept ? matchedDept.id : null,
        status: "active",
        iStatus: 1,
      });

      setIsEditOpen(true);
    } catch (err: any) {
      console.error(err);
      const fallback = users.find((u) => u.id === userId);
      if (fallback) {
        setEditData(fallback);
        setIsEditOpen(true);
      } else {
        toast.error(getApiMessage(err, "User fetch failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Update User ----------------
  const handleUpdate = async () => {
    if (!editData) return;

    if (!editData.name || !editData.mobile || !editData.address) {
      toast.error("Please fill all fields");
      return;
    }
    if (!/^\d{10}$/.test(editData.mobile)) {
      toast.error("Mobile must be 10 digits");
      return;
    }
    // ✅ optional email validation (only if filled)
    if (editData.email && !/^\S+@\S+\.\S+$/.test(editData.email)) {
      toast.error("Enter valid email");
      return;
    }

    const deptId =
      editData.department_id ??
      (editData.department
        ? departments.find(
          (d) => d.name.toLowerCase() === editData.department!.toLowerCase()
        )?.id
        : null);

    if (!deptId) {
      toast.error("Please select department");
      return;
    }

    try {
      setUpdating(true);
      const payload: any = {
        user_id: String(editData.id),
        name: editData.name,
        mobile: editData.mobile,
        address: editData.address,
        email: editData?.email, // ✅ send email in update
        department_id: String(deptId),
      };

      const res = await axios.post(`${apiUrl}/UserUpdate`, payload, {
        headers: { ...getAuthHeaders() },
      });

      if (res.data?.success) {
        toast.success(res.data?.message || "User updated successfully.");
        setIsEditOpen(false);
        setEditData(null);
        await fetchUsers();
      } else {
        toast.error(res.data?.message || "User update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "User update failed"));
    } finally {
      setUpdating(false);
    }
  };

  // ---------------- Delete User ----------------
  const handleDelete = async (userId: number) => {
    try {
      setDeletingId(userId);

      const res = await axios.post(
        `${apiUrl}/UserDelete`,
        { user_id: String(userId) },
        { headers: { ...getAuthHeaders() } }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "User Deleted Successfully");
        await fetchUsers();
      } else {
        toast.error(res.data?.message || "User delete failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "User delete failed"));
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- Toggle Status ----------------
  const handleStatusChange = async (userId: number, nextStatus: 0 | 1) => {
    try {
      setStatusLoadingId(userId);

      const res = await axios.post(
        `${apiUrl}/user/change-status`,
        { user_id: String(userId), iStatus: String(nextStatus) },
        { headers: { ...getAuthHeaders() } }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Status updated");
        await fetchUsers();
      } else {
        toast.error(res.data?.message || "Status update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "Status update failed"));
    } finally {
      setStatusLoadingId(null);
    }
  };

  // ---------------- Password Update ----------------
  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Please fill all fields");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    if (!passwordUserId) return;

    try {
      setPasswordLoading(true);

      const res = await axios.post(
        `${apiUrl}/user/change-password`,
        {
          user_id: String(passwordUserId),
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        { headers: { ...getAuthHeaders() } }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Password changed successfully");
        setIsPasswordOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setPasswordUserId(null);
      } else {
        toast.error(res.data?.message || "Password change failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "Password change failed"));
    } finally {
      setPasswordLoading(false);
    }
  };

  // ---------------- Filter + Pagination ----------------
  const filteredUsers = useMemo(() => {
    return users.filter((item) => item.mobile.includes(searchMobile));
  }, [users, searchMobile]);

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchMobile]);

  return (
    <div className="flex gap-8 p-6">
      {/* LEFT: Add User Form */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add User</h2>

        <label className="font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        <label className="font-medium">Mobile</label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d{0,10}$/.test(v)) setMobile(v);
          }}
          placeholder="Enter mobile number"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        {/* ✅ EMAIL FIELD (Add) */}
        <label className="font-medium">Email Address</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        <label className="font-medium">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />



        <label className="font-medium">Department</label>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={String(d.id)}>
              {d.name}
            </option>
          ))}
        </select>

        <label className="font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2e56a6] disabled:opacity-60 text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* RIGHT: User List */}
      <div className="w-2/3 bg-white p-6 shadow rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">User List</h2>
        </div>

        {/* Search */}
        <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by Mobile Number"
            value={searchMobile}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) setSearchMobile(value);
            }}
            className="border px-3 py-2 rounded w-1/3"
          />
          <button className="bg-[#2e56a6] text-white px-5 py-2 rounded">
            Search
          </button>
        </div>

        <div className="overflow-x-scroll">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Mobile</th>
                <th className="p-2">Address</th>
                <th className="p-2">Department</th>
                <th className="p-2 text-center">Expo Count</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.email || "-"}</td>
                  <td className="p-2">{item.mobile}</td>
                  <td className="p-2">{item.address}</td>
                  <td className="p-2">{item.department || "-"}</td>
                  <td className="p-2 text-center">{item.expo_count ?? 0}</td>

                  <td className="p-2">
                    <button
                      disabled={statusLoadingId === item.id}
                      onClick={() => {
                        const next = item.status === "active" ? 0 : 1;
                        handleStatusChange(item.id, next);
                      }}
                      className="text-white px-3 py-1 rounded-md text-sm disabled:opacity-70"
                      style={{
                        background:
                          item.status === "active"
                            ? "linear-gradient(135deg, #3d78e3 0, #67b173 100%)"
                            : "linear-gradient(135deg, #f17171 0, #5b71b9 100%)",
                      }}
                    >
                      {statusLoadingId === item.id
                        ? "Updating..."
                        : item.status === "active"
                          ? "Active"
                          : "Inactive"}
                    </button>
                  </td>

                  <td className="p-2 py-2 flex items-center gap-1">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openEdit(item.id)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setDeleteId(item.id);
                        setIsDeleteOpen(true);
                      }}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>

                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/admin/users/assign/${item.id}`)}
                      title="Assign"
                    >
                      <AssignmentIcon fontSize="small" />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => {
                        setPasswordUserId(item.id);
                        setNewPassword("");
                        setConfirmPassword("");
                        setIsPasswordOpen(true);
                      }}
                      title="Change Password"
                    >
                      <VpnKeyIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && currentRecords.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center p-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-3 py-1 rounded border ${currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages || 1)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded border ${currentPage === page
                  ? "bg-[#2e56a6] text-white"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>

        {/* EDIT MODAL */}
        {isEditOpen && editData && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          // onClick={() => {
          //   setIsEditOpen(false);
          //   setEditData(null);
          // }} 
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
              onClick={(e) => e.stopPropagation()} // ❌ prevent inside close
            >
              {/* ❌ Close (X) icon */}
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setEditData(null);
                }}
                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4">Edit User</h2>

              <label className="font-medium">Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <label className="font-medium">Mobile</label>
              <input
                type="text"
                value={editData.mobile}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^\d{0,10}$/.test(v)) {
                    setEditData({ ...editData, mobile: v });
                  }
                }}
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              {/* ✅ EMAIL FIELD (Edit) */}
              <label className="font-medium">Email Address</label>
              <input
                type="text"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />



              <label className="font-medium">Address</label>
              <input
                type="text"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <label className="font-medium">Department</label>
              <select
                value={String(editData.department_id ?? "")}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    department_id: e.target.value ? Number(e.target.value) : null,
                    department:
                      departments.find((d) => String(d.id) === e.target.value)
                        ?.name || "",
                  })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditData(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-[#2e56a6] text-white rounded disabled:opacity-60"
                  disabled={updating}
                  onClick={handleUpdate}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* DELETE POPUP */}
        {isDeleteOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          // onClick={() => setIsDeleteOpen(false)}   
          >
            <div
              className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative"
              onClick={(e) => e.stopPropagation()}   // ❌ prevent close on inner click
            >
              {/* ❌ Cross (X) icon */}
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Delete User
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  className="px-5 py-2 border rounded-full"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-5 py-2 bg-red-600 text-white rounded-full disabled:opacity-60"
                  disabled={deleteId === null || deletingId === deleteId}
                  onClick={() => {
                    if (deleteId !== null) handleDelete(deleteId);
                    setIsDeleteOpen(false);
                  }}
                >
                  {deletingId === deleteId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* PASSWORD POPUP */}
        {isPasswordOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          // onClick={() => setIsPasswordOpen(false)}  
          >
            <div
              className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative"
              onClick={(e) => e.stopPropagation()}     // ❌ prevent inside close
            >
              {/* ❌ Cross (X) icon */}
              <button
                onClick={() => setIsPasswordOpen(false)}
                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Change Password
              </h2>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsPasswordOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-[#2e56a6] text-white rounded disabled:opacity-60"
                  disabled={passwordLoading}
                  onClick={handlePasswordUpdate}
                >
                  {passwordLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
