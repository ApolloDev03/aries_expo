// // // 1 -> p , 2 -> h , 3 -> a ,4 -> l

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // // import { Download } from "lucide-react";
// // import { toast } from "react-toastify";
// // import { apiUrl } from "../../config";

// // type Employee = {
// //   id: number;
// //   name: string;
// // };

// // type AttendanceRow = {
// //   attendenceId: number;
// //   empId: number;
// //   strEmpName: string;
// //   start_date_time: string | null;
// //   end_date_time: string | null;
// //   start_address: string | null;
// //   end_address: string | null;
// //   total_working_hrs: string | null;
// //   day: number | null;
// // };

// // type Pagination = {
// //   current_page: number;
// //   last_page: number;
// //   per_page: number;
// //   total: number;
// // };

// // export default function AttendanceReport() {
// //   const adminId = "3";

// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [attendanceList, setAttendanceList] = useState<AttendanceRow[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   const [employeeId, setEmployeeId] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");

// //   const [page, setPage] = useState(1);
// //   const [pagination, setPagination] = useState<Pagination>({
// //     current_page: 1,
// //     last_page: 1,
// //     per_page: 10,
// //     total: 0,
// //   });

// //   const limit = 10;

// //   const fetchEmployees = async () => {
// //     try {
// //       const res = await axios.post(`${apiUrl}/Getallemp`);

// //       if (res.data?.success) {
// //         setEmployees(res.data.data || []);
// //       }
// //     } catch (error: any) {
// //       toast.error(error?.response?.data?.message || "Employee fetch failed");
// //     }
// //   };

// //   const fetchAttendanceReport = async (pageNo = 1) => {
// //     try {
// //       setLoading(true);

// //       const res = await axios.post(`${apiUrl}/AdminAttendanceList`, {
// //         admin_id: adminId,
// //         empId: employeeId || "",
// //         search: search || "",
// //         start_date: fromDate || "",
// //         end_date: toDate || "",
// //         limit,
// //         page: pageNo,
// //       });

// //       if (res.data?.success) {
// //         setAttendanceList(res.data.data || []);
// //         setPagination(
// //           res.data.pagination || {
// //             current_page: 1,
// //             last_page: 1,
// //             per_page: 10,
// //             total: 0,
// //           }
// //         );
// //       } else {
// //         setAttendanceList([]);
// //         toast.error(res.data?.message || "Report fetch failed");
// //       }
// //     } catch (error: any) {
// //       setAttendanceList([]);
// //       toast.error(error?.response?.data?.message || "Report fetch failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSearch = () => {
// //     setPage(1);
// //     fetchAttendanceReport(1);
// //   };

// //   const handlePageChange = (newPage: number) => {
// //     if (newPage < 1 || newPage > pagination.last_page) return;

// //     setPage(newPage);
// //     fetchAttendanceReport(newPage);
// //   };
// //   const getAttendanceStatus = (day: number | null) => {
// //     switch (Number(day)) {
// //       case 1:
// //         return "P";
// //       case 2:
// //         return "H";
// //       case 3:
// //         return "A";
// //       case 4:
// //         return "L";
// //       default:
// //         return "-";
// //     }
// //   };
// //   // const exportExcel = () => {
// //   //   if (attendanceList.length === 0) {
// //   //     toast.error("No data found for export");
// //   //     return;
// //   //   }

// //   //   let table = `
// //   //     <table border="1">
// //   //       <thead>
// //   //         <tr>
// //   //           <th>Sr No</th>
// //   //           <th>Employee Name</th>
// //   //           <th>Start Time</th>
// //   //           <th>End Time</th>
// //   //           <th>Total Hours</th>
// //   //           <th>Start Location</th>
// //   //           <th>End Location</th>
// //   //         </tr>
// //   //       </thead>
// //   //       <tbody>
// //   //   `;

// //   //   attendanceList.forEach((item, index) => {
// //   //     table += `
// //   //       <tr>
// //   //         <td>${(pagination.current_page - 1) * limit + index + 1}</td>
// //   //         <td>${item.strEmpName || "-"}</td>
// //   //         <td>${item.start_date_time || "-"}</td>
// //   //         <td>${item.end_date_time || "-"}</td>
// //   //         <td>${item.total_working_hrs || "-"}</td>
// //   //         <td>${item.start_address || "-"}</td>
// //   //         <td>${item.end_address || "-"}</td>
// //   //       </tr>
// //   //     `;
// //   //   });

// //   //   table += `</tbody></table>`;

// //   //   const blob = new Blob(
// //   //     [
// //   //       `
// //   //       <html>
// //   //         <head><meta charset="UTF-8" /></head>
// //   //         <body>${table}</body>
// //   //       </html>
// //   //       `,
// //   //     ],
// //   //     { type: "application/vnd.ms-excel" }
// //   //   );

// //   //   const url = URL.createObjectURL(blob);
// //   //   const a = document.createElement("a");

// //   //   a.href = url;
// //   //   a.download = "attendance-report.xls";
// //   //   document.body.appendChild(a);
// //   //   a.click();

// //   //   document.body.removeChild(a);
// //   //   URL.revokeObjectURL(url);
// //   // };

// //   useEffect(() => {
// //     fetchEmployees();
// //     fetchAttendanceReport(1);
// //   }, []);

// //   return (
// //     <div className="space-y-6">
// //       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
// //         <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
// //           <div>
// //             <h1 className="text-2xl font-bold text-[#2c446b]">
// //               Attendance Report
// //             </h1>
           
// //           </div>

// //           {/* <button
// //             onClick={exportExcel}
// //             className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
// //           >
// //             <Download size={18} />
// //             Excel Export
// //           </button> */}
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
// //           <div>
// //             <label className="text-sm font-medium text-slate-600">
// //               Employee
// //             </label>
// //             <select
// //               value={employeeId}
// //               onChange={(e) => setEmployeeId(e.target.value)}
// //               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
// //             >
// //               <option value="">All Employees</option>
// //               {employees.map((emp) => (
// //                 <option key={emp.id} value={emp.id}>
// //                   {emp.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label className="text-sm font-medium text-slate-600">
// //               Search
// //             </label>
// //             <input
// //               type="text"
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search employee"
// //               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
// //             />
// //           </div>

// //           <div>
// //             <label className="text-sm font-medium text-slate-600">
// //               From Date
// //             </label>
// //             <input
// //               type="date"
// //               value={fromDate}
// //               onChange={(e) => setFromDate(e.target.value)}
// //               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
// //             />
// //           </div>

// //           <div>
// //             <label className="text-sm font-medium text-slate-600">
// //               To Date
// //             </label>
// //             <input
// //               type="date"
// //               value={toDate}
// //               onChange={(e) => setToDate(e.target.value)}
// //               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
// //             />
// //           </div>

// //           <div className="flex items-end">
// //             <button
// //               onClick={handleSearch}
// //               className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold"
// //             >
// //               Search
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-sm">
// //             <thead className="bg-slate-100 text-slate-600">
// //               <tr>
// //                 <th className="px-4 py-3 text-left">Sr No</th>
// //                 <th className="px-4 py-3 text-left">Employee</th>
// //                 <th className="px-4 py-3 text-left">Start Time</th>
// //                 <th className="px-4 py-3 text-left">End Time</th>
// //                 <th className="px-4 py-3 text-left">Attendance Status</th>
// //                 <th className="px-4 py-3 text-left">Working Hrs</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan={7} className="px-4 py-8 text-center">
// //                     Loading...
// //                   </td>
// //                 </tr>
// //               ) : attendanceList.length > 0 ? (
// //                 attendanceList.map((item, index) => (
// //                   <tr
// //                     key={item.attendenceId}
// //                     className="border-t border-slate-100"
// //                   >
// //                     <td className="px-4 py-3">
// //                       {(pagination.current_page - 1) * limit + index + 1}
// //                     </td>
// //                     <td className="px-4 py-3 font-medium">
// //                       {item.strEmpName || "-"}
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       {item.start_date_time || "-"}
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       {item.end_date_time || "-"}
// //                     </td>
// //                     <td className="px-4 py-3">{getAttendanceStatus(item.day)}</td>
// //                     <td className="px-4 py-3">{item.total_working_hrs || "-"}</td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td
// //                     colSpan={7}
// //                     className="px-4 py-8 text-center text-slate-500"
// //                   >
// //                     No attendance record found
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {pagination.last_page > 1 && (
// //           <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-t border-slate-100">
// //             <p className="text-sm text-slate-500">
// //               Showing page {pagination.current_page} of {pagination.last_page} —
// //               Total {pagination.total} records
// //             </p>

// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => handlePageChange(page - 1)}
// //                 disabled={page === 1}
// //                 className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
// //               >
// //                 Prev
// //               </button>

// //               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
// //                 (pageNo) => (
// //                   <button
// //                     key={pageNo}
// //                     onClick={() => handlePageChange(pageNo)}
// //                     className={`px-3 py-2 rounded-lg border ${pageNo === pagination.current_page
// //                       ? "bg-[#2c446b] text-white border-[#2c446b]"
// //                       : "border-slate-200"
// //                       }`}
// //                   >
// //                     {pageNo}
// //                   </button>
// //                 )
// //               )}

// //               <button
// //                 onClick={() => handlePageChange(page + 1)}
// //                 disabled={page === pagination.last_page}
// //                 className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// type Employee = {
//   id: number;
//   name: string;
// };

// type AttendanceRow = {
//   attendenceId: number;
//   empId: number;
//   strEmpName: string;
//   start_date_time: string | null;
//   end_date_time: string | null;
//   start_address: string | null;
//   end_address: string | null;
//   total_working_hrs: string | null;
//   day: number | null;

//   // New fields from AdminAttendanceList API
//   first_call_time: string | null;
//   late_start_minutes: number | null;
//   late_start_status: string | null;
// };

// type Pagination = {
//   current_page: number;
//   last_page: number;
//   per_page: number;
//   total: number;
// };

// export default function AttendanceReport() {
//   const adminId = "3";

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [attendanceList, setAttendanceList] = useState<AttendanceRow[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [employeeId, setEmployeeId] = useState("");
//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [page, setPage] = useState(1);

//   const [pagination, setPagination] = useState<Pagination>({
//     current_page: 1,
//     last_page: 1,
//     per_page: 10,
//     total: 0,
//   });

//   const limit = 10;

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.post(`${apiUrl}/Getallemp`);

//       if (res.data?.success) {
//         setEmployees(res.data.data || []);
//       }
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || "Employee fetch failed"
//       );
//     }
//   };

//   const fetchAttendanceReport = async (pageNo = 1) => {
//     try {
//       setLoading(true);

//       const res = await axios.post(`${apiUrl}/AdminAttendanceList`, {
//         admin_id: adminId,
//         empId: employeeId || "",
//         search: search || "",
//         start_date: fromDate || "",
//         end_date: toDate || "",
//         limit,
//         page: pageNo,
//       });

//       if (res.data?.success) {
//         setAttendanceList(res.data.data || []);

//         const apiPagination = res.data.pagination || {
//           current_page: 1,
//           last_page: 1,
//           per_page: limit,
//           total: 0,
//         };

//         setPagination(apiPagination);

//         // Keep local page synchronized with API current page
//         setPage(Number(apiPagination.current_page || pageNo || 1));
//       } else {
//         setAttendanceList([]);
//         setPage(1);
//         setPagination({
//           current_page: 1,
//           last_page: 1,
//           per_page: limit,
//           total: 0,
//         });

//         toast.error(res.data?.message || "Report fetch failed");
//       }
//     } catch (error: any) {
//       setAttendanceList([]);
//       setPage(1);
//       setPagination({
//         current_page: 1,
//         last_page: 1,
//         per_page: limit,
//         total: 0,
//       });

//       toast.error(
//         error?.response?.data?.message || "Report fetch failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     if (fromDate && toDate && fromDate > toDate) {
//       toast.error("From Date cannot be greater than To Date.");
//       return;
//     }

//     setPage(1);
//     fetchAttendanceReport(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (
//       newPage < 1 ||
//       newPage > pagination.last_page ||
//       newPage === pagination.current_page ||
//       loading
//     ) {
//       return;
//     }

//     setPage(newPage);
//     fetchAttendanceReport(newPage);
//   };

//   const getAttendanceStatus = (day: number | null) => {
//     switch (Number(day)) {
//       case 1:
//         return "P";
//       case 2:
//         return "H";
//       case 3:
//         return "A";
//       case 4:
//         return "L";
//       default:
//         return "-";
//     }
//   };

//   const getLateStatusClass = (status: string | null) => {
//     const normalized = (status || "").toLowerCase();

//     if (normalized === "late") {
//       return "bg-red-50 text-red-700 border-red-200";
//     }

//     if (
//       normalized === "on time" ||
//       normalized === "ontime" ||
//       normalized === "on-time"
//     ) {
//       return "bg-green-50 text-green-700 border-green-200";
//     }

//     return "bg-slate-50 text-slate-600 border-slate-200";
//   };

//   /*
//     Proper pagination:
//     Instead of rendering 1...150 buttons,
//     only a small window around current page is shown.

//     Examples:
//     1 2 3 4 ... 150
//     1 ... 24 25 26 ... 150
//     1 ... 147 148 149 150
//   */
//   const getPaginationItems = (): (number | string)[] => {
//     const current = pagination.current_page;
//     const last = pagination.last_page;

//     if (last <= 7) {
//       return Array.from({ length: last }, (_, index) => index + 1);
//     }

//     const items: (number | string)[] = [];

//     if (current <= 4) {
//       items.push(1, 2, 3, 4, 5, "...", last);
//       return items;
//     }

//     if (current >= last - 3) {
//       items.push(
//         1,
//         "...",
//         last - 4,
//         last - 3,
//         last - 2,
//         last - 1,
//         last
//       );
//       return items;
//     }

//     items.push(
//       1,
//       "...",
//       current - 1,
//       current,
//       current + 1,
//       "...",
//       last
//     );

//     return items;
//   };

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendanceReport(1);
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//         <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
//           <div>
//             <h1 className="text-2xl font-bold text-[#2c446b]">
//               Attendance Report
//             </h1>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               Employee
//             </label>

//             <select
//               value={employeeId}
//               onChange={(e) => setEmployeeId(e.target.value)}
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             >
//               <option value="">All Employees</option>

//               {employees.map((emp) => (
//                 <option key={emp.id} value={emp.id}>
//                   {emp.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               Search
//             </label>

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search employee"
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               From Date
//             </label>

//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               To Date
//             </label>

//             <input
//               type="date"
//               value={toDate}
//               min={fromDate || undefined}
//               onChange={(e) => setToDate(e.target.value)}
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               type="button"
//               onClick={handleSearch}
//               disabled={loading}
//               className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold disabled:opacity-60"
//             >
//               {loading ? "Searching..." : "Search"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1250px] text-sm">
//             <thead className="bg-slate-100 text-slate-600">
//               <tr>
//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Sr No
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Employee
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Start Time
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   End Time
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   First Call Time
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Attendance Status
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Late Status
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Late Minutes
//                 </th>

//                 <th className="px-4 py-3 text-left whitespace-nowrap">
//                   Working Hrs
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="px-4 py-8 text-center text-slate-500"
//                   >
//                     Loading...
//                   </td>
//                 </tr>
//               ) : attendanceList.length > 0 ? (
//                 attendanceList.map((item, index) => (
//                   <tr
//                     key={item.attendenceId}
//                     className="border-t border-slate-100 hover:bg-slate-50/60"
//                   >
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {(pagination.current_page - 1) *
//                         pagination.per_page +
//                         index +
//                         1}
//                     </td>

//                     <td className="px-4 py-3 font-medium whitespace-nowrap">
//                       {item.strEmpName || "-"}
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {item.start_date_time || "-"}
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {item.end_date_time || "-"}
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {item.first_call_time || "-"}
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">
//                         {getAttendanceStatus(item.day)}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {item.late_start_status ? (
//                         <span
//                           className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getLateStatusClass(
//                             item.late_start_status
//                           )}`}
//                         >
//                           {item.late_start_status}
//                         </span>
//                       ) : (
//                         "-"
//                       )}
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {item.late_start_minutes !== null &&
//                       item.late_start_minutes !== undefined
//                         ? `${item.late_start_minutes} min`
//                         : "-"}
//                     </td>

//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {item.total_working_hrs || "-"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="px-4 py-8 text-center text-slate-500"
//                   >
//                     No attendance record found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
//           <p className="text-sm text-slate-500">
//             Showing Page {pagination.current_page} of{" "}
//             {pagination.last_page} — Total {pagination.total} Records
//           </p>

//           {pagination.last_page > 1 && (
//             <div className="flex flex-wrap items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   handlePageChange(pagination.current_page - 1)
//                 }
//                 disabled={
//                   pagination.current_page === 1 || loading
//                 }
//                 className="px-3 py-2 rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               {getPaginationItems().map((item, index) =>
//                 item === "..." ? (
//                   <span
//                     key={`dots-${index}`}
//                     className="px-1.5 py-2 text-slate-400"
//                   >
//                     ...
//                   </span>
//                 ) : (
//                   <button
//                     type="button"
//                     key={item}
//                     onClick={() =>
//                       handlePageChange(Number(item))
//                     }
//                     disabled={
//                       loading ||
//                       Number(item) === pagination.current_page
//                     }
//                     className={`min-w-10 px-3 py-2 rounded-lg border transition ${
//                       Number(item) === pagination.current_page
//                         ? "bg-[#2c446b] text-white border-[#2c446b]"
//                         : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
//                     }`}
//                   >
//                     {item}
//                   </button>
//                 )
//               )}

//               <button
//                 type="button"
//                 onClick={() =>
//                   handlePageChange(pagination.current_page + 1)
//                 }
//                 disabled={
//                   pagination.current_page === pagination.last_page ||
//                   loading
//                 }
//                 className="px-3 py-2 rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // 1 -> p , 2 -> h , 3 -> a ,4 -> l

// import { useEffect, useState } from "react";
// import axios from "axios";
// // import { Download } from "lucide-react";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// type Employee = {
//   id: number;
//   name: string;
// };

// type AttendanceRow = {
//   attendenceId: number;
//   empId: number;
//   strEmpName: string;
//   start_date_time: string | null;
//   end_date_time: string | null;
//   start_address: string | null;
//   end_address: string | null;
//   total_working_hrs: string | null;
//   day: number | null;
// };

// type Pagination = {
//   current_page: number;
//   last_page: number;
//   per_page: number;
//   total: number;
// };

// export default function AttendanceReport() {
//   const adminId = "3";

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [attendanceList, setAttendanceList] = useState<AttendanceRow[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [employeeId, setEmployeeId] = useState("");
//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState<Pagination>({
//     current_page: 1,
//     last_page: 1,
//     per_page: 10,
//     total: 0,
//   });

//   const limit = 10;

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.post(`${apiUrl}/Getallemp`);

//       if (res.data?.success) {
//         setEmployees(res.data.data || []);
//       }
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Employee fetch failed");
//     }
//   };

//   const fetchAttendanceReport = async (pageNo = 1) => {
//     try {
//       setLoading(true);

//       const res = await axios.post(`${apiUrl}/AdminAttendanceList`, {
//         admin_id: adminId,
//         empId: employeeId || "",
//         search: search || "",
//         start_date: fromDate || "",
//         end_date: toDate || "",
//         limit,
//         page: pageNo,
//       });

//       if (res.data?.success) {
//         setAttendanceList(res.data.data || []);
//         setPagination(
//           res.data.pagination || {
//             current_page: 1,
//             last_page: 1,
//             per_page: 10,
//             total: 0,
//           }
//         );
//       } else {
//         setAttendanceList([]);
//         toast.error(res.data?.message || "Report fetch failed");
//       }
//     } catch (error: any) {
//       setAttendanceList([]);
//       toast.error(error?.response?.data?.message || "Report fetch failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     setPage(1);
//     fetchAttendanceReport(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > pagination.last_page) return;

//     setPage(newPage);
//     fetchAttendanceReport(newPage);
//   };
//   const getAttendanceStatus = (day: number | null) => {
//     switch (Number(day)) {
//       case 1:
//         return "P";
//       case 2:
//         return "H";
//       case 3:
//         return "A";
//       case 4:
//         return "L";
//       default:
//         return "-";
//     }
//   };
//   // const exportExcel = () => {
//   //   if (attendanceList.length === 0) {
//   //     toast.error("No data found for export");
//   //     return;
//   //   }

//   //   let table = `
//   //     <table border="1">
//   //       <thead>
//   //         <tr>
//   //           <th>Sr No</th>
//   //           <th>Employee Name</th>
//   //           <th>Start Time</th>
//   //           <th>End Time</th>
//   //           <th>Total Hours</th>
//   //           <th>Start Location</th>
//   //           <th>End Location</th>
//   //         </tr>
//   //       </thead>
//   //       <tbody>
//   //   `;

//   //   attendanceList.forEach((item, index) => {
//   //     table += `
//   //       <tr>
//   //         <td>${(pagination.current_page - 1) * limit + index + 1}</td>
//   //         <td>${item.strEmpName || "-"}</td>
//   //         <td>${item.start_date_time || "-"}</td>
//   //         <td>${item.end_date_time || "-"}</td>
//   //         <td>${item.total_working_hrs || "-"}</td>
//   //         <td>${item.start_address || "-"}</td>
//   //         <td>${item.end_address || "-"}</td>
//   //       </tr>
//   //     `;
//   //   });

//   //   table += `</tbody></table>`;

//   //   const blob = new Blob(
//   //     [
//   //       `
//   //       <html>
//   //         <head><meta charset="UTF-8" /></head>
//   //         <body>${table}</body>
//   //       </html>
//   //       `,
//   //     ],
//   //     { type: "application/vnd.ms-excel" }
//   //   );

//   //   const url = URL.createObjectURL(blob);
//   //   const a = document.createElement("a");

//   //   a.href = url;
//   //   a.download = "attendance-report.xls";
//   //   document.body.appendChild(a);
//   //   a.click();

//   //   document.body.removeChild(a);
//   //   URL.revokeObjectURL(url);
//   // };

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendanceReport(1);
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//         <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
//           <div>
//             <h1 className="text-2xl font-bold text-[#2c446b]">
//               Attendance Report
//             </h1>
           
//           </div>

//           {/* <button
//             onClick={exportExcel}
//             className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
//           >
//             <Download size={18} />
//             Excel Export
//           </button> */}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               Employee
//             </label>
//             <select
//               value={employeeId}
//               onChange={(e) => setEmployeeId(e.target.value)}
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             >
//               <option value="">All Employees</option>
//               {employees.map((emp) => (
//                 <option key={emp.id} value={emp.id}>
//                   {emp.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               Search
//             </label>
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search employee"
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={handleSearch}
//               className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-100 text-slate-600">
//               <tr>
//                 <th className="px-4 py-3 text-left">Sr No</th>
//                 <th className="px-4 py-3 text-left">Employee</th>
//                 <th className="px-4 py-3 text-left">Start Time</th>
//                 <th className="px-4 py-3 text-left">End Time</th>
//                 <th className="px-4 py-3 text-left">Attendance Status</th>
//                 <th className="px-4 py-3 text-left">Working Hrs</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-8 text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : attendanceList.length > 0 ? (
//                 attendanceList.map((item, index) => (
//                   <tr
//                     key={item.attendenceId}
//                     className="border-t border-slate-100"
//                   >
//                     <td className="px-4 py-3">
//                       {(pagination.current_page - 1) * limit + index + 1}
//                     </td>
//                     <td className="px-4 py-3 font-medium">
//                       {item.strEmpName || "-"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {item.start_date_time || "-"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {item.end_date_time || "-"}
//                     </td>
//                     <td className="px-4 py-3">{getAttendanceStatus(item.day)}</td>
//                     <td className="px-4 py-3">{item.total_working_hrs || "-"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-4 py-8 text-center text-slate-500"
//                   >
//                     No attendance record found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {pagination.last_page > 1 && (
//           <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-t border-slate-100">
//             <p className="text-sm text-slate-500">
//               Showing page {pagination.current_page} of {pagination.last_page} —
//               Total {pagination.total} records
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => handlePageChange(page - 1)}
//                 disabled={page === 1}
//                 className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
//                 (pageNo) => (
//                   <button
//                     key={pageNo}
//                     onClick={() => handlePageChange(pageNo)}
//                     className={`px-3 py-2 rounded-lg border ${pageNo === pagination.current_page
//                       ? "bg-[#2c446b] text-white border-[#2c446b]"
//                       : "border-slate-200"
//                       }`}
//                   >
//                     {pageNo}
//                   </button>
//                 )
//               )}

//               <button
//                 onClick={() => handlePageChange(page + 1)}
//                 disabled={page === pagination.last_page}
//                 className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
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

  // Used for Sunday detection
  attendance_date?: string | null;
  date?: string | null;
  created_at?: string | null;

  // New fields from AdminAttendanceList API
  first_call_time: string | null;
  late_start_minutes: number | null;
  late_start_status: string | null;
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
      toast.error(
        error?.response?.data?.message || "Employee fetch failed"
      );
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

        const apiPagination = res.data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: 0,
        };

        setPagination(apiPagination);

        // Keep local page synchronized with API current page
        setPage(Number(apiPagination.current_page || pageNo || 1));
      } else {
        setAttendanceList([]);
        setPage(1);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: limit,
          total: 0,
        });

        toast.error(res.data?.message || "Report fetch failed");
      }
    } catch (error: any) {
      setAttendanceList([]);
      setPage(1);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: limit,
        total: 0,
      });

      toast.error(
        error?.response?.data?.message || "Report fetch failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (fromDate && toDate && fromDate > toDate) {
      toast.error("From Date cannot be greater than To Date.");
      return;
    }

    setPage(1);
    fetchAttendanceReport(1);
  };

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 1 ||
      newPage > pagination.last_page ||
      newPage === pagination.current_page ||
      loading
    ) {
      return;
    }

    setPage(newPage);
    fetchAttendanceReport(newPage);
  };

  const isSunday = (item: AttendanceRow) => {
    const dateValue =
      item.attendance_date ||
      item.date ||
      item.start_date_time ||
      item.created_at;

    if (!dateValue) return false;

    const formattedDate = String(dateValue).replace(" ", "T");
    const parsedDate = new Date(formattedDate);

    if (Number.isNaN(parsedDate.getTime())) return false;

    return parsedDate.getDay() === 0;
  };

  const getAttendanceStatus = (item: AttendanceRow) => {
    const normalStatus = (() => {
      switch (Number(item.day)) {
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
    })();

    if (isSunday(item)) {
      // Sunday + employee worked/present
      if (item.start_date_time || Number(item.day) === 1) {
        return "S / P";
      }

      // Sunday + no work
      return "S";
    }

    return normalStatus;
  };

  const getLateStatusClass = (status: string | null) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "late") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (
      normalized === "on time" ||
      normalized === "ontime" ||
      normalized === "on-time"
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  /*
    Proper pagination:
    Instead of rendering 1...150 buttons,
    only a small window around current page is shown.

    Examples:
    1 2 3 4 ... 150
    1 ... 24 25 26 ... 150
    1 ... 147 148 149 150
  */
  const getPaginationItems = (): (number | string)[] => {
    const current = pagination.current_page;
    const last = pagination.last_page;

    if (last <= 7) {
      return Array.from({ length: last }, (_, index) => index + 1);
    }

    const items: (number | string)[] = [];

    if (current <= 4) {
      items.push(1, 2, 3, 4, 5, "...", last);
      return items;
    }

    if (current >= last - 3) {
      items.push(
        1,
        "...",
        last - 4,
        last - 3,
        last - 2,
        last - 1,
        last
      );
      return items;
    }

    items.push(
      1,
      "...",
      current - 1,
      current,
      current + 1,
      "...",
      last
    );

    return items;
  };

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
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Sr No
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Employee
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Start Time
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  End Time
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  First Call Time
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Attendance Status
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Late Status
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Late Minutes
                </th>

                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Working Hrs
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : attendanceList.length > 0 ? (
                attendanceList.map((item, index) => (
                  <tr
                    key={item.attendenceId}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {(pagination.current_page - 1) *
                        pagination.per_page +
                        index +
                        1}
                    </td>

                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {item.strEmpName || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.start_date_time || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.end_date_time || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.first_call_time || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      {getAttendanceStatus(item) === "P" ? (
                        <span className="text-green-600">P</span>
                      ) : getAttendanceStatus(item) === "A" ? (
                        <span className="text-red-500">A</span>
                      ) : getAttendanceStatus(item) === "H" ? (
                        <span className="text-orange-500">H</span>
                      ) : getAttendanceStatus(item) === "L" ? (
                        <span className="text-purple-600">L</span>
                      ) : getAttendanceStatus(item) === "S" ? (
                        <span className="text-yellow-500">S</span>
                      ) : getAttendanceStatus(item) === "S / P" ? (
                        <span>
                          <span className="text-yellow-500">S</span>
                          <span className="text-slate-500 mx-1">/</span>
                          <span className="text-green-600">P</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {getAttendanceStatus(item)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.late_start_status ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getLateStatusClass(
                            item.late_start_status
                          )}`}
                        >
                          {item.late_start_status}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.late_start_minutes !== null &&
                      item.late_start_minutes !== undefined
                        ? `${item.late_start_minutes} min`
                        : "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.total_working_hrs || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No attendance record found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            Showing Page {pagination.current_page} of{" "}
            {pagination.last_page} — Total {pagination.total} Records
          </p>

          {pagination.last_page > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePageChange(pagination.current_page - 1)
                }
                disabled={
                  pagination.current_page === 1 || loading
                }
                className="px-3 py-2 rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              {getPaginationItems().map((item, index) =>
                item === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-1.5 py-2 text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      handlePageChange(Number(item))
                    }
                    disabled={
                      loading ||
                      Number(item) === pagination.current_page
                    }
                    className={`min-w-10 px-3 py-2 rounded-lg border transition ${
                      Number(item) === pagination.current_page
                        ? "bg-[#2c446b] text-white border-[#2c446b]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  handlePageChange(pagination.current_page + 1)
                }
                disabled={
                  pagination.current_page === pagination.last_page ||
                  loading
                }
                className="px-3 py-2 rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}