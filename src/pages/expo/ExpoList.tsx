import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ExpoData {
  id: number | null;
  expoName: string;
  industry: string;
  state: string;
  city: string;
}

export default function ExpoMaster() {
  const [expoName, setExpoName] = useState("");
  const [industryValue, setIndustryValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [cityValue, setCityValue] = useState("");

  const [searchExpo, setSearchExpo] = useState("");

  const [expoList, setExpoList] = useState<ExpoData[]>([
    {
      id: 1,
      expoName: "Tech Expo",
      industry: "Technology",
      state: "Gujarat",
      city: "Ahmedabad",
    },
    {
      id: 2,
      expoName: "Food Fest",
      industry: "Food",
      state: "Maharashtra",
      city: "Mumbai",
    },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<ExpoData>({
    id: null,
    expoName: "",
    industry: "",
    state: "",
    city: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSave = () => {
    if (!expoName || !industryValue || !stateValue || !cityValue)
      return alert("Please fill all fields");

    const newExpo = {
      id: expoList.length + 1,
      expoName,
      industry: industryValue,
      state: stateValue,
      city: cityValue,
    };

    setExpoList([...expoList, newExpo]);
    setExpoName("");
    setIndustryValue("");
    setStateValue("");
    setCityValue("");
  };

  const handleUpdate = () => {
    setExpoList(
      expoList.map((item) =>
        item.id === editData.id ? editData : item
      )
    );
    setIsEditOpen(false);
  };

  const handleDelete = (id: number) => {
    setExpoList(expoList.filter((item) => item.id !== id));
  };

  // 🔍 SEARCH BY EXPO NAME
  const filteredExpo = expoList.filter((item) =>
    item.expoName.toLowerCase().includes(searchExpo.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredExpo.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExpo.length / recordsPerPage);

  return (
    <div className="flex gap-8 p-6">

      {/* LEFT FORM */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add Expo</h2>

        <label className="font-medium">Expo Name</label>
        <input
          type="text"
          value={expoName}
          onChange={(e) => setExpoName(e.target.value)}
          placeholder="Enter Expo Name"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        <label className="font-medium">Industry</label>
        <select
          value={industryValue}
          onChange={(e) => setIndustryValue(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        >
          <option value="">Select Industry</option>
          <option value="Technology">Technology</option>
          <option value="Food">Food</option>
          <option value="Automobile">Automobile</option>
          <option value="Construction">Construction</option>
        </select>

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
          value={cityValue}
          onChange={(e) => setCityValue(e.target.value)}
          placeholder="Enter City"
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        />

        <button
          onClick={handleSave}
          className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
        >
          Save
        </button>
      </div>

      {/* RIGHT TABLE */}
      <div className="w-2/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Expo List</h2>

        {/* Search */}
        <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Expo Name"
            value={searchExpo}
            onChange={(e) => setSearchExpo(e.target.value)}
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
              <th className="p-1">Expo</th>
              <th className="p-1">Industry</th>
              <th className="p-1">State</th>
              <th className="p-1">City</th>
              <th className="p-1">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.id}</td>
                <td className="p-1">{item.expoName}</td>
                <td className="p-1">{item.industry}</td>
                <td className="p-1">{item.state}</td>
                <td className="p-1">{item.city}</td>

                <td className="p-1 flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
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

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? "bg-[#2e56a6] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>

        {/* EDIT POPUP */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">

              <h2 className="text-xl font-semibold mb-4">Edit Expo</h2>

              <label className="font-medium">Expo Name</label>
              <input
                type="text"
                value={editData.expoName}
                onChange={(e) =>
                  setEditData({ ...editData, expoName: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <label className="font-medium">Industry</label>
              <select
                value={editData.industry}
                onChange={(e) =>
                  setEditData({ ...editData, industry: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              >
                <option>Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Food">Food</option>
                <option value="Automobile">Automobile</option>
              </select>

              <label className="font-medium">State</label>
              <select
                value={editData.state}
                onChange={(e) =>
                  setEditData({ ...editData, state: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              >
                <option>Select State</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
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
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[#2e56a6] text-white rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE POPUP */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[380px]">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Delete Record
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this expo?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  className="px-5 py-2 border rounded-full"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-5 py-2 bg-red-600 text-white rounded-full"
                  onClick={() => {
                    if (deleteId !== null) handleDelete(deleteId);
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
