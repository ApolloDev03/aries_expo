import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

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
    return fallback;
}

type IndustryWise = {
    industry_id: number;
    industry_name: string;
    total_count: number;
};

type IndustryWiseApi = {
    success: boolean;
    data: {
        industry_wise_visitors: IndustryWise[];
        today_industry_wise_visitors: IndustryWise[];
        industry_wise_exhibitors: IndustryWise[];
        today_industry_wise_exhibitors: IndustryWise[];
        industry_wise_expected_exhibitors: IndustryWise[];
        today_industry_wise_expected_exhibitors: IndustryWise[];
    };
    message?: string;
};

function n(v: any) {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
}

export default function VisitorIndustrys() {
    const { type } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<IndustryWise[]>([]);
    const [title, setTitle] = useState("Listing");

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axios.post(
                `${apiUrl}/adminIndustriesWiseData`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders(),
                    },
                }
            );

            const payload = res.data as IndustryWiseApi;

            if (!payload?.success) {
                toast.error(payload?.message || "Failed to load data");
                setList([]);
                return;
            }

            let selectedData: IndustryWise[] = [];
            let selectedTitle = "Listing";

            switch (type) {
                case "total-visitor":
                    selectedTitle = "Industry Wise Visitors";
                    selectedData = payload?.data?.industry_wise_visitors || [];
                    break;

                case "todays-visitor":
                    selectedTitle = "Today Industry Wise Visitors";
                    selectedData = payload?.data?.today_industry_wise_visitors || [];
                    break;

                case "total-exhibitor":
                    selectedTitle = "Industry Wise Exhibitors";
                    selectedData = payload?.data?.industry_wise_exhibitors || [];
                    break;

                case "todays-exhibitor":
                    selectedTitle = "Today Industry Wise Exhibitors";
                    selectedData = payload?.data?.today_industry_wise_exhibitors || [];
                    break;

                case "total-expected-exhibitor":
                    selectedTitle = "Industry Wise Expected Exhibitors";
                    selectedData = payload?.data?.industry_wise_expected_exhibitors || [];
                    break;

                case "todays-expected-exhibitor":
                    selectedTitle = "Today Industry Wise Expected Exhibitors";
                    selectedData = payload?.data?.today_industry_wise_expected_exhibitors || [];
                    break;

                default:
                    selectedTitle = "Industry Wise Listing";
                    selectedData = [];
                    break;
            }

            setTitle(selectedTitle);
            setList(selectedData);
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to load data"));
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const handleIndustryClick = (item: IndustryWise) => {
        navigate(`/admin/visitor-listing/${type}`, {
            state: {
                selectedIndustryId: String(item.industry_id),
                selectedIndustryName: item.industry_name,
                lockIndustry: true,
            },
        });
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                    {title}
                </h2>

                {loading ? (
                    <div className="py-10 text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="px-4 py-3">Industry Name</th>
                                    <th className="px-4 py-3 text-right">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length > 0 ? (
                                    list.map((item, index) => (
                                        <tr
                                            key={`${item.industry_id}-${index}`}
                                            onClick={() => handleIndustryClick(item)}
                                            className="cursor-pointer border-b transition hover:bg-blue-50"
                                            title="Click to view listing"
                                        >
                                            <td className="px-4 py-3">
                                                {item.industry_name}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-purple-600">
                                                {n(item.total_count)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}