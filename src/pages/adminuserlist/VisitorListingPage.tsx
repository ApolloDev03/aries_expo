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

//     gst?: string;
//     state_id?: number;
//     city_id?: number;
//     address?: string;
//     industry_id?: number;
//     category_id?: number;
//     subcategory_id?: number;
//     iBusinessType?: number;
//     primary_contact_mobile?: string | null;
//     primary_contact_name?: string | null;
//     primary_contact_designation?: string | null;
//     primary_contact_email?: string | null;
//     created_at?: string;
//     updated_at?: string;
//     other_contacts?: OtherContact[];

//     name?: string;
//     mobile?: string;
//     mobileno?: string;
//     email?: string;
//     designation?: string;
//     enter_by?: string;
//     expo_id?: number;

//     city?: {
//         id?: number;
//         name?: string;
//         stateid?: number;
//     };

//     state?: {
//         id?: number;
//         name?: string;
//         stateName?: string;
//     };

//     business_type?:
//     | string
//     | {
//         id?: number;
//         strBusinessType?: string;
//     };

//     visitor_category?:
//     | string
//     | {
//         id?: number;
//         strVisitorCategory?: string;
//     };

//     industry?: {
//         id?: number;
//         name?: string;
//     };

//     industry_category?:
//     | string
//     | {
//         id?: number;
//         industry_category_name?: string;
//     };

//     industry_subcategory?:
//     | string
//     | {
//         id?: number;
//         industry_subcategory_name?: string;
//     };

//     user?: {
//         id?: number;
//         name?: string;
//         mobile?: string;
//         email?: string;
//         address?: string;
//         depart_id?: number;
//     };

//     expo_details?: any[];
//     state_name?: string;
//     city_name?: string;
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

// function getBusinessType(item: ListingItem) {
//     if (typeof item.business_type === "string") return item.business_type;
//     if (item.business_type?.strBusinessType) return item.business_type.strBusinessType;
//     return item.iBusinessType ?? "-";
// }

// function getStateName(item: ListingItem) {
//     return item.state?.stateName || item.state?.name || item.state_name || "-";
// }

// function getCityName(item: ListingItem) {
//     return item.city?.name || item.city_name || "-";
// }

// function getCategoryName(item: ListingItem) {
//     if (typeof item.industry_category === "string") return item.industry_category;
//     if (item.industry_category?.industry_category_name) {
//         return item.industry_category.industry_category_name;
//     }
//     return "-";
// }

// function getSubcategoryName(item: ListingItem) {
//     if (typeof item.industry_subcategory === "string") return item.industry_subcategory;
//     if (item.industry_subcategory?.industry_subcategory_name) {
//         return item.industry_subcategory.industry_subcategory_name;
//     }
//     return "-";
// }

// function getEnteredBy(item: ListingItem) {
//     return item.user?.name || item.enter_by || "-";
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
// function displayValue(value: any) {
//     if (value === null || value === undefined) return "-";
//     if (typeof value === "string" && value.trim() === "") return "-";
//     return value;
// }

// function safeValue(value: any) {
//     const finalValue = displayValue(value);
//     return finalValue === "-" ? "-" : String(finalValue);
// }
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
//     const [rows, setRows] = useState<ListingItem[]>([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [lastPage, setLastPage] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [perPage, setPerPage] = useState(10);

//     const config = useMemo(() => {
//         return routeMap[type || ""] || null;
//     }, [type]);

//     const tableColumns = useMemo(() => {
//         return config ? TABLE_COLUMNS[config.tableKind] : [];
//     }, [config]);

//     const displayRows = useMemo(() => {
//         if (!config) return [];
//         return normalizeRows(rows, config.tableKind, currentPage, perPage);
//     }, [rows, config, currentPage, perPage]);

//     const fetchListing = async (page = 1) => {
//         if (!config) {
//             toast.error("Invalid listing type");
//             setRows([]);
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post<ListingApiResponse>(
//                 `${apiUrl}/adminVisitorListing`,
//                 {
//                     userCountFor: config.userCountFor,
//                     page,
//                 },
//                 {
//                     headers: {
//                         ...authHeaders(),
//                     },
//                 }
//             );

//             const payload = res.data;

//             if (!payload?.success) {
//                 toast.error(payload?.message || "Failed to load listing");
//                 setRows([]);
//                 setCurrentPage(1);
//                 setLastPage(1);
//                 setTotalRecords(0);
//                 return;
//             }

//             const responseBlock = payload?.data?.[config.responseKey];

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
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         setRows([]);
//         setCurrentPage(1);
//         setLastPage(1);
//         setTotalRecords(0);
//         fetchListing(1);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [type]);

//     const handlePageChange = (page: number) => {
//         if (page < 1 || page > lastPage || page === currentPage) return;
//         fetchListing(page);
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
//                                             <span>Loading...</span>
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
//                                                 {safeValue(row[col.key])}
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
//                                 onClick={() => handlePageChange(1)}
//                                 disabled={currentPage === 1}
//                                 className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
//                             >
//                                 First
//                             </button>

//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
//                             >
//                                 Prev
//                             </button>

//                             {pageNumbers.map((page) => (
//                                 <button
//                                     key={page}
//                                     onClick={() => handlePageChange(page)}
//                                     className={`rounded-lg border px-3 py-2 ${currentPage === page
//                                         ? "border-blue-600 bg-blue-600 text-white"
//                                         : "bg-white text-gray-700"
//                                         }`}
//                                 >
//                                     {page}
//                                 </button>
//                             ))}

//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === lastPage}
//                                 className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
//                             >
//                                 Next
//                             </button>

//                             <button
//                                 onClick={() => handlePageChange(lastPage)}
//                                 disabled={currentPage === lastPage}
//                                 className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
//                             >
//                                 Last
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
import { Link, useParams } from "react-router-dom";
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

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ListingItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const config = useMemo(() => {
        return routeMap[type || ""] || null;
    }, [type]);

    const tableColumns = useMemo(() => {
        return config ? TABLE_COLUMNS[config.tableKind] : [];
    }, [config]);

    const displayRows = useMemo(() => {
        if (!config) return [];
        return normalizeRows(rows, config.tableKind, currentPage, perPage);
    }, [rows, config, currentPage, perPage]);

    const fetchListing = async (page = 1) => {
        if (!config) {
            toast.error("Invalid listing type");
            setRows([]);
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post<ListingApiResponse>(
                `${apiUrl}/adminVisitorListing`,
                {
                    userCountFor: config.userCountFor,
                    page,
                },
                {
                    headers: {
                        ...authHeaders(),
                    },
                }
            );

            const payload = res.data;

            if (!payload?.success) {
                toast.error(payload?.message || "Failed to load listing");
                setRows([]);
                setCurrentPage(1);
                setLastPage(1);
                setTotalRecords(0);
                return;
            }

            const responseBlock = payload?.data?.[config.responseKey];

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

    useEffect(() => {
        setRows([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotalRecords(0);
        setPerPage(10);
        fetchListing(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return;
        fetchListing(page);
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

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
                    <p className="mt-1 text-sm text-gray-500">Total Records: {totalRecords}</p>
                </div>

                <Link
                    to="/admin"
                    className="inline-flex w-fit items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
                >
                    Back
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-[1400px] w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                {tableColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="whitespace-nowrap p-3 text-left font-semibold"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={tableColumns.length} className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-3 text-gray-500">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />

                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && displayRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="p-8 text-center text-gray-500"
                                    >
                                        No records found
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                displayRows.map((row: Record<string, any>, rowIndex: number) => (
                                    <tr
                                        key={`${row.id || row.sr_no || rowIndex}`}
                                        className="border-b align-top hover:bg-gray-50"
                                    >
                                        {tableColumns.map((col) => (
                                            <td key={col.key} className="whitespace-nowrap p-3">
                                                {safeValue(row[col.key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {!loading && totalRecords > 0 && (
                    <div className="flex flex-col gap-4 border-t bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {lastPage} | Showing {rows.length} records
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
                            >
                                First
                            </button>

                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {pageNumbers.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`rounded-lg border px-3 py-2 ${currentPage === page
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "bg-white text-gray-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
                            >
                                Next
                            </button>

                            <button
                                onClick={() => handlePageChange(lastPage)}
                                disabled={currentPage === lastPage}
                                className="rounded-lg border bg-white px-3 py-2 disabled:opacity-50"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}