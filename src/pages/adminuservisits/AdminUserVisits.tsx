import React, { useEffect, useMemo, useState } from "react";

interface UserVisit {
    id: string | number;
    username: string;
    fullName?: string;
    email?: string;
    visitCount: number;
    lastVisit?: string;
}

type Theme = {
    strip: string;       // left strip color
    ring: string;        // hover ring color
    badge: string;       // badge bg + text
    avatar: string;      // avatar bg (solid)
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
];

function themeForKey(key: string | number): Theme {
    const s = String(key);
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return THEMES[hash % THEMES.length];
}

const AdminUserVisits: React.FC = () => {
    const [userVisits, setUserVisits] = useState<UserVisit[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchUserVisits = async () => {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 800));

                const mockData: UserVisit[] = [
                    {
                        id: 1,
                        username: "john_doe",
                        fullName: "John Doe",
                        email: "john@example.com",
                        visitCount: 145,
                        lastVisit: "2024-05-20T10:30:00Z",
                    },
                    {
                        id: 2,
                        username: "jane_smith",
                        fullName: "Jane Smith",
                        email: "jane@example.com",
                        visitCount: 98,
                        lastVisit: "2024-05-21T14:15:00Z",
                    },
                    {
                        id: 3,
                        username: "peter_jones",
                        fullName: "Peter Jones",
                        email: "peter@example.com",
                        visitCount: 212,
                        lastVisit: "2024-05-22T09:00:00Z",
                    },
                    {
                        id: 4,
                        username: "alice_wonder",
                        fullName: "Alice Wonder",
                        email: "alice@example.com",
                        visitCount: 56,
                        lastVisit: "2024-05-19T16:45:00Z",
                    },
                    {
                        id: 5,
                        username: "bob_builder",
                        fullName: "Bob Builder",
                        email: "bob@example.com",
                        visitCount: 301,
                        lastVisit: "2024-05-22T11:20:00Z",
                    },
                    {
                        id: 6,
                        username: "charlie_brown",
                        fullName: "Charlie Brown",
                        email: "charlie@example.com",
                        visitCount: 77,
                        lastVisit: "2024-05-18T12:10:00Z",
                    },
                ];

                setUserVisits(mockData);
            } catch (error) {
                console.error("Failed to fetch user visits:", error);
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
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    User Visit Counts
                </h1>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search by name / username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

            {/* Wrapper */}
            <div className="bg-white overflow-hidden ">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-end items-center">

                    <span className="text-sm text-gray-500 font-semibold">
                        Total: {filteredVisits.length}
                    </span>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    </div>
                )}

                {/* Cards */}
                {!isLoading && (
                    <div className="p-4 md:p-6">
                        {filteredVisits.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                No users found matching your search.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredVisits.map((user) => {
                                    const t = themeForKey(user.username || user.id);

                                    return (
                                        <div
                                            key={user.id}
                                            className={`relative overflow-hidden rounded-xl bg-white p-4
    border border-slate-200
    shadow-sm transition-all
    hover:shadow-md hover:-translate-y-[1px]
    ring-0 hover:ring-2 ${t.ring}`}
                                        >
                                            {/* Left color strip */}
                                            <div className={`absolute left-0 top-0 h-full w-1.5 ${t.strip}`} />

                                            <div className="flex items-center justify-between pl-3">
                                                {/* Avatar + Name */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className={`h-11 w-11 rounded-full ${t.avatar}
          flex items-center justify-center text-white font-bold shrink-0`}
                                                    >
                                                        {(user.fullName || user.username).charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-slate-900 truncate">
                                                            {user.fullName || user.username}
                                                        </div>
                                                        <div className="text-xs text-slate-500 truncate">
                                                            @{user.username}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Count badge */}
                                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${t.badge}`}>
                                                    {user.visitCount.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="mt-3 pl-3 text-xs text-slate-500">
                                                Visits recorded for this user
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