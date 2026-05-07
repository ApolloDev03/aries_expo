import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPin, Clock, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

type PopupType = "start" | "end" | "leave" | null;

export default function AttendanceDashboard() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState<PopupType>(null);
    const [loading, setLoading] = useState(false);

    const getUserData = () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");

        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
            now.getDate()
        )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    };

  
    const getLocation = () => {
        return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    localStorage.setItem("user_lat", String(lat));
                    localStorage.setItem("user_lng", String(lng));
                    localStorage.setItem("location_permission", "granted");

                    resolve({ lat, lng });
                },
                () => {
                    localStorage.setItem("location_permission", "denied");
                    reject("denied");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    };

    const initiateAction = async (type: "start" | "end" | "leave") => {
        if (type === "leave") {
            setShowPopup("leave");
            return;
        }

        try {
            setLoading(true);
            await getLocation();
            setShowPopup(type);
        } catch (err) {
            setShowPopup(null);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (showPopup === "leave") {
            toast.success("Leave Applied Successfully");
            setShowPopup(null);
            return;
        }

        try {
            setLoading(true);

            const user = getUserData();
            const empId = user?.id;

            const lat = localStorage.getItem("user_lat");
            const lng = localStorage.getItem("user_lng");

            if (!empId) {
                toast.error("Employee not found");
                return;
            }

            if (!lat || !lng) {
                toast.error("Location not found. Please allow location access.");
                return;
            }

            const currentDateTime = getCurrentDateTime();

            const payload =
                showPopup === "start"
                    ? {
                        empId: String(empId),
                        start_latitude: lat,
                        start_longitude: lng,
                        start_address: null,
                        start_date_time: currentDateTime,

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

                        end_latitude: lat,
                        end_longitude: lng,
                        end_address: null,
                        end_date_time: currentDateTime,
                    };

            const res = await axios.post(
                `${apiUrl}/AttendanceAdd`,
                payload
            );

            if (res.data?.success) {
                toast.success(res.data?.message || "Attendance saved successfully");
                setShowPopup(null);
            } else {
                toast.error(res.data?.message || "Something went wrong");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Attendance API failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard
                    title="Start Day"
                    icon={<Clock size={22} />}
                    color="bg-green-500"
                    onClick={() => !loading && initiateAction("start")}
                />

                <ActionCard
                    title="End Day"
                    icon={<LogOut size={22} />}
                    color="bg-red-500"
                    onClick={() => !loading && initiateAction("end")}
                />

                <ActionCard
                    title="Monthly Report"
                    icon={<FileText size={22} />}
                    color="bg-orange-500"
                    onClick={() => navigate("/users/monthly-report")}
                />
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#70a0bf] p-2 rounded-xl text-white">
                                <MapPin size={20} />
                            </div>

                            <h3 className="text-lg font-bold text-[#2c446b]">
                                Confirm Action
                            </h3>
                        </div>

                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Are you sure you want to{" "}
                            <strong>{showPopup === "start" ? "start" : "end"}</strong> your
                            work day?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPopup(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2c446b] text-white font-semibold disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const ActionCard = ({
    title,
    icon,
    color,
    onClick,
}: {
    title: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className="cursor-pointer rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
    >
        <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-500 mt-1">
                {title}
            </h2>

            <div
                className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-sm`}
            >
                {icon}
            </div>
        </div>
    </div>
);