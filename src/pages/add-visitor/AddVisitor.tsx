import { useState } from "react";

export default function AddVisitor() {
  const expoName = "Electric Expo 2025"; // You can pass via params later
  const todayCount = 42; // Example count

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // Sample data – replace with API list later
  const states = ["Gujarat", "Maharashtra", "Rajasthan"];
  const citiesData: any = {
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  };

  const handleSave = () => {
    if (!mobile || !name || !email || !state || !city) {
      alert("Please fill all fields");
      return;
    }

    alert("Visitor Saved Successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{expoName}</h1>

        <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
          Today’s Entry: <span className="font-semibold">{todayCount}</span>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Visitor</h2>

        <div className="grid grid-cols-1 gap-4">

          {/* MOBILE */}
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              maxLength={10}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) setMobile(e.target.value);
              }}
              placeholder="Enter mobile number"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          </div>

          {/* NAME + EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* STATE + CITY DROPDOWNS */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* STATE DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity(""); // reset city when state changes
                }}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="">Select State</option>
                {states.map((st, i) => (
                  <option key={i} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* CITY DROPDOWN */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                disabled={!state}
              >
                <option value="">Select City</option>
                {state &&
                  citiesData[state]?.map((ct: string, i: number) => (
                    <option key={i} value={ct}>{ct}</option>
                  ))}
              </select>
            </div>

          </div>

          {/* SAVE BUTTON */}
          <div className="pt-3 text-end">
            <button
              onClick={handleSave}
              className="bg-[#2e56a6] text-white px-6 py-2 rounded-lg  shadow"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
