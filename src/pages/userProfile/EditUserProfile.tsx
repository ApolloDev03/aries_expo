import { useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

type Tab = "personal" | "password";

export default function EditUserProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  // 🔒 Static personal data
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("Isanpur");

  // 🔒 Static password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition
              ${
                activeTab === "personal"
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
              ${
                activeTab === "password"
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

            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <input
                type="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => alert("Static: Update clicked")}
              className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition"
            >
              Update Details
            </button>
          </div>
        )}

        {/* CHANGE PASSWORD */}
        {activeTab === "password" && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Old Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => alert("Static: Change password clicked")}
              className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
