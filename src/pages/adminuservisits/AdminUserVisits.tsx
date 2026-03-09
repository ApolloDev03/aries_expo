// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// interface ApiUserVisit {
//     user_id: number;
//     name: string;
//     count: number;
// }

// interface UserVisit {
//     id: string | number;
//     username: string;
//     fullName?: string;
//     email?: string;
//     visitCount: number;
//     lastVisit?: string;
// }

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
// ];
// function themeForKey(key: string | number): Theme {
//     const s = String(key);
//     let hash = 0;
//     for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
//     return THEMES[hash % THEMES.length];
// }

// const AdminUserVisits: React.FC = () => {
//     const [userVisits, setUserVisits] = useState<UserVisit[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [searchTerm, setSearchTerm] = useState<string>("");

//     useEffect(() => {
//         const fetchUserVisits = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await axios.post(
//                     "http://rsw-laravel.ariesevents.in/api/adminVisitorCountUserWise"
//                 );

//                 if (response.data?.success) {
//                     const apiData: ApiUserVisit[] =
//                         response.data?.data?.visitor_user_wise || [];

//                     const formattedData: UserVisit[] = apiData.map((item) => ({
//                         id: item.user_id,
//                         username: item.name.toLowerCase().replace(/\s+/g, "_"),
//                         fullName: item.name,
//                         visitCount: item.count,
//                     }));

//                     setUserVisits(formattedData);
//                 } else {
//                     setUserVisits([]);
//                     console.error(response.data?.message || "Failed to fetch data");
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch user visits:", error);
//                 setUserVisits([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchUserVisits();
//     }, []);

//     const filteredVisits = useMemo(() => {
//         const q = searchTerm.trim().toLowerCase();
//         if (!q) return userVisits;

//         return userVisits.filter(
//             (u) =>
//                 u.username.toLowerCase().includes(q) ||
//                 (u.fullName || "").toLowerCase().includes(q)
//         );
//     }, [userVisits, searchTerm]);

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//                 <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
//                     User Visit Counts
//                 </h1>

//                 <div className="relative w-full sm:w-72">
//                     <input
//                         type="text"
//                         placeholder="Search by name / username..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                     />
//                     <svg
//                         className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                         />
//                     </svg>
//                 </div>
//             </div>

//             <div className="overflow-hidden bg-white">
//                 <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-6 py-4">
//                     <span className="text-sm font-semibold text-gray-500">
//                         Total: {filteredVisits.length}
//                     </span>
//                 </div>

//                 {isLoading && (
//                     <div className="flex items-center justify-center py-20">
//                         <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
//                     </div>
//                 )}

//                 {!isLoading && (
//                     <div className="p-4 md:p-6">
//                         {filteredVisits.length === 0 ? (
//                             <div className="py-12 text-center text-gray-500">
//                                 No users found matching your search.
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                                 {filteredVisits.map((user) => {
//                                     const t = themeForKey(user.username || user.id);

//                                     return (
//                                         <div
//                                             key={user.id}
//                                             className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md ring-0 hover:ring-2 ${t.ring}`}
//                                         >
//                                             <div
//                                                 className={`absolute left-0 top-0 h-full w-1.5 ${t.strip}`}
//                                             />

//                                             <div className="flex items-center justify-between pl-3">
//                                                 <div className="flex min-w-0 items-center gap-3">
//                                                     <div
//                                                         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-bold ${t.avatar}`}
//                                                     >
//                                                         {(user.fullName || user.username)
//                                                             .charAt(0)
//                                                             .toUpperCase()}
//                                                     </div>

//                                                     <div className="min-w-0">
//                                                         <div className="truncate text-sm font-semibold text-slate-900">
//                                                             {user.fullName || user.username}
//                                                         </div>
//                                                         <div className="truncate text-xs text-slate-500">
//                                                             @{user.username}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <span
//                                                     className={`rounded-full px-3 py-1 text-sm font-semibold ${t.badge}`}
//                                                 >
//                                                     {user.visitCount.toLocaleString()}
//                                                 </span>
//                                             </div>

//                                             <div className="mt-3 pl-3 text-xs text-slate-500">
//                                                 Visits recorded for this user
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminUserVisits;


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface ApiUserVisit {
    user_id: number;
    name: string;
    count: number;
}

interface UserVisit {
    id: string | number;
    username: string;
    fullName?: string;
    visitCount: number;
}

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

const AdminUserVisits: React.FC = () => {
    const [userVisits, setUserVisits] = useState<UserVisit[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchUserVisits = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post(
                    "http://rsw-laravel.ariesevents.in/api/adminVisitorCountUserWise"
                );

                if (response.data?.success) {
                    const apiData: ApiUserVisit[] =
                        response.data?.data?.visitor_user_wise || [];

                    const formattedData: UserVisit[] = apiData.map((item) => ({
                        id: item.user_id,
                        username: item.name.toLowerCase().replace(/\s+/g, "_"),
                        fullName: item.name,
                        visitCount: item.count,
                    }));

                    setUserVisits(formattedData);
                } else {
                    setUserVisits([]);
                    console.error(response.data?.message || "Failed to fetch data");
                }
            } catch (error) {
                console.error("Failed to fetch user visits:", error);
                setUserVisits([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserVisits();
    }, []);

    const filteredVisits = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return userVisits;

        return userVisits.filter(
            (u) =>
                u.username.toLowerCase().includes(q) ||
                (u.fullName || "").toLowerCase().includes(q)
        );
    }, [userVisits, searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                    User Visit Counts
                </h1>

                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search by name / username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <span className="text-sm font-semibold text-gray-500">
                        Total: {filteredVisits.length}
                    </span>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
                    </div>
                )}

                {!isLoading && (
                    <div className="p-4 md:p-6">
                        {filteredVisits.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                No users found matching your search.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredVisits.map((user, index) => {
                                    const t = THEMES[index % THEMES.length];

                                    return (
                                        <div
                                            key={user.id}
                                            className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md ring-1 ring-transparent hover:ring-2 ${t.ring}`}
                                        >
                                            <div className={`absolute left-0 top-0 h-full w-1.5 ${t.strip}`} />

                                            <div className="flex items-center justify-between pl-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-bold ${t.avatar}`}
                                                    >
                                                        {(user.fullName || user.username).charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="truncate text-base font-semibold text-slate-900">
                                                            {user.fullName || user.username}
                                                        </div>
                                                        <div className="truncate text-xs text-slate-500">
                                                            @{user.username}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${t.badge}`}
                                                >
                                                    {user.visitCount.toLocaleString()}
                                                </span>
                                            </div>


                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserVisits;