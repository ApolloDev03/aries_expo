// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

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

// function formatDate(value?: string | null) {
//     if (!value) return "-";
//     const d = new Date(value);
//     return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
// }

// /* -------------------------------- Types -------------------------------- */

// type OtherContact = {
//     id?: number;
//     exhibitor_company_information_id?: number;
//     other_contact_mobile?: string | null;
//     other_contact_name?: string | null;
//     other_contact_designation?: string | null;
//     other_contact_email?: string | null;
// };

// type ListingItem = {
//     id: number;

//     company_name?: string;
//     companyname?: string;
//     company?: string;

//     gst?: string | null;
//     state_id?: number;
//     city_id?: number;
//     address?: string | null;
//     industry_id?: number;
//     category_id?: number;
//     subcategory_id?: number;
//     iBusinessType?: number | null;
//     primary_contact_mobile?: string | null;
//     primary_contact_name?: string | null;
//     primary_contact_designation?: string | null;
//     primary_contact_email?: string | null;
//     created_at?: string | null;
//     updated_at?: string | null;
//     other_contacts?: OtherContact[];

//     name?: string | null;
//     mobile?: string | null;
//     mobileno?: string | null;
//     email?: string | null;
//     designation?: string | null;
//     enter_by?: string | number | null;
//     expo_id?: number;
//     visitor_category_id?: number | null;

//     city?: {
//         id?: number;
//         name?: string | null;
//         stateid?: number;
//     };

//     state?: {
//         id?: number;
//         name?: string | null;
//         stateName?: string | null;
//     };

//     business_type?:
//     | string
//     | {
//         id?: number;
//         strBusinessType?: string | null;
//     }
//     | null;

//     visitor_category?:
//     | string
//     | {
//         id?: number;
//         strVisitorCategory?: string | null;
//     }
//     | null;

//     industry?: {
//         id?: number;
//         name?: string | null;
//     };

//     industry_category?:
//     | string
//     | {
//         id?: number;
//         industry_category_name?: string | null;
//     }
//     | null;

//     industry_subcategory?:
//     | string
//     | {
//         id?: number;
//         industry_subcategory_name?: string | null;
//     }
//     | null;

//     user?: {
//         id?: number;
//         name?: string | null;
//         mobile?: string | null;
//         email?: string | null;
//         address?: string | null;
//         depart_id?: number;
//     };

//     expo_details?: any[];
//     state_name?: string | null;
//     city_name?: string | null;
// };

// type PaginatedList = {
//     current_page: number;
//     data: ListingItem[];
//     last_page?: number;
//     per_page?: number;
//     total?: number;
//     from?: number;
//     to?: number;
// };

// type ApiData = {
//     visitor_list: PaginatedList | ListingItem[];
//     todays_visitor: PaginatedList | ListingItem[];
//     total_exhibitor: PaginatedList | ListingItem[];
//     todays_exhibitor: PaginatedList | ListingItem[];
//     total_expected_exhibitor: PaginatedList | ListingItem[];
//     todays_expected_exhibitor: PaginatedList | ListingItem[];
// };

// type ListingApiResponse = {
//     success: boolean;
//     data: ApiData;
//     message?: string;
// };

// type TableKind = "visitor" | "exhibitor" | "expectedExhibitor";

// type RouteConfig = {
//     userCountFor:
//     | "TotalVisitor"
//     | "TodaysVisitor"
//     | "TotalExhibitor"
//     | "TodaysExhibitor"
//     | "TotalExpectedExhibitor"
//     | "TodaysExpectedExhibitor";
//     title: string;
//     responseKey: keyof ApiData;
//     tableKind: TableKind;
// };

// type IndustryRow = {
//     id: number;
//     name?: string | null;
// };

// type ExpoRow = {
//     id: number;
//     exponame?: string | null;
//     name?: string | null;
//     title?: string | null;
// };

// type VisitorCategoryRow = {
//     id: number;
//     strVisitorCategory?: string | null;
//     name?: string | null;
// };

// type IndustryCategoryRow = {
//     id: number;
//     industry_category_name?: string | null;
//     name?: string | null;
// };

// type IndustrySubcategoryRow = {
//     id: number;
//     industry_subcategory_name?: string | null;
//     name?: string | null;
// };

// type BusinessTypeRow = {
//     id: number;
//     strBusinessType?: string | null;
//     name?: string | null;
// };

// type FilterState = {
//     industry_id: string;
//     expo_id: string;
//     visitor_category_id: string;
//     category_id: string;
//     subcategory_id: string;
//     iBusinessType: string;
//     textSearch: string;
// };

// const routeMap: Record<string, RouteConfig> = {
//     "total-visitor": {
//         userCountFor: "TotalVisitor",
//         title: "Total Visitors Listing",
//         responseKey: "visitor_list",
//         tableKind: "visitor",
//     },
//     "todays-visitor": {
//         userCountFor: "TodaysVisitor",
//         title: "Today's Visitors Listing",
//         responseKey: "todays_visitor",
//         tableKind: "visitor",
//     },
//     "total-exhibitor": {
//         userCountFor: "TotalExhibitor",
//         title: "Total Exhibitors Listing",
//         responseKey: "total_exhibitor",
//         tableKind: "exhibitor",
//     },
//     "todays-exhibitor": {
//         userCountFor: "TodaysExhibitor",
//         title: "Today's Exhibitors Listing",
//         responseKey: "todays_exhibitor",
//         tableKind: "exhibitor",
//     },
//     "total-expected-exhibitor": {
//         userCountFor: "TotalExpectedExhibitor",
//         title: "Total Expected Exhibitors Listing",
//         responseKey: "total_expected_exhibitor",
//         tableKind: "expectedExhibitor",
//     },
//     "todays-expected-exhibitor": {
//         userCountFor: "TodaysExpectedExhibitor",
//         title: "Today's Expected Exhibitors Listing",
//         responseKey: "todays_expected_exhibitor",
//         tableKind: "expectedExhibitor",
//     },
// };

// /* --------------------------- Helpers --------------------------- */

// function displayValue(value: any) {
//     if (value === null || value === undefined) return "-";
//     if (typeof value === "string" && value.trim() === "") return "-";
//     return value;
// }

// function safeValue(value: any) {
//     const finalValue = displayValue(value);
//     return finalValue === "-" ? "-" : String(finalValue);
// }

// function getBusinessType(item: ListingItem) {
//     const businessType = item.business_type;

//     if (typeof businessType === "string") {
//         return businessType.trim() !== "" ? businessType : "-";
//     }

//     if (
//         businessType &&
//         typeof businessType === "object" &&
//         businessType.strBusinessType &&
//         businessType.strBusinessType.trim() !== ""
//     ) {
//         return businessType.strBusinessType;
//     }

//     if (
//         item.iBusinessType !== null &&
//         item.iBusinessType !== undefined &&
//         String(item.iBusinessType).trim() !== ""
//     ) {
//         return item.iBusinessType;
//     }

//     return "-";
// }

// function getStateName(item: ListingItem) {
//     const value = item.state?.stateName || item.state?.name || item.state_name;
//     return displayValue(value);
// }

// function getCityName(item: ListingItem) {
//     const value = item.city?.name || item.city_name;
//     return displayValue(value);
// }

// function getCategoryName(item: ListingItem) {
//     const category = item.industry_category;

//     if (typeof category === "string") {
//         return category.trim() !== "" ? category : "-";
//     }

//     if (
//         category &&
//         typeof category === "object" &&
//         category.industry_category_name &&
//         category.industry_category_name.trim() !== ""
//     ) {
//         return category.industry_category_name;
//     }

//     return "-";
// }

// function getSubcategoryName(item: ListingItem) {
//     const subcategory = item.industry_subcategory;

//     if (typeof subcategory === "string") {
//         return subcategory.trim() !== "" ? subcategory : "-";
//     }

//     if (
//         subcategory &&
//         typeof subcategory === "object" &&
//         subcategory.industry_subcategory_name &&
//         subcategory.industry_subcategory_name.trim() !== ""
//     ) {
//         return subcategory.industry_subcategory_name;
//     }

//     return "-";
// }

