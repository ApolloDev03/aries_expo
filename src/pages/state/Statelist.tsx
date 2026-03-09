import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiUrl } from "../../config";
import { toast } from "react-toastify";

interface ApiState {
    stateId: number;
    stateName: string;
    iStatus?: number;
    iSDelete?: number;
    created_at?: string;
    updated_at?: string;
}

export default function StateMaster() {
    const [stateName, setStateName] = useState("");
    const [searchState, setSearchState] = useState("");
    const [states, setStates] = useState<ApiState[]>([]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editState, setEditState] = useState<ApiState | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // loaders
    const [isListing, setIsListing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const normalizeState = (s: any): ApiState => ({
        stateId: s.stateId ?? s.id,
        stateName: s.stateName,
        iStatus: s.iStatus,
        iSDelete: s.iSDelete,
        created_at: s.created_at,
        updated_at: s.updated_at,
    });

    const getPageNumbers = (current: number, total: number) => {
        const pageNumbers: (number | string)[] = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        }

        pageNumbers.push(1);

        if (current > 3) {
            pageNumbers.push("...");
        }

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (current < total - 2) {
            pageNumbers.push("...");
        }

        pageNumbers.push(total);

        return pageNumbers;
    };

    // ================= API CALLS =================

    const fetchStates = async () => {
        try {
            setIsListing(true);

            let page = 1;
            let lastPage = 1;
            const allStates: ApiState[] = [];

            while (page <= lastPage) {
                const res = await axios.post(`${apiUrl}/statelist`);

                if (res.data?.success) {
                    const { data, last_page } = res.data;
                    allStates.push(...(data || []).map((item: any) => normalizeState(item)));
                    lastPage = last_page ?? page;
                    page++;
                } else {
                    toast.error(res.data?.message || "Failed to load states");
                    break;
                }
            }

            setStates(allStates);
        } catch (error) {
            console.error("Error fetching states:", error);
            toast.error("Error while fetching states");
        } finally {
            setIsListing(false);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchState]);

    // ================= ADD STATE =================

    const handleSave = async () => {
        if (!stateName.trim()) {
            toast.warn("Please enter state name");
            return;
        }

        try {
            setIsSaving(true);

            const res = await axios.post(`${apiUrl}/StateAdd`, {
                stateName: stateName.trim(),
            });

            if (res.data?.success) {
                const newState = normalizeState(res.data.data);

                setStates((prev) => [...prev, newState]);
                setStateName("");
                toast.success(res.data?.message || "State added successfully");
            } else {
                toast.error(res.data?.message || "Failed to add state");
            }
        } catch (error: unknown) {
            console.error("Error adding state:", error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong while adding state"
                );
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong while adding state");
            }
        } finally {
            setIsSaving(false);
        }
    };

    // ================= EDIT STATE =================

    const openEditModal = async (id: number) => {
        try {
            const res = await axios.post(`${apiUrl}/StateShow`, {
                stateId: id,
            });

            if (res.data?.success) {
                const state = normalizeState(res.data.data);
                setEditState(state);
                setIsEditOpen(true);
            } else {
                toast.error(res.data?.message || "Failed to fetch state");
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            toast.error("Error while fetching state detail");
        }
    };

    const handleUpdate = async () => {
        if (!editState) return;

        if (!editState.stateName.trim()) {
            toast.warn("Please enter state name");
            return;
        }

        try {
            setIsUpdating(true);

            const res = await axios.post(`${apiUrl}/StateUpdate`, {
                stateId: editState.stateId,
                stateName: editState.stateName.trim(),
            });

            if (res.data?.success) {
                const updatedState = normalizeState(res.data.data);

                setStates((prev) =>
                    prev.map((item) =>
                        item.stateId === updatedState.stateId ? updatedState : item
                    )
                );

                setIsEditOpen(false);
                toast.success(res.data?.message || "State updated successfully");
            } else {
                toast.error(res.data?.message || "Failed to update state");
            }
        } catch (error: unknown) {
            console.error("Error updating state:", error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong while updating state"
                );
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong while updating state");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // ================= DELETE STATE =================
    // Replace endpoint if your delete API name is different
    const handleDelete = async (id: number) => {
        try {
            setIsDeleting(true);

            const res = await axios.post(`${apiUrl}/StateDelete`, {
                stateId: id,
            });

            if (res.data?.success) {
                setStates((prev) => prev.filter((item) => item.stateId !== id));
                toast.success(res.data?.message || "State deleted successfully");
            } else {
                toast.error(res.data?.message || "Failed to delete state");
            }
        } catch (error) {
            console.error("Error deleting state:", error);
            toast.error("Error while deleting state");
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    // ================= SEARCH + PAGINATION =================

    const filteredStates = states.filter((item) =>
        item.stateName.toLowerCase().includes(searchState.toLowerCase().trim())
    );

    const totalPages = Math.ceil(filteredStates.length / recordsPerPage);
    const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

    const indexOfLastRecord = safeCurrentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredStates.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const pageNumbers = getPageNumbers(safeCurrentPage, totalPages);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="relative">
            <div className="flex gap-8 p-6">
                {/* LEFT: ADD STATE FORM */}
                <div className="w-1/3 bg-white p-6 shadow rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Add State</h2>

                    <label className="font-medium">State</label>
                    <input
                        type="text"
                        value={stateName}
                        disabled={isSaving || isListing}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Enter state name"
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

                {/* RIGHT: STATE LIST */}
                <div className="w-2/3 bg-white p-6 shadow rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">State List</h2>

                    {/* Search */}
                    <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search State"
                            value={searchState}
                            disabled={isListing}
                            onChange={(e) => setSearchState(e.target.value)}
                            className="border px-3 py-2 rounded w-1/3 disabled:bg-gray-100"
                        />
                        <button
                            className="bg-[#2e56a6] text-white px-5 py-2 rounded disabled:bg-gray-400"
                            disabled={isListing}
                        >
                            Search
                        </button>
                    </div>

                    {/* TABLE */}
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
                                    <th className="p-1">State</th>
                                    <th className="p-1">Actions</th>
                                </tr>
                            </thead>

                            <tbody className={isListing ? "opacity-40" : ""}>
                                {currentRecords.map((item, index) => (
                                    <tr key={item.stateId} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{indexOfFirstRecord + index + 1}</td>
                                        <td className="p-1">{item.stateName}</td>
                                        <td className="p-1 flex gap-3">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                                disabled={isListing || isUpdating}
                                                onClick={() => openEditModal(item.stateId)}
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>

                                            <button
                                                className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                                disabled={isListing || isDeleting}
                                                onClick={() => {
                                                    setDeleteId(item.stateId);
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
                                        <td colSpan={3} className="text-center py-6 text-gray-500">
                                            No records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex flex-wrap justify-center items-center mt-4 gap-2">
                        <button
                            disabled={safeCurrentPage === 1 || isListing}
                            onClick={() => handlePageChange(safeCurrentPage - 1)}
                            className={`px-3 py-1 rounded border ${safeCurrentPage === 1 || isListing
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Prev
                        </button>

                        {pageNumbers.map((page, index) =>
                            page === "..." ? (
                                <span
                                    key={`dots-${index}`}
                                    className="px-3 py-1 text-gray-500 select-none"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    disabled={isListing}
                                    onClick={() => handlePageChange(Number(page))}
                                    className={`px-3 py-1 rounded border min-w-[40px] ${safeCurrentPage === page
                                            ? "bg-[#2e56a6] text-white"
                                            : "bg-white hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            disabled={safeCurrentPage === totalPages || totalPages === 0 || isListing}
                            onClick={() => handlePageChange(safeCurrentPage + 1)}
                            className={`px-3 py-1 rounded border ${safeCurrentPage === totalPages || totalPages === 0 || isListing
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>

              

                    {/* EDIT MODAL */}
                    {isEditOpen && editState && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
                            <div
                                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Edit State</h2>

                                    <button
                                        onClick={() => setIsEditOpen(false)}
                                        disabled={isUpdating}
                                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                        aria-label="Close"
                                    >
                                        ×
                                    </button>
                                </div>

                                <label className="font-medium">State</label>
                                <input
                                    type="text"
                                    value={editState.stateName}
                                    disabled={isUpdating}
                                    onChange={(e) =>
                                        setEditState({ ...editState, stateName: e.target.value })
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

                    {/* DELETE CONFIRMATION POPUP */}
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
                                    Are you sure you want to delete the record?
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
        </div>
    );
}