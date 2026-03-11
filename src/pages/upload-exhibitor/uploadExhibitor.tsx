// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // -------------------- Types --------------------
// type UploadType = "pre_register" | "industry" | "visited_visitor" | "";

// type IndustryItem = { id: string; name: string };
// type ExpoItem = { expoid: string; exponame: string };
// type OptionItem = { id: string; name: string };

// type UploadStats = {
//     total_rows: number;
//     imported: number;
//     skipped: number;
// };

// // -------------------- Helpers --------------------
// function getToken() {
//     return localStorage.getItem("usertoken");
// }

// function getUserId() {
//     return localStorage.getItem("User_Id");
// }

// function getUserName() {
//     const userStr = localStorage.getItem("user");
//     if (!userStr) return "";
//     try {
//         const user = JSON.parse(userStr);
//         return user.name || "";
//     } catch {
//         return "";
//     }
// }

// function pickId(obj: any) {
//     return String(
//         obj?.id ??
//         obj?.business_type_id ??
//         obj?.industry_category_id ??
//         obj?.subcategory_id ??
//         obj?.sub_category_id ??
//         obj?.expoid ??
//         ""
//     );
// }

// function pickName(obj: any) {
//     return String(
//         obj?.name ??
//         obj?.title ??
//         obj?.business_type ??
//         obj?.business_type_name ??
//         obj?.industry_category_name ??
//         obj?.category_name ??
//         obj?.subcategory_name ??
//         obj?.sub_category_name ??
//         obj?.exponame ??
//         ""
//     );
// }

// export default function UploadExhibitor() {
//     const [type, setType] = useState<UploadType>("");
//     const [industryId, setIndustryId] = useState("");
//     const [expoId, setExpoId] = useState("");
//     const [businessTypeId, setBusinessTypeId] = useState("");
//     const [categoryId, setCategoryId] = useState("");
//     const [subCategoryId, setSubCategoryId] = useState("");

//     const [industries, setIndustries] = useState<IndustryItem[]>([]);
//     const [expos, setExpos] = useState<ExpoItem[]>([]);
//     const [businessTypeOptions, setBusinessTypeOptions] = useState<OptionItem[]>([]);
//     const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
//     const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);

//     const [isIndustryLoading, setIsIndustryLoading] = useState(false);
//     const [isExpoLoading, setIsExpoLoading] = useState(false);
//     const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
//     const [loadingCategory, setLoadingCategory] = useState(false);
//     const [loadingSubcategory, setLoadingSubcategory] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);

//     const [file, setFile] = useState<File | null>(null);
//     const [fileError, setFileError] = useState("");

//     const [uploadErrors, setUploadErrors] = useState<string[]>([]);
//     const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
//     const [uploadMessage, setUploadMessage] = useState("");
//     const [showAllErrors, setShowAllErrors] = useState(false);

//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     const showExpo = type === "pre_register" || type === "visited_visitor";

//     // change endpoint if your exhibitor upload api is different
//     const UPLOAD_API = `${apiUrl}/Exhibitordata/Upload`;

//     const authHeaders = () => {
//         const token = getToken();
//         return {
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             "Content-Type": "application/json",
//         };
//     };

//     const clearUploadResult = () => {
//         setUploadErrors([]);
//         setUploadMessage("");
//         setUploadStats(null);
//         setShowAllErrors(false);
//     };

//     // -------------------- Industry --------------------
//     const fetchIndustries = async () => {
//         try {
//             setIsIndustryLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/IndustryList`,
//                 {},
//                 { headers: authHeaders() }
//             );

//             if (res.data?.success) {
//                 const list: IndustryItem[] = Array.isArray(res.data?.data)
//                     ? res.data.data.map((x: any) => ({
//                         id: String(x.id),
//                         name: pickName(x),
//                     }))
//                     : [];

//                 setIndustries(list);
//             } else {
//                 setIndustries([]);
//                 toast.error(res.data?.message || "Failed to fetch industries");
//             }
//         } catch (e) {
//             console.error(e);
//             setIndustries([]);
//             toast.error("Error fetching industries");
//         } finally {
//             setIsIndustryLoading(false);
//         }
//     };

//     // -------------------- Expo by Industry --------------------
//     const fetchExpos = async (id: string) => {
//         if (!id) {
//             setExpos([]);
//             setExpoId("");
//             return;
//         }

//         try {
//             setIsExpoLoading(true);
//             const token = getToken();

//             const res = await axios.post(
//                 `${apiUrl}/Industrywise/Expo`,
//                 { industry_id: id },
//                 {
//                     headers: {
//                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) {
//                 const list: ExpoItem[] = Array.isArray(res.data?.data)
//                     ? res.data.data.map((x: any) => ({
//                         expoid: String(x.expoid),
//                         exponame: String(x.exponame),
//                     }))
//                     : [];

//                 setExpos(list);
//             } else {
//                 setExpos([]);
//                 setExpoId("");
//                 toast.error(res.data?.message || "Failed to fetch expos");
//             }
//         } catch (e) {
//             console.error(e);
//             setExpos([]);
//             setExpoId("");
//             toast.error("Error fetching expos");
//         } finally {
//             setIsExpoLoading(false);
//         }
//     };

//     // -------------------- Business Types --------------------
//     const fetchBusinessTypes = async () => {
//         try {
//             setLoadingBusinessTypes(true);

//             const res = await axios.post(
//                 `${apiUrl}/business-types/index`,
//                 {},
//                 { headers: { ...authHeaders() } }
//             );

//             if (res.data?.success) {
//                 const list = Array.isArray(res.data?.data)
//                     ? res.data.data.map((x: any) => ({
//                         id: pickId(x),
//                         name: pickName(x),
//                     }))
//                     : [];

//                 setBusinessTypeOptions(list);
//             } else {
//                 toast.error(res.data?.message || "Failed to load business types");
//                 setBusinessTypeOptions([]);
//             }
//         } catch (e: any) {
//             toast.error(e?.response?.data?.message || "Failed to load business types");
//             setBusinessTypeOptions([]);
//         } finally {
//             setLoadingBusinessTypes(false);
//         }
//     };

//     // -------------------- Category by Industry --------------------
//     const fetchCategoriesByIndustry = async (indId: string) => {
//         if (!indId) {
//             setCategoryOptions([]);
//             setCategoryId("");
//             setSubcategoryOptions([]);
//             setSubCategoryId("");
//             return;
//         }

//         try {
//             setLoadingCategory(true);

//             const res = await axios.post(
//                 `${apiUrl}/industry-subcategories/get-by-industry`,
//                 { industry_id: indId },
//                 { headers: { ...authHeaders() } }
//             );

//             const rows = res.data?.data || res.data?.result || [];
//             const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//                 .map((r: any) => ({
//                     id: pickId(r),
//                     name: pickName(r) || String(r?.industry_category_name || ""),
//                 }))
//                 .filter((x) => x.id && x.name);

//             setCategoryOptions(list);
//         } catch (e: any) {
//             toast.error(e?.response?.data?.message || "Failed to load categories");
//             setCategoryOptions([]);
//         } finally {
//             setLoadingCategory(false);
//         }
//     };

//     // -------------------- Subcategory by Category --------------------
//     const fetchSubcategoriesByCategory = async (catId: string) => {
//         if (!catId) {
//             setSubcategoryOptions([]);
//             setSubCategoryId("");
//             return;
//         }

//         try {
//             setLoadingSubcategory(true);

//             const res = await axios.post(
//                 `${apiUrl}/industry-subcategories/get-by-category`,
//                 { industry_category_id: catId },
//                 { headers: { ...authHeaders() } }
//             );

//             const rows = res.data?.data || res.data?.result || [];
//             const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//                 .map((r: any) => ({
//                     id: pickId(r),
//                     name: pickName(r),
//                 }))
//                 .filter((x) => x.id && x.name);

//             setSubcategoryOptions(list);
//         } catch (e: any) {
//             toast.error(e?.response?.data?.message || "Failed to load subcategories");
//             setSubcategoryOptions([]);
//         } finally {
//             setLoadingSubcategory(false);
//         }
//     };

//     useEffect(() => {
//         fetchIndustries();
//         fetchBusinessTypes();
//     }, []);

//     useEffect(() => {
//         if (industryId) {
//             fetchExpos(industryId);
//             fetchCategoriesByIndustry(industryId);
//         } else {
//             setExpos([]);
//             setExpoId("");
//             setCategoryOptions([]);
//             setCategoryId("");
//             setSubcategoryOptions([]);
//             setSubCategoryId("");
//         }
//     }, [industryId]);

//     useEffect(() => {
//         if (categoryId) {
//             fetchSubcategoriesByCategory(categoryId);
//         } else {
//             setSubcategoryOptions([]);
//             setSubCategoryId("");
//         }
//     }, [categoryId]);

//     useEffect(() => {
//         if (!showExpo) {
//             setExpoId("");
//         }
//     }, [type]);

//     // -------------------- Handlers --------------------
//     const handleTypeChange = (v: UploadType) => {
//         setType(v);
//         clearUploadResult();
//     };

//     const handleIndustryChange = (v: string) => {
//         setIndustryId(v);
//         setExpoId("");
//         setCategoryId("");
//         setSubCategoryId("");
//         setCategoryOptions([]);
//         setSubcategoryOptions([]);
//         clearUploadResult();
//     };

//     const handleCategoryChange = (v: string) => {
//         setCategoryId(v);
//         setSubCategoryId("");
//         setSubcategoryOptions([]);
//         clearUploadResult();
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = e.target.files?.[0];
//         if (!selectedFile) return;

//         const fileName = selectedFile.name.toLowerCase().trim();
//         const isExcel = fileName.endsWith(".xls") || fileName.endsWith(".xlsx");

//         if (!isExcel) {
//             setFile(null);
//             setFileError("Only Excel files (.xls, .xlsx) are allowed");
//             e.target.value = "";
//             return;
//         }

//         setFileError("");
//         setFile(selectedFile);
//         clearUploadResult();
//     };

//     const resetFileInput = () => {
//         setFile(null);
//         setFileError("");
//         if (fileInputRef.current) fileInputRef.current.value = "";
//     };

//     // -------------------- Download Sample --------------------
//     const downloadSample = () => {
//         const header = [
//             "Company Name",
//             "Contact Person",
//             "Mobile",
//             "Email",
//             "Address",
//             "State",
//             "City",
//             "Business Type",
//             "Category",
//             "Sub Category",
//         ];

//         const csv = `${header.join(",")}\n`;
//         const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);

//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "exhibitor_sample.csv";
//         a.click();

//         URL.revokeObjectURL(url);
//     };

//     // -------------------- Upload --------------------
//     const handleUpload = async () => {
//         if (!file) return toast.error("Please select an Excel file");
//         if (!industryId) return toast.error("Please select Industry");

//         const user_id = getUserId();
//         const user_name = getUserName();

//         if (!user_id || !user_name) {
//             toast.error("User info not found. Please login again.");
//             return;
//         }

//         try {
//             setIsUploading(true);
//             clearUploadResult();

//             const token = getToken();

//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("industry_id", industryId);
//             formData.append("user_id", user_id);
//             formData.append("user_name", user_name);

