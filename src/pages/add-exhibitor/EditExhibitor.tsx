// // ExhibitorEdit.tsx
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// /** ---------- helpers ---------- */
// function isValidEmail(email: string) {
//   if (!email) return true; // optional
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }
// function isValidMobile(m: string) {
//   return /^\d{10}$/.test(m);
// }
// function newId() {
//   return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
// }
// function authHeaders() {
//   const token = localStorage.getItem("usertoken");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }
// function getApiErrorMessage(err: any, fallback = "Something went wrong") {
//   const d = err?.response?.data;
//   if (!d) return fallback;
//   if (typeof d === "string") return d;
//   if (d.message) return d.message;

//   if (d.errors && typeof d.errors === "object") {
//     const msgs: string[] = [];
//     Object.values(d.errors).forEach((v: any) => {
//       if (Array.isArray(v)) msgs.push(...v.map(String));
//       else if (typeof v === "string") msgs.push(v);
//     });
//     if (msgs.length) return msgs.join(" | ");
//   }
//   return fallback;
// }

// /** Robust mapper (handles different API key names) */
// function pickId(row: any) {
//   return String(
//     row?.id ??
//     row?.industryid ??
//     row?.industry_id ??
//     row?.iIndustryId ??
//     row?.industryCategoryId ??
//     row?.industry_category_id ??
//     row?.subcategoryid ??
//     row?.sub_category_id ??
//     ""
//   );
// }
// function pickName(row: any) {
//   return String(
//     row?.name ??
//     row?.industryname ??
//     row?.industryName ??
//     row?.industry_category_name ??
//     row?.industryCategoryName ??
//     row?.category_name ??
//     row?.subcategory_name ??
//     row?.industry_subcategory_name ??
//     row?.sub_category_name ??
//     ""
//   );
// }

// /** ---------- types ---------- */
// type ContactRow = {
//   id: string; // UI id
//   other_contact_id?: number; // API id (optional)
//   mobile: string;
//   name: string;
//   designation: string;
//   email: string;
// };

// type OptionItem = { id: string; name: string };

// type ApiState = {
//   id?: number;
//   stateId?: number;
//   iStateId?: number;
//   name?: string;
//   stateName?: string;
//   statename?: string;
// };

// type ApiCity = {
//   id: number;
//   name: string;
//   stateid: number;
// };

// function pickStateId(s: ApiState) {
//   return String(s?.id ?? s?.stateId ?? s?.iStateId ?? "");
// }
// function pickStateName(s: ApiState) {
//   return String(s?.name ?? s?.stateName ?? s?.statename ?? "");
// }

// export default function ExhibitorEdit() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id: routeId } = useParams<{ id: string }>();
//   const [expo_name, setExpo_Name] = useState<string>("");
//   const expoIdFromState = Number(
//     location.state?.expo_id ?? location.state?.expoid ?? location.state?.expoId ?? 0
//   );

//   /** ✅ primary contact */
//   const [exhibitorMobile, setExhibitorMobile] = useState("");
//   const [exhibitorName, setExhibitorName] = useState("");
//   const [exhibitorDesignation, setExhibitorDesignation] = useState("");
//   const [exhibitorEmail, setExhibitorEmail] = useState("");

//   /** ✅ company */
//   const [companyName, setCompanyName] = useState("");
//   const [gst, setGst] = useState("");
//   const [address, setAddress] = useState("");
//   const [storeSize, setStoreSize] = useState(""); // UI only

//   /** ✅ ids (API needs IDs) */
//   const [expoId, setExpoId] = useState<number>(expoIdFromState || 0);
//   const [companyInfoId, setCompanyInfoId] = useState<number>(Number(routeId || 0));

//   const [stateId, setStateId] = useState("");
//   const [cityId, setCityId] = useState("");

//   const [industryId, setIndustryId] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [subcategoryId, setSubcategoryId] = useState("");

//   /** ✅ dropdown options */
//   const [states, setStates] = useState<ApiState[]>([]);
//   const [cities, setCities] = useState<ApiCity[]>([]);
//   const [industryOptions, setIndustryOptions] = useState<OptionItem[]>([]);
//   const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
//   const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);

//   const [loadingStates, setLoadingStates] = useState(false);
//   const [loadingCities, setLoadingCities] = useState(false);
//   const [loadingIndustry, setLoadingIndustry] = useState(false);
//   const [loadingCategory, setLoadingCategory] = useState(false);
//   const [loadingSubcategory, setLoadingSubcategory] = useState(false);

//   /** ✅ other contacts */
//   const [contacts, setContacts] = useState<ContactRow[]>([
//     { id: newId(), mobile: "", name: "", designation: "", email: "" },
//   ]);

//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState("");

