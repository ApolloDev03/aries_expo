// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ArrowLeft } from "lucide-react";
// import { toast } from "react-toastify";
// import { apiUrl } from "../config";

// type Props = {
//   onBack?: () => void;
// };

// const MonthlyReportTable = ({ onBack }: Props) => {
//   const [attendanceData, setAttendanceData] = useState<any[]>([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const getUserData = () => {
//     const user = localStorage.getItem("user");

//     try {
//       return user ? JSON.parse(user) : null;
//     } catch {
//       return null;
//     }
//   };

//   const fetchAttendanceList = async (pageNo = 1) => {
//     try {
//       setLoading(true);

//       const user = getUserData();
//       const empId = user?.id;

//       if (!empId) {
//         toast.error("Employee not found");
//         return;
//       }

//       const res = await axios.post(`${apiUrl}/AttendanceList`, {
//         empId: String(empId),
//         start_date: fromDate,
//         end_date: toDate,
//         limit: 10,
//         page: pageNo,
//       });

//       if (res.data?.success) {
//         setAttendanceData(res.data?.data || []);

//         setPage(res.data?.pagination?.current_page || 1);
//         setLastPage(res.data?.pagination?.last_page || 1);
//       } else {
//         setAttendanceData([]);
//         toast.error(res.data?.message || "Attendance list not found");
//       }
//     } catch (err: any) {
//       setAttendanceData([]);

//       toast.error(
//         err?.response?.data?.message || "Attendance list API failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceList(1);
//   }, []);

//   const handleSearch = () => {
//     setPage(1);
//     fetchAttendanceList(1);
//   };

//   // Late status color
//   const getLateStatusClass = (status: string) => {
//     const value = status?.toLowerCase();

//     if (value === "late") {
//       return "bg-red-50 text-red-600 border-red-200";
//     }

//     if (
//       value === "on time" ||
//       value === "ontime" ||
//       value === "not late"
//     ) {
//       return "bg-green-50 text-green-600 border-green-200";
//     }

//     if (value === "no calls") {
//       return "bg-orange-50 text-orange-600 border-orange-200";
//     }

//     return "bg-gray-50 text-gray-500 border-gray-200";
//   };

//   // Sunday check: attendance date first, then punch-in date, then created_at
//   const isSunday = (row: any) => {
//     const dateValue =
//       row.attendance_date ||
//       row.date ||
//       row.start_date_time ||
//       row.created_at;

//     if (!dateValue) return false;

//     // Only use YYYY-MM-DD part so timezone conversion does not change the day.
//     const datePart = String(dateValue).slice(0, 10);
//     const [year, month, day] = datePart.split("-").map(Number);

//     if (!year || !month || !day) return false;

//     return new Date(year, month - 1, day).getDay() === 0;
//   };

//   return (
//     <div className="bg-white rounded-[22px] border border-[#d9e3ef] overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-5 border-b border-[#d9e3ef] flex items-center justify-between gap-3">
//         <h2 className="text-2xl font-bold text-[#10233f]">
//           Monthly Attendance Report
//         </h2>

//         {onBack && (
//           <button
//             onClick={onBack}
//             className="bg-[#0b6ea8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
//           >
//             <ArrowLeft size={17} />
//             Back
//           </button>
//         )}
//       </div>

//       <div className="p-6">
//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-bold text-[#10233f] mb-2">
//               From Date
//             </label>

//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="w-full h-11 border border-[#d9e3ef] rounded-xl px-4 text-sm outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-[#10233f] mb-2">
//               To Date
//             </label>

