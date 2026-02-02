// import { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // -------------------- Types --------------------
// type YesNo = "" | "yes" | "no";

// type IndustryItem = { id: number; name: string };
// type ExpoItem = { expoid: number; exponame: string };

// // API row type (based on your response)
// type VisitorRow = {
//     visitorid: number;
//     name: string;
//     mobileno: string;
//     email?: string;
//     companyname?: string;
//     state_name?: string | null;
//     city_name?: string | null;
// };

// function getToken() {
//     return localStorage.getItem("usertoken");
// }

// export default function VisitorReportPage() {
//     // -------------------- Filters --------------------
//     const [industryId, setIndustryId] = useState("");
//     const [expoId, setExpoId] = useState("");
//     const [preRegister, setPreRegister] = useState<YesNo>("");
//     const [visited, setVisited] = useState<YesNo>("");

//     // dropdown data
//     const [industries, setIndustries] = useState<IndustryItem[]>([]);
//     const [expos, setExpos] = useState<ExpoItem[]>([]);

//     // data table
//     const [rows, setRows] = useState<VisitorRow[]>([]);
//     const [count, setCount] = useState(0);

//     // pagination (from meta)
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const [lastPage, setLastPage] = useState(1);

//     // loading
//     const [isIndustryLoading, setIsIndustryLoading] = useState(false);
//     const [isExpoLoading, setIsExpoLoading] = useState(false);
//     const [isSearching, setIsSearching] = useState(false);

//     // ✅ Your API endpoint
//     const LIST_API = `${apiUrl}/admin_visitor_list`;

//     // so page change calls API ONLY after first search click
//     const hasSearchedRef = useRef(false);

//     // ✅ helper: clear old result (fix "previous data stays")
//     const resetResults = () => {
//         setRows([]);
//         setCount(0);
//         setPerPage(10);
//         setLastPage(1);
//     };

//     // -------------------- Fetch industries --------------------
//     const fetchIndustries = async () => {
//         try {
//             setIsIndustryLoading(true);
//             const token = getToken();

//             const res = await axios.post(
//                 `${apiUrl}/IndustryList`,
//                 {},
//                 {
//                     headers: {
//                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) setIndustries(res.data?.data || []);
//             else toast.error(res.data?.message || "Failed to fetch industries");
//         } catch (e) {
//             console.error(e);
//             toast.error("Error fetching industries");
//         } finally {
//             setIsIndustryLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchIndustries();
//     }, []);

//     // -------------------- Fetch expos by industry --------------------
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

//             if (res.data?.success) setExpos(res.data?.data || []);
//             else {
//                 setExpos([]);
//                 toast.error(res.data?.message || "Failed to fetch expos");
//             }
//         } catch (e) {
//             console.error(e);
//             setExpos([]);
//             toast.error("Error fetching expos");
//         } finally {
//             setIsExpoLoading(false);
//         }
//     };

//     useEffect(() => {
//         setExpoId("");
//         setExpos([]);
//         setPage(1);

//         // ✅ clear old results when Industry changes
//         hasSearchedRef.current = false;
//         resetResults();

//         if (industryId) fetchExpos(industryId);
//     }, [industryId]);

//     // -------------------- Build payload (MATCH YOUR API) --------------------
//     const buildSearchPayload = (pageNo: number) => {
//         const Is_Pre = preRegister === "" ? "2" : preRegister === "yes" ? "1" : "0";
//         const Is_Visit = visited === "" ? "2" : visited === "yes" ? "1" : "0";

//         return {
//             expo_id: expoId || "",
//             industry_id: industryId || "",
//             Is_Pre,
//             Is_Visit,
//             page: pageNo,
//         };
//     };

//     // -------------------- Search list (calls API) --------------------
//     const handleSearch = async (pageNo = 1) => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         // ✅ IMPORTANT: clear old table immediately (fix old data still visible)
//         setRows([]);

//         try {
//             setIsSearching(true);
//             const token = getToken();
//             const payload = buildSearchPayload(pageNo);

