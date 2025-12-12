import { useEffect, useState } from "react";
import axios from "axios";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

type Tab = "personal" | "password";

type ProfileRes = {
    success: boolean;
    data?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        mobile_number: string;
    };
    message?: string;
};

export default function EditProfile() {
    const [activeTab, setActiveTab] = useState<Tab>("personal");

    // personal
    const [name, setName] = useState(""); // API wants "name"
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // password
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // loaders
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [savingPersonal, setSavingPersonal] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const getAdminId = () =>
        localStorage.getItem("admin_id") || localStorage.getItem("adminId");

    const toastApiError = (e: any, fallback = "Something went wrong") => {
        const msg =
            e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.message ||
            fallback;
        toast.error(msg);
    };

    // ✅ FETCH PROFILE (prefill)
    const fetchProfile = async () => {
        const adminId = getAdminId();
        if (!adminId) {
            toast.error("Admin id not found. Please login again.");
            return;
        }

        try {
            setLoadingProfile(true);

            const res = await axios.post<ProfileRes>(
                `${apiUrl}/admin/profile`,
                { admin_id: String(adminId) },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data?.success && res.data?.data) {
                const d = res.data.data;

                // Your profile API returns first_name + last_name
                const fullName = `${d.first_name || ""} ${d.last_name || ""}`.trim();

                setName(fullName);
                setEmail(d.email || "");
                setPhone(d.mobile_number || "");
            } else {
                toast.error(res.data?.message || "Failed to load profile");
            }
        } catch (e: any) {
            console.error(e);
            toastApiError(e, "Profile fetch failed");
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ UPDATE PERSONAL DETAILS
    const handleUpdateDetails = async () => {
        const adminId = getAdminId();
        if (!adminId) return toast.error("Admin id not found. Please login again.");

        if (!name.trim() || !email.trim() || !phone.trim()) {
            return toast.error("Please fill all fields");
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            return toast.error("Mobile number must be 10 digits");
        }

        try {
            setSavingPersonal(true);

            const res = await axios.post(
                `${apiUrl}/admin/profile/update`,
                {
                    admin_id: String(adminId),
                    name: name.trim(),
                    email: email.trim(),
                    mobile_no: phone.trim(),
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data?.success) {
                toast.success(res.data?.message || "Profile updated successfully");
                // optional: refresh profile
                await fetchProfile();
            } else {
                toast.error(res.data?.message || "Failed to update profile");
            }
        } catch (e: any) {
            console.error(e);
            toastApiError(e, "Profile update failed");
        } finally {
            setSavingPersonal(false);
        }
    };

    // ✅ CHANGE PASSWORD
    const handleChangePassword = async () => {
        const adminId = getAdminId();
        if (!adminId) return toast.error("Admin id not found. Please login again.");

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return toast.error("Please fill all password fields");
        }

        if (newPassword.length < 4) {
            return toast.error("New password is too short");
        }

        if (newPassword !== confirmNewPassword) {
            return toast.error("New password and confirm password do not match");
        }

        try {
            setSavingPassword(true);

            const res = await axios.post(
                `${apiUrl}/admin/change/password`,
                {
                    admin_id: String(adminId),
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_new_password: confirmNewPassword,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data?.success) {
                toast.success(res.data?.message || "Password updated successfully");

                // reset password fields
                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                toast.error(res.data?.message || "Failed to change password");
            }
        } catch (e: any) {
            console.error(e);
            toastApiError(e, "Change password failed");
        } finally {
            setSavingPassword(false);
        }
    };

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

                {/* Loading (prefill) */}
                {loadingProfile && (
                    <div className="mb-4 text-sm text-gray-600">Loading profile...</div>
                )}

                {/* PERSONAL DETAILS */}
                {activeTab === "personal" && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <input
                                type="text"
                                value={name}
                                disabled={loadingProfile || savingPersonal}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={email}
                                disabled={loadingProfile || savingPersonal}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                disabled={loadingProfile || savingPersonal}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <button
                            onClick={handleUpdateDetails}
                            disabled={loadingProfile || savingPersonal}
                            className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg transition disabled:opacity-60"
                        >
                            {savingPersonal ? "Updating..." : "Update Details"}
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
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter old password"
                                disabled={savingPassword}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={savingPassword}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirm password"
                                disabled={savingPassword}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={savingPassword}
                            className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg transition disabled:opacity-60"
                        >
                            {savingPassword ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