//   /** ✅ pending refs for dependent dropdowns (when filling from SHOW) */
//   const pendingCityIdRef = useRef<string>("");
//   const pendingCategoryIdRef = useRef<string>("");
//   const pendingSubcategoryIdRef = useRef<string>("");

//   /** -------------------- API: SHOW (fill all fields) -------------------- */
//   const fetchExhibitorShow = async (id: number) => {
//     try {

//       const res = await axios.post(
//         `${apiUrl}/exhibitors/show`,
//         { id },
//         { headers: { ...authHeaders() } }
//       );

//       if (!res.data?.success) {
//         toast.error(res.data?.message || "Failed to load exhibitor");
//         return;
//       }

//       const data = res.data?.data;
//       if (!data) return;
//       setExpo_Name(res?.data?.expo_name)
//       // ids
//       setCompanyInfoId(Number(data.id || id));
//       setExpoId(Number(data.expo_id || expoIdFromState || 0));

//       // primary contact
//       const pc = data.primary_contact || {};
//       setExhibitorMobile(String(pc.primary_contact_mobile || ""));
//       setExhibitorName(String(pc.primary_contact_name || ""));
//       setExhibitorDesignation(String(pc.primary_contact_designation || ""));
//       setExhibitorEmail(String(pc.primary_contact_email || ""));

//       // company
//       setCompanyName(String(data.company_name || ""));
//       setGst(String(data.gst || ""));
//       setAddress(String(data.address || ""));

//       // state/city
//       const st = String(data.state_id || "");
//       const ct = String(data.city_id || "");
//       if (st) {
//         pendingCityIdRef.current = ct;
//         setStateId(st); // triggers CityByState, then will apply pending city
//       } else {
//         setStateId("");
//         setCityId("");
//       }

//       // industry/category/subcategory
//       const ind = String(data.industry_id || "");
//       const cat = String(data.category_id || "");
//       const sub = String(data.subcategory_id || "");

//       pendingCategoryIdRef.current = cat;
//       pendingSubcategoryIdRef.current = sub;

//       setIndustryId(ind); // triggers category fetch, then applies pending category

//       // other contacts (only active iSDelete=0)
//       const others = Array.isArray(data.other_contacts) ? data.other_contacts : [];
//       const active = others.filter((x: any) => String(x?.iSDelete ?? "0") !== "1");

//       if (active.length) {
//         setContacts(
//           active.map((x: any) => ({
//             id: newId(),
//             other_contact_id: Number(x.id || 0) || undefined,
//             mobile: String(x.other_contact_mobile || ""),
//             name: String(x.other_contact_name || ""),
//             designation: String(x.other_contact_designation || ""),
//             email: String(x.other_contact_email || ""),
//           }))
//         );
//       } else {
//         setContacts([{ id: newId(), mobile: "", name: "", designation: "", email: "" }]);
//       }
//     } catch (err: any) {
//       toast.error(getApiErrorMessage(err, "Failed to load exhibitor"));
//     }
//   };

//   /** -------------------- API: STATES (paginated) -------------------- */
//   const fetchStates = async () => {
//     try {
//       setLoadingStates(true);

//       let page = 1;
//       let lastPage = 1;
//       const all: ApiState[] = [];

//       while (page <= lastPage) {
//         const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
//         if (res.data?.success) {
//           const { data, last_page } = res.data;
//           all.push(...((data || []) as ApiState[]));
//           lastPage = last_page ?? page;
//           page++;
//         } else {
//           break;
//         }
//       }

//       const clean = all.filter((s) => pickStateId(s) && pickStateName(s));
//       setStates(clean);
//     } catch (err) {
//       toast.error("Error while fetching states");
//       setStates([]);
//     } finally {
//       setLoadingStates(false);
//     }
//   };

//   /** -------------------- API: CITIES BY STATE -------------------- */
//   const fetchCitiesByState = async (sid: string) => {
//     try {
//       setLoadingCities(true);
//       setCities([]);

//       const res = await axios.post(`${apiUrl}/CityByState`, { stateid: String(sid) });
//       if (res.data?.success) {
//         const list = (res.data?.data || []) as ApiCity[];
//         setCities(list);

//         // ✅ apply pending city (from SHOW)
//         const pending = pendingCityIdRef.current;
//         if (pending && list.some((c) => String(c.id) === String(pending))) {
//           setCityId(String(pending));
//         }
//         pendingCityIdRef.current = "";
//       } else {
//         setCities([]);
//       }
//     } catch (err) {
//       toast.error("Error while fetching cities");
//       setCities([]);
//     } finally {
//       setLoadingCities(false);
//     }
//   };

//   /** -------------------- API: INDUSTRIES -------------------- */
//   const fetchIndustries = async () => {
//     try {
//       setLoadingIndustry(true);
//       const res = await axios.post(`${apiUrl}/IndustryList`, {}, { headers: { ...authHeaders() } });

