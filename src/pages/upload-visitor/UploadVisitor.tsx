// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // Types (UI)
// type VisitorType = "pre_register" | "industry" | "visited_visitor" | "";

// // API Types
// type IndustryItem = { id: number; name: string };
// type ExpoItem = { expoid: number; exponame: string };

// type UploadStats = { total_rows: number; imported: number; skipped: number };

// function getToken() {
//   return localStorage.getItem("usertoken");
// }
// function getUserId() {
//   return localStorage.getItem("User_Id");
// }
// function getUserName() {
//   const userStr = localStorage.getItem("user");
//   if (!userStr) return "";
//   try {
//     const user = JSON.parse(userStr);
//     return user.name || "";
//   } catch {
//     return "";
//   }
// }

// export default function UploadVisitor() {
//   const [type, setType] = useState<VisitorType>("");
//   const [industryId, setIndustryId] = useState<string>("");
//   const [expoId, setExpoId] = useState<string>("");

//   const [industries, setIndustries] = useState<IndustryItem[]>([]);
//   const [expos, setExpos] = useState<ExpoItem[]>([]);

//   const [isIndustryLoading, setIsIndustryLoading] = useState(false);
//   const [isExpoLoading, setIsExpoLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);

//   const [file, setFile] = useState<File | null>(null);
//   const [fileError, setFileError] = useState<string>("");

//   // ✅ NEW: Upload errors + stats for UI
//   const [uploadErrors, setUploadErrors] = useState<string[]>([]);
//   const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
//   const [uploadMessage, setUploadMessage] = useState<string>("");
//   const [showAllErrors, setShowAllErrors] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // expo required for pre_register + visited
//   const showExpo = type === "pre_register" || type === "visited_visitor";

//   const UPLOAD_API = `${apiUrl}/Visitordata/Upload`;

//   // ---------------------------
//   // Fetch Industry List
//   // ---------------------------
//   const fetchIndustries = async () => {
//     try {
//       setIsIndustryLoading(true);

//       const token = getToken();
//       const res = await axios.post(
//         `${apiUrl}/IndustryList`,
//         {},
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data?.success) setIndustries(res.data?.data || []);
//       else toast.error(res.data?.message || "Failed to fetch industries");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error fetching industries");
//     } finally {
//       setIsIndustryLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIndustries();
//   }, []);

//   // ---------------------------
//   // Fetch Expos by Industry
//   // ---------------------------
//   const fetchExposByIndustry = async (id: string) => {
//     if (!id) {
//       setExpos([]);
//       setExpoId("");
//       return;
//     }

//     try {
//       setIsExpoLoading(true);

