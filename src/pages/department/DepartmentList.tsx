import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface DepartmentData {
  id: number | null;
  department: string;
}

export default function DepartmentMaster() {
  const [department, setDepartment] = useState("");

  const [departments, setDepartments] = useState([
    { id: 1, department: "HR" },
    { id: 2, department: "Finance" },
    { id: 3, department: "Operations" },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<DepartmentData>({
    id: null,
    department: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Add Department
  const handleSave = () => {
    if (!department) return alert("Please enter department name");

    const newDepartment = {
      id: departments.length + 1,
      department,
    };

    setDepartments([...departments, newDepartment]);
    setDepartment("");
  };

  // Update Department
  const handleUpdate = () => {
    setDepartments(
      departments.map((item) =>
        item.id === editData.id
          ? { ...item, department: editData.department }
          : item
      )
    );
    setIsEditOpen(false);
  };

  // Delete Department
  const handleDelete = (id: any) => {
    setDepartments(departments.filter((item) => item.id !== id));
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = departments.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(departments.length / recordsPerPage);

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
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Enter department"
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        />

        <button
          onClick={handleSave}
          className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
        >
          Save
        </button>
      </div>

      {/* RIGHT LIST */}
      <div className="w-2/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Department List</h2>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-1">Department</th>
              <th className="p-1">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.id}</td>
                <td className="p-1">{item.department}</td>

                <td className="p-1 flex gap-3">
                  {/* Edit */}
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditData(item);
                      setIsEditOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </button>

                  {/* Delete */}
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

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
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
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>

        {/* Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Department</h2>

              <label className="font-medium">Department</label>
              <input
                type="text"
                value={editData.department}
                onChange={(e) =>
                  setEditData({ ...editData, department: e.target.value })
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

        {/* Delete Modal */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
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