//       const rows = res.data?.data || res.data?.result || res.data?.industries || [];
//       const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//         .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
//         .filter((x) => x.id && x.name);

//       setIndustryOptions(list);
//     } catch (err: any) {
//       toast.error(getApiErrorMessage(err, "Failed to load industries"));
//       setIndustryOptions([]);
//     } finally {
//       setLoadingIndustry(false);
//     }
//   };

//   /** -------------------- API: CATEGORIES BY INDUSTRY -------------------- */
//   const fetchCategoriesByIndustry = async (indId: string) => {
//     try {
//       setLoadingCategory(true);

//       const res = await axios.post(
//         `${apiUrl}/industry-subcategories/get-by-industry`,
//         { industry_id: indId },
//         { headers: { ...authHeaders() } }
//       );

//       const rows = res.data?.data || res.data?.result || [];
//       const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//         .map((r: any) => ({
//           id: pickId(r),
//           name: pickName(r) || String(r?.industry_category_name || ""),
//         }))
//         .filter((x) => x.id && x.name);

//       setCategoryOptions(list);

//       // ✅ apply pending category (from SHOW)
//       const pending = pendingCategoryIdRef.current;
//       if (pending && list.some((x) => String(x.id) === String(pending))) {
//         setCategoryId(String(pending));
//       }
//       pendingCategoryIdRef.current = "";
//     } catch (err: any) {
//       toast.error(getApiErrorMessage(err, "Failed to load categories"));
//       setCategoryOptions([]);
//     } finally {
//       setLoadingCategory(false);
//     }
//   };

//   /** -------------------- API: SUBCATEGORIES BY CATEGORY -------------------- */
//   const fetchSubcategoriesByCategory = async (catId: string) => {
//     try {
//       setLoadingSubcategory(true);

//       const res = await axios.post(
//         `${apiUrl}/industry-subcategories/get-by-category`,
//         { industry_category_id: catId },
//         { headers: { ...authHeaders() } }
//       );

//       const rows = res.data?.data || res.data?.result || [];
//       const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
//         .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
//         .filter((x) => x.id && x.name);

//       setSubcategoryOptions(list);

//       // ✅ apply pending subcategory (from SHOW)
//       const pending = pendingSubcategoryIdRef.current;
//       if (pending && list.some((x) => String(x.id) === String(pending))) {
//         setSubcategoryId(String(pending));
//       }
//       pendingSubcategoryIdRef.current = "";
//     } catch (err: any) {
//       toast.error(getApiErrorMessage(err, "Failed to load subcategories"));
//       setSubcategoryOptions([]);
//     } finally {
//       setLoadingSubcategory(false);
//     }
//   };

//   /** -------------------- initial load -------------------- */
//   useEffect(() => {
//     fetchStates();
//     fetchIndustries();

//     const idNum = Number(routeId || 0);
//     if (idNum) {
//       fetchExhibitorShow(idNum); // ✅ SHOW API call and fill data
//     } else {
//       toast.error("Exhibitor id missing in route");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /** when state changes -> fetch cities */
//   useEffect(() => {
//     setCityId("");
//     setCities([]);
//     if (stateId) fetchCitiesByState(stateId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [stateId]);

//   /** when industry changes -> fetch categories */
//   useEffect(() => {
//     setCategoryId("");
//     setSubcategoryId("");
//     setCategoryOptions([]);
//     setSubcategoryOptions([]);
//     if (industryId) fetchCategoriesByIndustry(industryId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [industryId]);

//   /** when category changes -> fetch subcategories */
//   useEffect(() => {
//     setSubcategoryId("");
//     setSubcategoryOptions([]);
//     if (categoryId) fetchSubcategoriesByCategory(categoryId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [categoryId]);

//   /** -------------------- contacts helpers -------------------- */
//   const addContactCard = () => {
//     setContacts((prev) => [...prev, { id: newId(), mobile: "", name: "", designation: "", email: "" }]);
//   };
//   const removeContactCard = (cid: string) => {
//     setContacts((prev) => prev.filter((x) => x.id !== cid));
//   };
//   const updateContact = (cid: string, patch: Partial<ContactRow>) => {
//     setContacts((prev) => prev.map((x) => (x.id === cid ? { ...x, ...patch } : x)));
//   };

//   /** -------------------- validation -------------------- */
//   const validate = () => {
//     setFormError("");

//     if (!companyInfoId) return setFormError("Company ID missing"), false;
//     if (!expoId) return setFormError("expo_id missing"), false;

//     if (!isValidMobile(exhibitorMobile)) return setFormError("Primary Mobile must be 10 digits"), false;
//     if (!exhibitorName.trim()) return setFormError("Primary Name is required"), false;
//     if (!isValidEmail(exhibitorEmail)) return setFormError("Primary Email is invalid"), false;

//     if (!companyName.trim()) return setFormError("Company Name is required"), false;

