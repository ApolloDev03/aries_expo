// import { Visibility } from "@mui/icons-material";
import { Groups as GroupsIcon, Storefront as StorefrontIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


export default function AssignedExpoList() {
    const expoList = [
        {
            id: 1,
            name: "Electric Expo 2026",
            state: "Gujarat",
            city: "Ahmedabad",
            date: "12 Jan 2025",
        },
        {
            id: 2,
            name: "Optic Expo 2026",
            state: "Maharashtra",
            city: "Mumbai",
            date: "22 Feb 2025",
        },
        {
            id: 3,
            name: "Autoshow Expo 2026",
            state: "Rajasthan",
            city: "Jaipur",
            date: "15 Mar 2025",
        },
    ];

    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* TITLE */}
            <h1 className="text-2xl font-bold text-gray-800">Assigned Expo List</h1>

            {/* CARD */}
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    Your Assigned Expos
                </h2>

                {/* TABLE WRAPPER (scrollable) */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-lg">
                                <th className="p-1 text-left">Expo Name</th>
                                <th className="p-1 text-left">State</th>
                                <th className="p-1 text-left">City</th>
                                <th className="p-1 text-left">Date</th>
                                <th className="p-1 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expoList.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b text-gray-700 hover:bg-gray-50 transition text-sm"
                                >
                                    <td className="p-1 font-medium">{item.name}</td>
                                    <td className="p-1">{item.state}</td>
                                    <td className="p-1">{item.city}</td>
                                    <td className="p-1">{item.date}</td>
                                    <td className="p-1 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="px-3 py-1 text-white rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 flex items-center gap-1"
                                                onClick={() => navigate("/users/add-visitors")}
                                            >
                                                <GroupsIcon fontSize="small" />
                                            </button>

                                            <button
                                                className="px-3 py-1 text-white rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 flex items-center gap-1"
                                            >
                                                <StorefrontIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
