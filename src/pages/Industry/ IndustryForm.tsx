import { useState } from "react";

export default function IndustryForm() {
  const [city, setCity] = useState("");

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">City Form</h2>

      <input
        className="border p-2 w-full mb-4"
        placeholder="City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button className="bg-[#005B9D] text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}
