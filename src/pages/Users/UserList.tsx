import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


interface ExpoData {
  id: number;
  name: string;
  city: string;
  expoType: string;
  year: number;
  phone: string;
  email: string;
}


const expoTypes = ["Tech Expo", "Food Expo", "Auto Expo"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Seattle"];

// Dummy data
const dummyData: ExpoData[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Visitor ${i + 1}`,
  city: cities[i % cities.length],
  expoType: expoTypes[i % expoTypes.length],
  year: 2020 + (i % 5), // random year
  phone: `98765${10000 + i}`, // example phone
  email: `visitor${i + 1}@example.com`,
}));


export default function SearchableTablePage() {
  const [expoType, setExpoType] = useState("");
  const [city, setCity] = useState("");
  const [filteredData, setFilteredData] = useState<ExpoData[]>(dummyData);

  // Pagination
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = () => {
    let data = dummyData;
    if (expoType) data = data.filter((item) => item.expoType === expoType);
    if (city) data = data.filter((item) => item.city === city);
    setFilteredData(data);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-inter">

      {/* Header Row with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-wide text-gray-800">
          Expo Search
        </h2>
        <button
          className="flex items-center gap-2 bg-[#005B9D] 
                     text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl 
                     transition-all active:scale-95"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Search Bar with Glass Effect */}
      <div
        className="flex items-center gap-4 p-5 backdrop-blur-lg bg-white/70 
                 rounded-xl shadow-md border border-gray-200"
      >
        <select
          value={expoType}
          onChange={(e) => setExpoType(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm 
                     focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-56"
        >
          <option value="">Expo Type</option>
          {expoTypes.map((ex, i) => (
            <option key={i} value={ex}>
              {ex}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm 
                     focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-56"
        >
          <option value="">City</option>
          {cities.map((ct, i) => (
            <option key={i} value={ct}>
              {ct}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-[#005B9D] text-white px-6 py-2 rounded-full shadow-lg 
                     hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="mt-10 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-left">
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">City</th>
              <th className="p-3 border-b">Expo</th>
              <th className="p-3 border-b">Year</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className={`transition hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
              >
                <td className="p-3 border-b">{item.id}</td>
                <td className="p-3 border-b">{item.name}</td>
                <td className="p-3 border-b">{item.city}</td>
                <td className="p-3 border-b">{item.expoType}</td>
                <td className="p-3 border-b">{item.year}</td>
                <td className="p-3 border-b">{item.phone}</td>
                <td className="p-3 border-b">{item.email}</td>

                {/* Action Buttons */}
                <td className="p-3 border-b text-center">
                  <div className="flex justify-center gap-3">

                    {/* Edit Icon Button */}
                    <button
                      className="p-2   text-blue-600  
                  transition active:scale-95"
                    >
                      <EditIcon fontSize="small" />
                    </button>

                    {/* Delete Icon Button */}
                    <button
                      className="p-2  text-red-600 
                  transition active:scale-95"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-6 text-gray-500 italic"
                >
                  No results found...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded-full border bg-white shadow hover:bg-gray-100 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-full border shadow transition ${page === i + 1
              ? "bg-[#005B9D] text-white"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded-full border bg-white shadow hover:bg-gray-100
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
