// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// function authHeaders() {
//     const token = localStorage.getItem("usertoken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
// }

// function getApiErrorMessage(err: any, fallback = "Something went wrong") {
//     const data = err?.response?.data;
//     if (!data) return fallback;
//     if (typeof data === "string") return data;
//     if (data.message) return data.message;
//     if (data.error) return data.error;
//     return fallback;
// }

// type IndustryWise = {
//     industry_id: number;
//     industry_name: string;
//     total_count: number;
// };

// type IndustryWiseApi = {
//     success: boolean;
//     data: {
//         industry_wise_visitors: IndustryWise[];
//         today_industry_wise_visitors: IndustryWise[];
//         industry_wise_exhibitors: IndustryWise[];
//         today_industry_wise_exhibitors: IndustryWise[];
//         industry_wise_expected_exhibitors: IndustryWise[];
//         today_industry_wise_expected_exhibitors: IndustryWise[];
//     };
//     message?: string;
// };

// function n(v: any) {
//     const x = Number(v);
//     return Number.isFinite(x) ? x : 0;
// }

// export default function VisitorIndustrys() {
//     const { type } = useParams();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(false);
//     const [list, setList] = useState<IndustryWise[]>([]);
//     const [title, setTitle] = useState("Listing");

//     const fetchData = async () => {
//         try {
//             setLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/adminIndustriesWiseData`,
//                 {},
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         ...authHeaders(),
//                     },
//                 }
//             );

//             const payload = res.data as IndustryWiseApi;

//             if (!payload?.success) {
//                 toast.error(payload?.message || "Failed to load data");
//                 setList([]);
//                 return;
//             }

//             let selectedData: IndustryWise[] = [];
//             let selectedTitle = "Listing";

//             switch (type) {
//                 case "total-visitor":
//                     selectedTitle = "Industry Wise Visitors";
//                     selectedData = payload?.data?.industry_wise_visitors || [];
//                     break;

//                 case "todays-visitor":
//                     selectedTitle = "Today Industry Wise Visitors";
//                     selectedData = payload?.data?.today_industry_wise_visitors || [];
//                     break;

//                 case "total-exhibitor":
//                     selectedTitle = "Industry Wise Exhibitors";
//                     selectedData = payload?.data?.industry_wise_exhibitors || [];
//                     break;

//                 case "todays-exhibitor":
//                     selectedTitle = "Today Industry Wise Exhibitors";
//                     selectedData = payload?.data?.today_industry_wise_exhibitors || [];
//                     break;

//                 case "total-expected-exhibitor":
//                     selectedTitle = "Industry Wise Expected Exhibitors";
//                     selectedData = payload?.data?.industry_wise_expected_exhibitors || [];
//                     break;

//                 case "todays-expected-exhibitor":
//                     selectedTitle = "Today Industry Wise Expected Exhibitors";
//                     selectedData = payload?.data?.today_industry_wise_expected_exhibitors || [];
//                     break;

//                 default:
//                     selectedTitle = "Industry Wise Listing";
//                     selectedData = [];
//                     break;
//             }

//             setTitle(selectedTitle);
//             setList(selectedData);
//         } catch (err: any) {
//             toast.error(getApiErrorMessage(err, "Failed to load data"));
//             setList([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [type]);

//     const handleIndustryClick = (item: IndustryWise) => {
//         navigate(`/admin/visitor-listing/${type}`, {
//             state: {
//                 selectedIndustryId: String(item.industry_id),
//                 selectedIndustryName: item.industry_name,
//                 lockIndustry: true,
//             },
//         });
//     };

//     return (
//         <div className="space-y-6 p-4 md:p-6">
//             <div className="rounded-xl bg-white p-6 shadow">
//                 <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
//                     {title}
//                 </h2>

//                 {loading ? (
//                     <div className="py-10 text-center text-gray-500">Loading...</div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead>
//                                 <tr className="bg-gray-100 text-left">
//                                     <th className="px-4 py-3">Industry Name</th>
//                                     <th className="px-4 py-3 text-right">Count</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {list.length > 0 ? (
//                                     list.map((item, index) => (
//                                         <tr
//                                             key={`${item.industry_id}-${index}`}
//                                             onClick={() => handleIndustryClick(item)}
//                                             className="cursor-pointer border-b transition hover:bg-blue-50"
//                                             title="Click to view listing"
//                                         >
//                                             <td className="px-4 py-3">
//                                                 {item.industry_name}
//                                             </td>
//                                             <td className="px-4 py-3 text-right font-semibold text-purple-600">
//                                                 {n(item.total_count)}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td
//                                             colSpan={2}
//                                             className="px-4 py-6 text-center text-gray-500"
//                                         >
//                                             No data found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";
import { SiSimpleanalytics } from "react-icons/si";
function authHeaders() {
    const token = localStorage.getItem("usertoken");

    return token
        ? {
              Authorization: `Bearer ${token}`,
          }
        : {};
}

