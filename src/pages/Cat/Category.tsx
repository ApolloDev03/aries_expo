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

type ApiIndustryCategoryRow = {
    id: number;
    industry_id: number;
    industry_category_name: string;
    industry_name?: string;
    isDelete?: number;
    iStatus?: number;
    entry_by?: number;
    created_at?: string;
    updated_at?: string;
};

interface EditCategory {
    id: number | null;
    industry_id: number | "";
    industry_category_name: string;
}

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

export default function IndustryCategoryMaster() {
    // -------------------- Form State --------------------
    const [industryId, setIndustryId] = useState<number | "">("");
    const [categoryName, setCategoryName] = useState("");

    // -------------------- Data State --------------------
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [categories, setCategories] = useState<ApiIndustryCategoryRow[]>([]);

    // -------------------- Modals --------------------
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState<EditCategory>({
        id: null,
        industry_id: "",
        industry_category_name: "",
    });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // -------------------- Loaders --------------------
    const [isListing, setIsListing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // -------------------- Auth Header --------------------
    const getAuthHeaders = () => {
        const token = localStorage.getItem("artoken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

  
    // -------------------- Fetch Industries --------------------
    const fetchIndustries = async () => {
        try {
            const res = await axios.post(
                `${apiUrl}/IndustryList`,
                {},
                { headers: getAuthHeaders() }
            );

            if (res.data?.success) {
                setIndustries(res.data.data || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch industries");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error fetching industries"));
        }
    };

    // -------------------- Fetch Categories --------------------
    const fetchCategories = async () => {
        try {
            setIsListing(true);

            const res = await axios.post(
                `${apiUrl}/industry-categories`,
                {},
                { headers: getAuthHeaders() }
            );

            // ✅ your API uses "status"
            if (res.data?.status) {
                setCategories(res.data.data || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch categories");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error fetching categories"));
        } finally {
            setIsListing(false);
        }
    };

    useEffect(() => {
        fetchIndustries();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -------------------- Add Category --------------------
    const handleSave = async () => {
        if (!industryId) {
            toast.error("Please select industry");
            return;
        }
        if (!categoryName.trim()) {
            toast.error("Please enter category name");
            return;
        }

        try {
            setIsSaving(true);

            const res = await axios.post(
                `${apiUrl}/industry-categories/store`,
                {
                    industry_id: Number(industryId),
                    industry_category_name: categoryName.trim(),
                },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) {
                toast.success(res.data?.message || "Industry category created");

                // ✅ clear form
                setCategoryName("");
                setIndustryId("");

                // ✅ reset pagination to page 1 (optional but recommended)
                setCurrentPage(1);

                // ✅ IMPORTANT: call listing API again and fetch fresh data
                await fetchCategories();
            } else {
                toast.error(res.data?.message || "Failed to add category");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error adding category"));
        } finally {
            setIsSaving(false);
        }
    };


    // -------------------- Update Category --------------------
    const handleUpdate = async () => {
        if (!editData.id) {
            toast.error("Invalid category selected");
            return;
        }
        if (!editData.industry_id) {
            toast.error("Please select industry");
            return;
        }
        if (!editData.industry_category_name.trim()) {
            toast.error("Please enter category name");
            return;
        }

        try {
            setIsUpdating(true);

            const res = await axios.post(
                `${apiUrl}/industry-categories/update`,
                {
                    id: Number(editData.id),
                    industry_id: Number(editData.industry_id),
                    industry_category_name: editData.industry_category_name.trim(),
                },
                { headers: getAuthHeaders() }
            );

            if (res.data?.status) {
                toast.success(res.data?.message || "Updated successfully");

                const updated = res.data?.data;

                setCategories((prev) =>
                    prev.map((row) =>
                        row.id === editData.id
                            ? {
                                ...row,
                                industry_id: Number(editData.industry_id),
                                industry_category_name: editData.industry_category_name.trim(),
                                industry_name:
                                    industries.find((i) => i.id === Number(editData.industry_id))
                                        ?.name ?? row.industry_name,
                                updated_at: updated?.updated_at ?? row.updated_at,
                            }
                            : row
                    )
                );

                setIsEditOpen(false);
            } else {
                toast.error(res.data?.message || "Failed to update category");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error updating category"));
        } finally {
            setIsUpdating(false);
        }
    };

    // -------------------- Delete Category --------------------
    const handleDelete = async (id: number) => {
        try {
            setIsDeleting(true);

            // ❗ Replace endpoint if different
            const res = await axios.post(
                `${apiUrl}/industry-categories/delete`,
                { id },
                { headers: getAuthHeaders() }
            );

            // assume backend uses status:true
            if (res.data?.status) {
                toast.success(res.data?.message || "Deleted successfully");
                setCategories((prev) => prev.filter((c) => c.id !== id));
            } else {
                toast.error(res.data?.message || "Failed to delete category");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error, "Error deleting category"));
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    // -------------------- Pagination --------------------
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = categories.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(categories.length / recordsPerPage) || 1;

    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <div className="flex gap-8 p-6">
            {/* LEFT FORM */}
            <div className="w-1/3 bg-white p-6 shadow rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Add Industry Category</h2>

                <label className="font-medium">Industry</label>
                <select
                    value={industryId === "" ? "" : String(industryId)}
                    disabled={isSaving || isListing}
                    onChange={(e) => {
                        const v = e.target.value;
                        setIndustryId(v ? Number(v) : "");
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

                <label className="font-medium">Category Name</label>
                <input
                    type="text"
                    value={categoryName}
                    disabled={isSaving || isListing}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category"
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
                    <h2 className="text-xl font-semibold">Industry Category List</h2>
                </div>

                {/* TABLE + LOCAL LOADER */}
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
                                <th className="p-1">Actions</th>
                            </tr>
                        </thead>

                        <tbody className={isListing ? "opacity-40" : ""}>
                            {currentRecords.length === 0 && !isListing && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            )}

                            {currentRecords.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-1">{item.industry_name || "-"}</td>
                                    <td className="p-1">{item.industry_category_name}</td>

                                    <td className="p-1 flex gap-3">
                                        {/* Edit */}
                                        <button
                                            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                            disabled={isListing || isUpdating}
                                            onClick={() => {
                                                setEditData({
                                                    id: item.id,
                                                    industry_id: item.industry_id,
                                                    industry_category_name: item.industry_category_name,
                                                });
                                                setIsEditOpen(true);
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </button>

                                        {/* Delete */}
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
                {categories.length > 0 && (
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

                            <h2 className="text-xl font-semibold mb-4">Edit Industry Category</h2>

                            <label className="font-medium">Industry</label>
                            <select
                                value={editData.industry_id === "" ? "" : String(editData.industry_id)}
                                disabled={isUpdating}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setEditData((p) => ({ ...p, industry_id: v ? Number(v) : "" }));
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
                            <input
                                type="text"
                                value={editData.industry_category_name}
                                disabled={isUpdating}
                                onChange={(e) =>
                                    setEditData((p) => ({ ...p, industry_category_name: e.target.value }))
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

                            <h2 className="text-xl font-semibold text-red-600 mb-2">
                                Delete Record
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this category?
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
