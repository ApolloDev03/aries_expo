import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Item {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
}

export default function DummyAdminPage() {
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "John Doe", email: "john@gmail.com", phone: "9876543210", city: "New York" },
        { id: 2, name: "Sara Smith", email: "sara@gmail.com", phone: "7654321098", city: "Los Angeles" },
    ]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [editId, setEditId] = useState<number | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<Item | null>(null);

    // Reset form
    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setCity("");
        setEditId(null);
    };

    // Save / Update
    const handleSubmit = () => {
        if (!name || !email || !phone || !city) return;

        if (editId) {
            // Update
            setItems((prev) =>
                prev.map((item) =>
                    item.id === editId
                        ? { ...item, name, email, phone, city }
                        : item
                )
            );
        } else {
            // Add new
            setItems((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    name,
                    email,
                    phone,
                    city,
                },
            ]);
        }

        resetForm();
    };

    // Edit record
    const handleEdit = (item: Item) => {
        setEditId(item.id);
        setName(item.name);
        setEmail(item.email);
        setPhone(item.phone);
        setCity(item.city);
    };

    // Delete logic
    const handleDelete = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const confirmDelete = () => {
        if (userToDelete) {
            handleDelete(userToDelete.id);
        }
        setIsDeleteOpen(false);
    };

    return (
        <div className="p-6 flex gap-8 max-w-6xl mx-auto">

            {/* LEFT FORM */}
            <div className="w-1/3 bg-white shadow-lg border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editId ? "Edit User" : "Add User"}
                </h2>

                {/* Name */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        placeholder="Enter name"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        placeholder="Enter phone number"
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                {/* City */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">City</label>
                    <input
                        type="text"
                        value={city}
                        placeholder="Enter city"
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition active:scale-95"
                    >
                        {editId ? "Update" : "Save"}
                    </button>

                    {editId && (
                        <button
                            onClick={resetForm}
                            className="px-5 py-2 border border-gray-500 rounded-full hover:bg-gray-100 transition active:scale-95"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* RIGHT TABLE */}
            <div className="w-2/3 bg-white shadow-lg border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">User List</h2>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border-b">ID</th>
                                <th className="p-3 border-b">Name</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Phone</th>
                                <th className="p-3 border-b">City</th>
                                <th className="p-3 border-b text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-gray-200 transition ${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="p-3 border-b">{item.id}</td>
                                    <td className="p-3 border-b">{item.name}</td>
                                    <td className="p-3 border-b">{item.email}</td>
                                    <td className="p-3 border-b">{item.phone}</td>
                                    <td className="p-3 border-b">{item.city}</td>

                                    <td className="p-3 border-b text-center">
                                        <div className="flex justify-center gap-3">

                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-800 transition"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setUserToDelete(item);
                                                    setIsDeleteOpen(true);
                                                }}
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DELETE POPUP */}
            {isDeleteOpen && userToDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">

                        <h2 className="text-xl font-semibold text-red-600 mb-3">Delete Record</h2>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete this record?
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="px-5 py-2 rounded-full border border-gray-400 
                                    text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-full bg-red-600 text-white 
                                    hover:bg-red-700 transition active:scale-95"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
