// import { useEffect, useState } from "react";
// import axios from "axios";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { apiUrl } from "../../config";

// interface ApiCity {
//   id: number;
//   name: string;
//   iStatus: number;
//   iSDelete: number;
//   created_at: string;
//   updated_at: string;
//   stateid?: string;      // 👈 add stateid
//   statename?: string;    // 👈 state name (from API or derived)
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

//   // Pagination (front-end)
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // ===== helper =====
//   const getStateNameById = (sid?: string) => {
//     if (!sid) return "-";
//     const st = states.find((s) => String(s.stateId) === String(sid));
//     return st?.stateName || "-";
//   };

//   // =============== API CALLS ===============

//   // Fetch all states (statelist has pagination)
//   const fetchStates = async () => {
//     try {
//       let page = 1;
//       let lastPage = 1;
//       const allStates: ApiState[] = [];

//       while (page <= lastPage) {
//         const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
//         if (res.data?.success) {
//           const { data, last_page } = res.data;
//           allStates.push(...(data as ApiState[]));
//           lastPage = last_page ?? page; // fallback if not returned
//           page++;
//         } else {
//           break;
//         }
//       }

//       setStates(allStates);
//     } catch (error) {
//       console.error("Error fetching states:", error);
//     }
//   };

//   // Fetch cities list
//   const fetchCities = async () => {
//     try {
//       const res = await axios.post(`${apiUrl}/CityList`);
//       if (res.data?.success) {
//         // API may already send statename + stateid.
//         // if not, we can still derive statename later with getStateNameById.
//         setCities(res.data.data as ApiCity[]);
//       } else {
//         console.error("CityList error:", res.data);
//       }
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//     }
//   };

//   useEffect(() => {
//     fetchStates();
//     fetchCities();
//   }, []);

//   // =============== ADD CITY ===============

//   const handleSave = async () => {
//     if (!stateId || !cityName.trim()) {
//       alert("Please select state and enter city name");
//       return;
//     }

//     try {
//       const payload = {
//         name: cityName.trim(),
//         stateid: stateId, // 👈 required by backend
//       };

//       const res = await axios.post(`${apiUrl}/CityAdd`, payload);

//       if (res.data?.success) {
//         const newCity = res.data.data as ApiCity;

//         // API returns stateid but may not return statename, so derive:
//         const stName = getStateNameById(newCity.stateid);
//         setCities((prev) => [...prev, { ...newCity, statename: stName }]);

//         setCityName("");
//         setStateId("");
//         alert("City added successfully");
//       } else {
//         alert(res.data?.message || "Failed to add city");
//       }
//     } catch (error) {
//       console.error("Error adding city:", error);
//       alert("Error while adding city");
//     }
//   };

//   // =============== EDIT CITY ===============

//   const openEditModal = async (id: number) => {
//     try {
//       const res = await axios.post(`${apiUrl}/Cityshow`, { city_id: String(id) });
//       if (res.data?.success) {
//         const city = res.data.data as ApiCity;

//         // make sure we also have statename for dropdown label
//         const stName = city.statename || getStateNameById(city.stateid);
//         setEditCity({ ...city, statename: stName });

//         setIsEditOpen(true);
//       } else {
//         alert(res.data?.message || "Failed to fetch city");
//       }
//     } catch (error) {
//       console.error("Error fetching city:", error);
//       alert("Error while fetching city detail");
//     }
//   };

//   const handleUpdate = async () => {
//     if (!editCity) return;

//     if (!editCity.name.trim() || !editCity.stateid) {
//       alert("Please select state and enter city name");
//       return;
//     }

//     try {
//       const payload = {
//         name: editCity.name.trim(),
//         city_id: String(editCity.id),
//         state_id: editCity.stateid, // 👈 send updated state also
//       };

//       const res = await axios.post(`${apiUrl}/CityUpdate`, payload);

