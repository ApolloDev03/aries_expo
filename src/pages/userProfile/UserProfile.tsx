import profileImg from "../../assets/profile.webp";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  // 🔒 Static profile data
  const profile = {
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
    mobile_number: "9876543210",
  };

  const navigate = useNavigate();

  const fullName = `${profile.first_name} ${profile.last_name}`;

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
            {fullName}
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
              value={fullName}
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
              value={profile.email}
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
              value={profile.mobile_number}
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
              value={profile.email}
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 text-center flex justify-center gap-3">
          {/* <button
            className="px-6 py-3 border rounded-lg cursor-pointer"
            // disabled
          >
            Refresh
          </button> */}

          <button
            className="px-6 py-3 bg-[#2e56a6] text-white rounded-lg cursor-pointer "
           onClick={() => navigate("/users/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
