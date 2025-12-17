import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";
import { useNavigate } from "react-router-dom";


interface IndustryItem {
  id: number;
  name: string;
}

interface ExpoItem {
  id: number;
  name: string;
  statename?: string;
  cityname?: string;
  industryname?: string;
}

interface AssignedItem {
  expo_assign_user_id: number;
  industryname: string;
  exponame: string;
  username: string;
}

export default function AssignForm() {
  const { id } = useParams(); // user_id from route

  // ---------------- Auth Header ----------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("artoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const userId = useMemo(() => String(id || ""), [id]);

  const [userName, setUserName] = useState<string>("");

  // Dropdown lists
  const [industryList, setIndustryList] = useState<IndustryItem[]>([]);
  const [expoList, setExpoList] = useState<ExpoItem[]>([]);

  // Selected values (IDs)
  const [industryId, setIndustryId] = useState<string>("");
  const [expoId, setExpoId] = useState<string>("");

  // Assigned list
  const [assignedList, setAssignedList] = useState<AssignedItem[]>([]);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate()

  // Loaders
  const [loading, setLoading] = useState(false); // page fetch
  const [saving, setSaving] = useState(false); // save btn
  const [deletingId, setDeletingId] = useState<number | null>(null); // per row delete

  // ✅ OPTIONAL: if you already have username in UserList page, pass it via navigate state.
  // For now keep demo fallback.
  useEffect(() => {
    const demoUsers = [
      { id: "1", name: "Sweta Panchal" },
      { id: "2", name: "Priya Patel" },
      { id: "3", name: "harshita" },
    ];
    const selectedUser = demoUsers.find((u) => u.id === userId);
    if (selectedUser) setUserName(selectedUser.name);
  }, [userId]);

  // ---------------- Fetch Industry List ----------------
  const fetchIndustries = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/IndustryList`,
        {},
        { headers: { ...getAuthHeaders() } }
      );

      const list: IndustryItem[] = (res.data?.data || []).map((x: any) => ({
        id: Number(x.id),
        name: String(x.name ?? ""),
      }));

      setIndustryList(list);
    } catch (err: any) {
      console.error(err);
      toast.error("Industry list fetch failed");
      setIndustryList([]);
    }
  };

  // ---------------- Fetch Expo List ----------------
  const fetchExpos = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/ExpoList`,
        {},
        { headers: { ...getAuthHeaders() } }
      );

      const list: ExpoItem[] = (res.data?.data || []).map((x: any) => ({
        id: Number(x.Expoid ?? x.expoid ?? x.id),
        name: String(x.name ?? ""),
        statename: String(x.statename ?? ""),
        cityname: String(x.cityname ?? ""),
        industryname: String(x.industryname ?? ""),
      }));

      setExpoList(list);
    } catch (err: any) {
      console.error(err);
      toast.error("Expo list fetch failed");
      setExpoList([]);
    }
  };

  // ---------------- Fetch Assigned List ----------------
  const fetchAssignedList = async () => {
    if (!userId) return;

    try {
      const res = await axios.post(
        `${apiUrl}/ExpoAssign/UserList`,
        { user_id: userId },
        { headers: { ...getAuthHeaders() } }
      );

      const list: AssignedItem[] = (res.data?.data || []).map((x: any) => ({
        expo_assign_user_id: Number(x.expo_assign_user_id),
        industryname: String(x.industryname ?? ""),
        exponame: String(x.exponame ?? ""),
        username: String(x.username ?? ""),
      }));

      setAssignedList(list);

      // ✅ set username from API if available
      if (list.length > 0 && list[0].username) {
        setUserName(list[0].username);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Assigned expo list fetch failed");
      setAssignedList([]);
    }
  };

  // ---------------- Initial Load ----------------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([fetchIndustries(), fetchExpos()]);
        await fetchAssignedList();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ---------------- Save Assigned Expo (API) ----------------
  const handleSave = async () => {
    if (!userId) return toast.error("User id missing");
    if (!industryId) return toast.error("Please select industry");
    if (!expoId) return toast.error("Please select expo");

    try {
      setSaving(true);

      const res = await axios.post(
        `${apiUrl}/ExpoAssign/UserAdd`,
        {
          user_id: userId,
          industry_id: String(industryId),
          expo_id: String(expoId),
        },
        { headers: { ...getAuthHeaders() } }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Expo assigned successfully");
        setIndustryId("");
        setExpoId("");
        await fetchAssignedList();
      } else {
        toast.error(res.data?.message || "Assign failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Assign failed");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- Delete Assigned Expo (API) ----------------
  const handleDelete = async (expo_assign_user_id: number) => {
    try {
      setDeletingId(expo_assign_user_id);

      const res = await axios.post(
        `${apiUrl}/ExpoAssign/UserDelete`,
        { expo_assign_user_id: String(expo_assign_user_id) },
        { headers: { ...getAuthHeaders() } }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Deleted successfully");
        await fetchAssignedList();
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* HEADING */}
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-6">
        Assigning Expo to <span className="text-blue-600">{userName || "-"}</span>
      </h1>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 border rounded-md p-2 border-[#2e56a6] text-[#2e56a6] font-medium"
      >
        <ArrowBackIcon fontSize="small" />
        Back
      </button>
      </div>

      <div className="flex gap-6">
        {/* LEFT SIDE FORM */}
        <div className="w-1/3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Assign Expo</h2>

          {/* Industry Dropdown */}
          <label className="font-medium">Select Industry</label>
          <select
            value={industryId}
            onChange={(e) => setIndustryId(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1 mb-4"
          >
            <option value="">-- Select Industry --</option>
            {industryList.map((ind) => (
              <option key={ind.id} value={String(ind.id)}>
                {ind.name}
              </option>
            ))}
          </select>

          {/* Expo Dropdown */}
          <label className="font-medium">Select Expo</label>
          <select
            value={expoId}
            onChange={(e) => setExpoId(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1 mb-4"
          >
            <option value="">-- Select Expo --</option>
            {expoList.map((ex) => (
              <option key={ex.id} value={String(ex.id)}>
                {ex.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 disabled:opacity-60 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* RIGHT SIDE TABLE */}
        <div className="w-2/3 bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Assigned Expos</h2>


          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Industry</th>
                <th className="p-2 border text-left">Expo</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : assignedList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No expo assigned yet
                  </td>
                </tr>
              ) : (
                assignedList.map((item) => (
                  <tr key={item.expo_assign_user_id} className="border-b">
                    <td className="p-2 border">
                      {item.industryname || "-"}
                    </td>
                    <td className="p-2 border">
                      {item.exponame || "-"}
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        disabled={deletingId === item.expo_assign_user_id}
                        onClick={() => {
                          setDeleteId(item.expo_assign_user_id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 disabled:opacity-60"
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* DELETE MODAL */}
          {showDeleteModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
              onClick={() => setShowDeleteModal(false)}   // ✅ outside click close
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-80 relative"
                onClick={(e) => e.stopPropagation()}     // ❌ prevent inside click close
              >
                {/* ❌ Cross (X) icon */}
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>

                <h2 className="text-xl font-semibold text-red-600 mb-2">
                  Delete Record
                </h2>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the record?
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={deleteId === null || deletingId === deleteId}
                    onClick={async () => {
                      if (deleteId !== null) await handleDelete(deleteId);
                      setShowDeleteModal(false);
                      setDeleteId(null);
                    }}
                    className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {deletingId === deleteId ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