//       if (res.data?.success) {
//         const updated = res.data.data as ApiCity;
//         const stName = updated.statename || getStateNameById(updated.stateid);

//         setCities((prev) =>
//           prev.map((c) => (c.id === updated.id ? { ...updated, statename: stName } : c))
//         );
//         setIsEditOpen(false);
//         alert("City updated successfully");
//       } else {
//         alert(res.data?.message || "Failed to update city");
//       }
//     } catch (error) {
//       console.error("Error updating city:", error);
//       alert("Error while updating city");
//     }
//   };

//   // =============== DELETE CITY ===============

//   const handleDelete = async (id: number) => {
//     try {
//       const res = await axios.post(`${apiUrl}/CityDelete`, {
//         city_id: String(id),
//       });

//       if (res.data?.success) {
//         setCities((prev) => prev.filter((item) => item.id !== id));
//         alert("City deleted successfully");
//       } else {
//         alert(res.data?.message || "Failed to delete city");
//       }
//     } catch (error) {
//       console.error("Error deleting city:", error);
//       alert("Error while deleting city");
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

//   // =============== RENDER ===============

//   return (
//     <div className="flex gap-8 p-6">
//       {/* LEFT: ADD CITY FORM */}
//       <div className="w-1/3 bg-white p-6 shadow rounded-xl">
//         <h2 className="text-xl font-semibold mb-4">Add City</h2>

//         <label className="font-medium">State</label>
//         <select
//           value={stateId}
//           onChange={(e) => setStateId(e.target.value)}
//           className="w-full border px-3 py-2 rounded mt-1 mb-4"
//         >
//           <option value="">Select State</option>
//           {states.map((st) => (
//             <option key={st.stateId} value={st.stateId}>
//               {st.stateName}
//             </option>
//           ))}
//         </select>

//         <label className="font-medium">City</label>
//         <input
//           type="text"
//           value={cityName}
//           onChange={(e) => setCityName(e.target.value)}
//           placeholder="Enter city"
//           className="w-full border px-3 py-2 rounded mt-1 mb-6"
//         />

//         <button
//           onClick={handleSave}
//           className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
//         >
//           Save
//         </button>
//       </div>

//       {/* RIGHT: CITY LIST */}
//       <div className="w-2/3 bg-white p-6 shadow rounded-xl">
//         <h2 className="text-xl font-semibold mb-4">City List</h2>

//         {/* Search */}
//         <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
//           <input
//             type="text"
//             placeholder="Search City"
//             value={searchCity}
//             onChange={(e) => setSearchCity(e.target.value)}
//             className="border px-3 py-2 rounded w-1/3"
//           />
//           <button className="bg-[#2e56a6] text-white px-5 py-2 rounded">
//             Search
//           </button>
//         </div>

//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">ID</th>
//               <th className="p-1">State</th>
//               <th className="p-1">City</th>
//               <th className="p-1">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentRecords.map((item) => (
//               <tr key={item.id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{item.id}</td>
//                 <td className="p-1">
//                   {item.statename || getStateNameById(item.stateid)}
//                 </td>
//                 <td className="p-1">{item.name}</td>

//                 <td className="p-1 flex gap-3">
//                   <button
//                     className="text-blue-600 hover:text-blue-800"
//                     onClick={() => openEditModal(item.id)}
//                   >
//                     <EditIcon fontSize="small" />
//                   </button>
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

//         {/* PAGINATION */}
//         <div className="flex justify-center items-center mt-4 gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//             className={`px-3 py-1 rounded border ${currentPage === 1
//               ? "bg-gray-200 cursor-not-allowed"
//               : "bg-white hover:bg-gray-100"
//               }`}
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, index) => {
//             const page = index + 1;
//             return (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`px-3 py-1 rounded border ${currentPage === page
//                   ? "bg-[#2e56a6] text-white"
//                   : "bg-white hover:bg-gray-100"
//                   }`}
//               >
//                 {page}
//               </button>
//             );
//           })}

//           <button
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => handlePageChange(currentPage + 1)}
//             className={`px-3 py-1 rounded border ${currentPage === totalPages || totalPages === 0
//               ? "bg-gray-200 cursor-not-allowed"
//               : "bg-white hover:bg-gray-100"
//               }`}
//           >
//             Next
//           </button>
//         </div>

