import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config";

type ExpoListRow = {
  Expoid: number | string;
  name: string;
  date?: string;
};

type FollowupUserRow = {
  user_id: number | string;
  user_name: string;
};

type ApiListRow = Record<string, any>;

type AdminCallListResponse = {
  success: boolean;
  message: string;
  type: string;
  count: number;
  current_page: number;
  last_page: number;
  data: ApiListRow[];
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "1", label: "Registered" },
  { value: "2", label: "Wrong Number" },
  { value: "3", label: "Busy Now... Call Back" },
  { value: "4", label: "Business Change" },
  { value: "5", label: "Information Passed" },
];

const statusLabelMap: Record<string, string> = {
  "1": "Registered",
  "2": "Wrong Number",
  "3": "Busy Now... Call Back",
  "4": "Business Change",
  "5": "Information Passed",
};

const CallingReportPage = () => {
  const { subtype } = useParams();

  const pageType = subtype === "today" ? "today_call" : "total_call";
  const pageTitle =
    subtype === "today" ? "Today Calling Report" : "Total Calling Report";

  const [loading, setLoading] = useState(false);
  const [isExpoLoading, setIsExpoLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [expoList, setExpoList] = useState<ExpoListRow[]>([]);
  const [employeeList, setEmployeeList] = useState<FollowupUserRow[]>([]);

  const [reportRows, setReportRows] = useState<ApiListRow[]>([]);
  const [apiCount, setApiCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [followupUserId, setFollowupUserId] = useState("");
  const [expoId, setExpoId] = useState("");
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("artoken");
  const adminId = localStorage.getItem("admin_id");

  const requestHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }),
    [token]
  );

  const employeeNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    employeeList.forEach((item) => {
      map[String(item.user_id)] = item.user_name;
    });
    return map;
  }, [employeeList]);

  const expoNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    expoList.forEach((item) => {
      map[String(item.Expoid)] = item.name;
    });
    return map;
  }, [expoList]);

  const fetchExpoList = async () => {
    try {
      setIsExpoLoading(true);

      const res = await axios.post(
        `${apiUrl}/ExpoList`,
        {},
        { headers: requestHeaders }
      );

      if (res.data?.success) {
        setExpoList(res.data.data || []);
      } else {
        setExpoList([]);
        toast.error(res.data?.message || "Expo list fetch failed");
      }
    } catch (e: any) {
      setExpoList([]);
      toast.error(e?.response?.data?.message || "Expo list fetch failed");
    } finally {
      setIsExpoLoading(false);
    }
  };

  const fetchFollowupUsers = async () => {
    if (!adminId) return;

    try {
      setIsEmployeeLoading(true);

      const res = await axios.post(
        `${apiUrl}/AdminRegisterList`,
        { admin_id: adminId },
        { headers: requestHeaders }
      );

      if (res.data?.success) {
        const users = (res.data.data || []).map((item: any) => ({
          user_id: item.user_id,
          user_name: item.user_name,
        }));
        setEmployeeList(users);
      } else {
        setEmployeeList([]);
      }
    } catch (e: any) {
      setEmployeeList([]);
      toast.error(e?.response?.data?.message || "Employee list fetch failed");
    } finally {
      setIsEmployeeLoading(false);
    }
  };

  const buildPayload = (page = 1) => ({
    admin_id: Number(adminId),
    type: pageType,
    fromdate: fromDate || "",
    todate: toDate || "",
    followup_user_id: followupUserId ? Number(followupUserId) : "",
    followup_status: status ? Number(status) : "",
    expo_id: expoId ? Number(expoId) : "",
    page,
  });

  const fetchReport = async (page = 1) => {
    if (!adminId || !token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post<AdminCallListResponse>(
        `${apiUrl}/AdminCallList`,
        buildPayload(page),
        { headers: requestHeaders }
      );

      if (res.data?.success) {
        setReportRows(res.data.data || []);
        setApiCount(Number(res.data.count || 0));
        setCurrentPage(Number(res.data.current_page || page || 1));
        setLastPage(Number(res.data.last_page || 1));
      } else {
        setReportRows([]);
        setApiCount(0);
        setCurrentPage(1);
        setLastPage(1);
        toast.error(res.data?.message || "Report fetch failed");
      }
    } catch (e: any) {
      setReportRows([]);
      setApiCount(0);
      setCurrentPage(1);
      setLastPage(1);
      toast.error(e?.response?.data?.message || "Report fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminId || !token) return;
    fetchExpoList();
    fetchFollowupUsers();
  }, []);

  useEffect(() => {
    if (!adminId || !token) return;
    setReportRows([]);
    setApiCount(0);
    setCurrentPage(1);
    setLastPage(1);
    setSearchText("");
    fetchReport(1);
  }, [subtype]);

  const handleSearch = () => {
    fetchReport(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage || page === currentPage) return;
    fetchReport(page);
  };

  const filteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return reportRows;

    return reportRows.filter((row) => {
      const name = String(row.name || "").toLowerCase();
      const company = String(row.companyname || "").toLowerCase();
      const mobile = String(row.mobileno || "").toLowerCase();

      return (
        name.includes(keyword) ||
        company.includes(keyword) ||
        mobile.includes(keyword)
      );
    });
  }, [reportRows, searchText]);

  const getDisplayValue = (row: ApiListRow, key: string) => {
    const value = row[key];

    if (value === null || value === undefined || value === "") return "-";

    if (key === "followup_status") {
      return statusLabelMap[String(value)] || String(value);
    }

    if (key === "followup_user_id") {
      return employeeNameMap[String(value)] || String(value);
    }

    if (key === "expo_id") {
      return expoNameMap[String(value)] || String(value);
    }

    return String(value);
  };

  const exportToExcel = async () => {
    if (!adminId || !token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setIsExporting(true);

      const res = await axios.post(`${apiUrl}/AdminCallExport`, buildPayload(1), {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

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
      link.download = `${pageType}_calling_report_${today}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel exported successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error exporting excel");
    } finally {
      setIsExporting(false);
    }
  };

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
          className="px-2 py-1 text-sm font-medium text-slate-500"
        >
          ...
        </span>
      ) : (
        <button
          key={item}
          type="button"
          onClick={() => handlePageChange(Number(item))}
          className={`min-w-[36px] rounded-lg border px-3 py-1.5 text-sm font-medium transition ${currentPage === item
            ? "border-[#1d5fa7] bg-[#1d5fa7] text-white"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
        >
          {item}
        </button>
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 md:px-6">
          <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Follow Up Employee
              </label>
              <select
                value={followupUserId}
                onChange={(e) => setFollowupUserId(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">
                  {isEmployeeLoading ? "Loading..." : "All Employees"}
                </option>
                {employeeList.map((emp) => (
                  <option key={emp.user_id} value={emp.user_id}>
                    {emp.user_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Expo
              </label>
              <select
                value={expoId}
                onChange={(e) => setExpoId(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">
                  {isExpoLoading ? "Loading..." : "All Expo"}
                </option>
                {expoList.map((expo) => (
                  <option key={expo.Expoid} value={expo.Expoid}>
                    {expo.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Manual Search
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search name / company / mobile"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="button"
                className="h-11 w-full rounded-xl bg-[#1d5fa7] px-4 text-sm font-semibold text-white"
              >
                Count: {apiCount}
              </button>

              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="h-11 w-full rounded-xl bg-[#1d5fa7] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={exportToExcel}
                disabled={isExporting}
                className="h-11 w-full rounded-xl bg-[#12a150] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {isExporting ? "Exporting..." : "Export Excel"}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      No
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Follow Up Employee
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Name
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Company
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Mobile
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Status
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Next Follow Up Date
                    </th>
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-4 text-left font-bold text-slate-700">
                      Created At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredRows.length > 0 ? (
                    filteredRows.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {(currentPage - 1) * 10 + index + 1}
                        </td>

                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {getDisplayValue(row, "followup_user_id")}
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {row.name ?? "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {row.companyname ?? "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {row.mobileno ?? "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {getDisplayValue(row, "followup_status")}
                        </td>

                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {row.next_followup_date
                            ? new Date(row.next_followup_date).toLocaleDateString("en-GB")
                            : "-"}
                        </td>

                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-slate-700">
                          {row.created_at ?? "-"}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-14 text-center text-lg text-slate-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-medium text-slate-700">
                Page {currentPage} of {lastPage}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                {renderPaginationButtons()}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage || loading}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallingReportPage;