import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiUrl } from "../../config";
import { toast } from "react-toastify";

interface ApiCity {
  cityid: number;
  name: string;
  iStatus?: number;
  iSDelete?: number;
  created_at?: string;
  updated_at?: string;
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

  const [citySuggestions, setCitySuggestions] = useState<ApiCity[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isCitySearching, setIsCitySearching] = useState(false);

  const [editCitySuggestions, setEditCitySuggestions] = useState<ApiCity[]>([]);
  const [showEditCityDropdown, setShowEditCityDropdown] = useState(false);
  const [isEditCitySearching, setIsEditCitySearching] = useState(false);

  const addCityRef = useRef<HTMLDivElement | null>(null);
  const editCityRef = useRef<HTMLDivElement | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCity, setEditCity] = useState<ApiCity | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [isListing, setIsListing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const getPageNumbers = (current: number, total: number) => {
    const pageNumbers: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pageNumbers.push(i);
      return pageNumbers;
    }

    pageNumbers.push(1);

    if (current > 3) pageNumbers.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pageNumbers.push(i);

    if (current < total - 2) pageNumbers.push("...");

    pageNumbers.push(total);

    return pageNumbers;
  };

  const fetchStates = async () => {
    try {
      const res = await axios.post(`${apiUrl}/statelist`);

      if (res.data?.success) {
        setStates(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load states");
      }
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

        const normalized: ApiCity[] = apiData.map((c: any) => {
          const city = normalizeCity(c);
          const stName = city.statename || getStateNameById(city.stateid);

          return {
            ...city,
            statename: stName !== "-" ? stName : city.statename,
          };
        });

        setCities(normalized);
      } else {
        toast.error(res.data?.message || "Failed to load cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Error while fetching cities");
    }
  };

  const fetchCitySuggestions = async (
    value: string,
    selectedStateId: string,
    type: "add" | "edit"
  ) => {
    if (!value.trim() || !selectedStateId) {
      if (type === "add") {
        setCitySuggestions([]);
        setShowCityDropdown(false);
      } else {
        setEditCitySuggestions([]);
        setShowEditCityDropdown(false);
      }
      return;
    }

    try {
      if (type === "add") {
        setIsCitySearching(true);
      } else {
        setIsEditCitySearching(true);
      }

      const res = await axios.post(`${apiUrl}/citySuggestions`, {
        stateid: selectedStateId,
        search: value,
        limit: "10",
      });

      if (res.data?.success) {
        const data = res.data.data || [];

        if (type === "add") {
          setCitySuggestions(data);
          setShowCityDropdown(true);
        } else {
          setEditCitySuggestions(data);
          setShowEditCityDropdown(true);
        }
      } else {
        if (type === "add") {
          setCitySuggestions([]);
          setShowCityDropdown(false);
        } else {
          setEditCitySuggestions([]);
          setShowEditCityDropdown(false);
        }
      }
    } catch (error) {
      console.error("City suggestion error:", error);

      if (type === "add") {
        setCitySuggestions([]);
        setShowCityDropdown(false);
      } else {
        setEditCitySuggestions([]);
        setShowEditCityDropdown(false);
      }
    } finally {
      if (type === "add") {
        setIsCitySearching(false);
      } else {
        setIsEditCitySearching(false);
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        addCityRef.current &&
        !addCityRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
      }

      if (
        editCityRef.current &&
        !editCityRef.current.contains(event.target as Node)
      ) {
        setShowEditCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchCity]);

  const handleSave = async () => {
    if (!stateId || !cityName.trim()) {
      toast.warn("Please select state and enter city name");
      return;
    }

    try {
      setIsSaving(true);

      const res = await axios.post(`${apiUrl}/CityAdd`, {
        name: cityName.trim(),
        stateid: stateId,
      });

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
        setCitySuggestions([]);
        setShowCityDropdown(false);

        toast.success(res.data?.message || "City added successfully");
      } else {
        toast.error(res.data?.error || res.data?.message || "Failed to add city");
      }
    } catch (error: unknown) {
      console.error("Error adding city:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        toast.error(data?.error || data?.message || error.message);
      } else {
        toast.error("Something went wrong while adding city");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = async (cityid: number) => {
    try {
      const res = await axios.post(`${apiUrl}/Cityshow`, {
        city_id: String(cityid),
      });

      if (res.data?.success) {
        const city = normalizeCity(res.data.data);
        const sid = String(city.stateid ?? "");
        const stNameFromList = getStateNameById(sid);

        setEditCity({
          ...city,
          stateid: sid,
          statename: stNameFromList !== "-" ? stNameFromList : city.statename || "",
        });

        setEditCitySuggestions([]);
        setShowEditCityDropdown(false);
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

    if (!editCity.name?.trim() || !editCity.stateid) {
      toast.warn("Please select state and enter city name");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await axios.post(`${apiUrl}/CityUpdate`, {
        name: editCity.name.trim(),
        city_id: editCity.cityid,
        stateid: String(editCity.stateid),
        state_id: String(editCity.stateid),
      });

      if (res.data?.success) {
        const updated = normalizeCity(res.data.data);
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
        setEditCitySuggestions([]);
        setShowEditCityDropdown(false);

        toast.success(res.data?.message || "City updated successfully");
      } else {
        toast.error(res.data?.error || res.data?.message || "Failed to update city");
      }
    } catch (error: unknown) {
      console.error("Error updating city:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        toast.error(data?.error || data?.message || error.message);
      } else {
        toast.error("Something went wrong while updating city");
      }
    } finally {
      setIsUpdating(false);
    }
  };

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

  const filteredCities = cities.filter((item) => {
    const search = searchCity.toLowerCase().trim();

    if (!search) return true;

    const cityMatch = item.name?.toLowerCase().includes(search);
    const stateMatch = (item.statename || getStateNameById(item.stateid))
      .toLowerCase()
      .includes(search);

    return cityMatch || stateMatch;
  });

  const totalPages = Math.ceil(filteredCities.length / recordsPerPage);
  const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const indexOfLastRecord = safeCurrentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCities.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const pageNumbers = getPageNumbers(safeCurrentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    if (totalPages === 0 && currentPage !== 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  return (
    <div className="relative">
      <div className="flex gap-8 p-6">
        <div className="w-1/3 bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Add City</h2>

          <label className="font-medium">State</label>
          <select
            value={stateId}
            disabled={isSaving || isListing}
            onChange={(e) => {
              setStateId(e.target.value);
              setCityName("");
              setCitySuggestions([]);
              setShowCityDropdown(false);
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

          <div className="relative mb-6" ref={addCityRef}>
            <input
              type="text"
              value={cityName}
              disabled={isSaving || isListing || !stateId}
              onChange={(e) => {
                const value = e.target.value;
                setCityName(value);
                fetchCitySuggestions(value, stateId, "add");
              }}
              onFocus={() => {
                if (citySuggestions.length > 0) setShowCityDropdown(true);
              }}
              placeholder={stateId ? "Enter city" : "Please select state first"}
              className="w-full border px-3 py-2 rounded mt-1 disabled:bg-gray-100"
            />

            {showCityDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded shadow z-50 max-h-56 overflow-y-auto">
                {isCitySearching ? (
                  <div className="px-3 py-2 text-gray-500">Searching...</div>
                ) : citySuggestions.length > 0 ? (
                  citySuggestions.map((city) => (
                    <div
                      key={city.cityid}
                      onClick={() => {
                        setCityName(city.name);
                        setShowCityDropdown(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {city.name}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No City Found</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || isListing}
            className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="w-2/3 bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">City List</h2>

          <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
            <input
              type="text"
              placeholder="Search City or State"
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
                    <td className="p-3">{indexOfFirstRecord + index + 1}</td>
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
                <span key={`dots-${index}`} className="px-3 py-1 text-gray-500">
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

          <div className="text-center text-sm text-gray-500 mt-2">
            Showing {currentRecords.length > 0 ? indexOfFirstRecord + 1 : 0} to{" "}
            {Math.min(indexOfLastRecord, filteredCities.length)} of{" "}
            {filteredCities.length} records
          </div>

          {isEditOpen && editCity && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit City</h2>

                  <button
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditCitySuggestions([]);
                      setShowEditCityDropdown(false);
                    }}
                    disabled={isUpdating}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
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
                      name: "",
                    });

                    setEditCitySuggestions([]);
                    setShowEditCityDropdown(false);
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

                <div className="relative mb-4" ref={editCityRef}>
                  <input
                    type="text"
                    value={editCity.name}
                    disabled={isUpdating || !editCity.stateid}
                    onChange={(e) => {
                      const value = e.target.value;

                      setEditCity({
                        ...editCity,
                        name: value,
                      });

                      fetchCitySuggestions(
                        value,
                        String(editCity.stateid ?? ""),
                        "edit"
                      );
                    }}
                    onFocus={() => {
                      if (editCitySuggestions.length > 0) {
                        setShowEditCityDropdown(true);
                      }
                    }}
                    className="w-full border px-3 py-2 rounded mt-1 disabled:bg-gray-100"
                  />

                  {showEditCityDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border rounded shadow z-50 max-h-56 overflow-y-auto">
                      {isEditCitySearching ? (
                        <div className="px-3 py-2 text-gray-500">Searching...</div>
                      ) : editCitySuggestions.length > 0 ? (
                        editCitySuggestions.map((city) => (
                          <div
                            key={city.cityid}
                            onClick={() => {
                              setEditCity({
                                ...editCity,
                                name: city.name,
                              });
                              setShowEditCityDropdown(false);
                            }}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            {city.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">
                          No city found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditCitySuggestions([]);
                      setShowEditCityDropdown(false);
                    }}
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

          {isDeleteOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px] relative">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold"
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