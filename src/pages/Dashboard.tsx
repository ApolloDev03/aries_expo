import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
/** ---------------- helpers ---------------- */
function authHeaders() {
    const token = localStorage.getItem("usertoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function getApiErrorMessage(err: any, fallback = "Something went wrong") {
    const data = err?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && typeof data.errors === "object") {
        const msgs: string[] = [];
        Object.values(data.errors).forEach((v: any) => {
            if (Array.isArray(v)) msgs.push(...v.map(String));
            else if (typeof v === "string") msgs.push(v);
        });
        if (msgs.length) return msgs.join(" | ");
    }
    return fallback;
}

/** ---------------- types ---------------- */
type TodayUserWise = {
    user_id: number;
    name: string;
    count: number;
};

type IndustryWise = {
    industry_id: number;
    industry_name: string;
    total_count: number;
};

type DashboardData = {
    total_visitors: number;
    today_visitors: number;
    total_exhibitors: number;
    today_exhibitors: number;
    total_Expected_Exhibitors: number;
    today_Expected_Exhibitors: number;

    today_visitor_user_wise: TodayUserWise[];
    today_exhibitor_user_wise: TodayUserWise[];

    industry_wise_visitors: IndustryWise[];
    today_industry_wise_visitors: IndustryWise[];
};

type DashboardApi = {
    success: boolean;
    data: DashboardData;
    message?: string;
};

function n(v: any) {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
}

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            // ✅ if your API is POST, replace with:
            // const res = await axios.post(`${apiUrl}/adminDashboard`, {}, { headers: { ...authHeaders() } });

            const res = await axios.post(`${apiUrl}/adminDashboard`, {
                headers: { ...authHeaders() },
            });

            const payload = res.data as DashboardApi;

            if (!payload?.success) {
                toast.error(payload?.message || "Failed to load dashboard");
                setData(null);
                return;
            }

            setData(payload.data);
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to load dashboard"));
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cards = useMemo(() => {
        const d = data;
        return [
            { label: "Total Visitors", value: n(d?.total_visitors), border: "border-orange-500" },
            { label: "Today Visitors", value: n(d?.today_visitors), border: "border-blue-500" },
            { label: "Today Exhibitors", value: n(d?.today_exhibitors), border: "border-green-500" },
            { label: "Total Exhibitors", value: n(d?.total_exhibitors), border: "border-[#6567A4]" },
            { label: "Total Expected Exhibitors", value: n(d?.total_Expected_Exhibitors), border: "border-[#A65C50]" },
            { label: "Today Expected Exhibitors", value: n(d?.today_Expected_Exhibitors), border: "border-purple-500" },
        ];
    }, [data]);

    const todayVisitorUserWise = data?.today_visitor_user_wise || [];
    const todayExhibitorUserWise = data?.today_exhibitor_user_wise || [];
    const industryWise = data?.industry_wise_visitors || [];

    return (
        <div className="space-y-6">
            {/* TITLE + REFRESH */}
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            </div>

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((c) => (
                    <div key={c.label} className={`bg-white rounded-xl p-6 shadow border-l-4 ${c.border}`}>
                        <h2 className="text-sm text-gray-500">{c.label}</h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{c.value}</p>
                    </div>
                ))}
            </div>

            {/* TABLE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today Visitor Registration */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Today Visitor Registration
                    </h2>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-left">User Name</th>
                                <th className="p-3 text-right">Total Visitors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayVisitorUserWise.map((u) => (
                                <tr key={u.user_id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{u.name || "-"}</td>
                                    <td className="p-3 text-right font-semibold text-blue-600">{n(u.count)}</td>
                                </tr>
                            ))}

                            {!loading && todayVisitorUserWise.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-500">
                                        No records today
                                    </td>
                                </tr>
                            )}

                            {loading && (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Today Exhibitor Registration */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Today Exhibitor Registration
                    </h2>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-left">User Name</th>
                                <th className="p-3 text-right">Total Exhibitors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayExhibitorUserWise.map((u) => (
                                <tr key={u.user_id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{u.name || "-"}</td>
                                    <td className="p-3 text-right font-semibold text-green-600">{n(u.count)}</td>
                                </tr>
                            ))}

                            {!loading && todayExhibitorUserWise.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-500">
                                        No records today
                                    </td>
                                </tr>
                            )}

                            {loading && (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Industry Wise Listing */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Industry Wise Listing
                    </h2>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-left">Industry Name</th>
                                <th className="p-3 text-right">Count</th>
                            </tr>
                        </thead>

                        <tbody>
                            {industryWise.map((it) => (
                                <tr key={it.industry_id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{it.industry_name || "-"}</td>
                                    <td className="p-3 text-right font-semibold text-purple-600">
                                        {n(it.total_count)}
                                    </td>
                                </tr>
                            ))}

                            {!loading && industryWise.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-500">
                                        No industry data found
                                    </td>
                                </tr>
                            )}

                            {loading && (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Optional: show Today Industry Wise Visitors if you want */}
                    {data && (
                        <p className="text-xs text-gray-500 mt-3">
                            Today Industry wise count items: {data.today_industry_wise_visitors?.length || 0}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
