// 1 -> p , 2 -> h , 3 -> a ,4 -> l

import { useEffect, useState } from "react";
import axios from "axios";
// import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

type Employee = {
  id: number;
  name: string;
};

type AttendanceRow = {
  attendenceId: number;
  empId: number;
  strEmpName: string;
  start_date_time: string | null;
  end_date_time: string | null;
  start_address: string | null;
  end_address: string | null;
  total_working_hrs: string | null;
  day: number | null;
};

type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function AttendanceReport() {
  const adminId = "3";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const limit = 10;

  const fetchEmployees = async () => {
    try {
      const res = await axios.post(`${apiUrl}/Getallemp`);

      if (res.data?.success) {
        setEmployees(res.data.data || []);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Employee fetch failed");
    }
  };

  const fetchAttendanceReport = async (pageNo = 1) => {
    try {
      setLoading(true);

      const res = await axios.post(`${apiUrl}/AdminAttendanceList`, {
        admin_id: adminId,
        empId: employeeId || "",
        search: search || "",
        start_date: fromDate || "",
        end_date: toDate || "",
        limit,
        page: pageNo,
      });

      if (res.data?.success) {
        setAttendanceList(res.data.data || []);
        setPagination(
          res.data.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
          }
        );
      } else {
        setAttendanceList([]);
        toast.error(res.data?.message || "Report fetch failed");
      }
    } catch (error: any) {
      setAttendanceList([]);
      toast.error(error?.response?.data?.message || "Report fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchAttendanceReport(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.last_page) return;

    setPage(newPage);
    fetchAttendanceReport(newPage);
  };
  const getAttendanceStatus = (day: number | null) => {
    switch (Number(day)) {
      case 1:
        return "P";
      case 2:
        return "H";
      case 3:
        return "A";
      case 4:
        return "L";
      default:
        return "-";
    }
  };
  // const exportExcel = () => {
  //   if (attendanceList.length === 0) {
  //     toast.error("No data found for export");
  //     return;
  //   }

  //   let table = `
  //     <table border="1">
  //       <thead>
  //         <tr>
  //           <th>Sr No</th>
  //           <th>Employee Name</th>
  //           <th>Start Time</th>
  //           <th>End Time</th>
  //           <th>Total Hours</th>
  //           <th>Start Location</th>
  //           <th>End Location</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //   `;

  //   attendanceList.forEach((item, index) => {
  //     table += `
  //       <tr>
  //         <td>${(pagination.current_page - 1) * limit + index + 1}</td>
  //         <td>${item.strEmpName || "-"}</td>
  //         <td>${item.start_date_time || "-"}</td>
  //         <td>${item.end_date_time || "-"}</td>
  //         <td>${item.total_working_hrs || "-"}</td>
  //         <td>${item.start_address || "-"}</td>
  //         <td>${item.end_address || "-"}</td>
  //       </tr>
  //     `;
  //   });

  //   table += `</tbody></table>`;

  //   const blob = new Blob(
  //     [
  //       `
  //       <html>
  //         <head><meta charset="UTF-8" /></head>
  //         <body>${table}</body>
  //       </html>
  //       `,
  //     ],
  //     { type: "application/vnd.ms-excel" }
  //   );

  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");

  //   a.href = url;
  //   a.download = "attendance-report.xls";
  //   document.body.appendChild(a);
  //   a.click();

  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceReport(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#2c446b]">
              Attendance Report
            </h1>
           
          </div>

          {/* <button
            onClick={exportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            <Download size={18} />
            Excel Export
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Employee
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Sr No</th>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Start Time</th>
                <th className="px-4 py-3 text-left">End Time</th>
                <th className="px-4 py-3 text-left">Attendance Status</th>
                <th className="px-4 py-3 text-left">Working Hrs</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    Loading...
                  </td>
                </tr>
              ) : attendanceList.length > 0 ? (
                attendanceList.map((item, index) => (
                  <tr
                    key={item.attendenceId}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3">
                      {(pagination.current_page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.strEmpName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.start_date_time || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.end_date_time || "-"}
                    </td>
                    <td className="px-4 py-3">{getAttendanceStatus(item.day)}</td>
                    <td className="px-4 py-3">{item.total_working_hrs || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No attendance record found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.last_page > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing page {pagination.current_page} of {pagination.last_page} —
              Total {pagination.total} records
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
                (pageNo) => (
                  <button
                    key={pageNo}
                    onClick={() => handlePageChange(pageNo)}
                    className={`px-3 py-2 rounded-lg border ${pageNo === pagination.current_page
                      ? "bg-[#2c446b] text-white border-[#2c446b]"
                      : "border-slate-200"
                      }`}
                  >
                    {pageNo}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.last_page}
                className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}