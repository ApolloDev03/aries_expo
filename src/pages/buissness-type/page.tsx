import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

interface BusinessType {
    id: number;
    strBusinessType: string;
    iStatus?: number;
    created_at?: string;
    updated_at?: string;
}

interface EditBusinessType {
    id: number | null;
    strBusinessType: string;
}


export default function BusinessTypeMaster() {
    const [strBusinessType, setStrBusinessType] = useState("");
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState<EditBusinessType>({
        id: null,
        strBusinessType: "",
    });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // loaders
    const [isListing, setIsListing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ---------- Helper: Auth Header ----------
    // (keep your old token logic; if your API doesn't need token, this still won't break)
    const getAuthHeaders = () => {
        const token = localStorage.getItem("artoken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ✅ axios instance (optional, but cleaner)
    const api = useMemo(() => {
        return axios.create({
            baseURL: `${apiUrl}/business-types`,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }, []);

    // ---------- Fetch List ----------
    const fetchBusinessTypes = async () => {
        try {
            setIsListing(true);
            const res = await api.post(
                `${apiUrl}/business-types/index`,
                {},
                { headers: getAuthHeaders() }
            );

            if (res.data?.success) {
                setBusinessTypes(res.data.data || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch business types");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error fetching business types");
        } finally {
            setIsListing(false);
        }
    };

    useEffect(() => {
        fetchBusinessTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------- Add Business Type ----------
    const handleSave = async () => {
        if (!strBusinessType.trim()) {
            toast.error("Please enter business type");
            return;
        }

        try {
            setIsSaving(true);

            const res = await api.post(
                `${apiUrl}/business-types/store`,
                { strBusinessType: strBusinessType.trim() },
                { headers: getAuthHeaders() }
            );

            if (res.data?.success) {
                toast.success(res.data.message || "Business Type added");

                // API returns created object in res.data.data
                const created = res.data.data as BusinessType;

                // add to list (or refetch if you prefer)
                setBusinessTypes((prev) => [created, ...prev]);
                setStrBusinessType("");
            } else {
                toast.error(res.data?.message || "Failed to add business type");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error adding business type");
        } finally {
            setIsSaving(false);
        }
    };

    // ---------- Update Business Type ----------
    const handleUpdate = async () => {
        if (!editData.id) {
            toast.error("Invalid business type selected");
            return;
        }
        if (!editData.strBusinessType.trim()) {
            toast.error("Please enter business type");
            return;
        }

        try {
            setIsUpdating(true);

            const res = await api.post(
                `/update`,
                {
                    id: editData.id,
                    strBusinessType: editData.strBusinessType.trim(),
                },
                { headers: getAuthHeaders() }
            );

            if (res.data?.success) {
                toast.success(res.data.message || "Business Type updated");

                setBusinessTypes((prev) =>
                    prev.map((item) =>
                        item.id === editData.id
                            ? { ...item, strBusinessType: editData.strBusinessType.trim() }
                            : item
                    )
                );

                setIsEditOpen(false);
            } else {
                toast.error(res.data?.message || "Failed to update business type");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error updating business type");
        } finally {
            setIsUpdating(false);
        }
    };

    // ---------- Delete Business Type ----------
    const handleDelete = async (id: number) => {
        try {
            setIsDeleting(true);

            const res = await api.post(
                `/delete`,
                { id },
                { headers: getAuthHeaders() }
            );

            if (res.data?.success) {
                toast.success(res.data.message || "Business Type deleted");
                setBusinessTypes((prev) => prev.filter((item) => item.id !== id));
            } else {
                toast.error(res.data?.message || "Failed to delete business type");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error deleting business type");
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    // ---------- Pagination ----------
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = businessTypes.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(businessTypes.length / recordsPerPage) || 1;

    const handlePageChange = (page: number) => setCurrentPage(page);

    // if list shrinks (delete), keep page valid
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    return (
        <div className="flex gap-8 p-6">
            {/* LEFT FORM */}
            <div className="w-1/3 bg-white p-6 shadow rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Add Business Type</h2>

                <label className="font-medium">Business Type</label>
                <input
                    type="text"
                    value={strBusinessType}
                    disabled={isSaving || isListing}
                    onChange={(e) => setStrBusinessType(e.target.value)}
                    placeholder="Enter business type"
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
                    <h2 className="text-xl font-semibold">Business Type List</h2>
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
                                <th className="p-3">Sr. No</th>
                                <th className="p-1">Business Type</th>
                                <th className="p-1">Actions</th>
                            </tr>
                        </thead>

                        <tbody className={isListing ? "opacity-40" : ""}>
                            {currentRecords.length === 0 && !isListing && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-gray-500">
                                        No business types found
                                    </td>
                                </tr>
                            )}

                            {currentRecords.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{indexOfFirstRecord + index + 1}</td>
                                    <td className="p-1">{item.strBusinessType}</td>

                                    <td className="p-1 flex gap-3">
                                        {/* Edit */}
                                        <button
                                            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                            disabled={isListing || isUpdating}
                                            onClick={() => {
                                                setEditData({ id: item.id, strBusinessType: item.strBusinessType });
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
                {businessTypes.length > 0 && (
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

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
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

                            <h2 className="text-xl font-semibold mb-4">Edit Business Type</h2>

                            <label className="font-medium">Business Type</label>
                            <input
                                type="text"
                                value={editData.strBusinessType}
                                disabled={isUpdating}
                                onChange={(e) =>
                                    setEditData({ ...editData, strBusinessType: e.target.value })
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
                                Are you sure you want to delete this business type?
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
