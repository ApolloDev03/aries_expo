// import { useState } from "react";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// type Tab = "personal" | "password";

// export default function EditUserProfile() {
//   const [activeTab, setActiveTab] = useState<Tab>("personal");

//   // 🔒 Static personal data
//   const [name, setName] = useState("Admin User");
//   const [email, setEmail] = useState("admin@example.com");
//   const [phone, setPhone] = useState("9876543210");
//   const [address, setAddress] = useState("Isanpur");

//   // 🔒 Static password fields
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-6">
//         {/* Tabs */}
//         <div className="flex border-b mb-6">
//           <button
//             onClick={() => setActiveTab("personal")}
//             className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition
//               ${
//                 activeTab === "personal"
//                   ? "border-blue-600 text-[#2e56a6]"
//                   : "border-transparent text-gray-600 hover:text-[#2e56a6]"
//               }`}
//           >
//             <AccountCircleOutlinedIcon fontSize="small" />
//             Personal Details
//           </button>

//           <button
//             onClick={() => setActiveTab("password")}
//             className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition
//               ${
//                 activeTab === "password"
//                   ? "border-blue-600 text-[#2e56a6]"
//                   : "border-transparent text-gray-600 hover:text-[#2e56a6]"
//               }`}
//           >
//             <LockOutlinedIcon fontSize="small" />
//             Change Password
//           </button>
//         </div>

//         {/* PERSONAL DETAILS */}
//         {activeTab === "personal" && (
//           <div className="space-y-5">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Address</label>
//               <input
//                 type="address"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               onClick={() => alert("Static: Update clicked")}
//               className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition"
//             >
//               Update Details
//             </button>
//           </div>
//         )}

//         {/* CHANGE PASSWORD */}
//         {activeTab === "password" && (
//           <div className="space-y-5">
//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Old Password
//               </label>
//               <input
//                 type="password"
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               onClick={() => alert("Static: Change password clicked")}
//               className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition"
//             >
//               Change Password
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { apiUrl } from "../../config";

// type Tab = "personal" | "password";


// export default function EditUserProfile() {
//   const [activeTab, setActiveTab] = useState<Tab>("personal");

//   // 🔒 Personal data
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");

//   // 🔒 Password fields
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");

//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const [loadingPass, setLoadingPass] = useState(false);

//   // ✅ get user id
//   const userId =
//     localStorage.getItem("User_Id") ||
//     "";

//   // ✅ load saved profile into fields (prevents blank after save/refresh)
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("user_profile");
//       if (saved) {
//         const p = JSON.parse(saved);
//         setName(p?.name ?? "");
//         setEmail(p?.email ?? "");
//         setPhone(p?.mobile_no ?? p?.mobile ?? "");
//         setAddress(p?.address ?? "");
//       }
//     } catch {
//       // ignore
//     }
//   }, []);

//   // ✅ Update profile API
//   const handleUpdateProfile = async () => {
//     if (!userId) {
//       toast.error("User ID not found. Please login again.");
//       return;
//     }

//     if (!name || !email || !phone || !address) {
//       toast.error("Please fill all fields.");
//       return;
//     }

//     try {
//       setLoadingProfile(true);

//       const payload = {
//         user_id: userId,
//         name,
//         email,
//         mobile_no: phone,
//         address,
//       };

//       const res = await axios.post(`${apiUrl}/user/profile/update`, payload);

//       if (res?.data?.success) {
//         toast.success(res?.data?.message || "Profile updated successfully");

//         // ✅ save in localStorage so fields won't become blank
//         localStorage.setItem("user_profile", JSON.stringify(payload));
//       } else {
//         toast.error(res?.data?.message || "Failed to update profile");
//       }
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.message || err?.message || "Something went wrong"
//       );
//     } finally {
//       setLoadingProfile(false);
//     }
//   };

//   // ✅ Change password API
//   const handleChangePassword = async () => {
//     if (!userId) {
//       toast.error("User ID not found. Please login again.");
//       return;
//     }

//     if (!oldPassword || !newPassword || !confirmNewPassword) {
//       toast.error("Please fill all password fields.");
//       return;
//     }

//     if (newPassword !== confirmNewPassword) {
//       toast.error("New password and confirm password must match.");
//       return;
//     }

//     try {
//       setLoadingPass(true);

//       const payload = {
//         user_id: userId,
//         old_password: oldPassword,
//         new_password: newPassword,
//         confirm_password: confirmNewPassword,
//       };

//       const res = await axios.post(`${apiUrl}/user/changepassword`, payload);

//       if (res?.data?.success) {
//         toast.success(res?.data?.message || "Password changed successfully");

