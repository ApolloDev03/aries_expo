// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import { apiUrl } from "../../config";
// // import { toast } from "react-toastify";

// // interface ApiCity {
// //   cityid: number;
// //   name: string;
// //   iStatus: number;
// //   iSDelete: number;
// //   created_at: string;
// //   updated_at: string;
// //   stateid?: string;
// //   statename?: string;
// // }

// // interface ApiState {
// //   stateId: number;
// //   stateName: string;
// // }

// // export default function CityMaster() {
// //   const [states, setStates] = useState<ApiState[]>([]);
// //   const [stateId, setStateId] = useState<string>("");

// //   const [cityName, setCityName] = useState("");
// //   const [searchCity, setSearchCity] = useState("");

// //   const [cities, setCities] = useState<ApiCity[]>([]);

// //   const [isEditOpen, setIsEditOpen] = useState(false);
// //   const [editCity, setEditCity] = useState<ApiCity | null>(null);

// //   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
// //   const [deleteId, setDeleteId] = useState<number | null>(null);

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const recordsPerPage = 10;

// //   // 🔄 GLOBAL LOADER (for all API calls)
// //   const [loading, setLoading] = useState(false);

// //   const getStateNameById = (sid?: string) => {
// //     if (!sid) return "-";
// //     const st = states.find((s) => String(s.stateId) === String(sid));
// //     return st?.stateName || "-";
// //   };

// //   const normalizeCity = (c: any): ApiCity => ({
// //     cityid: c.cityid ?? c.id,
// //     name: c.name,
// //     iStatus: c.iStatus,
// //     iSDelete: c.iSDelete,
// //     created_at: c.created_at,
// //     updated_at: c.updated_at,
// //     stateid: c.stateid,
// //     statename: c.statename,
// //   });

// //   // =============== API CALLS ===============

// //   const fetchStates = async () => {
// //     try {
// //       let page = 1;
// //       let lastPage = 1;
// //       const allStates: ApiState[] = [];

// //       while (page <= lastPage) {
// //         const res = await axios.post(`${apiUrl}/statelist`, {
// //           page: String(page),
// //         });

// //         if (res.data?.success) {
// //           const { data, last_page } = res.data;
// //           allStates.push(...(data as ApiState[]));
// //           lastPage = last_page ?? page;
// //           page++;
// //         } else {
// //           toast.error(res.data?.message || "Failed to load states");
// //           break;
// //         }
// //       }

// //       setStates(allStates);
// //     } catch (error) {
// //       console.error("Error fetching states:", error);
// //       toast.error("Error while fetching states");
// //     }
// //   };

// //   const fetchCities = async () => {
// //     try {
// //       const res = await axios.post(`${apiUrl}/CityList`);
// //       if (res.data?.success) {
// //         const apiData = res.data.data || [];
// //         const normalized: ApiCity[] = apiData.map((c: any) => normalizeCity(c));
// //         setCities(normalized);
// //       } else {
// //         console.error("CityList error:", res.data);
// //         toast.error(res.data?.message || "Failed to load cities");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching cities:", error);
// //       toast.error("Error while fetching cities");
// //     }
// //   };

// //   // 🔰 INITIAL LOAD WITH LOADER
// //   useEffect(() => {
// //     const init = async () => {
// //       setLoading(true);
// //       try {
// //         await Promise.all([fetchStates(), fetchCities()]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     init();
// //   }, []);

// //   // =============== ADD CITY ===============

// //   const handleSave = async () => {
// //     if (!stateId || !cityName.trim()) {
// //       toast.warn("Please select state and enter city name");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const payload = {
// //         name: cityName.trim(),
// //         stateid: stateId,
// //       };

// //       const res = await axios.post(`${apiUrl}/CityAdd`, payload);

// //       if (res.data?.success) {
// //         const newCityRaw = res.data.data;
// //         const newCity = normalizeCity(newCityRaw);
// //         const stName = getStateNameById(newCity.stateid);
// //         setCities((prev) => [...prev, { ...newCity, statename: stName }]);

// //         setCityName("");
// //         setStateId("");
// //         toast.success("City added successfully");
// //       } else {
// //         toast.error(res.data?.message || "Failed to add city");
// //       }
// //     } catch (error) {
// //       console.error("Error adding city:", error);
// //       toast.error("Error while adding city");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =============== EDIT CITY ===============

// //   const openEditModal = async (cityid: number) => {
// //     try {
// //       setLoading(true);

// //       const res = await axios.post(`${apiUrl}/Cityshow`, {
// //         city_id: String(cityid),
// //       });

// //       if (res.data?.success) {
// //         const cityRaw = res.data.data;
// //         const city = normalizeCity(cityRaw);
// //         const stName = city.statename || getStateNameById(city.stateid);
// //         setEditCity({ ...city, statename: stName });