//         {/* EDIT MODAL */}
//         {isEditOpen && editCity && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//               <h2 className="text-xl font-semibold mb-4">Edit City</h2>

//               {/* State dropdown in edit */}
//               <label className="font-medium">State</label>
//               <select
//                 value={editCity.stateid || ""}
//                 onChange={(e) => {
//                   const newStateId = e.target.value;
//                   const stName = getStateNameById(newStateId);
//                   setEditCity({
//                     ...editCity,
//                     stateid: newStateId,
//                     statename: stName,
//                   });
//                 }}
//                 className="w-full border px-3 py-2 rounded mt-1 mb-4"
//               >
//                 <option value="">Select State</option>
//                 {states.map((st) => (
//                   <option key={st.stateId} value={st.stateId}>
//                     {st.stateName}
//                   </option>
//                 ))}
//               </select>

//               <label className="font-medium">City</label>
//               <input
//                 type="text"
//                 value={editCity.name}
//                 onChange={(e) =>
//                   setEditCity({ ...editCity, name: e.target.value })
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

//         {/* DELETE CONFIRMATION POPUP */}
//         {isDeleteOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
//               <h2 className="text-xl font-semibold text-red-600 mb-2">
//                 Delete Record
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete the record?
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
import { apiUrl } from "../../config";
import { toast } from "react-toastify"; // 👈 add this

interface ApiCity {
  cityid: number;
  name: string;
  iStatus: number;
  iSDelete: number;
  created_at: string;
  updated_at: string;
  stateid?: string;
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

  const getStateNameById = (sid?: string) => {
    if (!sid) return "-";
    const st = states.find((s) => String(s.stateId) === String(sid));
    return st?.stateName || "-";
  };

  // ✅ normalize city from backend (handles id vs cityid)
  const normalizeCity = (c: any): ApiCity => ({
    cityid: c.cityid ?? c.id,
    name: c.name,
    iStatus: c.iStatus,
    iSDelete: c.iSDelete,
    created_at: c.created_at,
    updated_at: c.updated_at,
    stateid: c.stateid,
    statename: c.statename,
  });

  // =============== API CALLS ===============

