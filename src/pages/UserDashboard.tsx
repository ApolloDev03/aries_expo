// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../config";
// import { useNavigate } from "react-router-dom";
// import LeadDashboard from "./mycall/LeadDashboard";
// import AttendanceDashboard from "./AttendanceDashboard";

// type CountRes = {
//     user_id: string;
//     total_visitors: number;
//     today_visitors: number;
//     total_exhibitors: number;
//     today_exhibitors: number;
//     total_Expected_Exhibitors: number;
//     today_Expected_Exhibitors: number;
// };
// type StoredUser = {
//     id?: number;
//     name?: string;
//     Department?: string;
//     primary_department?: string;
// };

// const normalizeDepartment = (value?: string) => {
//     return String(value || "")
//         .trim()
//         .toLowerCase()
//         .replace(/[\s_-]+/g, "");
// };

// const getActiveDepartmentFromStorage = (): string => {
//     try {
//         const user: StoredUser = JSON.parse(
//             localStorage.getItem("user") || "{}"
//         );

//         return (
//             localStorage.getItem("active_department") ||
//             localStorage.getItem("primary_department") ||
//             user?.primary_department ||
//             user?.Department ||
//             ""
//         ).trim();
//     } catch (error) {
//         console.error(
//             "Active department localStorage error:",
//             error
//         );

//         return (
//             localStorage.getItem("active_department") ||
//             localStorage.getItem("primary_department") ||
//             ""
//         ).trim();
//     }
// };
// export default function UserDashboard() {
//     const userId = localStorage.getItem("User_Id") || "";
//     const navigate = useNavigate();


//     const [loadingCounts, setLoadingCounts] = useState(false);
//     const [totalVisitors, setTotalVisitors] = useState(0);
//     const [todayVisitors, setTodayVisitors] = useState(0);
//     const [totalExhibitors, setTotalExhibitors] = useState(0);
//     const [todayExhibitors, setTodayExhibitors] = useState(0);
//     const [expectedTotalExhibitors, setExpectedTotalExhibitors] = useState(0);
//     const [todayExpectedExhibitors, setTodayExpectedExhibitors] = useState(0);

  
//     const [activeDepartment, setActiveDepartment] =
//         useState<string>(() =>
//             getActiveDepartmentFromStorage()
//         );

//     const normalizedActiveDepartment =
//         normalizeDepartment(activeDepartment);
//           const showLeadDashboard =
//         normalizedActiveDepartment === "calling" ||
//         normalizedActiveDepartment === "leadmanagement";
//         useEffect(() => {
//     const handleDepartmentChange = (event: Event) => {
//         const customEvent =
//             event as CustomEvent<string>;

//         const departmentName =
//             customEvent.detail ||
//             getActiveDepartmentFromStorage();

//         setActiveDepartment(departmentName);
//     };

//     const handleStorageChange = (
//         event: StorageEvent
//     ) => {
//         if (event.key === "active_department") {
//             setActiveDepartment(
//                 event.newValue ||
//                 getActiveDepartmentFromStorage()
//             );
//         }
//     };

//     window.addEventListener(
//         "active-department-change",
//         handleDepartmentChange
//     );

//     window.addEventListener(
//         "storage",
//         handleStorageChange
//     );

//     return () => {
//         window.removeEventListener(
//             "active-department-change",
//             handleDepartmentChange
//         );

//         window.removeEventListener(
//             "storage",
//             handleStorageChange
//         );
//     };
// }, []);
//     const fetchVisitorCounts = async () => {
//         if (!userId) {
//             toast.error("User_Id not found in localStorage");
//             setTotalVisitors(0);
//             setTodayVisitors(0);
//             setTotalExhibitors(0);
//             setTodayExhibitors(0);
//             setExpectedTotalExhibitors(0);
//             setTodayExpectedExhibitors(0);
//             return;
//         }

//         try {
//             setLoadingCounts(true);

//             const res = await axios.post(`${apiUrl}/visitor/user/count`, {
//                 user_id: String(userId),
//             });

//             if (res.data?.success && res.data?.data) {
//                 const d: CountRes = res.data.data;
//                 setTotalVisitors(Number(d.total_visitors || 0));
//                 setTodayVisitors(Number(d.today_visitors || 0));
//                 setTotalExhibitors(Number(d.total_exhibitors || 0));
//                 setTodayExhibitors(Number(d.today_exhibitors || 0));
//                 setExpectedTotalExhibitors(Number(d.total_Expected_Exhibitors || 0));
//                 setTodayExpectedExhibitors(Number(d.today_Expected_Exhibitors || 0));
//             } else {
//                 toast.error(res.data?.message || "Visitor count fetch failed");
//                 setTotalVisitors(0);
//                 setTodayVisitors(0);
//                 setTodayExhibitors(0);
//                 setTotalExhibitors(0);
//                 setExpectedTotalExhibitors(0);
//                 setTodayExpectedExhibitors(0);
//             }
//         } catch (err: any) {
//             console.error(err);
//             toast.error(err?.response?.data?.message || "Visitor count fetch failed");
//             setTotalVisitors(0);
//             setTodayVisitors(0);
//             setTodayExhibitors(0);
//             setTotalExhibitors(0);
//             setExpectedTotalExhibitors(0);
//             setTodayExpectedExhibitors(0);
//         } finally {
//             setLoadingCounts(false);
//         }
//     };
//     const clearLocationCache = () => {
//         localStorage.removeItem("user_lat");
//         localStorage.removeItem("user_lng");
//         localStorage.removeItem("location_permission");
//     };


//     const requestAndStoreLocation = () => {
//         clearLocationCache();   
//         if (!navigator.geolocation) {
//             localStorage.setItem("location_permission", "unsupported");
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lng = position.coords.longitude;

//                 localStorage.setItem("user_lat", String(lat));
//                 localStorage.setItem("user_lng", String(lng));
//                 localStorage.setItem("location_permission", "granted");

//                 console.log("Latitude:", lat);
//                 console.log("Longitude:", lng);
//             },
//             (error) => {
//                 console.error("Location error:", error);

//                 localStorage.removeItem("user_lat");
//                 localStorage.removeItem("user_lng");
//                 localStorage.setItem("location_permission", "denied");

//                 // dashboard already open rahega
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 0,
//             }
//         );
//     };

// // Location permission only once
// useEffect(() => {
//     requestAndStoreLocation();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

// // Visitor/exhibitor counts only for other departments
// useEffect(() => {
//     if (!showLeadDashboard) {
//         fetchVisitorCounts();
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [activeDepartment]);

//     return (
//         <div className="space-y-6">


//             <div className="bg-gradient-to-r from-[#2c446b] to-[#2e628c] text-white p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden">
//                 <div className="relative z-10">
//                     <h1 className="text-2xl font-bold tracking-tight">Welcome Back 👋</h1>
//                     <p className="text-blue-100/80 mt-1 font-medium">Here's what's happening today</p>
//                 </div>
//             </div>
//             <AttendanceDashboard />
//             {
//                 showLeadDashboard ? <LeadDashboard /> :
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
//                         <div
//                             onClick={() => navigate("/users/visitors-list/TotalVisitors")}
//                             className="bg-white shadow rounded-xl p-6 border-l-4 cursor-pointer border-blue-500"
//                         >
//                             <h2 className="text-sm text-gray-500">Total Visitors</h2>
//                             {loadingCounts ? (
//                                 <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
//                             ) : (
//                                 <p className="text-3xl font-bold text-gray-800 mt-2">{totalVisitors}</p>
//                             )}
//                         </div>

//                         <div
//                             onClick={() => navigate("/users/visitors-list/TodayTotalVisitors")}
//                             className="bg-white shadow rounded-xl p-6 border-l-4 border-green-500 cursor-pointer"
//                         >
//                             <h2 className="text-sm text-gray-500">Today Visitors</h2>
//                             {loadingCounts ? (
//                                 <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
//                             ) : (
//                                 <p className="text-3xl font-bold text-gray-800 mt-2">{todayVisitors}</p>
//                             )}
//                         </div>

//                         <div
//                             onClick={() => navigate("/users/exhibitors-list/TotalVisitors")}
//                             className="bg-white shadow rounded-xl p-6 border-l-4 border-purple-500"
//                         >
//                             <h2 className="text-sm text-gray-500">Total Exhibitors</h2>
//                             {loadingCounts ? (
//                                 <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
//                             ) : (
//                                 <p className="text-3xl font-bold text-gray-800 mt-2">{totalExhibitors}</p>
//                             )}
//                         </div>

//                         <div
//                             onClick={() => navigate("/users/exhibitors-list/TodayTotalVisitors")}
//                             className="bg-white shadow rounded-xl p-6 border-l-4 border-[#F54C54]"
//                         >
//                             <h2 className="text-sm text-gray-500">Today Exhibitors</h2>
//                             {loadingCounts ? (
//                                 <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
//                             ) : (
//                                 <p className="text-3xl font-bold text-gray-800 mt-2">{todayExhibitors}</p>
//                             )}
//                         </div>

//                         <div
//                             onClick={() => navigate("/users/expectedexhibitors-list/ExpectedTotalVisitors")}
//                             className="bg-white shadow rounded-xl p-6 border-l-4 border-[#454C7D]"
//                         >
//                             <h2 className="text-sm text-gray-500">Total Expected Exhibitors</h2>
//                             {loadingCounts ? (
//                                 <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
//                             ) : (
//                                 <p className="text-3xl font-bold text-gray-800 mt-2">{expectedTotalExhibitors}</p>
//                             )}
//                         </div>

//                         <div
//                             onClick={() => navigate("/users/expectedexhibitors-list/TodayTotalVisitors")}
//                             className="bg-white shadow rounded-xl p-6 border-l-4 border-[#8A6C56]"
//                         >
//                             <h2 className="text-sm text-gray-500">Today Expected Exhibitors</h2>
//                             {loadingCounts ? (
//                                 <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
//                             ) : (
//                                 <p className="text-3xl font-bold text-gray-800 mt-2">{todayExpectedExhibitors}</p>
//                             )}
//                         </div>
//                     </div>
//             }
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { useNavigate } from "react-router-dom";
import LeadDashboard from "./mycall/LeadDashboard";
import AttendanceDashboard from "./AttendanceDashboard";

type CountRes = {
    user_id: string;
    total_visitors: number;
    today_visitors: number;
    total_exhibitors: number;
    today_exhibitors: number;
    total_Expected_Exhibitors: number;
    today_Expected_Exhibitors: number;
};
type StoredUser = {
    id?: number;
    name?: string;
    Department?: string;
    primary_department?: string;
};

const normalizeDepartment = (value?: string) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
};

const getActiveDepartmentFromStorage = (): string => {
    try {
        const user: StoredUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        return (
            localStorage.getItem("active_department") ||
            localStorage.getItem("primary_department") ||
            user?.primary_department ||
            user?.Department ||
            ""
        ).trim();
    } catch (error) {
        console.error(
            "Active department localStorage error:",
            error
        );

        return (
            localStorage.getItem("active_department") ||
            localStorage.getItem("primary_department") ||
            ""
        ).trim();
    }
};
export default function UserDashboard() {
    const userId = localStorage.getItem("User_Id") || "";
    const navigate = useNavigate();


    const [loadingCounts, setLoadingCounts] = useState(false);
    const [totalVisitors, setTotalVisitors] = useState(0);
    const [todayVisitors, setTodayVisitors] = useState(0);
    const [totalExhibitors, setTotalExhibitors] = useState(0);
    const [todayExhibitors, setTodayExhibitors] = useState(0);
    const [expectedTotalExhibitors, setExpectedTotalExhibitors] = useState(0);
    const [todayExpectedExhibitors, setTodayExpectedExhibitors] = useState(0);

  
    const [activeDepartment, setActiveDepartment] =
        useState<string>(() =>
            getActiveDepartmentFromStorage()
        );

    const normalizedActiveDepartment =
        normalizeDepartment(activeDepartment);
          const showLeadDashboard =
        normalizedActiveDepartment === "calling" ||
        normalizedActiveDepartment === "leadmanagement";
        useEffect(() => {
    const handleDepartmentChange = (event: Event) => {
        const customEvent =
            event as CustomEvent<string>;

        const departmentName =
            customEvent.detail ||
            getActiveDepartmentFromStorage();

        setActiveDepartment(departmentName);
    };

    const handleStorageChange = (
        event: StorageEvent
    ) => {
        if (event.key === "active_department") {
            setActiveDepartment(
                event.newValue ||
                getActiveDepartmentFromStorage()
            );
        }
    };

    window.addEventListener(
        "active-department-change",
        handleDepartmentChange
    );

    window.addEventListener(
        "storage",
        handleStorageChange
    );

    return () => {
        window.removeEventListener(
            "active-department-change",
            handleDepartmentChange
        );

        window.removeEventListener(
            "storage",
            handleStorageChange
        );
    };
}, []);
    const fetchVisitorCounts = async () => {
        if (!userId) {
            toast.error("User_Id not found in localStorage");
            setTotalVisitors(0);
            setTodayVisitors(0);
            setTotalExhibitors(0);
            setTodayExhibitors(0);
            setExpectedTotalExhibitors(0);
            setTodayExpectedExhibitors(0);
            return;
        }

        try {
            setLoadingCounts(true);

            const res = await axios.post(`${apiUrl}/visitor/user/count`, {
                user_id: String(userId),
            });

            if (res.data?.success && res.data?.data) {
                const d: CountRes = res.data.data;
                setTotalVisitors(Number(d.total_visitors || 0));
                setTodayVisitors(Number(d.today_visitors || 0));
                setTotalExhibitors(Number(d.total_exhibitors || 0));
                setTodayExhibitors(Number(d.today_exhibitors || 0));
                setExpectedTotalExhibitors(Number(d.total_Expected_Exhibitors || 0));
                setTodayExpectedExhibitors(Number(d.today_Expected_Exhibitors || 0));
            } else {
                toast.error(res.data?.message || "Visitor count fetch failed");
                setTotalVisitors(0);
                setTodayVisitors(0);
                setTodayExhibitors(0);
                setTotalExhibitors(0);
                setExpectedTotalExhibitors(0);
                setTodayExpectedExhibitors(0);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Visitor count fetch failed");
            setTotalVisitors(0);
            setTodayVisitors(0);
            setTodayExhibitors(0);
            setTotalExhibitors(0);
            setExpectedTotalExhibitors(0);
            setTodayExpectedExhibitors(0);
        } finally {
            setLoadingCounts(false);
        }
    };
    const clearLocationCache = () => {
        localStorage.removeItem("user_lat");
        localStorage.removeItem("user_lng");
        localStorage.removeItem("location_accuracy");
        localStorage.removeItem("location_timestamp");
        localStorage.removeItem("location_permission");
    };

    const storeLocation = (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        localStorage.setItem("user_lat", String(lat));
        localStorage.setItem("user_lng", String(lng));
        localStorage.setItem(
            "location_accuracy",
            String(position.coords.accuracy || 0)
        );
        localStorage.setItem(
            "location_timestamp",
            String(Date.now())
        );
        localStorage.setItem("location_permission", "granted");

        // Other components can react immediately if needed.
        window.dispatchEvent(
            new CustomEvent("user-location-updated", {
                detail: { lat, lng },
            })
        );

        console.log("Login Location Latitude:", lat);
        console.log("Login Location Longitude:", lng);
    };

    const requestAndStoreLocation = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                localStorage.setItem(
                    "location_permission",
                    "unsupported"
                );
                resolve(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    storeLocation(position);
                    resolve(true);
                },
                (error) => {
                    // Do not mark every failure as denied.
                    // 1 = permission denied, 2 = unavailable, 3 = timeout.
                    if (error.code === 1) {
                        localStorage.setItem(
                            "location_permission",
                            "denied"
                        );
                    } else if (error.code === 2) {
                        localStorage.setItem(
                            "location_permission",
                            "unavailable"
                        );
                    } else if (error.code === 3) {
                        localStorage.setItem(
                            "location_permission",
                            "timeout"
                        );
                    }

                    console.warn(
                        "Login location not available yet:",
                        error.code,
                        error.message
                    );
                    resolve(false);
                },
                {
                    // Better for laptop/desktop and does not force GPS.
                    enableHighAccuracy: false,

                    // Give enough time for the user to click Allow.
                    timeout: 60000,

                    // Login should capture a current location.
                    maximumAge: 0,
                }
            );
        });
    };

    // Request location when the user dashboard opens after login.
    useEffect(() => {
        let permissionStatus: PermissionStatus | null = null;
        let cancelled = false;

        // Do not use an old login/session location.
        clearLocationCache();

        void requestAndStoreLocation();

        // If the browser permission changes to Allow after login,
        // immediately capture and save the coordinates.
        if (navigator.permissions?.query) {
            navigator.permissions
                .query({
                    name: "geolocation" as PermissionName,
                })
                .then((status) => {
                    if (cancelled) return;

                    permissionStatus = status;

                    status.onchange = () => {
                        if (status.state === "granted") {
                            void requestAndStoreLocation();
                        }

                        if (status.state === "denied") {
                            localStorage.removeItem("user_lat");
                            localStorage.removeItem("user_lng");
                            localStorage.setItem(
                                "location_permission",
                                "denied"
                            );
                        }
                    };
                })
                .catch(() => {
                    // Permissions API is optional; geolocation still works.
                });
        }

        return () => {
            cancelled = true;

            if (permissionStatus) {
                permissionStatus.onchange = null;
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

// Visitor/exhibitor counts only for other departments
useEffect(() => {
    if (!showLeadDashboard) {
        fetchVisitorCounts();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeDepartment]);

    return (
        <div className="space-y-6">


            <div className="bg-gradient-to-r from-[#2c446b] to-[#2e628c] text-white p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome Back 👋</h1>
                    <p className="text-blue-100/80 mt-1 font-medium">Here's what's happening today</p>
                </div>
            </div>
            <AttendanceDashboard />
            {
                showLeadDashboard ? <LeadDashboard /> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                        <div
                            onClick={() => navigate("/users/visitors-list/TotalVisitors")}
                            className="bg-white shadow rounded-xl p-6 border-l-4 cursor-pointer border-blue-500"
                        >
                            <h2 className="text-sm text-gray-500">Total Visitors</h2>
                            {loadingCounts ? (
                                <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-800 mt-2">{totalVisitors}</p>
                            )}
                        </div>

                        <div
                            onClick={() => navigate("/users/visitors-list/TodayTotalVisitors")}
                            className="bg-white shadow rounded-xl p-6 border-l-4 border-green-500 cursor-pointer"
                        >
                            <h2 className="text-sm text-gray-500">Today Visitors</h2>
                            {loadingCounts ? (
                                <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-800 mt-2">{todayVisitors}</p>
                            )}
                        </div>

                        <div
                            onClick={() => navigate("/users/exhibitors-list/TotalVisitors")}
                            className="bg-white shadow rounded-xl p-6 border-l-4 border-purple-500"
                        >
                            <h2 className="text-sm text-gray-500">Total Exhibitors</h2>
                            {loadingCounts ? (
                                <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-800 mt-2">{totalExhibitors}</p>
                            )}
                        </div>

                        <div
                            onClick={() => navigate("/users/exhibitors-list/TodayTotalVisitors")}
                            className="bg-white shadow rounded-xl p-6 border-l-4 border-[#F54C54]"
                        >
                            <h2 className="text-sm text-gray-500">Today Exhibitors</h2>
                            {loadingCounts ? (
                                <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-800 mt-2">{todayExhibitors}</p>
                            )}
                        </div>

                        <div
                            onClick={() => navigate("/users/expectedexhibitors-list/ExpectedTotalVisitors")}
                            className="bg-white shadow rounded-xl p-6 border-l-4 border-[#454C7D]"
                        >
                            <h2 className="text-sm text-gray-500">Total Expected Exhibitors</h2>
                            {loadingCounts ? (
                                <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-800 mt-2">{expectedTotalExhibitors}</p>
                            )}
                        </div>

                        <div
                            onClick={() => navigate("/users/expectedexhibitors-list/TodayTotalVisitors")}
                            className="bg-white shadow rounded-xl p-6 border-l-4 border-[#8A6C56]"
                        >
                            <h2 className="text-sm text-gray-500">Today Expected Exhibitors</h2>
                            {loadingCounts ? (
                                <div className="mt-3 flex items-center gap-2 text-gray-500">0</div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-800 mt-2">{todayExpectedExhibitors}</p>
                            )}
                        </div>
                    </div>
            }
        </div>
    );
}