// //         setIsEditOpen(true);
// //       } else {
// //         toast.error(res.data?.message || "Failed to fetch city");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching city:", error);
// //       toast.error("Error while fetching city detail");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleUpdate = async () => {
// //     if (!editCity) return;

// //     if (!editCity.name.trim() || !editCity.stateid) {
// //       toast.warn("Please select state and enter city name");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const payload = {
// //         name: editCity.name.trim(),
// //         city_id: editCity.cityid,
// //         state_id: editCity.stateid,
// //       };

// //       const res = await axios.post(`${apiUrl}/CityUpdate`, payload);

// //       if (res.data?.success) {
// //         const updatedRaw = res.data.data;
// //         const updated = normalizeCity(updatedRaw);
// //         const stName = updated.statename || getStateNameById(updated.stateid);

// //         setCities((prev) =>
// //           prev.map((c) =>
// //             c.cityid === updated.cityid ? { ...updated, statename: stName } : c
// //           )
// //         );
// //         setIsEditOpen(false);
// //         toast.success("City updated successfully");
// //       } else {
// //         toast.error(res.data?.message || "Failed to update city");
// //       }
// //     } catch (error) {
// //       console.error("Error updating city:", error);
// //       toast.error("Error while updating city");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =============== DELETE CITY ===============

// //   const handleDelete = async (id: number) => {
// //     try {
// //       setLoading(true);

// //       const res = await axios.post(`${apiUrl}/CityDelete`, {
// //         city_id: String(id),
// //       });

// //       if (res.data?.success) {
// //         setCities((prev) => prev.filter((item) => item.cityid !== id));
// //         toast.success("City deleted successfully");
// //       } else {
// //         toast.error(res.data?.message || "Failed to delete city");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting city:", error);
// //       toast.error("Error while deleting city");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =============== SEARCH + PAGINATION ===============

// //   const filteredCities = cities.filter((item) =>
// //     item.name.toLowerCase().includes(searchCity.toLowerCase())
// //   );

// //   const indexOfLastRecord = currentPage * recordsPerPage;
// //   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
// //   const currentRecords = filteredCities.slice(
// //     indexOfFirstRecord,
// //     indexOfLastRecord
// //   );
// //   const totalPages = Math.ceil(filteredCities.length / recordsPerPage);
// //   const handlePageChange = (page: number) => setCurrentPage(page);

// //   return (
// //     <div className="relative">
// //       {/* 🔄 GLOBAL LOADER OVERLAY */}
// //       {loading && (
// //         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
// //           <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
// //         </div>
// //       )}

// //       <div className="flex gap-8 p-6">
// //         {/* LEFT: ADD CITY FORM */}
// //         <div className="w-1/3 bg-white p-6 shadow rounded-xl">
// //           <h2 className="text-xl font-semibold mb-4">Add City</h2>

// //           <label className="font-medium">State</label>
// //           <select
// //             value={stateId}
// //             disabled={loading}
// //             onChange={(e) => setStateId(e.target.value)}
// //             className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
// //           >
// //             <option value="">Select State</option>
// //             {states.map((st) => (
// //               <option key={st.stateId} value={st.stateId}>
// //                 {st.stateName}
// //               </option>
// //             ))}
// //           </select>

// //           <label className="font-medium">City</label>
// //           <input
// //             type="text"
// //             value={cityName}
// //             disabled={loading}
// //             onChange={(e) => setCityName(e.target.value)}
// //             placeholder="Enter city"
// //             className="w-full border px-3 py-2 rounded mt-1 mb-6 disabled:bg-gray-100"
// //           />

// //           <button
// //             onClick={handleSave}
// //             disabled={loading}
// //             className={`bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e] disabled:bg-gray-400 disabled:cursor-not-allowed`}
// //           >
// //             {loading ? "Please wait..." : "Save"}
// //           </button>
// //         </div>

// //         {/* RIGHT: CITY LIST */}
// //         <div className="w-2/3 bg-white p-6 shadow rounded-xl">
// //           <h2 className="text-xl font-semibold mb-4">City List</h2>

// //           {/* Search */}
// //           <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
// //             <input
// //               type="text"
// //               placeholder="Search City"
// //               value={searchCity}
// //               onChange={(e) => setSearchCity(e.target.value)}
// //               className="border px-3 py-2 rounded w-1/3"
// //             />
// //             <button className="bg-[#2e56a6] text-white px-5 py-2 rounded">
// //               Search
// //             </button>
// //           </div>

// //           <table className="w-full border-collapse">
// //             <thead>
// //               <tr className="bg-gray-100 text-left">
// //                 <th className="p-3">ID</th>
// //                 <th className="p-1">State</th>
// //                 <th className="p-1">City</th>
// //                 <th className="p-1">Actions</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {currentRecords.map((item, index) => (
// //                 <tr key={item.cityid} className="border-b hover:bg-gray-50">
// //                   <td className="p-3">{index + 1}</td>
// //                   <td className="p-1">
// //                     {item.statename || getStateNameById(item.stateid)}
// //                   </td>
// //                   <td className="p-1">{item.name}</td>