function getApiErrorMessage(
    err: any,
    fallback = "Something went wrong"
) {
    const data = err?.response?.data;

    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;

    return fallback;
}

/*
|--------------------------------------------------------------------------
| Get logged-in admin ID
|--------------------------------------------------------------------------
| Change these localStorage keys according to your login response.
*/
function getAdminId() {
    const directAdminId = localStorage.getItem("admin_id");

    if (directAdminId) {
        return directAdminId;
    }

    try {
        const storedUser =
            localStorage.getItem("admin_user") ||
            localStorage.getItem("user") ||
            localStorage.getItem("userData");

        if (storedUser) {
            const user = JSON.parse(storedUser);

            return String(
                user?.admin_id ||
                    user?.id ||
                    user?.user_id ||
                    "3"
            );
        }
    } catch (error) {
        console.error("Unable to read admin ID:", error);
    }

    return "3";
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

type StateWiseData = {
    state_id: number;
    state_name: string;
    visitor_count: number;
};

type IndustryAnalysisData = {
    industry_id: number;
    industry_name: string;
    total_visitors: number;
    state_wise_data: StateWiseData[];
};

type IndustryAnalysisApi = {
    success: boolean;
    message?: string;
    data: IndustryAnalysisData[];
};

function n(value: any) {
    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatCount(value: any) {
    return n(value).toLocaleString("en-IN");
}

export default function VisitorIndustrys() {
    const { type } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<IndustryWise[]>([]);
    const [title, setTitle] = useState("Listing");

    // Analysis popup states
    const [analysisOpen, setAnalysisOpen] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisData, setAnalysisData] =
        useState<IndustryAnalysisData | null>(null);

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
                toast.error(
                    payload?.message || "Failed to load data"
                );
                setList([]);
                return;
            }

            let selectedData: IndustryWise[] = [];
            let selectedTitle = "Listing";

            switch (type) {
                case "total-visitor":
                    selectedTitle = "Industry Wise Visitors";
                    selectedData =
                        payload?.data?.industry_wise_visitors ||
                        [];
                    break;

                case "todays-visitor":
                    selectedTitle =
                        "Today Industry Wise Visitors";
                    selectedData =
                        payload?.data
                            ?.today_industry_wise_visitors || [];
                    break;

                case "total-exhibitor":
                    selectedTitle = "Industry Wise Exhibitors";
                    selectedData =
                        payload?.data?.industry_wise_exhibitors ||
                        [];
                    break;

                case "todays-exhibitor":
                    selectedTitle =
                        "Today Industry Wise Exhibitors";
                    selectedData =
                        payload?.data
                            ?.today_industry_wise_exhibitors || [];
                    break;

                case "total-expected-exhibitor":
                    selectedTitle =
                        "Industry Wise Expected Exhibitors";
                    selectedData =
                        payload?.data
                            ?.industry_wise_expected_exhibitors ||
                        [];
                    break;

                case "todays-expected-exhibitor":
                    selectedTitle =
                        "Today Industry Wise Expected Exhibitors";
                    selectedData =
                        payload?.data
                            ?.today_industry_wise_expected_exhibitors ||
                        [];
                    break;

                default:
                    selectedTitle = "Industry Wise Listing";
                    selectedData = [];
                    break;
            }

            setTitle(selectedTitle);
            setList(selectedData);
        } catch (err: any) {
            toast.error(
                getApiErrorMessage(err, "Failed to load data")
            );
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

    /*
    |--------------------------------------------------------------------------
    | Fetch state-wise analysis
    |--------------------------------------------------------------------------
    */
    const handleAnalysisClick = async (
        event: React.MouseEvent<HTMLButtonElement>,
        item: IndustryWise
    ) => {
        // Prevent table row navigation
        event.stopPropagation();

        try {
            setAnalysisOpen(true);
            setAnalysisLoading(true);
            setAnalysisData(null);

            const res = await axios.post(
                `${apiUrl}/industryStateBasedCount`,
                {
                    admin_id: getAdminId(),
                    industry_id: String(item.industry_id),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders(),
                    },
                }
            );

            const payload = res.data as IndustryAnalysisApi;

            if (!payload?.success) {
                toast.error(
                    payload?.message ||
                        "Failed to load industry analysis"
                );
                return;
            }

            const industryData = payload?.data?.[0];

            if (!industryData) {
                toast.info(
                    "No state-wise analysis data found"
                );
                return;
            }

            setAnalysisData({
                ...industryData,
                state_wise_data:
                    industryData.state_wise_data || [],
            });
        } catch (err: any) {
            toast.error(
                getApiErrorMessage(
                    err,
                    "Failed to load industry analysis"
                )
            );
        } finally {
            setAnalysisLoading(false);
        }
    };

    const closeAnalysisPopup = () => {
        setAnalysisOpen(false);
        setAnalysisData(null);
    };

    return (
        <>
            <div className="space-y-6 p-4 md:p-6">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
                        {title}
                    </h2>

                    {loading ? (
                        <div className="py-10 text-center text-gray-500">
                            Loading...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="px-4 py-3">
                                            Industry Name
                                        </th>

                                        {/* Analysis before Count */}
                                        <th className="px-4 py-3 text-right">
                                            Analysis
                                        </th>

                                        <th className="px-4 py-3 text-right">
                                            Count
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {list.length > 0 ? (
                                        list.map((item, index) => (
                                            <tr
                                                key={`${item.industry_id}-${index}`}
                                                onClick={() =>
                                                    handleIndustryClick(
                                                        item
                                                    )
                                                }
                                                className="cursor-pointer border-b transition hover:bg-blue-50"
                                                title="Click to view listing"
                                            >
                                                <td className="px-4 py-3">
                                                    {
                                                        item.industry_name
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={(event) =>
                                                            handleAnalysisClick(
                                                                event,
                                                                item
                                                            )
                                                        }
                                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                                    >
                                                      <SiSimpleanalytics />
                                                    </button>
                                                </td>

                                                <td className="px-4 py-3 text-right font-semibold text-purple-600">
                                                    {formatCount(
                                                        item.total_count
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
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

            {/* Analysis Popup */}
            {analysisOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
                    onClick={closeAnalysisPopup}
                >
                    <div
                        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Popup header */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Industry State Analysis
                                </h2>

                                {analysisData && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {
                                            analysisData.industry_name
                                        }
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={closeAnalysisPopup}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </div>

                        {/* Popup content */}
                        <div className="overflow-y-auto p-6">
                            {analysisLoading ? (
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                                    <p className="text-gray-500">
                                        Loading state-wise analysis...
                                    </p>
                                </div>
                            ) : analysisData ? (
                                <>
                                    {/* Total count */}
                                    <div className="mb-6 rounded-xl bg-purple-50 flex items-center justify-end">
                                        <p className="text-sm font-medium text-purple-700">
                                            Total Visitors :  {formatCount(
                                                analysisData.total_visitors
                                            )}
                                        </p>                                                                         
                                    </div>

                                    {/* State-wise table */}
                                    <div className="overflow-hidden rounded-lg border">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-3 text-left">
                                                       Sr.No
                                                    </th>

                                                    <th className="px-4 py-3 text-left">
                                                        State Name
                                                    </th>

                                                    <th className="px-4 py-3 text-right">
                                                        Visitor Count
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {analysisData
                                                    .state_wise_data
                                                    .length > 0 ? (
                                                    analysisData.state_wise_data.map(
                                                        (
                                                            state,
                                                            index
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    state.state_id
                                                                }
                                                                className="border-t transition hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-3 text-gray-500">
                                                                    {index +
                                                                        1}
                                                                </td>

                                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                                    {
                                                                        state.state_name
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-3 text-right font-semibold text-purple-600">
                                                                    {formatCount(
                                                                        state.visitor_count
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={
                                                                3
                                                            }
                                                            className="px-4 py-8 text-center text-gray-500"
                                                        >
                                                            No state-wise
                                                            data found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="py-14 text-center text-gray-500">
                                    No analysis data found
                                </div>
                            )}
                        </div>

                       
                    </div>
                </div>
            )}
        </>
    );
}