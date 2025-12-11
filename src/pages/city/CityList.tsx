import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface CityData {
  id: number | null;
  state: string;
  city: string;
}

export default function CityMaster() {
  const [stateValue, setStateValue] = useState("");
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [cities, setCities] = useState([
    { id: 1, state: "Gujarat", city: "Ahmedabad" },
    { id: 2, state: "Maharashtra", city: "Mumbai" },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<CityData>({
    id: null,
    state: "",
    city: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);



  const handleSave = () => {
    if (!stateValue || !city) return alert("Please fill all fields");

    const newCity = {
      id: cities.length + 1,
      state: stateValue,
      city,
    };

    setCities([...cities, newCity]);
    setStateValue("");
    setCity("");
  };

  const handleUpdate = () => {
    setCities(
      cities.map((c) =>
        c.id === editData.id ? { ...c, state: editData.state, city: editData.city } : c
      )
    );
    setIsEditOpen(false);
  };


  const handleDelete = (id: any) => {
    setCities(cities.filter((item) => item.id !== id));
  };

  // Filter cities based on search input
  const filteredCities = cities.filter((item) =>
    item.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="flex gap-8 p-6">

      {/* LEFT: ADD CITY FORM */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add City</h2>

        <label className="font-medium">State</label>
        <select
          value={stateValue}
          onChange={(e) => setStateValue(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        >
          <option value="">Select State</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Karnataka">Karnataka</option>
        </select>

        <label className="font-medium">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
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

        {/* 🔍 Search Section Added Here */}
        <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
          <input
            type="text"
            placeholder="Search City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="border px-3 py-2 rounded w-1/3"
          />
          <button
            className="bg-[#2e56a6] text-white px-5 py-2 rounded"
          >
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
            {filteredCities.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.id}</td>
                <td className="p-1">{item.state}</td>
                <td className="p-1">{item.city}</td>

                <td className="p-1 flex gap-3">
                  <button className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditData(item);
                      setIsEditOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setDeleteId(item.id);  // store row id
                      setIsDeleteOpen(true); // open popup
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* EDIT MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">

              <h2 className="text-xl font-semibold mb-4">Edit City</h2>

              <label className="font-medium">State</label>
              <select
                value={editData.state}
                onChange={(e) =>
                  setEditData({ ...editData, state: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              >
                <option value="">Select State</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Karnataka">Karnataka</option>
              </select>

              <label className="font-medium">City</label>
              <input
                type="text"
                value={editData.city}
                onChange={(e) =>
                  setEditData({ ...editData, city: e.target.value })
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

              {/* Title */}
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Delete Record
              </h2>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the record?
              </p>

              {/* Buttons */}
              <div className="flex justify-center gap-4">

                {/* Cancel Button */}
                <button
                  className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </button>

                {/* Delete Button */}
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
