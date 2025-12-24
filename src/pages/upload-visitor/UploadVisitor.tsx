// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // Types (UI)
// type VisitorType = "pre_register" | "industry" | "visited_visitor" | "";

// // API Types
// type IndustryItem = { id: number; name: string };
// type ExpoItem = { expoid: number; exponame: string };

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

// // ✅ persist keys (so reload = selected again)
// const LS_TYPE = "uploadVisitor_type";
// const LS_INDUSTRY = "uploadVisitor_industryId";
// const LS_EXPO = "uploadVisitor_expoId";

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

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // expo required for pre_register + visited
//   const showExpo = type === "pre_register" || type === "visited_visitor";

//   const UPLOAD_API = `${apiUrl}/Visitordata/Upload`;

//   // ---------------------------
//   // Restore selections on first load
//   // ---------------------------
//   useEffect(() => {
//     const savedType = (localStorage.getItem(LS_TYPE) || "") as VisitorType;
//     const savedIndustry = localStorage.getItem(LS_INDUSTRY) || "";
//     const savedExpo = localStorage.getItem(LS_EXPO) || "";

//     if (savedType) setType(savedType);
//     if (savedIndustry) setIndustryId(savedIndustry);
//     if (savedExpo) setExpoId(savedExpo);
//   }, []);

//   // ---------------------------
//   // Save selections whenever they change
//   // ---------------------------
//   useEffect(() => {
//     localStorage.setItem(LS_TYPE, type);
//   }, [type]);

//   useEffect(() => {
//     localStorage.setItem(LS_INDUSTRY, industryId);
//   }, [industryId]);

//   useEffect(() => {
//     localStorage.setItem(LS_EXPO, expoId);
//   }, [expoId]);

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

//         // ✅ if saved expoId doesn't exist in this industry, clear it
//         if (expoId && !list.some((x) => String(x.expoid) === String(expoId))) {
//           setExpoId("");
//         }
//       } else {
//         setExpos([]);
//         toast.error(res.data?.message || "Failed to fetch expos");
//       }
//     } catch (err) {
//       console.error(err);
//       setExpos([]);
//       toast.error("Error fetching expos");
//     } finally {
//       setIsExpoLoading(false);
//     }
//   };

//   // ✅ Whenever industryId changes -> fetch expos
//   useEffect(() => {
//     if (industryId) fetchExposByIndustry(industryId);
//     else setExpos([]);
//     // NOTE: we DO NOT auto clear expoId here (we clear it only when user changes industry)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [industryId]);

//   // ✅ If type changes and expo is not required -> clear expo
//   useEffect(() => {
//     if (!showExpo) setExpoId("");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [type]);

//   // ---------------------------
//   // UI Handlers (IMPORTANT)
//   // ---------------------------
//   const handleTypeChange = (v: VisitorType) => {
//     setType(v);

//     // when switching type, if expo required, keep expoId.
//     // if not required, expoId will be cleared by useEffect above.
//   };

//   const handleIndustryChange = (v: string) => {
//     // ✅ user changed industry => clear expo selection
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
//   };

//   const resetFileInput = () => {
//     setFile(null);
//     setFileError("");
//     if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ allows same file re-select
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

//         // ✅ KEEP type/industry/expo as selected
//         // ✅ only reset file (so next upload can work properly)
//         resetFileInput();
//       } else {
//         toast.error(res.data?.message || "Upload failed");
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error(
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Error uploading Excel"
//       );
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // preview labels
//   const selectedIndustryName = useMemo(() => {
//     const item = industries.find((x) => String(x.id) === String(industryId));
//     return item?.name || "";
//   }, [industryId, industries]);

//   const selectedExpoName = useMemo(() => {
//     const item = expos.find((x) => String(x.expoid) === String(expoId));
//     return item?.exponame || "";
//   }, [expoId, expos]);

//   return (
//     <div className="flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-2xl font-bold text-gray-800">Upload Visitor Data</h2>
//         </div>

//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Type */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Type</label>
//             <select
//               value={type}
//               onChange={(e) => handleTypeChange(e.target.value as VisitorType)}
//               className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
//               className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
//                 className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
//               <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500">
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // expo required for pre_register + visited
  const showExpo = type === "pre_register" || type === "visited_visitor";

  const UPLOAD_API = `${apiUrl}/Visitordata/Upload`;

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

        // ✅ keep expoId only if it exists in new list, else clear
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

  // When industry changes -> fetch expos
  useEffect(() => {
    if (industryId) fetchExposByIndustry(industryId);
    else {
      setExpos([]);
      setExpoId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industryId]);

  // If type changes & expo not required, clear expo
  useEffect(() => {
    if (!showExpo) setExpoId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleTypeChange = (v: VisitorType) => setType(v);

  const handleIndustryChange = (v: string) => {
    // ✅ user changed industry => clear expo selection, then fetch list
    setIndustryId(v);
    setExpoId("");
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
  };

  const resetFileInput = () => {
    setFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ allow same file select again
  };

  // ---------------------------
  // Download Sample (CSV for Excel/WPS)
  // ---------------------------
  const downloadSample = () => {
    // ✅ your 2nd image header format
    const header = ["Name", "Mobile", "Email", "Company", "State", "City"];
    const csv = `${header.join(",")}\n`; // only header (as you asked)

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
      } else {
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.error
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Optional preview labels
  const selectedIndustryName = useMemo(() => {
    const item = industries.find((x) => String(x.id) === String(industryId));
    return item?.name || "";
  }, [industryId, industries]);

  const selectedExpoName = useMemo(() => {
    const item = expos.find((x) => String(x.expoid) === String(expoId));
    return item?.exponame || "";
  }, [expoId, expos]);

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
                onChange={(e) => setExpoId(e.target.value)}
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
              <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500">
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

