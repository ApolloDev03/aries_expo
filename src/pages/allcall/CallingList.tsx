// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// type UserData = {
//     user_id: number;
//     user_name: string;
//     mobile: string;

//     today_register_count?: number;
//     total_register_count?: number;

//     today_wrong_number?: number;
//     total_wrong_number?: number;

//     today_busy_now_callback?: number;
//     total_busy_now_callback?: number;
//     busy_now_callback_reset_flag?: number;
//     today_business_changed?: number;
//     total_business_changed?: number;

//     today_information_passed?: number;
//     total_information_passed?: number;
//     information_passed_reset_flag?: number;

//     today_not_interested?: number;
//     total_not_interested?: number;
// };

// type TodayRegisterItem = {
//     visitor_followup_id: number;
//     visitor_id: number;
//     followup_user_id: number;
//     created_at: string;
//     name: string | null;
//     companyname: string | null;
//     mobileno: string;
//     followup_username: string;
// };

// type AdminRegisterListResponse = {
//     success: boolean;
//     message: string;
//     count?: number;
//     current_page?: number;
//     last_page?: number;
//     data: UserData[];
// };

// type AdminTodayRegisterListResponse = {
//     success: boolean;
//     message: string;
//     type?: string;
//     count?: number;
//     current_page?: number;
//     last_page?: number;
//     data: TodayRegisterItem[];
// };

// const CallingList = () => {
//     const navigate = useNavigate();
//     const { type, subtype } = useParams();

//     const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
//     const [deleteUserModal, setDeleteUserModal] = useState<UserData | null>(null);

//     const [resetLoadingId, setResetLoadingId] = useState<number | null>(null);
//     const [resetUserModal, setResetUserModal] = useState<UserData | null>(null);

//     const [isExporting, setIsExporting] = useState(false);
//     const [selectedUser, setSelectedUser] = useState("");
//     const [selectedDate, setSelectedDate] = useState("");

//     const [todayList, setTodayList] = useState<TodayRegisterItem[]>([]);
//     const [searchLoading, setSearchLoading] = useState(false);

//     const [loading, setLoading] = useState(true);
//     const [data, setData] = useState<UserData[]>([]);

//     const [listingCount, setListingCount] = useState(0);

//     const [currentPage, setCurrentPage] = useState(1);

//     const [listingPage, setListingPage] = useState(1);
//     const [listingLastPage, setListingLastPage] = useState(1);

//     const isTotalPage = subtype === "total";

//     const pageConfig = useMemo(() => {
//         const config = {
//             register: {
//                 headerTitle: isTotalPage ? "Total Register List" : "Today Register List",
//                 listingTitle: isTotalPage ? "Total Register Listing" : "Today Register Listing",
//                 apiType: isTotalPage ? "Totalregister" : "Todayregister",
//                 todayKey: "today_register_count",
//                 totalKey: "total_register_count",
//             },
//             "wrong-number": {
//                 headerTitle: isTotalPage ? "Total Wrong Number List" : "Today Wrong Number List",
//                 listingTitle: isTotalPage ? "Total Wrong Number Listing" : "Today Wrong Number Listing",
//                 apiType: isTotalPage ? "TotalWrongNumber" : "TodayWrongNumber",
//                 todayKey: "today_wrong_number",
//                 totalKey: "total_wrong_number",
//             },
//             "busy-now-callback": {
//                 headerTitle: isTotalPage
//                     ? "Total Busy Now Callback List"
//                     : "Today Busy Now Callback List",
//                 listingTitle: isTotalPage
//                     ? "Total Busy Now Callback Listing"
//                     : "Today Busy Now Callback Listing",
//                 apiType: isTotalPage ? "TotalBusyNowCallback" : "TodayBusyNowCallback",
//                 todayKey: "today_busy_now_callback",
//                 totalKey: "total_busy_now_callback",
//                 resetFlagKey: "busy_now_callback_reset_flag",
//             },
//             "business-changed": {
//                 headerTitle: isTotalPage
//                     ? "Total Business Changed List"
//                     : "Today Business Changed List",
//                 listingTitle: isTotalPage
//                     ? "Total Business Changed Listing"
//                     : "Today Business Changed Listing",
//                 apiType: isTotalPage ? "TotalBusinessChanged" : "TodayBusinessChanged",
//                 todayKey: "today_business_changed",
//                 totalKey: "total_business_changed",
//             },
//             "information-passed": {
//                 headerTitle: isTotalPage
//                     ? "Total Information Passed List"
//                     : "Today Information Passed List",
//                 listingTitle: isTotalPage
//                     ? "Total Information Passed Listing"
//                     : "Today Information Passed Listing",
//                 apiType: isTotalPage ? "TotalInformationPassed" : "TodayInformationPassed",
//                 todayKey: "today_information_passed",
//                 totalKey: "total_information_passed",
//                 resetFlagKey: "information_passed_reset_flag",
//             },
//             "not-interested": {
//                 headerTitle: isTotalPage
//                     ? "Total Not Interested List"
//                     : "Today Not Interested List",
//                 listingTitle: isTotalPage
//                     ? "Total Not Interested Listing"
//                     : "Today Not Interested Listing",
//                 apiType: isTotalPage ? "TotalNotInterested" : "TodayNotInterested",
//                 todayKey: "today_not_interested",
//                 totalKey: "total_not_interested",
//             },
//         };

