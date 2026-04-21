import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { useNavigate } from "react-router-dom";

type CountRes = {
    user_id: string;
    total_visitors: number;
    today_visitors: number;
    total_exhibitors: number;
    today_exhibitors: number;
    total_Expected_Exhibitors: number;
    today_Expected_Exhibitors: number;
};

export default function UserDashboard() {
    const userId = localStorage.getItem("User_Id") || "";
    const navigate = useNavigate();

    const [loadingCounts, setLoadingCounts] = useState(false);
    const [totalVisitors, setTotalVisitors] = useState(0);
    const [todayVisitors, setTodayVisitors] = useState(0);
    const [totalExhibitors, setTotalExhibitors] = useState(0);
    const [todayExhibitors, setTodayExhibitors] = useState(0);
    const [expectedTotalExhibitors, setExpectedTotalExhibitors] = useState(0);
    const [todayExpectedExhibitors, setTodayExpectedExhibitors] = useState(0);

    const fetchVisitorCounts = async () => {
        if (!userId) {
            toast.error("User_Id not found in localStorage");
            setTotalVisitors(0);
            setTodayVisitors(0);
            setTotalExhibitors(0);
            setTodayExhibitors(0);
            setExpectedTotalExhibitors(0);
            setTodayExpectedExhibitors(0);
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
                setTotalExhibitors(Number(d.total_exhibitors || 0));
                setTodayExhibitors(Number(d.today_exhibitors || 0));
                setExpectedTotalExhibitors(Number(d.total_Expected_Exhibitors || 0));
                setTodayExpectedExhibitors(Number(d.today_Expected_Exhibitors || 0));
            } else {
                toast.error(res.data?.message || "Visitor count fetch failed");
                setTotalVisitors(0);
                setTodayVisitors(0);
                setTodayExhibitors(0);
                setTotalExhibitors(0);
                setExpectedTotalExhibitors(0);
                setTodayExpectedExhibitors(0);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Visitor count fetch failed");
            setTotalVisitors(0);
            setTodayVisitors(0);
            setTodayExhibitors(0);
            setTotalExhibitors(0);
            setExpectedTotalExhibitors(0);
            setTodayExpectedExhibitors(0);
        } finally {
            setLoadingCounts(false);
        }
    };

    const requestAndStoreLocation = () => {
        if (!navigator.geolocation) {
            localStorage.setItem("location_permission", "unsupported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                localStorage.setItem("user_lat", String(lat));
                localStorage.setItem("user_lng", String(lng));
                localStorage.setItem("location_permission", "granted");

                console.log("Latitude:", lat);
                console.log("Longitude:", lng);
            },
            (error) => {
                console.error("Location error:", error);

                localStorage.removeItem("user_lat");
                localStorage.removeItem("user_lng");
                localStorage.setItem("location_permission", "denied");

                // dashboard already open rahega
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        fetchVisitorCounts();

        // dashboard open ke baad location popup khulega
        requestAndStoreLocation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
                <p className="text-white/80 mt-1">Here's what's happening today</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    onClick={() => navigate("/users/visitors-list/TotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 cursor-pointer border-blue-500"
                >
                    <h2 className="text-sm text-gray-500">Total Visitors</h2>
                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{totalVisitors}</p>
                    )}
                </div>

                <div
                    onClick={() => navigate("/users/visitors-list/TodayTotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 border-green-500 cursor-pointer"
                >
                    <h2 className="text-sm text-gray-500">Today Visitors</h2>
                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{todayVisitors}</p>
                    )}
                </div>

                <div
                    onClick={() => navigate("/users/exhibitors-list/TotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 border-purple-500"
                >
                    <h2 className="text-sm text-gray-500">Total Exhibitors</h2>
                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{totalExhibitors}</p>
                    )}
                </div>

                <div
                    onClick={() => navigate("/users/exhibitors-list/TodayTotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 border-[#F54C54]"
                >
                    <h2 className="text-sm text-gray-500">Today Exhibitors</h2>
                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{todayExhibitors}</p>
                    )}
                </div>

                <div
                    onClick={() => navigate("/users/expectedexhibitors-list/ExpectedTotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 border-[#454C7D]"
                >
                    <h2 className="text-sm text-gray-500">Total Expected Exhibitors</h2>
                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{expectedTotalExhibitors}</p>
                    )}
                </div>

                <div
                    onClick={() => navigate("/users/expectedexhibitors-list/TodayTotalVisitors")}
                    className="bg-white shadow rounded-xl p-6 border-l-4 border-[#8A6C56]"
                >
                    <h2 className="text-sm text-gray-500">Today Expected Exhibitors</h2>
                    {loadingCounts ? (
                        <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 mt-2">{todayExpectedExhibitors}</p>
                    )}
                </div>
            </div>
        </div>
    );
}