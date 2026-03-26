// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// // -------------------- Types --------------------
// type IndustryItem = { id: number; name: string };
// type OptionItem = { id: string; name: string };

// type ExpectedExhibitorRow = {
//     id: number;
//     gst?: string | null;
//     company_name?: string | null;
//     primary_contact_name?: string | null;
//     primary_contact_mobile?: string | null;
//     primary_contact_designation?: string | null;
//     primary_contact_email?: string | null;
//     state_id?: number | null;
//     city_id?: number | null;
//     state_name?: string | null;
//     city_name?: string | null;
//     address?: string | null;
//     industry_id?: number | null;
//     industry?: string | null;
//     category_id?: number | null;
//     industry_category?: string | null;
//     subcategory_id?: number | null;
//     industry_subcategory?: string | null;
//     iBusinessType?: number | null;
//     businessType?: string | null;
//     created_at?: string | null;
//     enter_by?: number | string | null;
// };

// function getToken() {
//     return localStorage.getItem("usertoken");
// }

// function authHeaders() {
//     const token = getToken();
//     return {
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         "Content-Type": "application/json",
//         Accept: "application/json",
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

// export default function ExpectedExhibitorReportPage() {
//     // -------------------- Filters --------------------
//     const [industryId, setIndustryId] = useState("");
//     const [businessTypeId, setBusinessTypeId] = useState("");
//     const [categoryId, setCategoryId] = useState("");
//     const [subcategoryId, setSubcategoryId] = useState("");

//     // -------------------- Dropdown data --------------------
//     const [industries, setIndustries] = useState<IndustryItem[]>([]);
//     const [businessTypeOptions, setBusinessTypeOptions] = useState<OptionItem[]>([]);
//     const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
//     const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);

//     // -------------------- Table data --------------------
//     const [rows, setRows] = useState<ExpectedExhibitorRow[]>([]);
//     const [count, setCount] = useState(0);

//     // -------------------- Loading --------------------
//     const [isIndustryLoading, setIsIndustryLoading] = useState(false);
//     const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
//     const [loadingCategory, setLoadingCategory] = useState(false);
//     const [loadingSubcategory, setLoadingSubcategory] = useState(false);
//     const [isSearching, setIsSearching] = useState(false);
//     const [isExporting, setIsExporting] = useState(false);

//     // -------------------- API --------------------
//     const LIST_API = `${apiUrl}/exhibitors/admin_expected_exhibitor_list`;
//     const EXPORT_API = `${apiUrl}/exhibitors/admin_expected_exhibitor_export`;

//     // -------------------- Helpers --------------------
//     const resetResults = () => {
//         setRows([]);
//         setCount(0);
//     };

//     const onAnyFilterChangeReset = () => {
//         resetResults();
//     };

//     const buildPayload = () => ({
//         iBusinessType: businessTypeId || "",
//         subcategory_id: subcategoryId || "",
//         category_id: categoryId || "",
//         industry_id: industryId || "",
//     });

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
//                 setIndustries(Array.isArray(res.data?.data) ? res.data.data : []);
//             } else {
//                 toast.error(res.data?.message || "Failed to fetch industries");
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Error fetching industries");
//         } finally {
//             setIsIndustryLoading(false);
//         }
//     };

//     // -------------------- Business Types --------------------
//     const fetchBusinessTypes = async () => {
//         try {
//             setLoadingBusinessTypes(true);

//             const res = await axios.post(
//                 `${apiUrl}/business-types/index`,
//                 {},
//                 { headers: authHeaders() }
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
//                 setBusinessTypeOptions([]);
//                 toast.error(res.data?.message || "Failed to load business types");
//             }
//         } catch (error: any) {
//             console.error(error);
//             setBusinessTypeOptions([]);
//             toast.error(error?.response?.data?.message || "Failed to load business types");
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
//                 { headers: authHeaders() }
//             );

//             const dataRows = res.data?.data || res.data?.result || [];
//             const list: OptionItem[] = (Array.isArray(dataRows) ? dataRows : [])
//                 .map((r: any) => ({
//                     id: pickId(r),
//                     name: pickName(r) || String(r?.industry_category_name || ""),
//                 }))
//                 .filter((x) => x.id && x.name);

//             setCategoryOptions(list);
//         } catch (error: any) {
//             console.error(error);
//             setCategoryOptions([]);
//             toast.error(error?.response?.data?.message || "Failed to load categories");
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
//                 { headers: authHeaders() }
//             );

//             const dataRows = res.data?.data || res.data?.result || [];
//             const list: OptionItem[] = (Array.isArray(dataRows) ? dataRows : [])
//                 .map((r: any) => ({
//                     id: pickId(r),
//                     name: pickName(r),
//                 }))
//                 .filter((x) => x.id && x.name);

//             setSubcategoryOptions(list);
//         } catch (error: any) {
//             console.error(error);
//             setSubcategoryOptions([]);
//             toast.error(error?.response?.data?.message || "Failed to load subcategories");
//         } finally {
//             setLoadingSubcategory(false);
//         }
//     };

//     // -------------------- Initial Load --------------------
//     useEffect(() => {
//         fetchIndustries();
//         fetchBusinessTypes();
//     }, []);

//     // -------------------- Industry Change --------------------
//     useEffect(() => {
//         setCategoryId("");
//         setSubcategoryId("");
//         setCategoryOptions([]);
//         setSubcategoryOptions([]);
//         onAnyFilterChangeReset();

//         if (industryId) {
//             fetchCategoriesByIndustry(industryId);
//         }
//     }, [industryId]);

//     // -------------------- Category Change --------------------
//     useEffect(() => {
//         setSubcategoryId("");
//         setSubcategoryOptions([]);
//         onAnyFilterChangeReset();

//         if (categoryId) {
//             fetchSubcategoriesByCategory(categoryId);
//         }
//     }, [categoryId]);

//     // -------------------- Search --------------------
//     const handleSearch = async () => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         try {
//             setIsSearching(true);
//             resetResults();

//             const payload = buildPayload();

//             const res = await axios.post(LIST_API, payload, {
//                 headers: authHeaders(),
//             });

//             if (res.data?.success) {
//                 const list: ExpectedExhibitorRow[] = Array.isArray(res.data?.data)
//                     ? res.data.data
//                     : [];

//                 setRows(list);
//                 setCount(Number(res.data?.count || list.length || 0));

//                 if (list.length === 0) {
//                     toast.info("No data found");
//                 }
//             } else {
//                 resetResults();
//                 toast.error(res.data?.message || "No data found");
//             }
//         } catch (error: any) {
//             console.error(error);
//             resetResults();
//             toast.error(error?.response?.data?.message || "Error fetching data");
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     // -------------------- Export --------------------
//     const handleExport = async () => {
//         if (!industryId) {
//             toast.error("Please select Industry");
//             return;
//         }

//         try {
//             setIsExporting(true);

//             const payload = buildPayload();

//             const res = await axios.post(EXPORT_API, payload, {
//                 responseType: "blob",
//                 headers: {
//                     ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
//                 },
//             });

//             const contentType = res.headers?.["content-type"] || "";

//             // if backend returns JSON error in blob
//             if (
//                 contentType.includes("application/json") ||
//                 contentType.includes("text/json")
//             ) {
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
//                 type:
//                     contentType ||
//                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });

//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;

//             const today = new Date().toISOString().slice(0, 10);
//             link.download = `expected_exhibitor_report_${today}.xlsx`;

//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);

//             toast.success("Excel exported successfully");
//         } catch (error: any) {
//             console.error(error);
//             toast.error(error?.response?.data?.message || "Error exporting excel");
//         } finally {
//             setIsExporting(false);
//         }
//     };

//     return (
//         <div className="p-6">
//             <div className="w-full bg-white rounded-2xl shadow-xl">
//                 <div className="px-6 py-4 border-b">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Expected Exhibitor Report
//                     </h2>
//                 </div>

//                 {/* Filters */}
//                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

//                     {/* Business Type */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Business Type
//                         </label>
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
//                         <label className="text-sm font-medium text-gray-700">
//                             Subcategory
//                         </label>
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
//                 <div className="px-6 pb-4 text-sm text-gray-600 flex justify-end gap-2 items-center flex-wrap">
//                     <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
//                         Count: <span className="font-semibold">{count}</span>
//                     </div>

//                     <button
//                         onClick={handleSearch}
//                         disabled={isSearching}
//                         className="px-6 py-2 bg-[#2e56a6] disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
//                     >
//                         {isSearching ? "Searching..." : "Search"}
//                     </button>

//                     <button
//                         onClick={handleExport}
//                         disabled={isExporting}
//                         className="px-6 py-2 bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-green-700 transition"
//                     >
//                         {isExporting ? "Exporting..." : "Export Excel"}
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <div className="px-6 pb-6 overflow-x-auto">
//                     <table className="min-w-full border rounded-xl overflow-hidden">
//                         <thead className="bg-gray-50">
//                             <tr className="text-left text-sm text-gray-700">
//                                 <th className="p-3 border-b">No</th>
//                                 <th className="p-3 border-b">Company Name</th>
//                                 <th className="p-3 border-b">Primary Contact Name</th>
//                                 <th className="p-3 border-b">Mobile</th>
//                                 <th className="p-3 border-b">Email</th>
//                                 <th className="p-3 border-b">Designation</th>
//                                 <th className="p-3 border-b">GST</th>
//                                 <th className="p-3 border-b">Address</th>
//                                 <th className="p-3 border-b">State</th>
//                                 <th className="p-3 border-b">City</th>
//                                 <th className="p-3 border-b">Industry</th>
//                                 <th className="p-3 border-b">Business Type</th>
//                                 <th className="p-3 border-b">Category</th>
//                                 <th className="p-3 border-b">Subcategory</th>
//                                 <th className="p-3 border-b">Created At</th>
//                                 <th className="p-3 border-b">Enter By</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {rows.length === 0 ? (
//                                 <tr>
//                                     <td className="p-4 text-center text-gray-500" colSpan={16}>
//                                         {isSearching ? "Searching..." : "No data found"}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 rows.map((r, idx) => (
//                                     <tr key={r.id} className="text-sm hover:bg-gray-50">
//                                         <td className="p-3 border-b">{idx + 1}</td>
//                                         <td className="p-3 border-b">{r.company_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.primary_contact_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.primary_contact_mobile || "-"}</td>
//                                         <td className="p-3 border-b">{r.primary_contact_email || "-"}</td>
//                                         <td className="p-3 border-b">{r.primary_contact_designation || "-"}</td>
//                                         <td className="p-3 border-b">{r.gst || "-"}</td>
//                                         <td className="p-3 border-b">{r.address || "-"}</td>
//                                         <td className="p-3 border-b">{r.state_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.city_name || "-"}</td>
//                                         <td className="p-3 border-b">{r.industry || "-"}</td>
//                                         <td className="p-3 border-b">{r.businessType || "-"}</td>
//                                         <td className="p-3 border-b">{r.industry_category || "-"}</td>
//                                         <td className="p-3 border-b">{r.industry_subcategory || "-"}</td>
//                                         <td className="p-3 border-b">{r.created_at || "-"}</td>
//                                         <td className="p-3 border-b">{r.enter_by || "-"}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
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
        Accept: "application/json",
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
    const [textSearch, setTextSearch] = useState(""); // ✅ added

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

    const buildPayload = () => ({
        iBusinessType: businessTypeId || "",
        subcategory_id: subcategoryId || "",
        category_id: categoryId || "",
        industry_id: industryId || "",
        search: textSearch.trim(), // ✅ added in payload
    });

    // -------------------- Industry --------------------
    const fetchIndustries = async () => {
        try {
            setIsIndustryLoading(true);

            const res = await axios.post(
                `${apiUrl}/IndustryList`,
                {},
                { headers: authHeaders() }
            );

            if (res.data?.success) {
                setIndustries(Array.isArray(res.data?.data) ? res.data.data : []);
            } else {
                toast.error(res.data?.message || "Failed to fetch industries");
            }
        } catch (error) {
            console.error(error);
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
                setBusinessTypeOptions([]);
                toast.error(res.data?.message || "Failed to load business types");
            }
        } catch (error: any) {
            console.error(error);
            setBusinessTypeOptions([]);
            toast.error(error?.response?.data?.message || "Failed to load business types");
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
        } catch (error: any) {
            console.error(error);
            setCategoryOptions([]);
            toast.error(error?.response?.data?.message || "Failed to load categories");
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
        } catch (error: any) {
            console.error(error);
            setSubcategoryOptions([]);
            toast.error(error?.response?.data?.message || "Failed to load subcategories");
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
    }, [industryId]);

    // -------------------- Category Change --------------------
    useEffect(() => {
        setSubcategoryId("");
        setSubcategoryOptions([]);
        onAnyFilterChangeReset();

        if (categoryId) {
            fetchSubcategoriesByCategory(categoryId);
        }
    }, [categoryId]);

    // -------------------- Search --------------------
    const handleSearch = async () => {
        if (!industryId) {
            toast.error("Please select Industry");
            return;
        }

        try {
            setIsSearching(true);
            resetResults();

            const payload = buildPayload();

            const res = await axios.post(LIST_API, payload, {
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
        } catch (error: any) {
            console.error(error);
            resetResults();
            toast.error(error?.response?.data?.message || "Error fetching data");
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

            const payload = buildPayload();

            const res = await axios.post(EXPORT_API, payload, {
                responseType: "blob",
                headers: {
                    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
                },
            });

            const contentType = res.headers?.["content-type"] || "";

            if (
                contentType.includes("application/json") ||
                contentType.includes("text/json")
            ) {
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
            const link = document.createElement("a");
            link.href = url;

            const today = new Date().toISOString().slice(0, 10);
            link.download = `expected_exhibitor_report_${today}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Excel exported successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Error exporting excel");
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
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                    {/* Search Input */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Search</label>
                        <input
                            type="text"
                            value={textSearch}
                            onChange={(e) => {
                                setTextSearch(e.target.value);
                                onAnyFilterChangeReset();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                            placeholder="Search company / contact / mobile / email"
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

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
                                        <td className="p-3 border-b">{r.primary_contact_designation || "-"}</td>
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