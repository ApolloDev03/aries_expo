// import { useEffect, useState } from "react";
// import axios from "axios";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { toast } from "react-toastify";

// interface Department {
//   id: number;
//   name: string;
// }

// interface EditDepartment {
//   id: number | null;
//   name: string;
// }

// const apiUrl = "https://getdemo.in/aries_software/api";

// export default function DepartmentMaster() {
//   const [name, setName] = useState("");
//   const [departments, setDepartments] = useState<Department[]>([]);

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editData, setEditData] = useState<EditDepartment>({
//     id: null,
//     name: "",
//   });

//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const [loading, setLoading] = useState(false);

//   // ---------- Helper: Auth Header ----------
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("artoken");
//     return token
//       ? {
//         Authorization: `Bearer ${token}`,
//       }
//       : {};
//   };

//   // ---------- Fetch Department List ----------
//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `${apiUrl}/DepartList`,
//         {},
//         { headers: getAuthHeaders() }
//       );

//       if (res.data?.success) {
//         // API returns { id, name, created_at, updated_at }
//         setDepartments(res.data.data || []);
//       } else {
//         toast.error(res.data?.message || "Failed to fetch departments");
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error("Error fetching departments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   // (Optional) Fetch single department by id via Departshow
//   const fetchDepartmentById = async (id: number) => {
//     try {
//       const res = await axios.post(
//         `${apiUrl}/Departshow`,
//         { department_id: String(id) },
//         { headers: getAuthHeaders() }
//       );

//       if (res.data?.success && res.data.data) {
//         const dep = res.data.data as Department;
//         setEditData({ id: dep.id, name: dep.name });
//         setIsEditOpen(true);
//       } else {
//         toast.error(res.data?.message || "Failed to fetch department");
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error("Error fetching department");
//     }
//   };

//   // ---------- Add Department ----------
//   const handleSave = async () => {
//     if (!name.trim()) {
//       toast.error("Please enter department name");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${apiUrl}/DepartmentAdd`,
//         { name: name.trim() },
//         { headers: getAuthHeaders() }
//       );

//       if (res.data?.success) {
//         toast.success(res.data.message || "Department added");
//         setDepartments((prev) => [...prev, res.data.data]);
//         setName("");
//       } else {
//         toast.error(res.data?.message || "Failed to add department");
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error("Error adding department");
//     }
//   };

//   // ---------- Update Department (FRONTEND ONLY for now) ----------
//   // When backend gives you DepartmentUpdate / DepartUpdate:
//   // 1) Replace this function with an axios.post to that API.
//   const handleUpdate = async () => {
//     if (!editData.id) {
//       toast.error("Invalid department selected");
//       return;
//     }
//     if (!editData.name.trim()) {
//       toast.error("Please enter department name");
//       return;
//     }

//     // 🔹 Only update in UI for now
//     setDepartments((prev) =>
//       prev.map((item) =>
//         item.id === editData.id ? { ...item, name: editData.name } : item
//       )
//     );
//     toast.success("Department updated (frontend only)");
//     setIsEditOpen(false);

//     // 🔻 When you have API, do something like:
//     // const res = await axios.post(
//     //   `${apiUrl}/DepartmentUpdate`,
//     //   { department_id: String(editData.id), name: editData.name.trim() },
//     //   { headers: getAuthHeaders() }
//     // );
//     // then update state based on res.data.data
//   };

//   // ---------- Delete Department ----------
//   const handleDelete = async (id: number) => {
//     try {
//       const res = await axios.post(
//         `${apiUrl}/DepartDelete`,
//         { department_id: String(id) },
//         { headers: getAuthHeaders() }
//       );

//       if (res.data?.success) {
//         toast.success(res.data.message || "Department deleted");
//         setDepartments((prev) => prev.filter((item) => item.id !== id));
//       } else {
//         toast.error(res.data?.message || "Failed to delete department");
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error("Error deleting department");
//     }
//   };

//   // ---------- Pagination ----------
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

//   const currentRecords = departments.slice(
//     indexOfFirstRecord,
//     indexOfLastRecord
//   );

//   const totalPages = Math.ceil(departments.length / recordsPerPage) || 1;

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="flex gap-8 p-6">
//       {/* LEFT FORM */}
//       <div className="w-1/3 bg-white p-6 shadow rounded-xl">
//         <h2 className="text-xl font-semibold mb-4">Add Department</h2>

//         <label className="font-medium">Department Name</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter department"
//           className="w-full border px-3 py-2 rounded mt-1 mb-6"
//         />

//         <button
//           onClick={handleSave}
//           className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
//         >
//           Save
//         </button>
//       </div>

//       {/* RIGHT LIST */}
//       <div className="w-2/3 bg-white p-6 shadow rounded-xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Department List</h2>
//           {loading && (
//             <span className="text-sm text-gray-500">Loading...</span>
//           )}
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">ID</th>
//               <th className="p-1">Department</th>
//               <th className="p-1">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentRecords.length === 0 && !loading && (
//               <tr>
//                 <td colSpan={3} className="p-4 text-center text-gray-500">
//                   No departments found
//                 </td>
//               </tr>
//             )}

//             {currentRecords.map((item,index) => (
//               <tr key={item.id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{index+1}</td>
//                 <td className="p-1">{item.name}</td>

//                 <td className="p-1 flex gap-3">
//                   {/* Edit */}
//                   <button
//                     className="text-blue-600 hover:text-blue-800"
//                     onClick={() => {
//                       // If you want to always fetch fresh from API:
//                       // fetchDepartmentById(item.id);
//                       setEditData({ id: item.id, name: item.name });
//                       setIsEditOpen(true);
//                     }}
//                   >
//                     <EditIcon fontSize="small" />
//                   </button>

//                   {/* Delete */}
//                   <button
//                     className="text-red-600 hover:text-red-800"
//                     onClick={() => {
//                       setDeleteId(item.id);
//                       setIsDeleteOpen(true);
//                     }}
//                   >
//                     <DeleteIcon fontSize="small" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {departments.length > 0 && (
//           <div className="flex justify-center items-center mt-4 gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className={`px-3 py-1 rounded border ${currentPage === 1
//                   ? "bg-gray-200 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-100"
//                 }`}
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, index) => {
//               const page = index + 1;
//               return (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded border ${currentPage === page
//                       ? "bg-[#2e56a6] text-white"
//                       : "bg-white hover:bg-gray-100"
//                     }`}
//                 >
//                   {page}
//                 </button>
//               );
//             })}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className={`px-3 py-1 rounded border ${currentPage === totalPages
//                   ? "bg-gray-200 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-100"
//                 }`}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {isEditOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//               <h2 className="text-xl font-semibold mb-4">Edit Department</h2>

//               <label className="font-medium">Department</label>
//               <input
//                 type="text"
//                 value={editData.name}
//                 onChange={(e) =>
//                   setEditData({ ...editData, name: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded mt-1 mb-4"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                   onClick={() => setIsEditOpen(false)}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="px-4 py-2 bg-[#2e56a6] text-white rounded hover:bg-blue-700"
//                   onClick={handleUpdate}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Modal */}
//         {isDeleteOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
//               <h2 className="text-xl font-semibold text-red-600 mb-2">
//                 Delete Record
//               </h2>

//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this department?
//               </p>

//               <div className="flex justify-center gap-4">
//                 <button
//                   className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   onClick={() => setIsDeleteOpen(false)}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
//                   onClick={() => {
//                     if (deleteId !== null) {
//                       handleDelete(deleteId);
//                     }
//                     setIsDeleteOpen(false);
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

interface Department {
  id: number;
  name: string;
}

interface EditDepartment {
  id: number | null;
  name: string;
}

const apiUrl = "https://getdemo.in/aries_software/api";

export default function DepartmentMaster() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditDepartment>({
    id: null,
    name: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 🔄 loaders
  const [isListing, setIsListing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---------- Helper: Auth Header ----------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("artoken");
    return token
      ? {
        Authorization: `Bearer ${token}`,
      }
      : {};
  };

  // ---------- Fetch Department List ----------
  const fetchDepartments = async () => {
    try {
      setIsListing(true);
      const res = await axios.post(
        `${apiUrl}/DepartList`,
        {},
        { headers: getAuthHeaders() }
      );

      if (res.data?.success) {
        setDepartments(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to fetch departments");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error fetching departments");
    } finally {
      setIsListing(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // (Optional) Fetch single department by id via Departshow
  const fetchDepartmentById = async (id: number) => {
    try {
      const res = await axios.post(
        `${apiUrl}/Departshow`,
        { department_id: String(id) },
        { headers: getAuthHeaders() }
      );

      if (res.data?.success && res.data.data) {
        const dep = res.data.data as Department;
        setEditData({ id: dep.id, name: dep.name });
        setIsEditOpen(true);
      } else {
        toast.error(res.data?.message || "Failed to fetch department");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error fetching department");
    }
  };

  // ---------- Add Department ----------
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter department name");
      return;
    }

    try {
      setIsSaving(true);

      const res = await axios.post(
        `${apiUrl}/DepartmentAdd`,
        { name: name.trim() },
        { headers: getAuthHeaders() }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Department added");
        setDepartments((prev) => [...prev, res.data.data]);
        setName("");
      } else {
        toast.error(res.data?.message || "Failed to add department");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error adding department");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Update Department (currently frontend-only) ----------
  const handleUpdate = async () => {
    if (!editData.id) {
      toast.error("Invalid department selected");
      return;
    }
    if (!editData.name.trim()) {
      toast.error("Please enter department name");
      return;
    }

    try {
      setIsUpdating(true);

      // Frontend-only update for now
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === editData.id ? { ...item, name: editData.name } : item
        )
      );
      toast.success("Department updated (frontend only)");
      setIsEditOpen(false);

      // 🔻 When you have backend API:
      // const res = await axios.post(
      //   `${apiUrl}/DepartmentUpdate`,
      //   { department_id: String(editData.id), name: editData.name.trim() },
      //   { headers: getAuthHeaders() }
      // );
      // then update based on res.data.data
    } catch (error: any) {
      console.error(error);
      toast.error("Error updating department");
    } finally {
      setIsUpdating(false);
    }
  };

  // ---------- Delete Department ----------
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);

      const res = await axios.post(
        `${apiUrl}/DepartDelete`,
        { department_id: String(id) },
        { headers: getAuthHeaders() }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Department deleted");
        setDepartments((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(res.data?.message || "Failed to delete department");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error deleting department");
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

  const currentRecords = departments.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(departments.length / recordsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex gap-8 p-6">
      {/* LEFT FORM */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add Department</h2>

        <label className="font-medium">Department Name</label>
        <input
          type="text"
          value={name}
          disabled={isSaving || isListing}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter department"
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
          <h2 className="text-xl font-semibold">Department List</h2>
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
                <th className="p-1">Department</th>
                <th className="p-1">Actions</th>
              </tr>
            </thead>

            <tbody className={isListing ? "opacity-40" : ""}>
              {currentRecords.length === 0 && !isListing && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No departments found
                  </td>
                </tr>
              )}

              {currentRecords.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-1">{item.name}</td>

                  <td className="p-1 flex gap-3">
                    {/* Edit */}
                    <button
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      disabled={isListing || isUpdating}
                      onClick={() => {
                        // If you prefer always fresh data:
                        // fetchDepartmentById(item.id);
                        setEditData({ id: item.id, name: item.name });
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
        {departments.length > 0 && (
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Edit Department
              </h2>

              <label className="font-medium">Department</label>
              <input
                type="text"
                value={editData.name}
                disabled={isUpdating}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
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
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Delete Record
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this department?
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
                    if (deleteId !== null) {
                      handleDelete(deleteId);
                    }
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
