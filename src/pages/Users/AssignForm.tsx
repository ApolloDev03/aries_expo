import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

interface AssignedItem {
  id: number;
  industry: string;
  expo: string;
}

export default function AssignForm() {
  const { id } = useParams();

  const [userName, setUserName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [expo, setExpo] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);


  const [assignedList, setAssignedList] = useState<AssignedItem[]>([]);

  // Fetch user by ID
  useEffect(() => {
    const demoUsers = [
      { id: "1", name: "Sweta Panchal" },
      { id: "2", name: "Priya Patel" },
    ];

    const selectedUser = demoUsers.find((u) => u.id === id);
    if (selectedUser) setUserName(selectedUser.name);
  }, [id]);

  // Save Assigned Expo
  const handleSave = () => {
    if (!industry || !expo) return;

    const newEntry: AssignedItem = {
      id: Date.now(),
      industry,
      expo,
    };

    setAssignedList([...assignedList, newEntry]);
    setIndustry("");
    setExpo("");
  };

  // Delete Assigned Expo
  const handleDelete = (deleteId: number) => {
    setAssignedList(assignedList.filter((item) => item.id !== deleteId));
  };

  return (
    <div className="p-6">
      {/* HEADING */}
      <h1 className="text-2xl font-bold mb-6">
        Assigning Expo to <span className="text-blue-600">{userName}</span>
      </h1>

      <div className="flex gap-6">
        {/* LEFT SIDE FORM */}
        <div className="w-1/3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Assign Expo</h2>

          {/* Industry Dropdown */}
          <label className="font-medium">Select Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1 mb-4"
          >
            <option value="">-- Select Industry --</option>
            <option value="Autoshow expo">Autoshow expo</option>
            <option value="Electric expo">Electric expo</option>
            <option value="Earthcon expo">Earthcon expo</option>
          </select>

          {/* Expo Dropdown */}
          <label className="font-medium">Select Expo</label>
          <select
            value={expo}
            onChange={(e) => setExpo(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1 mb-4"
          >
            <option value="">-- Select Expo --</option>
            <option value="Auto Expo 2024">Auto Expo 2024</option>
            <option value="IT Global Meetup">IT Global Meetup</option>
            <option value="Textile India">Textile India</option>
          </select>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>

        {/* RIGHT SIDE TABLE */}
        <div className="w-2/3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Assigned Expos</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 border">Industry</th>
                <th className="p-1 border">Expo</th>
                <th className="p-1 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No expo assigned yet
                  </td>
                </tr>
              ) : (
                assignedList.map((item) => (
                  <tr key={item.id} className="border-b text-center">
                    <td className="p-1 border">{item.industry}</td>
                    <td className="p-1 border">{item.expo}</td>
                    <td className="p-1 border text-center">
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                Delete Record
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the record?
              </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      if (deleteId !== null) handleDelete(deleteId);
                      setShowDeleteModal(false);
                    }}
                    className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
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