// //                   <td className="p-1 flex gap-3">
// //                     <button
// //                       className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
// //                       disabled={loading}
// //                       onClick={() => openEditModal(item.cityid)}
// //                     >
// //                       <EditIcon fontSize="small" />
// //                     </button>
// //                     <button
// //                       className="text-red-600 hover:text-red-800 disabled:text-gray-400"
// //                       disabled={loading}
// //                       onClick={() => {
// //                         setDeleteId(item.cityid);
// //                         setIsDeleteOpen(true);
// //                       }}
// //                     >
// //                       <DeleteIcon fontSize="small" />
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           {/* PAGINATION */}
// //           <div className="flex justify-center items-center mt-4 gap-2">
// //             <button
// //               disabled={currentPage === 1 || loading}
// //               onClick={() => handlePageChange(currentPage - 1)}
// //               className={`px-3 py-1 rounded border ${currentPage === 1 || loading
// //                   ? "bg-gray-200 cursor-not-allowed"
// //                   : "bg-white hover:bg-gray-100"
// //                 }`}
// //             >
// //               Prev
// //             </button>

// //             {[...Array(totalPages)].map((_, index) => {
// //               const page = index + 1;
// //               return (
// //                 <button
// //                   key={page}
// //                   disabled={loading}
// //                   onClick={() => handlePageChange(page)}
// //                   className={`px-3 py-1 rounded border ${currentPage === page
// //                       ? "bg-[#2e56a6] text-white"
// //                       : "bg-white hover:bg-gray-100"
// //                     }`}
// //                 >
// //                   {page}
// //                 </button>
// //               );
// //             })}

// //             <button
// //               disabled={currentPage === totalPages || totalPages === 0 || loading}
// //               onClick={() => handlePageChange(currentPage + 1)}
// //               className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0 || loading
// //                   ? "bg-gray-200 cursor-not-allowed"
// //                   : "bg-white hover:bg-gray-100"
// //                 }`}
// //             >
// //               Next
// //             </button>
// //           </div>

// //           {/* EDIT MODAL */}
// //           {isEditOpen && editCity && (
// //             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
// //               <div className="bg-white p-6 rounded-lg shadow-lg w-96">
// //                 <h2 className="text-xl font-semibold mb-4">Edit City</h2>

// //                 <label className="font-medium">State</label>
// //                 <select
// //                   value={editCity.stateid || ""}
// //                   disabled={loading}
// //                   onChange={(e) => {
// //                     const newStateId = e.target.value;
// //                     const stName = getStateNameById(newStateId);
// //                     setEditCity({
// //                       ...editCity,
// //                       stateid: newStateId,
// //                       statename: stName,
// //                     });
// //                   }}
// //                   className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
// //                 >
// //                   <option value="">Select State</option>
// //                   {states.map((st) => (
// //                     <option key={st.stateId} value={st.stateId}>
// //                       {st.stateName}
// //                     </option>
// //                   ))}
// //                 </select>

// //                 <label className="font-medium">City</label>
// //                 <input
// //                   type="text"
// //                   value={editCity.name}
// //                   disabled={loading}
// //                   onChange={(e) =>
// //                     setEditCity({ ...editCity, name: e.target.value })
// //                   }
// //                   className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
// //                 />

// //                 <div className="flex justify-end gap-3">
// //                   <button
// //                     className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// //                     onClick={() => setIsEditOpen(false)}
// //                     disabled={loading}
// //                   >
// //                     Cancel
// //                   </button>

// //                   <button
// //                     className="px-4 py-2 bg-[#2e56a6] text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //                     onClick={handleUpdate}
// //                     disabled={loading}
// //                   >
// //                     {loading ? "Updating..." : "Update"}
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* DELETE CONFIRMATION POPUP */}
// //           {isDeleteOpen && (
// //             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
// //               <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
// //                 <h2 className="text-xl font-semibold text-red-600 mb-2">
// //                   Delete Record
// //                 </h2>
// //                 <p className="text-gray-600 mb-6">
// //                   Are you sure you want to delete the record?
// //                 </p>

// //                 <div className="flex justify-center gap-4">
// //                   <button
// //                     className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
// //                     onClick={() => setIsDeleteOpen(false)}
// //                     disabled={loading}
// //                   >
// //                     Cancel
// //                   </button>

// //                   <button
// //                     className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //                     onClick={() => {
// //                       if (deleteId !== null) {
// //                         handleDelete(deleteId);
// //                       }
// //                       setIsDeleteOpen(false);
// //                     }}
// //                     disabled={loading}
// //                   >
// //                     {loading ? "Deleting..." : "Delete"}
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { apiUrl } from "../../config";
// import { toast } from "react-toastify";

// interface ApiCity {
//   cityid: number;
//   name: string;
//   iStatus: number;
//   iSDelete: number;
//   created_at: string;
//   updated_at: string;
//   stateid?: string;
//   statename?: string;
// }

