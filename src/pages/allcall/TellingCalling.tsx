
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users } from "lucide-react";
import { apiUrl } from "../../config";

type CallingData = {
    total_register: number;
    today_register: number;
};

const CallingPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState<CallingData>({
        total_register: 0,
        today_register: 0,
    });

    const fetchCallingCounts = async () => {
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${apiUrl}/admin_mycall`,
                {
                    admin_id: adminId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                setCounts({
                    total_register: Number(res.data?.data?.total_register ?? 0),
                    today_register: Number(res.data?.data?.today_register ?? 0),
                });
            } else {
                toast.error(res.data?.message || "Failed to fetch calling data");
            }
        } catch (error: any) {
            console.error("Calling API Error:", error);
            toast.error(
                error?.response?.data?.message || "Failed to fetch calling data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCallingCounts();
    }, []);

    return (
        <div className="min-h-screen bg-[#f3f4f6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full rounded-sm bg-[#efefef] border border-gray-200 p-5 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Calling Dashboard
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1">
                        View total and today register call counts
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white rounded-2xl border border-[#d9dee7] shadow-sm px-5 py-6 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="w-32">
                                    <div className="h-4 bg-gray-200 rounded mb-3" />
                                    <div className="h-7 w-14 bg-gray-200 rounded" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#d9dee7] shadow-sm px-5 py-6 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="w-32">
                                    <div className="h-4 bg-gray-200 rounded mb-3" />
                                    <div className="h-7 w-14 bg-gray-200 rounded" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {/* Total Register Card */}
                        <div
                            onClick={() => navigate("/admin/calling/total")}
                            className="bg-white rounded-2xl border border-[#d9dee7] shadow-sm px-5 py-6 hover:shadow-md transition cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[15px] text-[#5f7590] font-medium mb-1">
                                        Total Register
                                    </p>
                                    <h2 className="text-[20px] md:text-[22px] font-bold text-black">
                                        {counts.total_register}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-[#9b5cf6] text-white flex items-center justify-center shadow-sm">
                                    <Users size={22} />
                                </div>
                            </div>
                        </div>

                        {/* Today Register Card */}
                        <div
                            onClick={() => navigate("/admin/calling/today")}
                            className="bg-white rounded-2xl border border-[#d9dee7] shadow-sm px-5 py-6 hover:shadow-md transition cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[15px] text-[#5f7590] font-medium mb-1">
                                        Today Register
                                    </p>
                                    <h2 className="text-[20px] md:text-[22px] font-bold text-black">
                                        {counts.today_register}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-[#ff7a21] text-white flex items-center justify-center shadow-sm">
                                    <ClipboardList size={22} />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CallingPage;