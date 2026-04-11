// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// type UserData = {
//     user_id: number;
//     user_name: string;
//     mobile: string;
//     total_register_count: number;
//     today_register_count: number;
// };

// type TodayRegisterItem = {
//     visitor_followup_id: number;
//     visitor_id: number;
//     followup_user_id: number;
//     created_at: string;
//     name: string;
//     companyname: string | null;
//     mobileno: string;
//     followup_username: string;
// };

// const CallingList = () => {
//     const navigate = useNavigate();
//     const { type } = useParams();

//     const [selectedUser, setSelectedUser] = useState("");
//     const [todayList, setTodayList] = useState<TodayRegisterItem[]>([]);
//     const [searchLoading, setSearchLoading] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [data, setData] = useState<UserData[]>([]);

//     const getRegisterType = () => {
//         return type === "today" ? "Todayregister" : "Totalregister";
//     };

//     const fetchData = async () => {
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/AdminRegisterList`,
//                 {
//                     admin_id: adminId,
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
//             } else {
//                 toast.error(res.data?.message || "Failed to fetch data");
//             }
//         } catch (err: any) {
//             console.error(err);
//             toast.error(err?.response?.data?.message || "Failed to fetch data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchListing = async (userId?: string) => {
//         const adminId = localStorage.getItem("admin_id");
//         const token = localStorage.getItem("artoken");

//         if (!adminId || !token) {
//             toast.error("Session expired. Please login again.");
//             navigate("/");
//             return;
//         }

//         try {
//             setSearchLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/AdminTodayRegisterList`,
//                 {
//                     admin_id: adminId,
//                     followup_user_id: userId || selectedUser || "",
//                     type: getRegisterType(),
//                     date: "",
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
//             } else {
//                 setTodayList([]);
//                 toast.error(res.data?.message || "No data found");
//             }
//         } catch (err: any) {
//             console.error(err);
//             setTodayList([]);
//             toast.error(err?.response?.data?.message || "Search failed");
//         } finally {
//             setSearchLoading(false);
//         }
//     };

