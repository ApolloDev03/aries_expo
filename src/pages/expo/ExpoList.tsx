import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

// ---------------- TYPES ----------------
interface ApiState {
  stateId: number;
  stateName: string;
}

interface ApiIndustry {
  id: number;
  name: string;
}

interface ApiCity {
  id: number;
  name: string;
  stateid: number;
}

interface ExpoListRow {
  Expoid: number;
  name: string;
  statename: string;
  cityname: string;
  industryname: string;
  date?: string;
}

interface ExpoEditRow {
  Expoid: number;
  name: string;
  stateid: number | string;
  cityid: number | string;
  industryid: number | string;
  date?: string;
}

export default function ExpoMaster() {
  // ----------- FORM STATE -----------
  const [expoName, setExpoName] = useState("");
  const [industryId, setIndustryId] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [expoDate, setExpoDate] = useState<string>("");

  // ----------- SEARCH -----------
  const [searchExpo, setSearchExpo] = useState("");

  // ----------- DROPDOWNS (API) -----------
  const [states, setStates] = useState<ApiState[]>([]);
  const [industries, setIndustries] = useState<ApiIndustry[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);

  // ----------- LIST -----------
  const [expoList, setExpoList] = useState<ExpoListRow[]>([]);

  // ✅ SEPARATE LOADERS
  const [isListing, setIsListing] = useState(false); // init + list refresh
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ----------- EDIT/DELETE MODALS -----------
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<ExpoEditRow>({
    Expoid: 0,
    name: "",
    stateid: "",
    cityid: "",
    industryid: "",
    date: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ----------- PAGINATION -----------
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // ---------------- DATE HELPERS ----------------
  const isValidDDMMYYYY = (v: string) => {
    const m = v.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!m) return false;

    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);

    if (mm < 1 || mm > 12) return false;
    const maxDay = new Date(yyyy, mm, 0).getDate();
    return dd >= 1 && dd <= maxDay;
  };

  const isValidDDMMYYYYList = (v: string) => {
    const parts = v
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (parts.length === 0) return false;
    return parts.every(isValidDDMMYYYY);
  };

  const dmyToYmd = (v: string) => {
    const [dd, mm, yyyy] = v.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const ymdToDmy = (v: string) => {
    const [yyyy, mm, dd] = v.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  const isYmd = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

  const normalizeDateForUI = (raw: any) => {
    const v = String(raw ?? "").trim();
    if (!v) return "";

    return v
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => (isYmd(p) ? ymdToDmy(p) : p))
      .join(", ");
  };

  const pickDateFromRow = (row: any) =>
    row?.date ?? row?.expo_date ?? row?.expodate ?? "";

  const convertUIToApiDateList = (ui: string) => {
    return ui
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => dmyToYmd(p))
      .join(",");
  };

  // ---------------- ERROR HANDLER ----------------
  const toastApiError = (e: any, fallback = "Something went wrong") => {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      fallback;
    toast.error(msg);
  };

  // ---------------- API HELPERS ----------------
  const postJson = async <T,>(url: string, body: any) => {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as T;
  };

  // ---------------- DROPDOWN API CALLS ----------------
  const fetchIndustryList = async () => {
    try {
      const res = await postJson<{
        success: boolean;
        data: ApiIndustry[];
        message: string;
      }>(`${apiUrl}/IndustryList`, {});

      setIndustries(res?.data ?? []);
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Industry fetch failed");
    }
  };

  // ✅ statelist is paginated, so fetch all pages
  const fetchAllStates = async () => {
    try {
      const first = await postJson<{
        success: boolean;
        last_page: number;
        data: ApiState[];
      }>(`${apiUrl}/statelist`, { page: "1" });

      const all: ApiState[] = [...(first?.data ?? [])];
      const lastPage = Number(first?.last_page ?? 1);

      if (lastPage > 1) {
        const rest = await Promise.all(
          Array.from({ length: lastPage - 1 }, (_, i) => i + 2).map((p) =>
            postJson<{ success: boolean; data: ApiState[] }>(
              `${apiUrl}/statelist`,
              { page: String(p) }
            )
          )
        );

        rest.forEach((r) => all.push(...(r?.data ?? [])));
      }

      all.sort((a, b) => a.stateName.localeCompare(b.stateName));
      setStates(all);
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "State fetch failed");
    }
  };

  // ---------------- CITY API CALL ----------------
  const fetchCitiesByState = async (sid: string, keepSelectedCityId?: string) => {
    if (!sid) {
      setCities([]);
      setCityId("");
      return;
    }

    try {
      const res = await postJson<{
        success: boolean;
        data: ApiCity[];
        message: string;
      }>(`${apiUrl}/CityByState`, { stateid: sid });

      const list = res?.data ?? [];
      setCities(list);

      // ✅ keep selected city on edit, else clear
      if (keepSelectedCityId) setCityId(keepSelectedCityId);
      else setCityId("");
    } catch (e: any) {
      console.error(e);
      setCities([]);
      setCityId("");
      toastApiError(e, "City fetch failed");
    }
  };

  // ---------------- EXPO LIST API ----------------
  const enrichExpoDates = async (rows: ExpoListRow[]) => {
    const results = await Promise.allSettled(
      rows.map(async (r) => {
        const res = await postJson<{ success: boolean; data: any[] }>(
          `${apiUrl}/Exposhow`,
          { expo_id: String(r.Expoid) }
        );

        const row = res?.data?.[0];
        const rawDate = pickDateFromRow(row);

        return {
          ...r,
          date: normalizeDateForUI(rawDate),
        } as ExpoListRow;
      })
    );

    return results.map((x, i) =>
      x.status === "fulfilled"
        ? x.value
        : { ...rows[i], date: rows[i].date ?? "" }
    );
  };

  const fetchExpoList = async () => {
    try {
      setIsListing(true);

      const res = await postJson<{
        success: boolean;
        data: ExpoListRow[];
        message: string;
      }>(`${apiUrl}/ExpoList`, {});

      const base = (res?.data ?? []).map((r) => ({
        ...r,
        date: normalizeDateForUI((r as any).date),
      }));

      const filled = await enrichExpoDates(base);
      setExpoList(filled);
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Expo list fetch failed");
    } finally {
      setIsListing(false);
    }
  };

  // ---------------- CRUD ----------------
  const handleSave = async () => {
    if (!expoName || !industryId || !stateId || !cityId || !expoDate) {
      return toast.error("Please fill all fields (including date)");
    }
    if (!isValidDDMMYYYYList(expoDate)) {
      return toast.error("Please enter valid date dd-mm-yyyy (comma allowed)");
    }

    const apiDateList = convertUIToApiDateList(expoDate);

    try {
      setIsSaving(true);

      const res = await postJson<{ success: boolean; message: string }>(
        `${apiUrl}/ExpoAdd`,
        {
          name: expoName,
          industry_id: industryId,
          state_id: stateId,
          city_id: cityId,
          date: apiDateList,
          expo_date: apiDateList,
        }
      );

      setExpoName("");
      setIndustryId("");
      setStateId("");
      setCityId("");
      setExpoDate("");
      setCities([]);

      await fetchExpoList();
      toast.success(res?.message || "Expo Added Successfully");
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Expo add failed");
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = async (expoId: number) => {
    try {
      setIsUpdating(true);

      const res = await postJson<{
        success: boolean;
        data: any[];
        message: string;
      }>(`${apiUrl}/Exposhow`, { expo_id: String(expoId) });

      const row = res?.data?.[0];
      if (!row) {
        toast.error("Expo not found");
        return;
      }

      const rawDate = pickDateFromRow(row);

      // ✅ load cities for that state and keep selected city
      await fetchCitiesByState(String(row.stateid), String(row.cityid));

      setEditData({
        Expoid: row.Expoid,
        name: row.name,
        stateid: String(row.stateid),
        cityid: String(row.cityid),
        industryid: String(row.industryid),
        date: normalizeDateForUI(rawDate),
      });

      setIsEditOpen(true);
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Expo show failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !editData.name ||
      !editData.industryid ||
      !editData.stateid ||
      !editData.cityid ||
      !editData.date
    ) {
      return toast.error("Please fill all fields (including date)");
    }

    if (!isValidDDMMYYYYList(editData.date)) {
      return toast.error("Please enter valid date dd-mm-yyyy (comma allowed)");
    }

    const apiDateList = convertUIToApiDateList(editData.date);

    try {
      setIsUpdating(true);

      const res = await postJson<{ success: boolean; message: string }>(
        `${apiUrl}/ExpoUpdate`,
        {
          expo_id: String(editData.Expoid),
          name: editData.name,
          industry_id: String(editData.industryid),
          state_id: String(editData.stateid),
          city_id: String(editData.cityid),
          date: apiDateList,
          expo_date: apiDateList,
        }
      );

      setIsEditOpen(false);
      await fetchExpoList();
      toast.success(res?.message || "Expo Updated Successfully");
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Expo update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (expoId: number) => {
    try {
      setIsDeleting(true);

      const res = await postJson<{ success: boolean; message: string }>(
        `${apiUrl}/ExpoDelete`,
        { expo_id: String(expoId) }
      );

      setIsDeleteOpen(false);
      setDeleteId(null);

      await fetchExpoList();
      toast.success(res?.message || "Expo Deleted Successfully");
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Expo delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    const init = async () => {
      setIsListing(true);
      try {
        await Promise.all([fetchIndustryList(), fetchAllStates()]);
        await fetchExpoList();
      } finally {
        setIsListing(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // when state changes -> city list (ADD form)
    fetchCitiesByState(stateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  // ---------------- FILTER + PAGINATION ----------------
  const filteredExpo = useMemo(() => {
    return expoList.filter((item) =>
      item.name.toLowerCase().includes(searchExpo.toLowerCase())
    );
  }, [expoList, searchExpo]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredExpo.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExpo.length / recordsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchExpo]);

  // ---------------- UI ----------------
  return (
    <div className="flex gap-8 p-6">
      {/* LEFT FORM */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add Expo</h2>

        <label className="font-medium">Expo Name</label>
        <input
          type="text"
          value={expoName}
          disabled={isSaving || isListing}
          onChange={(e) => setExpoName(e.target.value)}
          placeholder="Enter Expo Name"
          className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
        />

        <label className="font-medium">Industry</label>
        <select
          value={industryId}
          disabled={isSaving || isListing}
          onChange={(e) => setIndustryId(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
        >
          <option value="">Select Industry</option>
          {industries.map((i) => (
            <option key={i.id} value={String(i.id)}>
              {i.name}
            </option>
          ))}
        </select>

        <label className="font-medium">State</label>
        <select
          value={stateId}
          disabled={isSaving || isListing}
          onChange={(e) => setStateId(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.stateId} value={String(s.stateId)}>
              {s.stateName}
            </option>
          ))}
        </select>

        <label className="font-medium">City</label>
        <select
          value={cityId}
          disabled={!stateId || isSaving || isListing}
          onChange={(e) => setCityId(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
        >
          <option value="">
            {stateId ? "Select City" : "Select State first"}
          </option>
          {cities.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="font-medium">Expo Date</label>
        <input
          type="text"
          inputMode="numeric"
          disabled={isSaving || isListing}
          placeholder="dd-mm-yyyy"
          value={expoDate}
          onChange={(e) => setExpoDate(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-2 disabled:bg-gray-100"
        />

        {expoDate && !isValidDDMMYYYYList(expoDate) && (
          <p className="text-xs text-red-600 mb-4">
            Invalid date. Use dd-mm-yyyy (comma allowed).
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving || isListing}
          className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* RIGHT TABLE */}
      <div className="w-2/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Expo List</h2>

        <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Expo Name"
            value={searchExpo}
            disabled={isListing}
            onChange={(e) => setSearchExpo(e.target.value)}
            className="border px-3 py-2 rounded w-1/3 disabled:bg-gray-100"
          />
          <button className="bg-[#2e56a6] text-white px-5 py-2 rounded">
            Search
          </button>
        </div>

        {/* ✅ TABLE AREA LOADER */}
        <div className="relative min-h-[260px]">
          {isListing && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <div className="h-10 w-10 border-4 border-gray-300 border-t-[#2e56a6] rounded-full animate-spin" />
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">ID</th>
                <th className="p-1">Expo</th>
                <th className="p-1">Industry</th>
                <th className="p-1">State</th>
                <th className="p-1">City</th>
                <th className="p-1">Date</th>
                <th className="p-1">Actions</th>
              </tr>
            </thead>

            <tbody className={isListing ? "opacity-40" : ""}>
              {currentRecords.map((item, index) => (
                <tr key={item.Expoid} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-1">{item.name}</td>
                  <td className="p-1">{item.industryname}</td>
                  <td className="p-1">{item.statename}</td>
                  <td className="p-1">{item.cityname}</td>
                  <td className="p-1">{item.date ? item.date : "-"}</td>

                  <td className="p-1 flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      disabled={isListing || isUpdating}
                      onClick={() => openEdit(item.Expoid)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                      disabled={isListing || isDeleting}
                      onClick={() => {
                        setDeleteId(item.Expoid);
                        setIsDeleteOpen(true);
                      }}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}

              {!isListing && currentRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            disabled={currentPage === 1 || isListing}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-3 py-1 rounded border ${currentPage === 1 || isListing
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
                disabled={isListing}
                onClick={() => setCurrentPage(page)}
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
            disabled={currentPage === totalPages || totalPages === 0 || isListing}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0 || isListing
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* EDIT POPUP */}
      {isEditOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setIsEditOpen(false)}   // ✅ outside click close
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()} // ❌ prevent inside click close
          >
            {/* ❌ Close (X) icon */}
            <button
              onClick={() => setIsEditOpen(false)}
              disabled={isUpdating}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Expo</h2>

            <label className="font-medium">Expo Name</label>
            <input
              type="text"
              value={editData.name}
              disabled={isUpdating}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
            />

            <label className="font-medium">Industry</label>
            <select
              value={String(editData.industryid)}
              disabled={isUpdating}
              onChange={(e) =>
                setEditData({ ...editData, industryid: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
            >
              <option value="">Select Industry</option>
              {industries.map((i) => (
                <option key={i.id} value={String(i.id)}>
                  {i.name}
                </option>
              ))}
            </select>

            <label className="font-medium">State</label>
            <select
              value={String(editData.stateid)}
              disabled={isUpdating}
              onChange={async (e) => {
                const sid = e.target.value;
                setEditData({ ...editData, stateid: sid, cityid: "" });
                await fetchCitiesByState(sid);
              }}
              className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.stateId} value={String(s.stateId)}>
                  {s.stateName}
                </option>
              ))}
            </select>

            <label className="font-medium">City</label>
            <select
              value={String(editData.cityid)}
              disabled={isUpdating || !editData.stateid}
              onChange={(e) =>
                setEditData({ ...editData, cityid: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
            >
              <option value="">
                {editData.stateid ? "Select City" : "Select State first"}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>

            <label className="font-medium">Expo Date (dd-mm-yyyy)</label>
            <input
              type="text"
              inputMode="numeric"
              disabled={isUpdating}
              placeholder="dd-mm-yyyy"
              value={editData.date ?? ""}
              onChange={(e) =>
                setEditData({ ...editData, date: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mt-1 mb-2 disabled:bg-gray-100"
            />

            {editData.date && !isValidDDMMYYYYList(editData.date) && (
              <p className="text-xs text-red-600 mb-4">
                Invalid date. Use dd-mm-yyyy (comma allowed).
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 bg-[#2e56a6] text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* DELETE POPUP */}
      {isDeleteOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setIsDeleteOpen(false)} // ✅ outside click close
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative"
            onClick={(e) => e.stopPropagation()} // ❌ prevent inside close
          >
            {/* ❌ Close (X) icon */}
            <button
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Delete Record
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expo?
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 border rounded-full"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="px-5 py-2 bg-red-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => {
                  if (deleteId !== null) handleDelete(deleteId);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