//     if (!industryId) return setFormError("Industry is required"), false;
//     if (!categoryId) return setFormError("Category is required"), false;
//     if (!subcategoryId) return setFormError("Subcategory is required"), false;

//     if (!stateId) return setFormError("State is required"), false;
//     if (!cityId) return setFormError("City is required"), false;

//     const nonEmpty = contacts.filter((c) => c.mobile.trim() || c.name.trim() || c.designation.trim() || c.email.trim());
//     for (let i = 0; i < nonEmpty.length; i++) {
//       const c = nonEmpty[i];
//       const label = `Contact #${i + 1}`;
//       if (!isValidMobile(c.mobile)) return setFormError(`${label}: Mobile must be 10 digits`), false;
//       if (!c.name.trim()) return setFormError(`${label}: Name is required`), false;
//       if (!isValidEmail(c.email)) return setFormError(`${label}: Email is invalid`), false;
//     }

//     return true;
//   };

//   /** -------------------- UPDATE (store with id) -------------------- */
//   const handleUpdate = async () => {
//     if (!validate()) return;

//     try {
//       setSaving(true);

//       const other_contacts = contacts
//         .filter((c) => c.mobile.trim() || c.name.trim() || c.designation.trim() || c.email.trim())
//         .map((c) => ({
//           // If backend supports updating by id, keep it (harmless if ignored)
//           ...(c.other_contact_id ? { id: c.other_contact_id } : {}),

//           other_contact_name: c.name.trim(),
//           other_contact_mobile: c.mobile.trim(),
//           other_contact_designation: c.designation.trim(),
//           other_contact_email: c.email.trim(),
//         }));

//       const payload: any = {
//         // ✅ IMPORTANT: id for update
//         id: Number(companyInfoId),

//         expo_id: Number(expoId),

//         primary_contact_name: exhibitorName.trim(),
//         primary_contact_mobile: exhibitorMobile.trim(),
//         primary_contact_email: exhibitorEmail.trim(),
//         primary_contact_designation: exhibitorDesignation.trim(),

//         company_name: companyName.trim(),
//         industry_id: Number(industryId),
//         category_id: Number(categoryId),
//         subcategory_id: Number(subcategoryId),

//         gst: gst.trim(),
//         state_id: Number(stateId),
//         city_id: Number(cityId),
//         address: address.trim(),

//         other_contacts,
//       };

//       const res = await axios.post(`${apiUrl}/exhibitors/store`, payload, {
//         headers: { ...authHeaders() },
//       });

//       if (res.data?.success) {
//         toast.success(res.data?.message || "Updated successfully");
//         navigate(-1);
//       } else {
//         toast.error(res.data?.message || "Update failed");
//       }
//     } catch (err: any) {
//       toast.error(getApiErrorMessage(err, "Update failed"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">{expo_name}</h1>

//         </div>

//         <div className="flex gap-2">


//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//             disabled={saving}
//           >
//             Back
//           </button>
//         </div>
//       </div>

//       {!!formError && (
//         <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">{formError}</div>
//       )}

//       {/* ✅ 1) Primary Contact */}
//       <div className="bg-white p-6 rounded-xl shadow-md border">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Primary Contact</h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Mobile <span className="text-red-600">*</span>
//             </label>
//             <input
//               value={exhibitorMobile}
//               maxLength={10}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 if (/^\d*$/.test(v)) setExhibitorMobile(v);
//               }}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="10 digit mobile"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Name <span className="text-red-600">*</span>
//             </label>
//             <input
//               value={exhibitorName}
//               onChange={(e) => setExhibitorName(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="Enter name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Designation</label>
//             <input
//               value={exhibitorDesignation}
//               onChange={(e) => setExhibitorDesignation(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="Enter designation"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input
//               value={exhibitorEmail}
//               onChange={(e) => setExhibitorEmail(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="Email"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ✅ 2) Company Information */}
//       <div className="bg-white p-6 rounded-xl shadow-md border">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Company Information</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Company Name <span className="text-red-600">*</span>
//             </label>
//             <input
//               value={companyName}
//               onChange={(e) => setCompanyName(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="Enter company name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">GST</label>
//             <input
//               value={gst}
//               onChange={(e) => setGst(e.target.value.toUpperCase())}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="Enter GST"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Store Size (Sq. Meter)</label>
//             <input
//               value={storeSize}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 if (/^\d*\.?\d{0,2}$/.test(v)) setStoreSize(v);
//               }}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               placeholder="e.g. 10 or 10.5"
//             />
//           </div>

//           {/* State */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               State <span className="text-red-600">*</span>
//             </label>
//             <select
//               value={stateId}
//               onChange={(e) => setStateId(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               disabled={loadingStates}
//             >
//               <option value="">{loadingStates ? "Loading..." : "Select State"}</option>
//               {states.map((st) => (
//                 <option key={pickStateId(st)} value={pickStateId(st)}>
//                   {pickStateName(st)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* City */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               City <span className="text-red-600">*</span>
//             </label>
//             <select
//               value={cityId}
//               onChange={(e) => setCityId(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               disabled={!stateId || loadingCities}
//             >
//               <option value="">
//                 {!stateId ? "Select State first" : loadingCities ? "Loading..." : "Select City"}
//               </option>
//               {cities.map((c) => (
//                 <option key={c.id} value={String(c.id)}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm font-medium mb-1">Address</label>
//             <textarea
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               rows={2}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 resize-none"
//               placeholder="Enter address"
//             />
//           </div>

//           {/* Industry */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Industry <span className="text-red-600">*</span>
//             </label>
//             <select
//               value={industryId}
//               onChange={(e) => setIndustryId(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               disabled={loadingIndustry}
//             >
//               <option value="">{loadingIndustry ? "Loading..." : "Select Industry"}</option>
//               {industryOptions.map((x) => (
//                 <option key={x.id} value={x.id}>
//                   {x.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Category <span className="text-red-600">*</span>
//             </label>
//             <select
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               disabled={!industryId || loadingCategory}
//             >
//               <option value="">
//                 {!industryId ? "Select Industry first" : loadingCategory ? "Loading..." : "Select Category"}
//               </option>
//               {categoryOptions.map((x) => (
//                 <option key={x.id} value={x.id}>
//                   {x.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subcategory */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Subcategory <span className="text-red-600">*</span>
//             </label>
//             <select
//               value={subcategoryId}
//               onChange={(e) => setSubcategoryId(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//               disabled={!categoryId || loadingSubcategory}
//             >
//               <option value="">
//                 {!categoryId ? "Select Category first" : loadingSubcategory ? "Loading..." : "Select Subcategory"}
//               </option>
//               {subcategoryOptions.map((x) => (
//                 <option key={x.id} value={x.id}>
//                   {x.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* ✅ 3) Other Contacts */}
//       <div className="bg-white p-6 rounded-xl shadow-md border">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-700">Other Contacts (Optional)</h2>

//           <button
//             type="button"
//             onClick={addContactCard}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow inline-flex items-center gap-2"
//           >
//             <span className="text-xl leading-none">+</span>
//             Add Contact
//           </button>
//         </div>

//         <div className="space-y-4">
//           {contacts.map((c, index) => (
//             <div key={c.id} className="border rounded-xl p-4 bg-gray-50">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="font-semibold text-gray-700">Contact {index + 1}</div>

//                 {contacts.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeContactCard(c.id)}
//                     className="text-red-600 hover:text-red-700 font-medium"
//                     disabled={saving}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Mobile</label>
//                   <input
//                     value={c.mobile}
//                     maxLength={10}
//                     onChange={(e) => {
//                       const v = e.target.value;
//                       if (/^\d*$/.test(v)) updateContact(c.id, { mobile: v });
//                     }}
//                     className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//                     placeholder="10 digit mobile"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Name</label>
//                   <input
//                     value={c.name}
//                     onChange={(e) => updateContact(c.id, { name: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//                     placeholder="Enter name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Designation</label>
//                   <input
//                     value={c.designation}
//                     onChange={(e) => updateContact(c.id, { designation: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//                     placeholder="Enter designation"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Email</label>
//                   <input
//                     value={c.email}
//                     onChange={(e) => updateContact(c.id, { email: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
//                     placeholder="Email"
//                   />
//                 </div>
//               </div>

//               <div className="text-xs text-gray-500 mt-2">
//                 Note: Optional. If you fill anything here, Mobile (10 digits) and Name will be required.
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Save */}
//         <div className="pt-5 text-end">
//           <button
//             onClick={handleUpdate}
//             disabled={saving}
//             className="bg-[#2e56a6] disabled:opacity-60 text-white px-8 py-2 rounded-lg shadow inline-flex items-center gap-2"
//           >
//             {saving && (
//               <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
//             )}
//             Update Exhibitor
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ExhibitorEdit.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config";

