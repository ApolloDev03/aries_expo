import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import profileImg from "../../assets/profile.webp";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";


type ProfileData = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  depart_id?: number;
  expo_count?: number;
};

export default function UserProfile() {
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("artoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getApiMessage = (err: any, fallback = "Something went wrong") => {
    const d = err?.response?.data;
    if (typeof d?.message === "string" && d.message) return d.message;
    if (typeof d?.error === "string" && d.error) return d.error;
    if (typeof err?.message === "string" && err.message) return err.message;
    return fallback;
  };

  // ✅ try to find user_id from localStorage (many possible keys)
  const getUserIdFromStorage = (): string | null => {
    const direct =
      localStorage.getItem("User_Id");

    if (direct) return String(direct);

    // user json (AuthProvider style)
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        const id = u?.id ?? u?.user_id ?? u?.admin_id ?? u?.Userid ?? u?.Usersid;
        if (id) return String(id);
      } catch {
        // ignore
      }
    }

    return null;
  };

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fullName = useMemo(() => {
    const n = profile?.name?.trim() || "";
    return n || "User";
  }, [profile]);

  const fetchProfile = async () => {
    const userId = getUserIdFromStorage();

    if (!userId) {
      toast.error("User id not found in localStorage");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/user/profile`,
        { user_id: String(userId) },
        { headers: { ...getAuthHeaders() } }
      );

      if (res.data?.success) {
        const d = res.data?.data;
        setProfile({
          id: Number(d?.id),
          name: String(d?.name ?? ""),
          mobile: String(d?.mobile ?? ""),
          email: String(d?.email ?? ""),
          address: String(d?.address ?? ""),
          depart_id: d?.depart_id ? Number(d.depart_id) : undefined,
          expo_count: d?.expo_count ? Number(d.expo_count) : 0,
        });
      } else {
        toast.error(res.data?.message || "Profile fetch failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getApiMessage(err, "Profile fetch failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={profileImg}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />

          <h1 className="text-3xl font-semibold mt-4">{fullName}</h1>
          <p className="text-gray-500">Administrator</p>

          {loading ? (
            <p className="mt-3 text-sm text-gray-500">Loading profile...</p>
          ) : null}
        </div>

        {/* Profile Fields */}
        <div className="mt-10 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              value={profile?.name ?? ""}
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
              value={profile?.email ?? ""}
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
              value={profile?.mobile ?? ""}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              value={profile?.address ?? ""}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 text-center flex justify-center gap-3">


          <button
            className="px-6 py-3 bg-[#2e56a6] text-white rounded-lg cursor-pointer"
            onClick={() => navigate("/users/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
