import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

type IndustryItem = {
    id: string;
    name: string;
};

type UploadStats = {
    total_rows: number;
    imported: number;
    new: number;
    duplicate: number;
    skipped: number;
};

function getToken() {
    return localStorage.getItem("usertoken");
}

function getUserId() {
    return localStorage.getItem("User_Id");
}

function getUserName() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "";
    try {
        const user = JSON.parse(userStr);
        return user.name || "";
    } catch {
        return "";
    }
}

function pickName(obj: any) {
    return String(
        obj?.name ??
        obj?.title ??
        obj?.industry_name ??
        obj?.industry ??
        ""
    );
}

export default function UploadExhibitor() {
    const [industryId, setIndustryId] = useState("");
    const [industries, setIndustries] = useState<IndustryItem[]>([]);
    const [isIndustryLoading, setIsIndustryLoading] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [uploadErrors, setUploadErrors] = useState<string[]>([]);
    const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [showAllErrors, setShowAllErrors] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const UPLOAD_API = `${apiUrl}/exhibitors/exhibitordata/upload`;

    const authHeaders = () => {
        const token = getToken();
        return {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
        };
    };

    const clearUploadResult = () => {
        setUploadErrors([]);
        setUploadMessage("");
        setUploadStats(null);
        setShowAllErrors(false);
    };

    const fetchIndustries = async () => {
        try {
            setIsIndustryLoading(true);

            const res = await axios.post(
                `${apiUrl}/IndustryList`,
                {},
                { headers: authHeaders() }
            );

            if (res.data?.success) {
                const list: IndustryItem[] = Array.isArray(res.data?.data)
                    ? res.data.data.map((x: any) => ({
                        id: String(x.id),
                        name: pickName(x),
                    }))
                    : [];

                setIndustries(list);
            } else {
                setIndustries([]);
                toast.error(res.data?.message || "Failed to fetch industries");
            }
        } catch (error) {
            console.error(error);
            setIndustries([]);
            toast.error("Error fetching industries");
        } finally {
            setIsIndustryLoading(false);
        }
    };

    useEffect(() => {
        fetchIndustries();
    }, []);

    const handleIndustryChange = (value: string) => {
        setIndustryId(value);
        clearUploadResult();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const fileName = selectedFile.name.toLowerCase().trim();
        const isExcel = fileName.endsWith(".xls") || fileName.endsWith(".xlsx");

        if (!isExcel) {
            setFile(null);
            setFileError("Only Excel files (.xls, .xlsx) are allowed");
            e.target.value = "";
            return;
        }

        setFileError("");
        setFile(selectedFile);
        clearUploadResult();
    };

    const resetFileInput = () => {
        setFile(null);
        setFileError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const downloadSample = () => {
        const header = [
            "Company Name",
            "GST",
            "Exhibitor Name",
            "Exhibitor Mobile",
            "Exhibitor Email",
            "Exhibitor Designation",
            "Address",
            "City",
            "State",
            "Business Type",
            "Category",
            "Subcategory",
            "Contact One Name",
            "Contact One Mobile",
            "Contact One Email",
            "Contact One Designation",
            "Contact Two Name",
            "Contact Two Mobile",
            "Contact Two Email",
            "Contact Two Designation",
            "Expo Name",
            "Size SQ Meter",
        ];

        const csv = `${header.join(",")}\n`;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "exhibitor_sample.csv";
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleUpload = async () => {
        if (!file) return toast.error("Please select an Excel file");
        if (!industryId) return toast.error("Please select Industry");

        const user_id = getUserId();
        const user_name = getUserName();

        if (!user_id || !user_name) {
            toast.error("User info not found. Please login again.");
            return;
        }

        try {
            setIsUploading(true);
            clearUploadResult();

            const token = getToken();
            const formData = new FormData();

            formData.append("file", file);
            formData.append("industry_id", industryId);
            formData.append("user_id", user_id);
            formData.append("user_name", user_name);

            const res = await axios.post(UPLOAD_API, formData, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "Content-Type": "multipart/form-data",
                },
            });

            const stats = res.data?.stats || null;
            const msg = res.data?.message || "Upload processed";
            const errs = Array.isArray(res.data?.errors) ? res.data.errors : [];

            setUploadMessage(msg);
            setUploadErrors(errs);
            setUploadStats(stats);

            if (res.data?.success) {
                toast.success(msg);
                resetFileInput();
            } else {
                toast.error(msg);
            }
        } catch (err: any) {
            console.error(err);

            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Upload failed";

            const errs = Array.isArray(err?.response?.data?.errors)
                ? err.response.data.errors
                : [];

            setUploadMessage(msg);
            setUploadErrors(errs);
            setUploadStats(err?.response?.data?.stats || null);

            toast.error(msg);
        } finally {
            setIsUploading(false);
        }
    };

    const visibleErrors = showAllErrors ? uploadErrors : uploadErrors.slice(0, 20);
    const hasMoreErrors = uploadErrors.length > 20;

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">
                <div className="px-6 py-4 border-b flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">Upload Exhibitor Data</h2>

                    <button
                        onClick={downloadSample}
                        className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
                        type="button"
                    >
                        Download Sample
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 gap-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Industry</label>
                        <select
                            value={industryId}
                            onChange={(e) => handleIndustryChange(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                            disabled={isIndustryLoading}
                        >
                            <option value="">
                                {isIndustryLoading ? "Loading industries..." : "Select Industry"}
                            </option>
                            {industries.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Excel File</label>
                        <div className="mt-2 flex items-center justify-center w-full">
                            <label
                                className={[
                                    "w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500",
                                    uploadErrors.length > 0 ? "border-red-400" : "border-gray-200",
                                ].join(" ")}
                            >
                                <span className="text-sm text-gray-600">
                                    {file ? file.name : "Click to upload (.xls, .xlsx)"}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}

                        {(uploadMessage || uploadErrors.length > 0 || uploadStats) && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                {uploadMessage && (
                                    <p className="text-sm font-semibold text-red-700">{uploadMessage}</p>
                                )}

                                {uploadStats && (
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-red-700 sm:grid-cols-4">
                                        <div className="rounded-md bg-white/60 px-3 py-2 border border-red-100">
                                            <span className="font-semibold">Total Rows:</span> {uploadStats.total_rows ?? 0}
                                        </div>
                                        <div className="rounded-md bg-white/60 px-3 py-2 border border-red-100">
                                            <span className="font-semibold">Imported:</span> {uploadStats.imported ?? 0}
                                        </div>
                                        <div className="rounded-md bg-white/60 px-3 py-2 border border-red-100">
                                            <span className="font-semibold">New:</span> {uploadStats.new ?? 0}
                                        </div>
                                        <div className="rounded-md bg-white/60 px-3 py-2 border border-red-100">
                                            <span className="font-semibold">Duplicate:</span> {uploadStats.duplicate ?? 0}
                                        </div>
                                        <div className="rounded-md bg-white/60 px-3 py-2 border border-red-100">
                                            <span className="font-semibold">Skipped:</span> {uploadStats.skipped ?? 0}
                                        </div>
                                    </div>
                                )}

                                {uploadErrors.length > 0 && (
                                    <>
                                        <ul className="mt-3 max-h-56 overflow-auto space-y-1 text-sm text-red-700 list-disc pl-5">
                                            {visibleErrors.map((e, idx) => (
                                                <li key={`${e}-${idx}`}>{e}</li>
                                            ))}
                                        </ul>

                                        {hasMoreErrors && (
                                            <button
                                                type="button"
                                                className="mt-3 text-xs font-medium text-red-700 underline"
                                                onClick={() => setShowAllErrors((s) => !s)}
                                            >
                                                {showAllErrors ? "Show less" : `Show all (${uploadErrors.length})`}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        {isUploading ? "Uploading..." : "Upload Excel"}
                    </button>
                </div>
            </div>
        </div>
    );
}