//       const token = getToken();
//       const res = await axios.post(
//         `${apiUrl}/Industrywise/Expo`,
//         { industry_id: id },
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data?.success) {
//         const list: ExpoItem[] = res.data?.data || [];
//         setExpos(list);

//         setExpoId((prev) =>
//           prev && list.some((x) => String(x.expoid) === String(prev)) ? prev : ""
//         );
//       } else {
//         setExpos([]);
//         setExpoId("");
//         toast.error(res.data?.message || "Failed to fetch expos");
//       }
//     } catch (err) {
//       console.error(err);
//       setExpos([]);
//       setExpoId("");
//       toast.error("Error fetching expos");
//     } finally {
//       setIsExpoLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (industryId) fetchExposByIndustry(industryId);
//     else {
//       setExpos([]);
//       setExpoId("");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [industryId]);

//   useEffect(() => {
//     if (!showExpo) setExpoId("");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [type]);

//   // ---------------------------
//   // Handlers
//   // ---------------------------
//   const handleTypeChange = (v: VisitorType) => setType(v);

//   const handleIndustryChange = (v: string) => {
//     setIndustryId(v);
//     setExpoId("");
//   };

//   // ---------------------------
//   // File handler (Excel only)
//   // ---------------------------
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     const fileName = selectedFile.name.toLowerCase().trim();
//     const isExcel = fileName.endsWith(".xls") || fileName.endsWith(".xlsx");

//     if (!isExcel) {
//       setFile(null);
//       setFileError("Only Excel files (.xls, .xlsx) are allowed");
//       e.target.value = "";
//       return;
//     }

//     setFileError("");
//     setFile(selectedFile);

//     // ✅ clear previous upload errors when user selects a new file
//     setUploadErrors([]);
//     setUploadStats(null);
//     setUploadMessage("");
//     setShowAllErrors(false);
//   };

//   const resetFileInput = () => {
//     setFile(null);
//     setFileError("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ---------------------------
//   // Download Sample (CSV for Excel/WPS)
//   // ---------------------------
//   const downloadSample = () => {
//     const header = ["Name", "Mobile", "Email", "Company", "State", "City"];
//     const csv = `${header.join(",")}\n`;

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "visitor_sample.csv";
//     a.click();

//     URL.revokeObjectURL(url);
//   };

//   // ---------------------------
//   // Upload Excel
//   // ---------------------------
//   const handleUpload = async () => {
//     if (!file) return toast.error("Please select an Excel file");
//     if (!type) return toast.error("Please select Type");
//     if (!industryId) return toast.error("Please select Industry");
//     if (showExpo && !expoId) return toast.error("Please select Expo");

//     const user_id = getUserId();
//     const user_name = getUserName();
//     if (!user_id || !user_name) {
//       toast.error("User info not found. Please login again.");
//       return;
//     }

//     try {
//       setIsUploading(true);

//       // ✅ reset last result before uploading
//       setUploadErrors([]);
//       setUploadStats(null);
//       setUploadMessage("");
//       setShowAllErrors(false);

//       const token = getToken();
//       const apiType = type === "visited_visitor" ? "visited" : type;

//       const form = new FormData();
//       form.append("type", apiType);
//       form.append("industry_id", industryId);
//       form.append("user_id", user_id);
//       form.append("user_name", user_name);
//       if (apiType === "visited" || apiType === "pre_register") {
//         form.append("expo_id", expoId);
//       }
//       form.append("file", file);

//       const res = await axios.post(UPLOAD_API, form, {
//         headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//       });

//       if (res.data?.success) {
//         toast.success(res.data?.message || "Visitor Excel uploaded successfully");
//         resetFileInput();

//         // ✅ clear UI errors on success
//         setUploadErrors([]);
//         setUploadStats(res.data?.stats || null);
//         setUploadMessage(res.data?.message || "");
//       } else {
//         // ✅ show errors in UI (red box)
//         const msg = res.data?.message || "Upload failed";
//         const errs: string[] = Array.isArray(res.data?.errors) ? res.data.errors : [];
//         setUploadMessage(msg);
//         setUploadErrors(errs);
//         setUploadStats(res.data?.stats || null);

//         toast.error(msg);
//       }
//     } catch (err: any) {
//       console.error(err);

//       const msg =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Upload failed";

//       const errs: string[] = Array.isArray(err?.response?.data?.errors)
//         ? err.response.data.errors
//         : [];

//       setUploadMessage(msg);
//       setUploadErrors(errs);
//       setUploadStats(err?.response?.data?.stats || null);

//       toast.error(msg);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const selectedIndustryName = useMemo(() => {
//     const item = industries.find((x) => String(x.id) === String(industryId));
//     return item?.name || "";
//   }, [industryId, industries]);

//   const selectedExpoName = useMemo(() => {
//     const item = expos.find((x) => String(x.expoid) === String(expoId));
//     return item?.exponame || "";
//   }, [expoId, expos]);

//   const visibleErrors = showAllErrors ? uploadErrors : uploadErrors.slice(0, 20);
//   const hasMoreErrors = uploadErrors.length > 20;

//   return (
//     <div className="flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
//         <div className="px-6 py-4 border-b flex items-center justify-between gap-3">
//           <h2 className="text-2xl font-bold text-gray-800">Upload Visitor Data</h2>

//           <button
//             onClick={downloadSample}
//             className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
//             type="button"
//           >
//             Download Sample
//           </button>
//         </div>

//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Type */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Type</label>
//             <select
//               value={type}
//               onChange={(e) => handleTypeChange(e.target.value as VisitorType)}
//               className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//             >
//               <option value="">Select Type</option>
//               <option value="pre_register">Pre Register</option>
//               <option value="industry">Industry</option>
//               <option value="visited_visitor">Visited Visitor</option>
//             </select>
//           </div>

//           {/* Industry */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Industry</label>
//             <select
//               value={industryId}
//               onChange={(e) => handleIndustryChange(e.target.value)}
//               className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//               disabled={isIndustryLoading}
//             >
//               <option value="">
//                 {isIndustryLoading ? "Loading industries..." : "Select Industry"}
//               </option>
//               {industries.map((item) => (
//                 <option key={item.id} value={String(item.id)}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Expo */}
//           {showExpo && (
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-gray-700">Expo</label>
//               <select
//                 value={expoId}
//                 onChange={(e) => setExpoId(e.target.value)}
//                 className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                 disabled={!industryId || isExpoLoading}
//               >
//                 <option value="">
//                   {!industryId
//                     ? "Select Industry first"
//                     : isExpoLoading
//                       ? "Loading expos..."
//                       : "Select Expo"}
//                 </option>
//                 {expos.map((item) => (
//                   <option key={item.expoid} value={String(item.expoid)}>
//                     {item.exponame}
//                   </option>
//                 ))}
//               </select>

//               {(selectedIndustryName || selectedExpoName) && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   Selected: {selectedIndustryName}
//                   {selectedExpoName ? ` → ${selectedExpoName}` : ""}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* File Upload */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-medium text-gray-700">Excel File</label>
//             <div className="mt-2 flex items-center justify-center w-full">
//               <label
//                 className={[
//                   "w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500",
//                  "border-gray-200",
//                 ].join(" ")}
//               >
//                 <span className="text-sm text-gray-600">
//                   {file ? file.name : "Click to upload (.xls, .xlsx)"}
//                 </span>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}

//             {/* ✅ NEW: Show upload errors in red */}
//             {(uploadMessage || uploadErrors.length > 0) && (
//               <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
//                 {uploadMessage && (
//                   <p className="text-sm font-semibold text-red-700">{uploadMessage}</p>
//                 )}

//                 {uploadStats && (
//                   <p className="text-xs text-red-700 mt-1">
//                     Total: {uploadStats.total_rows} • Imported: {uploadStats.imported} • Skipped:{" "}
//                     {uploadStats.skipped}
//                   </p>
//                 )}

//                 {uploadErrors.length > 0 && (
//                   <>
//                     <ul className="mt-3 max-h-56 overflow-auto space-y-1 text-sm text-red-700 list-disc pl-5">
//                       {visibleErrors.map((e, idx) => (
//                         <li key={`${e}-${idx}`}>{e}</li>
//                       ))}
//                     </ul>

//                     {hasMoreErrors && (
//                       <button
//                         type="button"
//                         className="mt-3 text-xs font-medium text-red-700 underline"
//                         onClick={() => setShowAllErrors((s) => !s)}
//                       >
//                         {showAllErrors
//                           ? "Show less"
//                           : `Show all (${uploadErrors.length})`}
//                       </button>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex items-center justify-between gap-3">
//           <button
//             onClick={handleUpload}
//             disabled={isUploading}
//             className="w-full md:w-auto px-6 py-2 bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//           >
//             {isUploading ? "Uploading..." : "Upload Excel"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

// Types (UI)
type VisitorType = "pre_register" | "industry" | "visited_visitor" | "";

// API Types
type IndustryItem = { id: number; name: string };
type ExpoItem = { expoid: number; exponame: string };

type UploadStats = { total_rows: number; imported: number; skipped: number };

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

export default function UploadVisitor() {
  const [type, setType] = useState<VisitorType>("");
  const [industryId, setIndustryId] = useState<string>("");
  const [expoId, setExpoId] = useState<string>("");

  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [expos, setExpos] = useState<ExpoItem[]>([]);

  const [isIndustryLoading, setIsIndustryLoading] = useState(false);
  const [isExpoLoading, setIsExpoLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  // ✅ Upload errors + stats for UI
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [showAllErrors, setShowAllErrors] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // expo required for pre_register + visited
  const showExpo = type === "pre_register" || type === "visited_visitor";

  const UPLOAD_API = `${apiUrl}/Visitordata/Upload`;

  // ✅ helper: clear upload result/errors when user changes selections
  const clearUploadResult = () => {
    setUploadErrors([]);
    setUploadMessage("");
    setUploadStats(null);
    setShowAllErrors(false);
  };

  // ---------------------------
  // Fetch Industry List
  // ---------------------------
  const fetchIndustries = async () => {
    try {
      setIsIndustryLoading(true);

      const token = getToken();
      const res = await axios.post(
        `${apiUrl}/IndustryList`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) setIndustries(res.data?.data || []);
      else toast.error(res.data?.message || "Failed to fetch industries");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching industries");
    } finally {
      setIsIndustryLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // ---------------------------
  // Fetch Expos by Industry
  // ---------------------------
  const fetchExposByIndustry = async (id: string) => {
    if (!id) {
      setExpos([]);
      setExpoId("");
      return;
    }

    try {
      setIsExpoLoading(true);

      const token = getToken();
      const res = await axios.post(
        `${apiUrl}/Industrywise/Expo`,
        { industry_id: id },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        const list: ExpoItem[] = res.data?.data || [];
        setExpos(list);

        setExpoId((prev) =>
          prev && list.some((x) => String(x.expoid) === String(prev)) ? prev : ""
        );
      } else {
        setExpos([]);
        setExpoId("");
        toast.error(res.data?.message || "Failed to fetch expos");
      }
    } catch (err) {
      console.error(err);
      setExpos([]);
      setExpoId("");
      toast.error("Error fetching expos");
    } finally {
      setIsExpoLoading(false);
    }
  };

  useEffect(() => {
    if (industryId) fetchExposByIndustry(industryId);
    else {
      setExpos([]);
      setExpoId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industryId]);

  useEffect(() => {
    if (!showExpo) setExpoId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleTypeChange = (v: VisitorType) => {
    setType(v);
    clearUploadResult(); // ✅ hide errors when type changes
  };

  const handleIndustryChange = (v: string) => {
    setIndustryId(v);
    setExpoId("");
    clearUploadResult(); // ✅ hide errors when industry changes
  };

  // ---------------------------
  // File handler (Excel only)
  // ---------------------------
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

    // ✅ clear previous upload errors when user selects a new file
    clearUploadResult();
  };

  const resetFileInput = () => {
    setFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------------------------
  // Download Sample (CSV for Excel/WPS)
  // ---------------------------
  const downloadSample = () => {
    const header = ["Name", "Mobile", "Email", "Company", "State", "City"];
    const csv = `${header.join(",")}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "visitor_sample.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // ---------------------------
  // Upload Excel
  // ---------------------------
  const handleUpload = async () => {
    if (!file) return toast.error("Please select an Excel file");
    if (!type) return toast.error("Please select Type");
    if (!industryId) return toast.error("Please select Industry");
    if (showExpo && !expoId) return toast.error("Please select Expo");

    const user_id = getUserId();
    const user_name = getUserName();
    if (!user_id || !user_name) {
      toast.error("User info not found. Please login again.");
      return;
    }

    try {
      setIsUploading(true);

      // ✅ reset last result before uploading
      clearUploadResult();

      const token = getToken();
      const apiType = type === "visited_visitor" ? "visited" : type;

      const form = new FormData();
      form.append("type", apiType);
      form.append("industry_id", industryId);
      form.append("user_id", user_id);
      form.append("user_name", user_name);
      if (apiType === "visited" || apiType === "pre_register") {
        form.append("expo_id", expoId);
      }
      form.append("file", file);

      const res = await axios.post(UPLOAD_API, form, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (res.data?.success) {
        toast.success(res.data?.message || "Visitor Excel uploaded successfully");
        resetFileInput();

        // ✅ clear UI errors on success (and show stats/message if you want)
        setUploadErrors([]);
        setUploadStats(res.data?.stats || null);
        setUploadMessage(res.data?.message || "");
      } else {
        // ✅ show errors in UI (red box)
        const msg = res.data?.message || "Upload failed";
        const errs: string[] = Array.isArray(res.data?.errors) ? res.data.errors : [];
        setUploadMessage(msg);
        setUploadErrors(errs);
        setUploadStats(res.data?.stats || null);

        toast.error(msg);
      }
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Upload failed";

      const errs: string[] = Array.isArray(err?.response?.data?.errors)
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

  const selectedIndustryName = useMemo(() => {
    const item = industries.find((x) => String(x.id) === String(industryId));
    return item?.name || "";
  }, [industryId, industries]);

  const selectedExpoName = useMemo(() => {
    const item = expos.find((x) => String(x.expoid) === String(expoId));
    return item?.exponame || "";
  }, [expoId, expos]);

  const visibleErrors = showAllErrors ? uploadErrors : uploadErrors.slice(0, 20);
  const hasMoreErrors = uploadErrors.length > 20;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Upload Visitor Data</h2>

          <button
            onClick={downloadSample}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            type="button"
          >
            Download Sample
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as VisitorType)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="">Select Type</option>
              <option value="pre_register">Pre Register</option>
              <option value="industry">Industry</option>
              <option value="visited_visitor">Visited Visitor</option>
            </select>
          </div>

          {/* Industry */}
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
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Expo */}
          {showExpo && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Expo</label>
              <select
                value={expoId}
                onChange={(e) => {
                  setExpoId(e.target.value);
                  clearUploadResult(); // ✅ hide errors when expo changes
                }}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                disabled={!industryId || isExpoLoading}
              >
                <option value="">
                  {!industryId
                    ? "Select Industry first"
                    : isExpoLoading
                      ? "Loading expos..."
                      : "Select Expo"}
                </option>
                {expos.map((item) => (
                  <option key={item.expoid} value={String(item.expoid)}>
                    {item.exponame}
                  </option>
                ))}
              </select>

              {(selectedIndustryName || selectedExpoName) && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedIndustryName}
                  {selectedExpoName ? ` → ${selectedExpoName}` : ""}
                </p>
              )}
            </div>
          )}

          {/* File Upload */}
          <div className="md:col-span-2">
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

            {/* Show upload errors in red */}
            {(uploadMessage || uploadErrors.length > 0) && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                {uploadMessage && (
                  <p className="text-sm font-semibold text-red-700">{uploadMessage}</p>
                )}

                {uploadStats && (
                  <p className="text-xs text-red-700 mt-1">
                    Total: {uploadStats.total_rows} • Imported: {uploadStats.imported} • Skipped:{" "}
                    {uploadStats.skipped}
                  </p>
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

        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex items-center justify-between gap-3">
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
