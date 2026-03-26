// // import { useEffect, useState } from "react";
// import axios from "axios";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";
// import { useEffect, useState } from "react";

// type ApiCategory = {
//     id: number;
//     strVisitorCategory: string;
//     strIP?: string;
//     iStatus?: number;
//     isDelete?: number;
//     entry_by?: number;
//     created_at?: string;
//     updated_at?: string;
// };

// interface Category {
//     id: number;
//     name: string;
// }

// interface EditCategory {
//     id: number | null;
//     name: string;
// }

// function getApiErrorMessage(data: any, fallback = "Something went wrong") {
//     if (!data) return fallback;
//     if (typeof data === "string") return data;
//     if (data.message) return data.message;
//     if (data.error) return data.error;

//     if (data.errors && typeof data.errors === "object") {
//         const msgs: string[] = [];
//         Object.values(data.errors).forEach((v: any) => {
//             if (Array.isArray(v)) msgs.push(...v.map(String));
//             else if (typeof v === "string") msgs.push(v);
//         });
//         if (msgs.length) return msgs.join(" | ");
//     }
//     return fallback;
// }

// export default function VisitorCategoryMaster() {
//     const [name, setName] = useState("");
//     const [categories, setCategories] = useState<Category[]>([]);

//     const [isEditOpen, setIsEditOpen] = useState(false);
//     const [editData, setEditData] = useState<EditCategory>({ id: null, name: "" });

//     const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//     const [deleteId, setDeleteId] = useState<number | null>(null);

//     // loaders
//     const [isListing, setIsListing] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [search, setSearch] = useState("");


//     // ✅ LIVE API endpoints (as per your message)
//     const API = {
//         LIST: `${apiUrl}/visitor-category/index`,
//         SHOW: `${apiUrl}/visitor-category/show`,
//         UPDATE: `${apiUrl}/visitor-category/update`,
//         ADD: `${apiUrl}/visitor-category/store`,
//         DELETE: `${apiUrl}/visitor-category/delete`,
//     };

//     // auth header
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem("artoken");
//         return token ? { Authorization: `Bearer ${token}` } : {};
//     };

//     const mapApiToUi = (row: ApiCategory): Category => ({
//         id: row.id,
//         name: row.strVisitorCategory,
//     });

//     // ✅ fetch list (UPDATED)
//     const fetchCategories = async () => {
//         try {
//             setIsListing(true);
//             const res = await axios.post(API.LIST, {}, { headers: getAuthHeaders() });

//             // ✅ your LIST response is { status: true, data: [...] }
//             if (res.data?.status) {
//                 const list: ApiCategory[] = res.data?.data || [];
//                 setCategories(list.map(mapApiToUi));
//             } else {
//                 toast.error(res.data?.message || "Failed to fetch categories");
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error(getApiErrorMessage(error?.response?.data, "Error fetching categories"));
//         } finally {
//             setIsListing(false);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     // ✅ add (keep as is, only changed success check to .status)
//     const handleSave = async () => {
//         if (!name.trim()) {
//             toast.error("Please enter category name");
//             return;
//         }

//         try {
//             setIsSaving(true);

//             const payload = {
//                 strVisitorCategory: name.trim(),
//                 // entry_by: 3, // add if your backend requires it
//             };

//             const res = await axios.post(API.ADD, payload, {
//                 headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
//             });

//             if (res.data?.status) {
//                 toast.success(res.data?.message || "Visitor category added");

//                 const created: ApiCategory | undefined = res.data?.data;
//                 if (created?.id) {
//                     setCategories((prev) => [...prev, mapApiToUi(created)]);
//                 } else {
//                     fetchCategories();
//                 }

//                 setName("");
//             } else {
//                 toast.error(getApiErrorMessage(res.data, "Failed to add category"));
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error(getApiErrorMessage(error?.response?.data, "Error adding category"));
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     // ✅ open edit (use SHOW api to load fresh data)
//     const openEdit = async (id: number) => {
//         try {
//             setIsUpdating(true); // reuse spinner while fetching show
//             const res = await axios.post(
//                 API.SHOW,
//                 { id },
//                 { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
//             );

//             if (res.data?.status) {
//                 const row: ApiCategory | undefined = res.data?.data;
//                 setEditData({
//                     id: row?.id ?? id,
//                     name: row?.strVisitorCategory ?? "",
//                 });
//                 setIsEditOpen(true);
//             } else {
//                 toast.error(res.data?.message || "Failed to load category");
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error(getApiErrorMessage(error?.response?.data, "Error loading category"));
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     // ✅ update (UPDATED)
//     const handleUpdate = async () => {
//         if (!editData.id) {
//             toast.error("Invalid category selected");
//             return;
//         }
//         if (!editData.name.trim()) {
//             toast.error("Please enter category name");
//             return;
//         }

//         try {
//             setIsUpdating(true);

//             const res = await axios.post(
//                 API.UPDATE,
//                 {
//                     id: editData.id,
//                     strVisitorCategory: editData.name.trim(),
//                 },
//                 { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
//             );

//             // ✅ update response: { status:true, message:"..." }
//             if (res.data?.status) {
//                 toast.success(res.data?.message || "Visitor category updated successfully");

//                 // ✅ update list locally
//                 setCategories((prev) =>
//                     prev.map((item) =>
//                         item.id === editData.id ? { ...item, name: editData.name.trim() } : item
//                     )
//                 );

//                 setIsEditOpen(false);
//             } else {
//                 toast.error(getApiErrorMessage(res.data, "Failed to update category"));
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error(getApiErrorMessage(error?.response?.data, "Error updating category"));
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     // delete (kept as is - you didn’t share delete API)
//     const handleDelete = async (id: number) => {
//         try {
//             setIsDeleting(true);

//             const res = await axios.post(
//                 API.DELETE,
//                 { id },
//                 { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
//             );

//             if (res.data?.status || res.data?.success) {
//                 toast.success(res.data?.message || "Category deleted");
//                 setCategories((prev) => prev.filter((item) => item.id !== id));
//             } else {
//                 toast.error(getApiErrorMessage(res.data, "Failed to delete category"));
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error(getApiErrorMessage(error?.response?.data, "Error deleting category"));
//         } finally {
//             setIsDeleting(false);
//             setIsDeleteOpen(false);
//         }
//     };

//     // ✅ filter categories by search text
//     const filteredCategories = categories.filter((c) =>
//         c.name.toLowerCase().includes(search.trim().toLowerCase())
//     );

//     // pagination
//     const [currentPage, setCurrentPage] = useState(1);
//     const recordsPerPage = 10;

//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

//     const currentRecords = filteredCategories.slice(indexOfFirstRecord, indexOfLastRecord);
//     const totalPages = Math.ceil(filteredCategories.length / recordsPerPage) || 1;

//     const handlePageChange = (page: number) => setCurrentPage(page);

//     // ✅ if search reduces results and current page becomes invalid
//     useEffect(() => {
//         const maxPage = Math.ceil(filteredCategories.length / recordsPerPage) || 1;
//         if (currentPage > maxPage) setCurrentPage(maxPage);
//     }, [filteredCategories.length, currentPage]);


//     return (
//         <div className="flex gap-8 p-6">
//             {/* LEFT FORM */}
//             <div className="w-1/3 bg-white p-6 shadow rounded-xl">
//                 <h2 className="text-xl font-semibold mb-4">Add Visitor Category</h2>

//                 <label className="font-medium">Category Name</label>
//                 <input
//                     type="text"
//                     value={name}
//                     disabled={isSaving || isListing}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Enter category name"
//                     className="w-full border px-3 py-2 rounded mt-1 mb-6 disabled:bg-gray-100"
//                 />

//                 <button
//                     onClick={handleSave}
//                     disabled={isSaving || isListing}
//                     className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e] disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                     {isSaving ? "Saving..." : "Save"}
//                 </button>
//             </div>

//             {/* RIGHT LIST */}
//             <div className="w-2/3 bg-white p-6 shadow rounded-xl">

//                 <div className="flex justify-between items-center mb-4 gap-3">
//                     <h2 className="text-xl font-semibold">Visitor Category List</h2>

//                     <input
//                         type="text"
//                         value={search}
//                         onChange={(e) => {
//                             setSearch(e.target.value);
//                             setCurrentPage(1);
//                         }}
//                         placeholder="Search category..."
//                         className="w-[260px] border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#2e56a6]"
//                         disabled={isListing}
//                     />
//                 </div>


//                 <div className="relative min-h-[230px]">
//                     {isListing && (
//                         <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
//                             <div className="h-10 w-10 border-4 border-gray-300 border-t-[#2e56a6] rounded-full animate-spin" />
//                         </div>
//                     )}