// function getEnteredBy(item: ListingItem) {
//     if (item.user?.name && String(item.user.name).trim() !== "") {
//         return item.user.name;
//     }

//     if (
//         item.enter_by !== null &&
//         item.enter_by !== undefined &&
//         String(item.enter_by).trim() !== "" &&
//         Number.isNaN(Number(item.enter_by))
//     ) {
//         return String(item.enter_by);
//     }

//     return "-";
// }

// /* --------------------------- Table Configurations --------------------------- */

// type ColumnDef = {
//     key: string;
//     label: string;
// };

// const TABLE_COLUMNS: Record<TableKind, ColumnDef[]> = {
//     visitor: [
//         { key: "sr_no", label: "Sr No." },
//         { key: "name", label: "Name" },
//         { key: "company", label: "Company" },
//         { key: "mobile", label: "Mobile" },
//         { key: "email", label: "Email" },
//         { key: "address", label: "Address" },
//         { key: "city", label: "City" },
//         { key: "state", label: "State" },
//         { key: "entered_by", label: "Entered By" },
//         { key: "created_at", label: "Created At" },
//     ],
//     exhibitor: [
//         { key: "sr_no", label: "Sr No." },
//         { key: "company_name", label: "Company Name" },
//         { key: "gst", label: "GST" },
//         { key: "business_type", label: "Business Type" },
//         { key: "address", label: "Address" },
//         { key: "city", label: "City" },
//         { key: "state", label: "State" },
//         { key: "category", label: "Category" },
//         { key: "subcategory", label: "Subcategory" },
//         { key: "entered_by", label: "Entered By" },
//         { key: "created_at", label: "Created At" },
//     ],
//     expectedExhibitor: [
//         { key: "sr_no", label: "Sr No." },
//         { key: "company_name", label: "Company Name" },
//         { key: "gst", label: "GST" },
//         { key: "primary_contact_name", label: "Primary Contact Name" },
//         { key: "primary_contact_mobile", label: "Primary Contact Mobile" },
//         { key: "primary_contact_email", label: "Primary Contact Email" },
//         { key: "other_contact_name", label: "Other Contact Name" },
//         { key: "other_contact_mobile", label: "Other Contact Mobile" },
//         { key: "other_contact_email", label: "Other Contact Email" },
//         { key: "business_type", label: "Business Type" },
//         { key: "address", label: "Address" },
//         { key: "city", label: "City" },
//         { key: "state", label: "State" },
//         { key: "category", label: "Category" },
//         { key: "subcategory", label: "Subcategory" },
//         { key: "entered_by", label: "Entered By" },
//         { key: "created_at", label: "Created At" },
//     ],
// };

// /* ---------------------------- Row Normalization ---------------------------- */

// function normalizeVisitorRow(item: ListingItem, page: number, index: number, perPage: number) {
//     return {
//         sr_no: (page - 1) * perPage + index + 1,
//         name: displayValue(item.name),
//         company: displayValue(item.companyname || item.company_name || item.company),
//         mobile: displayValue(item.mobileno || item.mobile),
//         email: displayValue(item.email),
//         address: displayValue(item.address || item.user?.address),
//         city: displayValue(getCityName(item)),
//         state: displayValue(getStateName(item)),
//         entered_by: displayValue(getEnteredBy(item)),
//         created_at: displayValue(formatDate(item.created_at)),
//     };
// }

// function normalizeExhibitorRow(item: ListingItem, page: number, index: number, perPage: number) {
//     return {
//         sr_no: (page - 1) * perPage + index + 1,
//         company_name: displayValue(item.company_name || item.companyname),
//         gst: displayValue(item.gst),
//         business_type: displayValue(getBusinessType(item)),
//         address: displayValue(item.address),
//         city: displayValue(getCityName(item)),
//         state: displayValue(getStateName(item)),
//         category: displayValue(getCategoryName(item)),
//         subcategory: displayValue(getSubcategoryName(item)),
//         entered_by: displayValue(getEnteredBy(item)),
//         created_at: displayValue(formatDate(item.created_at)),
//     };
// }

// function normalizeExpectedExhibitorRow(
//     item: ListingItem,
//     page: number,
//     index: number,
//     perPage: number
// ) {
//     const firstOther =
//         Array.isArray(item.other_contacts) && item.other_contacts.length > 0
//             ? item.other_contacts[0]
//             : undefined;

//     return {
//         sr_no: (page - 1) * perPage + index + 1,
//         company_name: displayValue(item.company_name || item.companyname),
//         gst: displayValue(item.gst),
//         primary_contact_name: displayValue(item.primary_contact_name),
//         primary_contact_mobile: displayValue(item.primary_contact_mobile),
//         primary_contact_email: displayValue(item.primary_contact_email),
//         other_contact_name: displayValue(firstOther?.other_contact_name),
//         other_contact_mobile: displayValue(firstOther?.other_contact_mobile),
//         other_contact_email: displayValue(firstOther?.other_contact_email),
//         business_type: displayValue(getBusinessType(item)),
//         address: displayValue(item.address),
//         city: displayValue(getCityName(item)),
//         state: displayValue(getStateName(item)),
//         category: displayValue(getCategoryName(item)),
//         subcategory: displayValue(getSubcategoryName(item)),
//         entered_by: displayValue(getEnteredBy(item)),
//         created_at: displayValue(formatDate(item.created_at)),
//     };
// }

// function normalizeRows(
//     rows: ListingItem[],
//     tableKind: TableKind,
//     currentPage: number,
//     perPage: number
// ) {
//     if (tableKind === "visitor") {
//         return rows.map((item, index) => normalizeVisitorRow(item, currentPage, index, perPage));
//     }

//     if (tableKind === "exhibitor") {
//         return rows.map((item, index) => normalizeExhibitorRow(item, currentPage, index, perPage));
//     }

//     return rows.map((item, index) =>
//         normalizeExpectedExhibitorRow(item, currentPage, index, perPage)
//     );
// }

// /* -------------------------------- Component -------------------------------- */

// export default function VisitorListingPage() {
//     const { type } = useParams<{ type: string }>();

//     const [loading, setLoading] = useState(false);
//     const [isListing, setIsListing] = useState(false);

//     const [rows, setRows] = useState<ListingItem[]>([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [lastPage, setLastPage] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [perPage, setPerPage] = useState(10);

//     const [industries, setIndustries] = useState<IndustryRow[]>([]);
//     const [expoList, setExpoList] = useState<ExpoRow[]>([]);
//     const [visitorCategories, setVisitorCategories] = useState<VisitorCategoryRow[]>([]);
//     const [industryCategories, setIndustryCategories] = useState<IndustryCategoryRow[]>([]);
//     const [subCategories, setSubCategories] = useState<IndustrySubcategoryRow[]>([]);
//     const [businessTypes, setBusinessTypes] = useState<BusinessTypeRow[]>([]);

//     const [isExpoLoading, setIsExpoLoading] = useState(false);
//     const [isCategoryLoading, setIsCategoryLoading] = useState(false);
//     const [isSubcategoryLoading, setIsSubcategoryLoading] = useState(false);

//     const [filters, setFilters] = useState<FilterState>({
//         industry_id: "",
//         expo_id: "",
//         visitor_category_id: "",
//         category_id: "",
//         subcategory_id: "",
//         iBusinessType: "",
//         textSearch: "",
//     });

//     const config = useMemo(() => {
//         return routeMap[type || ""] || null;
//     }, [type]);

//     const isVisitorTable = config?.tableKind === "visitor";
//     const isExhibitorTable =
//         config?.tableKind === "exhibitor" || config?.tableKind === "expectedExhibitor";

//     const tableColumns = useMemo(() => {
//         return config ? TABLE_COLUMNS[config.tableKind] : [];
//     }, [config]);

//     const displayRows = useMemo(() => {
//         if (!config) return [];
//         return normalizeRows(rows, config.tableKind, currentPage, perPage);
//     }, [rows, config, currentPage, perPage]);

