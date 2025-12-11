import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    expo: "",
    year: "",
    phone: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    // Later you can send it to backend API
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Add New Visitor
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* City */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Expo */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Expo
            </label>
            <select
              name="expo"
              value={formData.expo}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Expo</option>
              <option value="Tech Expo">Tech Expo</option>
              <option value="Food Expo">Food Expo</option>
              <option value="Auto Expo">Auto Expo</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              placeholder="Enter year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-full border border-gray-400
                       text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-[#005B9D] text-white 
                        transition active:scale-95"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
