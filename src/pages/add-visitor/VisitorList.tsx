import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

const visitors = [
  {
    id: 1,
    mobile: "9876543210",
    company: "ABC Pvt Ltd",
    name: "Rahul Sharma",
    email: "rahul@abc.com",
    state: "Gujarat",
    city: "Ahmedabad",
  },
  {
    id: 2,
    mobile: "9123456780",
    company: "XYZ Solutions",
    name: "Neha Patel",
    email: "neha@xyz.com",
    state: "Maharashtra",
    city: "Mumbai",
  },
];

export default function VisitorList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);

  const stateCityMap: Record<string, string[]> = {
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Rajasthan: ["Jaipur", "Udaipur"],
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Visitor List</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-1 border w-16 text-center">Sr. No.</th>
              <th className="p-1 border">Mobile</th>
              <th className="p-1 border">Company Name</th>
              <th className="p-1 border">Name</th>
              <th className="p-1 border">Email</th>
              <th className="p-1 border">State</th>
              <th className="p-1 border">City</th>
              <th className="p-1 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v, index) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="p-1 border text-center font-medium">
                  {index + 1}
                </td>
                <td className="p-1 border">{v.mobile}</td>
                <td className="p-1 border">{v.company}</td>
                <td className="p-1 border">{v.name}</td>
                <td className="p-1 border">{v.email}</td>
                <td className="p-1 border">{v.state}</td>
                <td className="p-1 border">{v.city}</td>
                <td className="p-1 border text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                    onClick={() => {
                      setSelectedVisitor(v);
                      setIsOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isOpen && selectedVisitor && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)} // ✅ close on outside click
          >
            <div
              className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
              onClick={(e) => e.stopPropagation()} // ❌ prevent close inside
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Visitor</h2>

                {/* ❌ Close icon */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500  hover:text-gray-700 text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-md">
                {/* Mobile */}
                <div>
                  <label className="font-medium">Mobile Number</label>
                  <input
                    className="border p-2 rounded w-full"
                    value={selectedVisitor.mobile}
                    onChange={(e) =>
                      setSelectedVisitor({
                        ...selectedVisitor,
                        mobile: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="font-medium">Company Name</label>
                  <input
                    className="border p-2 rounded w-full"
                    value={selectedVisitor.company}
                    onChange={(e) =>
                      setSelectedVisitor({
                        ...selectedVisitor,
                        company: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="font-medium">Name</label>
                  <input
                    className="border p-2 rounded w-full"
                    value={selectedVisitor.name}
                    onChange={(e) =>
                      setSelectedVisitor({
                        ...selectedVisitor,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-medium">Email</label>
                  <input
                    type="email"
                    className="border p-2 rounded w-full"
                    value={selectedVisitor.email}
                    onChange={(e) =>
                      setSelectedVisitor({
                        ...selectedVisitor,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                {/* State */}
                <div>
                  <label className="font-medium">State</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={selectedVisitor.state}
                    onChange={(e) =>
                      setSelectedVisitor({
                        ...selectedVisitor,
                        state: e.target.value,
                        city: "",
                      })
                    }
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateCityMap).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="font-medium">City</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={selectedVisitor.city}
                    disabled={!selectedVisitor.state}
                    onChange={(e) =>
                      setSelectedVisitor({
                        ...selectedVisitor,
                        city: e.target.value,
                      })
                    }
                  >
                    <option value="">Select City</option>
                    {selectedVisitor.state &&
                      stateCityMap[selectedVisitor.state]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    console.log("Updated Data:", selectedVisitor);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-[#2e56a6] text-white rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
