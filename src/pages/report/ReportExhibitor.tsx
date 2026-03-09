// import { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // -------------------- Types --------------------
// type YesNo = "" | "yes" | "no";

// type IndustryItem = { id: number; name: string };
// type ExpoItem = { expoid: number; exponame: string };
// type OptionItem = { id: string; name: string };

// type ExhibitorRow = {
//     exhibitorid: number;
//     name: string;
//     mobileno?: string;
//     email?: string;
//     companyname?: string;
//     address?: string;
//     state_name?: string | null;
//     city_name?: string | null;
//     business_type_name?: string | null;
//     category_name?: string | null;
//     subcategory_name?: string | null;
//     industry_name?: string | null;
//     expo_name?: string | null;
//     created_at?: string;
//     enter_by?: string;
// };

// function getToken() {
//     return localStorage.getItem("usertoken");
// }

// function authHeaders() {
//     const token = getToken();
//     return {
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         "Content-Type": "application/json",
//     };
// }

// function pickId(obj: any) {
//     return String(
//         obj?.id ??
//         obj?.category_id ??
//         obj?.subcategory_id ??
//         obj?.business_type_id ??
//         ""
//     );
// }

// function pickName(obj: any) {
//     return String(
//         obj?.name ??
//         obj?.title ??
//         obj?.category_name ??
//         obj?.subcategory_name ??
//         obj?.business_type_name ??
//         obj?.industry_category_name ??
//         obj?.strBusinessType ??
//         ""
//     );
// }

// export default function ExhibitorReportPage() {
//     // -------------------- Filters --------------------
//     const [industryId, setIndustryId] = useState("");
//     const [expoId, setExpoId] = useState("");
//     const [businessTypeId, setBusinessTypeId] = useState("");
//     const [categoryId, setCategoryId] = useState("");
//     const [subcategoryId, setSubcategoryId] = useState("");
//     const [preRegister, setPreRegister] = useState<YesNo>("");
//     const [visited, setVisited] = useState<YesNo>("");

//     // -------------------- Dropdown data --------------------
//     const [industries, setIndustries] = useState<IndustryItem[]>([]);
//     const [expos, setExpos] = useState<ExpoItem[]>([]);
//     const [businessTypeOptions, setBusinessTypeOptions] = useState<OptionItem[]>([]);
//     const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
//     const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);

//     // -------------------- Table data --------------------
//     const [rows, setRows] = useState<ExhibitorRow[]>([]);
//     const [count, setCount] = useState(0);

//     // -------------------- Pagination --------------------
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const [lastPage, setLastPage] = useState(1);

//     // -------------------- Loading --------------------
//     const [isIndustryLoading, setIsIndustryLoading] = useState(false);
//     const [isExpoLoading, setIsExpoLoading] = useState(false);
//     const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
//     const [loadingCategory, setLoadingCategory] = useState(false);
//     const [loadingSubcategory, setLoadingSubcategory] = useState(false);
//     const [isSearching, setIsSearching] = useState(false);

//     // -------------------- API --------------------
//     const LIST_API = `${apiUrl}/admin_exhibitor_list`;
//     const EXPORT_API = `${apiUrl}/admin_exhibitors_export`;

//     const hasSearchedRef = useRef(false);

//     // -------------------- Helpers --------------------
//     const resetResults = () => {
//         setRows([]);
//         setCount(0);
//         setPerPage(10);
//         setLastPage(1);
//     };

//     const onAnyFilterChangeReset = () => {
//         setPage(1);
//         hasSearchedRef.current = false;
//         resetResults();
//     };

//     // -------------------- Industry --------------------
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

//             if (res.data?.success) {
//                 setIndustries(res.data?.data || []);
//             } else {
//                 toast.error(res.data?.message || "Failed to fetch industries");
//             }
//         } catch (e) {
//             console.error(e);
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
//                 setExpos(res.data?.data || []);
//             } else {
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
//                         id: String(x.id),
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

//     // initial
//     useEffect(() => {
//         fetchIndustries();
//         fetchBusinessTypes();
//     }, []);

//     // industry change
//     useEffect(() => {
//         setExpoId("");
//         setExpos([]);
//         setCategoryId("");
//         setSubcategoryId("");
//         setCategoryOptions([]);
//         setSubcategoryOptions([]);

//         onAnyFilterChangeReset();

//         if (industryId) {
//             fetchExpos(industryId);
//             fetchCategoriesByIndustry(industryId);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [industryId]);

//     // category change
//     useEffect(() => {
//         setSubcategoryId("");
//         setSubcategoryOptions([]);

//         onAnyFilterChangeReset();

//         if (categoryId) {
//             fetchSubcategoriesByCategory(categoryId);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [categoryId]);

//     // -------------------- Payload --------------------
//     const buildSearchPayload = (pageNo: number) => {
//         const Is_Pre = preRegister === "" ? "2" : preRegister === "yes" ? "1" : "0";
//         const Is_Visit = visited === "" ? "2" : visited === "yes" ? "1" : "0";

//         return {
//             industry_id: industryId || "",
//             expo_id: expoId || "",
//             business_type_id: businessTypeId || "",
//             category_id: categoryId || "",
//             subcategory_id: subcategoryId || "",
//             Is_Pre,
//             Is_Visit,
//             page: pageNo,
//         };
//     };

//     // -------------------- Search --------------------
//     const handleSearch = async (pageNo = 1) => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         setRows([]);

//         try {
//             setIsSearching(true);

//             const res = await axios.post(LIST_API, buildSearchPayload(pageNo), {
//                 headers: {
//                     ...authHeaders(),
//                 },
//             });

//             if (res.data?.success) {
//                 hasSearchedRef.current = true;

//                 const list: ExhibitorRow[] = res.data?.data || [];
//                 setRows(list);
//                 setCount(Number(res.data?.count || list.length || 0));

//                 const meta = res.data?.meta || {};
//                 setPerPage(Number(meta?.per_page || 10));
//                 setLastPage(Number(meta?.last_page || 1));
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

//     useEffect(() => {
//         if (!hasSearchedRef.current) return;
//         handleSearch(page);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [page]);

//     const totalPages = useMemo(() => Math.max(1, Number(lastPage || 1)), [lastPage]);

//     // -------------------- Export --------------------
//     const handleExport = async () => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         try {
//             const Is_Pre = preRegister === "" ? 2 : preRegister === "yes" ? 1 : 0;
//             const Is_Visit = visited === "" ? 2 : visited === "yes" ? 1 : 0;

//             const payload = {
//                 industry_id: industryId ? Number(industryId) : "",
//                 expo_id: expoId ? Number(expoId) : "",
//                 business_type_id: businessTypeId ? Number(businessTypeId) : "",
//                 category_id: categoryId ? Number(categoryId) : "",
//                 subcategory_id: subcategoryId ? Number(subcategoryId) : "",
//                 Is_Pre,
//                 Is_Visit,
//             };

//             const token = getToken();

//             const res = await axios.post(EXPORT_API, payload, {
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
//                 type: contentType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });

//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             const today = new Date().toISOString().slice(0, 10);
//             a.download = `exhibitor_report_${today}.xlsx`;
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
//                 <div className="px-6 py-4 border-b">
//                     <h2 className="text-2xl font-bold text-gray-800">Exhibitor Report</h2>
//                 </div>

//                 {/* Filters */}
//                 <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
//                     {/* Industry */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Industry</label>
//                         <select
//                             value={industryId}
//                             onChange={(e) => setIndustryId(e.target.value)}
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

//                     {/* Business Type */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Business Type</label>
//                         <select
//                             value={businessTypeId}
//                             onChange={(e) => {
//                                 setBusinessTypeId(e.target.value);
//                                 onAnyFilterChangeReset();
//                             }}
//                             disabled={loadingBusinessTypes}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {loadingBusinessTypes ? "Loading..." : "Select Business Type"}
//                             </option>
//                             {businessTypeOptions.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Category</label>
//                         <select
//                             value={categoryId}
//                             onChange={(e) => setCategoryId(e.target.value)}
//                             disabled={!industryId || loadingCategory}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {!industryId
//                                     ? "Select Industry first"
//                                     : loadingCategory
//                                         ? "Loading..."
//                                         : "Select Category"}
//                             </option>
//                             {categoryOptions.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Subcategory */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">Subcategory</label>
//                         <select
//                             value={subcategoryId}
//                             onChange={(e) => {
//                                 setSubcategoryId(e.target.value);
//                                 onAnyFilterChangeReset();
//                             }}
//                             disabled={!categoryId || loadingSubcategory}
//                             className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         >
//                             <option value="">
//                                 {!categoryId
//                                     ? "Select Category first"
//                                     : loadingSubcategory
//                                         ? "Loading..."
//                                         : "Select Subcategory"}
//                             </option>
//                             {subcategoryOptions.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                 </div>

//                 {/* Actions */}
//                 <div className="px-6 pb-4 text-sm text-gray-600 flex justify-end gap-2 items-center">
//                     <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
//                         Count: <span className="font-semibold">{count}</span>
//                     </div>

//                     <button
//                         onClick={() => {
//                             hasSearchedRef.current = true;
//                             if (page !== 1) setPage(1);
//                             else handleSearch(1);
//                         }}
//                         disabled={isSearching}
//                         className="px-6 py-2 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//                     >
//                         {isSearching ? "Searching..." : "Search"}
//                     </button>

//                     <button
//                         onClick={handleExport}
//                         className="px-6 py-2 bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-green-700 transition"
//                     >
//                         Export Excel
//                     </button>
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
//                                 <th className="p-3 border-b">Address</th>
//                                 <th className="p-3 border-b">State</th>
//                                 <th className="p-3 border-b">City</th>
//                                 <th className="p-3 border-b">Industry</th>
//                                 <th className="p-3 border-b">Expo</th>
//                                 <th className="p-3 border-b">Business Type</th>
//                                 <th className="p-3 border-b">Category</th>
//                                 <th className="p-3 border-b">Subcategory</th>
//                                 <th className="p-3 border-b">Entry Date</th>
//                                 <th className="p-3 border-b">Entry By</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {rows.length === 0 ? (
//                                 <tr>
//                                     <td className="p-4 text-center text-gray-500" colSpan={15}>
//                                         {isSearching ? "Searching..." : "No data found"}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 rows.map((r, idx) => (
//                                     <tr key={r.exhibitorid} className="text-sm">
//                                         <td className="p-3 border-b">{(page - 1) * perPage + idx + 1}</td>
//                                         <td className="p-3 border-b">{r.name || "-"}</td>
//                                         <td className="p-3 border-b">{r.mobileno || "-"}</td>
//                                         <td className="p-3 border-b">{r.email || "-"}</td>
//                                         <td className="p-3 border-b">{r.companyname || "-"}</td>
//                                         <td className="p-3 border-b">{r.address || "-"}</td>
//                                         <td className="p-3 border-b">{r.state_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.city_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.industry_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.expo_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.business_type_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.category_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.subcategory_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.created_at || "-"}</td>
//                                         <td className="p-3 border-b">{r.enter_by || "-"}</td>
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


import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

// -------------------- Types --------------------
type IndustryItem = { id: number; name: string };
type OptionItem = { id: string; name: string };

type ExpectedExhibitorRow = {
    id: number;
    gst?: string | null;
    company_name?: string | null;
    primary_contact_name?: string | null;
    primary_contact_mobile?: string | null;
    primary_contact_designation?: string | null;
    primary_contact_email?: string | null;
    state_id?: number | null;
    city_id?: number | null;
    state_name?: string | null;
    city_name?: string | null;
    address?: string | null;
    industry_id?: number | null;
    industry?: string | null;
    category_id?: number | null;
    industry_category?: string | null;
    subcategory_id?: number | null;
    industry_subcategory?: string | null;
    iBusinessType?: number | null;
    businessType?: string | null;
    created_at?: string | null;
    enter_by?: number | string | null;
};

function getToken() {
    return localStorage.getItem("usertoken");
}

function authHeaders() {
    const token = getToken();
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
    };
}

function pickId(obj: any) {
    return String(
        obj?.id ??
        obj?.category_id ??
        obj?.subcategory_id ??
        obj?.business_type_id ??
        ""
    );
}

function pickName(obj: any) {
    return String(
        obj?.name ??
        obj?.title ??
        obj?.category_name ??
        obj?.subcategory_name ??
        obj?.business_type_name ??
        obj?.industry_category_name ??
        obj?.strBusinessType ??
        ""
    );
}

