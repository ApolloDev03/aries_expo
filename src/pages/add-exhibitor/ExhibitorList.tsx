// import EditIcon from "@mui/icons-material/Edit";
// import axios from "axios";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// /** ---------------- helpers ---------------- */
// function authHeaders() {
//     const token = localStorage.getItem("usertoken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
// }

// function getApiErrorMessage(err: any, fallback = "Something went wrong") {
//     const data = err?.response?.data;
//     if (!data) return fallback;
//     if (typeof data === "string") return data;
//     if (data.message) return data.message;
//     if (data.error) return data.error;
//     if (data.errors && typeof data.errors === "object") {
//         const msgs: string[] = [];
//         Object.values(data.errors).forEach((v: any) => {
//             if (Array.isArray(v)) msgs.push(...v.map(String));
//             else if (typeof v === "string") msgs.push(v);
//         });
//         if (msgs.length) return msgs.join(" | ");
//     }
//     return fallback;
// }

// /** Robust mapper (handles different API key names) */
// function pickId(row: any) {
//     return String(
//         row?.id ??
//         row?.industryid ??
//         row?.industry_id ??
//         row?.iIndustryId ??
//         row?.industryCategoryId ??
//         row?.industry_category_id ??
//         row?.subcategoryid ??
//         row?.sub_category_id ??
//         ""
//     );
// }
// function pickName(row: any) {
//     return String(
//         row?.name ??
//         row?.industryname ??
//         row?.industryName ??
//         row?.industry_category_name ??
//         row?.industryCategoryName ??
//         row?.category_name ??
//         row?.subcategory_name ??
//         row?.industry_subcategory_name ??
//         row?.sub_category_name ??
//         ""
//     );
// }

// /** ---------------- types ---------------- */
// type ApiOtherContact = {
//     id: number;
//     other_contact_mobile: string;
//     other_contact_name: string;
//     other_contact_designation?: string;
//     other_contact_email?: string;
//     iSDelete?: number;
// };

// type ApiExpoDetail = {
//     id: number;
//     exhibitor_company_information_id: number;
//     expo_id: number;
//     industry_id?: number;
//     category_id?: number;
//     subcategory_id?: number;
//     store_size_sq_meter?: number;
// };

// type ApiExhibitorCompany = {
//     id: number;
//     expo_id?: number;

//     company_name: string;
//     gst?: string;
//     state_id?: number;
//     city_id?: number;
//     address?: string;

//     // ✅ root ids (may exist)
//     industry_id?: number;
//     category_id?: number;
//     subcategory_id?: number;

//     // ✅ root contact fields (as per your response)
//     primary_contact_mobile?: string;
//     primary_contact_name?: string;
//     primary_contact_designation?: string | null;
//     primary_contact_email?: string | null;

//     expo_details?: ApiExpoDetail[];
//     other_contacts?: ApiOtherContact[];
// };

// type ApiState = {
//     id?: number;
//     stateId?: number;
//     iStateId?: number;
//     name?: string;
//     stateName?: string;
//     statename?: string;
// };

// type ApiCity = {
//     id: number;
//     name: string;
//     stateid: number;
// };

// type OptionItem = { id: string; name: string };

// /** Normalized row (what UI uses internally) */
// type NormalizedCompany = {
//     id: number;
//     expoId: number;

//     companyName: string;
//     contactPerson: string;

//     stateId?: number;
//     cityId?: number;

//     industryId?: number;
//     categoryId?: number;
//     subcategoryId?: number;

//     raw: ApiExhibitorCompany;
// };

// /** UI row with mapped display names */
// type ExhibitorRow = NormalizedCompany & {
//     stateName: string;
//     cityName: string;
//     industry: string;
//     category: string;
//     subcategory: string;
// };

// export default function ExhibitorListDesign() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { slug } = useParams<{ slug: string }>();
//     const userId = useMemo(() => {
//         const v = localStorage.getItem("User_Id");
//         const n = Number(v || 0);
//         return Number.isFinite(n) && n > 0 ? n : 0;
//     }, []);

//     // ✅ expo_id (from navigation state OR numeric slug)
//     const expoId = useMemo(() => {
//         const fromState = Number(
//             location.state?.expo_id ??
//             location.state?.expoid ??
//             location.state?.expoId ??
//             0
//         );
//         if (fromState) return fromState;

//         const n = Number(slug ?? 0);
//         return Number.isFinite(n) && n > 0 ? n : 0;
//     }, [location.state, slug]);

//     /** list state */
//     const [rowsRaw, setRowsRaw] = useState<ApiExhibitorCompany[]>([]);
//     const [loading, setLoading] = useState(false);

//     /** search */
//     const [search, setSearch] = useState("");

//     /** lookup maps */
//     const [stateMap, setStateMap] = useState<Record<string, string>>({});
//     const [cityMap, setCityMap] = useState<Record<string, string>>({});
//     const [industryMap, setIndustryMap] = useState<Record<string, string>>({});
//     const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
//     const [subcategoryMap, setSubcategoryMap] = useState<Record<string, string>>({});

//     // prevent repeated fetch (caches)
//     const fetchedCityStatesRef = useRef<Set<string>>(new Set());
//     const fetchedIndustryCatsRef = useRef<Set<string>>(new Set());
//     const fetchedCatSubsRef = useRef<Set<string>>(new Set());

//     function pickStateId(s: ApiState) {
//         return String(s?.id ?? s?.stateId ?? s?.iStateId ?? "");
//     }
//     function pickStateName(s: ApiState) {
//         return String(s?.name ?? s?.stateName ?? s?.statename ?? "");
//     }

//     /** ✅ IMPORTANT: normalize ids from expo_details OR root */
//     const normalizeCompany = (r: ApiExhibitorCompany, currentExpoId: number): NormalizedCompany => {
//         // find expo_details entry matching this expoId (if provided)
//         const matchedExpoDetail =
//             (currentExpoId
//                 ? (r.expo_details || []).find((x) => Number(x.expo_id) === Number(currentExpoId))
//                 : undefined) || (r.expo_details || [])[0];

//         const industryId =
//             matchedExpoDetail?.industry_id ?? r.industry_id ?? undefined;
//         const categoryId =
//             matchedExpoDetail?.category_id ?? r.category_id ?? undefined;
//         const subcategoryId =
//             matchedExpoDetail?.subcategory_id ?? r.subcategory_id ?? undefined;

//         const contactPerson =
//             r.primary_contact_name ||
//             (r as any)?.primary_contact?.primary_contact_name ||
//             (r as any)?.primary_contact?.name ||
//             "-";

//         return {
//             id: r.id,
//             expoId: currentExpoId || matchedExpoDetail?.expo_id || r.expo_id || 0,
//             companyName: r.company_name || "-",
//             contactPerson: contactPerson || "-",
//             stateId: r.state_id,
//             cityId: r.city_id,
//             industryId,
//             categoryId,
//             subcategoryId,
//             raw: r,
//         };
//     };

//     /** ---------------- API: exhibitors list ---------------- */
//     const fetchExhibitors = async () => {
//         try {
//             setLoading(true);

//             const body: any = {};
//             // API says expo_id and industry_id optional
//             body.expo_id = expoId ? String(expoId) : "";
//             body.industry_id = ""; // you can keep filter here if needed
//             body.user_id= String(userId);

//             const res = await axios.post(`${apiUrl}/exhibitors`, body, {
//                 headers: { ...authHeaders() },
//             });

//             if (!res.data?.success) {
//                 toast.error(res.data?.message || "Failed to load exhibitors");
//                 setRowsRaw([]);
//                 return;
//             }

//             const list = (res.data?.data || []) as ApiExhibitorCompany[];
//             setRowsRaw(Array.isArray(list) ? list : []);
//         } catch (err: any) {
//             toast.error(getApiErrorMessage(err, "Failed to load exhibitors"));
//             setRowsRaw([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /** ---------------- API: states (pagination) ---------------- */
//     const fetchAllStates = async () => {
//         try {
//             let page = 1;
//             let lastPage = 1;
//             const allStates: ApiState[] = [];

//             while (page <= lastPage) {
//                 const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
//                 if (res.data?.success) {
//                     const { data, last_page } = res.data;
//                     allStates.push(...((data || []) as ApiState[]));
//                     lastPage = last_page ?? page;
//                     page++;
//                 } else {
//                     break;
//                 }
//             }

//             const map: Record<string, string> = {};
//             allStates.forEach((s) => {
//                 const id = pickStateId(s);
//                 const name = pickStateName(s);
//                 if (id && name) map[id] = name;
//             });

//             setStateMap(map);
//         } catch {
//             // ignore
//         }
//     };

//     /** ---------------- API: cities per state ---------------- */
//     const fetchCitiesForState = async (stateId: string) => {
//         if (!stateId) return;
//         if (fetchedCityStatesRef.current.has(stateId)) return;
//         fetchedCityStatesRef.current.add(stateId);

//         try {
//             const res = await axios.post(`${apiUrl}/CityByState`, { stateid: stateId });
//             if (!res.data?.success) return;

//             const list = (res.data?.data || []) as ApiCity[];
//             if (!Array.isArray(list)) return;

//             setCityMap((prev) => {
//                 const next = { ...prev };
//                 list.forEach((c) => {
//                     if (c?.id && c?.name) next[String(c.id)] = String(c.name);
//                 });
//                 return next;
//             });
//         } catch {
//             // ignore
//         }
//     };

//     /** ---------------- API: industries ---------------- */
//     const fetchIndustries = async () => {
//         try {
//             const res = await axios.post(`${apiUrl}/IndustryList`, {}, { headers: { ...authHeaders() } });

//             const rows = res.data?.data || res.data?.result || res.data?.industries || [];
//             const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//                 .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
//                 .filter((x) => x.id && x.name);

//             const map: Record<string, string> = {};
//             list.forEach((x) => (map[String(x.id)] = String(x.name)));
//             setIndustryMap(map);
//         } catch {
//             // ignore
//         }
//     };

//     /** ---------------- API: categories by industry ---------------- */
//     const fetchCategoriesByIndustry = async (industryId: string) => {
//         if (!industryId) return;
//         if (fetchedIndustryCatsRef.current.has(industryId)) return;
//         fetchedIndustryCatsRef.current.add(industryId);

//         try {
//             const res = await axios.post(
//                 `${apiUrl}/industry-subcategories/get-by-industry`,
//                 { industry_id: industryId },
//                 { headers: { ...authHeaders() } }
//             );

//             const rows = res.data?.data || res.data?.result || [];
//             const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//                 .map((r: any) => ({
//                     id: pickId(r),
//                     name: pickName(r) || String(r?.industry_category_name || ""),
//                 }))
//                 .filter((x) => x.id && x.name);

//             setCategoryMap((prev) => {
//                 const next = { ...prev };
//                 list.forEach((x) => (next[String(x.id)] = String(x.name)));
//                 return next;
//             });
//         } catch {
//             // ignore
//         }
//     };

//     /** ---------------- API: subcategories by category ---------------- */
//     const fetchSubcategoriesByCategory = async (categoryId: string) => {
//         if (!categoryId) return;
//         if (fetchedCatSubsRef.current.has(categoryId)) return;
//         fetchedCatSubsRef.current.add(categoryId);

//         try {
//             const res = await axios.post(
//                 `${apiUrl}/industry-subcategories/get-by-category`,
//                 { industry_category_id: categoryId },
//                 { headers: { ...authHeaders() } }
//             );

//             const rows = res.data?.data || res.data?.result || [];
//             const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//                 .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
//                 .filter((x) => x.id && x.name);

//             setSubcategoryMap((prev) => {
//                 const next = { ...prev };
//                 list.forEach((x) => (next[String(x.id)] = String(x.name)));
//                 return next;
//             });
//         } catch {
//             // ignore
//         }
//     };

//     /** initial load */
//     useEffect(() => {
//         fetchExhibitors();
//         fetchAllStates();
//         fetchIndustries();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [expoId]);

//     /** ✅ whenever rowsRaw changes, fetch lookup data using NORMALIZED ids */
//     const normalizedRows: NormalizedCompany[] = useMemo(() => {
//         return rowsRaw.map((r) => normalizeCompany(r, expoId));
//     }, [rowsRaw, expoId]);

//     useEffect(() => {
//         if (!normalizedRows.length) return;

//         // cities by state ids
//         const stateIds = Array.from(
//             new Set(normalizedRows.map((r) => (r.stateId ? String(r.stateId) : "")).filter(Boolean))
//         );
//         stateIds.forEach((sid) => fetchCitiesForState(sid));

//         // categories by industry ids
//         const industryIds = Array.from(
//             new Set(normalizedRows.map((r) => (r.industryId ? String(r.industryId) : "")).filter(Boolean))
//         );
//         industryIds.forEach((iid) => fetchCategoriesByIndustry(iid));

//         // subcategories by category ids
//         const categoryIds = Array.from(
//             new Set(normalizedRows.map((r) => (r.categoryId ? String(r.categoryId) : "")).filter(Boolean))
//         );
//         categoryIds.forEach((cid) => fetchSubcategoriesByCategory(cid));

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [normalizedRows]);

//     /** build UI rows with mapped names */
//     const rows: ExhibitorRow[] = useMemo(() => {
//         return normalizedRows.map((r) => {
//             const stId = r.stateId ? String(r.stateId) : "";
//             const ctId = r.cityId ? String(r.cityId) : "";
//             const indId = r.industryId ? String(r.industryId) : "";
//             const catId = r.categoryId ? String(r.categoryId) : "";
//             const subId = r.subcategoryId ? String(r.subcategoryId) : "";

//             return {
//                 ...r,
//                 stateName: stId ? stateMap[stId] || `#${stId}` : "-",
//                 cityName: ctId ? cityMap[ctId] || `#${ctId}` : "-",
//                 industry: indId ? industryMap[indId] || `#${indId}` : "-",
//                 category: catId ? categoryMap[catId] || `#${catId}` : "-",
//                 subcategory: subId ? subcategoryMap[subId] || `#${subId}` : "-",
//             };
//         });
//     }, [normalizedRows, stateMap, cityMap, industryMap, categoryMap, subcategoryMap]);

//     /** search filter */
//     const filtered = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         if (!q) return rows;

//         return rows.filter((r) => {
//             return (
//                 String(r.companyName).toLowerCase().includes(q) ||
//                 String(r.contactPerson).toLowerCase().includes(q) ||
//                 String(r.stateName).toLowerCase().includes(q) ||
//                 String(r.cityName).toLowerCase().includes(q) ||
//                 String(r.industry).toLowerCase().includes(q) ||
//                 String(r.category).toLowerCase().includes(q) ||
//                 String(r.subcategory).toLowerCase().includes(q) ||
//                 String(r.id).includes(q)
//             );
//         });
//     }, [rows, search]);

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
//                 <div>
//                     <h1 className="text-2xl font-semibold">Exhibitor List</h1>

//                 </div>

//                 {/* Search */}
//                 <div className="w-full md:w-80">
//                     <input
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//                         placeholder="Search company / city / industry..."
//                     />
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto border rounded-lg bg-white">
//                 <table className="w-full border-collapse text-md">
//                     <thead>
//                         <tr className="bg-gray-100 text-left">
//                             <th className="p-2 border w-16 text-center">Sr. No.</th>
//                             <th className="p-2 border min-w-[220px]">Company Name</th>
//                             <th className="p-2 border min-w-[170px]">Contact Person</th>
//                             <th className="p-2 border min-w-[130px]">City</th>
//                             <th className="p-2 border min-w-[130px]">State</th>
//                             <th className="p-2 border min-w-[130px]">Industry</th>
//                             <th className="p-2 border min-w-[130px]">Category</th>
//                             <th className="p-2 border min-w-[140px]">Subcategory</th>
//                             <th className="p-2 border w-28 text-center">Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filtered.map((r, index) => (
//                             <tr key={r.id} className="hover:bg-gray-50">
//                                 <td className="p-2 border text-center font-medium">{index + 1}</td>
//                                 <td className="p-2 border">{r.companyName}</td>
//                                 <td className="p-2 border">{r.contactPerson}</td>
//                                 <td className="p-2 border">{r.cityName}</td>
//                                 <td className="p-2 border">{r.stateName}</td>
//                                 <td className="p-2 border">{r.industry}</td>
//                                 <td className="p-2 border">{r.category}</td>
//                                 <td className="p-2 border">{r.subcategory}</td>

//                                 <td className="p-2 border text-center">
//                                     <button
//                                         className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
//                                         title="Edit"
//                                         onClick={() => {
//                                             navigate(`/users/exhibitor/edit/${r.id}`, {
//                                                 state: {
//                                                     expo_id: expoId,
//                                                     exhibitor: r.raw, // ✅ pass full record to edit page
//                                                 },
//                                             });
//                                         }}
//                                     >
//                                         <EditIcon fontSize="small" />
//                                     </button>
//                                     <button
//                                         className="text-red-600 hover:text-red-800"
//                                         title="Delete"
//                                         onClick={() => {
//                                             setDeleteId(v.id);
//                                             setDeleteError("");
//                                             setDeleteOpen(true);
//                                         }}
//                                     >
//                                         <DeleteRoundedIcon fontSize="small" />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}

//                         {!loading && filtered.length === 0 && (
//                             <tr>
//                                 <td colSpan={9} className="p-6 text-center text-gray-600">
//                                     No exhibitors found
//                                 </td>
//                             </tr>
//                         )}

//                         {loading && (
//                             <tr>
//                                 <td colSpan={9} className="p-6 text-center text-gray-600">
//                                     Loading exhibitors...
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Footer info */}
//             <div className="mt-3 text-sm text-gray-500 flex items-center justify-between">
//                 <div>
//                     Showing <span className="font-medium text-gray-700">{filtered.length}</span> records
//                 </div>
//             </div>
//         </div>
//     );
// }


import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config";

/** ---------------- helpers ---------------- */
function authHeaders() {
    const token = localStorage.getItem("usertoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function getApiErrorMessage(err: any, fallback = "Something went wrong") {
    const data = err?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && typeof data.errors === "object") {
        const msgs: string[] = [];
        Object.values(data.errors).forEach((v: any) => {
            if (Array.isArray(v)) msgs.push(...v.map(String));
            else if (typeof v === "string") msgs.push(v);
        });
        if (msgs.length) return msgs.join(" | ");
    }
    return fallback;
}

/** Robust mapper (handles different API key names) */
function pickId(row: any) {
    return String(
        row?.id ??
        row?.industryid ??
        row?.industry_id ??
        row?.iIndustryId ??
        row?.industryCategoryId ??
        row?.industry_category_id ??
        row?.subcategoryid ??
        row?.sub_category_id ??
        ""
    );
}
function pickName(row: any) {
    return String(
        row?.name ??
        row?.industryname ??
        row?.industryName ??
        row?.industry_category_name ??
        row?.industryCategoryName ??
        row?.category_name ??
        row?.subcategory_name ??
        row?.industry_subcategory_name ??
        row?.sub_category_name ??
        ""
    );
}

/** ---------------- types ---------------- */
type ApiOtherContact = {
    id: number;
    other_contact_mobile: string;
    other_contact_name: string;
    other_contact_designation?: string;
    other_contact_email?: string;
    iSDelete?: number;
};

type ApiExpoDetail = {
    id: number;
    exhibitor_company_information_id: number;
    expo_id: number;
    industry_id?: number;
    category_id?: number;
    subcategory_id?: number;
    store_size_sq_meter?: number;
};

type ApiExhibitorCompany = {
    id: number;
    expo_id?: number;

    company_name: string;
    gst?: string;
    state_id?: number;
    city_id?: number;
    address?: string;

    industry_id?: number;
    category_id?: number;
    subcategory_id?: number;

    primary_contact_mobile?: string;
    primary_contact_name?: string;
    primary_contact_designation?: string | null;
    primary_contact_email?: string | null;

    expo_details?: ApiExpoDetail[];
    other_contacts?: ApiOtherContact[];
};

type ApiState = {
    id?: number;
    stateId?: number;
    iStateId?: number;
    name?: string;
    stateName?: string;
    statename?: string;
};

type ApiCity = {
    id: number;
    name: string;
    stateid: number;
};

type OptionItem = { id: string; name: string };

/** Normalized row (what UI uses internally) */
type NormalizedCompany = {
    id: number;
    expoId: number;

    companyName: string;
    contactPerson: string;

    stateId?: number;
    cityId?: number;

    industryId?: number;
    categoryId?: number;
    subcategoryId?: number;

    raw: ApiExhibitorCompany;
};

/** UI row with mapped display names */
type ExhibitorRow = NormalizedCompany & {
    stateName: string;
    cityName: string;
    industry: string;
    category: string;
    subcategory: string;
};

export default function ExhibitorListDesign() {
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams<{ slug: string }>();

    const userId = useMemo(() => {
        const v = localStorage.getItem("User_Id");
        const n = Number(v || 0);
        return Number.isFinite(n) && n > 0 ? n : 0;
    }, []);

    // ✅ expo_id (from navigation state OR numeric slug)
    const expoId = useMemo(() => {
        const fromState = Number(
            (location.state as any)?.expo_id ??
            (location.state as any)?.expoid ??
            (location.state as any)?.expoId ??
            0
        );
        if (fromState) return fromState;

        const n = Number(slug ?? 0);
        return Number.isFinite(n) && n > 0 ? n : 0;
    }, [location.state, slug]);

    /** list state */
    const [rowsRaw, setRowsRaw] = useState<ApiExhibitorCompany[]>([]);
    const [loading, setLoading] = useState(false);

    /** search */
    const [search, setSearch] = useState("");

    /** lookup maps */
    const [stateMap, setStateMap] = useState<Record<string, string>>({});
    const [cityMap, setCityMap] = useState<Record<string, string>>({});
    const [industryMap, setIndustryMap] = useState<Record<string, string>>({});
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [subcategoryMap, setSubcategoryMap] = useState<Record<string, string>>({});

    // prevent repeated fetch (caches)
    const fetchedCityStatesRef = useRef<Set<string>>(new Set());
    const fetchedIndustryCatsRef = useRef<Set<string>>(new Set());
    const fetchedCatSubsRef = useRef<Set<string>>(new Set());

    /** ---------------- DELETE POPUP STATE ---------------- */
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const closeDelete = () => {
        if (deleteLoading) return;
        setDeleteOpen(false);
        setDeleteId(null);
        setDeleteError("");
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleteLoading(true);
            setDeleteError("");

            const res = await axios.post(
                `${apiUrl}/exhibitors/delete`,
                { id: deleteId, user_id: userId },
                { headers: { ...authHeaders() } }
            );

            if (!res.data?.success) {
                const msg = res.data?.message || "Failed to delete exhibitor";
                setDeleteError(msg);
                toast.error(msg);
                return;
            }

            toast.success(res.data?.message || "Exhibitor deleted successfully");

            // ✅ remove from list instantly
            setRowsRaw((prev) => prev.filter((x) => Number(x.id) !== Number(deleteId)));

            closeDelete();
        } catch (err: any) {
            const msg = getApiErrorMessage(err, "Failed to delete exhibitor");
            setDeleteError(msg);
            toast.error(msg);
        } finally {
            setDeleteLoading(false);
        }
    };

    function pickStateId(s: ApiState) {
        return String(s?.id ?? s?.stateId ?? s?.iStateId ?? "");
    }
    function pickStateName(s: ApiState) {
        return String(s?.name ?? s?.stateName ?? s?.statename ?? "");
    }

    /** ✅ IMPORTANT: normalize ids from expo_details OR root */
    const normalizeCompany = (r: ApiExhibitorCompany, currentExpoId: number): NormalizedCompany => {
        const matchedExpoDetail =
            (currentExpoId
                ? (r.expo_details || []).find((x) => Number(x.expo_id) === Number(currentExpoId))
                : undefined) || (r.expo_details || [])[0];

        const industryId = matchedExpoDetail?.industry_id ?? r.industry_id ?? undefined;
        const categoryId = matchedExpoDetail?.category_id ?? r.category_id ?? undefined;
        const subcategoryId = matchedExpoDetail?.subcategory_id ?? r.subcategory_id ?? undefined;

        const contactPerson =
            r.primary_contact_name ||
            (r as any)?.primary_contact?.primary_contact_name ||
            (r as any)?.primary_contact?.name ||
            "-";

        return {
            id: r.id,
            expoId: currentExpoId || matchedExpoDetail?.expo_id || r.expo_id || 0,
            companyName: r.company_name || "-",
            contactPerson: contactPerson || "-",
            stateId: r.state_id,
            cityId: r.city_id,
            industryId,
            categoryId,
            subcategoryId,
            raw: r,
        };
    };

    /** ---------------- API: exhibitors list ---------------- */
    const fetchExhibitors = async () => {
        try {
            setLoading(true);

            const body: any = {};
            body.expo_id = expoId ? String(expoId) : "";
            body.industry_id = "";
            body.user_id = String(userId);

            const res = await axios.post(`${apiUrl}/exhibitors`, body, {
                headers: { ...authHeaders() },
            });

            if (!res.data?.success) {
                toast.error(res.data?.message || "Failed to load exhibitors");
                setRowsRaw([]);
                return;
            }

            const list = (res.data?.data || []) as ApiExhibitorCompany[];
            setRowsRaw(Array.isArray(list) ? list : []);
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to load exhibitors"));
            setRowsRaw([]);
        } finally {
            setLoading(false);
        }
    };

    /** ---------------- API: states (pagination) ---------------- */
    const fetchAllStates = async () => {
        try {
            let page = 1;
            let lastPage = 1;
            const allStates: ApiState[] = [];

            while (page <= lastPage) {
                const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
                if (res.data?.success) {
                    const { data, last_page } = res.data;
                    allStates.push(...((data || []) as ApiState[]));
                    lastPage = last_page ?? page;
                    page++;
                } else {
                    break;
                }
            }

            const map: Record<string, string> = {};
            allStates.forEach((s) => {
                const id = pickStateId(s);
                const name = pickStateName(s);
                if (id && name) map[id] = name;
            });

            setStateMap(map);
        } catch {
            // ignore
        }
    };

    /** ---------------- API: cities per state ---------------- */
    const fetchCitiesForState = async (stateId: string) => {
        if (!stateId) return;
        if (fetchedCityStatesRef.current.has(stateId)) return;
        fetchedCityStatesRef.current.add(stateId);

        try {
            const res = await axios.post(`${apiUrl}/CityByState`, { stateid: stateId });
            if (!res.data?.success) return;

            const list = (res.data?.data || []) as ApiCity[];
            if (!Array.isArray(list)) return;

            setCityMap((prev) => {
                const next = { ...prev };
                list.forEach((c) => {
                    if (c?.id && c?.name) next[String(c.id)] = String(c.name);
                });
                return next;
            });
        } catch {
            // ignore
        }
    };

    /** ---------------- API: industries ---------------- */
    const fetchIndustries = async () => {
        try {
            const res = await axios.post(`${apiUrl}/IndustryList`, {}, { headers: { ...authHeaders() } });

            const rows = res.data?.data || res.data?.result || res.data?.industries || [];
            const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
                .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
                .filter((x) => x.id && x.name);

            const map: Record<string, string> = {};
            list.forEach((x) => (map[String(x.id)] = String(x.name)));
            setIndustryMap(map);
        } catch {
            // ignore
        }
    };

    /** ---------------- API: categories by industry ---------------- */
    const fetchCategoriesByIndustry = async (industryId: string) => {
        if (!industryId) return;
        if (fetchedIndustryCatsRef.current.has(industryId)) return;
        fetchedIndustryCatsRef.current.add(industryId);

        try {
            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-industry`,
                { industry_id: industryId },
                { headers: { ...authHeaders() } }
            );

            const rows = res.data?.data || res.data?.result || [];
            const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
                .map((r: any) => ({
                    id: pickId(r),
                    name: pickName(r) || String(r?.industry_category_name || ""),
                }))
                .filter((x) => x.id && x.name);

            setCategoryMap((prev) => {
                const next = { ...prev };
                list.forEach((x) => (next[String(x.id)] = String(x.name)));
                return next;
            });
        } catch {
            // ignore
        }
    };

    /** ---------------- API: subcategories by category ---------------- */
    const fetchSubcategoriesByCategory = async (categoryId: string) => {
        if (!categoryId) return;
        if (fetchedCatSubsRef.current.has(categoryId)) return;
        fetchedCatSubsRef.current.add(categoryId);

        try {
            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-category`,
                { industry_category_id: categoryId },
                { headers: { ...authHeaders() } }
            );

            const rows = res.data?.data || res.data?.result || [];
            const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
                .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
                .filter((x) => x.id && x.name);

            setSubcategoryMap((prev) => {
                const next = { ...prev };
                list.forEach((x) => (next[String(x.id)] = String(x.name)));
                return next;
            });
        } catch {
            // ignore
        }
    };

    /** initial load */
    useEffect(() => {
        fetchExhibitors();
        fetchAllStates();
        fetchIndustries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expoId]);

    /** ✅ whenever rowsRaw changes, fetch lookup data using NORMALIZED ids */
    const normalizedRows: NormalizedCompany[] = useMemo(() => {
        return rowsRaw.map((r) => normalizeCompany(r, expoId));
    }, [rowsRaw, expoId]);

    useEffect(() => {
        if (!normalizedRows.length) return;

        const stateIds = Array.from(
            new Set(normalizedRows.map((r) => (r.stateId ? String(r.stateId) : "")).filter(Boolean))
        );
        stateIds.forEach((sid) => fetchCitiesForState(sid));

        const industryIds = Array.from(
            new Set(normalizedRows.map((r) => (r.industryId ? String(r.industryId) : "")).filter(Boolean))
        );
        industryIds.forEach((iid) => fetchCategoriesByIndustry(iid));

        const categoryIds = Array.from(
            new Set(normalizedRows.map((r) => (r.categoryId ? String(r.categoryId) : "")).filter(Boolean))
        );
        categoryIds.forEach((cid) => fetchSubcategoriesByCategory(cid));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedRows]);

    /** build UI rows with mapped names */
    const rows: ExhibitorRow[] = useMemo(() => {
        return normalizedRows.map((r) => {
            const stId = r.stateId ? String(r.stateId) : "";
            const ctId = r.cityId ? String(r.cityId) : "";
            const indId = r.industryId ? String(r.industryId) : "";
            const catId = r.categoryId ? String(r.categoryId) : "";
            const subId = r.subcategoryId ? String(r.subcategoryId) : "";

            return {
                ...r,
                stateName: stId ? stateMap[stId] || `#${stId}` : "-",
                cityName: ctId ? cityMap[ctId] || `#${ctId}` : "-",
                industry: indId ? industryMap[indId] || `#${indId}` : "-",
                category: catId ? categoryMap[catId] || `#${catId}` : "-",
                subcategory: subId ? subcategoryMap[subId] || `#${subId}` : "-",
            };
        });
    }, [normalizedRows, stateMap, cityMap, industryMap, categoryMap, subcategoryMap]);

    /** search filter */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;

        return rows.filter((r) => {
            return (
                String(r.companyName).toLowerCase().includes(q) ||
                String(r.contactPerson).toLowerCase().includes(q) ||
                String(r.stateName).toLowerCase().includes(q) ||
                String(r.cityName).toLowerCase().includes(q) ||
                String(r.industry).toLowerCase().includes(q) ||
                String(r.category).toLowerCase().includes(q) ||
                String(r.subcategory).toLowerCase().includes(q) ||
                String(r.id).includes(q)
            );
        });
    }, [rows, search]);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Exhibitor List</h1>
                </div>

                {/* Search */}
                <div className="w-full md:w-80">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                        placeholder="Search company / city / industry..."
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="w-full border-collapse text-md">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border w-16 text-center">Sr. No.</th>
                            <th className="p-2 border min-w-[220px]">Company Name</th>
                            <th className="p-2 border min-w-[170px]">Contact Person</th>
                            <th className="p-2 border min-w-[130px]">City</th>
                            <th className="p-2 border min-w-[130px]">State</th>
                            <th className="p-2 border min-w-[130px]">Industry</th>
                            <th className="p-2 border min-w-[130px]">Category</th>
                            <th className="p-2 border min-w-[140px]">Subcategory</th>
                            <th className="p-2 border w-28 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((r, index) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="p-2 border text-center font-medium">{index + 1}</td>
                                <td className="p-2 border">{r.companyName}</td>
                                <td className="p-2 border">{r.contactPerson}</td>
                                <td className="p-2 border">{r.cityName}</td>
                                <td className="p-2 border">{r.stateName}</td>
                                <td className="p-2 border">{r.industry}</td>
                                <td className="p-2 border">{r.category}</td>
                                <td className="p-2 border">{r.subcategory}</td>

                                <td className="p-2 border text-center">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mr-2"
                                        title="Edit"
                                        onClick={() => {
                                            navigate(`/users/exhibitor/edit/${r.id}`, {
                                                state: {
                                                    expo_id: expoId,
                                                    exhibitor: r.raw, // ✅ pass full record to edit page
                                                },
                                            });
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </button>

                                    <button
                                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                                        title="Delete"
                                        onClick={() => {
                                            setDeleteId(r.id); // ✅ fixed
                                            setDeleteError("");
                                            setDeleteOpen(true);
                                        }}
                                    >
                                        <DeleteRoundedIcon fontSize="small" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan={9} className="p-6 text-center text-gray-600">
                                    No exhibitors found
                                </td>
                            </tr>
                        )}

                        {loading && (
                            <tr>
                                <td colSpan={9} className="p-6 text-center text-gray-600">
                                    Loading exhibitors...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer info */}
            <div className="mt-3 text-sm text-gray-500 flex items-center justify-between">
                <div>
                    Showing <span className="font-medium text-gray-700">{filtered.length}</span> records
                </div>
            </div>

            {/* ---------------- Delete Confirm Popup ---------------- */}
            {deleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeDelete}
                    />
                    {/* modal */}
                    <div className="relative z-10 w-[95%] max-w-md rounded-xl bg-white shadow-lg border">
                        <div className="px-5 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Are you sure you want to delete this exhibitor?
                            </p>
                        </div>

                        <div className="px-5 py-4">
                            {deleteError ? (
                                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {deleteError}
                                </div>
                            ) : (
                              ""
                            )}

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={closeDelete}
                                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                                >
                                    {deleteLoading ? "Deleting..." : "Confirm Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
