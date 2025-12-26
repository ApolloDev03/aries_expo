import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

// -------------------- Types --------------------
interface Industry {
    id: number;
    name: string;
}

type ApiCategoryRow = {
    id: number;
    industry_id: number;
    industry_category_name: string;
    industry_name?: string;
    iStatus?: number;
    created_at?: string;
    updated_at?: string;
};

type ApiSubCategoryRow = {
    id: number;
    industry_id: number;
    industry_category_id: number;
    industry_subcategory_name: string;

    industry_name?: string;
    industry_category_name?: string;

    iStatus?: number;
    entry_by?: number;
    isDelete?: number;
    created_at?: string;
    updated_at?: string;
};

type EditSubCategory = {
    id: number | null;
    industry_id: number | "";
    industry_category_id: number | "";
    industry_subcategory_name: string;
};

// -------------------- Helpers --------------------
function getApiErrorMessage(error: any, fallback = "Something went wrong") {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;

    if (data.errors && typeof data.errors === "object") {
        const msgs: string[] = [];
        Object.values(data.errors).forEach((v: any) => {
            if (Array.isArray(v)) msgs.push(...v.map(String));
            else if (typeof v === "string") msgs.push(v);
        });
        if (msgs.length) return msgs.join(" | ");
    }
    return fallback;
}