//     const handleFilterChange = (key: keyof FilterState, value: string) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//             ...(key === "industry_id"
//                 ? {
//                     expo_id: "",
//                     visitor_category_id: "",
//                     category_id: "",
//                     subcategory_id: "",
//                 }
//                 : {}),
//             ...(key === "category_id"
//                 ? {
//                     subcategory_id: "",
//                 }
//                 : {}),
//         }));
//     };

//     const fetchIndustries = async () => {
//         try {
//             setIsListing(true);

//             const res = await axios.post(
//                 `${apiUrl}/IndustryList`,
//                 {},
//                 { headers: authHeaders() }
//             );

//             if (res.data?.success) {
//                 setIndustries(res.data.data || []);
//             } else {
//                 toast.error(res.data?.message || "Failed to fetch industries");
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error("Error fetching industries");
//         } finally {
//             setIsListing(false);
//         }
//     };

//     const fetchExpoList = async (industry_id: string = "") => {
//         if (!industry_id) {
//             setExpoList([]);
//             setFilters((prev) => ({
//                 ...prev,
//                 expo_id: "",
//             }));
//             return;
//         }

//         try {
//             setIsExpoLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/Industrywise/Expo`,
//                 { industry_id },
//                 { headers: authHeaders() }
//             );

//             if (res.data?.success) {
//                 setExpoList(res.data?.data || []);
//             } else {
//                 setExpoList([]);
//                 setFilters((prev) => ({
//                     ...prev,
//                     expo_id: "",
//                 }));
//                 toast.error(res.data?.message || "Failed to fetch expo list");
//             }
//         } catch (error: any) {
//             console.error(error);
//             setExpoList([]);
//             setFilters((prev) => ({
//                 ...prev,
//                 expo_id: "",
//             }));
//             toast.error(getApiErrorMessage(error, "Expo list fetch failed"));
//         } finally {
//             setIsExpoLoading(false);
//         }
//     };

//     const fetchVisitorCategories = async (industry_id: string = "") => {
//         try {
//             setIsListing(true);

//             const res = await axios.post(
//                 `${apiUrl}/visitor-category/index`,
//                 {
//                     industry_id: industry_id || "",
//                 },
//                 { headers: authHeaders() }
//             );

//             if (res.data?.status) {
//                 setVisitorCategories(res.data?.data || []);
//             } else {
//                 setVisitorCategories([]);
//                 setFilters((prev) => ({ ...prev, visitor_category_id: "" }));
//                 toast.error(res.data?.message || "Failed to fetch visitor categories");
//             }
//         } catch (error: any) {
//             console.error(error);
//             setVisitorCategories([]);
//             setFilters((prev) => ({ ...prev, visitor_category_id: "" }));
//             toast.error(getApiErrorMessage(error, "Error fetching visitor categories"));
//         } finally {
//             setIsListing(false);
//         }
//     };

//     const fetchIndustryCategories = async (industry_id: string = "") => {
//         if (!industry_id) {
//             setIndustryCategories([]);
//             setFilters((prev) => ({
//                 ...prev,
//                 category_id: "",
//                 subcategory_id: "",
//             }));
//             return;
//         }

//         try {
//             setIsCategoryLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/industry-subcategories/get-by-industry`,
//                 { industry_id },
//                 { headers: authHeaders() }
//             );

//             const dataRows = res.data?.data || res.data?.result || [];
//             const uniqueMap = new Map<string, IndustryCategoryRow>();

//             (Array.isArray(dataRows) ? dataRows : []).forEach((item: any) => {
//                 const id = String(
//                     item?.category_id ??
//                     item?.industry_category_id ??
//                     item?.id ??
//                     ""
//                 );

//                 const name =
//                     item?.industry_category_name ||
//                     item?.category_name ||
//                     item?.name ||
//                     item?.title ||
//                     "";

//                 if (id && name && !uniqueMap.has(id)) {
//                     uniqueMap.set(id, {
//                         id: Number(id),
//                         industry_category_name: String(name),
//                     });
//                 }
//             });

//             setIndustryCategories(Array.from(uniqueMap.values()));
//         } catch (error: any) {
//             console.error(error);
//             setIndustryCategories([]);
//             toast.error(getApiErrorMessage(error, "Error fetching categories"));
//         } finally {
//             setIsCategoryLoading(false);
//         }
//     };

//     const fetchSubCategories = async (category_id: string | number | null = null) => {
//         if (!category_id) {
//             setSubCategories([]);
//             setFilters((prev) => ({
//                 ...prev,
//                 subcategory_id: "",
//             }));
//             return;
//         }

//         try {
//             setIsSubcategoryLoading(true);

//             const res = await axios.post(
//                 `${apiUrl}/industry-subcategories/get-by-category`,
//                 { industry_category_id: category_id },
//                 { headers: authHeaders() }
//             );

//             const dataRows = res.data?.data || res.data?.result || [];

//             const list: IndustrySubcategoryRow[] = (Array.isArray(dataRows) ? dataRows : [])
//                 .map((item: any) => ({
//                     id: Number(
//                         item?.id ??
//                         item?.subcategory_id ??
//                         item?.industry_subcategory_id ??
//                         0
//                     ),
//                     industry_subcategory_name:
//                         item?.industry_subcategory_name ||
//                         item?.subcategory_name ||
//                         item?.name ||
//                         item?.title ||
//                         "",
//                 }))
//                 .filter((item) => item.id && item.industry_subcategory_name);

//             setSubCategories(list);
//         } catch (error: any) {
//             console.error(error);
//             setSubCategories([]);
//             toast.error(getApiErrorMessage(error, "Error fetching subcategories"));
//         } finally {
//             setIsSubcategoryLoading(false);
//         }
//     };

//     const fetchBusinessTypes = async () => {
//         try {
//             setIsListing(true);

//             const res = await axios.post(
//                 `${apiUrl}/business-types/index`,
//                 {},
//                 { headers: authHeaders() }
//             );

//             if (res.data?.success) {
//                 setBusinessTypes(res.data.data || []);
//             } else {
//                 toast.error(res.data?.message || "Failed to fetch business types");
//             }
//         } catch (error: any) {
//             console.error(error);
//             toast.error("Error fetching business types");
//         } finally {
//             setIsListing(false);
//         }
//     };

//     const fetchListing = async (page = 1, appliedFilters: FilterState = filters) => {
//         if (!config) {
//             toast.error("Invalid listing type");
//             setRows([]);
//             return;
//         }

//         try {
//             setLoading(true);

//             const payload: any = {
//                 userCountFor: config.userCountFor,
//                 page,
//             };

//             if (config.tableKind === "visitor") {
//                 payload.industry_id = appliedFilters.industry_id || "";
//                 payload.expo_id = appliedFilters.expo_id || "";
//                 payload.visitor_category_id = appliedFilters.visitor_category_id || "";
//                 payload.textSearch = appliedFilters.textSearch || "";
//             } else {
//                 payload.industry_id = appliedFilters.industry_id || "";
//                 payload.expo_id = appliedFilters.expo_id || "";
//                 payload.category_id = appliedFilters.category_id || "";
//                 payload.subcategory_id = appliedFilters.subcategory_id || "";
//                 payload.iBusinessType = appliedFilters.iBusinessType || "";
//                 payload.textSearch = appliedFilters.textSearch || "";
//             }

//             const res = await axios.post<ListingApiResponse>(
//                 `${apiUrl}/adminVisitorListing`,
//                 payload,
//                 {
//                     headers: {
//                         ...authHeaders(),
//                     },
//                 }
//             );

//             const response = res.data;

//             if (!response?.success) {
//                 toast.error(response?.message || "Failed to load listing");
//                 setRows([]);
//                 setCurrentPage(1);
//                 setLastPage(1);
//                 setTotalRecords(0);
//                 return;
//             }

//             const responseBlock = response?.data?.[config.responseKey];