  const fetchStates = async () => {
    try {
      let page = 1;
      let lastPage = 1;
      const allStates: ApiState[] = [];

      while (page <= lastPage) {
        const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
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
        const apiData = res.data.data || [];
        const normalized: ApiCity[] = apiData.map((c: any) => normalizeCity(c));
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

  useEffect(() => {
    fetchStates();
    fetchCities();
  }, []);

  // =============== ADD CITY ===============

  const handleSave = async () => {
    if (!stateId || !cityName.trim()) {
      toast.warn("Please select state and enter city name");
      return;
    }

    try {
      const payload = {
        name: cityName.trim(),
        stateid: stateId,
      };

      const res = await axios.post(`${apiUrl}/CityAdd`, payload);

      if (res.data?.success) {
        const newCityRaw = res.data.data;
        const newCity = normalizeCity(newCityRaw);
        const stName = getStateNameById(newCity.stateid);
        setCities((prev) => [...prev, { ...newCity, statename: stName }]);

        setCityName("");
        setStateId("");
        toast.success("City added successfully");
      } else {
        toast.error(res.data?.message || "Failed to add city");
      }
    } catch (error) {
      console.error("Error adding city:", error);
      toast.error("Error while adding city");
    }
  };

  // =============== EDIT CITY ===============

  const openEditModal = async (cityid: number) => {
    try {
      const res = await axios.post(`${apiUrl}/Cityshow`, { city_id: String(cityid) });
      if (res.data?.success) {
        const cityRaw = res.data.data;
        const city = normalizeCity(cityRaw);
        const stName = city.statename || getStateNameById(city.stateid);
        setEditCity({ ...city, statename: stName });

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
      const payload = {
        name: editCity.name.trim(),
        city_id: editCity.cityid, // ✅ now guaranteed
        state_id: editCity.stateid,
      };

      const res = await axios.post(`${apiUrl}/CityUpdate`, payload);

      if (res.data?.success) {
        const updatedRaw = res.data.data;
        const updated = normalizeCity(updatedRaw);
        const stName = updated.statename || getStateNameById(updated.stateid);

        setCities((prev) =>
          prev.map((c) =>
            c.cityid === updated.cityid ? { ...updated, statename: stName } : c
          )
        );
        setIsEditOpen(false);
        toast.success("City updated successfully");
      } else {
        toast.error(res.data?.message || "Failed to update city");
      }
    } catch (error) {
      console.error("Error updating city:", error);
      toast.error("Error while updating city");
    }
  };

  // =============== DELETE CITY ===============

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.post(`${apiUrl}/CityDelete`, {
        city_id: String(id),
      });

      if (res.data?.success) {
        setCities((prev) => prev.filter((item) => item.cityid !== id));
        toast.success("City deleted successfully");
      } else {
        toast.error(res.data?.message || "Failed to delete city");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Error while deleting city");
    }
  };

  // =============== SEARCH + PAGINATION ===============

  const filteredCities = cities.filter((item) =>
    item.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCities.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredCities.length / recordsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // =============== RENDER ===============

  return (
    <div className="flex gap-8 p-6">
      {/* LEFT: ADD CITY FORM */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add City</h2>

        <label className="font-medium">State</label>
        <select
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        >
          <option value="">Select State</option>
          {states.map((st) => (
            <option key={st.stateId} value={st.stateId}>
              {st.stateName}
            </option>
          ))}
        </select>

        <label className="font-medium">City</label>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter city"
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        />

        <button
          onClick={handleSave}
          className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
        >
          Save
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
            onChange={(e) => setSearchCity(e.target.value)}
            className="border px-3 py-2 rounded w-1/3"
          />
          <button className="bg-[#2e56a6] text-white px-5 py-2 rounded">
            Search
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-1">State</th>
              <th className="p-1">City</th>
              <th className="p-1">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((item,index) => (
              <tr key={item.cityid} className="border-b hover:bg-gray-50">
                <td className="p-3">{index+1}</td>
                <td className="p-1">
                  {item.statename || getStateNameById(item.stateid)}
                </td>
                <td className="p-1">{item.name}</td>

                <td className="p-1 flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => openEditModal(item.cityid)}
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setDeleteId(item.cityid);
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

          {[...Array(totalPages)].map((_, index) => {
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
        {isEditOpen && editCity && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit City</h2>

              <label className="font-medium">State</label>
              <select
                value={editCity.stateid || ""}
                onChange={(e) => {
                  const newStateId = e.target.value;
                  const stName = getStateNameById(newStateId);
                  setEditCity({
                    ...editCity,
                    stateid: newStateId,
                    statename: stName,
                  });
                }}
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              >
                <option value="">Select State</option>
                {states.map((st) => (
                  <option key={st.stateId} value={st.stateId}>
                    {st.stateName}
                  </option>
                ))}
              </select>

              <label className="font-medium">City</label>
              <input
                type="text"
                value={editCity.name}
                onChange={(e) =>
                  setEditCity({ ...editCity, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-[#2e56a6] text-white rounded hover:bg-blue-700"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION POPUP */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
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
                >
                  Cancel
                </button>

                <button
                  className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    if (deleteId !== null) {
                      handleDelete(deleteId);
                    }
                    setIsDeleteOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