export default function SubCategoryMaster() {
    // -------------------- Form State --------------------
    const [industryId, setIndustryId] = useState<number | "">("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [subCategoryName, setSubCategoryName] = useState("");

    // -------------------- Data --------------------
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [categories, setCategories] = useState<ApiCategoryRow[]>([]); // ✅ categories for selected industry
    const [editCategories, setEditCategories] = useState<ApiCategoryRow[]>([]); // ✅ categories for edit modal
    const [subCategories, setSubCategories] = useState<ApiSubCategoryRow[]>([]);

    // -------------------- Modals --------------------
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState<EditSubCategory>({
        id: null,
        industry_id: "",
        industry_category_id: "",
        industry_subcategory_name: "",
    });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // -------------------- Loaders --------------------
    const [isListing, setIsListing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // -------------------- Pagination --------------------
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = subCategories.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(subCategories.length / recordsPerPage) || 1;

    const handlePageChange = (page: number) => setCurrentPage(page);

    // -------------------- Auth Header --------------------
    const getAuthHeaders = () => {
        const token = localStorage.getItem("artoken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // -------------------- Fetch Industries --------------------
    const fetchIndustries = async () => {
        try {
            const res = await axios.post(`${apiUrl}/IndustryList`, {}, { headers: getAuthHeaders() });

            if (res.data?.success) setIndustries(res.data.data || []);
            else toast.error(res.data?.message || "Failed to fetch industries");
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error fetching industries"));
        }
    };

    // ✅ Fetch Categories by Industry (YOUR NEW API)
    const fetchCategoriesByIndustry = async (
        industry_id: number,
        mode: "form" | "edit" = "form"
    ) => {
        try {
            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-industry`,
                { industry_id },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) {
                const list: ApiCategoryRow[] = res.data.data || [];
                if (mode === "form") setCategories(list);
                else setEditCategories(list);
            } else {
                toast.error(res.data?.message || "Failed to fetch categories");
                if (mode === "form") setCategories([]);
                else setEditCategories([]);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error fetching categories"));
            if (mode === "form") setCategories([]);
            else setEditCategories([]);
        }
    };

    // -------------------- Fetch SubCategories List --------------------
    const fetchSubCategories = async (industry_id = null, industry_subcategory_name = "") => {
        try {
            setIsListing(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories`,
                { industry_id, industry_subcategory_name },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) setSubCategories(res.data.data || []);
            else toast.error(res.data?.message || "Failed to fetch subcategories");
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error fetching subcategories"));
        } finally {
            setIsListing(false);
        }
    };

    useEffect(() => {
        fetchIndustries();
        fetchSubCategories(null, "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ On Industry Change (FORM) -> load categories using your API
    useEffect(() => {
        setCategoryId("");
        if (!industryId) {
            setCategories([]);
            return;
        }
        fetchCategoriesByIndustry(Number(industryId), "form");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [industryId]);

    // -------------------- Save SubCategory --------------------
    const handleSave = async () => {
        if (!industryId) return toast.error("Please select industry");
        if (!categoryId) return toast.error("Please select category");
        if (!subCategoryName.trim()) return toast.error("Please enter subcategory name");

        try {
            setIsSaving(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/store`,
                {
                    industry_id: Number(industryId),
                    industry_category_id: Number(categoryId),
                    industry_subcategory_name: subCategoryName.trim(),
                },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) {
                toast.success(res.data?.message || "Industry subcategory created successfully");

                setIndustryId("");
                setCategoryId("");
                setSubCategoryName("");
                setCurrentPage(1);

                await fetchSubCategories(null, "");
            } else {
                toast.error(res.data?.message || "Failed to add subcategory");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error adding subcategory"));
        } finally {
            setIsSaving(false);
        }
    };

    // -------------------- Edit: open modal using SHOW API --------------------
    const openEdit = async (id: number) => {
        try {
            setIsUpdating(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/show`,
                { id },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status && res.data?.data) {
                const d = res.data.data;

                // ✅ load edit categories by industry (your API)
                if (d.industry_id) {
                    await fetchCategoriesByIndustry(Number(d.industry_id), "edit");
                } else {
                    setEditCategories([]);
                }

                setEditData({
                    id: d.id,
                    industry_id: d.industry_id,
                    industry_category_id: d.industry_category_id,
                    industry_subcategory_name: d.industry_subcategory_name,
                });

                setIsEditOpen(true);
            } else {
                toast.error(res.data?.message || "Failed to load subcategory");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error loading subcategory"));
        } finally {
            setIsUpdating(false);
        }
    };

    // -------------------- Update SubCategory (endpoint assumed) --------------------
    const handleUpdate = async () => {
        if (!editData.id) return toast.error("Invalid subcategory selected");
        if (!editData.industry_id) return toast.error("Please select industry");
        if (!editData.industry_category_id) return toast.error("Please select category");
        if (!editData.industry_subcategory_name.trim()) return toast.error("Please enter subcategory name");

        try {
            setIsUpdating(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/update`,
                {
                    id: Number(editData.id),
                    industry_id: Number(editData.industry_id),
                    industry_category_id: Number(editData.industry_category_id),
                    industry_subcategory_name: editData.industry_subcategory_name.trim(),
                },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) {
                toast.success(res.data?.message || "Updated successfully");
                setIsEditOpen(false);
                await fetchSubCategories(null, "");
            } else {
                toast.error(res.data?.message || "Failed to update subcategory");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error updating subcategory"));
        } finally {
            setIsUpdating(false);
        }
    };

    // -------------------- Delete SubCategory (endpoint assumed) --------------------
    const handleDelete = async (id: number) => {
        try {
            setIsDeleting(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/delete`,
                { id },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) {
                toast.success(res.data?.message || "Deleted successfully");
                setIsDeleteOpen(false);
                await fetchSubCategories(null, "");
            } else {
                toast.error(res.data?.message || "Failed to delete subcategory");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error deleting subcategory"));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-8 p-6">
            {/* LEFT FORM */}
            <div className="w-1/3 bg-white p-6 shadow rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Add SubCategory</h2>

                <label className="font-medium">Industry</label>
                <select
                    value={industryId === "" ? "" : String(industryId)}
                    disabled={isSaving || isListing}
                    onChange={(e) => setIndustryId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                >
                    <option value="">Select industry</option>
                    {industries.map((i) => (
                        <option key={i.id} value={i.id}>
                            {i.name}
                        </option>
                    ))}
                </select>

                <label className="font-medium">Category</label>
                <select
                    value={categoryId === "" ? "" : String(categoryId)}
                    disabled={isSaving || isListing || !industryId}
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                >
                    <option value="">
                        {industryId ? "Select category" : "Select industry first"}
                    </option>

                    {/* ✅ Categories coming from get-by-industry */}
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.industry_category_name}
                        </option>
                    ))}
                </select>

                <label className="font-medium">SubCategory Name</label>
                <input
                    type="text"
                    value={subCategoryName}
                    disabled={isSaving || isListing}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                    placeholder="Enter subcategory"
                    className="w-full border px-3 py-2 rounded mt-1 mb-6 disabled:bg-gray-100"
                />

                <button
                    onClick={handleSave}
                    disabled={isSaving || isListing}
                    className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>

            {/* RIGHT LIST */}
            <div className="w-2/3 bg-white p-6 shadow rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">SubCategory List</h2>
                </div>

                <div className="relative min-h-[230px]">
                    {isListing && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                            <div className="h-10 w-10 border-4 border-gray-300 border-t-[#2e56a6] rounded-full animate-spin" />
                        </div>
                    )}

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3">ID</th>
                                <th className="p-1">Industry</th>
                                <th className="p-1">Category</th>
                                <th className="p-1">SubCategory</th>
                                <th className="p-1">Actions</th>
                            </tr>
                        </thead>

                        <tbody className={isListing ? "opacity-40" : ""}>
                            {currentRecords.length === 0 && !isListing && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No subcategories found
                                    </td>
                                </tr>
                            )}

                            {currentRecords.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-1">{item.industry_name || "-"}</td>
                                    <td className="p-1">{item.industry_category_name || "-"}</td>
                                    <td className="p-1">{item.industry_subcategory_name}</td>

                                    <td className="p-1 flex gap-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                            disabled={isListing || isUpdating}
                                            onClick={() => openEdit(item.id)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </button>

                                        <button
                                            className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                            disabled={isListing || isDeleting}
                                            onClick={() => {
                                                setDeleteId(item.id);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {subCategories.length > 0 && (
                    <div className="flex justify-center items-center mt-4 gap-2">
                        <button
                            disabled={currentPage === 1 || isListing}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`px-3 py-1 rounded border ${currentPage === 1 || isListing
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, idx) => {
                            const page = idx + 1;
                            return (
                                <button
                                    key={page}
                                    disabled={isListing}
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
                            disabled={currentPage === totalPages || isListing}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages || isListing
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsEditOpen(false)}
                                disabled={isUpdating}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <h2 className="text-xl font-semibold mb-4">Edit SubCategory</h2>

                            <label className="font-medium">Industry</label>
                            <select
                                value={editData.industry_id === "" ? "" : String(editData.industry_id)}
                                disabled={isUpdating}
                                onChange={async (e) => {
                                    const v = e.target.value ? Number(e.target.value) : "";
                                    setEditData((p) => ({
                                        ...p,
                                        industry_id: v,
                                        industry_category_id: "",
                                    }));

                                    if (v) await fetchCategoriesByIndustry(Number(v), "edit");
                                    else setEditCategories([]);
                                }}
                                className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                            >
                                <option value="">Select industry</option>
                                {industries.map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.name}
                                    </option>
                                ))}
                            </select>

                            <label className="font-medium">Category</label>
                            <select
                                value={
                                    editData.industry_category_id === ""
                                        ? ""
                                        : String(editData.industry_category_id)
                                }
                                disabled={isUpdating || !editData.industry_id}
                                onChange={(e) => {
                                    const v = e.target.value ? Number(e.target.value) : "";
                                    setEditData((p) => ({
                                        ...p,
                                        industry_category_id: v,
                                    }));
                                }}
                                className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {editData.industry_id ? "Select category" : "Select industry first"}
                                </option>

                                {/* ✅ Edit categories coming from get-by-industry */}
                                {editCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.industry_category_name}
                                    </option>
                                ))}
                            </select>

                            <label className="font-medium">SubCategory</label>
                            <input
                                type="text"
                                value={editData.industry_subcategory_name}
                                disabled={isUpdating}
                                onChange={(e) =>
                                    setEditData((p) => ({
                                        ...p,
                                        industry_subcategory_name: e.target.value,
                                    }))
                                }
                                className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setIsEditOpen(false)}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 py-2 bg-[#2e56a6] text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {isDeleteOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
                        <div
                            className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={isDeleting}
                                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Record</h2>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this subcategory?
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDeleteOpen(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
        </div>
    );
}