// interface ApiState {
//   stateId: number;
//   stateName: string;
// }

// export default function CityMaster() {
//   const [states, setStates] = useState<ApiState[]>([]);
//   const [stateId, setStateId] = useState<string>("");

//   const [cityName, setCityName] = useState("");
//   const [searchCity, setSearchCity] = useState("");

//   const [cities, setCities] = useState<ApiCity[]>([]);

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editCity, setEditCity] = useState<ApiCity | null>(null);

//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // 🔄 SPECIFIC LOADERS
//   const [isListing, setIsListing] = useState(false);   // initial fetch (states + cities)
//   const [isSaving, setIsSaving] = useState(false);     // Add city
//   const [isUpdating, setIsUpdating] = useState(false); // Edit city
//   const [isDeleting, setIsDeleting] = useState(false); // Delete city

//   const getStateNameById = (sid?: string) => {
//     if (!sid) return "-";
//     const st = states.find((s) => String(s.stateId) === String(sid));
//     return st?.stateName || "-";
//   };

//   const normalizeCity = (c: any): ApiCity => ({
//     cityid: c.cityid ?? c.id,
//     name: c.name,
//     iStatus: c.iStatus,
//     iSDelete: c.iSDelete,
//     created_at: c.created_at,
//     updated_at: c.updated_at,
//     stateid: c.stateid,
//     statename: c.statename,
//   });

//   // =============== API CALLS ===============

//   const fetchStates = async () => {
//     try {
//       let page = 1;
//       let lastPage = 1;
//       const allStates: ApiState[] = [];

//       while (page <= lastPage) {
//         const res = await axios.post(`${apiUrl}/statelist`, {
//           page: String(page),
//         });

//         if (res.data?.success) {
//           const { data, last_page } = res.data;
//           allStates.push(...(data as ApiState[]));
//           lastPage = last_page ?? page;
//           page++;
//         } else {
//           toast.error(res.data?.message || "Failed to load states");
//           break;
//         }
//       }

//       setStates(allStates);
//     } catch (error) {
//       console.error("Error fetching states:", error);
//       toast.error("Error while fetching states");
//     }
//   };

//   const fetchCities = async () => {
//     try {
//       const res = await axios.post(`${apiUrl}/CityList`);
//       if (res.data?.success) {
//         const apiData = res.data.data || [];
//         const normalized: ApiCity[] = apiData.map((c: any) => normalizeCity(c));
//         setCities(normalized);
//       } else {
//         console.error("CityList error:", res.data);
//         toast.error(res.data?.message || "Failed to load cities");
//       }
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//       toast.error("Error while fetching cities");
//     }
//   };

//   // 🔰 INITIAL LOAD WITH LISTING LOADER
//   useEffect(() => {
//     const init = async () => {
//       setIsListing(true);
//       try {
//         await Promise.all([fetchStates(), fetchCities()]);
//       } finally {
//         setIsListing(false);
//       }
//     };
//     init();
//   }, []);

//   // =============== ADD CITY ===============

//   const handleSave = async () => {
//     if (!stateId || !cityName.trim()) {
//       toast.warn("Please select state and enter city name");
//       return;
//     }

//     try {
//       setIsSaving(true);

//       const payload = {
//         name: cityName.trim(),
//         stateid: stateId,
//       };

//       const res = await axios.post(`${apiUrl}/CityAdd`, payload);

//       if (res.data?.success) {
//         const newCityRaw = res.data.data;
//         const newCity = normalizeCity(newCityRaw);
//         const stName = getStateNameById(newCity.stateid);
//         setCities((prev) => [...prev, { ...newCity, statename: stName }]);

//         setCityName("");
//         setStateId("");
//         toast.success("City added successfully");
//       } else {
//         // 🔴 Handle API-level failure (success = false)
//         const apiMsg = res.data?.error || res.data?.message;
//         toast.error(apiMsg || "Failed to add city");
//       }
//     } catch (error: unknown) {
//       console.error("Error adding city:", error);

//       // 🔴 Handle HTTP errors (4xx / 5xx)
//       if (axios.isAxiosError(error)) {
//         const data = error.response?.data as any;

//         const apiMsg = data?.error || data?.message;
//         toast.error(apiMsg || error.message || "Something went wrong while adding city");
//       } else if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("Something went wrong while adding city");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };


//   // =============== EDIT CITY ===============

//   const openEditModal = async (cityid: number) => {
//     try {
//       const res = await axios.post(`${apiUrl}/Cityshow`, {
//         city_id: String(cityid),
//       });

//       if (res.data?.success) {
//         const cityRaw = res.data.data;
//         const city = normalizeCity(cityRaw);
//         const stName = city.statename || getStateNameById(city.stateid);
//         setEditCity({ ...city, statename: stName });