//         // ✅ clear fields
//         setOldPassword("");
//         setNewPassword("");
//         setConfirmNewPassword("");
//       } else {
//         toast.error(res?.data?.message || "Failed to change password");
//       }
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.message || err?.message || "Something went wrong"
//       );
//     } finally {
//       setLoadingPass(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-6">
//         {/* Tabs */}
//         <div className="flex border-b mb-6">
//           <button
//             onClick={() => setActiveTab("personal")}
//             className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition
//               ${activeTab === "personal"
//                 ? "border-blue-600 text-[#2e56a6]"
//                 : "border-transparent text-gray-600 hover:text-[#2e56a6]"
//               }`}
//           >
//             <AccountCircleOutlinedIcon fontSize="small" />
//             Personal Details
//           </button>

//           <button
//             onClick={() => setActiveTab("password")}
//             className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition
//               ${activeTab === "password"
//                 ? "border-blue-600 text-[#2e56a6]"
//                 : "border-transparent text-gray-600 hover:text-[#2e56a6]"
//               }`}
//           >
//             <LockOutlinedIcon fontSize="small" />
//             Change Password
//           </button>
//         </div>

//         {/* PERSONAL DETAILS */}
//         {activeTab === "personal" && (
//           <div className="space-y-5">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               onClick={handleUpdateProfile}
//               disabled={loadingProfile}
//               className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition disabled:opacity-60"
//             >
//               {loadingProfile ? "Updating..." : "Update Details"}
//             </button>
//           </div>
//         )}

//         {/* CHANGE PASSWORD */}
//         {activeTab === "password" && (
//           <div className="space-y-5">
//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Old Password
//               </label>
//               <input
//                 type="password"
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               onClick={handleChangePassword}
//               disabled={loadingPass}
//               className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition disabled:opacity-60"
//             >
//               {loadingPass ? "Changing..." : "Change Password"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { apiUrl } from "../../config";

type Tab = "personal" | "password";

export default function EditUserProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  // 🔒 Personal data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🔒 Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // ✅ get user id
  const userId = localStorage.getItem("User_Id") || "";

  // ✅ fetch profile from API
  const fetchProfile = async () => {
    if (!userId) return;

    try {
      setLoadingProfile(true);

      const res = await axios.post(`${apiUrl}/user/profile`, { user_id: userId });

      if (res?.data?.success && res?.data?.data) {
        const d = res.data.data;

        setName(d?.name ?? "");
        setEmail(d?.email ?? "");
        setPhone(d?.mobile ?? d?.mobile_no ?? "");
        setAddress(d?.address ?? "");

        // ✅ cache for refresh
        localStorage.setItem(
          "user_profile",
          JSON.stringify({
            user_id: userId,
            name: d?.name ?? "",
            email: d?.email ?? "",
            mobile_no: d?.mobile ?? d?.mobile_no ?? "",
            address: d?.address ?? "",
          })
        );
      } else {
        toast.error(res?.data?.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoadingProfile(false);
    }
  };

  // ✅ Load cached first, then API (best UX)
  useEffect(() => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    // 1) load cache instantly
    try {
      const saved = localStorage.getItem("user_profile");
      if (saved) {
        const p = JSON.parse(saved);
        setName(p?.name ?? "");
        setEmail(p?.email ?? "");
        setPhone(p?.mobile_no ?? p?.mobile ?? "");
        setAddress(p?.address ?? "");
      }
    } catch {
      // ignore
    }

    // 2) then load from API (latest)
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ✅ Update profile API
  const handleUpdateProfile = async () => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    if (!name || !email || !phone || !address) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoadingProfile(true);

      const payload = {
        user_id: userId,
        name,
        email,
        mobile_no: phone,
        address,
      };

      const res = await axios.post(`${apiUrl}/user/profile/update`, payload);

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Profile updated successfully");

        // ✅ update cache (and keep inputs not blank)
        localStorage.setItem("user_profile", JSON.stringify(payload));

        // ✅ optional: re-fetch latest from API (if backend changes format)
        // await fetchProfile();
      } else {
        toast.error(res?.data?.message || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoadingProfile(false);
    }
  };

  // ✅ Change password API
  const handleChangePassword = async () => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password must match.");
      return;
    }

    try {
      setLoadingPass(true);

      const payload = {
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      };

      const res = await axios.post(`${apiUrl}/user/changepassword`, payload);

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(res?.data?.message || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoadingPass(false);
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
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
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
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={loadingProfile}
              className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition disabled:opacity-60"
            >
              {loadingProfile ? "Updating..." : "Update Details"}
            </button>
          </div>
        )}

        {/* CHANGE PASSWORD */}
        {activeTab === "password" && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loadingPass}
              className="mt-4 w-full bg-[#2e56a6] text-white py-3 rounded-lg hover:bg-[#244a8c] transition disabled:opacity-60"
            >
              {loadingPass ? "Changing..." : "Change Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