//                     <table className="w-full border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 text-left">
//                                 <th className="p-3 w-[90px]">Sr.No</th>
//                                 <th className="p-3">Category Name</th>
//                                 <th className="p-3 w-[120px]">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody className={isListing ? "opacity-40" : ""}>
//                             {currentRecords.length === 0 && !isListing && (
//                                 <tr>
//                                     <td colSpan={3} className="p-4 text-center text-gray-500">
//                                         No categories found
//                                     </td>
//                                 </tr>
//                             )}

//                             {currentRecords.map((item, index) => (
//                                 <tr key={item.id} className="border-b hover:bg-gray-50">
//                                     <td className="p-3">{indexOfFirstRecord + index + 1}</td>
//                                     <td className="p-3">{item.name}</td>

//                                     <td className="p-3">
//                                         <div className="flex gap-3">
//                                             {/* ✅ Edit uses SHOW api */}
//                                             <button
//                                                 className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
//                                                 disabled={isListing || isUpdating}
//                                                 onClick={() => openEdit(item.id)}
//                                                 title="Edit"
//                                             >
//                                                 <EditIcon fontSize="small" />
//                                             </button>

//                                             {/* Delete */}
//                                             <button
//                                                 className="text-red-600 hover:text-red-800 disabled:text-gray-400"
//                                                 disabled={isListing || isDeleting}
//                                                 onClick={() => {
//                                                     setDeleteId(item.id);
//                                                     setIsDeleteOpen(true);
//                                                 }}
//                                                 title="Delete"
//                                             >
//                                                 <DeleteIcon fontSize="small" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 {categories.length > 0 && (
//                     <div className="flex justify-center items-center mt-4 gap-2">
//                         <button
//                             disabled={currentPage === 1 || isListing}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className={`px-3 py-1 rounded border ${currentPage === 1 || isListing
//                                 ? "bg-gray-200 cursor-not-allowed"
//                                 : "bg-white hover:bg-gray-100"
//                                 }`}
//                         >
//                             Prev
//                         </button>

//                         {[...Array(totalPages)].map((_, index) => {
//                             const page = index + 1;
//                             return (
//                                 <button
//                                     key={page}
//                                     disabled={isListing}
//                                     onClick={() => handlePageChange(page)}
//                                     className={`px-3 py-1 rounded border ${currentPage === page ? "bg-[#2e56a6] text-white" : "bg-white hover:bg-gray-100"
//                                         }`}
//                                 >
//                                     {page}
//                                 </button>
//                             );
//                         })}

//                         <button
//                             disabled={currentPage === totalPages || isListing}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className={`px-3 py-1 rounded border ${currentPage === totalPages || isListing
//                                 ? "bg-gray-200 cursor-not-allowed"
//                                 : "bg-white hover:bg-gray-100"
//                                 }`}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 )}

//                 {/* Edit Modal */}
//                 {isEditOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
//                         <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative" onClick={(e) => e.stopPropagation()}>
//                             <button
//                                 onClick={() => setIsEditOpen(false)}
//                                 className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                                 aria-label="Close"
//                                 disabled={isUpdating}
//                             >
//                                 ×
//                             </button>

//                             <h2 className="text-xl font-semibold mb-4">Edit Visitor Category</h2>

//                             <label className="font-medium">Category Name</label>
//                             <input
//                                 type="text"
//                                 value={editData.name}
//                                 disabled={isUpdating}
//                                 onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//                                 className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
//                             />

//                             <div className="flex justify-end gap-3">
//                                 <button
//                                     className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                                     onClick={() => setIsEditOpen(false)}
//                                     disabled={isUpdating}
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     className="px-4 py-2 bg-[#2e56a6] text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                                     onClick={handleUpdate}
//                                     disabled={isUpdating}
//                                 >
//                                     {isUpdating ? "Updating..." : "Update"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Delete Modal */}
//                 {isDeleteOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
//                         <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative" onClick={(e) => e.stopPropagation()}>
//                             <button
//                                 onClick={() => setIsDeleteOpen(false)}
//                                 className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                                 aria-label="Close"
//                                 disabled={isDeleting}
//                             >
//                                 ×
//                             </button>

//                             <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Record</h2>

//                             <p className="text-gray-600 mb-6">Are you sure you want to delete this category?</p>

