import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config";

function isValidEmail(email: string) {
    if (!email) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(m: string) {
    return /^\d{10}$/.test(m);
}

function newId() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/** ---------- types ---------- */
type ContactRow = {
    id: string; // UI id
    db_id?: number | null; // ✅ database id (from search API)
    mobile: string;
    name: string;
    designation: string;
    email: string;
};

type OptionItem = { id: string; name: string };

function authHeaders() {
    const token = localStorage.getItem("usertoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
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

export default function AddExhivitor() {
    const { slug } = useParams<{ slug: string }>();
    const [expo_name, setExpo_Name] = useState<string>("");
    const userId = String(localStorage.getItem("User_Id") || "");

 
    /** ✅ for update existing record */
    const [primaryContactDbId, setPrimaryContactDbId] = useState<number | null>(null);
    const [companyDbId, setCompanyDbId] = useState<number | null>(null);

    /** ✅ Exhibitor (Mandatory - First) */
    const [exhibitorMobile, setExhibitorMobile] = useState("");
    const [exhibitorName, setExhibitorName] = useState("");
    const [exhibitorDesignation, setExhibitorDesignation] = useState("");
    const [exhibitorEmail, setExhibitorEmail] = useState("");

    /** company info (Second) */
    const [companyName, setCompanyName] = useState("");
    const [gst, setGst] = useState("");
    const [address, setAddress] = useState("");
    const [storeSize, setStoreSize] = useState(""); // UI only (not in store payload)

    const [stateId, setStateId] = useState("");
    const [cityId, setCityId] = useState("");

    const [industryId, setIndustryId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");

    // ✅ Dropdown options from API
    const [industryOptions, setIndustryOptions] = useState<OptionItem[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);
    const [states, setStates] = useState<ApiState[]>([]);
    const [cities, setCities] = useState<ApiCity[]>([]);

    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingIndustry, setLoadingIndustry] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingSubcategory, setLoadingSubcategory] = useState(false);

    /** extra contacts (optional - Third) */
    const [contacts, setContacts] = useState<ContactRow[]>([
        { id: newId(), db_id: null, mobile: "", name: "", designation: "", email: "" },
    ]);

    const [saving, setSaving] = useState(false);

    // ✅ refs to control auto-fill dependencies
    const lastSearchedMobileRef = useRef<string>("");
    const suppressAutoSearchRef = useRef<boolean>(false);

    const pendingCityIdRef = useRef<string>("");
    const pendingCategoryIdRef = useRef<string>("");
    const pendingSubcategoryIdRef = useRef<string>("");

    const addContactCard = () => {
        setContacts((prev) => [
            ...prev,
            { id: newId(), db_id: null, mobile: "", name: "", designation: "", email: "" },
        ]);
    };

    const removeContactCard = (id: string) => {
        setContacts((prev) => prev.filter((x) => x.id !== id));
    };

    const updateContact = (id: string, patch: Partial<ContactRow>) => {
        setContacts((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    };

    function pickStateId(s: ApiState) {
        return String(s?.id ?? s?.stateId ?? s?.iStateId ?? "");
    }
    function pickStateName(s: ApiState) {
        return String(s?.name ?? s?.stateName ?? s?.statename ?? "");
    }

    /** ---------------- API CALLS ---------------- */
    const fetchStates = async () => {
        try {
            setLoadingStates(true);

            let page = 1;
            let lastPage = 1;
            const allStates: ApiState[] = [];

            while (page <= lastPage) {
                const res = await axios.post(`${apiUrl}/statelist`, { page: String(page), expo_slugname: slug });

                if (res.data?.success) {
                    setExpo_Name(res?.data?.expo_name)
                    const { data, last_page } = res.data;
                    allStates.push(...((data || []) as ApiState[]));
                    lastPage = last_page ?? page;
                    page++;
                } else {
                    toast.error(res.data?.message || "Failed to load states");
                    break;
                }
            }

            const clean = allStates.filter((s) => pickStateId(s) && pickStateName(s));
            setStates(clean);
        } catch (error) {
            console.error("Error fetching states:", error);
            toast.error("Error while fetching states");
            setStates([]);
        } finally {
            setLoadingStates(false);
        }
    };

    /** -------------------- CITY BY STATE API -------------------- */
    const fetchCitiesByState = async (sid: string) => {
        try {
            setLoadingCities(true);
            setCities([]);

            const res = await axios.post(`${apiUrl}/CityByState`, {
                stateid: String(sid),
            });

            if (res.data?.success) {
                const list = (res.data?.data || []) as ApiCity[];
                setCities(list);

                // ✅ apply pending city after cities loaded
                const pending = pendingCityIdRef.current;
                if (pending && list.some((c) => String(c.id) === String(pending))) {
                    setCityId(String(pending));
                }
                pendingCityIdRef.current = "";
            } else {
                toast.error(res.data?.message || "Failed to load cities");
                setCities([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            toast.error("Error while fetching cities");
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    // 1) Industry list
    const fetchIndustries = async () => {
        try {
            setLoadingIndustry(true);

            const res = await axios.post(`${apiUrl}/IndustryList`, {}, { headers: { ...authHeaders() } });

            const rows = res.data?.data || res.data?.result || res.data?.industries || [];
            const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
                .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
                .filter((x) => x.id && x.name);

            setIndustryOptions(list);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to load industries");
            setIndustryOptions([]);
        } finally {
            setLoadingIndustry(false);
        }
    };

    // 2) Category by Industry
    const fetchCategoriesByIndustry = async (indId: string) => {
        try {
            setLoadingCategory(true);
            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-industry`,
                { industry_id: indId },
                { headers: { ...authHeaders() } }
            );

            const rows = res.data?.data || res.data?.result || [];
            const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
                .map((r: any) => ({
                    id: pickId(r),
                    name: pickName(r) || String(r?.industry_category_name || ""),
                }))
                .filter((x) => x.id && x.name);

            setCategoryOptions(list);

            // ✅ apply pending category after categories loaded
            const pending = pendingCategoryIdRef.current;
            if (pending && list.some((x) => x.id === String(pending))) {
                setCategoryId(String(pending));
            }
            pendingCategoryIdRef.current = "";
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to load categories");
            setCategoryOptions([]);
        } finally {
            setLoadingCategory(false);
        }
    };

    // 3) Subcategory by Category
    const fetchSubcategoriesByCategory = async (catId: string) => {
        try {
            setLoadingSubcategory(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-category`,
                { industry_category_id: catId },
                { headers: { ...authHeaders() } }
            );

            const rows = res.data?.data || res.data?.result || [];
            const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
                .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
                .filter((x) => x.id && x.name);

            setSubcategoryOptions(list);

            // ✅ apply pending subcategory after subcategories loaded
            const pending = pendingSubcategoryIdRef.current;
            if (pending && list.some((x) => x.id === String(pending))) {
                setSubcategoryId(String(pending));
            }
            pendingSubcategoryIdRef.current = "";
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to load subcategories");
            setSubcategoryOptions([]);
        } finally {
            setLoadingSubcategory(false);
        }
    };

    /** ✅ SEARCH BY MOBILE (AUTO FILL) */
    const fillFromSearchResponse = (data: any) => {
        const primary = data?.primary_and_company?.primary_contact;
        const company = data?.primary_and_company?.company;

        // prevent auto-search loop if we set mobile from response
        suppressAutoSearchRef.current = true;

        // ✅ store DB ids for update
        setPrimaryContactDbId(primary?.id ? Number(primary.id) : null);
        setCompanyDbId(company?.id ? Number(company.id) : null);

        if (primary) {
            setExhibitorName(String(primary.name || ""));
            if (primary.mobile) setExhibitorMobile(String(primary.mobile || ""));
            setExhibitorEmail(String(primary.email || ""));
            setExhibitorDesignation(String(primary.designation || ""));
        }

        if (company) {
            setCompanyName(String(company.company_name || ""));
            setGst(String(company.gst || ""));
            setAddress(String(company.address || ""));


            const st = String(company.state_id || "");
            const ct = String(company.city_id || "");

            if (st) {
                pendingCityIdRef.current = ct;
                setStateId(st); // triggers city fetch
            } else {
                setStateId("");
                setCityId("");
            }

            const ind = String(company.industry_id || "");
            const cat = String(company.category_id || "");
            const sub = String(company.subcategory_id || "");

            pendingCategoryIdRef.current = cat;
            pendingSubcategoryIdRef.current = sub;

            setIndustryId(ind || ""); // triggers category fetch
        }

        const others = Array.isArray(data?.other_contacts) ? data.other_contacts : [];
        if (others.length) {
            setContacts(
                others.map((x: any) => ({
                    id: newId(), // UI id
                    db_id: x?.id ? Number(x.id) : null, // ✅ db id
                    mobile: String(x.mobile || ""),
                    name: String(x.name || ""),
                    designation: String(x.designation || ""),
                    email: String(x.email || ""),
                }))
            );
        } else {
            setContacts([{ id: newId(), db_id: null, mobile: "", name: "", designation: "", email: "" }]);
        }
    };

    const searchExhibitorByMobile = async (mobile: string) => {
        try {
            if (!/^\d{10}$/.test(mobile)) return;

            if (lastSearchedMobileRef.current === mobile) return;
            lastSearchedMobileRef.current = mobile;

            const res = await axios.post(
                `${apiUrl}/exhibitors/search-by-mobile`,
                { mobile },
                { headers: { ...authHeaders() } }
            );

            if (res.data?.success) {
                fillFromSearchResponse(res.data);
                toast.success("Exhibitor found. Details filled.");
            } else {
                // if backend returns success=false for not found:
                // toast.info("No exhibitor found for this mobile.");
            }
        } catch (e: any) {
            lastSearchedMobileRef.current = ""; // allow retry
            // optional: toast.error(e?.response?.data?.message || "Search failed");
        } finally {
            // allow next user typing to search again
            setTimeout(() => {
                suppressAutoSearchRef.current = false;
            }, 0);
        }
    };

    // ✅ Load states + industries on mount
    useEffect(() => {
        fetchStates();
        fetchIndustries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ When stateId changes => reset city + fetch cities
    useEffect(() => {
        setCityId("");
        setCities([]);

        if (stateId) fetchCitiesByState(stateId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateId]);

    // ✅ When industry changes → reset category/subcategory and load categories
    useEffect(() => {
        setCategoryId("");
        setSubcategoryId("");
        setCategoryOptions([]);
        setSubcategoryOptions([]);

        if (industryId) fetchCategoriesByIndustry(industryId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [industryId]);

    // ✅ When category changes → reset subcategory and load subcategories
    useEffect(() => {
        setSubcategoryId("");
        setSubcategoryOptions([]);

        if (categoryId) fetchSubcategoriesByCategory(categoryId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    // ✅ Auto search when 10 digit mobile typed (debounced)
    useEffect(() => {
        if (suppressAutoSearchRef.current) return;
        if (!/^\d{10}$/.test(exhibitorMobile)) return;

        const t = setTimeout(() => {
            searchExhibitorByMobile(exhibitorMobile);
        }, 400);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exhibitorMobile]);

    /** ---------- validation ---------- */
    const validateBeforeSave = () => {
        if (!userId) return toast.error("User not logged in (User_Id missing)"), false;

        if (!isValidMobile(exhibitorMobile))
            return toast.error("Exhibitor Mobile must be 10 digits"), false;
        if (!exhibitorName.trim()) return toast.error("Exhibitor Name is required"), false;
        if (!isValidEmail(exhibitorEmail)) return toast.error("Exhibitor Email is invalid"), false;

        if (!companyName.trim()) return toast.error("Company Name is required"), false;

        if (!industryId) return toast.error("Industry is required"), false;
        if (!categoryId) return toast.error("Category is required"), false;
        if (!subcategoryId) return toast.error("Subcategory is required"), false;

        const nonEmptyCards = contacts.filter((c) => {
            const any = c.mobile.trim() || c.name.trim() || c.designation.trim() || c.email.trim();
            return Boolean(any);
        });

        for (let i = 0; i < nonEmptyCards.length; i++) {
            const c = nonEmptyCards[i];
            const label = `Extra Contact #${i + 1}`;
            if (!isValidMobile(c.mobile)) return toast.error(`${label}: Mobile must be 10 digits`), false;
            if (!c.name.trim()) return toast.error(`${label}: Name is required`), false;
            if (!isValidEmail(c.email)) return toast.error(`${label}: Email is invalid`), false;
        }

        return true;
    };

    /** ---------- save (STORE API) ---------- */
    const handleSave = async () => {
        if (!validateBeforeSave()) return;

        try {
            setSaving(true);

            // ✅ other contacts (send id for update if exists)
            const otherContacts = contacts
                .filter((c) => c.mobile.trim() || c.name.trim() || c.designation.trim() || c.email.trim())
                .map((c) => {
                    const obj: any = {
                        other_contact_name: c.name.trim(),
                        other_contact_mobile: c.mobile.trim(),
                        other_contact_designation: c.designation.trim(),
                        other_contact_email: c.email.trim(),
                    };

                    if (c.db_id) obj.id = c.db_id; // ✅ important for update
                    return obj;
                });

            // ✅ payload: send company_id + primary_contact_id to update existing company
            const payload: any = {
                expo_slug: slug,

                ...(companyDbId ? { company_id: companyDbId } : {}),
                ...(primaryContactDbId ? { primary_contact_id: primaryContactDbId } : {}),

                primary_contact_name: exhibitorName.trim(),
                primary_contact_mobile: exhibitorMobile.trim(),
                primary_contact_email: exhibitorEmail.trim(),
                primary_contact_designation: exhibitorDesignation.trim(),

                company_name: companyName.trim(),
                industry_id: industryId ? Number(industryId) : null,
                category_id: categoryId ? Number(categoryId) : null,
                subcategory_id: subcategoryId ? Number(subcategoryId) : null,

                gst: gst.trim(),
                state_id: stateId ? Number(stateId) : null,
                city_id: cityId ? Number(cityId) : null,
                address: address.trim(),

                other_contacts: otherContacts,
            };

            const endpoint = `${apiUrl}/exhibitors/store`;
            const res = await axios.post(endpoint, payload, {
                headers: { ...authHeaders() },
            });

            if (res.data?.success) {
                toast.success(res.data?.message || "Exhibitor saved successfully");

                // reset form
                setExhibitorMobile("");
                setExhibitorName("");
                setExhibitorDesignation("");
                setExhibitorEmail("");

                setCompanyName("");
                setGst("");
                setAddress("");
                setStoreSize("");

                setStateId("");
                setCityId("");
                setIndustryId("");
                setCategoryId("");
                setSubcategoryId("");

                setContacts([{ id: newId(), db_id: null, mobile: "", name: "", designation: "", email: "" }]);

                // ✅ reset update ids
                setPrimaryContactDbId(null);
                setCompanyDbId(null);

                lastSearchedMobileRef.current = "";
            } else {
                toast.error(res.data?.message || "Save failed");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">{expo_name}</h1>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Today Exhibitors</span>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
                        {0}
                    </span>
                </div>
            </div>

            {/* 1) Exhibitor */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Exhibitor</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Exhibitor Mobile <span className="text-red-600">*</span>
                        </label>
                        <input
                            value={exhibitorMobile}
                            maxLength={10}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (/^\d*$/.test(v)) {
                                    lastSearchedMobileRef.current = "";

                                    // ✅ if user changes mobile manually, treat as NEW record
                                    setPrimaryContactDbId(null);
                                    setCompanyDbId(null);

                                    setExhibitorMobile(v);
                                }
                            }}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="10 digit mobile"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Exhibitor Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            value={exhibitorName}
                            onChange={(e) => setExhibitorName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="Enter exhibitor name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Designation</label>
                        <input
                            value={exhibitorDesignation}
                            onChange={(e) => setExhibitorDesignation(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="Enter designation"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            value={exhibitorEmail}
                            onChange={(e) => setExhibitorEmail(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="Email"
                        />
                    </div>
                </div>
            </div>

            {/* 2) Company Information */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Company Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Company Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="Enter company name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">GST</label>
                        <input
                            value={gst}
                            onChange={(e) => setGst(e.target.value.toUpperCase())}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="Enter GST"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Store Size (Sq. Meter)</label>
                        <input
                            value={storeSize}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (/^\d*\.?\d{0,2}$/.test(v)) setStoreSize(v);
                            }}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="e.g. 10 or 10.5"
                        />
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <select
                            value={stateId}
                            onChange={(e) => setStateId(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={loadingStates}
                        >
                            <option value="">{loadingStates ? "Loading..." : "Select State"}</option>
                            {states.map((st) => (
                                <option key={pickStateId(st)} value={pickStateId(st)}>
                                    {pickStateName(st)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <select
                            value={cityId}
                            onChange={(e) => setCityId(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={!stateId || loadingCities}
                        >
                            <option value="">
                                {!stateId ? "Select State first" : loadingCities ? "Loading..." : "Select City"}
                            </option>
                            {cities.map((c) => (
                                <option key={c.id} value={String(c.id)}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 resize-none"
                            placeholder="Enter address"
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Industry <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={industryId}
                            onChange={(e) => setIndustryId(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={loadingIndustry}
                        >
                            <option value="">{loadingIndustry ? "Loading..." : "Select Industry"}</option>
                            {industryOptions.map((x) => (
                                <option key={x.id} value={x.id}>
                                    {x.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={!industryId || loadingCategory}
                        >
                            <option value="">
                                {!industryId
                                    ? "Select Industry first"
                                    : loadingCategory
                                        ? "Loading..."
                                        : "Select Category"}
                            </option>
                            {categoryOptions.map((x) => (
                                <option key={x.id} value={x.id}>
                                    {x.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Subcategory <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={!categoryId || loadingSubcategory}
                        >
                            <option value="">
                                {!categoryId
                                    ? "Select Category first"
                                    : loadingSubcategory
                                        ? "Loading..."
                                        : "Select Subcategory"}
                            </option>
                            {subcategoryOptions.map((x) => (
                                <option key={x.id} value={x.id}>
                                    {x.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 3) Exhibitor Contacts */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Exhibitor Contacts</h2>

                    <button
                        type="button"
                        onClick={addContactCard}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow inline-flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span>
                        Add Contact
                    </button>
                </div>

                <div className="space-y-4">
                    {contacts.map((c, index) => (
                        <div key={c.id} className="border rounded-xl p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-semibold text-gray-700">Contact {index + 1}</div>

                                {contacts.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeContactCard(c.id)}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mobile</label>
                                    <input
                                        value={c.mobile}
                                        maxLength={10}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (/^\d*$/.test(v)) updateContact(c.id, { mobile: v });
                                        }}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                        placeholder="10 digit mobile"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        value={c.name}
                                        onChange={(e) => updateContact(c.id, { name: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Designation</label>
                                    <input
                                        value={c.designation}
                                        onChange={(e) => updateContact(c.id, { designation: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                        placeholder="Enter designation"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        value={c.email}
                                        onChange={(e) => updateContact(c.id, { email: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-2">
                                Note: Optional. If you fill anything here, Mobile (10 digits) and Name will be required.
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-5 text-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#2e56a6] disabled:opacity-60 text-white px-8 py-2 rounded-lg shadow inline-flex items-center gap-2"
                    >
                        {saving && (
                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        )}
                        Save Exhibitor
                    </button>
                </div>
            </div>
        </div>
    );
}