//             <input
//               type="date"
//               value={toDate}
//               min={fromDate || undefined}
//               onChange={(e) => setToDate(e.target.value)}
//               className="w-full h-11 border border-[#d9e3ef] rounded-xl px-4 text-sm outline-none"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={handleSearch}
//               disabled={loading}
//               className="w-full h-11 bg-[#0b6ea8] text-white rounded-xl text-sm font-bold disabled:opacity-60"
//             >
//               {loading ? "Loading..." : "Search"}
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto border border-[#d9e3ef] rounded-2xl">
//           <table className="w-full text-left border-collapse min-w-[1250px]">
//             <thead className="bg-[#f6f9fc] text-[#10233f]">
//               <tr>
//                 <th className="p-4 text-sm font-bold">No</th>

//                 <th className="p-4 text-sm font-bold">
//                   Emp Name
//                 </th>

//                 <th className="p-4 text-sm font-bold">
//                   Start Date & Time
//                 </th>

//                 <th className="p-4 text-sm font-bold">
//                   End Date & Time
//                 </th>

//                 <th className="p-4 text-sm font-bold text-center">
//                   Attendance
//                 </th>

//                 <th className="p-4 text-sm font-bold">
//                   Working Hrs
//                 </th>

//                 {/* NEW */}
//                 <th className="p-4 text-sm font-bold">
//                   First Call Time
//                 </th>

//                 {/* NEW */}
//                 <th className="p-4 text-sm font-bold">
//                   Late Start Minutes
//                 </th>

//                 {/* NEW */}
//                 <th className="p-4 text-sm font-bold text-center">
//                   Late Start Status
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {attendanceData.length > 0 ? (
//                 attendanceData.map((row: any, index: number) => (
//                   <tr
//                     key={row.attendenceId}
//                     className="border-t border-[#edf2f7] hover:bg-[#f8fbff]"
//                   >
//                     {/* No */}
//                     <td className="p-4 text-sm">
//                       {(page - 1) * 10 + index + 1}
//                     </td>

//                     {/* Employee */}
//                     <td className="p-4 text-sm font-medium">
//                       {row.strEmpName ||
//                         row.user?.name ||
//                         "-"}
//                     </td>

//                     {/* Start */}
//                     <td className="p-4 text-sm whitespace-nowrap">
//                       {row.start_date_time || "-"}
//                     </td>

//                     {/* End */}
//                     <td className="p-4 text-sm whitespace-nowrap">
//                       {row.end_date_time || "-"}
//                     </td>

//                     {/* Attendance */}
//                     <td className="p-4 text-sm text-center font-bold">
//                       {isSunday(row) ? (
//                         row.start_date_time ? (
//                           <span>
//                             <span className="text-orange-500">S</span>
//                             <span className="text-[#10233f] mx-1">/</span>
//                             <span className="text-green-600">P</span>
//                           </span>
//                         ) : (
//                           <span className="text-orange-500">S</span>
//                         )
//                       ) : row.start_date_time ? (
//                         <span className="text-green-600">P</span>
//                       ) : (
//                         <span className="text-red-500">A</span>
//                       )}
//                     </td>

//                     {/* Working hours */}
//                     <td className="p-4 text-sm whitespace-nowrap">
//                       {row.working_hrs ||
//                         row.total_working_hrs ||
//                         "-"}
//                     </td>

//                     {/* First Call Time */}
//                     <td className="p-4 text-sm whitespace-nowrap font-medium">
//                       {row.first_call_time || "-"}
//                     </td>

//                     {/* Late Start Minutes */}
//                     <td className="p-4 text-sm">
//                       {row.late_start_minutes !== null &&
//                       row.late_start_minutes !== undefined
//                         ? `${row.late_start_minutes} Min`
//                         : "-"}
//                     </td>

//                     {/* Late Start Status */}
//                     <td className="p-4 text-sm text-center">
//                       <span
//                         className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-xs font-bold ${getLateStatusClass(
//                           row.late_start_status
//                         )}`}
//                       >
//                         {row.late_start_status || "N/A"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="p-5 text-center text-sm"
//                   >
//                     {loading
//                       ? "Loading..."
//                       : "No attendance found"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-end gap-2 mt-5">
//           <button
//             disabled={page <= 1 || loading}
//             onClick={() => fetchAttendanceList(page - 1)}
//             className="px-4 py-2 rounded-lg border border-[#d9e3ef] text-sm font-semibold disabled:opacity-50"
//           >
//             Prev
//           </button>

//           <span className="text-sm font-semibold text-[#10233f]">
//             Page {page} of {lastPage}
//           </span>

//           <button
//             disabled={page >= lastPage || loading}
//             onClick={() => fetchAttendanceList(page + 1)}
//             className="px-4 py-2 rounded-lg border border-[#d9e3ef] text-sm font-semibold disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyReportTable;

import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

type Props = {
  onBack?: () => void;
};

const MonthlyReportTable = ({ onBack }: Props) => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    const user = localStorage.getItem("user");

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const fetchAttendanceList = async (pageNo = 1) => {
    try {
      setLoading(true);

      const user = getUserData();
      const empId = user?.id;

      if (!empId) {
        toast.error("Employee not found");
        return;
      }

      const res = await axios.post(`${apiUrl}/AttendanceList`, {
        empId: String(empId),
        start_date: fromDate,
        end_date: toDate,
        limit: 10,
        page: pageNo,
      });

      if (res.data?.success) {
        setAttendanceData(res.data?.data || []);

        setPage(res.data?.pagination?.current_page || 1);
        setLastPage(res.data?.pagination?.last_page || 1);
      } else {
        setAttendanceData([]);
        toast.error(res.data?.message || "Attendance list not found");
      }
    } catch (err: any) {
      setAttendanceData([]);

      toast.error(
        err?.response?.data?.message || "Attendance list API failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceList(1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchAttendanceList(1);
  };

  // Late status color
  const getLateStatusClass = (status: string) => {
    const value = status?.toLowerCase();

    if (value === "late") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (
      value === "on time" ||
      value === "ontime" ||
      value === "not late"
    ) {
      return "bg-green-50 text-green-600 border-green-200";
    }

    if (value === "no calls") {
      return "bg-orange-50 text-orange-600 border-orange-200";
    }

    return "bg-gray-50 text-gray-500 border-gray-200";
  };

  // Sunday check: attendance date first, then punch-in date, then created_at
  const isSunday = (row: any) => {
    const dateValue =
      row.attendance_date ||
      row.date ||
      row.start_date_time ||
      row.created_at;

    if (!dateValue) return false;

    // Only use YYYY-MM-DD part so timezone conversion does not change the day.
    const datePart = String(dateValue).slice(0, 10);
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) return false;

    return new Date(year, month - 1, day).getDay() === 0;
  };


  const getAttendanceStatus = (row: any) => {
    // Sunday
    if (isSunday(row)) {
      return row.start_date_time ? "S / P" : "S";
    }

    // If API sends day status, use it.
    // 1 = Present, 2 = Half Day, 3 = Absent, 4 = Leave
    if (row.day !== null && row.day !== undefined) {
      switch (Number(row.day)) {
        case 1:
          return "P";
        case 2:
          return "H";
        case 3:
          return "A";
        case 4:
          return "L";
      }
    }

    // Fallback
    return row.start_date_time ? "P" : "A";
  };

  return (
    <div className="bg-white rounded-[22px] border border-[#d9e3ef] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#d9e3ef] flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#10233f]">
          Monthly Attendance Report
        </h2>

        {onBack && (
          <button
            onClick={onBack}
            className="bg-[#0b6ea8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <ArrowLeft size={17} />
            Back
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-[#10233f] mb-2">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-11 border border-[#d9e3ef] rounded-xl px-4 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#10233f] mb-2">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full h-11 border border-[#d9e3ef] rounded-xl px-4 text-sm outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full h-11 bg-[#0b6ea8] text-white rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#d9e3ef] rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[1250px]">
            <thead className="bg-[#f6f9fc] text-[#10233f]">
              <tr>
                <th className="p-4 text-sm font-bold">No</th>

                <th className="p-4 text-sm font-bold">
                  Emp Name
                </th>

                <th className="p-4 text-sm font-bold">
                  Start Date & Time
                </th>

                <th className="p-4 text-sm font-bold">
                  End Date & Time
                </th>

                <th className="p-4 text-sm font-bold text-center">
                  Attendance
                </th>

                <th className="p-4 text-sm font-bold">
                  Working Hrs
                </th>

                {/* NEW */}
                <th className="p-4 text-sm font-bold">
                  First Call Time
                </th>

                {/* NEW */}
                <th className="p-4 text-sm font-bold">
                  Late Start Minutes
                </th>

                {/* NEW */}
                <th className="p-4 text-sm font-bold text-center">
                  Late Start Status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((row: any, index: number) => (
                  <tr
                    key={row.attendenceId}
                    className="border-t border-[#edf2f7] hover:bg-[#f8fbff]"
                  >
                    {/* No */}
                    <td className="p-4 text-sm">
                      {(page - 1) * 10 + index + 1}
                    </td>

                    {/* Employee */}
                    <td className="p-4 text-sm font-medium">
                      {row.strEmpName ||
                        row.user?.name ||
                        "-"}
                    </td>

                    {/* Start */}
                    <td className="p-4 text-sm whitespace-nowrap">
                      {row.start_date_time || "-"}
                    </td>

                    {/* End */}
                    <td className="p-4 text-sm whitespace-nowrap">
                      {row.end_date_time || "-"}
                    </td>

                    {/* Attendance */}
                    <td className="p-4 text-sm text-center font-bold">
                      {getAttendanceStatus(row) === "P" ? (
                        <span className="text-green-600">P</span>
                      ) : getAttendanceStatus(row) === "A" ? (
                        <span className="text-red-500">A</span>
                      ) : getAttendanceStatus(row) === "H" ? (
                        <span className="text-orange-500">H</span>
                      ) : getAttendanceStatus(row) === "L" ? (
                        <span className="text-purple-600">L</span>
                      ) : getAttendanceStatus(row) === "S" ? (
                        <span className="text-yellow-500">S</span>
                      ) : getAttendanceStatus(row) === "S / P" ? (
                        <span>
                          <span className="text-yellow-500">S</span>
                          <span className="text-[#10233f] mx-1">/</span>
                          <span className="text-green-600">P</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {getAttendanceStatus(row)}
                        </span>
                      )}
                    </td>

                    {/* Working hours */}
                    <td className="p-4 text-sm whitespace-nowrap">
                      {row.working_hrs ||
                        row.total_working_hrs ||
                        "-"}
                    </td>

                    {/* First Call Time */}
                    <td className="p-4 text-sm whitespace-nowrap font-medium">
                      {row.first_call_time || "-"}
                    </td>

                    {/* Late Start Minutes */}
                    <td className="p-4 text-sm">
                      {row.late_start_minutes !== null &&
                      row.late_start_minutes !== undefined
                        ? `${row.late_start_minutes} Min`
                        : "-"}
                    </td>

                    {/* Late Start Status */}
                    <td className="p-4 text-sm text-center">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-xs font-bold ${getLateStatusClass(
                          row.late_start_status
                        )}`}
                      >
                        {row.late_start_status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-5 text-center text-sm"
                  >
                    {loading
                      ? "Loading..."
                      : "No attendance found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            disabled={page <= 1 || loading}
            onClick={() => fetchAttendanceList(page - 1)}
            className="px-4 py-2 rounded-lg border border-[#d9e3ef] text-sm font-semibold disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm font-semibold text-[#10233f]">
            Page {page} of {lastPage}
          </span>

          <button
            disabled={page >= lastPage || loading}
            onClick={() => fetchAttendanceList(page + 1)}
            className="px-4 py-2 rounded-lg border border-[#d9e3ef] text-sm font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportTable;