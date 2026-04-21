import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    Phone,
    PhoneOff,
    Building2,
    Info,
    Users,
    ChevronRight,
} from "lucide-react";
import { apiUrl } from "../../config";

type CallingData = {
    total_call: number;
    today_call: number;

    total_register: number;
    today_register: number;

    total_wrong_number: number;
    today_wrong_number: number;

    total_business_changed: number;
    today_business_changed: number;

    total_information_passed: number;
    today_information_passed: number;
};

type CardItem = {
    title: string;
    today: number;
    total: number;
    icon: React.ReactNode;
    color: "amber" | "purple" | "red" | "blue" | "emerald";
    todayPath: string;
    totalPath: string;
};

const CallingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [counts, setCounts] = useState<CallingData>({
        total_call: 0,
        today_call: 0,

        total_register: 0,
        today_register: 0,

        total_wrong_number: 0,
        today_wrong_number: 0,

        total_business_changed: 0,
        today_business_changed: 0,

        total_information_passed: 0,
        today_information_passed: 0,
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
                { admin_id: adminId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                const d = res.data.data || {};

                setCounts({
                    total_call: Number(d?.total_call ?? 0),
                    today_call: Number(d?.today_call ?? 0),

                    total_register: Number(d?.total_register ?? 0),
                    today_register: Number(d?.today_register ?? 0),

                    total_wrong_number: Number(d?.total_wrong_number ?? 0),
                    today_wrong_number: Number(d?.today_wrong_number ?? 0),

                    total_business_changed: Number(d?.total_business_changed ?? 0),
                    today_business_changed: Number(d?.today_business_changed ?? 0),

                    total_information_passed: Number(d?.total_information_passed ?? 0),
                    today_information_passed: Number(d?.today_information_passed ?? 0),
                });
            } else {
                toast.error(res.data?.message || "Failed to fetch calling data");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch calling data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCallingCounts();
    }, []);

    const cardData: CardItem[] = [
        {
            title: "Total Calls",
            today: counts.today_call,
            total: counts.total_call,
            icon: <Phone size={22} />,
            color: "amber",
            todayPath: "/admin/call/report/today",
            totalPath: "/admin/call/report/total",
        },
        {
            title: "New Registrations",
            today: counts.today_register,
            total: counts.total_register,
            icon: <Users size={22} />,
            color: "purple",
            todayPath: "/admin/calling/register/today",
            totalPath: "/admin/calling/register/total",
        },
        {
            title: "Wrong Number",
            today: counts.today_wrong_number,
            total: counts.total_wrong_number,
            icon: <PhoneOff size={22} />,
            color: "red",
            todayPath: "/admin/calling/wrong-number/today",
            totalPath: "/admin/calling/wrong-number/total",
        },
        {
            title: "Business Changed",
            today: counts.today_business_changed,
            total: counts.total_business_changed,
            icon: <Building2 size={22} />,
            color: "blue",
            todayPath: "/admin/calling/business-changed/today",
            totalPath: "/admin/calling/business-changed/total",
        },
        {
            title: "Information Passed",
            today: counts.today_information_passed,
            total: counts.total_information_passed,
            icon: <Info size={22} />,
            color: "emerald",
            todayPath: "/admin/calling/information-passed/today",
            totalPath: "/admin/calling/information-passed/total",
        },
    ];

    const getCardTheme = (color: CardItem["color"]) => {
        const map = {
            amber: {
                strip: "bg-amber-500",
                iconBox: "bg-amber-50 text-amber-600",
                soft: "bg-amber-50",
                border: "border-amber-100",
            },
            purple: {
                strip: "bg-purple-500",
                iconBox: "bg-purple-50 text-purple-600",
                soft: "bg-purple-50",
                border: "border-purple-100",
            },
            red: {
                strip: "bg-red-500",
                iconBox: "bg-red-50 text-red-600",
                soft: "bg-red-50",
                border: "border-red-100",
            },
            blue: {
                strip: "bg-blue-500",
                iconBox: "bg-blue-50 text-blue-600",
                soft: "bg-blue-50",
                border: "border-blue-100",
            },
            emerald: {
                strip: "bg-emerald-500",
                iconBox: "bg-emerald-50 text-emerald-600",
                soft: "bg-emerald-50",
                border: "border-emerald-100",
            },
        };

        return map[color];
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Calling Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Overview of today and total calling performance
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {loading
                        ? [...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-[240px] animate-pulse rounded-3xl bg-gray-200"
                            />
                        ))
                        : cardData.map((card, index) => {
                            const theme = getCardTheme(card.color);

                            return (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className={`h-2 w-full ${theme.strip}`} />

                                    <div className="p-6">
                                        <div className="mb-5 flex items-start justify-between">
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.iconBox}`}
                                            >
                                                {card.icon}
                                            </div>

                                            <ChevronRight
                                                size={20}
                                                className="text-gray-300 transition-colors group-hover:text-gray-500"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {card.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-400">
                                                Click to view detailed listing
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => navigate(card.totalPath)}
                                                className={`rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${theme.soft} ${theme.border}`}
                                            >
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Total
                                                </p>
                                                <p className="text-3xl font-bold text-gray-900">
                                                    {card.total}
                                                </p>
                                            </button>

                                            <button
                                                onClick={() => navigate(card.todayPath)}
                                                className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:shadow-sm"
                                            >
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Today
                                                </p>
                                                <p className="text-3xl font-bold text-gray-900">
                                                    {card.today}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default CallingPage;