import { useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function EditProfile() {
    const [activeTab, setActiveTab] = useState<"personal" | "password">(
        "personal"
    );

    // Default admin details (dummy)
    const [name, setName] = useState("Admin User");
    const [email, setEmail] = useState("admin@example.com");
    const [phone, setPhone] = useState("9876543210");

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab("personal")}
                        className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition 
            ${activeTab === "personal"
                                ? "border-blue-600 text-[#2e56a6]"
                                : "border-transparent text-gray-600 hover:text-[#2e56a6]"
                            }`}
                    >
                        <AccountCircleOutlinedIcon fontSize="small" />
                        Personal Details
                    </button>

                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition 
            ${activeTab === "password"
                                ? "border-blue-600 text-[#2e56a6]"
                                : "border-transparent text-gray-600 hover:text-[#2e56a6]"
                            }`}
                    >
                        <LockOutlinedIcon fontSize="small" />
                        Change Password
                    </button>
                </div>

                {/* PERSONAL DETAILS */}
                {activeTab === "personal" && (
                    <div className="space-y-5">

                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg  transition">
                            Update Details
                        </button>
                    </div>
                )}

                {/* CHANGE PASSWORD */}
                {activeTab === "password" && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                Old Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter old password"
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg  transition">
                            Change Password
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