//             const res = await axios.post(LIST_API, payload, {
//                 headers: {
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (res.data?.success) {
//                 hasSearchedRef.current = true;

//                 const list: VisitorRow[] = res.data?.data || [];
//                 setRows(list);
//                 setCount(Number(res.data?.count || list.length || 0));

//                 // meta pagination
//                 const meta = res.data?.meta || {};
//                 setPerPage(Number(meta?.per_page || 10));
//                 setLastPage(Number(meta?.last_page || 1));

//                 // keep page in sync (important)
//                 setPage(Number(meta?.current_page || pageNo));

//                 // ✅ if success but empty list
//                 if (list.length === 0) {
//                     toast.info("No data found");
//                 }
//             } else {
//                 hasSearchedRef.current = true; // searched done, but no records
//                 resetResults();
//                 setPage(1);
//                 toast.error(res.data?.message || "No data found");
//             }
//         } catch (e: any) {
//             console.error(e);
//             hasSearchedRef.current = true;
//             resetResults();
//             setPage(1);
//             toast.error(e?.response?.data?.message || "Error fetching data");
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     // ✅ when page changes -> call API with that page (after first search)
//     useEffect(() => {
//         if (!hasSearchedRef.current) return;
//         handleSearch(page);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [page]);

//     const totalPages = useMemo(() => {
//         return Math.max(1, Number(lastPage || 1));
//     }, [lastPage]);

//     // -------------------- Export to Excel --------------------
//     const handleExport = async () => {
//         // validations (same as search)
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         try {
//             const token = getToken();

//             // build payload exactly like backend needs (numbers)
//             const Is_Pre = preRegister === "" ? 2 : preRegister === "yes" ? 1 : 0;
//             const Is_Visit = visited === "" ? 2 : visited === "yes" ? 1 : 0;

//             const payload = {
//                 expo_id: expoId ? Number(expoId) : "",
//                 industry_id: industryId ? Number(industryId) : "",
//                 Is_Pre,
//                 Is_Visit,
//             };

//             const res = await axios.post(`${apiUrl}/admin_visitors_export`, payload, {
//                 responseType: "blob",
//                 headers: {
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//             });

//             const contentType = res.headers?.["content-type"] || "";
//             if (contentType.includes("application/json")) {
//                 const text = await new Response(res.data).text();
//                 try {
//                     const json = JSON.parse(text);
//                     toast.error(json?.message || "Export failed");
//                 } catch {
//                     toast.error("Export failed");
//                 }
//                 return;
//             }

//             const blob = new Blob([res.data], {
//                 type: contentType || "application/vnd.ms-excel",
//             });
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = url;

//             const today = new Date().toISOString().slice(0, 10);
//             a.download = `visitor_report_${today}.xlsx`;

//             document.body.appendChild(a);
//             a.click();
//             a.remove();

//             window.URL.revokeObjectURL(url);
//             toast.success("Excel exported successfully");
//         } catch (e: any) {
//             console.error(e);
//             toast.error(e?.response?.data?.message || "Error exporting excel");
//         }
//     };

//     return (
//         <div className="p-6">
//             <div className="w-full bg-white rounded-2xl shadow-xl">
//                 {/* Header */}
//                 <div className="px-6 py-4 border-b">
//                     <h2 className="text-2xl font-bold text-gray-800">Visitor Report</h2>
//                 </div>

//                 {/* Filters */}
//                 <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-5">
//                     {/* Industry */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Industry</label>
//                         <select
//                             value={industryId}
//                             onChange={(e) => {
//                                 setIndustryId(e.target.value);
//                                 setPage(1);

//                                 // ✅ reset list until search
//                                 hasSearchedRef.current = false;
//                                 resetResults();
//                             }}
//                             disabled={isIndustryLoading}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {isIndustryLoading ? "Loading..." : "Select Industry"}
//                             </option>
//                             {industries.map((it) => (
//                                 <option key={it.id} value={String(it.id)}>
//                                     {it.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Expo */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Expo</label>
//                         <select
//                             value={expoId}
//                             onChange={(e) => {
//                                 setExpoId(e.target.value);
//                                 setPage(1);

//                                 // ✅ IMPORTANT: clear old data when filter changes
//                                 hasSearchedRef.current = false;
//                                 resetResults();
//                             }}
//                             disabled={!industryId || isExpoLoading}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {!industryId
//                                     ? "Select Industry first"
//                                     : isExpoLoading
//                                         ? "Loading..."
//                                         : "Select Expo"}
//                             </option>
//                             {expos.map((it) => (
//                                 <option key={it.expoid} value={String(it.expoid)}>
//                                     {it.exponame}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Pre Register Yes/No */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Pre Register
//                         </label>
//                         <select
//                             value={preRegister}
//                             onChange={(e) => {
//                                 setPreRegister(e.target.value as YesNo);
//                                 setPage(1);

//                                 // ✅ IMPORTANT: clear old data when filter changes
//                                 hasSearchedRef.current = false;
//                                 resetResults();
//                             }}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">All</option>
//                             <option value="yes">Yes</option>
//                             <option value="no">No</option>
//                         </select>
//                     </div>

//                     {/* Visited Yes/No */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Visited</label>
//                         <select
//                             value={visited}
//                             onChange={(e) => {
//                                 setVisited(e.target.value as YesNo);
//                                 setPage(1);

//                                 // ✅ IMPORTANT: clear old data when filter changes
//                                 hasSearchedRef.current = false;
//                                 resetResults();
//                             }}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">All</option>
//                             <option value="yes">Yes</option>
//                             <option value="no">No</option>
//                         </select>
//                     </div>

//                 </div>

//                 {/* Summary */}
//                 <div className=" px-6 pb-4 text-sm text-gray-600 flex justify-end gap-2 items-center">
//                     <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
//                         Count: <span className="font-semibold">{count}</span>
//                     </div>
//                     <div>
//                         <button
//                             onClick={() => {
//                                 hasSearchedRef.current = true;

//                                 // ✅ avoid double API call
//                                 if (page !== 1) {
//                                     setPage(1); // page effect will call handleSearch(1)
//                                 } else {
//                                     handleSearch(1);
//                                 }
//                             }}
//                             disabled={isSearching}
//                             className="w-full px-6 py-2 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//                         >
//                             {isSearching ? "Searching..." : "Search"}
//                         </button>
//                     </div>
//                     <div>

//                         <button
//                             onClick={handleExport}
//                             className="w-full px-6 py-2 bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-green-700 transition"
//                         >
//                             Export Excel
//                         </button>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="px-6 pb-6 overflow-x-auto">
//                     <table className="min-w-full border rounded-xl overflow-hidden">
//                         <thead className="bg-gray-50">
//                             <tr className="text-left text-sm text-gray-700">
//                                 <th className="p-3 border-b">No</th>
//                                 <th className="p-3 border-b">Name</th>
//                                 <th className="p-3 border-b">Mobile</th>
//                                 <th className="p-3 border-b">Email</th>
//                                 <th className="p-3 border-b">Company</th>
//                                 <th className="p-3 border-b">State</th>
//                                 <th className="p-3 border-b">City</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {rows.length === 0 ? (
//                                 <tr>
//                                     <td className="p-4 text-center text-gray-500" colSpan={7}>
//                                         {isSearching ? "Searching..." : "No data found"}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 rows.map((r, idx) => (
//                                     <tr key={r.visitorid} className="text-sm">
//                                         <td className="p-3 border-b">
//                                             {(page - 1) * perPage + idx + 1}
//                                         </td>
//                                         <td className="p-3 border-b">{r.name || "-"}</td>
//                                         <td className="p-3 border-b">{r.mobileno || "-"}</td>
//                                         <td className="p-3 border-b">{r.email || "-"}</td>
//                                         <td className="p-3 border-b">{r.companyname || "-"}</td>
//                                         <td className="p-3 border-b">{r.state_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.city_name || "-"}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>

//                     {/* Pagination */}
//                     <div className="flex items-center justify-between mt-4">
//                         <div className="text-sm text-gray-600">
//                             Page <span className="font-medium">{page}</span> of{" "}
//                             <span className="font-medium">{totalPages}</span>
//                         </div>

//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                                 disabled={page <= 1 || isSearching || !hasSearchedRef.current}
//                                 className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
//                             >
//                                 Prev
//                             </button>

//                             <button
//                                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                                 disabled={page >= totalPages || isSearching || !hasSearchedRef.current}
//                                 className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// import { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // -------------------- Types --------------------
// type YesNo = "" | "yes" | "no";

// type IndustryItem = { id: number; name: string };
// type ExpoItem = { expoid: number; exponame: string };

// // ✅ NEW: Visitor Category
// type ApiVisitorCategory = { id: number; strVisitorCategory: string };
// type VisitorCategoryItem = { id: number; name: string };

// // API row type (based on your response)
// type VisitorRow = {
//     visitorid: number;
//     name: string;
//     mobileno: string;
//     email?: string;
//     companyname?: string;
//     state_name?: string | null;
//     city_name?: string | null;
//     visitor_category_id?: number | string | null;
//     visitor_category_name?: string | null;
// };

// function getToken() {
//     return localStorage.getItem("usertoken");
// }

// export default function VisitorReportPage() {
//     // -------------------- Filters --------------------
//     const [industryId, setIndustryId] = useState("");
//     const [expoId, setExpoId] = useState("");
//     const [preRegister, setPreRegister] = useState<YesNo>("");
//     const [visited, setVisited] = useState<YesNo>("");

//     // ✅ NEW: visitor category filter
//     const [visitorCategoryId, setVisitorCategoryId] = useState<string>("0");
//     const [visitorCategories, setVisitorCategories] = useState<VisitorCategoryItem[]>([]);
//     const [isVisitorCategoryLoading, setIsVisitorCategoryLoading] = useState(false);

//     // dropdown data
//     const [industries, setIndustries] = useState<IndustryItem[]>([]);
//     const [expos, setExpos] = useState<ExpoItem[]>([]);

//     // data table
//     const [rows, setRows] = useState<VisitorRow[]>([]);
//     const [count, setCount] = useState(0);

//     // pagination (from meta)
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const [lastPage, setLastPage] = useState(1);

//     // loading
//     const [isIndustryLoading, setIsIndustryLoading] = useState(false);
//     const [isExpoLoading, setIsExpoLoading] = useState(false);
//     const [isSearching, setIsSearching] = useState(false);

//     // ✅ Your API endpoint
//     const LIST_API = `${apiUrl}/admin_visitor_list`;

//     // ✅ visitor category list api
//     const VISITOR_CATEGORY_API = `${apiUrl}/visitor-category/index`;

//     // so page change calls API ONLY after first search click
//     const hasSearchedRef = useRef(false);

//     // ✅ helper: clear old result (fix "previous data stays")
//     const resetResults = () => {
//         setRows([]);
//         setCount(0);
//         setPerPage(10);
//         setLastPage(1);
//     };

//     // ✅ helper: whenever any filter changes
//     const onAnyFilterChangeReset = () => {
//         setPage(1);
//         hasSearchedRef.current = false;
//         resetResults();
//     };

//     // -------------------- Fetch visitor categories --------------------
//     const fetchVisitorCategories = async () => {
//         try {
//             setIsVisitorCategoryLoading(true);
//             const token = getToken();

//             // API: POST /visitor-category/index  => { status:true, data:[...] }
//             const res = await axios.post(
//                 VISITOR_CATEGORY_API,
//                 {},
//                 {
//                     headers: {
//                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (res.data?.status) {
//                 const list: ApiVisitorCategory[] = res.data?.data || [];
//                 const mapped: VisitorCategoryItem[] = list.map((x) => ({
//                     id: Number(x.id),
//                     name: String(x.strVisitorCategory),
//                 }));
//                 setVisitorCategories(mapped);
//             } else {
//                 setVisitorCategories([]);
//                 toast.error(res.data?.message || "Failed to fetch visitor categories");
//             }
//         } catch (e) {
//             console.error(e);
//             setVisitorCategories([]);
//             toast.error("Error fetching visitor categories");
//         } finally {
//             setIsVisitorCategoryLoading(false);
//         }
//     };

//     // -------------------- Fetch industries --------------------
//     const fetchIndustries = async () => {
//         try {
//             setIsIndustryLoading(true);
//             const token = getToken();

//             const res = await axios.post(
//                 `${apiUrl}/IndustryList`,
//                 {},
//                 {
//                     headers: {
//                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (res.data?.success) setIndustries(res.data?.data || []);
//             else toast.error(res.data?.message || "Failed to fetch industries");
//         } catch (e) {
//             console.error(e);
//             toast.error("Error fetching industries");
//         } finally {
//             setIsIndustryLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchIndustries();
//         fetchVisitorCategories(); // ✅ NEW
//     }, []);

//     // -------------------- Fetch expos by industry --------------------
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

//             if (res.data?.success) setExpos(res.data?.data || []);
//             else {
//                 setExpos([]);
//                 toast.error(res.data?.message || "Failed to fetch expos");
//             }
//         } catch (e) {
//             console.error(e);
//             setExpos([]);
//             toast.error("Error fetching expos");
//         } finally {
//             setIsExpoLoading(false);
//         }
//     };

//     useEffect(() => {
//         setExpoId("");
//         setExpos([]);

//         // ✅ clear old results when Industry changes
//         onAnyFilterChangeReset();

//         if (industryId) fetchExpos(industryId);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [industryId]);

//     // -------------------- Build payload (MATCH YOUR API) --------------------
//     const buildSearchPayload = (pageNo: number) => {
//         const Is_Pre = preRegister === "" ? "2" : preRegister === "yes" ? "1" : "0";
//         const Is_Visit = visited === "" ? "2" : visited === "yes" ? "1" : "0";

//         return {
//             expo_id: expoId || "",
//             industry_id: industryId || "",
//             Is_Pre,
//             Is_Visit,

//             // ✅ NEW: visitor_category_id (0 if not selected)
//             visitor_category_id: visitorCategoryId ? String(visitorCategoryId) : "0",

//             page: pageNo,
//         };
//     };

//     // -------------------- Search list (calls API) --------------------
//     const handleSearch = async (pageNo = 1) => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         // ✅ IMPORTANT: clear old table immediately (fix old data still visible)
//         setRows([]);

//         try {
//             setIsSearching(true);
//             const token = getToken();
//             const payload = buildSearchPayload(pageNo);

//             const res = await axios.post(LIST_API, payload, {
//                 headers: {
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (res.data?.success) {
//                 hasSearchedRef.current = true;

//                 const list: VisitorRow[] = res.data?.data || [];
//                 setRows(list);
//                 setCount(Number(res.data?.count || list.length || 0));

//                 // meta pagination
//                 const meta = res.data?.meta || {};
//                 setPerPage(Number(meta?.per_page || 10));
//                 setLastPage(Number(meta?.last_page || 1));

//                 // keep page in sync (important)
//                 setPage(Number(meta?.current_page || pageNo));

//                 if (list.length === 0) toast.info("No data found");
//             } else {
//                 hasSearchedRef.current = true;
//                 resetResults();
//                 setPage(1);
//                 toast.error(res.data?.message || "No data found");
//             }
//         } catch (e: any) {
//             console.error(e);
//             hasSearchedRef.current = true;
//             resetResults();
//             setPage(1);
//             toast.error(e?.response?.data?.message || "Error fetching data");
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     // ✅ when page changes -> call API with that page (after first search)
//     useEffect(() => {
//         if (!hasSearchedRef.current) return;
//         handleSearch(page);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [page]);

//     const totalPages = useMemo(() => {
//         return Math.max(1, Number(lastPage || 1));
//     }, [lastPage]);

//     // -------------------- Export to Excel --------------------
//     const handleExport = async () => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         try {
//             const token = getToken();

//             const Is_Pre = preRegister === "" ? 2 : preRegister === "yes" ? 1 : 0;
//             const Is_Visit = visited === "" ? 2 : visited === "yes" ? 1 : 0;

//             const payload = {
//                 expo_id: expoId ? Number(expoId) : "",
//                 industry_id: industryId ? Number(industryId) : "",
//                 Is_Pre,
//                 Is_Visit,

//                 // ✅ NEW: include in export too
//                 visitor_category_id: visitorCategoryId ? Number(visitorCategoryId) : 0,
//             };

//             const res = await axios.post(`${apiUrl}/admin_visitors_export`, payload, {
//                 responseType: "blob",
//                 headers: {
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//             });

//             const contentType = res.headers?.["content-type"] || "";
//             if (contentType.includes("application/json")) {
//                 const text = await new Response(res.data).text();
//                 try {
//                     const json = JSON.parse(text);
//                     toast.error(json?.message || "Export failed");
//                 } catch {
//                     toast.error("Export failed");
//                 }
//                 return;
//             }

//             const blob = new Blob([res.data], {
//                 type: contentType || "application/vnd.ms-excel",
//             });
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = url;

//             const today = new Date().toISOString().slice(0, 10);
//             a.download = `visitor_report_${today}.xlsx`;

//             document.body.appendChild(a);
//             a.click();
//             a.remove();

//             window.URL.revokeObjectURL(url);
//             toast.success("Excel exported successfully");
//         } catch (e: any) {
//             console.error(e);
//             toast.error(e?.response?.data?.message || "Error exporting excel");
//         }
//     };

//     return (
//         <div className="p-6">
//             <div className="w-full bg-white rounded-2xl shadow-xl">
//                 {/* Header */}
//                 <div className="px-6 py-4 border-b">
//                     <h2 className="text-2xl font-bold text-gray-800">Visitor Report</h2>
//                 </div>

//                 {/* Filters */}
//                 <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-5">
//                     {/* Industry */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Industry</label>
//                         <select
//                             value={industryId}
//                             onChange={(e) => {
//                                 setIndustryId(e.target.value);
//                                 onAnyFilterChangeReset();
//                             }}
//                             disabled={isIndustryLoading}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {isIndustryLoading ? "Loading..." : "Select Industry"}
//                             </option>
//                             {industries.map((it) => (
//                                 <option key={it.id} value={String(it.id)}>
//                                     {it.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Expo */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Expo</label>
//                         <select
//                             value={expoId}
//                             onChange={(e) => {
//                                 setExpoId(e.target.value);
//                                 onAnyFilterChangeReset();
//                             }}
//                             disabled={!industryId || isExpoLoading}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {!industryId
//                                     ? "Select Industry first"
//                                     : isExpoLoading
//                                         ? "Loading..."
//                                         : "Select Expo"}
//                             </option>
//                             {expos.map((it) => (
//                                 <option key={it.expoid} value={String(it.expoid)}>
//                                     {it.exponame}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* ✅ NEW: Visitor Category */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Visitor Category</label>
//                         <select
//                             value={visitorCategoryId}
//                             onChange={(e) => {
//                                 setVisitorCategoryId(e.target.value || "0");
//                                 onAnyFilterChangeReset();
//                             }}
//                             disabled={isVisitorCategoryLoading}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="0">
//                                 {isVisitorCategoryLoading ? "Loading..." : "All Categories"}
//                             </option>
//                             {visitorCategories.map((c) => (
//                                 <option key={c.id} value={String(c.id)}>
//                                     {c.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Pre Register Yes/No */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Pre Register</label>
//                         <select
//                             value={preRegister}
//                             onChange={(e) => {
//                                 setPreRegister(e.target.value as YesNo);
//                                 onAnyFilterChangeReset();
//                             }}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">All</option>
//                             <option value="yes">Yes</option>
//                             <option value="no">No</option>
//                         </select>
//                     </div>

//                     {/* Visited Yes/No */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Visited</label>
//                         <select
//                             value={visited}
//                             onChange={(e) => {
//                                 setVisited(e.target.value as YesNo);
//                                 onAnyFilterChangeReset();
//                             }}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">All</option>
//                             <option value="yes">Yes</option>
//                             <option value="no">No</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* Summary */}
//                 <div className=" px-6 pb-4 text-sm text-gray-600 flex justify-end gap-2 items-center">
//                     <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
//                         Count: <span className="font-semibold">{count}</span>
//                     </div>

//                     <div>
//                         <button
//                             onClick={() => {
//                                 hasSearchedRef.current = true;

//                                 // ✅ avoid double API call
//                                 if (page !== 1) {
//                                     setPage(1);
//                                 } else {
//                                     handleSearch(1);
//                                 }
//                             }}
//                             disabled={isSearching}
//                             className="w-full px-6 py-2 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//                         >
//                             {isSearching ? "Searching..." : "Search"}
//                         </button>
//                     </div>

//                     <div>
//                         <button
//                             onClick={handleExport}
//                             className="w-full px-6 py-2 bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-green-700 transition"
//                         >
//                             Export Excel
//                         </button>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="px-6 pb-6 overflow-x-auto">
//                     <table className="min-w-full border rounded-xl overflow-hidden">
//                         <thead className="bg-gray-50">
//                             <tr className="text-left text-sm text-gray-700">
//                                 <th className="p-3 border-b">No</th>
//                                 <th className="p-3 border-b">Name</th>
//                                 <th className="p-3 border-b">Mobile</th>
//                                 <th className="p-3 border-b">Email</th>
//                                 <th className="p-3 border-b">Company</th>
//                                 <th className="p-3 border-b">State</th>
//                                 <th className="p-3 border-b">City</th>
//                                 <th className="p-3 border-b">Visitor Category</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {rows.length === 0 ? (
//                                 <tr>
//                                     <td className="p-4 text-center text-gray-500" colSpan={7}>
//                                         {isSearching ? "Searching..." : "No data found"}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 rows.map((r, idx) => (
//                                     <tr key={r.visitorid} className="text-sm">
//                                         <td className="p-3 border-b">
//                                             {(page - 1) * perPage + idx + 1}
//                                         </td>
//                                         <td className="p-3 border-b">{r.name || "-"}</td>
//                                         <td className="p-3 border-b">{r.mobileno || "-"}</td>
//                                         <td className="p-3 border-b">{r.email || "-"}</td>
//                                         <td className="p-3 border-b">{r.companyname || "-"}</td>
//                                         <td className="p-3 border-b">{r.state_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.city_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.visitor_category_name || "-"}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>

//                     {/* Pagination */}
//                     <div className="flex items-center justify-between mt-4">
//                         <div className="text-sm text-gray-600">
//                             Page <span className="font-medium">{page}</span> of{" "}
//                             <span className="font-medium">{totalPages}</span>
//                         </div>

//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                                 disabled={page <= 1 || isSearching || !hasSearchedRef.current}
//                                 className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
//                             >
//                                 Prev
//                             </button>

//                             <button
//                                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                                 disabled={page >= totalPages || isSearching || !hasSearchedRef.current}
//                                 className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

// -------------------- Types --------------------
type YesNo = "" | "yes" | "no";

type IndustryItem = { id: number; name: string };
type ExpoItem = { expoid: number; exponame: string };

// ✅ Visitor Category
type ApiVisitorCategory = { id: number; strVisitorCategory: string };
type VisitorCategoryItem = { id: number; name: string };

// ✅ UPDATED: API row type
type VisitorRow = {
    visitorid: number;
    name: string;
    mobileno: string;
    email?: string;
    companyname?: string;
    state_name?: string | null;
    city_name?: string | null;

    // ✅ NEW (for listing)
    visitor_category_id?: number | string | null;
    visitor_category_name?: string | null;
};

function getToken() {
    return localStorage.getItem("usertoken");
}

export default function VisitorReportPage() {
    // -------------------- Filters --------------------
    const [industryId, setIndustryId] = useState("");
    const [expoId, setExpoId] = useState("");
    const [preRegister, setPreRegister] = useState<YesNo>("");
    const [visited, setVisited] = useState<YesNo>("");

    // ✅ visitor category filter
    const [visitorCategoryId, setVisitorCategoryId] = useState<string>("0");
    const [visitorCategories, setVisitorCategories] = useState<VisitorCategoryItem[]>([]);
    const [isVisitorCategoryLoading, setIsVisitorCategoryLoading] = useState(false);

    // dropdown data
    const [industries, setIndustries] = useState<IndustryItem[]>([]);
    const [expos, setExpos] = useState<ExpoItem[]>([]);

    // data table
    const [rows, setRows] = useState<VisitorRow[]>([]);
    const [count, setCount] = useState(0);

    // pagination (from meta)
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [lastPage, setLastPage] = useState(1);

    // loading
    const [isIndustryLoading, setIsIndustryLoading] = useState(false);
    const [isExpoLoading, setIsExpoLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // ✅ Your API endpoint
    const LIST_API = `${apiUrl}/admin_visitor_list`;

    // ✅ visitor category list api
    const VISITOR_CATEGORY_API = `${apiUrl}/visitor-category/index`;

    // so page change calls API ONLY after first search click
    const hasSearchedRef = useRef(false);

    // ✅ helper: clear old result (fix "previous data stays")
    const resetResults = () => {
        setRows([]);
        setCount(0);
        setPerPage(10);
        setLastPage(1);
    };

    // ✅ helper: whenever any filter changes
    const onAnyFilterChangeReset = () => {
        setPage(1);
        hasSearchedRef.current = false;
        resetResults();
    };

    // ✅ NEW: Map for category id -> name (fallback if API doesn't return name)
    const categoryNameById = useMemo(() => {
        const map = new Map<string, string>();
        visitorCategories.forEach((c) => map.set(String(c.id), c.name));
        return map;
    }, [visitorCategories]);

    // -------------------- Fetch visitor categories --------------------
    const fetchVisitorCategories = async () => {
        try {
            setIsVisitorCategoryLoading(true);
            const token = getToken();

            const res = await axios.post(
                VISITOR_CATEGORY_API,
                {},
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data?.status) {
                const list: ApiVisitorCategory[] = res.data?.data || [];
                const mapped: VisitorCategoryItem[] = list.map((x) => ({
                    id: Number(x.id),
                    name: String(x.strVisitorCategory),
                }));
                setVisitorCategories(mapped);
            } else {
                setVisitorCategories([]);
                toast.error(res.data?.message || "Failed to fetch visitor categories");
            }
        } catch (e) {
            console.error(e);
            setVisitorCategories([]);
            toast.error("Error fetching visitor categories");
        } finally {
            setIsVisitorCategoryLoading(false);
        }
    };

    // -------------------- Fetch industries --------------------
    const fetchIndustries = async () => {
        try {
            setIsIndustryLoading(true);
            const token = getToken();

            const res = await axios.post(
                `${apiUrl}/IndustryList`,
                {},
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data?.success) setIndustries(res.data?.data || []);
            else toast.error(res.data?.message || "Failed to fetch industries");
        } catch (e) {
            console.error(e);
            toast.error("Error fetching industries");
        } finally {
            setIsIndustryLoading(false);
        }
    };

    useEffect(() => {
        fetchIndustries();
        fetchVisitorCategories(); // ✅ NEW
    }, []);

    // -------------------- Fetch expos by industry --------------------
    const fetchExpos = async (id: string) => {
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
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data?.success) setExpos(res.data?.data || []);
            else {
                setExpos([]);
                toast.error(res.data?.message || "Failed to fetch expos");
            }
        } catch (e) {
            console.error(e);
            setExpos([]);
            toast.error("Error fetching expos");
        } finally {
            setIsExpoLoading(false);
        }
    };

    useEffect(() => {
        setExpoId("");
        setExpos([]);

        // ✅ clear old results when Industry changes
        onAnyFilterChangeReset();

        if (industryId) fetchExpos(industryId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [industryId]);

    // -------------------- Build payload (MATCH YOUR API) --------------------
    const buildSearchPayload = (pageNo: number) => {
        const Is_Pre = preRegister === "" ? "2" : preRegister === "yes" ? "1" : "0";
        const Is_Visit = visited === "" ? "2" : visited === "yes" ? "1" : "0";

        return {
            expo_id: expoId || "",
            industry_id: industryId || "",
            Is_Pre,
            Is_Visit,

            // ✅ IMPORTANT: send selected visitor_category_id
            visitor_category_id: visitorCategoryId ? String(visitorCategoryId) : "0",

            page: pageNo,
        };
    };

    // -------------------- Search list (calls API) --------------------
    const handleSearch = async (pageNo = 1) => {
        if (!industryId) {
            toast.error("Please select Industry");
            return;
        }

        // ✅ IMPORTANT: clear old table immediately
        setRows([]);

        try {
            setIsSearching(true);
            const token = getToken();
            const payload = buildSearchPayload(pageNo);

            const res = await axios.post(LIST_API, payload, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "Content-Type": "application/json",
                },
            });

            if (res.data?.success) {
                hasSearchedRef.current = true;

                const list: VisitorRow[] = res.data?.data || [];
                setRows(list);
                setCount(Number(res.data?.count || list.length || 0));

                // meta pagination
                const meta = res.data?.meta || {};
                setPerPage(Number(meta?.per_page || 10));
                setLastPage(Number(meta?.last_page || 1));

                // keep page in sync
                setPage(Number(meta?.current_page || pageNo));

                if (list.length === 0) toast.info("No data found");
            } else {
                hasSearchedRef.current = true;
                resetResults();
                setPage(1);
                toast.error(res.data?.message || "No data found");
            }
        } catch (e: any) {
            console.error(e);
            hasSearchedRef.current = true;
            resetResults();
            setPage(1);
            toast.error(e?.response?.data?.message || "Error fetching data");
        } finally {
            setIsSearching(false);
        }
    };

    // ✅ when page changes -> call API with that page (after first search)
    useEffect(() => {
        if (!hasSearchedRef.current) return;
        handleSearch(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const totalPages = useMemo(() => {
        return Math.max(1, Number(lastPage || 1));
    }, [lastPage]);

    // -------------------- Export to Excel --------------------
    const handleExport = async () => {
        if (!industryId) {
            toast.error("Please select Industry");
            return;
        }

        try {
            const token = getToken();

            const Is_Pre = preRegister === "" ? 2 : preRegister === "yes" ? 1 : 0;
            const Is_Visit = visited === "" ? 2 : visited === "yes" ? 1 : 0;

            const payload = {
                expo_id: expoId ? Number(expoId) : "",
                industry_id: industryId ? Number(industryId) : "",
                Is_Pre,
                Is_Visit,

                // ✅ include in export too
                visitor_category_id: visitorCategoryId ? Number(visitorCategoryId) : 0,
            };

            const res = await axios.post(`${apiUrl}/admin_visitors_export`, payload, {
                responseType: "blob",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const contentType = res.headers?.["content-type"] || "";
            if (contentType.includes("application/json")) {
                const text = await new Response(res.data).text();
                try {
                    const json = JSON.parse(text);
                    toast.error(json?.message || "Export failed");
                } catch {
                    toast.error("Export failed");
                }
                return;
            }

            const blob = new Blob([res.data], {
                type: contentType || "application/vnd.ms-excel",
            });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;

            const today = new Date().toISOString().slice(0, 10);
            a.download = `visitor_report_${today}.xlsx`;

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
            toast.success("Excel exported successfully");
        } catch (e: any) {
            console.error(e);
            toast.error(e?.response?.data?.message || "Error exporting excel");
        }
    };

    return (
        <div className="p-6">
            <div className="w-full bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Visitor Report</h2>
                </div>

                {/* Filters */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-5">
                    {/* Industry */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Industry</label>
                        <select
                            value={industryId}
                            onChange={(e) => {
                                setIndustryId(e.target.value);
                                onAnyFilterChangeReset();
                            }}
                            disabled={isIndustryLoading}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">
                                {isIndustryLoading ? "Loading..." : "Select Industry"}
                            </option>
                            {industries.map((it) => (
                                <option key={it.id} value={String(it.id)}>
                                    {it.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Expo */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Expo</label>
                        <select
                            value={expoId}
                            onChange={(e) => {
                                setExpoId(e.target.value);
                                onAnyFilterChangeReset();
                            }}
                            disabled={!industryId || isExpoLoading}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">
                                {!industryId
                                    ? "Select Industry first"
                                    : isExpoLoading
                                        ? "Loading..."
                                        : "Select Expo"}
                            </option>
                            {expos.map((it) => (
                                <option key={it.expoid} value={String(it.expoid)}>
                                    {it.exponame}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ✅ Visitor Category */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Visitor Category</label>
                        <select
                            value={visitorCategoryId}
                            onChange={(e) => {
                                setVisitorCategoryId(e.target.value || "0");
                                onAnyFilterChangeReset();
                            }}
                            disabled={isVisitorCategoryLoading}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="0">
                                {isVisitorCategoryLoading ? "Loading..." : "All Categories"}
                            </option>
                            {visitorCategories.map((c) => (
                                <option key={c.id} value={String(c.id)}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pre Register Yes/No */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Pre Register</label>
                        <select
                            value={preRegister}
                            onChange={(e) => {
                                setPreRegister(e.target.value as YesNo);
                                onAnyFilterChangeReset();
                            }}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    {/* Visited Yes/No */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Visited</label>
                        <select
                            value={visited}
                            onChange={(e) => {
                                setVisited(e.target.value as YesNo);
                                onAnyFilterChangeReset();
                            }}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                {/* Summary */}
                <div className=" px-6 pb-4 text-sm text-gray-600 flex justify-end gap-2 items-center">
                    <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
                        Count: <span className="font-semibold">{count}</span>
                    </div>

                    <div>
                        <button
                            onClick={() => {
                                hasSearchedRef.current = true;

                                // ✅ avoid double API call
                                if (page !== 1) {
                                    setPage(1);
                                } else {
                                    handleSearch(1);
                                }
                            }}
                            disabled={isSearching}
                            className="w-full px-6 py-2 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={handleExport}
                            className="w-full px-6 py-2 bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-green-700 transition"
                        >
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* ✅ Table (Visitor Category column added) */}
                <div className="px-6 pb-6 overflow-x-auto">
                    <table className="min-w-full border rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-sm text-gray-700">
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Name</th>
                                <th className="p-3 border-b">Mobile</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Company</th>
                                <th className="p-3 border-b">State</th>
                                <th className="p-3 border-b">City</th>
                                <th className="p-3 border-b">Visitor Category</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td className="p-4 text-center text-gray-500" colSpan={8}>
                                        {isSearching ? "Searching..." : "No data found"}
                                    </td>
                                </tr>
                            ) : (
                                rows.map((r, idx) => (
                                    <tr key={r.visitorid} className="text-sm">
                                        <td className="p-3 border-b">
                                            {(page - 1) * perPage + idx + 1}
                                        </td>
                                        <td className="p-3 border-b">{r.name || "-"}</td>
                                        <td className="p-3 border-b">{r.mobileno || "-"}</td>
                                        <td className="p-3 border-b">{r.email || "-"}</td>
                                        <td className="p-3 border-b">{r.companyname || "-"}</td>
                                        <td className="p-3 border-b">{r.state_name || "-"}</td>
                                        <td className="p-3 border-b">{r.city_name || "-"}</td>

                                        {/* ✅ Show category name from API OR fallback mapping */}
                                        <td className="p-3 border-b">
                                            {r.visitor_category_name ||
                                                categoryNameById.get(String(r.visitor_category_id ?? "")) ||
                                                "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                            Page <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{totalPages}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1 || isSearching || !hasSearchedRef.current}
                                className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
                            >
                                Prev
                            </button>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || isSearching || !hasSearchedRef.current}
                                className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
