import { Link } from "react-router-dom";

export default function CityList() {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">City Master</h2>

        <Link
          to="/admin/city/add"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Add City
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-3">#</th>
            <th className="p-3">City Name</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3">1</td>
            <td className="p-3">Ahmedabad</td>
            <td className="p-3">
              <Link className="text-blue-600" to="/admin/city/edit/1">
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