//             if (Array.isArray(responseBlock)) {
//                 setRows(responseBlock);
//                 setCurrentPage(1);
//                 setLastPage(1);
//                 setTotalRecords(responseBlock.length);
//                 setPerPage(responseBlock.length || 10);
//             } else if (responseBlock && typeof responseBlock === "object") {
//                 const apiRows = Array.isArray(responseBlock.data) ? responseBlock.data : [];
//                 setRows(apiRows);
//                 setCurrentPage(responseBlock.current_page || page || 1);
//                 setLastPage(responseBlock.last_page || 1);
//                 setTotalRecords(responseBlock.total || 0);
//                 setPerPage(responseBlock.per_page || apiRows.length || 10);
//             } else {
//                 setRows([]);
//                 setCurrentPage(1);
//                 setLastPage(1);
//                 setTotalRecords(0);
//                 setPerPage(10);
//             }
//         } catch (err: any) {
//             toast.error(getApiErrorMessage(err, "Failed to load listing"));
//             setRows([]);
//             setCurrentPage(1);
//             setLastPage(1);
//             setTotalRecords(0);
//             setPerPage(10);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = () => {
//         setCurrentPage(1);
//         fetchListing(1, filters);
//     };

//     const resetFilters = () => {
//         const emptyFilters: FilterState = {
//             industry_id: "",
//             expo_id: "",
//             visitor_category_id: "",
//             category_id: "",
//             subcategory_id: "",
//             iBusinessType: "",
//             textSearch: "",
//         };

//         setFilters(emptyFilters);
//         setExpoList([]);
//         setVisitorCategories([]);
//         setIndustryCategories([]);
//         setSubCategories([]);
//         setCurrentPage(1);
//         fetchListing(1, emptyFilters);
//     };

//     useEffect(() => {
//         fetchIndustries();
//         fetchBusinessTypes();
//     }, []);

//     useEffect(() => {
//         setExpoList([]);
//         setVisitorCategories([]);
//         setIndustryCategories([]);
//         setSubCategories([]);

//         setFilters((prev) => ({
//             ...prev,
//             expo_id: "",
//             visitor_category_id: "",
//             category_id: "",
//             subcategory_id: "",
//         }));

//         if (filters.industry_id) {
//             fetchExpoList(filters.industry_id);
//             fetchVisitorCategories(filters.industry_id);
//             fetchIndustryCategories(filters.industry_id);
//         }
//     }, [filters.industry_id]);

//     useEffect(() => {
//         setSubCategories([]);
//         setFilters((prev) => ({
//             ...prev,
//             subcategory_id: "",
//         }));

//         if (filters.category_id) {
//             fetchSubCategories(filters.category_id);
//         }
//     }, [filters.category_id]);

//     useEffect(() => {
//         const emptyFilters: FilterState = {
//             industry_id: "",
//             expo_id: "",
//             visitor_category_id: "",
//             category_id: "",
//             subcategory_id: "",
//             iBusinessType: "",
//             textSearch: "",
//         };

//         setRows([]);
//         setCurrentPage(1);
//         setLastPage(1);
//         setTotalRecords(0);
//         setPerPage(10);
//         setFilters(emptyFilters);
//         setExpoList([]);
//         setVisitorCategories([]);
//         setIndustryCategories([]);
//         setSubCategories([]);
//         fetchListing(1, emptyFilters);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [type]);

//     const handlePageChange = (page: number) => {
//         if (page < 1 || page > lastPage || page === currentPage) return;
//         fetchListing(page, filters);
//     };

//     const pageNumbers = useMemo(() => {
//         const pages: number[] = [];
//         let start = Math.max(1, currentPage - 2);
//         let end = Math.min(lastPage, currentPage + 2);

//         if (currentPage <= 3) end = Math.min(lastPage, 5);
//         if (currentPage >= lastPage - 2) start = Math.max(1, lastPage - 4);

//         for (let i = start; i <= end; i++) {
//             pages.push(i);
//         }

//         return pages;
//     }, [currentPage, lastPage]);

//     if (!config) {
//         return (
//             <div className="p-6">
//                 <div className="rounded-xl bg-white p-6 text-center text-red-600 shadow">
//                     Invalid listing type
//                 </div>
//             </div>
//         );
//     }

//     const toCapitalizedWords = (value: any) => {
//         if (value === null || value === undefined || value === "-") return "-";

//         return String(value)
//             .toLowerCase()
//             .replace(/\b\w/g, (char) => char.toUpperCase());
//     };

//     const formatCellValue = (key: string, value: any) => {
//         const finalValue = safeValue(value);

//         if (finalValue === "-") return "-";

//         if (key.toLowerCase().includes("email")) {
//             return String(finalValue).toLowerCase();
//         }

//         if (key.toLowerCase() === "gst") {
//             return String(finalValue).toUpperCase();
//         }

//         return toCapitalizedWords(finalValue);
//     };

//     return (
//         <div className="space-y-6 p-4 md:p-6">
//             <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
//                     <p className="mt-1 text-sm text-gray-500">Total Records: {totalRecords}</p>
//                 </div>

//                 <Link
//                     to="/admin"
//                     className="inline-flex w-fit items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
//                 >
//                     Back
//                 </Link>
//             </div>

//             <div className="rounded-xl bg-white p-4 shadow">
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
//                     <div>
//                         <label className="mb-1 block text-sm font-medium text-gray-700">
//                             Industry
//                         </label>
//                         <select
//                             value={filters.industry_id}
//                             onChange={(e) => handleFilterChange("industry_id", e.target.value)}
//                             className="w-full rounded-lg border px-3 py-2"
//                         >
//                             <option value="">All Industries</option>
//                             {industries.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name || `Industry ${item.id}`}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="mb-1 block text-sm font-medium text-gray-700">
//                             Expo
//                         </label>
//                         <select
//                             value={filters.expo_id}
//                             onChange={(e) => handleFilterChange("expo_id", e.target.value)}
//                             disabled={!filters.industry_id || isExpoLoading}
//                             className="w-full rounded-lg border px-3 py-2"
//                         >
//                             <option value="">
//                                 {!filters.industry_id
//                                     ? "Select Industry first"
//                                     : isExpoLoading
//                                         ? "Loading..."
//                                         : "All Expo"}
//                             </option>

//                             {expoList.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.exponame || item.name || item.title || `Expo ${item.id}`}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {isVisitorTable && (
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">
//                                 Visitor Category
//                             </label>
//                             <select
//                                 value={filters.visitor_category_id}
//                                 onChange={(e) =>
//                                     handleFilterChange("visitor_category_id", e.target.value)
//                                 }
//                                 className="w-full rounded-lg border px-3 py-2"
//                             >
//                                 <option value="">All Visitor Categories</option>
//                                 {visitorCategories.map((item) => (
//                                     <option key={item.id} value={item.id}>
//                                         {item.strVisitorCategory || item.name || `Category ${item.id}`}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}

//                     {isExhibitorTable && (
//                         <>
//                             <div>
//                                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                                     Category
//                                 </label>
//                                 <select
//                                     value={filters.category_id}
//                                     onChange={(e) => handleFilterChange("category_id", e.target.value)}
//                                     disabled={!filters.industry_id || isCategoryLoading}
//                                     className="w-full rounded-lg border px-3 py-2"
//                                 >
//                                     <option value="">
//                                         {!filters.industry_id
//                                             ? "Select Industry first"
//                                             : isCategoryLoading
//                                                 ? "Loading..."
//                                                 : "All Categories"}
//                                     </option>
//                                     {industryCategories.map((item) => (
//                                         <option key={item.id} value={item.id}>
//                                             {item.industry_category_name || item.name || `Category ${item.id}`}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                                     Subcategory
//                                 </label>
//                                 <select
//                                     value={filters.subcategory_id}
//                                     onChange={(e) => handleFilterChange("subcategory_id", e.target.value)}
//                                     disabled={!filters.category_id || isSubcategoryLoading}
//                                     className="w-full rounded-lg border px-3 py-2"
//                                 >
//                                     <option value="">
//                                         {!filters.category_id
//                                             ? "Select Category first"
//                                             : isSubcategoryLoading
//                                                 ? "Loading..."
//                                                 : "All Subcategories"}
//                                     </option>
//                                     {subCategories.map((item) => (
//                                         <option key={item.id} value={item.id}>
//                                             {item.industry_subcategory_name || item.name || `Subcategory ${item.id}`}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                                     Business Type
//                                 </label>
//                                 <select
//                                     value={filters.iBusinessType}
//                                     onChange={(e) => handleFilterChange("iBusinessType", e.target.value)}
//                                     className="w-full rounded-lg border px-3 py-2"
//                                 >
//                                     <option value="">All Business Types</option>
//                                     {businessTypes.map((item) => (
//                                         <option key={item.id} value={item.id}>
//                                             {item.strBusinessType || item.name || `Business Type ${item.id}`}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </>
//                     )}