export default function ExpectedExhibitorReportPage() {
    // -------------------- Filters --------------------
    const [industryId, setIndustryId] = useState("");
    const [businessTypeId, setBusinessTypeId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");

    // -------------------- Dropdown data --------------------
    const [industries, setIndustries] = useState<IndustryItem[]>([]);
    const [businessTypeOptions, setBusinessTypeOptions] = useState<OptionItem[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);

    // -------------------- Table data --------------------
    const [rows, setRows] = useState<ExpectedExhibitorRow[]>([]);
    const [count, setCount] = useState(0);

    // -------------------- Loading --------------------
    const [isIndustryLoading, setIsIndustryLoading] = useState(false);
    const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingSubcategory, setLoadingSubcategory] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // -------------------- API --------------------
    const LIST_API = `${apiUrl}/exhibitors/admin_expected_exhibitor_list`;
    const EXPORT_API = `${apiUrl}/exhibitors/admin_expected_exhibitor_export`;

    // -------------------- Helpers --------------------
    const resetResults = () => {
        setRows([]);
        setCount(0);
    };

    const onAnyFilterChangeReset = () => {
        resetResults();
    };

    // -------------------- Industry --------------------
    const fetchIndustries = async () => {
        try {
            setIsIndustryLoading(true);

            const res = await axios.post(
                `${apiUrl}/IndustryList`,
                {},
                {
                    headers: authHeaders(),
                }
            );

            if (res.data?.success) {
                setIndustries(res.data?.data || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch industries");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error fetching industries");
        } finally {
            setIsIndustryLoading(false);
        }
    };

    // -------------------- Business Types --------------------
    const fetchBusinessTypes = async () => {
        try {
            setLoadingBusinessTypes(true);

            const res = await axios.post(
                `${apiUrl}/business-types/index`,
                {},
                { headers: authHeaders() }
            );

            if (res.data?.success) {
                const list = Array.isArray(res.data?.data)
                    ? res.data.data.map((x: any) => ({
                        id: String(x.id),
                        name: pickName(x),
                    }))
                    : [];

                setBusinessTypeOptions(list);
            } else {
                toast.error(res.data?.message || "Failed to load business types");
                setBusinessTypeOptions([]);
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to load business types");
            setBusinessTypeOptions([]);
        } finally {
            setLoadingBusinessTypes(false);
        }
    };

    // -------------------- Category by Industry --------------------
    const fetchCategoriesByIndustry = async (indId: string) => {
        try {
            setLoadingCategory(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-industry`,
                { industry_id: indId },
                { headers: authHeaders() }
            );

            const dataRows = res.data?.data || res.data?.result || [];
            const list: OptionItem[] = (Array.isArray(dataRows) ? dataRows : [])
                .map((r: any) => ({
                    id: pickId(r),
                    name: pickName(r) || String(r?.industry_category_name || ""),
                }))
                .filter((x) => x.id && x.name);

            setCategoryOptions(list);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to load categories");
            setCategoryOptions([]);
        } finally {
            setLoadingCategory(false);
        }
    };

    // -------------------- Subcategory by Category --------------------
    const fetchSubcategoriesByCategory = async (catId: string) => {
        try {
            setLoadingSubcategory(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-category`,
                { industry_category_id: catId },
                { headers: authHeaders() }
            );

            const dataRows = res.data?.data || res.data?.result || [];
            const list: OptionItem[] = (Array.isArray(dataRows) ? dataRows : [])
                .map((r: any) => ({
                    id: pickId(r),
                    name: pickName(r),
                }))
                .filter((x) => x.id && x.name);

            setSubcategoryOptions(list);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to load subcategories");
            setSubcategoryOptions([]);
        } finally {
            setLoadingSubcategory(false);
        }
    };

    // -------------------- Initial Load --------------------
    useEffect(() => {
        fetchIndustries();
        fetchBusinessTypes();
    }, []);

    // -------------------- Industry Change --------------------
    useEffect(() => {
        setCategoryId("");
        setSubcategoryId("");
        setCategoryOptions([]);
        setSubcategoryOptions([]);

        onAnyFilterChangeReset();

        if (industryId) {
            fetchCategoriesByIndustry(industryId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [industryId]);

    // -------------------- Category Change --------------------
    useEffect(() => {
        setSubcategoryId("");
        setSubcategoryOptions([]);

        onAnyFilterChangeReset();

        if (categoryId) {
            fetchSubcategoriesByCategory(categoryId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    // -------------------- Payload --------------------
    const buildSearchPayload = () => {
        return {
            iBusinessType: businessTypeId || "",
            subcategory_id: subcategoryId || "",
            category_id: categoryId || "",
            industry_id: industryId || "",
        };
    };

    // -------------------- Search --------------------
    const handleSearch = async () => {
        if (!industryId) {
            toast.error("Please select Industry");
            return;
        }

        try {
            setIsSearching(true);
            setRows([]);

            const res = await axios.post(LIST_API, buildSearchPayload(), {
                headers: authHeaders(),
            });

            if (res.data?.success) {
                const list: ExpectedExhibitorRow[] = Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

                setRows(list);
                setCount(Number(res.data?.count || list.length || 0));

                if (list.length === 0) {
                    toast.info("No data found");
                }
            } else {
                resetResults();
                toast.error(res.data?.message || "No data found");
            }
        } catch (e: any) {
            console.error(e);
            resetResults();
            toast.error(e?.response?.data?.message || "Error fetching data");
        } finally {
            setIsSearching(false);
        }
    };

    // -------------------- Export --------------------
    const handleExport = async () => {
        if (!industryId) {
            toast.error("Please select Industry");
            return;
        }

        try {
            setIsExporting(true);

            const res = await axios.post(EXPORT_API, buildSearchPayload(), {
                responseType: "blob",
                headers: {
                    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
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
                type:
                    contentType ||
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const today = new Date().toISOString().slice(0, 10);
            a.download = `expected_exhibitor_report_${today}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Excel exported successfully");
        } catch (e: any) {
            console.error(e);
            toast.error(e?.response?.data?.message || "Error exporting excel");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="w-full bg-white rounded-2xl shadow-xl">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Expected Exhibitor Report
                    </h2>
                </div>

                {/* Filters */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Industry */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Industry</label>
                        <select
                            value={industryId}
                            onChange={(e) => setIndustryId(e.target.value)}
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

                    {/* Business Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Business Type
                        </label>
                        <select
                            value={businessTypeId}
                            onChange={(e) => {
                                setBusinessTypeId(e.target.value);
                                onAnyFilterChangeReset();
                            }}
                            disabled={loadingBusinessTypes}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">
                                {loadingBusinessTypes ? "Loading..." : "Select Business Type"}
                            </option>
                            {businessTypeOptions.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={!industryId || loadingCategory}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">
                                {!industryId
                                    ? "Select Industry first"
                                    : loadingCategory
                                        ? "Loading..."
                                        : "Select Category"}
                            </option>
                            {categoryOptions.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Subcategory
                        </label>
                        <select
                            value={subcategoryId}
                            onChange={(e) => {
                                setSubcategoryId(e.target.value);
                                onAnyFilterChangeReset();
                            }}
                            disabled={!categoryId || loadingSubcategory}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">
                                {!categoryId
                                    ? "Select Category first"
                                    : loadingSubcategory
                                        ? "Loading..."
                                        : "Select Subcategory"}
                            </option>
                            {subcategoryOptions.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-4 text-sm text-gray-600 flex justify-end gap-2 items-center flex-wrap">
                    <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
                        Count: <span className="font-semibold">{count}</span>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-6 py-2 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-6 py-2 bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-green-700 transition"
                    >
                        {isExporting ? "Exporting..." : "Export Excel"}
                    </button>
                </div>

                {/* Table */}
                <div className="px-6 pb-6 overflow-x-auto">
                    <table className="min-w-full border rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-sm text-gray-700">
                                <th className="p-3 border-b">No</th>
                                <th className="p-3 border-b">Company Name</th>
                                <th className="p-3 border-b">Primary Contact Name</th>
                                <th className="p-3 border-b">Mobile</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Designation</th>
                                <th className="p-3 border-b">GST</th>
                                <th className="p-3 border-b">Address</th>
                                <th className="p-3 border-b">State</th>
                                <th className="p-3 border-b">City</th>
                                <th className="p-3 border-b">Industry</th>
                                <th className="p-3 border-b">Business Type</th>
                                <th className="p-3 border-b">Category</th>
                                <th className="p-3 border-b">Subcategory</th>
                                <th className="p-3 border-b">Created At</th>
                                <th className="p-3 border-b">Enter By</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td className="p-4 text-center text-gray-500" colSpan={16}>
                                        {isSearching ? "Searching..." : "No data found"}
                                    </td>
                                </tr>
                            ) : (
                                rows.map((r, idx) => (
                                    <tr key={r.id} className="text-sm hover:bg-gray-50">
                                        <td className="p-3 border-b">{idx + 1}</td>
                                        <td className="p-3 border-b">{r.company_name || "-"}</td>
                                        <td className="p-3 border-b">{r.primary_contact_name || "-"}</td>
                                        <td className="p-3 border-b">{r.primary_contact_mobile || "-"}</td>
                                        <td className="p-3 border-b">{r.primary_contact_email || "-"}</td>
                                        <td className="p-3 border-b">
                                            {r.primary_contact_designation || "-"}
                                        </td>
                                        <td className="p-3 border-b">{r.gst || "-"}</td>
                                        <td className="p-3 border-b">{r.address || "-"}</td>
                                        <td className="p-3 border-b">{r.state_name || "-"}</td>
                                        <td className="p-3 border-b">{r.city_name || "-"}</td>
                                        <td className="p-3 border-b">{r.industry || "-"}</td>
                                        <td className="p-3 border-b">{r.businessType || "-"}</td>
                                        <td className="p-3 border-b">{r.industry_category || "-"}</td>
                                        <td className="p-3 border-b">{r.industry_subcategory || "-"}</td>
                                        <td className="p-3 border-b">{r.created_at || "-"}</td>
                                        <td className="p-3 border-b">{r.enter_by || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}