//     const handleSearch = async () => {
//         await fetchListing();
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     useEffect(() => {
//         fetchListing(selectedUser);
//     }, [type]);

//     return (
//         <div className="min-h-screen bg-[#f3f4f6] p-6">
//             <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
//                 <div className="mb-4">
//                     <h2 className="text-xl font-bold text-gray-800">
//                         {type === "today" ? "Today Register List" : "Total Register List"}
//                     </h2>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3 mb-5">
//                     <select
//                         value={selectedUser}
//                         onChange={(e) => setSelectedUser(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 outline-none focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c]"
//                     >
//                         <option value="">Select User</option>
//                         {data.map((user) => (
//                             <option key={user.user_id} value={user.user_id}>
//                                 {user.user_name}
//                             </option>
//                         ))}
//                     </select>

//                     <button
//                         onClick={handleSearch}
//                         disabled={searchLoading}
//                         className="bg-[#d47d4c] text-white px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//                     >
//                         {searchLoading ? "Searching..." : "Search"}
//                     </button>
//                 </div>

//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : (
//                     <div className="overflow-y-auto max-h-[360px] border rounded-lg">
//                         <table className="w-full text-sm text-left">
//                             <thead className="bg-gray-100 sticky top-0">
//                                 <tr>
//                                     <th className="p-3 border">Sr. No.</th>
//                                     <th className="p-3 border">User Name</th>
//                                     <th className="p-3 border">Today Count</th>
//                                     <th className="p-3 border">Total Count</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {data.length > 0 ? (
//                                     data.map((item, index) => (
//                                         <tr key={item.user_id} className="hover:bg-gray-50">
//                                             <td className="p-3 border">{index + 1}</td>
//                                             <td className="p-3 border">{item.user_name}</td>
//                                             <td className="p-3 border text-[#ff7a21] font-semibold">
//                                                 {item.today_register_count}
//                                             </td>
//                                             <td className="p-3 border text-[#9b5cf6] font-semibold">
//                                                 {item.total_register_count}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={4} className="p-4 text-center text-gray-500">
//                                             No records found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 <div className="mt-6">
//                     <h3 className="text-lg font-semibold mb-3 text-gray-800">
//                         {type === "today" ? "Today Register Listing" : "Total Register Listing"}
//                     </h3>

//                     <div className="overflow-y-auto max-h-[300px] border rounded-lg">
//                         <table className="w-full text-sm text-left">
//                             <thead className="bg-gray-100 sticky top-0">
//                                 <tr>
//                                     <th className="p-3 border">Sr. No.</th>
//                                     <th className="p-3 border">Name</th>
//                                     <th className="p-3 border">Mobile</th>
//                                     <th className="p-3 border">Company</th>
//                                     <th className="p-3 border">User Name</th>
//                                     <th className="p-3 border">Created At</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {searchLoading ? (
//                                     <tr>
//                                         <td colSpan={6} className="p-4 text-center text-gray-500">
//                                             Loading...
//                                         </td>
//                                     </tr>
//                                 ) : todayList.length > 0 ? (
//                                     todayList.map((item, index) => (
//                                         <tr
//                                             key={item.visitor_followup_id}
//                                             className="hover:bg-gray-50"
//                                         >
//                                             <td className="p-3 border">{index + 1}</td>
//                                             <td className="p-3 border">{item.name || "-"}</td>
//                                             <td className="p-3 border">{item.mobileno || "-"}</td>
//                                             <td className="p-3 border">{item.companyname || "-"}</td>
//                                             <td className="p-3 border">
//                                                 {item.followup_username || "-"}
//                                             </td>
//                                             <td className="p-3 border">{item.created_at || "-"}</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={6} className="p-4 text-center text-gray-500">
//                                             No records found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CallingList;

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config";

type UserData = {
    user_id: number;
    user_name: string;
    mobile: string;
    total_register_count: number;
    today_register_count: number;
};

type TodayRegisterItem = {
    visitor_followup_id: number;
    visitor_id: number;
    followup_user_id: number;
    created_at: string;
    name: string;
    companyname: string | null;
    mobileno: string;
    followup_username: string;
};

const CallingList = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [todayList, setTodayList] = useState<TodayRegisterItem[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<UserData[]>([]);

    const getRegisterType = () => {
        return type === "today" ? "Todayregister" : "Totalregister";
    };

    const isTotalPage = type === "total";

    const fetchData = async () => {
        const adminId = localStorage.getItem("admin_id");
        const token = localStorage.getItem("artoken");

        if (!adminId || !token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${apiUrl}/AdminRegisterList`,
                {
                    admin_id: adminId,
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
            } else {
                toast.error(res.data?.message || "Failed to fetch data");
            }
        } catch (err: any) {
            console.error(err);
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

            const res = await axios.post(
                `${apiUrl}/AdminTodayRegisterList`,
                {
                    admin_id: adminId,
                    followup_user_id: userId ?? selectedUser ?? "",
                    type: getRegisterType(),
                    date: isTotalPage ? dateValue ?? selectedDate ?? "" : "",
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
        if (isTotalPage && !selectedDate) {
            toast.error("Please select date");
            return;
        }

        await fetchListing();
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setSelectedDate("");
        fetchListing(selectedUser, "");
    }, [type]);

    return (
        <div className="min-h-screen bg-[#f3f4f6] p-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {type === "today" ? "Today Register List" : "Total Register List"}
                    </h2>
                </div>



                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-y-auto max-h-[360px] border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-3 border">Sr. No.</th>
                                    <th className="p-3 border">User Name</th>
                                    <th className="p-3 border">Today Count</th>
                                    <th className="p-3 border">Total Count</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={item.user_id} className="hover:bg-gray-50">
                                            <td className="p-3 border">{index + 1}</td>
                                            <td className="p-3 border">{item.user_name}</td>
                                            <td className="p-3 border text-[#ff7a21] font-semibold">
                                                {item.today_register_count}
                                            </td>
                                            <td className="p-3 border text-[#9b5cf6] font-semibold">
                                                {item.total_register_count}
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
                )}

                <div className="mt-6">

                    <div className="flex justify-between sm:flex-row gap-3 mb-5">
                        <div>

                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                {type === "today" ? "Today Register Listing" : "Total Register Listing"}
                            </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">


                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 outline-none focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c]"
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
                                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-56 outline-none focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c]"
                                />
                            )}

                            <button
                                onClick={handleSearch}
                                disabled={searchLoading}
                                className="bg-[#d47d4c] text-white px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                            >
                                {searchLoading ? "Searching..." : "Search"}
                            </button>
                        </div>

                    </div>
                    <div className="overflow-y-auto max-h-[300px] border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-3 border">Sr. No.</th>
                                    <th className="p-3 border">Name</th>
                                    <th className="p-3 border">Mobile</th>
                                    <th className="p-3 border">Company</th>
                                    <th className="p-3 border">User Name</th>
                                    <th className="p-3 border">Created At</th>
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
                                        <tr
                                            key={item.visitor_followup_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-3 border">{index + 1}</td>
                                            <td className="p-3 border">{item.name || "-"}</td>
                                            <td className="p-3 border">{item.mobileno || "-"}</td>
                                            <td className="p-3 border">{item.companyname || "-"}</td>
                                            <td className="p-3 border">
                                                {item.followup_username || "-"}
                                            </td>
                                            <td className="p-3 border">{item.created_at || "-"}</td>
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
            </div>
        </div>
    );
};

export default CallingList;