import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {  useNavigate } from "react-router-dom";


interface UserData {
  id: number | null;
  name: string;
  mobile: string;
  address: string;
  department: string;
  password:string;
}

export default function UserMaster() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  const [searchMobile, setSearchMobile] = useState("");

  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      name: "Rahul Shah",
      mobile: "9876543210",
      address: "Ahmedabad",
      department: "Data Entry",
      password:"rahul123",
    },
    {
      id: 2,
      name: "Priya Patel",
      mobile: "9090909090",
      address: "Surat",
      department: "Marketing",
      password:"priya123"
    },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<UserData>({
    id: null,
    name: "",
    mobile: "",
    address: "",
    department: "",
    password:""
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Save New User
  const handleSave = () => {
    if (!name || !mobile || !address || !department)
      return alert("Please fill all fields");

    const newUser = {
      id: users.length + 1,
      name,
      mobile,
      address,
      department,
      password
    };

    setUsers([...users, newUser]);

    setName("");
    setMobile("");
    setAddress("");
    setDepartment("");
    setPassword("");
  };

  // Update User
  const handleUpdate = () => {
    setUsers(
      users.map((u) =>
        u.id === editData.id ? editData : u
      )
    );
    setIsEditOpen(false);
  };

  // Delete User
  const handleDelete = (id: any) => {
    setUsers(users.filter((item) => item.id !== id));
  };

  // 🔍 Filter by Mobile Number
  const filteredUsers = users.filter((item) =>
    item.mobile.toLowerCase().includes(searchMobile.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex  gap-8 p-6">

      {/* LEFT: Add User Form */}
      <div className="w-1/3 bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add User</h2>

        <label className="font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        <label className="font-medium">Mobile</label>
        <input
          type="number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        <label className="font-medium">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="w-full border px-3 py-2 rounded mt-1 mb-4"
        />

        <label className="font-medium">Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        >
          <option value="">Select Department</option>
          <option value="Data Entry">Data Entry</option>
          <option value="Marketing">Marketing</option>

        </select>

        <label className="font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full border px-3 py-2 rounded mt-1 mb-6"
        />

        <button
          onClick={handleSave}
          className="bg-[#2e56a6] text-white px-5 py-2 rounded hover:bg-[#bf7e4e]"
        >
          Save
        </button>
      </div>

      {/* RIGHT: User List */}
      <div className="w-2/3  bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">User List</h2>

        {/* Search */}
        <div className="bg-white border rounded-xl p-4 mb-5 shadow-sm flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by Mobile Number"
            value={searchMobile}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setSearchMobile(value);
              }
            }}

            className="border px-3 py-2 rounded w-1/3"
          />
          <button className="bg-[#2e56a6] text-white px-5 py-2 rounded">
            Search
          </button>
        </div>

        <table className="w-full overflow-x-scroll border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-1">Name</th>
              <th className="p-1">Mobile</th>
              <th className="p-1">Address</th>
              <th className="p-1">Department</th>
              <th className="p-1">Expo Count</th>
              <th className="p-1">Password</th>
              <th className="p-1">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.id}</td>
                <td className="p-1">{item.name}</td>
                <td className="p-1">{item.mobile}</td>
                <td className="p-1">{item.address}</td>
                <td className="p-1">{item.department}</td>
                <td className="p-1 text-center">10</td>
                <td className="p-1">{item.password}</td>

                <td className="p-1 py-2 flex items-center gap-1">
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

                  <button
                    className="text-blue-600 hover:text-blue-800"
                     onClick={() => navigate(`/admin/users/assign/${item.id}`)}

                  >
                    <AssignmentIcon fontSize="small" />
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
            className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
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
                className={`px-3 py-1 rounded border ${currentPage === page ? "bg-[#2e56a6] text-white" : "bg-white hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-3 py-1 rounded border ${currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>

        {/* EDIT MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">

              <h2 className="text-xl font-semibold mb-4">Edit User</h2>

              <label className="font-medium">Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <label className="font-medium">Mobile</label>
              <input
                type="text"
                value={editData.mobile}
                onChange={(e) =>
                  setEditData({ ...editData, mobile: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <label className="font-medium">Address</label>
              <input
                type="text"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              />

              <label className="font-medium">Department</label>
              <select
                value={editData.department}
                onChange={(e) =>
                  setEditData({ ...editData, department: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1 mb-4"
              >
                <option value="">Select Department</option>
                <option value="Data Entry">Data Entry</option>
                <option value="Marketing">Marketing</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-[#2e56a6] text-white rounded"
                  onClick={handleUpdate}
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
                Delete User
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user?
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
