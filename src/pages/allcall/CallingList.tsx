import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config";

type UserData = {
    user_id: number;
    user_name: string;
    mobile: string;

    today_register_count?: number;
    total_register_count?: number;

    today_wrong_number?: number;
    total_wrong_number?: number;

    today_business_changed?: number;
    total_business_changed?: number;

    today_information_passed?: number;
    total_information_passed?: number;
};

type TodayRegisterItem = {
    visitor_followup_id: number;
    visitor_id: number;
    followup_user_id: number;
    created_at: string;
    name: string | null;
    companyname: string | null;
    mobileno: string;
    followup_username: string;
};

type AdminRegisterListResponse = {
    success: boolean;
    message: string;
    count?: number;
    current_page?: number;
    last_page?: number;
    data: UserData[];
};

const CallingList = () => {
    const navigate = useNavigate();
    const { type, subtype } = useParams();
    const [isExporting, setIsExporting] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [todayList, setTodayList] = useState<TodayRegisterItem[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<UserData[]>([]);

    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const isTotalPage = subtype === "total";

    const pageConfig = useMemo(() => {
        const config = {
            register: {
                headerTitle: isTotalPage ? "Total Register List" : "Today Register List",
                listingTitle:
                    isTotalPage ? "Total Register Listing" : "Today Register Listing",
                apiType: isTotalPage ? "Totalregister" : "Todayregister",
                todayKey: "today_register_count",
                totalKey: "total_register_count",
            },
            "wrong-number": {
                headerTitle:
                    isTotalPage ? "Total Wrong Number List" : "Today Wrong Number List",
                listingTitle:
                    isTotalPage
                        ? "Total Wrong Number Listing"
                        : "Today Wrong Number Listing",
                apiType: isTotalPage ? "TotalWrongNumber" : "TodayWrongNumber",
                todayKey: "today_wrong_number",
                totalKey: "total_wrong_number",
            },
            "business-changed": {
                headerTitle:
                    isTotalPage
                        ? "Total Business Changed List"
                        : "Today Business Changed List",
                listingTitle:
                    isTotalPage
                        ? "Total Business Changed Listing"
                        : "Today Business Changed Listing",
                apiType: isTotalPage
                    ? "TotalBusinessChanged"
                    : "TodayBusinessChanged",
                todayKey: "today_business_changed",
                totalKey: "total_business_changed",
            },
            "information-passed": {
                headerTitle:
                    isTotalPage
                        ? "Total Information Passed List"
                        : "Today Information Passed List",
                listingTitle:
                    isTotalPage
                        ? "Total Information Passed Listing"
                        : "Today Information Passed Listing",
                apiType: isTotalPage
                    ? "TotalInformationPassed"
                    : "TodayInformationPassed",
                todayKey: "today_information_passed",
                totalKey: "total_information_passed",
            },
        };

        return config[(type as keyof typeof config) || "register"] || config.register;
    }, [type, isTotalPage]);

    const fetchData = async (page = 1) => {
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post<AdminRegisterListResponse>(
                `${apiUrl}/AdminRegisterList`,
                {
                    admin_id: Number(adminId),
                    page,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                setData(res.data.data || []);
                setCount(Number(res.data.count || 0));
                setCurrentPage(Number(res.data.current_page || page || 1));
                setLastPage(Number(res.data.last_page || 1));
            } else {
                setData([]);
                setCount(0);
                setCurrentPage(1);
                setLastPage(1);
                toast.error(res.data?.message || "Failed to fetch data");
            }
        } catch (err: any) {
            console.error(err);
            setData([]);
            setCount(0);
            setCurrentPage(1);
            setLastPage(1);
            toast.error(err?.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchListing = async (userId?: string, dateValue?: string) => {
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setSearchLoading(true);

            const finalDate = dateValue ?? selectedDate ?? "";
            const finalUserId = userId ?? selectedUser ?? "";

            const res = await axios.post(
                `${apiUrl}/AdminTodayRegisterList`,
                {
                    admin_id: adminId,
                    followup_user_id: finalUserId,
                    type: pageConfig.apiType,
                    fromdate: isTotalPage ? finalDate : "",
                    todate: isTotalPage ? finalDate : "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                setTodayList(res.data.data || []);
            } else {
                setTodayList([]);
                toast.error(res.data?.message || "No data found");
            }
        } catch (err: any) {
            console.error(err);
            setTodayList([]);
            toast.error(err?.response?.data?.message || "Search failed");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearch = async () => {
     
        await fetchListing();
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return;
        fetchData(page);
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    useEffect(() => {
        setSelectedUser("");
        setSelectedDate("");
        fetchListing("", "");
        fetchData(1);
    }, [type, subtype]);

    const getTodayCount = (item: UserData) => {
        return Number(item[pageConfig.todayKey as keyof UserData] ?? 0);
    };

    const getTotalCount = (item: UserData) => {
        return Number(item[pageConfig.totalKey as keyof UserData] ?? 0);
    };

    const formatType = (value?: string) =>
        (value ?? "Unknown")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const renderPaginationButtons = () => {
        const buttons: (number | string)[] = [];

        if (lastPage <= 7) {
            for (let i = 1; i <= lastPage; i++) {
                buttons.push(i);
            }
        } else {
            buttons.push(1);

            if (currentPage > 3) {
                buttons.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(lastPage - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                buttons.push(i);
            }

            if (currentPage < lastPage - 2) {
                buttons.push("...");
            }

            buttons.push(lastPage);
        }

        return buttons.map((item, index) =>
            item === "..." ? (
                <span
                    key={`dots-${index}`}
                    className="px-2 py-1 text-sm font-medium text-gray-500"
                >
                    ...
                </span>
            ) : (
                <button
                    key={item}
                    type="button"
                    onClick={() => handlePageChange(Number(item))}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${currentPage === item
                        ? "border-[#d47d4c] bg-[#d47d4c] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {item}
                </button>
            )
        );
    };
    const handleExportExcel = async () => {
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setIsExporting(true);

            const res = await axios.post(
                `${apiUrl}/AdminFollowupExport`,
                {
                    admin_id: adminId,
                    type: pageConfig.apiType,
                    followup_user_id: selectedUser || "",
                    fromdate: isTotalPage ? selectedDate : "",
                    todate: isTotalPage ? selectedDate : "",
                },
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const contentType = res.headers?.["content-type"] || "";

            if (
                contentType.includes("application/json") ||
                contentType.includes("text/json")
            ) {
                const text = await new Response(res.data).text();

                try {
                    const json = JSON.parse(text);
                    toast.error(json?.message || "Export failed");
                } catch {
                    toast.error("Export failed");
                }
                return;
            }

            const blob = new Blob([res.data], {
                type:
                    contentType ||
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const today = new Date().toISOString().slice(0, 10);
            link.download = `${pageConfig.apiType}_list_${today}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Excel exported successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Export failed");
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#f3f4f6] p-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {pageConfig.headerTitle}
                    </h2>
                    <div className="rounded-lg bg-[#d47d4c] px-4 py-2 text-sm font-semibold text-white">
                        Count: {count}
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="max-h-[360px] overflow-y-auto rounded-lg border">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        <th className="border p-3">Sr. No.</th>
                                        <th className="border p-3">User Name</th>
                                        <th className="border p-3">
                                            Today {formatType(type)} Count
                                        </th>
                                        <th className="border p-3">
                                            Total {formatType(type)} Count
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr key={item.user_id} className="hover:bg-gray-50">
                                                <td className="border p-3">
                                                    {(currentPage - 1) * 10 + index + 1}
                                                </td>
                                                <td className="border p-3">{item.user_name}</td>
                                                <td className="border p-3 font-semibold text-[#ff7a21]">
                                                    {getTodayCount(item)}
                                                </td>
                                                <td className="border p-3 font-semibold text-[#9b5cf6]">
                                                    {getTotalCount(item)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500">
                                                No records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <div className="mt-6">
                    <div className="mb-5 flex justify-between gap-3 sm:flex-row">
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                                {pageConfig.listingTitle}
                            </h3>
                        </div>

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#d47d4c] focus:ring-2 focus:ring-[#d47d4c] sm:w-72"
                            >
                                <option value="">Select User</option>
                                {data.map((user) => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {user.user_name}
                                    </option>
                                ))}
                            </select>

                            {isTotalPage && (
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#d47d4c] focus:ring-2 focus:ring-[#d47d4c] sm:w-56"
                                />
                            )}

                            <button
                                onClick={handleSearch}
                                disabled={searchLoading}
                                className="rounded-lg bg-[#d47d4c] px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                                {searchLoading ? "Searching..." : "Search"}
                            </button>

                            <button
                                onClick={handleExportExcel}
                                disabled={isExporting}
                                className="rounded-lg bg-[#12a150] px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                                {isExporting ? "Exporting..." : "Export Excel"}
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto rounded-lg border">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 bg-gray-100">
                                <tr>
                                    <th className="border p-3">Sr. No.</th>
                                    <th className="border p-3">Name</th>
                                    <th className="border p-3">Mobile</th>
                                    <th className="border p-3">Company</th>
                                    <th className="border p-3">User Name</th>
                                    <th className="border p-3">Created At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {searchLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : todayList.length > 0 ? (
                                    todayList.map((item, index) => (
                                        <tr key={item.visitor_followup_id} className="hover:bg-gray-50">
                                            <td className="border p-3">{index + 1}</td>
                                            <td className="border p-3">{item.name || "-"}</td>
                                            <td className="border p-3">{item.mobileno || "-"}</td>
                                            <td className="border p-3">{item.companyname || "-"}</td>
                                            <td className="border p-3">{item.followup_username || "-"}</td>
                                            <td className="border p-3">{item.created_at || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500">
                                            No records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm font-medium text-gray-700">
                        Page {currentPage} of {lastPage}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {renderPaginationButtons()}

                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage || loading}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallingList;