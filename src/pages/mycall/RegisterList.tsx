import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import { useParams } from "react-router-dom";

type RegisterItem = {
    visitor_followup_id: number;
    visitor_id: number;
    followup_user_id: number;
    followup_status: number;
    visitor_followup_history_id: number;
    created_at: string;
    name: string;
    companyname: string;
    mobileno: string;
};

type RegisterResponse = {
    success: boolean;
    message: string;
    data: {
        total_register_count: number;
        today_register_count: number;
        type: string;
        list: RegisterItem[];
    };
};

const RegisterListing = () => {
    const { type } = useParams();

    const currentType = type || "Todayregister";
    const titleMap: Record<string, string> = {
  Todayregister: "Today Register Listing",
  Totalregister: "Total Register Listing",
  TotalWrongNumber: "Total Wrong Number Listing",
  TodayWrongNumber: "Today Wrong Number Listing",
  TotalCall: "Total Call Listing",
  TodayCall: "Today Call Listing",
};

const pageTitle = titleMap[currentType] || "Listing";

    const [loading, setLoading] = useState(true);
    const [registerData, setRegisterData] = useState<{
        total_register_count: number;
        today_register_count: number;
        list: RegisterItem[];
    }>({
        total_register_count: 0,
        today_register_count: 0,
        list: [],
    });

    const fetchRegisterList = async () => {
        const userId = localStorage.getItem("User_Id");

        if (!userId) {
            console.error("User_Id not found in localStorage");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post<RegisterResponse>(
                `${apiUrl}/Registerlist`,
                {
                    user_id: userId,
                    Type: currentType,
                }
            );

            if (response.data?.success) {
                setRegisterData({
                    total_register_count: response.data.data?.total_register_count || 0,
                    today_register_count: response.data.data?.today_register_count || 0,
                    list: response.data.data?.list || [],
                });
            }
        } catch (error) {
            console.error("Registerlist API error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisterList();
    }, [currentType]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {pageTitle}
                        </h1>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                        <p className="text-sm text-slate-500">Total Records</p>
                        <p className="text-xl font-bold text-slate-900">
                            {loading ? "..." : registerData.list.length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading...</div>
                    ) : registerData.list.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No register records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Sr. No
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Company Name
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Mobile Number
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {registerData.list.map((item, index) => (
                                        <tr
                                            key={item.visitor_followup_id}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                {item.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                {item.companyname || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                {item.mobileno || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterListing;