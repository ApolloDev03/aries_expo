// import { ArrowLeft } from "lucide-react";

// type Props = {
//     onBack?: () => void;
// };

// const MonthlyReportTable = ({ onBack }: Props) => {
//     const attendanceData = [
//         {
//             id: 1,
//             name: "Krunal Shah",
//             start: "27-04-2026 09:53 AM",
//             end: "27-04-2026 07:21 PM",
//             status: "P",
//             hrs: "9 hours and 28 mins",
//         },
//         { id: 2, isSunday: true },
//         {
//             id: 3,
//             name: "Krunal Shah",
//             start: "25-04-2026 09:56 AM",
//             end: "25-04-2026 07:04 PM",
//             status: "P",
//             hrs: "9 hours and 08 mins",
//         },
//         {
//             id: 4,
//             name: "Krunal Shah",
//             start: "-",
//             end: "-",
//             status: "A",
//             hrs: "-",
//         },
//     ];

//     return (
//         <div className="bg-white rounded-[22px] border border-[#d9e3ef] overflow-hidden">
//             <div className="px-6 py-5 border-b border-[#d9e3ef] flex items-center justify-between gap-3">
//                 <h2 className="text-2xl font-bold text-[#10233f]">
//                     Monthly Attendance Report
//                 </h2>

//                 {onBack && (
//                     <button
//                         onClick={onBack}
//                         className="bg-[#0b6ea8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
//                     >
//                         <ArrowLeft size={17} />
//                         Back
//                     </button>
//                 )}
//             </div>

//             <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div>
//                         <label className="block text-sm font-bold text-[#10233f] mb-2">
//                             From Date
//                         </label>
//                         <input
//                             type="date"
//                             className="w-full h-11 border border-[#d9e3ef] rounded-xl px-4 text-sm outline-none"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-bold text-[#10233f] mb-2">
//                             To Date
//                         </label>
//                         <input
//                             type="date"
//                             className="w-full h-11 border border-[#d9e3ef] rounded-xl px-4 text-sm outline-none"
//                         />
//                     </div>

//                     <div className="flex items-end">
//                         <button className="w-full h-11 bg-[#0b6ea8] text-white rounded-xl text-sm font-bold">
//                             Search
//                         </button>
//                     </div>


//                 </div>

//                 <div className="overflow-x-auto border border-[#d9e3ef] rounded-2xl">
//                     <table className="w-full text-left border-collapse min-w-[850px]">
//                         <thead className="bg-[#f6f9fc] text-[#10233f]">
//                             <tr>
//                                 <th className="p-4 text-sm font-bold">No</th>
//                                 <th className="p-4 text-sm font-bold">Emp Name</th>
//                                 <th className="p-4 text-sm font-bold">Start Date & Time</th>
//                                 <th className="p-4 text-sm font-bold">End Date & Time</th>
//                                 <th className="p-4 text-sm font-bold text-center">Status</th>
//                                 <th className="p-4 text-sm font-bold">Working Hrs</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {attendanceData.map((row: any) =>
//                                 row.isSunday ? (
//                                     <tr key={row.id} className="bg-[#ccc] text-center">
//                                         <td colSpan={6} className="p-3 font-bold tracking-wider">
//                                             Sunday
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     <tr
//                                         key={row.id}
//                                         className="border-t border-[#edf2f7] hover:bg-[#f8fbff]"
//                                     >
//                                         <td className="p-4 text-sm ">{row.id}</td>
//                                         <td className="p-4 text-sm font-medium">
//                                             {row.name}
//                                         </td>
//                                         <td className="p-4 text-sm ">{row.start}</td>
//                                         <td className="p-4 text-sm ">{row.end}</td>
//                                         <td
//                                             className={`p-4 text-sm text-center font-bold ${row.status === "A" ? "text-red-500" : "text-green-600"
//                                                 }`}
//                                         >
//                                             {row.status}
//                                         </td>
//                                         <td className="p-4 text-sm ">{row.hrs}</td>
//                                     </tr>
//                                 )
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
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
    return user ? JSON.parse(user) : null;
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
        toast.error(res.data?.message || "Attendance list not found");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Attendance list API failed");
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

  return (
    <div className="bg-white rounded-[22px] border border-[#d9e3ef] overflow-hidden">
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

        <div className="overflow-x-auto border border-[#d9e3ef] rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead className="bg-[#f6f9fc] text-[#10233f]">
              <tr>
                <th className="p-4 text-sm font-bold">No</th>
                <th className="p-4 text-sm font-bold">Emp Name</th>
                <th className="p-4 text-sm font-bold">Start Date & Time</th>
                <th className="p-4 text-sm font-bold">End Date & Time</th>
                <th className="p-4 text-sm font-bold text-center">Status</th>
                <th className="p-4 text-sm font-bold">Working Hrs</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((row: any, index: number) => (
                  <tr
                    key={row.attendenceId}
                    className="border-t border-[#edf2f7] hover:bg-[#f8fbff]"
                  >
                    <td className="p-4 text-sm">
                      {(page - 1) * 10 + index + 1}
                    </td>

                    <td className="p-4 text-sm font-medium">
                      {row.strEmpName || row.user?.name || "-"}
                    </td>

                    <td className="p-4 text-sm">
                      {row.start_date_time || "-"}
                    </td>

                    <td className="p-4 text-sm">
                      {row.end_date_time || "-"}
                    </td>

                    <td
                      className={`p-4 text-sm text-center font-bold ${
                        row.start_date_time ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {row.start_date_time ? "P" : "A"}
                    </td>

                    <td className="p-4 text-sm">
                      {row.working_hrs ||
                        row.total_working_hrs ||
                        row.break_duration ||
                        "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-5 text-center text-sm">
                    {loading ? "Loading..." : "No attendance found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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