//         setIsEditOpen(true);
//       } else {
//         toast.error(res.data?.message || "Failed to fetch city");
//       }
//     } catch (error) {
//       console.error("Error fetching city:", error);
//       toast.error("Error while fetching city detail");
//     }
//   };

//   const handleUpdate = async () => {
//     if (!editCity) return;

//     if (!editCity.name.trim() || !editCity.stateid) {
//       toast.warn("Please select state and enter city name");
//       return;
//     }

//     try {
//       setIsUpdating(true);

//       const payload = {
//         name: editCity.name.trim(),
//         city_id: editCity.cityid,
//         state_id: editCity.stateid,
//       };

//       const res = await axios.post(`${apiUrl}/CityUpdate`, payload);

//       if (res.data?.success) {
//         const updatedRaw = res.data.data;
//         const updated = normalizeCity(updatedRaw);
//         const stName = updated.statename || getStateNameById(updated.stateid);

//         setCities((prev) =>
//           prev.map((c) =>
//             c.cityid === updated.cityid ? { ...updated, statename: stName } : c
//           )
//         );
//         setIsEditOpen(false);
//         toast.success("City updated successfully");
//       } else {
//         toast.error(res.data?.message || "Failed to update city");
//       }
//     } catch (error: unknown) {
//       console.error("Error adding city:", error);

//       // 🔴 Handle HTTP errors (4xx / 5xx)
//       if (axios.isAxiosError(error)) {
//         const data = error.response?.data as any;

//         const apiMsg = data?.error || data?.message;
//         toast.error(apiMsg || error.message || "Something went wrong while adding city");
//       } else if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("Something went wrong while adding city");
//       }
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // =============== DELETE CITY ===============

//   const handleDelete = async (id: number) => {
//     try {
//       setIsDeleting(true);

//       const res = await axios.post(`${apiUrl}/CityDelete`, {
//         city_id: String(id),
//       });

//       if (res.data?.success) {
//         setCities((prev) => prev.filter((item) => item.cityid !== id));
//         toast.success("City deleted successfully");
//       } else {
//         toast.error(res.data?.message || "Failed to delete city");
//       }
//     } catch (error) {
//       console.error("Error deleting city:", error);
//       toast.error("Error while deleting city");
//     } finally {
//       setIsDeleting(false);
//       setIsDeleteOpen(false);
//     }
//   };

//   // =============== SEARCH + PAGINATION ===============

//   const filteredCities = cities.filter((item) =>
//     item.name.toLowerCase().includes(searchCity.toLowerCase())
//   );

//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredCities.slice(
//     indexOfFirstRecord,
//     indexOfLastRecord
//   );
//   const totalPages = Math.ceil(filteredCities.length / recordsPerPage);
//   const handlePageChange = (page: number) => setCurrentPage(page);


//   console.log(editCity,"editcity==")
//   return (
//     <div className="relative">
//       <div className="flex gap-8 p-6">
//         {/* LEFT: ADD CITY FORM */}
//         <div className="w-1/3 bg-white p-6 shadow rounded-xl">
//           <h2 className="text-xl font-semibold mb-4">Add City</h2>

//           <label className="font-medium">State</label>
//           <select
//             value={stateId}
//             disabled={isSaving || isListing}
//             onChange={(e) => setStateId(e.target.value)}
//             className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
//           >
//             <option value="">Select State</option>
//             {states.map((st) => (
//               <option key={st.stateId} value={st.stateId}>
//                 {st.stateName}
//               </option>
//             ))}
//           </select>

//           <label className="font-medium">City</label>
//           <input
//             type="text"
//             value={cityName}
//             disabled={isSaving || isListing}
//             onChange={(e) => setCityName(e.target.value)}
//             placeholder="Enter city"
//             className="w-full border px-3 py-2 rounded mt-1 mb-6 disabled:bg-gray-100"
//           />

//           <button
//             onClick={handleSave}
//             disabled={isSaving || isListing}
//             className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e] disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {isSaving ? "Saving..." : "Save"}
//           </button>
//         </div>

//         {/* RIGHT: CITY LIST */}
//         <div className="w-2/3 bg-white p-6 shadow rounded-xl">
//           <h2 className="text-xl font-semibold mb-4">City List</h2>

//           {/* Search */}
//           <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
//             <input
//               type="text"
//               placeholder="Search City"
//               value={searchCity}
//               disabled={isListing}
//               onChange={(e) => setSearchCity(e.target.value)}
//               className="border px-3 py-2 rounded w-1/3 disabled:bg-gray-100"
//             />
//             <button
//               className="bg-[#2e56a6] text-white px-5 py-2 rounded disabled:bg-gray-400"
//               disabled={isListing}
//             >
//               Search
//             </button>
//           </div>

//           {/* TABLE WRAPPED WITH LOCAL LOADER */}
//           <div className="relative min-h-[230px]">
//             {/* Loader only over table area */}
//             {isListing && (
//               <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
//                 <div className="h-10 w-10 border-4 border-gray-300 border-t-[#2e56a6] rounded-full animate-spin" />
//               </div>
//             )}

//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100 text-left">
//                   <th className="p-3">ID</th>
//                   <th className="p-1">State</th>
//                   <th className="p-1">City</th>
//                   <th className="p-1">Actions</th>
//                 </tr>
//               </thead>

//               {/* Reduce opacity when loading */}
//               <tbody className={isListing ? "opacity-40" : ""}>
//                 {currentRecords.map((item, index) => (
//                   <tr key={item.cityid} className="border-b hover:bg-gray-50">
//                     <td className="p-3">{index + 1}</td>
//                     <td className="p-1">
//                       {item.statename || getStateNameById(item.stateid)}
//                     </td>
//                     <td className="p-1">{item.name}</td>

//                     <td className="p-1 flex gap-3">
//                       <button
//                         className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
//                         disabled={isListing || isUpdating}
//                         onClick={() => openEditModal(item.cityid)}
//                       >
//                         <EditIcon fontSize="small" />
//                       </button>

//                       <button
//                         className="text-red-600 hover:text-red-800 disabled:text-gray-400"
//                         disabled={isListing || isDeleting}
//                         onClick={() => {
//                           setDeleteId(item.cityid);
//                           setIsDeleteOpen(true);
//                         }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}

//                 {/* No data message */}
//                 {!isListing && currentRecords.length === 0 && (
//                   <tr>
//                     <td colSpan={4} className="text-center py-6 text-gray-500">
//                       No records found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>


//           {/* PAGINATION */}
//           <div className="flex justify-center items-center mt-4 gap-2">
//             <button
//               disabled={currentPage === 1 || isListing}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className={`px-3 py-1 rounded border ${currentPage === 1 || isListing
//                 ? "bg-gray-200 cursor-not-allowed"
//                 : "bg-white hover:bg-gray-100"
//                 }`}
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, index) => {
//               const page = index + 1;
//               return (
//                 <button
//                   key={page}
//                   disabled={isListing}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded border ${currentPage === page
//                     ? "bg-[#2e56a6] text-white"
//                     : "bg-white hover:bg-gray-100"
//                     }`}
//                 >
//                   {page}
//                 </button>
//               );
//             })}

//             <button
//               disabled={currentPage === totalPages || totalPages === 0 || isListing}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0 || isListing
//                 ? "bg-gray-200 cursor-not-allowed"
//                 : "bg-white hover:bg-gray-100"
//                 }`}
//             >
//               Next
//             </button>
//           </div>

//           {/* EDIT MODAL */}
//           {isEditOpen && editCity && (
//             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
//               <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                 <h2 className="text-xl font-semibold mb-4">Edit City</h2>

//                 <label className="font-medium">State</label>
//                 <select
//                   value={editCity.statename || ""}
//                   disabled={isUpdating}
//                   onChange={(e) => {
//                     const newStateId = e.target.value;
//                     const stName = getStateNameById(newStateId);
//                     setEditCity({
//                       ...editCity,
//                       stateid: newStateId,
//                       statename: stName,
//                     });
//                   }}
//                   className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
//                 >
//                   <option value="">Select State</option>
//                   {states.map((st) => (
//                     <option key={st.stateId} value={st.stateId}>
//                       {st.stateName}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="font-medium">City</label>
//                 <input
//                   type="text"
//                   value={editCity.name}
//                   disabled={isUpdating}
//                   onChange={(e) =>
//                     setEditCity({ ...editCity, name: e.target.value })
//                   }
//                   className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
//                 />

//                 <div className="flex justify-end gap-3">
//                   <button
//                     className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                     onClick={() => setIsEditOpen(false)}
//                     disabled={isUpdating}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     className="px-4 py-2 bg-[#2e56a6] text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     onClick={handleUpdate}
//                     disabled={isUpdating}
//                   >
//                     {isUpdating ? "Updating..." : "Update"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* DELETE CONFIRMATION POPUP */}
//           {isDeleteOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
//               <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
//                 <h2 className="text-xl font-semibold text-red-600 mb-2">
//                   Delete Record
//                 </h2>
//                 <p className="text-gray-600 mb-6">
//                   Are you sure you want to delete the record?
//                 </p>

//                 <div className="flex justify-center gap-4">
//                   <button
//                     className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
//                     onClick={() => setIsDeleteOpen(false)}
//                     disabled={isDeleting}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     onClick={() => {
//                       if (deleteId !== null) {
//                         handleDelete(deleteId);
//                       }
//                     }}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiUrl } from "../../config";
import { toast } from "react-toastify";

interface ApiCity {
  cityid: number;
  name: string;
  iStatus: number;
  iSDelete: number;
  created_at: string;
  updated_at: string;
  stateid?: string | number;
  statename?: string;
}

interface ApiState {
  stateId: number;
  stateName: string;
}

export default function CityMaster() {
  const [states, setStates] = useState<ApiState[]>([]);
  const [stateId, setStateId] = useState<string>("");

  const [cityName, setCityName] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const [cities, setCities] = useState<ApiCity[]>([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCity, setEditCity] = useState<ApiCity | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // 🔄 SPECIFIC LOADERS
  const [isListing, setIsListing] = useState(false); // initial fetch (states + cities)
  const [isSaving, setIsSaving] = useState(false); // Add city
  const [isUpdating, setIsUpdating] = useState(false); // Edit city
  const [isDeleting, setIsDeleting] = useState(false); // Delete city

  const getStateNameById = (sid?: string | number) => {
    if (sid === undefined || sid === null || sid === "") return "-";
    const st = states.find((s) => String(s.stateId) === String(sid));
    return st?.stateName || "-";
  };

  const normalizeCity = (c: any): ApiCity => ({
    cityid: c.cityid ?? c.id,
    name: c.name,
    iStatus: c.iStatus,
    iSDelete: c.iSDelete,
    created_at: c.created_at,
    updated_at: c.updated_at,
    stateid: c.stateid ?? c.state_id ?? c.stateId,
    statename: c.statename ?? c.stateName,
  });

  // =============== API CALLS ===============

  const fetchStates = async () => {
    try {
      let page = 1;
      let lastPage = 1;
      const allStates: ApiState[] = [];

      while (page <= lastPage) {
        const res = await axios.post(`${apiUrl}/statelist`, {
          page: String(page),
        });

        if (res.data?.success) {
          const { data, last_page } = res.data;
          allStates.push(...(data as ApiState[]));
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
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.post(`${apiUrl}/CityList`);
      if (res.data?.success) {
        setIsListing(false)
        const apiData = res.data.data || [];
        const normalized: ApiCity[] = apiData.map((c: any) => {
          const city = normalizeCity(c);
          // optional: if API doesn't provide statename, calculate from list
          const stName = city.statename || getStateNameById(city.stateid);
          return { ...city, statename: stName !== "-" ? stName : city.statename };
        });
        setCities(normalized);
      } else {
        console.error("CityList error:", res.data);
        toast.error(res.data?.message || "Failed to load cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Error while fetching cities");
    }
  };

  // 🔰 INITIAL LOAD WITH LISTING LOADER
  useEffect(() => {
    const init = async () => {
      setIsListing(true);
      try {
        await Promise.all([fetchStates(), fetchCities()]);
      } finally {
        setIsListing(false);
      }
    };
    init();
  }, []);

  // =============== ADD CITY ===============

  const handleSave = async () => {
    if (!stateId || !cityName.trim()) {
      toast.warn("Please select state and enter city name");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: cityName.trim(),
        stateid: stateId,
      };

      const res = await axios.post(`${apiUrl}/CityAdd`, payload);

      if (res.data?.success) {
        const newCityRaw = res.data.data;
        const newCity = normalizeCity(newCityRaw);
        const stName = getStateNameById(newCity.stateid);

        setCities((prev) => [
          ...prev,
          {
            ...newCity,
            stateid: String(newCity.stateid ?? ""),
            statename: stName !== "-" ? stName : newCity.statename,
          },
        ]);

        setCityName("");
        setStateId("");
        toast.success(res.data?.message || "City added successfully");
      } else {
        const apiMsg = res.data?.error || res.data?.message;
        toast.error(apiMsg || "Failed to add city");
      }
    } catch (error: unknown) {
      console.error("Error adding city:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        const apiMsg = data?.error || data?.message;
        toast.error(apiMsg || error.message || "Something went wrong while adding city");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong while adding city");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // =============== EDIT CITY ===============

  // ✅ FIXED: set stateid and dropdown matches by ID
  const openEditModal = async (cityid: number) => {
    try {
      const res = await axios.post(`${apiUrl}/Cityshow`, {
        city_id: String(cityid),
      });

      if (res.data?.success) {
        const cityRaw = res.data.data;
        const city = normalizeCity(cityRaw);

        const sid = String(city.stateid ?? "");
        const stNameFromList = getStateNameById(sid);

        setEditCity({
          ...city,
          stateid: sid, // ✅ IMPORTANT
          statename: stNameFromList !== "-" ? stNameFromList : (city.statename || ""),
        });

        setIsEditOpen(true);
      } else {
        toast.error(res.data?.message || "Failed to fetch city");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      toast.error("Error while fetching city detail");
    }
  };

  const handleUpdate = async () => {
    if (!editCity) return;

    if (!editCity.name.trim() || !editCity.stateid) {
      toast.warn("Please select state and enter city name");
      return;
    }

    try {
      setIsUpdating(true);

      // ✅ send both keys (backend safe)
      const payload = {
        name: editCity.name.trim(),
        city_id: editCity.cityid,
        stateid: String(editCity.stateid), // ✅ IMPORTANT
        state_id: String(editCity.stateid), // ✅ keep also
      };

      const res = await axios.post(`${apiUrl}/CityUpdate`, payload);

      if (res.data?.success) {
        const updatedRaw = res.data.data;
        const updated = normalizeCity(updatedRaw);

        const sid = String(updated.stateid ?? editCity.stateid ?? "");
        const stName = getStateNameById(sid);

        setCities((prev) =>
          prev.map((c) =>
            c.cityid === updated.cityid
              ? {
                ...updated,
                stateid: sid,
                statename: stName !== "-" ? stName : updated.statename,
              }
              : c
          )
        );

        setIsEditOpen(false);
        toast.success(res.data?.message || "City updated successfully");
      } else {
        const apiMsg = res.data?.error || res.data?.message;
        toast.error(apiMsg || "Failed to update city");
      }
    } catch (error: unknown) {
      console.error("Error updating city:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        const apiMsg = data?.error || data?.message;
        toast.error(apiMsg || error.message || "Something went wrong while updating city");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong while updating city");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // =============== DELETE CITY ===============

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);

      const res = await axios.post(`${apiUrl}/CityDelete`, {
        city_id: String(id),
      });

      if (res.data?.success) {
        setCities((prev) => prev.filter((item) => item.cityid !== id));
        toast.success(res.data?.message || "City deleted successfully");
      } else {
        toast.error(res.data?.message || "Failed to delete city");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Error while deleting city");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  // =============== SEARCH + PAGINATION ===============

  const filteredCities = cities.filter((item) =>
    item.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCities.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCities.length / recordsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="relative">
      <div className="flex gap-8 p-6">
        {/* LEFT: ADD CITY FORM */}
        <div className="w-1/3 bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Add City</h2>

          <label className="font-medium">State</label>
          <select
            value={stateId}
            disabled={isSaving || isListing}
            onChange={(e) => setStateId(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
          >
            <option value="">Select State</option>
            {states.map((st) => (
              <option key={st.stateId} value={String(st.stateId)}>
                {st.stateName}
              </option>
            ))}
          </select>

          <label className="font-medium">City</label>
          <input
            type="text"
            value={cityName}
            disabled={isSaving || isListing}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter city"
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

        {/* RIGHT: CITY LIST */}
        <div className="w-2/3 bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">City List</h2>

          {/* Search */}
          <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
            <input
              type="text"
              placeholder="Search City"
              value={searchCity}
              disabled={isListing}
              onChange={(e) => setSearchCity(e.target.value)}
              className="border px-3 py-2 rounded w-1/3 disabled:bg-gray-100"
            />
            <button
              className="bg-[#2e56a6] text-white px-5 py-2 rounded disabled:bg-gray-400"
              disabled={isListing}
            >
              Search
            </button>
          </div>

          {/* TABLE WRAPPED WITH LOCAL LOADER */}
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
                  <th className="p-1">City</th>
                  <th className="p-1">Actions</th>
                </tr>
              </thead>

              <tbody className={isListing ? "opacity-40" : ""}>
                {currentRecords.map((item, index) => (
                  <tr key={item.cityid} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-1">
                      {item.statename || getStateNameById(item.stateid)}
                    </td>
                    <td className="p-1">{item.name}</td>

                    <td className="p-1 flex gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                        disabled={isListing || isUpdating}
                        onClick={() => openEditModal(item.cityid)}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={isListing || isDeleting}
                        onClick={() => {
                          setDeleteId(item.cityid);
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
                    <td colSpan={4} className="text-center py-6 text-gray-500">
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
              disabled={currentPage === totalPages || totalPages === 0 || isListing}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0 || isListing
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>

          {/* EDIT MODAL */}
          {isEditOpen && editCity && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40"
              onClick={() => setIsEditOpen(false)} // ✅ outside click closes popup
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                onClick={(e) => e.stopPropagation()} // ❌ prevent close inside
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit City</h2>

                  {/* ❌ Close icon */}
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
                <select
                  value={String(editCity.stateid ?? "")}
                  disabled={isUpdating}
                  onChange={(e) => {
                    const newStateId = e.target.value;
                    const stName = getStateNameById(newStateId);

                    setEditCity({
                      ...editCity,
                      stateid: newStateId,
                      statename: stName,
                    });
                  }}
                  className="w-full border px-3 py-2 rounded mt-1 mb-4 disabled:bg-gray-100"
                >
                  <option value="">Select State</option>
                  {states.map((st) => (
                    <option key={st.stateId} value={String(st.stateId)}>
                      {st.stateName}
                    </option>
                  ))}
                </select>

                <label className="font-medium">City</label>
                <input
                  type="text"
                  value={editCity.name}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setEditCity({ ...editCity, name: e.target.value })
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
            <div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40"
              onClick={() => setIsDeleteOpen(false)}   // ✅ outside click closes
            >
              <div
                className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative"
                onClick={(e) => e.stopPropagation()}   // ❌ prevent close inside
              >
                {/* ❌ Close icon */}
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
