// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { Link, useParams } from "react-router-dom";
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
//     if (data.errors && typeof data.errors === "object") {
//         const msgs: string[] = [];
//         Object.values(data.errors).forEach((v: any) => {
//             if (Array.isArray(v)) msgs.push(...v.map(String));
//             else if (typeof v === "string") msgs.push(v);
//         });
//         if (msgs.length) return msgs.join(" | ");
//     }
//     return fallback;
// }

// function n(v: any) {
//     const x = Number(v);
//     return Number.isFinite(x) ? x : 0;
// }

// type UserWiseItem = {
//     user_id: number;
//     name: string;
//     count: number;
// };

// type UserWiseApi = {
//     success: boolean;
//     data: {
//         visitor_user_wise: UserWiseItem[];
//     };
//     message?: string;
// };

// type Theme = {
//     strip: string;
//     ring: string;
//     badge: string;
//     avatar: string;
// };

// const THEMES: Theme[] = [
//     {
//         strip: "bg-orange-500",
//         ring: "hover:ring-orange-500/30",
//         badge: "bg-orange-100 text-orange-700",
//         avatar: "bg-orange-500",
//     },
//     {
//         strip: "bg-blue-500",
//         ring: "hover:ring-blue-500/30",
//         badge: "bg-blue-100 text-blue-700",
//         avatar: "bg-blue-500",
//     },
//     {
//         strip: "bg-green-500",
//         ring: "hover:ring-green-500/30",
//         badge: "bg-green-100 text-green-700",
//         avatar: "bg-green-500",
//     },
//     {
//         strip: "bg-indigo-500",
//         ring: "hover:ring-indigo-500/30",
//         badge: "bg-indigo-100 text-indigo-700",
//         avatar: "bg-indigo-500",
//     },
//     {
//         strip: "bg-red-500",
//         ring: "hover:ring-red-500/30",
//         badge: "bg-red-100 text-red-700",
//         avatar: "bg-red-500",
//     },
//     {
//         strip: "bg-purple-500",
//         ring: "hover:ring-purple-500/30",
//         badge: "bg-purple-100 text-purple-700",
//         avatar: "bg-purple-500",
//     },
//     {
//         strip: "bg-pink-500",
//         ring: "hover:ring-pink-500/30",
//         badge: "bg-pink-100 text-pink-700",
//         avatar: "bg-pink-500",
//     },
//     {
//         strip: "bg-teal-500",
//         ring: "hover:ring-teal-500/30",
//         badge: "bg-teal-100 text-teal-700",
//         avatar: "bg-teal-500",
//     },
// ];

// const titleMap: Record<string, string> = {
//     TotalVisitor: "Total Visitor - User Wise",
//     TodaysVisitor: "Today's Visitor - User Wise",
//     TotalExhibitor: "Total Exhibitor - User Wise",
//     TodaysExhibitor: "Today's Exhibitor - User Wise",
//     TotalExpectedExhibitor: "Total Expected Exhibitor - User Wise",
//     TodaysExpectedExhibitor: "Today's Expected Exhibitor - User Wise",
// };

// export default function UserWiseCountPage() {
//     const { type } = useParams<{ type: string }>();
//     const [loading, setLoading] = useState(false);
//     const [users, setUsers] = useState<UserWiseItem[]>([]);

//     const pageTitle = useMemo(() => {
//         return titleMap[type || ""] || "User Wise Count";
//     }, [type]);

//     const fetchUserWiseCounts = async () => {
//         if (!type) return;

//         try {
//             setLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/adminVisitorCountUserWise`,
//                 { userCountFor: type },
//                 { headers: { ...authHeaders() } }
//             );

//             const payload = res.data as UserWiseApi;

//             if (!payload?.success) {
//                 toast.error(payload?.message || "Failed to load user wise data");
//                 setUsers([]);
//                 return;
//             }

//             setUsers(payload?.data?.visitor_user_wise || []);
//         } catch (err: any) {
//             toast.error(getApiErrorMessage(err, "Failed to load user wise data"));
//             setUsers([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserWiseCounts();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [type]);

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between gap-3">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     <Link
//                         to="/admin"
//                         className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
//                     >
//                         Back
//                     </Link>
//                 </div>
//             </div>

//             {/* Summary */}

//                 <div className="flex  items-center justify-between gap-4">

//                     <div>
//                         <p className="text-sm text-gray-500">Total Users</p>
//                         <h2 className="text-2xl font-bold text-gray-800">{users.length}</h2>
//                     </div>

//                     <div>
//                         <p className="text-sm text-gray-500">Total Count</p>
//                         <h2 className="text-2xl font-bold text-gray-800">
//                             {users.reduce((sum, item) => sum + n(item.count), 0)}
//                         </h2>
//                     </div>
//                 </div>

