import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

type HistoryItem = {
    history_id: number;
    followup_status?: number | string | null;
    followup_remark?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    minutes?: number | string | null;
    next_followup_date?: string | null;
    next_followup_time?: string | null;
    created_at?: string | null;
};

type TimeLogRow = {
    followup_id: number;
    visitor_id?: number | null;
    visitor_name?: string | null;
    visitor_company?: string | null;
    visitor_mobile?: string | null;
    employee_id?: number | null;
    employee_name?: string | null;
    employee_email?: string | null;
    expo_name?: string | null;
    followup_status?: number | string | null;
    total_minutes?: number | string | null;
    created_at?: string | null;
    history?: HistoryItem[];
};

type Summary = {
    total_records?: number;
    total_minutes?: number;
    total_hours?: number;
    average_minutes_per_followup?: number;
};

type Pagination = {
    current_page?: number;
    per_page?: number;
    total_pages?: number;
    total_records?: number;
    from?: number;
    to?: number;
};

type EmployeeItem = {
    user_id: number | string;
    user_name: string;
};

type AdminRegisterListResponse = {
    success: boolean;
    message?: string;
    data?: EmployeeItem[];
    current_page?: number | string;
};

function getToken() {
    return localStorage.getItem("usertoken");
}

function authHeaders() {
    const token = getToken();

    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        Accept: "application/json",
    };
}