//         return config[(type as keyof typeof config) || "register"] || config.register;
//     }, [type, isTotalPage]);

//     const canShowDeleteButton =
//         type === "wrong-number" || type === "business-changed";

//     const canShowResetButton =
//         type === "busy-now-callback" || type === "information-passed";

//     const canShowActionButton = canShowDeleteButton || canShowResetButton;

//     const visitorEmployeeActionType = useMemo(() => {
//         const typeMap: Record<string, string> = {
//             register: "1",
//             "wrong-number": "2",
//             "busy-now-callback": "3",
//             "business-changed": "4",
//             "information-passed": "5",
//             "not-interested": "6",
//         };

//         return typeMap[type || ""] || "";
//     }, [type]);

//     const fetchData = async (page = 1) => {
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post<AdminRegisterListResponse>(
//                 `${apiUrl}/AdminRegisterList`,
//                 {
//                     admin_id: Number(adminId),
//                     page,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) {
//                 setData(res.data.data || []);
//                 setCurrentPage(Number(res.data.current_page || page || 1));
//             } else {
//                 setData([]);
//                 setCurrentPage(1);
//                 toast.error(res.data?.message || "Failed to fetch data");
//             }
//         } catch (err: any) {
//             console.error(err);
//             setData([]);
//             setCurrentPage(1);
//             toast.error(err?.response?.data?.message || "Failed to fetch data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchListing = async (
//         userId?: string,
//         dateValue?: string,
//         page: number = 1
//     ) => {
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setSearchLoading(true);

//             const finalDate = dateValue ?? selectedDate ?? "";
//             const finalUserId = userId ?? selectedUser ?? "";

//             const res = await axios.post<AdminTodayRegisterListResponse>(
//                 `${apiUrl}/AdminTodayRegisterList`,
//                 {
//                     admin_id: adminId,
//                     followup_user_id: finalUserId,
//                     type: pageConfig.apiType,
//                     fromdate: isTotalPage ? finalDate : "",
//                     todate: isTotalPage ? finalDate : "",
//                     page: page,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) {
//                 setTodayList(res.data.data || []);
//                 setListingCount(Number(res.data.count || 0));
//                 setListingPage(Number(res.data.current_page || page || 1));
//                 setListingLastPage(Number(res.data.last_page || 1));
//             } else {
//                 setTodayList([]);
//                 setListingCount(0);
//                 setListingPage(1);
//                 setListingLastPage(1);
//                 toast.error(res.data?.message || "No data found");
//             }
//         } catch (err: any) {
//             console.error(err);
//             setTodayList([]);
//             setListingCount(0);
//             setListingPage(1);
//             setListingLastPage(1);
//             toast.error(err?.response?.data?.message || "Search failed");
//         } finally {
//             setSearchLoading(false);
//         }
//     };

//     const handleSearch = async () => {
//         setListingPage(1);
//         await fetchListing(selectedUser, selectedDate, 1);
//     };

//     const handleListingPageChange = (page: number) => {
//         if (page < 1 || page > listingLastPage || page === listingPage) return;
//         fetchListing(selectedUser, selectedDate, page);
//     };

//     useEffect(() => {
//         fetchData(1);
//     }, []);

//     useEffect(() => {
//         setSelectedUser("");
//         setSelectedDate("");
//         setListingPage(1);
//         fetchListing("", "", 1);
//         fetchData(1);
//     }, [type, subtype]);

//     const getTodayCount = (item: UserData) => {
//         return Number(item[pageConfig.todayKey as keyof UserData] ?? 0);
//     };

//     const getResetFlag = (item: UserData) => {
//         const resetFlagKey = (pageConfig as any).resetFlagKey;

//         if (!resetFlagKey) return 0;

//         return Number(item[resetFlagKey as keyof UserData] ?? 0);
//     };
//     const getTotalCount = (item: UserData) => {
//         return Number(item[pageConfig.totalKey as keyof UserData] ?? 0);
//     };

//     const formatType = (value?: string) =>
//         (value ?? "Unknown")
//             .replace(/-/g, " ")
//             .replace(/\b\w/g, (char) => char.toUpperCase());

//     const renderListingPaginationButtons = () => {
//         const buttons: (number | string)[] = [];

//         if (listingLastPage <= 7) {
//             for (let i = 1; i <= listingLastPage; i++) {
//                 buttons.push(i);
//             }
//         } else {
//             buttons.push(1);

//             if (listingPage > 3) {
//                 buttons.push("...");
//             }

//             const start = Math.max(2, listingPage - 1);
//             const end = Math.min(listingLastPage - 1, listingPage + 1);

//             for (let i = start; i <= end; i++) {
//                 buttons.push(i);
//             }

//             if (listingPage < listingLastPage - 2) {
//                 buttons.push("...");
//             }

//             buttons.push(listingLastPage);
//         }

//         return buttons.map((item, index) =>
//             item === "..." ? (
//                 <span
//                     key={`listing-dots-${index}`}
//                     className="px-2 py-1 text-sm font-medium text-gray-500"
//                 >
//                     ...
//                 </span>
//             ) : (
//                 <button
//                     key={item}
//                     type="button"
//                     onClick={() => handleListingPageChange(Number(item))}
//                     className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${listingPage === item
//                         ? "border-[#d47d4c] bg-[#d47d4c] text-white"
//                         : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//                         }`}
//                 >
//                     {item}
//                 </button>
//             )
//         );
//     };

//     const handleExportExcel = async () => {
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setIsExporting(true);

//             const res = await axios.post(
//                 `${apiUrl}/AdminFollowupExport`,
//                 {
//                     admin_id: adminId,
//                     type: pageConfig.apiType,
//                     followup_user_id: selectedUser || "",
//                     fromdate: isTotalPage ? selectedDate : "",
//                     todate: isTotalPage ? selectedDate : "",
//                 },
//                 {
//                     responseType: "blob",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             const contentType = res.headers?.["content-type"] || "";

//             if (
//                 contentType.includes("application/json") ||
//                 contentType.includes("text/json")
//             ) {
//                 const text = await new Response(res.data).text();

//                 try {
//                     const json = JSON.parse(text);
//                     toast.error(json?.message || "Export failed");
//                 } catch {
//                     toast.error("Export failed");
//                 }
//                 return;
//             }

//             const blob = new Blob([res.data], {
//                 type:
//                     contentType ||
//                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });

//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;

//             const today = new Date().toISOString().slice(0, 10);
//             link.download = `${pageConfig.apiType}_list_${today}.xlsx`;

//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);

//             toast.success("Excel exported successfully");
//         } catch (err: any) {
//             toast.error(err?.response?.data?.message || "Export failed");
//         } finally {
//             setIsExporting(false);
//         }
//     };

//     const handleDeleteUserWiseRecords = async () => {
//         if (!deleteUserModal) return;
//         if (!visitorEmployeeActionType) {
//             toast.error("Invalid type selected.");
//             return;
//         }
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setDeleteLoadingId(deleteUserModal.user_id);

//             const res = await axios.post(
//                 `${apiUrl}/visitor_followup_delete_by_employee`,
//                 {
//                     admin_id: adminId,
//                     employee_id: deleteUserModal.user_id,
//                     type: visitorEmployeeActionType,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) {
//                 toast.success(res.data?.message || "Records deleted successfully.");

//                 setDeleteUserModal(null);

//                 await fetchData(currentPage);
//                 await fetchListing(selectedUser, selectedDate, listingPage);
//             } else {
//                 toast.error(res.data?.message || "Delete failed");
//             }
//         } catch (err: any) {
//             toast.error(err?.response?.data?.message || "Delete failed");
//         } finally {
//             setDeleteLoadingId(null);
//         }
//     };
//     const handleResetUserWiseRecords = async () => {
//         if (!resetUserModal) return;
//         if (!visitorEmployeeActionType) {
//             toast.error("Invalid type selected.");
//             return;
//         }
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setResetLoadingId(resetUserModal.user_id);

//             const res = await axios.post(
//                 `${apiUrl}/perticular_employee_visitor_recode_reset`,
//                 {
//                     admin_id: adminId,
//                     employee_id: resetUserModal.user_id,
//                     type: visitorEmployeeActionType,
//                     visitor_reset_status: "1",
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) {
//                 toast.success(
//                     res.data?.message || "Visitor reset status updated successfully."
//                 );

//                 setResetUserModal(null);

//                 await fetchData(currentPage);
//                 await fetchListing(selectedUser, selectedDate, listingPage);
//             } else {
//                 toast.error(res.data?.message || "Reset failed");
//             }
//         } catch (err: any) {
//             toast.error(err?.response?.data?.message || "Reset failed");
//         } finally {
//             setResetLoadingId(null);
//         }
//     };

//     const toCamelCase = (text: any) => {
//         if (!text || text === "-") return "-";

//         return String(text)
//             .toLowerCase()
//             .split(" ")
//             .filter(Boolean)
//             .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" ");
//     };
//     return (
//         <div className="min-h-screen bg-[#f3f4f6] p-6">
//             <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
//                 <div className="mb-4 flex items-center justify-between">
//                     <h2 className="text-xl font-bold text-gray-800">
//                         {pageConfig.headerTitle}
//                     </h2>
//                     <div className="rounded-lg bg-[#d47d4c] px-4 py-2 text-sm font-semibold text-white">
//                         Count: {listingCount}
//                     </div>
//                 </div>

//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <div className="max-h-[360px] overflow-y-auto rounded-lg border">
//                         <table className="w-full text-left text-sm">
//                             <thead className="sticky top-0 bg-gray-100">
//                                 <tr>
//                                     <th className="border p-3">Sr. No.</th>
//                                     <th className="border p-3">User Name</th>
//                                     <th className="border p-3">
//                                         Today {formatType(type)} Count
//                                     </th>
//                                     <th className="border p-3">
//                                         Total {formatType(type)} Count
//                                     </th>
//                                     {canShowActionButton && (
//                                         <th className="border p-3">Action</th>
//                                     )}
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {data.length > 0 ? (
//                                     data.map((item, index) => {
//                                         const totalCount = getTotalCount(item);

//                                         return (
//                                             <tr key={item.user_id} className="hover:bg-gray-50">
//                                                 <td className="border p-3">
//                                                     {(currentPage - 1) * 10 + index + 1}
//                                                 </td>
//                                                 <td className="border p-3">{item.user_name}</td>
//                                                 <td className="border p-3 font-semibold text-[#ff7a21]">
//                                                     {getTodayCount(item)}
//                                                 </td>
//                                                 <td className="border p-3 font-semibold text-[#9b5cf6]">
//                                                     {totalCount}
//                                                 </td>

//                                                 {canShowActionButton && (
//                                                     <td className="border p-3">
//                                                         {canShowDeleteButton && (
//                                                             <button
//                                                                 type="button"
//                                                                 disabled={
//                                                                     totalCount === 0 ||
//                                                                     deleteLoadingId === item.user_id
//                                                                 }
//                                                                 onClick={() => setDeleteUserModal(item)}
//                                                                 className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
//                                                             >
//                                                                 {deleteLoadingId === item.user_id
//                                                                     ? "Deleting..."
//                                                                     : "Delete"}
//                                                             </button>
//                                                         )}

//                                                         {canShowResetButton && (
//                                                             <button
//                                                                 type="button"
//                                                                 disabled={
//                                                                     totalCount === 0 ||
//                                                                     getResetFlag(item) === 0 ||
//                                                                     resetLoadingId === item.user_id
//                                                                 }
//                                                                 onClick={() => setResetUserModal(item)}
//                                                                 className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                                                             >
//                                                                 {resetLoadingId === item.user_id
//                                                                     ? "Resetting..."
//                                                                     : "Reset"}
//                                                             </button>
//                                                         )}
//                                                     </td>
//                                                 )}
//                                             </tr>
//                                         );
//                                     })
//                                 ) : (
//                                     <tr>
//                                         <td
//                                             colSpan={canShowActionButton ? 5 : 4}
//                                             className="p-4 text-center text-gray-500"
//                                         >
//                                             No records found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 <div className="mt-6">
//                     <div className="mb-5 flex justify-between gap-3 sm:flex-row">
//                         <div>
//                             <h3 className="mb-3 text-lg font-semibold text-gray-800">
//                                 {pageConfig.listingTitle}
//                             </h3>
//                         </div>

//                         <div className="mb-5 flex flex-col gap-3 sm:flex-row">
//                             <select
//                                 value={selectedUser}
//                                 onChange={(e) => setSelectedUser(e.target.value)}
//                                 className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#d47d4c] focus:ring-2 focus:ring-[#d47d4c] sm:w-72"
//                             >
//                                 <option value="">Select User</option>
//                                 {data.map((user) => (
//                                     <option key={user.user_id} value={user.user_id}>
//                                         {user.user_name}
//                                     </option>
//                                 ))}
//                             </select>

//                             {isTotalPage && (
//                                 <input
//                                     type="date"
//                                     value={selectedDate}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#d47d4c] focus:ring-2 focus:ring-[#d47d4c] sm:w-56"
//                                 />
//                             )}

//                             <button
//                                 onClick={handleSearch}
//                                 disabled={searchLoading}
//                                 className="rounded-lg bg-[#d47d4c] px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-60"
//                             >
//                                 {searchLoading ? "Searching..." : "Search"}
//                             </button>

//                             <button
//                                 onClick={handleExportExcel}
//                                 disabled={isExporting}
//                                 className="rounded-lg bg-[#12a150] px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-60"
//                             >
//                                 {isExporting ? "Exporting..." : "Export Excel"}
//                             </button>
//                         </div>
//                     </div>

//                     <div className="rounded-lg border">
//                         <table className="w-full text-left text-sm">
//                             <thead className="sticky top-0 bg-gray-100">
//                                 <tr>
//                                     <th className="border p-3">Sr. No.</th>
//                                     <th className="border p-3">Name</th>
//                                     <th className="border p-3">Mobile</th>
//                                     <th className="border p-3">Company</th>
//                                     <th className="border p-3">User Name</th>
//                                     <th className="border p-3">Created At</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {searchLoading ? (
//                                     <tr>
//                                         <td
//                                             colSpan={6}
//                                             className="p-4 text-center text-gray-500"
//                                         >
//                                             Loading...
//                                         </td>
//                                     </tr>
//                                 ) : todayList.length > 0 ? (
//                                     todayList.map((item, index) => (
//                                         <tr
//                                             key={item.visitor_followup_id}
//                                             className="hover:bg-gray-50"
//                                         >
//                                             <td className="border p-3">
//                                                 {(listingPage - 1) * 10 + index + 1}
//                                             </td>
//                                             <td className="border p-3">{toCamelCase(item.name)}</td>
//                                             <td className="border p-3">{item.mobileno || "-"}</td>
//                                             <td className="border p-3">
//                                                 {item.companyname || "-"}
//                                             </td>
//                                             <td className="border p-3">
//                                                 {item.followup_username || "-"}
//                                             </td>
//                                             <td className="border p-3">
//                                                 {item.created_at || "-"}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td
//                                             colSpan={6}
//                                             className="p-4 text-center text-gray-500"
//                                         >
//                                             No records found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                         <p className="text-sm font-medium text-gray-700">
//                             Page {listingPage} of {listingLastPage}
//                         </p>

//                         <div className="flex flex-wrap items-center gap-2">
//                             <button
//                                 type="button"
//                                 onClick={() => handleListingPageChange(listingPage - 1)}
//                                 disabled={listingPage === 1 || searchLoading}
//                                 className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
//                             >
//                                 Prev
//                             </button>

//                             {renderListingPaginationButtons()}

//                             <button
//                                 type="button"
//                                 onClick={() => handleListingPageChange(listingPage + 1)}
//                                 disabled={listingPage === listingLastPage || searchLoading}
//                                 className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {deleteUserModal && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//                     <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
//                         <h3 className="text-lg font-bold text-gray-900">
//                             Are you sure?
//                         </h3>

//                         <p className="mt-3 text-sm leading-6 text-gray-600">
//                             Do you want to delete all{" "}
//                             <span className="font-semibold text-red-600">
//                                 {formatType(type)}
//                             </span>{" "}
//                             records for{" "}
//                             <span className="font-semibold text-gray-900">
//                                 {deleteUserModal.user_name}
//                             </span>
//                             ?
//                         </p>



//                         <div className="mt-6 flex justify-end gap-3">
//                             <button
//                                 type="button"
//                                 onClick={() => setDeleteUserModal(null)}
//                                 disabled={deleteLoadingId === deleteUserModal.user_id}
//                                 className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={handleDeleteUserWiseRecords}
//                                 disabled={deleteLoadingId === deleteUserModal.user_id}
//                                 className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
//                             >
//                                 {deleteLoadingId === deleteUserModal.user_id
//                                     ? "Deleting..."
//                                     : "Yes, Delete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {resetUserModal && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//                     <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
//                         <h3 className="text-lg font-bold text-gray-900">
//                             Are you sure?
//                         </h3>

//                         <p className="mt-3 text-sm leading-6 text-gray-600">
//                             Do you want to reset{" "}
//                             <span className="font-semibold text-blue-600">
//                                 {formatType(type)}
//                             </span>{" "}
//                             records for{" "}
//                             <span className="font-semibold text-gray-900">
//                                 {resetUserModal.user_name}
//                             </span>
//                             ?
//                         </p>

//                         <p className="mt-2 text-xs font-medium text-blue-500">
//                             This will update visitor reset status for this employee.
//                         </p>

//                         <div className="mt-6 flex justify-end gap-3">
//                             <button
//                                 type="button"
//                                 onClick={() => setResetUserModal(null)}
//                                 disabled={resetLoadingId === resetUserModal.user_id}
//                                 className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={handleResetUserWiseRecords}
//                                 disabled={resetLoadingId === resetUserModal.user_id}
//                                 className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//                             >
//                                 {resetLoadingId === resetUserModal.user_id
//                                     ? "Resetting..."
//                                     : "Yes, Reset"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CallingList;
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

    today_busy_now_callback?: number;
    total_busy_now_callback?: number;
    busy_now_callback_reset_flag?: number;
    today_business_changed?: number;
    total_business_changed?: number;

    today_information_passed?: number;
    total_information_passed?: number;
    information_passed_reset_flag?: number;

    today_not_interested?: number;
    total_not_interested?: number;
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

type AdminTodayRegisterListResponse = {
    success: boolean;
    message: string;
    type?: string;
    count?: number;
    current_page?: number;
    last_page?: number;
    data: TodayRegisterItem[];
};


type ResetHistoryItem = {
    id: number;
    employee_id: number;
    type: number;
    type_name: string;
    visitor_call_ids: string;
    entry_date: string;
    created_at: string;
    updated_at: string;
};

type EmployeeResetHistoryResponse = {
    success: boolean;
    message: string;
    data?: {
        employee_id: number;
        employee_name: string;
        type: string;
        type_name: string;
        history: ResetHistoryItem[];
    };
    pagination?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
    };
};

const CallingList = () => {
    const navigate = useNavigate();
    const { type, subtype } = useParams();

    const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
    const [deleteUserModal, setDeleteUserModal] = useState<UserData | null>(null);

    const [resetLoadingId, setResetLoadingId] = useState<number | null>(null);
    const [resetUserModal, setResetUserModal] = useState<UserData | null>(null);

    const [historyUserModal, setHistoryUserModal] = useState<UserData | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [resetHistory, setResetHistory] = useState<ResetHistoryItem[]>([]);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyLastPage, setHistoryLastPage] = useState(1);
    const [historyTotal, setHistoryTotal] = useState(0);
    const [historyInfo, setHistoryInfo] = useState<{
        employee_name?: string;
        type_name?: string;
    }>({});

    const [isExporting, setIsExporting] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [todayList, setTodayList] = useState<TodayRegisterItem[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<UserData[]>([]);

    const [listingCount, setListingCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);

    const [listingPage, setListingPage] = useState(1);
    const [listingLastPage, setListingLastPage] = useState(1);

    const isTotalPage = subtype === "total";

    const pageConfig = useMemo(() => {
        const config = {
            register: {
                headerTitle: isTotalPage ? "Total Register List" : "Today Register List",
                listingTitle: isTotalPage ? "Total Register Listing" : "Today Register Listing",
                apiType: isTotalPage ? "Totalregister" : "Todayregister",
                todayKey: "today_register_count",
                totalKey: "total_register_count",
            },
            "wrong-number": {
                headerTitle: isTotalPage ? "Total Wrong Number List" : "Today Wrong Number List",
                listingTitle: isTotalPage ? "Total Wrong Number Listing" : "Today Wrong Number Listing",
                apiType: isTotalPage ? "TotalWrongNumber" : "TodayWrongNumber",
                todayKey: "today_wrong_number",
                totalKey: "total_wrong_number",
            },
            "busy-now-callback": {
                headerTitle: isTotalPage
                    ? "Total Busy Now Callback List"
                    : "Today Busy Now Callback List",
                listingTitle: isTotalPage
                    ? "Total Busy Now Callback Listing"
                    : "Today Busy Now Callback Listing",
                apiType: isTotalPage ? "TotalBusyNowCallback" : "TodayBusyNowCallback",
                todayKey: "today_busy_now_callback",
                totalKey: "total_busy_now_callback",
                resetFlagKey: "busy_now_callback_reset_flag",
            },
            "business-changed": {
                headerTitle: isTotalPage
                    ? "Total Business Changed List"
                    : "Today Business Changed List",
                listingTitle: isTotalPage
                    ? "Total Business Changed Listing"
                    : "Today Business Changed Listing",
                apiType: isTotalPage ? "TotalBusinessChanged" : "TodayBusinessChanged",
                todayKey: "today_business_changed",
                totalKey: "total_business_changed",
            },
            "information-passed": {
                headerTitle: isTotalPage
                    ? "Total Information Passed List"
                    : "Today Information Passed List",
                listingTitle: isTotalPage
                    ? "Total Information Passed Listing"
                    : "Today Information Passed Listing",
                apiType: isTotalPage ? "TotalInformationPassed" : "TodayInformationPassed",
                todayKey: "today_information_passed",
                totalKey: "total_information_passed",
                resetFlagKey: "information_passed_reset_flag",
            },
            "not-interested": {
                headerTitle: isTotalPage
                    ? "Total Not Interested List"
                    : "Today Not Interested List",
                listingTitle: isTotalPage
                    ? "Total Not Interested Listing"
                    : "Today Not Interested Listing",
                apiType: isTotalPage ? "TotalNotInterested" : "TodayNotInterested",
                todayKey: "today_not_interested",
                totalKey: "total_not_interested",
            },
        };

        return config[(type as keyof typeof config) || "register"] || config.register;
    }, [type, isTotalPage]);

    const canShowDeleteButton =
        type === "wrong-number" || type === "business-changed";

    const canShowResetButton =
        type === "busy-now-callback" || type === "information-passed";

    const canShowActionButton = canShowDeleteButton || canShowResetButton;

    const visitorEmployeeActionType = useMemo(() => {
        const typeMap: Record<string, string> = {
            register: "1",
            "wrong-number": "2",
            "busy-now-callback": "3",
            "business-changed": "4",
            "information-passed": "5",
            "not-interested": "6",
        };

        return typeMap[type || ""] || "";
    }, [type]);

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
                setCurrentPage(Number(res.data.current_page || page || 1));
            } else {
                setData([]);
                setCurrentPage(1);
                toast.error(res.data?.message || "Failed to fetch data");
            }
        } catch (err: any) {
            console.error(err);
            setData([]);
            setCurrentPage(1);
            toast.error(err?.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchListing = async (
        userId?: string,
        dateValue?: string,
        page: number = 1
    ) => {
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

            const res = await axios.post<AdminTodayRegisterListResponse>(
                `${apiUrl}/AdminTodayRegisterList`,
                {
                    admin_id: adminId,
                    followup_user_id: finalUserId,
                    type: pageConfig.apiType,
                    fromdate: isTotalPage ? finalDate : "",
                    todate: isTotalPage ? finalDate : "",
                    page: page,
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
                setListingCount(Number(res.data.count || 0));
                setListingPage(Number(res.data.current_page || page || 1));
                setListingLastPage(Number(res.data.last_page || 1));
            } else {
                setTodayList([]);
                setListingCount(0);
                setListingPage(1);
                setListingLastPage(1);
                toast.error(res.data?.message || "No data found");
            }
        } catch (err: any) {
            console.error(err);
            setTodayList([]);
            setListingCount(0);
            setListingPage(1);
            setListingLastPage(1);
            toast.error(err?.response?.data?.message || "Search failed");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearch = async () => {
        setListingPage(1);
        await fetchListing(selectedUser, selectedDate, 1);
    };

    const handleListingPageChange = (page: number) => {
        if (page < 1 || page > listingLastPage || page === listingPage) return;
        fetchListing(selectedUser, selectedDate, page);
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    useEffect(() => {
        setSelectedUser("");
        setSelectedDate("");
        setListingPage(1);
        fetchListing("", "", 1);
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

    const renderListingPaginationButtons = () => {
        const buttons: (number | string)[] = [];

        if (listingLastPage <= 7) {
            for (let i = 1; i <= listingLastPage; i++) {
                buttons.push(i);
            }
        } else {
            buttons.push(1);

            if (listingPage > 3) {
                buttons.push("...");
            }

            const start = Math.max(2, listingPage - 1);
            const end = Math.min(listingLastPage - 1, listingPage + 1);

            for (let i = start; i <= end; i++) {
                buttons.push(i);
            }

            if (listingPage < listingLastPage - 2) {
                buttons.push("...");
            }

            buttons.push(listingLastPage);
        }

        return buttons.map((item, index) =>
            item === "..." ? (
                <span
                    key={`listing-dots-${index}`}
                    className="px-2 py-1 text-sm font-medium text-gray-500"
                >
                    ...
                </span>
            ) : (
                <button
                    key={item}
                    type="button"
                    onClick={() => handleListingPageChange(Number(item))}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${listingPage === item
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

    const handleDeleteUserWiseRecords = async () => {
        if (!deleteUserModal) return;
        if (!visitorEmployeeActionType) {
            toast.error("Invalid type selected.");
            return;
        }
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setDeleteLoadingId(deleteUserModal.user_id);

            const res = await axios.post(
                `${apiUrl}/visitor_followup_delete_by_employee`,
                {
                    admin_id: adminId,
                    employee_id: deleteUserModal.user_id,
                    type: visitorEmployeeActionType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                toast.success(res.data?.message || "Records deleted successfully.");

                setDeleteUserModal(null);

                await fetchData(currentPage);
                await fetchListing(selectedUser, selectedDate, listingPage);
            } else {
                toast.error(res.data?.message || "Delete failed");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Delete failed");
        } finally {
            setDeleteLoadingId(null);
        }
    };
    const fetchResetHistory = async (employee: UserData, page: number = 1) => {
        if (!visitorEmployeeActionType) {
            toast.error("Invalid type selected.");
            return;
        }

        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setHistoryLoading(true);

            const res = await axios.post<EmployeeResetHistoryResponse>(
                `${apiUrl}/EmployeeResetHistory`,
                {
                    admin_id: adminId,
                    employee_id: employee.user_id,
                    type: visitorEmployeeActionType,
                    page,
                    per_page: 10,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                setResetHistory(res.data.data?.history || []);
                setHistoryInfo({
                    employee_name: res.data.data?.employee_name || employee.user_name,
                    type_name: res.data.data?.type_name || formatType(type),
                });
                setHistoryPage(Number(res.data.pagination?.current_page || page || 1));
                setHistoryLastPage(Number(res.data.pagination?.last_page || 1));
                setHistoryTotal(Number(res.data.pagination?.total || 0));
            } else {
                setResetHistory([]);
                setHistoryPage(1);
                setHistoryLastPage(1);
                setHistoryTotal(0);
                setHistoryInfo({
                    employee_name: employee.user_name,
                    type_name: formatType(type),
                });
                toast.error(res.data?.message || "History not found");
            }
        } catch (err: any) {
            setResetHistory([]);
            setHistoryPage(1);
            setHistoryLastPage(1);
            setHistoryTotal(0);
            setHistoryInfo({
                employee_name: employee.user_name,
                type_name: formatType(type),
            });
            toast.error(err?.response?.data?.message || "Failed to fetch reset history");
        } finally {
            setHistoryLoading(false);
        }
    };

    const openResetHistoryModal = async (employee: UserData) => {
        setHistoryUserModal(employee);
        setResetHistory([]);
        setHistoryPage(1);
        setHistoryLastPage(1);
        setHistoryTotal(0);
        await fetchResetHistory(employee, 1);
    };

    const handleHistoryPageChange = (page: number) => {
        if (
            !historyUserModal ||
            page < 1 ||
            page > historyLastPage ||
            page === historyPage ||
            historyLoading
        ) {
            return;
        }

        fetchResetHistory(historyUserModal, page);
    };

    const handleResetUserWiseRecords = async () => {
        if (!resetUserModal) return;
        if (!visitorEmployeeActionType) {
            toast.error("Invalid type selected.");
            return;
        }
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setResetLoadingId(resetUserModal.user_id);

            const res = await axios.post(
                `${apiUrl}/perticular_employee_visitor_recode_reset`,
                {
                    admin_id: adminId,
                    employee_id: resetUserModal.user_id,
                    type: visitorEmployeeActionType,
                    visitor_reset_status: "1",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data?.success) {
                toast.success(
                    res.data?.message || "Visitor reset status updated successfully."
                );

                setResetUserModal(null);

                await fetchData(currentPage);
                await fetchListing(selectedUser, selectedDate, listingPage);
            } else {
                toast.error(res.data?.message || "Reset failed");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Reset failed");
        } finally {
            setResetLoadingId(null);
        }
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
        <div className="min-h-screen bg-[#f3f4f6] p-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {pageConfig.headerTitle}
                    </h2>
                    <div className="rounded-lg bg-[#d47d4c] px-4 py-2 text-sm font-semibold text-white">
                        Count: {listingCount}
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
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
                                    {canShowActionButton && (
                                        <th className="border p-3">Action</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, index) => {
                                        const totalCount = getTotalCount(item);

                                        return (
                                            <tr key={item.user_id} className="hover:bg-gray-50">
                                                <td className="border p-3">
                                                    {(currentPage - 1) * 10 + index + 1}
                                                </td>
                                                <td className="border p-3">{item.user_name}</td>
                                                <td className="border p-3 font-semibold text-[#ff7a21]">
                                                    {getTodayCount(item)}
                                                </td>
                                                <td className="border p-3 font-semibold text-[#9b5cf6]">
                                                    {totalCount}
                                                </td>

                                                {canShowActionButton && (
                                                    <td className="border p-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {canShowDeleteButton && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        totalCount === 0 ||
                                                                        deleteLoadingId === item.user_id
                                                                    }
                                                                    onClick={() => setDeleteUserModal(item)}
                                                                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {deleteLoadingId === item.user_id
                                                                        ? "Deleting..."
                                                                        : "Delete"}
                                                                </button>
                                                            )}

                                                            {canShowResetButton && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        disabled={resetLoadingId === item.user_id}
                                                                        onClick={() => setResetUserModal(item)}
                                                                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >
                                                                        {resetLoadingId === item.user_id
                                                                            ? "Resetting..."
                                                                            : "Reset"}
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openResetHistoryModal(item)}
                                                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                                                                        title="View Reset History"
                                                                    >
                                                                        👁
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canShowActionButton ? 5 : 4}
                                            className="p-4 text-center text-gray-500"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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

                    <div className="rounded-lg border">
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
                                        <td
                                            colSpan={6}
                                            className="p-4 text-center text-gray-500"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : todayList.length > 0 ? (
                                    todayList.map((item, index) => (
                                        <tr
                                            key={item.visitor_followup_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border p-3">
                                                {(listingPage - 1) * 10 + index + 1}
                                            </td>
                                            <td className="border p-3">{toCamelCase(item.name)}</td>
                                            <td className="border p-3">{item.mobileno || "-"}</td>
                                            <td className="border p-3">
                                                {item.companyname || "-"}
                                            </td>
                                            <td className="border p-3">
                                                {item.followup_username || "-"}
                                            </td>
                                            <td className="border p-3">
                                                {item.created_at || "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-4 text-center text-gray-500"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm font-medium text-gray-700">
                            Page {listingPage} of {listingLastPage}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleListingPageChange(listingPage - 1)}
                                disabled={listingPage === 1 || searchLoading}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {renderListingPaginationButtons()}

                            <button
                                type="button"
                                onClick={() => handleListingPageChange(listingPage + 1)}
                                disabled={listingPage === listingLastPage || searchLoading}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {deleteUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">
                            Are you sure?
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Do you want to delete all{" "}
                            <span className="font-semibold text-red-600">
                                {formatType(type)}
                            </span>{" "}
                            records for{" "}
                            <span className="font-semibold text-gray-900">
                                {deleteUserModal.user_name}
                            </span>
                            ?
                        </p>



                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteUserModal(null)}
                                disabled={deleteLoadingId === deleteUserModal.user_id}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteUserWiseRecords}
                                disabled={deleteLoadingId === deleteUserModal.user_id}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleteLoadingId === deleteUserModal.user_id
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {resetUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900">
                            Are you sure?
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Do you want to reset{" "}
                            <span className="font-semibold text-blue-600">
                                {formatType(type)}
                            </span>{" "}
                            records for{" "}
                            <span className="font-semibold text-gray-900">
                                {resetUserModal.user_name}
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-xs font-medium text-blue-500">
                            This will update visitor reset status for this employee.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setResetUserModal(null)}
                                disabled={resetLoadingId === resetUserModal.user_id}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleResetUserWiseRecords}
                                disabled={resetLoadingId === resetUserModal.user_id}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {resetLoadingId === resetUserModal.user_id
                                    ? "Resetting..."
                                    : "Yes, Reset"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {historyUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Reset History
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Employee:{" "}
                                    <span className="font-semibold text-gray-900">
                                        {historyInfo.employee_name || historyUserModal.user_name}
                                    </span>{" "}

                                    | Total:{" "}
                                    <span className="font-semibold text-gray-900">
                                        {historyTotal}
                                    </span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setHistoryUserModal(null)}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="max-h-[420px] overflow-auto rounded-lg border">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        <th className="border p-3">Sr. No.</th>
                                        <th className="border p-3">Type</th>
                                        <th className="border p-3">Last Reset Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {historyLoading ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-4 text-center text-gray-500"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : resetHistory.length > 0 ? (
                                        resetHistory.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="border p-3">
                                                    {(historyPage - 1) * 10 + index + 1}
                                                </td>
                                                <td className="border p-3">
                                                    {item.type_name || "-"}
                                                </td>

                                                <td className="border p-3">
                                                    {item.entry_date || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-4 text-center text-gray-500"
                                            >
                                                No reset history found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-gray-700">
                                Page {historyPage} of {historyLastPage}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleHistoryPageChange(historyPage - 1)}
                                    disabled={historyPage === 1 || historyLoading}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleHistoryPageChange(historyPage + 1)}
                                    disabled={historyPage === historyLastPage || historyLoading}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallingList;