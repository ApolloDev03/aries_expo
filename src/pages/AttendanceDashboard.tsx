// // // import React, { useState } from "react";
// // // import axios from "axios";
// // // import { toast } from "react-toastify";
// // // import { MapPin, Clock, LogOut, FileText } from "lucide-react";
// // // import { useNavigate } from "react-router-dom";
// // // import { apiUrl } from "../config";

// // // type PopupType = "start" | "end" | "leave" | null;

// // // export default function AttendanceDashboard() {
// // //     const navigate = useNavigate();
// // //     const [showPopup, setShowPopup] = useState<PopupType>(null);
// // //     const [loading, setLoading] = useState(false);

// // //     const getUserData = () => {
// // //         const user = localStorage.getItem("user");
// // //         return user ? JSON.parse(user) : null;
// // //     };

// // //     const getCurrentDateTime = () => {
// // //         const now = new Date();
// // //         const pad = (n: number) => String(n).padStart(2, "0");

// // //         return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
// // //             now.getDate()
// // //         )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
// // //     };


    
// // //     const getLocation = () => {
// // //         return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
// // //             if (!navigator.geolocation) {
// // //                 localStorage.setItem("location_permission", "unsupported");
// // //                 reject("Geolocation not supported");
// // //                 return;
// // //             }

// // //             navigator.geolocation.getCurrentPosition(
// // //                 (pos) => {
// // //                     const lat = pos.coords.latitude;
// // //                     const lng = pos.coords.longitude;

// // //                     localStorage.setItem("user_lat", String(lat));
// // //                     localStorage.setItem("user_lng", String(lng));
// // //                     localStorage.setItem("location_permission", "granted");

// // //                     resolve({ lat, lng });
// // //                 },
// // //                 (error) => {
// // //                     console.error("Location error:", error);

// // //                     localStorage.removeItem("user_lat");
// // //                     localStorage.removeItem("user_lng");
// // //                     localStorage.setItem("location_permission", "denied");

// // //                     reject(error);
// // //                 },
// // //                 {
// // //                     enableHighAccuracy: true,
// // //                     timeout: 10000,
// // //                     maximumAge: 0,
// // //                 }
// // //             );
// // //         });
// // //     }; const initiateAction = async (type: "start" | "end" | "leave") => {
// // //         if (type === "leave") {
// // //             setShowPopup("leave");
// // //             return;
// // //         }

// // //         const savedLat = localStorage.getItem("user_lat");
// // //         const savedLng = localStorage.getItem("user_lng");
// // //         const permission = localStorage.getItem("location_permission");

// // //         // Dashboard પર already Allow કરેલું હોય તો Start/End માં location popup ફરી નહીં આવે
// // //         if (permission === "granted" && savedLat && savedLng) {
// // //             setShowPopup(type);
// // //             return;
// // //         }

// // //         // Dashboard પર Allow ન કરેલું હોય તો Start/End click પર location popup આવશે
// // //         try {
// // //             setLoading(true);

// // //             await getLocation();

// // //             setShowPopup(type);
// // //         } catch (err: any) {
// // //             setShowPopup(null);
// // //             console.log(err?.code,"hvsdfhgsdfsfd")

// // //             if (err?.code == 1) {
// // //                 toast.error("Please allow location permission from browser settings.");
// // //             } else {
// // //                 toast.error("Location not found. Please try again.");
// // //             }
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };
// // //     const handleConfirm = async () => {
// // //         if (showPopup === "leave") {
// // //             toast.success("Leave Applied Successfully");
// // //             setShowPopup(null);
// // //             return;
// // //         }

// // //         try {
// // //             setLoading(true);

// // //             const user = getUserData();
// // //             const empId = user?.id;

// // //             const lat = localStorage.getItem("user_lat");
// // //             const lng = localStorage.getItem("user_lng");

// // //             if (!empId) {
// // //                 toast.error("Employee not found");
// // //                 return;
// // //             }

// // //             if (!lat || !lng) {
// // //                 toast.error("Location not found. Please allow location access.");
// // //                 return;
// // //             }

// // //             const currentDateTime = getCurrentDateTime();

// // //             const payload =
// // //                 showPopup === "start"
// // //                     ? {
// // //                         empId: String(empId),
// // //                         start_latitude: lat,
// // //                         start_longitude: lng,
// // //                         start_address: null,
// // //                         start_date_time: currentDateTime,

// // //                         end_latitude: null,
// // //                         end_longitude: null,
// // //                         end_address: null,
// // //                         end_date_time: null,
// // //                     }
// // //                     : {
// // //                         empId: String(empId),

// // //                         start_latitude: null,
// // //                         start_longitude: null,
// // //                         start_address: null,
// // //                         start_date_time: null,

// // //                         end_latitude: lat,
// // //                         end_longitude: lng,
// // //                         end_address: null,
// // //                         end_date_time: currentDateTime,
// // //                     };

// // //             const res = await axios.post(
// // //                 `${apiUrl}/AttendanceAdd`,
// // //                 payload
// // //             );

// // //             if (res.data?.success) {
// // //                 toast.success(res.data?.message || "Attendance saved successfully");
// // //                 setShowPopup(null);
// // //             } else {
// // //                 toast.error(res.data?.message || "Something went wrong");
// // //             }
// // //         } catch (err: any) {
// // //             toast.error(err?.response?.data?.message || "Attendance API failed");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-6">
// // //             <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
// // //                 <h1 className="text-2xl font-bold">Dashboard</h1>
// // //             </div>

// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                 <ActionCard
// // //                     title="Start Day"
// // //                     icon={<Clock size={22} />}
// // //                     color="bg-green-500"
// // //                     onClick={() => !loading && initiateAction("start")}
// // //                 />

// // //                 <ActionCard
// // //                     title="End Day"
// // //                     icon={<LogOut size={22} />}
// // //                     color="bg-red-500"
// // //                     onClick={() => !loading && initiateAction("end")}
// // //                 />

// // //                 <ActionCard
// // //                     title="Monthly Report"
// // //                     icon={<FileText size={22} />}
// // //                     color="bg-orange-500"
// // //                     onClick={() => navigate("/users/monthly-report")}
// // //                 />
// // //             </div>

// // //             {showPopup && (
// // //                 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// // //                     <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
// // //                         <div className="flex items-center gap-3 mb-4">
// // //                             <div className="bg-[#70a0bf] p-2 rounded-xl text-white">
// // //                                 <MapPin size={20} />
// // //                             </div>

// // //                             <h3 className="text-lg font-bold text-[#2c446b]">
// // //                                 Confirm Action
// // //                             </h3>
// // //                         </div>

// // //                         <p className="text-slate-600 mb-6 leading-relaxed">
// // //                             Are you sure you want to{" "}
// // //                             <strong>{showPopup === "start" ? "start" : "end"}</strong> your
// // //                             work day?
// // //                         </p>

// // //                         <div className="flex gap-3">
// // //                             <button
// // //                                 onClick={() => setShowPopup(null)}
// // //                                 className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
// // //                             >
// // //                                 Cancel
// // //                             </button>

// // //                             <button
// // //                                 onClick={handleConfirm}
// // //                                 disabled={loading}
// // //                                 className="flex-1 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold disabled:opacity-50"
// // //                             >
// // //                                 {loading ? "Saving..." : "Confirm"}
// // //                             </button>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // }

// // // const ActionCard = ({
// // //     title,
// // //     icon,
// // //     color,
// // //     onClick,
// // // }: {
// // //     title: string;
// // //     icon: React.ReactNode;
// // //     color: string;
// // //     onClick: () => void;
// // // }) => (
// // //     <div
// // //         onClick={onClick}
// // //         className="cursor-pointer rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
// // //     >
// // //         <div className="flex items-center justify-between gap-4">
// // //             <h2 className="text-xl lg:text-2xl font-bold text-slate-500 mt-1">
// // //                 {title}
// // //             </h2>

// // //             <div
// // //                 className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-sm`}
// // //             >
// // //                 {icon}
// // //             </div>
// // //         </div>
// // //     </div>
// // // );

// // import React, { useRef, useState } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import {
// //   MapPin,
// //   Clock,
// //   LogOut,
// //   FileText,
// //   LoaderCircle,
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import { apiUrl } from "../config";

// // type AttendanceAction = "start" | "end";
// // type PopupType = AttendanceAction | null;

// // interface UserData {
// //   id?: string | number;
// // }

// // interface LocationData {
// //   lat: number;
// //   lng: number;
// //   accuracy: number;
// //   timestamp: number;
// // }

// // interface AttendanceApiResponse {
// //   success?: boolean;
// //   message?: string;
// // }

// // interface AttendancePayload {
// //   empId: string;

// //   start_latitude: string | null;
// //   start_longitude: string | null;
// //   start_address: string | null;
// //   start_date_time: string | null;

// //   end_latitude: string | null;
// //   end_longitude: string | null;
// //   end_address: string | null;
// //   end_date_time: string | null;
// // }

// // const isGeolocationError = (
// //   error: unknown
// // ): error is GeolocationPositionError => {
// //   return (
// //     typeof error === "object" &&
// //     error !== null &&
// //     "code" in error &&
// //     "message" in error
// //   );
// // };

// // export default function AttendanceDashboard() {
// //   const navigate = useNavigate();

// //   const [showPopup, setShowPopup] = useState<PopupType>(null);

// //   const [activeAction, setActiveAction] =
// //     useState<AttendanceAction | null>(null);

// //   const [saving, setSaving] = useState<boolean>(false);

// //   const [currentLocation, setCurrentLocation] =
// //     useState<LocationData | null>(null);

// //   /*
// //    * Double clickથી multiple location request અટકાવવા.
// //    */
// //   const locationRequestRunning = useRef<boolean>(false);

// //   const getUserData = (): UserData | null => {
// //     try {
// //       const user = localStorage.getItem("user");

// //       if (!user) {
// //         return null;
// //       }

// //       return JSON.parse(user) as UserData;
// //     } catch (error) {
// //       console.error("Invalid user data:", error);
// //       return null;
// //     }
// //   };

// //   const getCurrentDateTime = (): string => {
// //     const now = new Date();

// //     const pad = (value: number): string =>
// //       String(value).padStart(2, "0");

// //     return `${now.getFullYear()}-${pad(
// //       now.getMonth() + 1
// //     )}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(
// //       now.getMinutes()
// //     )}:${pad(now.getSeconds())}`;
// //   };

// //   const requestPosition = (
// //     options: PositionOptions
// //   ): Promise<GeolocationPosition> => {
// //     return new Promise<GeolocationPosition>((resolve, reject) => {
// //       navigator.geolocation.getCurrentPosition(
// //         (position: GeolocationPosition) => {
// //           resolve(position);
// //         },
// //         (error: GeolocationPositionError) => {
// //           reject(error);
// //         },
// //         options
// //       );
// //     });
// //   };

// //   const convertPositionToLocation = (
// //     position: GeolocationPosition
// //   ): LocationData => {
// //     return {
// //       lat: position.coords.latitude,
// //       lng: position.coords.longitude,
// //       accuracy: position.coords.accuracy,
// //       timestamp: position.timestamp,
// //     };
// //   };

// //   const saveLocation = (location: LocationData): void => {
// //     localStorage.setItem("user_lat", String(location.lat));
// //     localStorage.setItem("user_lng", String(location.lng));

// //     localStorage.setItem(
// //       "location_accuracy",
// //       String(location.accuracy)
// //     );

// //     localStorage.setItem(
// //       "location_timestamp",
// //       String(location.timestamp)
// //     );

// //     localStorage.setItem("location_permission", "granted");

// //     setCurrentLocation(location);
// //   };

// //   const checkLocationPermission = async (): Promise<void> => {
// //     if (!navigator.permissions?.query) {
// //       return;
// //     }

// //     try {
// //       const permissionStatus =
// //         await navigator.permissions.query({
// //           name: "geolocation" as PermissionName,
// //         });

// //       if (permissionStatus.state === "denied") {
// //         throw new Error("LOCATION_PERMISSION_BLOCKED");
// //       }
// //     } catch (error: unknown) {
// //       if (
// //         error instanceof Error &&
// //         error.message === "LOCATION_PERMISSION_BLOCKED"
// //       ) {
// //         throw error;
// //       }

// //       /*
// //        * Permissions API support ન હોય તો actual
// //        * geolocation request continue થવા દો.
// //        */
// //     }
// //   };

// //   const getLocation = async (): Promise<LocationData> => {
// //     if (!navigator.geolocation) {
// //       localStorage.setItem(
// //         "location_permission",
// //         "unsupported"
// //       );

// //       throw new Error("GEOLOCATION_NOT_SUPPORTED");
// //     }

// //     /*
// //      * localhost secure context છે.
// //      * Live website માટે HTTPS required છે.
// //      */
// //     if (!window.isSecureContext) {
// //       throw new Error("LOCATION_REQUIRES_HTTPS");
// //     }

// //     await checkLocationPermission();

// //     let firstError: unknown;

// //     /*
// //      * Attempt 1:
// //      * Desktop/laptop માટે network-based location.
// //      *
// //      * High accuracy false હોવાથી timeout ઓછો આવે છે.
// //      */
// //     try {
// //       const position = await requestPosition({
// //         enableHighAccuracy: false,
// //         timeout: 30000,
// //         maximumAge: 300000,
// //       });

// //       const location = convertPositionToLocation(position);

// //       saveLocation(location);

// //       return location;
// //     } catch (error: unknown) {
// //       firstError = error;

// //       /*
// //        * Permission denied હોય તો retry નહીં કરવું.
// //        */
// //       if (isGeolocationError(error) && error.code === 1) {
// //         localStorage.setItem(
// //           "location_permission",
// //           "denied"
// //         );

// //         throw error;
// //       }

// //       console.warn(
// //         "Normal location request failed. Retrying with high accuracy."
// //       );
// //     }

// //     /*
// //      * Attempt 2:
// //      * GPS/high accuracy સાથે longer timeout.
// //      */
// //     try {
// //       const position = await requestPosition({
// //         enableHighAccuracy: true,
// //         timeout: 60000,
// //         maximumAge: 60000,
// //       });

// //       const location = convertPositionToLocation(position);

// //       saveLocation(location);

// //       return location;
// //     } catch (secondError: unknown) {
// //       /*
// //        * Timeoutને denied તરીકે save ન કરવું.
// //        */
// //       if (isGeolocationError(secondError)) {
// //         if (secondError.code === 1) {
// //           localStorage.setItem(
// //             "location_permission",
// //             "denied"
// //           );
// //         } else if (secondError.code === 2) {
// //           localStorage.setItem(
// //             "location_permission",
// //             "unavailable"
// //           );
// //         } else if (secondError.code === 3) {
// //           localStorage.setItem(
// //             "location_permission",
// //             "timeout"
// //           );
// //         }

// //         throw secondError;
// //       }

// //       throw secondError || firstError;
// //     }
// //   };

// //   const getLocationErrorMessage = (
// //     error: unknown
// //   ): string => {
// //     if (error instanceof Error) {
// //       if (error.message === "GEOLOCATION_NOT_SUPPORTED") {
// //         return "Your browser does not support location services.";
// //       }

// //       if (error.message === "LOCATION_REQUIRES_HTTPS") {
// //         return (
// //           "Location service requires HTTPS. " +
// //           "Please open the live website using https://."
// //         );
// //       }

// //       if (error.message === "LOCATION_PERMISSION_BLOCKED") {
// //         return (
// //           "Location permission is blocked. Open browser Site Settings, " +
// //           "change Location to Allow and reload the page."
// //         );
// //       }
// //     }

// //     if (isGeolocationError(error)) {
// //       switch (error.code) {
// //         case 1:
// //           return (
// //             "Location permission denied. Open browser Site Settings, " +
// //             "set Location to Allow and reload the page."
// //           );

// //         case 2:
// //           return (
// //             "Current location is unavailable. Turn on device Location " +
// //             "Services and check your Wi-Fi or internet connection."
// //           );

// //         case 3:
// //           return (
// //             "Location request timed out. Turn on device Location Services, " +
// //             "keep Wi-Fi enabled and try again."
// //           );

// //         default:
// //           return "Unable to get current location.";
// //       }
// //     }

// //     return "Location not found. Please try again.";
// //   };

// //   const initiateAction = async (
// //     type: AttendanceAction
// //   ): Promise<void> => {
// //     if (
// //       locationRequestRunning.current ||
// //       activeAction !== null ||
// //       saving
// //     ) {
// //       return;
// //     }

// //     locationRequestRunning.current = true;

// //     try {
// //       setActiveAction(type);
// //       setShowPopup(null);
// //       setCurrentLocation(null);

// //       /*
// //        * Start Day / End Day click પર fresh location મળશે.
// //        */
// //       const location = await getLocation();

// //       /*
// //        * getLocationમાં state અને localStorage set થઈ ચૂક્યા છે.
// //        */
// //       setCurrentLocation(location);
// //       setShowPopup(type);
// //     } catch (error: unknown) {
// //       console.error("Final location error:", error);

// //       setShowPopup(null);
// //       setCurrentLocation(null);

// //       toast.error(getLocationErrorMessage(error));
// //     } finally {
// //       locationRequestRunning.current = false;
// //       setActiveAction(null);
// //     }
// //   };

// //   const handleConfirm = async (): Promise<void> => {
// //     if (
// //       showPopup !== "start" &&
// //       showPopup !== "end"
// //     ) {
// //       return;
// //     }

// //     if (!currentLocation) {
// //       toast.error(
// //         "Location not found. Please close the popup and try again."
// //       );

// //       return;
// //     }

// //     try {
// //       setSaving(true);

// //       const user = getUserData();
// //       const empId = user?.id;

// //       if (!empId) {
// //         toast.error("Employee not found");
// //         return;
// //       }

// //       const currentDateTime = getCurrentDateTime();

// //       const payload: AttendancePayload =
// //         showPopup === "start"
// //           ? {
// //               empId: String(empId),

// //               start_latitude: String(
// //                 currentLocation.lat
// //               ),
// //               start_longitude: String(
// //                 currentLocation.lng
// //               ),
// //               start_address: null,
// //               start_date_time: currentDateTime,

// //               end_latitude: null,
// //               end_longitude: null,
// //               end_address: null,
// //               end_date_time: null,
// //             }
// //           : {
// //               empId: String(empId),

// //               start_latitude: null,
// //               start_longitude: null,
// //               start_address: null,
// //               start_date_time: null,

// //               end_latitude: String(
// //                 currentLocation.lat
// //               ),
// //               end_longitude: String(
// //                 currentLocation.lng
// //               ),
// //               end_address: null,
// //               end_date_time: currentDateTime,
// //             };

// //       const response =
// //         await axios.post<AttendanceApiResponse>(
// //           `${apiUrl}/AttendanceAdd`,
// //           payload
// //         );

// //       if (response.data?.success) {
// //         toast.success(
// //           response.data.message ||
// //             "Attendance saved successfully"
// //         );

// //         setShowPopup(null);
// //         setCurrentLocation(null);
// //       } else {
// //         toast.error(
// //           response.data?.message ||
// //             "Something went wrong"
// //         );
// //       }
// //     } catch (error: unknown) {
// //       console.error("Attendance API error:", error);

// //       if (
// //         axios.isAxiosError<AttendanceApiResponse>(
// //           error
// //         )
// //       ) {
// //         toast.error(
// //           error.response?.data?.message ||
// //             "Attendance API failed"
// //         );

// //         return;
// //       }

// //       toast.error("Attendance API failed");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const closePopup = (): void => {
// //     if (saving) {
// //       return;
// //     }

// //     setShowPopup(null);
// //     setCurrentLocation(null);
// //   };

// //   const pageBusy =
// //     activeAction !== null || saving;

// //   return (
// //     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
// //       <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
// //         <h1 className="text-2xl font-bold">
// //           Dashboard
// //         </h1>
// //       </div>

// //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
// //         <ActionCard
// //           title="Start Day"
// //           icon={<Clock size={22} />}
// //           color="bg-green-500"
// //           loading={activeAction === "start"}
// //           disabled={pageBusy}
// //           onClick={() => {
// //             void initiateAction("start");
// //           }}
// //         />

// //         <ActionCard
// //           title="End Day"
// //           icon={<LogOut size={22} />}
// //           color="bg-red-500"
// //           loading={activeAction === "end"}
// //           disabled={pageBusy}
// //           onClick={() => {
// //             void initiateAction("end");
// //           }}
// //         />

// //         <ActionCard
// //           title="Monthly Report"
// //           icon={<FileText size={22} />}
// //           color="bg-orange-500"
// //           loading={false}
// //           disabled={pageBusy}
// //           onClick={() => {
// //             navigate("/users/monthly-report");
// //           }}
// //         />
// //       </div>

// //       {showPopup && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
// //           <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
// //             <div className="mb-4 flex items-center gap-3">
// //               <div className="rounded-xl bg-[#70a0bf] p-2 text-white">
// //                 <MapPin size={20} />
// //               </div>

// //               <h3 className="text-lg font-bold text-[#2c446b]">
// //                 Confirm Action
// //               </h3>
// //             </div>

// //             <p className="mb-4 leading-relaxed text-slate-600">
// //               Are you sure you want to{" "}
// //               <strong>
// //                 {showPopup === "start"
// //                   ? "start"
// //                   : "end"}
// //               </strong>{" "}
// //               your work day?
// //             </p>

// //             {currentLocation && (
// //               <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-3">
// //                 <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
// //                   <MapPin size={16} />
// //                   Location received successfully
// //                 </div>

// //                 <p className="mt-1 text-xs text-green-700">
// //                   Latitude:{" "}
// //                   {currentLocation.lat.toFixed(6)}
// //                 </p>

// //                 <p className="mt-1 text-xs text-green-700">
// //                   Longitude:{" "}
// //                   {currentLocation.lng.toFixed(6)}
// //                 </p>

// //                 <p className="mt-1 text-xs text-green-700">
// //                   Accuracy:{" "}
// //                   {Math.round(
// //                     currentLocation.accuracy
// //                   )}{" "}
// //                   metres
// //                 </p>
// //               </div>
// //             )}

// //             <div className="flex gap-3">
// //               <button
// //                 type="button"
// //                 onClick={closePopup}
// //                 disabled={saving}
// //                 className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   void handleConfirm();
// //                 }}
// //                 disabled={saving}
// //                 className="flex-1 rounded-xl bg-[#2c446b] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
// //               >
// //                 {saving ? "Saving..." : "Confirm"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // interface ActionCardProps {
// //   title: string;
// //   icon: React.ReactNode;
// //   color: string;
// //   loading: boolean;
// //   disabled: boolean;
// //   onClick: () => void;
// // }

// // const ActionCard = ({
// //   title,
// //   icon,
// //   color,
// //   loading,
// //   disabled,
// //   onClick,
// // }: ActionCardProps) => {
// //   return (
// //     <button
// //       type="button"
// //       onClick={onClick}
// //       disabled={disabled}
// //       className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
// //     >
// //       <div className="flex items-center justify-between gap-4">
// //         <h2 className="mt-1 text-xl font-bold text-slate-500 lg:text-2xl">
// //           {loading
// //             ? "Getting Location..."
// //             : title}
// //         </h2>

// //         <div
// //           className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${color}`}
// //         >
// //           {loading ? (
// //             <LoaderCircle
// //               size={22}
// //               className="animate-spin"
// //             />
// //           ) : (
// //             icon
// //           )}
// //         </div>
// //       </div>
// //     </button>
// //   );
// // };

// import React, { useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   MapPin,
//   Clock,
//   LogOut,
//   FileText,
//   LoaderCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { apiUrl } from "../config";

// type AttendanceAction = "start" | "end";
// type PopupType = AttendanceAction | null;

// interface UserData {
//   id?: string | number;
// }

// interface LocationData {
//   lat: number;
//   lng: number;
//   accuracy: number;
//   timestamp: number;
// }

// interface AttendanceApiResponse {
//   success?: boolean;
//   message?: string;
// }

// interface AttendancePayload {
//   empId: string;

//   start_latitude: string | null;
//   start_longitude: string | null;
//   start_address: string | null;
//   start_date_time: string | null;

//   end_latitude: string | null;
//   end_longitude: string | null;
//   end_address: string | null;
//   end_date_time: string | null;
// }

// const isGeolocationError = (
//   error: unknown
// ): error is GeolocationPositionError => {
//   return (
//     typeof error === "object" &&
//     error !== null &&
//     "code" in error &&
//     "message" in error
//   );
// };

// export default function AttendanceDashboard() {
//   const navigate = useNavigate();

//   const [showPopup, setShowPopup] =
//     useState<PopupType>(null);

//   const [activeAction, setActiveAction] =
//     useState<AttendanceAction | null>(null);

//   const [saving, setSaving] =
//     useState<boolean>(false);

//   const [currentLocation, setCurrentLocation] =
//     useState<LocationData | null>(null);

//   /*
//    * Prevent multiple location requests from double click.
//    */
//   const locationRequestRunning =
//     useRef<boolean>(false);

//   const getUserData = (): UserData | null => {
//     try {
//       const user = localStorage.getItem("user");

//       if (!user) {
//         return null;
//       }

//       return JSON.parse(user) as UserData;
//     } catch (error) {
//       console.error(
//         "Invalid user data in localStorage:",
//         error
//       );

//       return null;
//     }
//   };

//   const getCurrentDateTime = (): string => {
//     const now = new Date();

//     const pad = (value: number): string =>
//       String(value).padStart(2, "0");

//     return `${now.getFullYear()}-${pad(
//       now.getMonth() + 1
//     )}-${pad(now.getDate())} ${pad(
//       now.getHours()
//     )}:${pad(now.getMinutes())}:${pad(
//       now.getSeconds()
//     )}`;
//   };

//   /*
//    * Convert geolocation callback to Promise.
//    */
//   const requestPosition = (
//     options: PositionOptions
//   ): Promise<GeolocationPosition> => {
//     return new Promise<GeolocationPosition>(
//       (resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//           (position: GeolocationPosition) => {
//             resolve(position);
//           },
//           (error: GeolocationPositionError) => {
//             reject(error);
//           },
//           options
//         );
//       }
//     );
//   };

//   /*
//    * Store successful location.
//    */
//   const saveLocation = (
//     position: GeolocationPosition
//   ): LocationData => {
//     const location: LocationData = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude,
//       accuracy: position.coords.accuracy,
//       timestamp: position.timestamp,
//     };

//     localStorage.setItem(
//       "user_lat",
//       String(location.lat)
//     );

//     localStorage.setItem(
//       "user_lng",
//       String(location.lng)
//     );

//     localStorage.setItem(
//       "location_accuracy",
//       String(location.accuracy)
//     );

//     localStorage.setItem(
//       "location_timestamp",
//       String(location.timestamp)
//     );

//     localStorage.setItem(
//       "location_permission",
//       "granted"
//     );

//     setCurrentLocation(location);

//     return location;
//   };

//   /*
//    * Read location from localStorage.
//    */
//   const getStoredLocation =
//     (): LocationData | null => {
//       const latValue =
//         localStorage.getItem("user_lat");

//       const lngValue =
//         localStorage.getItem("user_lng");

//       const accuracyValue =
//         localStorage.getItem(
//           "location_accuracy"
//         );

//       const timestampValue =
//         localStorage.getItem(
//           "location_timestamp"
//         );

//       if (!latValue || !lngValue) {
//         return null;
//       }

//       const lat = Number(latValue);
//       const lng = Number(lngValue);

//       if (
//         !Number.isFinite(lat) ||
//         !Number.isFinite(lng)
//       ) {
//         return null;
//       }

//       return {
//         lat,
//         lng,
//         accuracy: Number(accuracyValue) || 0,
//         timestamp:
//           Number(timestampValue) || Date.now(),
//       };
//     };

//   /*
//    * Clear invalid or denied stored location.
//    */
//   const clearStoredLocation = (): void => {
//     localStorage.removeItem("user_lat");
//     localStorage.removeItem("user_lng");
//     localStorage.removeItem(
//       "location_accuracy"
//     );
//     localStorage.removeItem(
//       "location_timestamp"
//     );

//     setCurrentLocation(null);
//   };

//   /*
//    * Check current Chrome permission status.
//    */
//   const checkLocationPermission =
//     async (): Promise<
//       PermissionState | "unsupported"
//     > => {
//       if (!navigator.permissions?.query) {
//         return "unsupported";
//       }

//       try {
//         const permissionStatus =
//           await navigator.permissions.query({
//             name: "geolocation" as PermissionName,
//           });

//         return permissionStatus.state;
//       } catch {
//         return "unsupported";
//       }
//     };

//   /*
//    * Get location, store latitude and longitude,
//    * then return the stored data.
//    */
//   const getLocation =
//     async (): Promise<LocationData> => {
//       if (!navigator.geolocation) {
//         localStorage.setItem(
//           "location_permission",
//           "unsupported"
//         );

//         throw new Error(
//           "GEOLOCATION_NOT_SUPPORTED"
//         );
//       }

//       /*
//        * localhost works as secure context.
//        * Live server requires HTTPS.
//        */
//       if (!window.isSecureContext) {
//         throw new Error(
//           "LOCATION_REQUIRES_HTTPS"
//         );
//       }

//       const permissionState =
//         await checkLocationPermission();

//       /*
//        * Browser cannot show permission popup again
//        * when permission is already denied.
//        */
//       if (permissionState === "denied") {
//         clearStoredLocation();

//         localStorage.setItem(
//           "location_permission",
//           "denied"
//         );

//         throw new Error(
//           "LOCATION_PERMISSION_BLOCKED"
//         );
//       }

//       let firstError: unknown;

//       /*
//        * Attempt 1:
//        * Best for desktop and laptop.
//        */
//       try {
//         const position = await requestPosition({
//           enableHighAccuracy: false,
//           timeout: 20000,
//           maximumAge: 300000,
//         });

//         return saveLocation(position);
//       } catch (error: unknown) {
//         firstError = error;

//         /*
//          * Permission denied: do not retry.
//          */
//         if (
//           isGeolocationError(error) &&
//           error.code === 1
//         ) {
//           clearStoredLocation();

//           localStorage.setItem(
//             "location_permission",
//             "denied"
//           );

//           throw error;
//         }
//       }

//       /*
//        * Attempt 2:
//        * Retry using higher accuracy and longer timeout.
//        */
//       try {
//         const position = await requestPosition({
//           enableHighAccuracy: true,
//           timeout: 45000,
//           maximumAge: 60000,
//         });

//         return saveLocation(position);
//       } catch (error: unknown) {
//         if (isGeolocationError(error)) {
//           switch (error.code) {
//             case 1:
//               clearStoredLocation();

//               localStorage.setItem(
//                 "location_permission",
//                 "denied"
//               );
//               break;

//             case 2:
//               localStorage.setItem(
//                 "location_permission",
//                 "unavailable"
//               );
//               break;

//             case 3:
//               /*
//                * Timeout is not permission denied.
//                */
//               localStorage.setItem(
//                 "location_permission",
//                 "timeout"
//               );
//               break;
//           }

//           throw error;
//         }

//         throw error ?? firstError;
//       }
//     };

//   const getLocationErrorMessage = (
//     error: unknown
//   ): string => {
//     if (error instanceof Error) {
//       if (
//         error.message ===
//         "GEOLOCATION_NOT_SUPPORTED"
//       ) {
//         return (
//           "This browser does not support " +
//           "location services."
//         );
//       }

//       if (
//         error.message ===
//         "LOCATION_REQUIRES_HTTPS"
//       ) {
//         return (
//           "Location requires HTTPS. " +
//           "Please open the live website using https://."
//         );
//       }

//       if (
//         error.message ===
//         "LOCATION_PERMISSION_BLOCKED"
//       ) {
//         return (
//           "Location permission is blocked. " +
//           "Click the site icon near the address bar, " +
//           "open Site settings, change Location to Allow, " +
//           "and reload the page."
//         );
//       }
//     }

//     if (isGeolocationError(error)) {
//       switch (error.code) {
//         case 1:
//           return (
//             "Location permission denied. " +
//             "Click the site icon near the address bar → " +
//             "Site settings → Location → Allow → Reload."
//           );

//         case 2:
//           return (
//             "Current location is unavailable. " +
//             "Turn on Location Services and check your internet connection."
//           );

//         case 3:
//           return (
//             "Location request timed out. " +
//             "Turn on device Location Services, keep Wi-Fi enabled, " +
//             "and try again."
//           );

//         default:
//           return "Unable to get current location.";
//       }
//     }

//     return (
//       "Location not found. Please try again."
//     );
//   };

//   /*
//    * Start Day / End Day card click.
//    */
//   const initiateAction = async (
//     type: AttendanceAction
//   ): Promise<void> => {
//     if (
//       locationRequestRunning.current ||
//       activeAction !== null ||
//       saving
//     ) {
//       return;
//     }

//     locationRequestRunning.current = true;

//     try {
//       setActiveAction(type);
//       setShowPopup(null);
//       setCurrentLocation(null);

//       /*
//        * Ask permission/get fresh location.
//        * On success lat/lng are stored in localStorage.
//        */
//       const location = await getLocation();

//       console.log(
//         "Stored Latitude:",
//         localStorage.getItem("user_lat")
//       );

//       console.log(
//         "Stored Longitude:",
//         localStorage.getItem("user_lng")
//       );

//       setCurrentLocation(location);
//       setShowPopup(type);
//     } catch (error: unknown) {
//       /*
//        * Permission errors are handled using toast.
//        * No unnecessary console.error.
//        */
//       setShowPopup(null);
//       setCurrentLocation(null);

//       toast.error(
//         getLocationErrorMessage(error),
//         {
//           autoClose: 7000,
//         }
//       );
//     } finally {
//       locationRequestRunning.current = false;
//       setActiveAction(null);
//     }
//   };

//   const handleConfirm =
//     async (): Promise<void> => {
//       if (
//         showPopup !== "start" &&
//         showPopup !== "end"
//       ) {
//         return;
//       }

//       /*
//        * First use state location.
//        * Fallback to location stored in localStorage.
//        */
//       const location =
//         currentLocation ??
//         getStoredLocation();

//       if (!location) {
//         toast.error(
//           "Location not found. Please close the popup and try again."
//         );

//         return;
//       }

//       try {
//         setSaving(true);

//         const user = getUserData();
//         const empId = user?.id;

//         if (!empId) {
//           toast.error("Employee not found");
//           return;
//         }

//         const currentDateTime =
//           getCurrentDateTime();

//         const payload: AttendancePayload =
//           showPopup === "start"
//             ? {
//                 empId: String(empId),

//                 start_latitude: String(
//                   location.lat
//                 ),
//                 start_longitude: String(
//                   location.lng
//                 ),
//                 start_address: null,
//                 start_date_time:
//                   currentDateTime,

//                 end_latitude: null,
//                 end_longitude: null,
//                 end_address: null,
//                 end_date_time: null,
//               }
//             : {
//                 empId: String(empId),

//                 start_latitude: null,
//                 start_longitude: null,
//                 start_address: null,
//                 start_date_time: null,

//                 end_latitude: String(
//                   location.lat
//                 ),
//                 end_longitude: String(
//                   location.lng
//                 ),
//                 end_address: null,
//                 end_date_time:
//                   currentDateTime,
//               };

//         console.log(
//           "Attendance payload:",
//           payload
//         );

//         const response =
//           await axios.post<AttendanceApiResponse>(
//             `${apiUrl}/AttendanceAdd`,
//             payload
//           );

//         if (response.data?.success) {
//           toast.success(
//             response.data.message ||
//               "Attendance saved successfully"
//           );

//           setShowPopup(null);
//           setCurrentLocation(null);
//         } else {
//           toast.error(
//             response.data?.message ||
//               "Something went wrong"
//           );
//         }
//       } catch (error: unknown) {
//         if (
//           axios.isAxiosError<AttendanceApiResponse>(
//             error
//           )
//         ) {
//           toast.error(
//             error.response?.data?.message ||
//               "Attendance API failed"
//           );

//           return;
//         }

//         toast.error("Attendance API failed");
//       } finally {
//         setSaving(false);
//       }
//     };

//   const closePopup = (): void => {
//     if (saving) {
//       return;
//     }

//     setShowPopup(null);
//     setCurrentLocation(null);
//   };

//   const pageBusy =
//     activeAction !== null || saving;

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
//       <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//         <h1 className="text-2xl font-bold">
//           Dashboard
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <ActionCard
//           title="Start Day"
//           icon={<Clock size={22} />}
//           color="bg-green-500"
//           loading={
//             activeAction === "start"
//           }
//           disabled={pageBusy}
//           onClick={() => {
//             void initiateAction("start");
//           }}
//         />

//         <ActionCard
//           title="End Day"
//           icon={<LogOut size={22} />}
//           color="bg-red-500"
//           loading={activeAction === "end"}
//           disabled={pageBusy}
//           onClick={() => {
//             void initiateAction("end");
//           }}
//         />

//         <ActionCard
//           title="Monthly Report"
//           icon={<FileText size={22} />}
//           color="bg-orange-500"
//           loading={false}
//           disabled={pageBusy}
//           onClick={() => {
//             navigate(
//               "/users/monthly-report"
//             );
//           }}
//         />
//       </div>

//       {showPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="rounded-xl bg-[#70a0bf] p-2 text-white">
//                 <MapPin size={20} />
//               </div>

//               <h3 className="text-lg font-bold text-[#2c446b]">
//                 Confirm Action
//               </h3>
//             </div>

//             <p className="mb-4 leading-relaxed text-slate-600">
//               Are you sure you want to{" "}
//               <strong>
//                 {showPopup === "start"
//                   ? "start"
//                   : "end"}
//               </strong>{" "}
//               your work day?
//             </p>

//             {/* {currentLocation && (
//               <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-3">
//                 <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
//                   <MapPin size={16} />
//                   Location received successfully
//                 </div>

//                 <p className="mt-2 text-xs text-green-700">
//                   Latitude:{" "}
//                   {currentLocation.lat.toFixed(
//                     6
//                   )}
//                 </p>

//                 <p className="mt-1 text-xs text-green-700">
//                   Longitude:{" "}
//                   {currentLocation.lng.toFixed(
//                     6
//                   )}
//                 </p>

//                 <p className="mt-1 text-xs text-green-700">
//                   Accuracy:{" "}
//                   {Math.round(
//                     currentLocation.accuracy
//                   )}{" "}
//                   metres
//                 </p>
//               </div>
//             )} */}

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={closePopup}
//                 disabled={saving}
//                 className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   void handleConfirm();
//                 }}
//                 disabled={saving}
//                 className="flex-1 rounded-xl bg-[#2c446b] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {saving
//                   ? "Saving..."
//                   : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// interface ActionCardProps {
//   title: string;
//   icon: React.ReactNode;
//   color: string;
//   loading: boolean;
//   disabled: boolean;
//   onClick: () => void;
// }

// const ActionCard = ({
//   title,
//   icon,
//   color,
//   loading,
//   disabled,
//   onClick,
// }: ActionCardProps) => {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
//     >
//       <div className="flex items-center justify-between gap-4">
//         <h2 className="mt-1 text-xl font-bold text-slate-500 lg:text-2xl">
//           {loading
//             ? "Getting Location..."
//             : title}
//         </h2>

//         <div
//           className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${color}`}
//         >
//           {loading ? (
//             <LoaderCircle
//               size={22}
//               className="animate-spin"
//             />
//           ) : (
//             icon
//           )}
//         </div>
//       </div>
//     </button>
//   );
// };

import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MapPin,
  Clock,
  LogOut,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

type AttendanceAction = "start" | "end";
type PopupType = AttendanceAction | null;

interface UserData {
  id?: string | number;
}

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface AttendanceApiResponse {
  success?: boolean;
  message?: string;
}

interface LateStartInfo {
  attendance_start_time: string | null;
  end_date_time: string | null;
  first_call_time: string | null;
  late_start_minutes: number | null;
  total_working_hrs: number | string | null;
  late_start_status: string | null;
}

interface EmpDashboardApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    lateStartInfo?: LateStartInfo | null;
  };
}

interface AttendancePayload {
  empId: string;

  start_latitude: string | null;
  start_longitude: string | null;
  start_address: string | null;
  start_date_time: string | null;

  end_latitude: string | null;
  end_longitude: string | null;
  end_address: string | null;
  end_date_time: string | null;
}

const isGeolocationError = (
  error: unknown
): error is GeolocationPositionError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
};

export default function AttendanceDashboard() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] =
    useState<PopupType>(null);

  const [activeAction, setActiveAction] =
    useState<AttendanceAction | null>(null);

  const [saving, setSaving] =
    useState<boolean>(false);

  const [currentLocation, setCurrentLocation] =
    useState<LocationData | null>(null);

  const [dashboardInfo, setDashboardInfo] =
    useState<LateStartInfo | null>(null);

  const [dashboardLoading, setDashboardLoading] =
    useState<boolean>(false);

  const [showAttendanceInfo, setShowAttendanceInfo] =
    useState<boolean>(false);

  /*
   * Prevent multiple location requests from double click.
   */
  const locationRequestRunning =
    useRef<boolean>(false);

  const getUserData = (): UserData | null => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user) as UserData;
    } catch (error) {
      console.error(
        "Invalid user data in localStorage:",
        error
      );

      return null;
    }
  };

  const fetchDashboardInfo = async (): Promise<void> => {
    try {
      setDashboardLoading(true);

      const user = getUserData();
      const userId = user?.id;

      if (!userId) {
        setDashboardInfo(null);
        return;
      }

      const response = await axios.post<EmpDashboardApiResponse>(
        `${apiUrl}/Emp_dashboard`,
        {
          user_id: String(userId),
        }
      );

      if (response.data?.success) {
        setDashboardInfo(
          response.data?.data?.lateStartInfo || null
        );
      } else {
        setDashboardInfo(null);
      }
    } catch (error) {
      console.error("Dashboard API failed:", error);
      setDashboardInfo(null);
    } finally {
      setDashboardLoading(false);
    }
  };

  const getCurrentDateTime = (): string => {
    const now = new Date();

    const pad = (value: number): string =>
      String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(
      now.getMonth() + 1
    )}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}`;
  };

  /*
   * Convert geolocation callback to Promise.
   */
  const requestPosition = (
    options: PositionOptions
  ): Promise<GeolocationPosition> => {
    return new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            resolve(position);
          },
          (error: GeolocationPositionError) => {
            reject(error);
          },
          options
        );
      }
    );
  };


  /*
   * Desktop Chrome can sometimes timeout with getCurrentPosition()
   * even when Location permission is allowed.
   * watchPosition() gives the browser more time to resolve a network/Wi-Fi fix.
   */
  const requestPositionWithWatch = (
    timeoutMs = 35000
  ): Promise<GeolocationPosition> => {
    return new Promise<GeolocationPosition>(
      (resolve, reject) => {
        let settled = false;

        const timer = window.setTimeout(() => {
          if (settled) return;

          settled = true;
          navigator.geolocation.clearWatch(watchId);

          reject({
            code: 3,
            message: "Location request timed out",
          } as GeolocationPositionError);
        }, timeoutMs);

        const watchId =
          navigator.geolocation.watchPosition(
            (position: GeolocationPosition) => {
              if (settled) return;

              settled = true;
              window.clearTimeout(timer);
              navigator.geolocation.clearWatch(watchId);
              resolve(position);
            },
            (error: GeolocationPositionError) => {
              /*
               * Permission denied should fail immediately.
               * For POSITION_UNAVAILABLE/TIMEOUT, keep watching until
               * the manual timeout because Chrome may recover.
               */
              if (error.code === 1 && !settled) {
                settled = true;
                window.clearTimeout(timer);
                navigator.geolocation.clearWatch(watchId);
                reject(error);
              }
            },
            {
              enableHighAccuracy: false,
              timeout: timeoutMs,
              maximumAge: 30 * 60 * 1000,
            }
          );
      }
    );
  };

  /*
   * Store successful location.
   */
  const saveLocation = (
    position: GeolocationPosition
  ): LocationData => {
    const location: LocationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    localStorage.setItem(
      "user_lat",
      String(location.lat)
    );

    localStorage.setItem(
      "user_lng",
      String(location.lng)
    );

    localStorage.setItem(
      "location_accuracy",
      String(location.accuracy)
    );

    localStorage.setItem(
      "location_timestamp",
      String(location.timestamp)
    );

    localStorage.setItem(
      "location_permission",
      "granted"
    );

    setCurrentLocation(location);

    return location;
  };

  /*
   * Read location from localStorage.
   */
  const getStoredLocation =
    (): LocationData | null => {
      const latValue =
        localStorage.getItem("user_lat");

      const lngValue =
        localStorage.getItem("user_lng");

      const accuracyValue =
        localStorage.getItem(
          "location_accuracy"
        );

      const timestampValue =
        localStorage.getItem(
          "location_timestamp"
        );

      if (!latValue || !lngValue) {
        return null;
      }

      const lat = Number(latValue);
      const lng = Number(lngValue);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return null;
      }

      return {
        lat,
        lng,
        accuracy: Number(accuracyValue) || 0,
        timestamp:
          Number(timestampValue) || Date.now(),
      };
    };

  /*
   * Use the last successful browser location only when it is recent.
   * This helps desktop/laptop browsers where geolocation can temporarily
   * return POSITION_UNAVAILABLE even though location permission is enabled.
   */
  const getFreshStoredLocation =
    (): LocationData | null => {
      const storedLocation = getStoredLocation();

      if (!storedLocation) {
        return null;
      }

      const maxAgeMs = 30 * 60 * 1000; // 30 minutes
      const age = Date.now() - storedLocation.timestamp;

      if (age < 0 || age > maxAgeMs) {
        return null;
      }

      return storedLocation;
    };

  /*
   * Clear invalid or denied stored location.
   */
  const clearStoredLocation = (): void => {
    localStorage.removeItem("user_lat");
    localStorage.removeItem("user_lng");
    localStorage.removeItem(
      "location_accuracy"
    );
    localStorage.removeItem(
      "location_timestamp"
    );

    setCurrentLocation(null);
  };

  /*
   * Check current Chrome permission status.
   */
  const checkLocationPermission =
    async (): Promise<
      PermissionState | "unsupported"
    > => {
      if (!navigator.permissions?.query) {
        return "unsupported";
      }

      try {
        const permissionStatus =
          await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });

        return permissionStatus.state;
      } catch {
        return "unsupported";
      }
    };

  /*
   * Get location, store latitude and longitude,
   * then return the stored data.
   */
  const getLocation =
    async (): Promise<LocationData> => {
      if (!navigator.geolocation) {
        throw new Error("GEOLOCATION_NOT_SUPPORTED");
      }

      if (!window.isSecureContext) {
        throw new Error("LOCATION_REQUIRES_HTTPS");
      }

      /*
       * IMPORTANT:
       * Only latitude/longitude are required.
       * No address API or separate network check is used here.
       *
       * If the browser is showing the Allow prompt, this request waits.
       * Once the user allows location and coordinates are received,
       * saveLocation() writes them to localStorage.
       */
      const position = await requestPosition({
        enableHighAccuracy: false,
        timeout: 90000,
        maximumAge: 0,
      });

      return saveLocation(position);
    };

  const getLocationErrorMessage = (
    error: unknown
  ): string => {
    if (error instanceof Error) {
      if (
        error.message ===
        "GEOLOCATION_NOT_SUPPORTED"
      ) {
        return "This browser does not support location.";
      }

      if (
        error.message ===
        "LOCATION_REQUIRES_HTTPS"
      ) {
        return "Location requires HTTPS on the live website.";
      }
    }

    if (isGeolocationError(error)) {
      switch (error.code) {
        case 1:
          return (
            "Please allow Location permission. " +
            "After allowing it, click Start Day again."
          );

        case 2:
          return (
            "Please turn on device Location. " +
            "Then try Start Day again."
          );

        case 3:
          return (
            "Location is still not available. " +
            "Please keep Location ON and try again."
          );

        default:
          return "Unable to get latitude and longitude.";
      }
    }

    return "Unable to get latitude and longitude.";
  };

  /*
   * Start Day / End Day card click.
   */
  const initiateAction = async (
    type: AttendanceAction
  ): Promise<void> => {
    if (
      locationRequestRunning.current ||
      activeAction !== null ||
      saving
    ) {
      return;
    }

    setShowPopup(null);
    setCurrentLocation(null);

    /*
     * STEP 1:
     * Login/dashboard already tries to store lat/lng.
     * If they exist, do NOT request location again.
     * Open confirmation popup immediately.
     */
    const storedLocation = getStoredLocation();

    if (storedLocation) {
      setCurrentLocation(storedLocation);
      setShowPopup(type);
      return;
    }

    /*
     * STEP 2:
     * No lat/lng in localStorage means location was not available/allowed
     * during login. Inform the user, then request it now.
     *
     * If Chrome shows the Allow popup and the user allows it,
     * getLocation() stores lat/lng and this confirmation popup opens
     * automatically after coordinates are received.
     */
    toast.info(
      "Location is required. Please turn on/allow Location. The confirmation popup will open automatically after location is received.",
      { autoClose: 6000 }
    );

    locationRequestRunning.current = true;

    try {
      setActiveAction(type);

      const location = await getLocation();

      setCurrentLocation(location);
      setShowPopup(type);
    } catch (error: unknown) {
      setShowPopup(null);
      setCurrentLocation(null);

      toast.error(
        getLocationErrorMessage(error),
        { autoClose: 7000 }
      );
    } finally {
      locationRequestRunning.current = false;
      setActiveAction(null);
    }
  };

  const handleConfirm =
    async (): Promise<void> => {
      if (
        showPopup !== "start" &&
        showPopup !== "end"
      ) {
        return;
      }

      /*
       * First use state location.
       * Fallback to location stored in localStorage.
       */
      const location =
        currentLocation ??
        getStoredLocation();

      if (!location) {
        toast.error(
          "Location not found. Please close the popup and try again."
        );

        return;
      }

      try {
        setSaving(true);

        const user = getUserData();
        const empId = user?.id;

        if (!empId) {
          toast.error("Employee not found");
          return;
        }

        const currentDateTime =
          getCurrentDateTime();

        const payload: AttendancePayload =
          showPopup === "start"
            ? {
                empId: String(empId),

                start_latitude: String(
                  location.lat
                ),
                start_longitude: String(
                  location.lng
                ),
                start_address: null,
                start_date_time:
                  currentDateTime,

                end_latitude: null,
                end_longitude: null,
                end_address: null,
                end_date_time: null,
              }
            : {
                empId: String(empId),

                start_latitude: null,
                start_longitude: null,
                start_address: null,
                start_date_time: null,

                end_latitude: String(
                  location.lat
                ),
                end_longitude: String(
                  location.lng
                ),
                end_address: null,
                end_date_time:
                  currentDateTime,
              };

        console.log(
          "Attendance payload:",
          payload
        );

        const response =
          await axios.post<AttendanceApiResponse>(
            `${apiUrl}/AttendanceAdd`,
            payload
          );

        if (response.data?.success) {
          toast.success(
            response.data.message ||
              "Attendance saved successfully"
          );

          setShowPopup(null);
          setCurrentLocation(null);

          // Show information only after End Day succeeds.
          if (showPopup === "end") {
            setShowAttendanceInfo(true);
            await fetchDashboardInfo();
          }
        } else {
          toast.error(
            response.data?.message ||
              "Something went wrong"
          );
        }
      } catch (error: unknown) {
        if (
          axios.isAxiosError<AttendanceApiResponse>(
            error
          )
        ) {
          toast.error(
            error.response?.data?.message ||
              "Attendance API failed"
          );

          return;
        }

        toast.error("Attendance API failed");
      } finally {
        setSaving(false);
      }
    };

  const closePopup = (): void => {
    if (saving) {
      return;
    }

    setShowPopup(null);
    setCurrentLocation(null);
  };

  const pageBusy =
    activeAction !== null || saving;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          title="Start Day"
          icon={<Clock size={22} />}
          color="bg-green-500"
          loading={
            activeAction === "start"
          }
          disabled={pageBusy}
          onClick={() => {
            void initiateAction("start");
          }}
        />

        <ActionCard
          title="End Day"
          icon={<LogOut size={22} />}
          color="bg-red-500"
          loading={activeAction === "end"}
          disabled={pageBusy}
          onClick={() => {
            void initiateAction("end");
          }}
        />

        <ActionCard
          title="Monthly Report"
          icon={<FileText size={22} />}
          color="bg-orange-500"
          loading={false}
          disabled={pageBusy}
          onClick={() => {
            navigate(
              "/users/monthly-report"
            );
          }}
        />
      </div>

      {showAttendanceInfo && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#2c446b]">
              Attendance Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Today&apos;s attendance and call information
            </p>
          </div>

          {dashboardLoading && (
            <LoaderCircle
              size={20}
              className="animate-spin text-[#2c446b]"
            />
          )}
        </div>

        {dashboardLoading && !dashboardInfo ? (
          <div className="py-6 text-center text-sm text-slate-500">
            Loading information...
          </div>
        ) : dashboardInfo ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Start Day Time"
              value={dashboardInfo.attendance_start_time || "-"}
            />

            <InfoItem
              label="End Day Time"
              value={dashboardInfo.end_date_time || "-"}
            />

            <InfoItem
              label="First Call Time"
              value={dashboardInfo.first_call_time || "-"}
            />

            <InfoItem
              label="Late Start Minutes"
              value={
                dashboardInfo.late_start_minutes !== null &&
                dashboardInfo.late_start_minutes !== undefined
                  ? `${dashboardInfo.late_start_minutes} min`
                  : "-"
              }
            />

            <InfoItem
              label="Total Working Hrs"
              value={
                dashboardInfo.total_working_hrs !== null &&
                dashboardInfo.total_working_hrs !== undefined
                  ? String(dashboardInfo.total_working_hrs)
                  : "-"
              }
            />

            <InfoItem
              label="Late Start Status"
              value={dashboardInfo.late_start_status || "-"}
              valueClassName={
                dashboardInfo.late_start_status
                  ?.toLowerCase()
                  .includes("on time")
                  ? "text-green-600"
                  : dashboardInfo.late_start_status
                      ?.toLowerCase()
                      .includes("late")
                    ? "text-red-500"
                    : "text-slate-700"
              }
            />
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-slate-500">
            No attendance information found
          </div>
        )}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-[#70a0bf] p-2 text-white">
                <MapPin size={20} />
              </div>

              <h3 className="text-lg font-bold text-[#2c446b]">
                Confirm Action
              </h3>
            </div>

            <p className="mb-4 leading-relaxed text-slate-600">
              Are you sure you want to{" "}
              <strong>
                {showPopup === "start"
                  ? "start"
                  : "end"}
              </strong>{" "}
              your work day?
            </p>

            {/* {currentLocation && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <MapPin size={16} />
                  Location received successfully
                </div>

                <p className="mt-2 text-xs text-green-700">
                  Latitude:{" "}
                  {currentLocation.lat.toFixed(
                    6
                  )}
                </p>

                <p className="mt-1 text-xs text-green-700">
                  Longitude:{" "}
                  {currentLocation.lng.toFixed(
                    6
                  )}
                </p>

                <p className="mt-1 text-xs text-green-700">
                  Accuracy:{" "}
                  {Math.round(
                    currentLocation.accuracy
                  )}{" "}
                  metres
                </p>
              </div>
            )} */}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closePopup}
                disabled={saving}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleConfirm();
                }}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#2c446b] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

const InfoItem = ({
  label,
  value,
  valueClassName = "text-slate-700",
}: InfoItemProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm font-bold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

const ActionCard = ({
  title,
  icon,
  color,
  loading,
  disabled,
  onClick,
}: ActionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="mt-1 text-xl font-bold text-slate-500 lg:text-2xl">
          {loading
            ? "Waiting for Location..."
            : title}
        </h2>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${color}`}
        >
          {loading ? (
            <LoaderCircle
              size={22}
              className="animate-spin"
            />
          ) : (
            icon
          )}
        </div>
      </div>
    </button>
  );
};