//             const res = await axios.post(UPLOAD_API, formData, {
//                 headers: {
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             if (res.data?.success) {
//                 toast.success(res.data?.message || "Exhibitor Excel uploaded successfully");
//                 resetFileInput();
//                 setUploadErrors([]);
//                 setUploadStats(res.data?.stats || null);
//                 setUploadMessage(res.data?.message || "");
//             } else {
//                 const msg = res.data?.message || "Upload failed";
//                 const errs = Array.isArray(res.data?.errors) ? res.data.errors : [];

//                 setUploadMessage(msg);
//                 setUploadErrors(errs);
//                 setUploadStats(res.data?.stats || null);

//                 toast.error(msg);
//             }
//         } catch (err: any) {
//             console.error(err);

//             const msg =
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 "Upload failed";

//             const errs = Array.isArray(err?.response?.data?.errors)
//                 ? err.response.data.errors
//                 : [];

//             setUploadMessage(msg);
//             setUploadErrors(errs);
//             setUploadStats(err?.response?.data?.stats || null);

//             toast.error(msg);
//         } finally {
//             setIsUploading(false);
//         }
//     };
//     const selectedIndustryName = useMemo(() => {
//         return industries.find((x) => x.id === industryId)?.name || "";
//     }, [industryId, industries]);

//     const selectedExpoName = useMemo(() => {
//         return expos.find((x) => x.expoid === expoId)?.exponame || "";
//     }, [expoId, expos]);

//     const selectedBusinessTypeName = useMemo(() => {
//         return businessTypeOptions.find((x) => x.id === businessTypeId)?.name || "";
//     }, [businessTypeId, businessTypeOptions]);

//     const selectedCategoryName = useMemo(() => {
//         return categoryOptions.find((x) => x.id === categoryId)?.name || "";
//     }, [categoryId, categoryOptions]);

//     const selectedSubCategoryName = useMemo(() => {
//         return subcategoryOptions.find((x) => x.id === subCategoryId)?.name || "";
//     }, [subCategoryId, subcategoryOptions]);

//     const visibleErrors = showAllErrors ? uploadErrors : uploadErrors.slice(0, 20);
//     const hasMoreErrors = uploadErrors.length > 20;

//     return (
//         <div className="flex items-center justify-center p-6">
//             <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl">
//                 <div className="px-6 py-4 border-b flex items-center justify-between gap-3">
//                     <h2 className="text-2xl font-bold text-gray-800">Upload Exhibitor Data</h2>

//                     <button
//                         onClick={downloadSample}
//                         className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
//                         type="button"
//                     >
//                         Download Sample
//                     </button>
//                 </div>

//                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Type</label>
//                         <select
//                             value={type}
//                             onChange={(e) => handleTypeChange(e.target.value as UploadType)}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                         >
//                             <option value="">Select Type</option>
//                             <option value="pre_register">Pre Register</option>
//                             <option value="industry">Industry</option>
//                             <option value="visited_visitor">Visited Visitor</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Industry</label>
//                         <select
//                             value={industryId}
//                             onChange={(e) => handleIndustryChange(e.target.value)}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                             disabled={isIndustryLoading}
//                         >
//                             <option value="">
//                                 {isIndustryLoading ? "Loading industries..." : "Select Industry"}
//                             </option>
//                             {industries.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {showExpo && (
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">Expo</label>
//                             <select
//                                 value={expoId}
//                                 onChange={(e) => {
//                                     setExpoId(e.target.value);
//                                     clearUploadResult();
//                                 }}
//                                 className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                                 disabled={!industryId || isExpoLoading}
//                             >
//                                 <option value="">
//                                     {!industryId
//                                         ? "Select Industry first"
//                                         : isExpoLoading
//                                             ? "Loading expos..."
//                                             : "Select Expo"}
//                                 </option>
//                                 {expos.map((item) => (
//                                     <option key={item.expoid} value={item.expoid}>
//                                         {item.exponame}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}

//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Business Type</label>
//                         <select
//                             value={businessTypeId}
//                             onChange={(e) => {
//                                 setBusinessTypeId(e.target.value);
//                                 clearUploadResult();
//                             }}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                             disabled={loadingBusinessTypes}
//                         >
//                             <option value="">
//                                 {loadingBusinessTypes ? "Loading business types..." : "Select Business Type"}
//                             </option>
//                             {businessTypeOptions.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Category</label>
//                         <select
//                             value={categoryId}
//                             onChange={(e) => handleCategoryChange(e.target.value)}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                             disabled={!industryId || loadingCategory}
//                         >
//                             <option value="">
//                                 {!industryId
//                                     ? "Select Industry first"
//                                     : loadingCategory
//                                         ? "Loading categories..."
//                                         : "Select Category"}
//                             </option>
//                             {categoryOptions.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="text-sm font-medium text-gray-700">Sub Category</label>
//                         <select
//                             value={subCategoryId}
//                             onChange={(e) => {
//                                 setSubCategoryId(e.target.value);
//                                 clearUploadResult();
//                             }}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
//                             disabled={!categoryId || loadingSubcategory}
//                         >
//                             <option value="">
//                                 {!categoryId
//                                     ? "Select Category first"
//                                     : loadingSubcategory
//                                         ? "Loading sub categories..."
//                                         : "Select Sub Category"}
//                             </option>
//                             {subcategoryOptions.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="md:col-span-2">
//                         {(selectedIndustryName ||
//                             selectedExpoName ||
//                             selectedBusinessTypeName ||
//                             selectedCategoryName ||
//                             selectedSubCategoryName) && (
//                                 <p className="text-xs text-gray-500">
//                                     Selected: {selectedIndustryName || "-"}
//                                     {selectedExpoName ? ` → ${selectedExpoName}` : ""}
//                                     {selectedBusinessTypeName ? ` → ${selectedBusinessTypeName}` : ""}
//                                     {selectedCategoryName ? ` → ${selectedCategoryName}` : ""}
//                                     {selectedSubCategoryName ? ` → ${selectedSubCategoryName}` : ""}
//                                 </p>
//                             )}
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="text-sm font-medium text-gray-700">Excel File</label>
//                         <div className="mt-2 flex items-center justify-center w-full">
//                             <label
//                                 className={[
//                                     "w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500",
//                                     uploadErrors.length > 0 ? "border-red-400" : "border-gray-200",
//                                 ].join(" ")}
//                             >
//                                 <span className="text-sm text-gray-600">
//                                     {file ? file.name : "Click to upload (.xls, .xlsx)"}
//                                 </span>
//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//                                     onChange={handleFileChange}
//                                     className="hidden"
//                                 />
//                             </label>
//                         </div>

//                         {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}

//                         {(uploadMessage || uploadErrors.length > 0) && (
//                             <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
//                                 {uploadMessage && (
//                                     <p className="text-sm font-semibold text-red-700">{uploadMessage}</p>
//                                 )}

//                                 {uploadStats && (
//                                     <p className="text-xs text-red-700 mt-1">
//                                         Total: {uploadStats.total_rows} • Imported: {uploadStats.imported} •
//                                         Skipped: {uploadStats.skipped}
//                                     </p>
//                                 )}

//                                 {uploadErrors.length > 0 && (
//                                     <>
//                                         <ul className="mt-3 max-h-56 overflow-auto space-y-1 text-sm text-red-700 list-disc pl-5">
//                                             {visibleErrors.map((e, idx) => (
//                                                 <li key={`${e}-${idx}`}>{e}</li>
//                                             ))}
//                                         </ul>

//                                         {hasMoreErrors && (
//                                             <button
//                                                 type="button"
//                                                 className="mt-3 text-xs font-medium text-red-700 underline"
//                                                 onClick={() => setShowAllErrors((s) => !s)}
//                                             >
//                                                 {showAllErrors ? "Show less" : `Show all (${uploadErrors.length})`}
//                                             </button>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex items-center justify-between gap-3">
//                     <button
//                         onClick={handleUpload}
//                         disabled={isUploading}
//                         className="w-full md:w-auto px-6 py-2 bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//                     >
//                         {isUploading ? "Uploading..." : "Upload Excel"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


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

            if (res.data?.success) {
                toast.success(res.data?.message || "Exhibitor Excel uploaded successfully");
                setUploadMessage(res.data?.message || "");
                setUploadStats(res.data?.stats || null);
                setUploadErrors([]);
                resetFileInput();
            } else {
                const msg = res.data?.message || "Upload failed";
                const errs = Array.isArray(res.data?.errors) ? res.data.errors : [];

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

                        {(uploadMessage || uploadErrors.length > 0) && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                {uploadMessage && (
                                    <p className="text-sm font-semibold text-red-700">{uploadMessage}</p>
                                )}

                                {uploadStats && (
                                    <p className="text-xs text-red-700 mt-1">
                                        Total: {uploadStats.total_rows} • Imported: {uploadStats.imported} •
                                        Skipped: {uploadStats.skipped}
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