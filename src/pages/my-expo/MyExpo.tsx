import { useEffect, useState } from "react";
import {
    Groups as GroupsIcon,
    Storefront as StorefrontIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

interface AssignedExpo {
    assign_id: number;
    expo_name: string;
    expo_date: string;
    city_name: string;
    state_name: string;
    expo_id: number;
}

export default function AssignedExpoList() {
    const navigate = useNavigate();

    const userId = localStorage.getItem("User_Id") || "";

    const [expoList, setExpoList] = useState<AssignedExpo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignedExpoList = async () => {
        if (!userId) {
            setExpoList([]);
            toast.error("User ID not found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${apiUrl}/Assign/Expolist`, {
                user_id: String(userId),
            });

            if (res.data?.success) {
                const list: AssignedExpo[] = (res.data?.data || []).map((x: any) => ({
                    assign_id: Number(x.assign_id),
                    expo_name: String(x.expo_name ?? ""),
                    expo_date: String(x.expo_date ?? ""),
                    city_name: String(x.city_name ?? ""),
                    state_name: String(x.state_name ?? ""),
                    expo_id: Number(x.expo_id ?? ""),
                }));

                setExpoList(list);
            } else {
                setExpoList([]);
                toast.error(res.data?.message || "Failed to fetch expos");
            }
        } catch (err: any) {
            console.error(err);
            setExpoList([]);
            toast.error(err?.response?.data?.message || "Failed to fetch expos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedExpoList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
            {/* TITLE */}
            <h1 className="text-2xl font-bold text-gray-800">
                Assigned Expo List
            </h1>

            {/* CARD */}
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    Your Assigned Expos
                </h2>

                {/* TABLE */}
                <div className="overflow-x-auto relative">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-lg">
                                <th className="p-2 text-left">Expo Name</th>
                                <th className="p-2 text-left">State</th>
                                <th className="p-2 text-left">City</th>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* 🔄 Skeleton Loader */}
                            {loading &&
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-6 bg-gray-200 rounded w-20 mx-auto"></div>
                                        </td>
                                    </tr>
                                ))}

                            {/* NO DATA */}
                            {!loading && expoList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-6 text-gray-500">
                                        No assigned expos found
                                    </td>
                                </tr>
                            )}

                            {/* DATA */}
                            {!loading &&
                                expoList.map((item) => (
                                    <tr
                                        key={item.assign_id}
                                        className="border-b text-gray-700 hover:bg-gray-50 transition text-sm"
                                    >
                                        <td className="p-2 font-medium">{item.expo_name}</td>
                                        <td className="p-2">{item.state_name}</td>
                                        <td className="p-2">{item.city_name}</td>
                                        <td className="p-2">{item.expo_date}</td>

                                        <td className="p-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    title="Add Visitor"
                                                    className="px-3 py-1 text-white rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                                                    onClick={() =>
                                                        navigate(`/users/add-visitors/${item.expo_id}`)
                                                    }
                                                >
                                                    <GroupsIcon fontSize="small" />
                                                </button>

                                                <button
                                                    title="Add Exhibitor"
                                                    className="px-3 py-1 text-white rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                                                    onClick={() =>
                                                        navigate("/users/stalls", {
                                                            state: {
                                                                assign_id: item.assign_id,
                                                                expo_name: item.expo_name,
                                                            },
                                                        })
                                                    }
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
