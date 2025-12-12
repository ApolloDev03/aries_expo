import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import profileImg from "../../assets/profile.webp";
import { apiUrl } from "../../config";

type AdminProfileData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
};

export default function AdminProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AdminProfileData | null>(null);

  const toastApiError = (e: any, fallback = "Something went wrong") => {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      fallback;
    toast.error(msg);
  };

  const fetchProfile = async () => {
    const adminId =
      localStorage.getItem("admin_id") || localStorage.getItem("adminId"); // ✅ adjust if needed

    if (!adminId) {
      toast.error("Admin id not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/admin/profile`,
        { admin_id: String(adminId) },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.success) {
        setProfile(res.data.data);
      } else {
        toast.error(res.data?.message || "Failed to fetch profile");
      }
    } catch (e: any) {
      console.error(e);
      toastApiError(e, "Profile fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={profileImg}
            alt="Admin"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />

          <h1 className="text-3xl font-semibold mt-4">
            {loading ? "Loading..." : fullName || "Admin"}
          </h1>
          <p className="text-gray-500">Administrator</p>
        </div>

        {/* Profile Fields */}
        <div className="mt-10 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              value={fullName || ""}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="text"
              value={profile?.email || ""}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              value={profile?.mobile_number || ""}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 text-center flex justify-center gap-3">
          <button
            className="px-6 py-3 border rounded-lg transition disabled:opacity-60"
            disabled={loading}
            onClick={fetchProfile}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            className="px-6 py-3 bg-[#2e56a6] text-white rounded-lg transition disabled:opacity-60"
            disabled={loading || !profile}
            onClick={() => navigate("/admin/edit-profile", { state: profile })}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
