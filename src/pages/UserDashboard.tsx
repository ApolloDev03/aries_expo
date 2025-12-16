import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { useNavigate } from "react-router-dom";
type CountRes = {
    user_id: string;
    total_visitors: number;
    today_visitors: number;
};

export default function UserDashboard() {
    const userId = localStorage.getItem("User_Id") || "";
    const navigate = useNavigate();
    const [loadingCounts, setLoadingCounts] = useState(false);
    const [totalVisitors, setTotalVisitors] = useState(0);
    const [todayVisitors, setTodayVisitors] = useState(0);

    const fetchVisitorCounts = async () => {
        if (!userId) {
            toast.error("User_Id not found in localStorage");
            setTotalVisitors(0);
            setTodayVisitors(0);
            return;
        }

        try {
            setLoadingCounts(true);

            const res = await axios.post(`${apiUrl}/visitor/user/count`, {
                user_id: String(userId),
            });

            if (res.data?.success && res.data?.data) {
                const d: CountRes = res.data.data;
                setTotalVisitors(Number(d.total_visitors || 0));
                setTodayVisitors(Number(d.today_visitors || 0));
            } else {
                toast.error(res.data?.message || "Visitor count fetch failed");
                setTotalVisitors(0);
                setTodayVisitors(0);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Visitor count fetch failed");
            setTotalVisitors(0);
            setTodayVisitors(0);
        } finally {
            setLoadingCounts(false);
        }
    };

    useEffect(() => {
        fetchVisitorCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
                <p className="text-white/80 mt-1">Here's what's happening today</p>
            </div>

            {/* TOP USER STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div
                    onClick={() => navigate("/users/visitors-list/TotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 cursor-pointer border-blue-500">
                    <h2 className="text-sm text-gray-500">Total Visiters</h2>

                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">
                            0
                        </div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{totalVisitors}</p>
                    )}
                </div>

                {/* Card 2 */}
                <div
                    onClick={() => navigate("/users/visitors-list/TodayTotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 border-green-500 cursor-pointer">
                    <h2 className="text-sm text-gray-500">Today Total Visiters</h2>

                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">
                            0
                        </div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{todayVisitors}</p>
                    )}
                </div>

                {/* Card 3 (static for now) */}
                <div className="bg-white shadow rounded-xl p-6 border-l-4 border-purple-500">
                    <h2 className="text-sm text-gray-500">Upcoming Events</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">2</p>
                </div>
            </div>

            {/* UPCOMING EXPO */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                    Upcoming Expo For You
                </h2>

                <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                        🎪
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Mega Industrial Expo 2025
                        </h3>
                        <p className="text-gray-600 mt-1">Ahmedabad Exhibition Ground</p>
                        <p className="text-gray-500 text-sm mt-1">12 January 2025</p>

                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* RECENT ACTIVITY + QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Recent Activity
                    </h2>

                    <ul className="space-y-4">
                        <li className="flex justify-between text-gray-700 border-b pb-2">
                            <span>Registered for Industrial Expo 2025</span>
                            <span className="text-sm text-gray-500">2 days ago</span>
                        </li>
                        <li className="flex justify-between text-gray-700 border-b pb-2">
                            <span>Updated Profile Details</span>
                            <span className="text-sm text-gray-500">1 week ago</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span>Downloaded Entry Pass</span>
                            <span className="text-sm text-gray-500">3 weeks ago</span>
                        </li>
                    </ul>
                </div>

                {/* Quick Support */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Need Help?
                    </h2>

                    <p className="text-gray-600 mb-4">Our support team is here for you.</p>

                    <button className="bg-green-600 w-full text-white py-2 rounded-lg shadow hover:bg-green-700 transition">
                        Contact Support
                    </button>

                    <button className="mt-3 bg-gray-700 w-full text-white py-2 rounded-lg shadow hover:bg-gray-800 transition">
                        FAQs
                    </button>
                </div>
            </div>
        </div>
    );
}