//             {/* Cards */}
//             {loading ? (
//                 <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
//                     Loading...
//                 </div>
//             ) : users.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
//                     No user wise data found
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {users.map((u, index) => {
//                         const theme = THEMES[index % THEMES.length];
//                         const initial = (u.name || "U").charAt(0).toUpperCase();

//                         return (
//                             <div
//                                 key={u.user_id}
//                                 className={`relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden ring-1 ring-transparent ${theme.ring} hover:shadow-xl transition-all duration-300 flex`}
//                             >
//                                 {/* left strip */}
//                                 <div className={`w-2 min-h-full ${theme.strip}`} />

//                                 <div className="flex-1 p-6">
//                                     <div className="flex items-start justify-between gap-3">
//                                         <div className="flex items-center gap-4">
//                                             <div
//                                                 className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow ${theme.avatar}`}
//                                             >
//                                                 {initial}
//                                             </div>

//                                             <div>
//                                                 <p className="text-sm text-gray-500">User Name</p>
//                                                 <h3 className="text-lg font-semibold text-gray-800">
//                                                     {u.name || "-"}
//                                                 </h3>
//                                             </div>
//                                         </div>

//                                         <span
//                                             className={`px-3 py-1 rounded-md text-xs font-semibold ${theme.badge}`}
//                                         >
//                                             <h2 className="text-4xl font-bold text-gray-900 mt-1">
//                                                 {n(u.count)}
//                                             </h2>
//                                         </span>
//                                     </div>


//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }


import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

function authHeaders() {
    const token = localStorage.getItem("usertoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function getApiErrorMessage(err: any, fallback = "Something went wrong") {
    const data = err?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && typeof data.errors === "object") {
        const msgs: string[] = [];
        Object.values(data.errors).forEach((v: any) => {
            if (Array.isArray(v)) msgs.push(...v.map(String));
            else if (typeof v === "string") msgs.push(v);
        });
        if (msgs.length) return msgs.join(" | ");
    }
    return fallback;
}

function n(v: any) {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
}

type UserWiseItem = {
    user_id: number;
    name: string;
    count: number;
};

type UserWiseApi = {
    success: boolean;
    data: {
        visitor_user_wise: UserWiseItem[];
    };
    message?: string;
};

type Theme = {
    strip: string;
    ring: string;
    badge: string;
    avatar: string;
};

const THEMES: Theme[] = [
    {
        strip: "bg-orange-500",
        ring: "hover:ring-orange-500/30",
        badge: "bg-orange-100 text-orange-700",
        avatar: "bg-orange-500",
    },
    {
        strip: "bg-blue-500",
        ring: "hover:ring-blue-500/30",
        badge: "bg-blue-100 text-blue-700",
        avatar: "bg-blue-500",
    },
    {
        strip: "bg-green-500",
        ring: "hover:ring-green-500/30",
        badge: "bg-green-100 text-green-700",
        avatar: "bg-green-500",
    },
    {
        strip: "bg-indigo-500",
        ring: "hover:ring-indigo-500/30",
        badge: "bg-indigo-100 text-indigo-700",
        avatar: "bg-indigo-500",
    },
    {
        strip: "bg-red-500",
        ring: "hover:ring-red-500/30",
        badge: "bg-red-100 text-red-700",
        avatar: "bg-red-500",
    },
    {
        strip: "bg-purple-500",
        ring: "hover:ring-purple-500/30",
        badge: "bg-purple-100 text-purple-700",
        avatar: "bg-purple-500",
    },
    {
        strip: "bg-pink-500",
        ring: "hover:ring-pink-500/30",
        badge: "bg-pink-100 text-pink-700",
        avatar: "bg-pink-500",
    },
    {
        strip: "bg-teal-500",
        ring: "hover:ring-teal-500/30",
        badge: "bg-teal-100 text-teal-700",
        avatar: "bg-teal-500",
    },
];

const titleMap: Record<string, string> = {
    TotalVisitor: "Total Visitor - User Wise",
    TodaysVisitor: "Today's Visitor - User Wise",
    TotalExhibitor: "Total Exhibitor - User Wise",
    TodaysExhibitor: "Today's Exhibitor - User Wise",
    TotalExpectedExhibitor: "Total Expected Exhibitor - User Wise",
    TodaysExpectedExhibitor: "Today's Expected Exhibitor - User Wise",
};

export default function UserWiseCountPage() {
    const { type } = useParams<{ type: string }>();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserWiseItem[]>([]);

    const pageTitle = useMemo(() => {
        return titleMap[type || ""] || "User Wise Count";
    }, [type]);

    const fetchUserWiseCounts = async () => {
        if (!type) return;

        try {
            setLoading(true);

            const res = await axios.post(
                `${apiUrl}/adminVisitorCountUserWise`,
                { userCountFor: type },
                { headers: { ...authHeaders() } }
            );

            const payload = res.data as UserWiseApi;

            if (!payload?.success) {
                toast.error(payload?.message || "Failed to load user wise data");
                setUsers([]);
                return;
            }

            setUsers(payload?.data?.visitor_user_wise || []);
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to load user wise data"));
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserWiseCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Back
                    </Link>
                </div>
            </div>

            {/* Summary Cards - Fixed layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <p className="text-sm text-gray-500 mb-1">Total Users</p>
                    <h2 className="text-3xl font-bold text-gray-800">{users.length}</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <p className="text-sm text-gray-500 mb-1">Total Count</p>
                    <h2 className="text-3xl font-bold text-gray-800">
                        {users.reduce((sum, item) => sum + n(item.count), 0)}
                    </h2>
                </div>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    Loading...
                </div>
            ) : users.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    No user wise data found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {users.map((u, index) => {
                        const theme = THEMES[index % THEMES.length];
                        const initial = (u.name || "U").charAt(0).toUpperCase();

                        return (
                            <div
                                key={u.user_id}
                                className={`relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden ring-1 ring-transparent ${theme.ring} hover:shadow-xl transition-all duration-300 flex`}
                            >
                                {/* left strip */}
                                <div className={`w-2 min-h-full ${theme.strip}`} />

                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow ${theme.avatar}`}
                                            >
                                                {initial}
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">User Name</p>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {u.name || "-"}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-2">Count</p>
                                            <span
                                                className={`px-4 py-2 rounded-lg text-xl font-bold ${theme.badge}`}
                                            >
                                                {n(u.count)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


        </div>
    );
}