//                     <div className="">
//                         <label className="mb-1 block text-sm font-medium text-gray-700">
//                             Search
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 value={filters.textSearch}
//                                 onChange={(e) => handleFilterChange("textSearch", e.target.value)}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") handleSearch();
//                                 }}
//                                 placeholder="Search here..."
//                                 className="w-full rounded-lg border p-2"
//                             />
//                         </div>
//                     </div>

//                     <div className="mt-4 flex gap-3">
//                         <button
//                             onClick={() => handleSearch()}
//                             disabled={loading || isListing}
//                             className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
//                         >
//                             Search
//                         </button>

//                         <button
//                             onClick={resetFilters}
//                             disabled={loading || isListing}
//                             className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 transition hover:bg-gray-300 disabled:opacity-50"
//                         >
//                             Reset
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="overflow-hidden rounded-xl bg-white shadow">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-[1400px] w-full border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 text-gray-700">
//                                 {tableColumns.map((col) => (
//                                     <th
//                                         key={col.key}
//                                         className="whitespace-nowrap p-3 text-left font-semibold"
//                                     >
//                                         {col.label}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {loading && (
//                                 <tr>
//                                     <td colSpan={tableColumns.length} className="p-8 text-center">
//                                         <div className="flex items-center justify-center gap-3 text-gray-500">
//                                             <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}

//                             {!loading && displayRows.length === 0 && (
//                                 <tr>
//                                     <td
//                                         colSpan={tableColumns.length}
//                                         className="p-8 text-center text-gray-500"
//                                     >
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}

//                             {!loading &&
//                                 displayRows.map((row: Record<string, any>, rowIndex: number) => (
//                                     <tr
//                                         key={`${row.id || row.sr_no || rowIndex}`}
//                                         className="border-b align-top hover:bg-gray-50"
//                                     >
//                                         {tableColumns.map((col) => (
//                                             <td key={col.key} className="whitespace-nowrap p-3">
//                                                 {formatCellValue(col.key, row[col.key])}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {!loading && totalRecords > 0 && (
//                     <div className="flex flex-col gap-4 border-t bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
//                         <div className="text-sm text-gray-600">
//                             Page {currentPage} of {lastPage} | Showing {rows.length} records
//                         </div>

//                         <div className="flex flex-wrap items-center gap-2">
//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className="rounded-lg border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 Prev
//                             </button>

//                             {pageNumbers.map((page) => (
//                                 <button
//                                     key={page}
//                                     onClick={() => handlePageChange(page)}
//                                     className={`rounded-lg px-3 py-2 text-sm ${currentPage === page
//                                         ? "bg-blue-600 text-white"
//                                         : "border bg-white text-gray-700"
//                                         }`}
//                                 >
//                                     {page}
//                                 </button>
//                             ))}

//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === lastPage}
//                                 className="rounded-lg border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

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