function getAuthUser() {
    try {
        const user = localStorage.getItem("admin_user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

export default function TimeLogReportPage() {
    const authUser = getAuthUser();
    const adminId = authUser?.id || "";

    const [employeeId, setEmployeeId] = useState("");
    const [employees, setEmployees] = useState<EmployeeItem[]>([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [rows, setRows] = useState<TimeLogRow[]>([]);
    const [summary, setSummary] = useState<Summary>({});
    const [pagination, setPagination] = useState<Pagination>({});

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(false);

    const [selectedHistory, setSelectedHistory] = useState<HistoryItem[]>([]);
    const [selectedVisitorName, setSelectedVisitorName] = useState("");
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const REPORT_API = `${apiUrl}/time_log_report`;
    const EMPLOYEE_API = `${apiUrl}/AdminRegisterList`;

    const buildPayload = (pageNo = page) => ({
        admin_id: adminId || "",
        employee_id: employeeId || "",
        startdate: startDate || "",
        enddate: endDate || "",
        per_page: 10,
        page: String(pageNo),
    });

    const resetData = () => {
        setRows([]);
        setSummary({});
        setPagination({});
    };

    const fetchEmployees = async () => {
        if (!adminId) {
            toast.error("Admin ID not found");
            return;
        }

        try {
            setEmployeeLoading(true);

            const res = await axios.post<AdminRegisterListResponse>(
                EMPLOYEE_API,
                {
                    admin_id: Number(adminId),
                    page: 1,
                },
                {
                    headers: authHeaders(),
                }
            );

            if (res.data?.success) {
                setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
            } else {
                setEmployees([]);
                toast.error(res.data?.message || "Failed to fetch employees");
            }
        } catch (error: any) {
            console.error(error);
            setEmployees([]);
            toast.error(error?.response?.data?.message || "Failed to fetch employees");
        } finally {
            setEmployeeLoading(false);
        }
    };

    const fetchReport = async (pageNo = 1) => {
        if (!adminId) {
            toast.error("Admin ID not found");
            return;
        }

        try {
            setIsLoading(true);

            const payload = buildPayload(pageNo);

            const res = await axios.post(REPORT_API, payload, {
                headers: authHeaders(),
            });

            if (res.data?.success) {
                const list = Array.isArray(res.data?.data) ? res.data.data : [];

                setRows(list);
                setSummary(res.data?.summary || {});
                setPagination(res.data?.pagination || {});
                setPage(Number(res.data?.pagination?.current_page || pageNo));

                if (list.length === 0) {
                    toast.info("No data found");
                }
            } else {
                resetData();
                toast.error(res.data?.message || "No data found");
            }
        } catch (error: any) {
            console.error(error);
            resetData();
            toast.error(error?.response?.data?.message || "Error fetching time log report");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (adminId) {
            fetchEmployees();
            fetchReport(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = () => {
        setPage(1);
        fetchReport(1);
    };

    const handleReset = () => {
        setEmployeeId("");
        setStartDate("");
        setEndDate("");
        setPage(1);
        resetData();

        setTimeout(() => {
            fetchReport(1);
        }, 100);
    };

    const handlePrev = () => {
        if (page > 1) {
            fetchReport(page - 1);
        }
    };

    const handleNext = () => {
        const totalPages = Number(pagination?.total_pages || 1);

        if (page < totalPages) {
            fetchReport(page + 1);
        }
    };

    const openHistoryModal = (row: TimeLogRow) => {
        setSelectedHistory(Array.isArray(row.history) ? row.history : []);
        setSelectedVisitorName(row.visitor_name || "-");
        setIsHistoryModalOpen(true);
    };

    const closeHistoryModal = () => {
        setSelectedHistory([]);
        setSelectedVisitorName("");
        setIsHistoryModalOpen(false);
    };

    const statusText = (status: any) => {
        const value = String(status || "");

        if (value === "1") return "Registered";
        if (value === "2") return "Wrong Number";
        if (value === "3") return "Busy Now / Call Back";
        if (value === "4") return "Business Change";
        if (value === "5") return "Information Passed";
        if (value === "6") return "Not Interested";

        return value || "-";
    };

    const display = (val: any) => {
        if (val === null || val === undefined || val === "") return "-";
        return val;
    };
    const toCamelCase = (text: any) => {
        if (!text || text === "-") return "-";

        return String(text)
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="p-6">
            <div className="w-full bg-white rounded-2xl shadow-xl">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Time Log Report
                    </h2>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Employee
                        </label>

                        <select
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            disabled={employeeLoading}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">
                                {employeeLoading ? "Loading Employees..." : "Select Employee"}
                            </option>

                            {employees.map((user) => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.user_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-2 lg:col-span-2 justify-start lg:justify-end">
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            className="h-[42px] px-6 bg-gray-500 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-600 transition"
                        >
                            Reset
                        </button>

                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="h-[42px] px-6 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                    {/* Summary */}
                    <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                            <p className="text-sm text-gray-600">Total Records</p>
                            <h3 className="text-2xl font-bold text-blue-700">
                                {summary?.total_records || 0}
                            </h3>
                        </div>

                        <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                            <p className="text-sm text-gray-600">Total Minutes</p>
                            <h3 className="text-2xl font-bold text-green-700">
                                {summary?.total_minutes || 0}
                            </h3>
                        </div>

                        <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                            <p className="text-sm text-gray-600">Total Hours</p>
                            <h3 className="text-2xl font-bold text-purple-700">
                                {summary?.total_hours || 0}
                            </h3>
                        </div>
                    </div>

                {/* Table */}
                <div className="px-6 pb-6 overflow-x-auto">
                    <table className="min-w-full border rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-sm text-gray-700">
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Visitor Name</th>
                                <th className="p-3 border-b">Company</th>
                                <th className="p-3 border-b">Mobile</th>
                                <th className="p-3 border-b">Employee</th>
                                <th className="p-3 border-b">Employee Email</th>
                                <th className="p-3 border-b">Expo</th>
                                <th className="p-3 border-b">Status</th>
                                <th className="p-3 border-b">Total Minutes</th>
                                <th className="p-3 border-b">Created At</th>
                                <th className="p-3 border-b text-center">History</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        className="p-4 text-center text-gray-500"
                                        colSpan={11}
                                    >
                                        {isLoading ? "Loading..." : "No data found"}
                                    </td>
                                </tr>
                            ) : (
                                rows.map((r, idx) => (
                                    <tr
                                        key={r.followup_id}
                                        className="text-sm hover:bg-gray-50 align-top"
                                    >
                                        <td className="p-3 border-b">
                                            {Number(pagination?.from || 1) + idx}
                                        </td>

                                        <td className="p-3 border-b">
                                            {toCamelCase(r.visitor_name)}
                                        </td>
                                        <td className="border p-3">{toCamelCase(r.visitor_company)}</td>


                                        <td className="p-3 border-b">
                                            {display(r.visitor_mobile)}
                                        </td>

                                        <td className="p-3 border-b">
                                            {display(r.employee_name)}
                                        </td>

                                        <td className="p-3 border-b email">
                                            {display(r.employee_email)}
                                        </td>

                                        <td className="p-3 border-b">
                                            {display(r.expo_name)}
                                        </td>

                                        <td className="p-3 border-b">
                                            {statusText(r.followup_status)}
                                        </td>

                                        <td className="p-3 border-b">
                                            {display(r.total_minutes)}
                                        </td>

                                        <td className="p-3 border-b">
                                            {display(r.created_at)}
                                        </td>

                                        <td className="p-3 border-b text-center">
                                            <button
                                                type="button"
                                                onClick={() => openHistoryModal(r)}
                                                title="View History"
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition disabled:opacity-40"
                                                disabled={!Array.isArray(r.history) || r.history.length === 0}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-between items-center flex-wrap gap-3 text-sm">
                        <div className="text-gray-600">
                            Showing <b>{pagination?.from || 0}</b> to{" "}
                            <b>{pagination?.to || 0}</b> of{" "}
                            <b>{pagination?.total_records || 0}</b> records
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={isLoading || page <= 1}
                                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                            >
                                Prev
                            </button>

                            <span className="px-3 py-2">
                                Page <b>{page}</b> of{" "}
                                <b>{pagination?.total_pages || 1}</b>
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={
                                    isLoading ||
                                    page >= Number(pagination?.total_pages || 1)
                                }
                                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Modal */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Followup History
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Visitor: {selectedVisitorName}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeHistoryModal}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            {selectedHistory.length === 0 ? (
                                <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                                    No history found
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedHistory.map((h, index) => (
                                        <div
                                            key={h.history_id || index}
                                            className="rounded-xl border bg-gray-50 p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <h4 className="font-semibold text-gray-800">
                                                    History #{index + 1}
                                                </h4>
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {statusText(h.followup_status)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                                <p>
                                                    <b>Status:</b>{" "}
                                                    {statusText(h.followup_status)}
                                                </p>

                                                <p>
                                                    <b>Minutes:</b>{" "}
                                                    {display(h.minutes)}
                                                </p>

                                                <p>
                                                    <b>Start:</b>{" "}
                                                    {display(h.start_time)}
                                                </p>

                                                <p>
                                                    <b>End:</b>{" "}
                                                    {display(h.end_time)}
                                                </p>

                                                <p>
                                                    <b>Next Date:</b>{" "}
                                                    {display(h.next_followup_date)}
                                                </p>

                                                <p>
                                                    <b>Next Time:</b>{" "}
                                                    {display(h.next_followup_time)}
                                                </p>

                                                <p>
                                                    <b>Created At:</b>{" "}
                                                    {display(h.created_at)}
                                                </p>
                                            </div>

                                            <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                                                <b>Remark:</b>{" "}
                                                {display(h.followup_remark)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t px-6 py-4">
                            <button
                                type="button"
                                onClick={closeHistoryModal}
                                className="rounded-lg bg-gray-600 px-6 py-2 font-medium text-white hover:bg-gray-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}