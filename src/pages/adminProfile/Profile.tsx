// import React from "react";
import { useNavigate } from 'react-router-dom';
import profile from '../../assets/profile.webp'

export default function AdminProfile() {
    const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={profile}
            alt="Admin"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />

          <h1 className="text-3xl font-semibold mt-4">Admin Name</h1>
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
              value="Admin Name"
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
              value="admin@example.com"
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
              value="+91 98765 43210"
              disabled
              className="w-full mt-1 px-4 py-3 bg-gray-100 border rounded-lg cursor-not-allowed"
            />
          </div>
        </div>

        {/* Button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-[#2e56a6] text-white rounded-lg transition" 
          onClick={() => navigate("/admin/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