function formatDate(value?: string | null) {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

/* -------------------------------- Types -------------------------------- */

type OtherContact = {
    id?: number;
    exhibitor_company_information_id?: number;
    other_contact_mobile?: string | null;
    other_contact_name?: string | null;
    other_contact_designation?: string | null;
    other_contact_email?: string | null;
};

type ListingItem = {
    id: number;

    company_name?: string;
    companyname?: string;
    company?: string;

    gst?: string | null;
    state_id?: number;
    city_id?: number;
    address?: string | null;
    industry_id?: number;
    category_id?: number;
    subcategory_id?: number;
    iBusinessType?: number | null;
    primary_contact_mobile?: string | null;
    primary_contact_name?: string | null;
    primary_contact_designation?: string | null;
    primary_contact_email?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    other_contacts?: OtherContact[];

    name?: string | null;
    mobile?: string | null;
    mobileno?: string | null;
    email?: string | null;
    designation?: string | null;
    enter_by?: string | number | null;
    expo_id?: number;
    visitor_category_id?: number | null;

    city?: {
        id?: number;
        name?: string | null;
        stateid?: number;
    };

    state?: {
        id?: number;
        name?: string | null;
        stateName?: string | null;
    };

    business_type?:
    | string
    | {
        id?: number;
        strBusinessType?: string | null;
    }
    | null;

    visitor_category?:
    | string
    | {
        id?: number;
        strVisitorCategory?: string | null;
    }
    | null;

    industry?: {
        id?: number;
        name?: string | null;
    };

    industry_category?:
    | string
    | {
        id?: number;
        industry_category_name?: string | null;
    }
    | null;

    industry_subcategory?:
    | string
    | {
        id?: number;
        industry_subcategory_name?: string | null;
    }
    | null;

    user?: {
        id?: number;
        name?: string | null;
        mobile?: string | null;
        email?: string | null;
        address?: string | null;
        depart_id?: number;
    };

    expo_details?: any[];
    state_name?: string | null;
    city_name?: string | null;
};

type PaginatedList = {
    current_page: number;
    data: ListingItem[];
    last_page?: number;
    per_page?: number;
    total?: number;
    from?: number;
    to?: number;
};

type ApiData = {
    visitor_list: PaginatedList | ListingItem[];
    todays_visitor: PaginatedList | ListingItem[];
    total_exhibitor: PaginatedList | ListingItem[];
    todays_exhibitor: PaginatedList | ListingItem[];
    total_expected_exhibitor: PaginatedList | ListingItem[];
    todays_expected_exhibitor: PaginatedList | ListingItem[];
};

type ListingApiResponse = {
    success: boolean;
    data: ApiData;
    message?: string;
};

type TableKind = "visitor" | "exhibitor" | "expectedExhibitor";

type RouteConfig = {
    userCountFor:
    | "TotalVisitor"
    | "TodaysVisitor"
    | "TotalExhibitor"
    | "TodaysExhibitor"
    | "TotalExpectedExhibitor"
    | "TodaysExpectedExhibitor";
    title: string;
    responseKey: keyof ApiData;
    tableKind: TableKind;
};

type IndustryRow = {
    id: number;
    name?: string | null;
};

type ExpoRow = {
    id: number;
    exponame?: string | null;
    name?: string | null;
    title?: string | null;
};

type VisitorCategoryRow = {
    id: number;
    strVisitorCategory?: string | null;
    name?: string | null;
};

type IndustryCategoryRow = {
    id: number;
    industry_category_name?: string | null;
    name?: string | null;
};

type IndustrySubcategoryRow = {
    id: number;
    industry_subcategory_name?: string | null;
    name?: string | null;
};

type BusinessTypeRow = {
    id: number;
    strBusinessType?: string | null;
    name?: string | null;
};

type FilterState = {
    industry_id: string;
    expo_id: string;
    visitor_category_id: string;
    category_id: string;
    subcategory_id: string;
    iBusinessType: string;
    textSearch: string;
};

const routeMap: Record<string, RouteConfig> = {
    "total-visitor": {
        userCountFor: "TotalVisitor",
        title: "Total Visitors Listing",
        responseKey: "visitor_list",
        tableKind: "visitor",
    },
    "todays-visitor": {
        userCountFor: "TodaysVisitor",
        title: "Today's Visitors Listing",
        responseKey: "todays_visitor",
        tableKind: "visitor",
    },
    "total-exhibitor": {
        userCountFor: "TotalExhibitor",
        title: "Total Exhibitors Listing",
        responseKey: "total_exhibitor",
        tableKind: "exhibitor",
    },
    "todays-exhibitor": {
        userCountFor: "TodaysExhibitor",
        title: "Today's Exhibitors Listing",
        responseKey: "todays_exhibitor",
        tableKind: "exhibitor",
    },
    "total-expected-exhibitor": {
        userCountFor: "TotalExpectedExhibitor",
        title: "Total Expected Exhibitors Listing",
        responseKey: "total_expected_exhibitor",
        tableKind: "expectedExhibitor",
    },
    "todays-expected-exhibitor": {
        userCountFor: "TodaysExpectedExhibitor",
        title: "Today's Expected Exhibitors Listing",
        responseKey: "todays_expected_exhibitor",
        tableKind: "expectedExhibitor",
    },
};

/* --------------------------- Helpers --------------------------- */

function displayValue(value: any) {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" && value.trim() === "") return "-";
    return value;
}

function safeValue(value: any) {
    const finalValue = displayValue(value);
    return finalValue === "-" ? "-" : String(finalValue);
}

function getBusinessType(item: ListingItem) {
    const businessType = item.business_type;

    if (typeof businessType === "string") {
        return businessType.trim() !== "" ? businessType : "-";
    }

    if (
        businessType &&
        typeof businessType === "object" &&
        businessType.strBusinessType &&
        businessType.strBusinessType.trim() !== ""
    ) {
        return businessType.strBusinessType;
    }

    if (
        item.iBusinessType !== null &&
        item.iBusinessType !== undefined &&
        String(item.iBusinessType).trim() !== ""
    ) {
        return item.iBusinessType;
    }

    return "-";
}

function getStateName(item: ListingItem) {
    const value = item.state?.stateName || item.state?.name || item.state_name;
    return displayValue(value);
}

function getCityName(item: ListingItem) {
    const value = item.city?.name || item.city_name;
    return displayValue(value);
}

function getCategoryName(item: ListingItem) {
    const category = item.industry_category;

    if (typeof category === "string") {
        return category.trim() !== "" ? category : "-";
    }

    if (
        category &&
        typeof category === "object" &&
        category.industry_category_name &&
        category.industry_category_name.trim() !== ""
    ) {
        return category.industry_category_name;
    }

    return "-";
}

function getSubcategoryName(item: ListingItem) {
    const subcategory = item.industry_subcategory;

    if (typeof subcategory === "string") {
        return subcategory.trim() !== "" ? subcategory : "-";
    }

    if (
        subcategory &&
        typeof subcategory === "object" &&
        subcategory.industry_subcategory_name &&
        subcategory.industry_subcategory_name.trim() !== ""
    ) {
        return subcategory.industry_subcategory_name;
    }

    return "-";
}

function getEnteredBy(item: ListingItem) {
    if (item.user?.name && String(item.user.name).trim() !== "") {
        return item.user.name;
    }

    if (
        item.enter_by !== null &&
        item.enter_by !== undefined &&
        String(item.enter_by).trim() !== "" &&
        Number.isNaN(Number(item.enter_by))
    ) {
        return String(item.enter_by);
    }

    return "-";
}

/* --------------------------- Table Configurations --------------------------- */

type ColumnDef = {
    key: string;
    label: string;
};

const TABLE_COLUMNS: Record<TableKind, ColumnDef[]> = {
    visitor: [
        { key: "sr_no", label: "Sr No." },
        { key: "name", label: "Name" },
        { key: "company", label: "Company" },
        { key: "mobile", label: "Mobile" },
        { key: "email", label: "Email" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "entered_by", label: "Entered By" },
        { key: "created_at", label: "Created At" },
    ],
    exhibitor: [
        { key: "sr_no", label: "Sr No." },
        { key: "company_name", label: "Company Name" },
        { key: "gst", label: "GST" },
        { key: "business_type", label: "Business Type" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "category", label: "Category" },
        { key: "subcategory", label: "Subcategory" },
        { key: "entered_by", label: "Entered By" },
        { key: "created_at", label: "Created At" },
    ],
    expectedExhibitor: [
        { key: "sr_no", label: "Sr No." },
        { key: "company_name", label: "Company Name" },
        { key: "gst", label: "GST" },
        { key: "primary_contact_name", label: "Primary Contact Name" },
        { key: "primary_contact_mobile", label: "Primary Contact Mobile" },
        { key: "primary_contact_email", label: "Primary Contact Email" },
        { key: "other_contact_name", label: "Other Contact Name" },
        { key: "other_contact_mobile", label: "Other Contact Mobile" },
        { key: "other_contact_email", label: "Other Contact Email" },
        { key: "business_type", label: "Business Type" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "category", label: "Category" },
        { key: "subcategory", label: "Subcategory" },
        { key: "entered_by", label: "Entered By" },
        { key: "created_at", label: "Created At" },
    ],
};

/* ---------------------------- Row Normalization ---------------------------- */

function normalizeVisitorRow(item: ListingItem, page: number, index: number, perPage: number) {
    return {
        sr_no: (page - 1) * perPage + index + 1,
        name: displayValue(item.name),
        company: displayValue(item.companyname || item.company_name || item.company),
        mobile: displayValue(item.mobileno || item.mobile),
        email: displayValue(item.email),
        address: displayValue(item.address || item.user?.address),
        city: displayValue(getCityName(item)),
        state: displayValue(getStateName(item)),
        entered_by: displayValue(getEnteredBy(item)),
        created_at: displayValue(formatDate(item.created_at)),
    };
}

function normalizeExhibitorRow(item: ListingItem, page: number, index: number, perPage: number) {
    return {
        sr_no: (page - 1) * perPage + index + 1,
        company_name: displayValue(item.company_name || item.companyname),
        gst: displayValue(item.gst),
        business_type: displayValue(getBusinessType(item)),
        address: displayValue(item.address),
        city: displayValue(getCityName(item)),
        state: displayValue(getStateName(item)),
        category: displayValue(getCategoryName(item)),
        subcategory: displayValue(getSubcategoryName(item)),
        entered_by: displayValue(getEnteredBy(item)),
        created_at: displayValue(formatDate(item.created_at)),
    };
}

function normalizeExpectedExhibitorRow(
    item: ListingItem,
    page: number,
    index: number,
    perPage: number
) {
    const firstOther =
        Array.isArray(item.other_contacts) && item.other_contacts.length > 0
            ? item.other_contacts[0]
            : undefined;

    return {
        sr_no: (page - 1) * perPage + index + 1,
        company_name: displayValue(item.company_name || item.companyname),
        gst: displayValue(item.gst),
        primary_contact_name: displayValue(item.primary_contact_name),
        primary_contact_mobile: displayValue(item.primary_contact_mobile),
        primary_contact_email: displayValue(item.primary_contact_email),
        other_contact_name: displayValue(firstOther?.other_contact_name),
        other_contact_mobile: displayValue(firstOther?.other_contact_mobile),
        other_contact_email: displayValue(firstOther?.other_contact_email),
        business_type: displayValue(getBusinessType(item)),
        address: displayValue(item.address),
        city: displayValue(getCityName(item)),
        state: displayValue(getStateName(item)),
        category: displayValue(getCategoryName(item)),
        subcategory: displayValue(getSubcategoryName(item)),
        entered_by: displayValue(getEnteredBy(item)),
        created_at: displayValue(formatDate(item.created_at)),
    };
}

function normalizeRows(
    rows: ListingItem[],
    tableKind: TableKind,
    currentPage: number,
    perPage: number
) {
    if (tableKind === "visitor") {
        return rows.map((item, index) => normalizeVisitorRow(item, currentPage, index, perPage));
    }

    if (tableKind === "exhibitor") {
        return rows.map((item, index) => normalizeExhibitorRow(item, currentPage, index, perPage));
    }

    return rows.map((item, index) =>
        normalizeExpectedExhibitorRow(item, currentPage, index, perPage)
    );
}

/* -------------------------------- Component -------------------------------- */

export default function VisitorListingPage() {
    const { type } = useParams<{ type: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const selectedIndustryId = location.state?.selectedIndustryId
        ? String(location.state.selectedIndustryId)
        : "";

    const selectedIndustryName = location.state?.selectedIndustryName || "";
    const lockIndustryFromState = Boolean(location.state?.lockIndustry);

    const [loading, setLoading] = useState(false);
    // const [isListing, setIsListing] = useState(false);
    const [isIndustryLocked, setIsIndustryLocked] = useState(false);

    const [rows, setRows] = useState<ListingItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [industries, setIndustries] = useState<IndustryRow[]>([]);
    const [expoList, setExpoList] = useState<ExpoRow[]>([]);
    const [visitorCategories, setVisitorCategories] = useState<VisitorCategoryRow[]>([]);
    const [industryCategories, setIndustryCategories] = useState<IndustryCategoryRow[]>([]);
    const [subCategories, setSubCategories] = useState<IndustrySubcategoryRow[]>([]);
    const [businessTypes, setBusinessTypes] = useState<BusinessTypeRow[]>([]);

    const [isExpoLoading, setIsExpoLoading] = useState(false);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [isSubcategoryLoading, setIsSubcategoryLoading] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        industry_id: "",
        expo_id: "",
        visitor_category_id: "",
        category_id: "",
        subcategory_id: "",
        iBusinessType: "",
        textSearch: "",
    });

    const config = useMemo(() => {
        return routeMap[type || ""] || null;
    }, [type]);

    const isVisitorTable = config?.tableKind === "visitor";
    const isExhibitorTable =
        config?.tableKind === "exhibitor" || config?.tableKind === "expectedExhibitor";

    const tableColumns = useMemo(() => {
        return config ? TABLE_COLUMNS[config.tableKind] : [];
    }, [config]);

    const displayRows = useMemo(() => {
        if (!config) return [];
        return normalizeRows(rows, config.tableKind, currentPage, perPage);
    }, [rows, config, currentPage, perPage]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "industry_id"
                ? {
                    expo_id: "",
                    visitor_category_id: "",
                    category_id: "",
                    subcategory_id: "",
                }
                : {}),
            ...(key === "category_id"
                ? {
                    subcategory_id: "",
                }
                : {}),
        }));
    };

    const fetchIndustries = async () => {
        try {
            // setIsListing(true);

            const res = await axios.post(
                `${apiUrl}/IndustryList`,
                {},
                { headers: authHeaders() }
            );

            if (res.data?.success) {
                setIndustries(res.data.data || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch industries");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error fetching industries");
        } finally {
            // setIsListing(false);
        }
    };

    const fetchExpoList = async (industry_id: string = "") => {
        if (!industry_id) {
            setExpoList([]);
            setFilters((prev) => ({
                ...prev,
                expo_id: "",
            }));
            return;
        }

        try {
            setIsExpoLoading(true);

            const res = await axios.post(
                `${apiUrl}/Industrywise/Expo`,
                { industry_id },
                { headers: authHeaders() }
            );

            if (res.data?.success) {
                setExpoList(res.data?.data || []);
            } else {
                setExpoList([]);
                setFilters((prev) => ({
                    ...prev,
                    expo_id: "",
                }));
                toast.error(res.data?.message || "Failed to fetch expo list");
            }
        } catch (error: any) {
            console.error(error);
            setExpoList([]);
            setFilters((prev) => ({
                ...prev,
                expo_id: "",
            }));
            toast.error(getApiErrorMessage(error, "Expo list fetch failed"));
        } finally {
            setIsExpoLoading(false);
        }
    };

    const fetchVisitorCategories = async (industry_id: string = "") => {
        try {
            // setIsListing(true);

            const res = await axios.post(
                `${apiUrl}/visitor-category/index`,
                {
                    industry_id: industry_id || "",
                },
                { headers: authHeaders() }
            );

            if (res.data?.status) {
                setVisitorCategories(res.data?.data || []);
            } else {
                setVisitorCategories([]);
                setFilters((prev) => ({ ...prev, visitor_category_id: "" }));
                toast.error(res.data?.message || "Failed to fetch visitor categories");
            }
        } catch (error: any) {
            console.error(error);
            setVisitorCategories([]);
            setFilters((prev) => ({ ...prev, visitor_category_id: "" }));
            toast.error(getApiErrorMessage(error, "Error fetching visitor categories"));
        } finally {
            // setIsListing(false);
        }
    };

    const fetchIndustryCategories = async (industry_id: string = "") => {
        if (!industry_id) {
            setIndustryCategories([]);
            setFilters((prev) => ({
                ...prev,
                category_id: "",
                subcategory_id: "",
            }));
            return;
        }

        try {
            setIsCategoryLoading(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-industry`,
                { industry_id },
                { headers: authHeaders() }
            );

            const dataRows = res.data?.data || res.data?.result || [];
            const uniqueMap = new Map<string, IndustryCategoryRow>();

            (Array.isArray(dataRows) ? dataRows : []).forEach((item: any) => {
                const id = String(
                    item?.category_id ??
                    item?.industry_category_id ??
                    item?.id ??
                    ""
                );

                const name =
                    item?.industry_category_name ||
                    item?.category_name ||
                    item?.name ||
                    item?.title ||
                    "";

                if (id && name && !uniqueMap.has(id)) {
                    uniqueMap.set(id, {
                        id: Number(id),
                        industry_category_name: String(name),
                    });
                }
            });

            setIndustryCategories(Array.from(uniqueMap.values()));
        } catch (error: any) {
            console.error(error);
            setIndustryCategories([]);
            toast.error(getApiErrorMessage(error, "Error fetching categories"));
        } finally {
            setIsCategoryLoading(false);
        }
    };

    const fetchSubCategories = async (category_id: string | number | null = null) => {
        if (!category_id) {
            setSubCategories([]);
            setFilters((prev) => ({
                ...prev,
                subcategory_id: "",
            }));
            return;
        }

        try {
            setIsSubcategoryLoading(true);

            const res = await axios.post(
                `${apiUrl}/industry-subcategories/get-by-category`,
                { industry_category_id: category_id },
                { headers: authHeaders() }
            );

            const dataRows = res.data?.data || res.data?.result || [];

            const list: IndustrySubcategoryRow[] = (Array.isArray(dataRows) ? dataRows : [])
                .map((item: any) => ({
                    id: Number(
                        item?.id ??
                        item?.subcategory_id ??
                        item?.industry_subcategory_id ??
                        0
                    ),
                    industry_subcategory_name:
                        item?.industry_subcategory_name ||
                        item?.subcategory_name ||
                        item?.name ||
                        item?.title ||
                        "",
                }))
                .filter((item) => item.id && item.industry_subcategory_name);

            setSubCategories(list);
        } catch (error: any) {
            console.error(error);
            setSubCategories([]);
            toast.error(getApiErrorMessage(error, "Error fetching subcategories"));
        } finally {
            setIsSubcategoryLoading(false);
        }
    };

    const fetchBusinessTypes = async () => {
        try {
            // setIsListing(true);

            const res = await axios.post(
                `${apiUrl}/business-types/index`,
                {},
                { headers: authHeaders() }
            );

            if (res.data?.success) {
                setBusinessTypes(res.data.data || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch business types");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error fetching business types");
        } finally {
            // setIsListing(false);
        }
    };

    const fetchListing = async (page = 1, appliedFilters: FilterState = filters) => {
        if (!config) {
            toast.error("Invalid listing type");
            setRows([]);
            return;
        }

        try {
            setLoading(true);

            const payload: any = {
                userCountFor: config.userCountFor,
                page,
            };

            if (config.tableKind === "visitor") {
                payload.industry_id = appliedFilters.industry_id || "";
                payload.expo_id = appliedFilters.expo_id || "";
                payload.visitor_category_id = appliedFilters.visitor_category_id || "";
                payload.textSearch = appliedFilters.textSearch || "";
            } else {
                payload.industry_id = appliedFilters.industry_id || "";
                payload.expo_id = appliedFilters.expo_id || "";
                payload.category_id = appliedFilters.category_id || "";
                payload.subcategory_id = appliedFilters.subcategory_id || "";
                payload.iBusinessType = appliedFilters.iBusinessType || "";
                payload.textSearch = appliedFilters.textSearch || "";
            }

            const res = await axios.post<ListingApiResponse>(
                `${apiUrl}/adminVisitorListing`,
                payload,
                {
                    headers: {
                        ...authHeaders(),
                    },
                }
            );

            const response = res.data;

            if (!response?.success) {
                toast.error(response?.message || "Failed to load listing");
                setRows([]);
                setCurrentPage(1);
                setLastPage(1);
                setTotalRecords(0);
                return;
            }

            const responseBlock = response?.data?.[config.responseKey];

            if (Array.isArray(responseBlock)) {
                setRows(responseBlock);
                setCurrentPage(1);
                setLastPage(1);
                setTotalRecords(responseBlock.length);
                setPerPage(responseBlock.length || 10);
            } else if (responseBlock && typeof responseBlock === "object") {
                const apiRows = Array.isArray(responseBlock.data) ? responseBlock.data : [];
                setRows(apiRows);
                setCurrentPage(responseBlock.current_page || page || 1);
                setLastPage(responseBlock.last_page || 1);
                setTotalRecords(responseBlock.total || 0);
                setPerPage(responseBlock.per_page || apiRows.length || 10);
            } else {
                setRows([]);
                setCurrentPage(1);
                setLastPage(1);
                setTotalRecords(0);
                setPerPage(10);
            }
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to load listing"));
            setRows([]);
            setCurrentPage(1);
            setLastPage(1);
            setTotalRecords(0);
            setPerPage(10);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchListing(1, filters);
    };

    const resetFilters = () => {
        const emptyFilters: FilterState = {
            industry_id: "",
            expo_id: "",
            visitor_category_id: "",
            category_id: "",
            subcategory_id: "",
            iBusinessType: "",
            textSearch: "",
        };

        setIsIndustryLocked(false);
        setFilters(emptyFilters);
        setExpoList([]);
        setVisitorCategories([]);
        setIndustryCategories([]);
        setSubCategories([]);
        setCurrentPage(1);
        fetchListing(1, emptyFilters);
    };

    useEffect(() => {
        fetchIndustries();
        fetchBusinessTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!filters.industry_id) {
            setExpoList([]);
            setVisitorCategories([]);
            setIndustryCategories([]);
            setSubCategories([]);
            return;
        }

        setExpoList([]);
        setVisitorCategories([]);
        setIndustryCategories([]);
        setSubCategories([]);

        setFilters((prev) => ({
            ...prev,
            expo_id: "",
            visitor_category_id: "",
            category_id: "",
            subcategory_id: "",
        }));

        fetchExpoList(filters.industry_id);
        fetchVisitorCategories(filters.industry_id);
        fetchIndustryCategories(filters.industry_id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.industry_id]);

    useEffect(() => {
        setSubCategories([]);
        setFilters((prev) => ({
            ...prev,
            subcategory_id: "",
        }));

        if (filters.category_id) {
            fetchSubCategories(filters.category_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.category_id]);

    useEffect(() => {
        const initialFilters: FilterState = {
            industry_id: selectedIndustryId || "",
            expo_id: "",
            visitor_category_id: "",
            category_id: "",
            subcategory_id: "",
            iBusinessType: "",
            textSearch: "",
        };

        setRows([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotalRecords(0);
        setPerPage(10);
        setFilters(initialFilters);
        setExpoList([]);
        setVisitorCategories([]);
        setIndustryCategories([]);
        setSubCategories([]);
        setIsIndustryLocked(!!selectedIndustryId && lockIndustryFromState);

        if (selectedIndustryId) {
            fetchExpoList(selectedIndustryId);
            fetchVisitorCategories(selectedIndustryId);
            fetchIndustryCategories(selectedIndustryId);
        }

        fetchListing(1, initialFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, selectedIndustryId, lockIndustryFromState]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return;
        fetchListing(page, filters);
    };

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(lastPage, currentPage + 2);

        if (currentPage <= 3) end = Math.min(lastPage, 5);
        if (currentPage >= lastPage - 2) start = Math.max(1, lastPage - 4);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }, [currentPage, lastPage]);

    if (!config) {
        return (
            <div className="p-6">
                <div className="rounded-xl bg-white p-6 text-center text-red-600 shadow">
                    Invalid listing type
                </div>
            </div>
        );
    }

    const toCapitalizedWords = (value: any) => {
        if (value === null || value === undefined || value === "-") return "-";

        return String(value)
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatCellValue = (key: string, value: any) => {
        const finalValue = safeValue(value);

        if (finalValue === "-") return "-";

        if (key.toLowerCase().includes("email")) {
            return String(finalValue).toLowerCase();
        }

        if (key.toLowerCase() === "gst") {
            return String(finalValue).toUpperCase();
        }

        return toCapitalizedWords(finalValue);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
                    <p className="mt-1 text-sm text-gray-500">Total Records: {totalRecords}</p>
                </div>


                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex w-fit items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
                >
                    Back
                </button>
            </div>

            <div className="rounded-xl bg-white p-4 shadow">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Industry
                        </label>
                        <select
                            value={filters.industry_id}
                            onChange={(e) => handleFilterChange("industry_id", e.target.value)}
                            disabled={isIndustryLocked}
                            className={`w-full rounded-lg border px-3 py-2 ${isIndustryLocked ? "cursor-not-allowed bg-gray-100" : ""
                                }`}
                        >
                            {!isIndustryLocked && <option value="">All Industries</option>}

                            {industries.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name || `Industry ${item.id}`}
                                </option>
                            ))}
                        </select>

                        {isIndustryLocked && selectedIndustryName ? (
                            <p className="mt-1 text-xs text-blue-600">
                                Selected Industry: {selectedIndustryName}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Expo
                        </label>
                        <select
                            value={filters.expo_id}
                            onChange={(e) => handleFilterChange("expo_id", e.target.value)}
                            disabled={!filters.industry_id || isExpoLoading}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">
                                {!filters.industry_id
                                    ? "Select Industry first"
                                    : isExpoLoading
                                        ? "Loading..."
                                        : "All Expo"}
                            </option>

                            {expoList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.exponame || item.name || item.title || `Expo ${item.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isVisitorTable && (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Visitor Category
                            </label>
                            <select
                                value={filters.visitor_category_id}
                                onChange={(e) =>
                                    handleFilterChange("visitor_category_id", e.target.value)
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            >
                                <option value="">All Visitor Categories</option>
                                {visitorCategories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.strVisitorCategory || item.name || `Category ${item.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isExhibitorTable && (
                        <>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    value={filters.category_id}
                                    onChange={(e) => handleFilterChange("category_id", e.target.value)}
                                    disabled={!filters.industry_id || isCategoryLoading}
                                    className="w-full rounded-lg border px-3 py-2"
                                >
                                    <option value="">
                                        {!filters.industry_id
                                            ? "Select Industry first"
                                            : isCategoryLoading
                                                ? "Loading..."
                                                : "All Categories"}
                                    </option>
                                    {industryCategories.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.industry_category_name || item.name || `Category ${item.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Subcategory
                                </label>
                                <select
                                    value={filters.subcategory_id}
                                    onChange={(e) => handleFilterChange("subcategory_id", e.target.value)}
                                    disabled={!filters.category_id || isSubcategoryLoading}
                                    className="w-full rounded-lg border px-3 py-2"
                                >
                                    <option value="">
                                        {!filters.category_id
                                            ? "Select Category first"
                                            : isSubcategoryLoading
                                                ? "Loading..."
                                                : "All Subcategories"}
                                    </option>
                                    {subCategories.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.industry_subcategory_name || item.name || `Subcategory ${item.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Business Type
                                </label>
                                <select
                                    value={filters.iBusinessType}
                                    onChange={(e) => handleFilterChange("iBusinessType", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2"
                                >
                                    <option value="">All Business Types</option>
                                    {businessTypes.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.strBusinessType || item.name || `Business Type ${item.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <input
                            type="text"
                            value={filters.textSearch}
                            onChange={(e) => handleFilterChange("textSearch", e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search here..."
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 transition hover:bg-gray-300"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableColumns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : displayRows.length > 0 ? (
                                displayRows.map((row: any, rowIndex) => (
                                    <tr key={rowIndex} className="border-t">
                                        {tableColumns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="px-4 py-3 align-top text-sm text-gray-700"
                                            >
                                                {formatCellValue(column.key, row[column.key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {lastPage > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 border-t p-4">
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`rounded-lg px-3 py-1.5 text-sm ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "border text-gray-700"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                            className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}