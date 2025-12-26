import EditIcon from "@mui/icons-material/Edit";
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
type ApiPrimaryContact = {
    id: number;
    expo_id: number;
    primary_contact_mobile: string;
    primary_contact_name: string;
    primary_contact_designation?: string;
    primary_contact_email?: string;
};

type ApiOtherContact = {
    id: number;
    other_contact_mobile: string;
    other_contact_name: string;
    other_contact_designation?: string;
    other_contact_email?: string;
    iSDelete?: number;
};

type ApiExhibitorCompany = {
    id: number;
    exhibitor_primary_contact_id: number;
    expo_id: number;

    company_name: string;
    gst?: string;
    state_id?: number;
    city_id?: number;
    address?: string;

    industry_id?: number;
    category_id?: number;
    subcategory_id?: number;

    primary_contact?: ApiPrimaryContact | null;
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

/** UI row */
type ExhibitorRow = {
    id: number; // company info id
    expoId: number;

    companyName: string;
    contactPerson: string;

    stateId?: number;
    cityId?: number;
    industryId?: number;
    categoryId?: number;
    subcategoryId?: number;

    // computed display (from maps)
    stateName: string;
    cityName: string;
    industry: string;
    category: string;
    subcategory: string;

    raw: ApiExhibitorCompany;
};

export default function ExhibitorListDesign() {
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams<{ slug: string }>();

    // ✅ expo_id (from navigation state OR numeric slug)
    const expoId = useMemo(() => {
        const fromState = Number(
            location.state?.expo_id ?? location.state?.expoid ?? location.state?.expoId ?? 0
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

    function pickStateId(s: ApiState) {
        return String(s?.id ?? s?.stateId ?? s?.iStateId ?? "");
    }
    function pickStateName(s: ApiState) {
        return String(s?.name ?? s?.stateName ?? s?.statename ?? "");
    }

    /** ---------------- API: exhibitors list ---------------- */
    const fetchExhibitors = async () => {
        try {
            setLoading(true);

            // ✅ if your API requires expo_id, we send it. If not required, it will ignore.
            const body: any = {};
            if (expoId) body.expo_id = expoId;

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
        } catch (err) {
            // silent (optional)
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

    /** whenever rowsRaw changes, fetch needed cities/categories/subcategories */
    useEffect(() => {
        if (!rowsRaw.length) return;

        // cities: need by unique state ids
        const stateIds = Array.from(
            new Set(rowsRaw.map((r) => (r.state_id ? String(r.state_id) : "")).filter(Boolean))
        );
        stateIds.forEach((sid) => fetchCitiesForState(sid));

        // categories: need by unique industry ids
        const industryIds = Array.from(
            new Set(rowsRaw.map((r) => (r.industry_id ? String(r.industry_id) : "")).filter(Boolean))
        );
        industryIds.forEach((iid) => fetchCategoriesByIndustry(iid));

        // subcategories: need by unique category ids
        const categoryIds = Array.from(
            new Set(rowsRaw.map((r) => (r.category_id ? String(r.category_id) : "")).filter(Boolean))
        );
        categoryIds.forEach((cid) => fetchSubcategoriesByCategory(cid));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowsRaw]);

    /** build UI rows with mapped names (fallback to IDs if name missing) */
    const rows: ExhibitorRow[] = useMemo(() => {
        return rowsRaw.map((r) => {
            const stId = r.state_id ? String(r.state_id) : "";
            const ctId = r.city_id ? String(r.city_id) : "";
            const indId = r.industry_id ? String(r.industry_id) : "";
            const catId = r.category_id ? String(r.category_id) : "";
            const subId = r.subcategory_id ? String(r.subcategory_id) : "";

            const primaryName =
                r?.primary_contact?.primary_contact_name ||
                // fallback if backend changes key names
                (r as any)?.primary_contact?.name ||
                "";

            return {
                id: r.id,
                expoId: r.expo_id,

                companyName: r.company_name || "-",
                contactPerson: primaryName || "-",

                stateId: r.state_id,
                cityId: r.city_id,
                industryId: r.industry_id,
                categoryId: r.category_id,
                subcategoryId: r.subcategory_id,

                stateName: stId ? stateMap[stId] || `#${stId}` : "-",
                cityName: ctId ? cityMap[ctId] || `#${ctId}` : "-",
                industry: indId ? industryMap[indId] || `#${indId}` : "-",
                category: catId ? categoryMap[catId] || `#${catId}` : "-",
                subcategory: subId ? subcategoryMap[subId] || `#${subId}` : "-",

                raw: r,
            };
        });
    }, [rowsRaw, stateMap, cityMap, industryMap, categoryMap, subcategoryMap]);

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
                    <p className="text-sm text-gray-500">
                        {expoId ? `Expo ID: ${expoId}` : "All Expo"}{" "}
                        {loading ? "• Loading..." : `• ${filtered.length} records`}
                    </p>
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
                                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                                        title="Edit"
                                        onClick={() => {
                                            // ✅ navigate to your edit route
                                            // pass full raw record so edit page can prefill
                                            navigate(`/users/exhibitor/edit/${r.id}`, {
                                            });
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
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
                    Showing{" "}
                    <span className="font-medium text-gray-700">{filtered.length}</span> records
                </div>


            </div>
        </div>
    );
}