//                             <div className="flex justify-center gap-4">
//                                 <button
//                                     className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
//                                     onClick={() => setIsDeleteOpen(false)}
//                                     disabled={isDeleting}
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                                     onClick={() => {
//                                         if (deleteId !== null) handleDelete(deleteId);
//                                     }}
//                                     disabled={isDeleting}
//                                 >
//                                     {isDeleting ? "Deleting..." : "Delete"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

type ApiCategory = {
    id: number;
    strVisitorCategory: string;
    industry_id?: number | string;
    industry_name?: string;
    IndustryName?: string;
    strIndustryName?: string;
    strIP?: string;
    iStatus?: number;
    isDelete?: number;
    entry_by?: number;
    created_at?: string;
    updated_at?: string;
};

type ApiIndustry = {
    id: number;
    industry_id?: number;
    name?: string;
    title?: string;
    strIndustryName?: string;
    industry_name?: string;
};

interface Industry {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    industryId: number | null;
    industryName: string;
}

interface EditCategory {
    id: number | null;
    name: string;
    industryId: number | null;
}

function getApiErrorMessage(data: any, fallback = "Something went wrong") {
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

export default function VisitorCategoryMaster() {
    const [name, setName] = useState("");
    const [industryId, setIndustryId] = useState<string>("");
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState<EditCategory>({
        id: null,
        name: "",
        industryId: null,
    });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [isListing, setIsListing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [search, setSearch] = useState("");

    const API = {
        LIST: `${apiUrl}/visitor-category/index`,
        SHOW: `${apiUrl}/visitor-category/show`,
        UPDATE: `${apiUrl}/visitor-category/update`,
        ADD: `${apiUrl}/visitor-category/store`,
        DELETE: `${apiUrl}/visitor-category/delete`,
        INDUSTRY_LIST: `${apiUrl}/IndustryList`,
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem("artoken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const mapIndustryToUi = (row: ApiIndustry): Industry => ({
        id: Number(row.id ?? row.industry_id ?? 0),
        name:
            row.name ||
            row.title ||
            row.strIndustryName ||
            row.industry_name ||
            `Industry ${row.id}`,
    });

    const mapApiToUi = (row: ApiCategory): Category => ({
        id: row.id,
        name: row.strVisitorCategory,
        industryId: row.industry_id ? Number(row.industry_id) : null,
        industryName:
            row.industry_name ||
            row.IndustryName ||
            row.strIndustryName ||
            "",
    });

    const getIndustryNameById = (id: number | null) => {
        if (!id) return "";
        return industries.find((item) => Number(item.id) === Number(id))?.name || "";
    };

    const fetchIndustries = async () => {
        try {
            setIsListing(true);

            const res = await axios.post(
                API.INDUSTRY_LIST,
                {},
                { headers: getAuthHeaders() }
            );

            if (res.data?.success) {
                const list: ApiIndustry[] = res.data?.data || [];
                setIndustries(list.map(mapIndustryToUi));
            } else {
                toast.error(res.data?.message || "Failed to fetch industries");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error?.response?.data, "Error fetching industries"));
        } finally {
            setIsListing(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setIsListing(true);
            const res = await axios.post(API.LIST, {}, { headers: getAuthHeaders() });

            if (res.data?.status) {
                const list: ApiCategory[] = res.data?.data || [];
                setCategories(list.map(mapApiToUi));
            } else {
                toast.error(res.data?.message || "Failed to fetch categories");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error?.response?.data, "Error fetching categories"));
        } finally {
            setIsListing(false);
        }
    };

    useEffect(() => {
        fetchIndustries();
        fetchCategories();
    }, []);

    const handleSave = async () => {
        if (!industryId) {
            toast.error("Please select industry");
            return;
        }

        if (!name.trim()) {
            toast.error("Please enter category name");
            return;
        }

        try {
            setIsSaving(true);

            const payload = {
                industry_id: Number(industryId),
                strVisitorCategory: name.trim(),
            };

            const res = await axios.post(API.ADD, payload, {
                headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
            });

            if (res.data?.status) {
                toast.success(res.data?.message || "Visitor category added");

                const created: ApiCategory | undefined = res.data?.data;
                if (created?.id) {
                    setCategories((prev) => [...prev, mapApiToUi(created)]);
                } else {
                    fetchCategories();
                }

                setName("");
                setIndustryId("");
            } else {
                toast.error(getApiErrorMessage(res.data, "Failed to add category"));
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error?.response?.data, "Error adding category"));
        } finally {
            setIsSaving(false);
        }
    };

    const openEdit = async (id: number) => {
        try {
            setIsUpdating(true);

            const res = await axios.post(
                API.SHOW,
                { id },
                { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
            );

            if (res.data?.status) {
                const row: ApiCategory | undefined = res.data?.data;

                setEditData({
                    id: row?.id ?? id,
                    name: row?.strVisitorCategory ?? "",
                    industryId: row?.industry_id ? Number(row.industry_id) : null,
                });

                setIsEditOpen(true);
            } else {
                toast.error(res.data?.message || "Failed to load category");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error?.response?.data, "Error loading category"));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdate = async () => {
        if (!editData.id) {
            toast.error("Invalid category selected");
            return;
        }

        if (!editData.industryId) {
            toast.error("Please select industry");
            return;
        }

        if (!editData.name.trim()) {
            toast.error("Please enter category name");
            return;
        }

        try {
            setIsUpdating(true);

            const payload = {
                id: editData.id,
                industry_id: Number(editData.industryId),
                strVisitorCategory: editData.name.trim(),
            };

            const res = await axios.post(API.UPDATE, payload, {
                headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
            });

            if (res.data?.status) {
                toast.success(res.data?.message || "Visitor category updated successfully");

                setCategories((prev) =>
                    prev.map((item) =>
                        item.id === editData.id
                            ? {
                                ...item,
                                name: editData.name.trim(),
                                industryId: Number(editData.industryId),
                                industryName: getIndustryNameById(Number(editData.industryId)),
                            }
                            : item
                    )
                );

                setIsEditOpen(false);
            } else {
                toast.error(getApiErrorMessage(res.data, "Failed to update category"));
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error?.response?.data, "Error updating category"));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setIsDeleting(true);

            const res = await axios.post(
                API.DELETE,
                { id },
                { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
            );

            if (res.data?.status || res.data?.success) {
                toast.success(res.data?.message || "Category deleted");
                setCategories((prev) => prev.filter((item) => item.id !== id));
            } else {
                toast.error(getApiErrorMessage(res.data, "Failed to delete category"));
            }
        } catch (error: any) {
            console.error(error);
            toast.error(getApiErrorMessage(error?.response?.data, "Error deleting category"));
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    const filteredCategories = categories.filter((c) => {
        const q = search.trim().toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            c.industryName.toLowerCase().includes(q)
        );
    });

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredCategories.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCategories.length / recordsPerPage) || 1;

    const handlePageChange = (page: number) => setCurrentPage(page);

    useEffect(() => {
        const maxPage = Math.ceil(filteredCategories.length / recordsPerPage) || 1;
        if (currentPage > maxPage) setCurrentPage(maxPage);
    }, [filteredCategories.length, currentPage]);

    return (
        <div className="flex gap-8 p-6">
            {/* LEFT FORM */}
            <div className="w-1/3 bg-white p-6 shadow rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Add Visitor Category</h2>

                <label className="font-medium">Industry</label>
                <select
                    value={industryId}
                    disabled={isSaving || isListing}
                    onChange={(e) => setIndustryId(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                >
                    <option value="">Select industry</option>
                    {industries.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <label className="font-medium">Category Name</label>
                <input
                    type="text"
                    value={name}
                    disabled={isSaving || isListing}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
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
                <div className="flex justify-between items-center mb-4 gap-3">
                    <h2 className="text-xl font-semibold">Visitor Category List</h2>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search category or industry..."
                        className="w-[260px] border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#2e56a6]"
                        disabled={isListing}
                    />
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
                                <th className="p-3 w-[90px]">Sr.No</th>
                                <th className="p-3">Industry</th>
                                <th className="p-3">Category Name</th>
                                <th className="p-3 w-[120px]">Actions</th>
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
                                    <td className="p-3">{indexOfFirstRecord + index + 1}</td>
                                    <td className="p-3">{item.industryName || "-"}</td>
                                    <td className="p-3">{item.name}</td>

                                    <td className="p-3">
                                        <div className="flex gap-3">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                                disabled={isListing || isUpdating}
                                                onClick={() => openEdit(item.id)}
                                                title="Edit"
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
                                                title="Delete"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                                disabled={isUpdating}
                            >
                                ×
                            </button>

                            <h2 className="text-xl font-semibold mb-4">Edit Visitor Category</h2>

                            <label className="font-medium">Industry</label>
                            <select
                                value={editData.industryId ?? ""}
                                disabled={isUpdating}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        industryId: e.target.value ? Number(e.target.value) : null,
                                    })
                                }
                                className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                            >
                                <option value="">Select industry</option>
                                {industries.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <label className="font-medium">Category Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                disabled={isUpdating}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
                                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                                disabled={isDeleting}
                            >
                                ×
                            </button>

                            <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Record</h2>

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