/** ---------- helpers ---------- */
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
function authHeaders() {
  const token = localStorage.getItem("usertoken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
function getApiErrorMessage(err: any, fallback = "Something went wrong") {
  const d = err?.response?.data;
  if (!d) return fallback;
  if (typeof d === "string") return d;
  if (d.message) return d.message;

  if (d.errors && typeof d.errors === "object") {
    const msgs: string[] = [];
    Object.values(d.errors).forEach((v: any) => {
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

/** ---------- types ---------- */
type ContactRow = {
  id: string; // UI id
  other_contact_id?: number; // API id (optional)
  mobile: string;
  name: string;
  designation: string;
  email: string;
};

type OptionItem = { id: string; name: string };

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

function pickStateId(s: ApiState) {
  return String(s?.id ?? s?.stateId ?? s?.iStateId ?? "");
}
function pickStateName(s: ApiState) {
  return String(s?.name ?? s?.stateName ?? s?.statename ?? "");
}

export default function ExhibitorEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams<{ id: string }>();

  // ✅ expo name (usually passed from list page state)
  const [expo_name, setExpo_Name] = useState<string>(
  );
  const [slug_name, setSlug_name] = useState<string>(
  );

  const expoIdFromState = Number(
    location.state?.expo_id ?? location.state?.expoid ?? location.state?.expoId ?? 0
  );

  /** ✅ primary contact */
  const [exhibitorMobile, setExhibitorMobile] = useState("");
  const [exhibitorName, setExhibitorName] = useState("");
  const [exhibitorDesignation, setExhibitorDesignation] = useState("");
  const [exhibitorEmail, setExhibitorEmail] = useState("");

  /** ✅ company */
  const [companyName, setCompanyName] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");
  const [storeSize, setStoreSize] = useState(""); // UI only

  /** ✅ ids */
  const [expoId, setExpoId] = useState<number>(expoIdFromState || 0);
  const [companyInfoId, setCompanyInfoId] = useState<number>(Number(routeId || 0));

  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");

  const [industryId, setIndustryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  /** ✅ dropdown options */
  const [states, setStates] = useState<ApiState[]>([]);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [industryOptions, setIndustryOptions] = useState<OptionItem[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<OptionItem[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingIndustry, setLoadingIndustry] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingSubcategory, setLoadingSubcategory] = useState(false);

  /** ✅ other contacts */
  const [contacts, setContacts] = useState<ContactRow[]>([
    { id: newId(), mobile: "", name: "", designation: "", email: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  /** ✅ pending refs for dependent dropdowns (SHOW -> select by id) */
  const pendingCityIdRef = useRef<string>("");
  const pendingCategoryIdRef = useRef<string>("");
  const pendingSubcategoryIdRef = useRef<string>("");

  /** -------------------- API: SHOW (fill all fields) -------------------- */
  const fetchExhibitorShow = async (id: number) => {
    try {
      const res = await axios.post(
        `${apiUrl}/exhibitors/show`,
        { id },
        { headers: { ...authHeaders() } }
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed to load exhibitor");
        return;
      }

      const data = res.data?.data;
      if (!data) return;

      // expo name (if backend ever sends)
      const ExpoName = res.data?.expo_name;
      if (ExpoName) setExpo_Name(String(ExpoName));
      const ExpoSlug = res.data?.expo_slug;
      if (ExpoSlug) setSlug_name(String(ExpoSlug));

      // ids
      setCompanyInfoId(Number(data.id || id));
      setExpoId(Number(data.expo_id || expoIdFromState || 0));

      // primary contact
      const pc = data.primary_contact || {};
      setExhibitorMobile(String(pc.primary_contact_mobile || ""));
      setExhibitorName(String(pc.primary_contact_name || ""));
      setExhibitorDesignation(String(pc.primary_contact_designation || ""));
      setExhibitorEmail(String(pc.primary_contact_email || ""));

      // company
      setCompanyName(String(data.company_name || ""));
      setGst(String(data.gst || ""));
      setStoreSize(String(data.store_size_sq_meter || ""))
      setAddress(String(data.address || ""));

      // ✅ STATE -> CITY (ID wise)
      const st = String(data.state_id || "");
      const ct = String(data.city_id || "");
      pendingCityIdRef.current = ct; // keep city id until city list loads
      setStateId(st); // triggers CityByState

      // ✅ INDUSTRY -> CATEGORY -> SUBCATEGORY (ID wise)
      const ind = String(data.industry_id || "");
      const cat = String(data.category_id || "");
      const sub = String(data.subcategory_id || "");
      pendingCategoryIdRef.current = cat;
      pendingSubcategoryIdRef.current = sub;
      setIndustryId(ind); // triggers categories API

      // other contacts (only active iSDelete=0)
      const others = Array.isArray(data.other_contacts) ? data.other_contacts : [];
      const active = others.filter((x: any) => String(x?.iSDelete ?? "0") !== "1");

      if (active.length) {
        setContacts(
          active.map((x: any) => ({
            id: newId(),
            other_contact_id: Number(x.id || 0) || undefined,
            mobile: String(x.other_contact_mobile || ""),
            name: String(x.other_contact_name || ""),
            designation: String(x.other_contact_designation || ""),
            email: String(x.other_contact_email || ""),
          }))
        );
      } else {
        setContacts([{ id: newId(), mobile: "", name: "", designation: "", email: "" }]);
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to load exhibitor"));
    }
  };

  /** -------------------- API: STATES (paginated) -------------------- */
  const fetchStates = async () => {
    try {
      setLoadingStates(true);

      let page = 1;
      let lastPage = 1;
      const all: ApiState[] = [];

      while (page <= lastPage) {
        const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
        if (res.data?.success) {
          const { data, last_page } = res.data;
          all.push(...((data || []) as ApiState[]));
          lastPage = last_page ?? page;
          page++;
        } else {
          break;
        }
      }

      const clean = all.filter((s) => pickStateId(s) && pickStateName(s));
      setStates(clean);
    } catch {
      toast.error("Error while fetching states");
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  /** -------------------- API: CITIES BY STATE -------------------- */
  const fetchCitiesByState = async (sid: string) => {
    try {
      setLoadingCities(true);
      setCities([]);

      const res = await axios.post(`${apiUrl}/CityByState`, { stateid: String(sid) });
      if (res.data?.success) {
        const list = (res.data?.data || []) as ApiCity[];
        setCities(list);

        // ✅ apply pending city id from SHOW
        const pending = pendingCityIdRef.current;
        if (pending && list.some((c) => String(c.id) === String(pending))) {
          setCityId(String(pending));
          pendingCityIdRef.current = "";
        }
      } else {
        setCities([]);
      }
    } catch {
      toast.error("Error while fetching cities");
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  /** -------------------- API: INDUSTRIES -------------------- */
  const fetchIndustries = async () => {
    try {
      setLoadingIndustry(true);
      const res = await axios.post(`${apiUrl}/IndustryList`, {}, { headers: { ...authHeaders() } });

      const rows = res.data?.data || res.data?.result || res.data?.industries || [];
      const list: OptionItem[] = (Array.isArray(rows) ? rows : [])
        .map((r: any) => ({ id: pickId(r), name: pickName(r) }))
        .filter((x) => x.id && x.name);

      setIndustryOptions(list);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to load industries"));
      setIndustryOptions([]);
    } finally {
      setLoadingIndustry(false);
    }
  };

  /** -------------------- API: CATEGORIES BY INDUSTRY -------------------- */
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

      // ✅ apply pending category id from SHOW
      const pending = pendingCategoryIdRef.current;
      if (pending && list.some((x) => String(x.id) === String(pending))) {
        setCategoryId(String(pending));
        pendingCategoryIdRef.current = "";
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to load categories"));
      setCategoryOptions([]);
    } finally {
      setLoadingCategory(false);
    }
  };

  /** -------------------- API: SUBCATEGORIES BY CATEGORY -------------------- */
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

      // ✅ apply pending subcategory id from SHOW
      const pending = pendingSubcategoryIdRef.current;
      if (pending && list.some((x) => String(x.id) === String(pending))) {
        setSubcategoryId(String(pending));
        pendingSubcategoryIdRef.current = "";
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Failed to load subcategories"));
      setSubcategoryOptions([]);
    } finally {
      setLoadingSubcategory(false);
    }
  };

  /** -------------------- initial load -------------------- */
  useEffect(() => {
    fetchStates();
    fetchIndustries();

    const idNum = Number(routeId || 0);
    if (idNum) fetchExhibitorShow(idNum);
    else toast.error("Exhibitor id missing in route");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ✅ when state changes -> fetch cities (NO RESET HERE) */
  useEffect(() => {
    if (stateId) fetchCitiesByState(stateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  /** ✅ when industry changes -> fetch categories (NO RESET HERE) */
  useEffect(() => {
    if (industryId) fetchCategoriesByIndustry(industryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industryId]);

  /** ✅ when category changes -> fetch subcategories (NO RESET HERE) */
  useEffect(() => {
    if (categoryId) fetchSubcategoriesByCategory(categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  /** -------------------- contacts helpers -------------------- */
  const addContactCard = () => {
    setContacts((prev) => [...prev, { id: newId(), mobile: "", name: "", designation: "", email: "" }]);
  };
  const removeContactCard = (cid: string) => {
    setContacts((prev) => prev.filter((x) => x.id !== cid));
  };
  const updateContact = (cid: string, patch: Partial<ContactRow>) => {
    setContacts((prev) => prev.map((x) => (x.id === cid ? { ...x, ...patch } : x)));
  };

  /** -------------------- validation -------------------- */
  const validate = () => {
    setFormError("");

    if (!companyInfoId) return setFormError("Company ID missing"), false;
    if (!expoId) return setFormError("expo_id missing"), false;

    if (!isValidMobile(exhibitorMobile)) return setFormError("Primary Mobile must be 10 digits"), false;
    if (!exhibitorName.trim()) return setFormError("Primary Name is required"), false;
    if (!isValidEmail(exhibitorEmail)) return setFormError("Primary Email is invalid"), false;

    if (!companyName.trim()) return setFormError("Company Name is required"), false;

    if (!industryId) return setFormError("Industry is required"), false;
    if (!categoryId) return setFormError("Category is required"), false;
    if (!subcategoryId) return setFormError("Subcategory is required"), false;

    if (!stateId) return setFormError("State is required"), false;
    if (!cityId) return setFormError("City is required"), false;

    const nonEmpty = contacts.filter((c) => c.mobile.trim() || c.name.trim() || c.designation.trim() || c.email.trim());
    for (let i = 0; i < nonEmpty.length; i++) {
      const c = nonEmpty[i];
      const label = `Contact #${i + 1}`;
      if (!isValidMobile(c.mobile)) return setFormError(`${label}: Mobile must be 10 digits`), false;
      if (!c.name.trim()) return setFormError(`${label}: Name is required`), false;
      if (!isValidEmail(c.email)) return setFormError(`${label}: Email is invalid`), false;
    }

    return true;
  };

  /** -------------------- UPDATE (store with id) -------------------- */
  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const other_contacts = contacts
        .filter((c) => c.mobile.trim() || c.name.trim() || c.designation.trim() || c.email.trim())
        .map((c) => ({
          ...(c.other_contact_id ? { id: c.other_contact_id } : {}),
          other_contact_name: c.name.trim(),
          other_contact_mobile: c.mobile.trim(),
          other_contact_designation: c.designation.trim(),
          other_contact_email: c.email.trim(),
        }));

      const payload: any = {
        id: Number(companyInfoId),
        expo_slug: slug_name,
        primary_contact_name: exhibitorName.trim(),
        primary_contact_mobile: exhibitorMobile.trim(),
        primary_contact_email: exhibitorEmail.trim(),
        primary_contact_designation: exhibitorDesignation.trim(),

        company_name: companyName.trim(),
        industry_id: Number(industryId),
        category_id: Number(categoryId),
        subcategory_id: Number(subcategoryId),
        store_size_sq_meter: storeSize,
        gst: gst.trim(),
        state_id: Number(stateId),
        city_id: Number(cityId),
        address: address.trim(),

        other_contacts,
      };

      const res = await axios.post(`${apiUrl}/exhibitors/store`, payload, {
        headers: { ...authHeaders() },
      });

      if (res.data?.success) {
        toast.success(res.data?.message || "Updated successfully");
        navigate(-1);
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err, "Update failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{expo_name}</h1>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            Back
          </button>
        </div>
      </div>

      {!!formError && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">{formError}</div>
      )}

      {/* ✅ 1) Primary Contact */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Primary Contact</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile <span className="text-red-600">*</span>
            </label>
            <input
              value={exhibitorMobile}
              maxLength={10}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) setExhibitorMobile(v);
              }}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="10 digit mobile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              value={exhibitorName}
              onChange={(e) => setExhibitorName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="Enter name"
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

      {/* ✅ 2) Company Information */}
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

          {/* ✅ State (ID wise selected from SHOW) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              State <span className="text-red-600">*</span>
            </label>
            <select
              value={stateId}
              onChange={(e) => {
                const v = e.target.value;

                // ✅ user changed state -> reset city only here
                pendingCityIdRef.current = "";
                setCityId("");
                setCities([]);
                setStateId(v);
              }}
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

          {/* ✅ City (ID wise selected from SHOW) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              City <span className="text-red-600">*</span>
            </label>
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

          {/* ✅ Industry (ID wise selected from SHOW) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Industry <span className="text-red-600">*</span>
            </label>
            <select
              value={industryId}
              onChange={(e) => {
                const v = e.target.value;

                // ✅ user changed industry -> reset dependent here
                pendingCategoryIdRef.current = "";
                pendingSubcategoryIdRef.current = "";
                setCategoryId("");
                setSubcategoryId("");
                setCategoryOptions([]);
                setSubcategoryOptions([]);
                setIndustryId(v);
              }}
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

          {/* ✅ Category (ID wise selected from SHOW) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                const v = e.target.value;

                // ✅ user changed category -> reset subcategory only here
                pendingSubcategoryIdRef.current = "";
                setSubcategoryId("");
                setSubcategoryOptions([]);
                setCategoryId(v);
              }}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              disabled={!industryId || loadingCategory}
            >
              <option value="">
                {!industryId ? "Select Industry first" : loadingCategory ? "Loading..." : "Select Category"}
              </option>
              {categoryOptions.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Subcategory (ID wise selected from SHOW) */}
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
                {!categoryId ? "Select Category first" : loadingSubcategory ? "Loading..." : "Select Subcategory"}
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

      {/* ✅ 3) Other Contacts */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Other Contacts (Optional)</h2>

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
                    disabled={saving}
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

        {/* Save */}
        <div className="pt-5 text-end">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-[#2e56a6] disabled:opacity-60 text-white px-8 py-2 rounded-lg shadow inline-flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            Update Exhibitor
          </button>
        </div>
      </div>
    </div>
  );
}
