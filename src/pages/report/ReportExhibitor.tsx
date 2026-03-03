import React, { useMemo, useState } from "react";

/** ---------------- Types ---------------- */
type Contact = {
    mobile: string;
    name: string;
    designation?: string;
    email?: string;
};

export type Exhibitor = {
    id: string;
    expoId: string;
    expoName: string;

    exhibitorMobile: string;
    exhibitorName: string;
    designation?: string;
    email?: string;

    companyName: string;
    gst?: string;
    storeSizeSqMeter?: number;

    state?: string;
    city?: string;
    address?: string;

    businessType?: string;
    category?: string;
    subcategory?: string;
    industry?: string; // ✅ added

    contacts: Contact[];
    createdAt: string;
};

/** ---------------- Helpers ---------------- */
function toDateOnly(iso: string) {
    return new Date(iso).toISOString().slice(0, 10);
}

function uniqSorted(arr: (string | undefined)[]) {
    return Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) =>
        a.localeCompare(b)
    );
}

function includesText(hay: string | undefined, needle: string) {
    if (!needle.trim()) return true;
    return (hay ?? "").toLowerCase().includes(needle.toLowerCase());
}

function downloadCSV(filename: string, rows: Record<string, any>[]) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const escape = (v: any) => {
        const s = String(v ?? "");
        if (/[,"\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
        return s;
    };

    const csv = [
        headers.join(","),
        ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/** ---------------- Mock Data (replace with API) ---------------- */
const MOCK: Exhibitor[] = [
    {
        id: "EXH-1001",
        expoId: "optic-expo-2026",
        expoName: "Optic Expo 2026",
        industry: "Optical",
        exhibitorMobile: "9999999999",
        exhibitorName: "Harshita",
        designation: "Manager",
        email: "harshita@demo.com",
        companyName: "Aries Events Pvt. Ltd.",
        gst: "24ABCDE1234F1Z5",
        storeSizeSqMeter: 10.5,
        state: "Gujarat",
        city: "Ahmedabad",
        address: "Science City Road",
        businessType: "Manufacturer",
        category: "Frames",
        subcategory: "Premium",
        contacts: [{ mobile: "8888888888", name: "Ravi", designation: "Sales" }],
        createdAt: new Date().toISOString(),
    },
    {
        id: "EXH-1002",
        expoId: "optic-expo-2026",
        expoName: "Optic Expo 2026",
        industry: "Optical",
        exhibitorMobile: "9898989898",
        exhibitorName: "Amit",
        companyName: "Vision Traders",
        gst: "",
        storeSizeSqMeter: 8,
        state: "Maharashtra",
        city: "Mumbai",
        businessType: "Distributor",
        category: "Lenses",
        subcategory: "Single Vision",
        contacts: [],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
];

/** ---------------- UI ---------------- */
export default function VisitorReportTailwind() {
    // ✅ Filters
    const [industry, setIndustry] = useState("");
    const [expoId, setExpoId] = useState("optic-expo-2026");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [search, setSearch] = useState("");

    const rows = MOCK;

    // ✅ Dropdown pools based on expo (and industry if needed)
    const optionPool = useMemo(() => {
        const base = rows.filter((r) => (expoId ? r.expoId === expoId : true));
        return {
            industries: uniqSorted(base.map((r) => r.industry)),
            categories: uniqSorted(
                base
                    .filter((r) => (industry ? r.industry === industry : true))
                    .map((r) => r.category)
            ),
            subcategories: uniqSorted(
                base
                    .filter((r) => (industry ? r.industry === industry : true))
                    .filter((r) => (category ? r.category === category : true))
                    .map((r) => r.subcategory)
            ),
        };
    }, [rows, expoId, industry, category]);

    const expoOptions = useMemo(
        () =>
            uniqSorted(rows.map((r) => r.expoId)).map((id) => ({
                id,
                name: rows.find((r) => r.expoId === id)?.expoName ?? id,
            })),
        [rows]
    );

    // ✅ Filtering
    const filtered = useMemo(() => {
        return rows
            .filter((r) => (expoId ? r.expoId === expoId : true))
            .filter((r) => (industry ? r.industry === industry : true))
            .filter((r) => (category ? r.category === category : true))
            .filter((r) => (subcategory ? r.subcategory === subcategory : true))
            .filter((r) => {
                if (!search.trim()) return true;
                return (
                    includesText(r.exhibitorName, search) ||
                    includesText(r.exhibitorMobile, search) ||
                    includesText(r.companyName, search) ||
                    includesText(r.gst, search) ||
                    includesText(r.email, search) ||
                    includesText(r.state, search) ||
                    includesText(r.city, search) ||
                    includesText(r.category, search) ||
                    includesText(r.subcategory, search)
                );
            });
    }, [rows, expoId, industry, category, subcategory, search]);

    const exportRows = useMemo(() => {
        return filtered.map((r) => ({
            id: r.id,
            expo: r.expoName,
            industry: r.industry ?? "",
            category: r.category ?? "",
            subcategory: r.subcategory ?? "",
            exhibitorName: r.exhibitorName,
            exhibitorMobile: r.exhibitorMobile,
            email: r.email ?? "",
            companyName: r.companyName,
            gst: r.gst ?? "",
            state: r.state ?? "",
            city: r.city ?? "",
            address: r.address ?? "",
            createdAt: r.createdAt,
        }));
    }, [filtered]);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h1 className="text-2xl font-extrabold text-slate-800">
                            Visitor Report
                        </h1>
                    </div>

                    <div className="p-6">
                        {/* ✅ Filters row (Industry / Expo / Category / Subcategory) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FieldTW label="Industry">
                                <select
                                    className="inputTW"
                                    value={industry}
                                    onChange={(e) => {
                                        setIndustry(e.target.value);
                                        setCategory("");
                                        setSubcategory("");
                                    }}
                                >
                                    <option value="">Select Industry</option>
                                    {optionPool.industries.map((i) => (
                                        <option key={i} value={i}>
                                            {i}
                                        </option>
                                    ))}
                                </select>
                            </FieldTW>

                            <FieldTW label="Expo">
                                <select
                                    className="inputTW"
                                    value={expoId}
                                    onChange={(e) => {
                                        setExpoId(e.target.value);
                                        setIndustry("");
                                        setCategory("");
                                        setSubcategory("");
                                    }}
                                >
                                    <option value="">Select Expo</option>
                                    {expoOptions.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.name}
                                        </option>
                                    ))}
                                </select>
                            </FieldTW>

                            <FieldTW label="Category">
                                <select
                                    className="inputTW"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setSubcategory("");
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    {optionPool.categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </FieldTW>

                            <FieldTW label="Subcategory">
                                <select
                                    className="inputTW"
                                    value={subcategory}
                                    onChange={(e) => setSubcategory(e.target.value)}
                                >
                                    <option value="">All Subcategories</option>
                                    {optionPool.subcategories.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </FieldTW>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                            <input
                                className="inputTW sm:max-w-xs"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <button className="h-10 rounded-xl bg-blue-700 text-white px-4 font-bold shadow-sm">
                                Count: {filtered.length}
                            </button>

                            <button className="h-10 rounded-xl bg-blue-700/90 hover:bg-blue-700 text-white px-6 font-bold shadow-sm">
                                Search
                            </button>

                            <button
                                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold shadow-sm"
                                onClick={() =>
                                    downloadCSV(`visitor_report_${expoId || "all"}.csv`, exportRows)
                                }
                            >
                                Export Excel
                            </button>
                        </div>

                        {/* Table */}
                        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-[1100px] w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-slate-600">
                                            <ThTW>No</ThTW>
                                            <ThTW>Name</ThTW>
                                            <ThTW>Mobile</ThTW>
                                            <ThTW>Email</ThTW>
                                            <ThTW>Company</ThTW>
                                            <ThTW>Address</ThTW>
                                            <ThTW>State</ThTW>
                                            <ThTW>City</ThTW>
                                            <ThTW>Category</ThTW>
                                            <ThTW>Entry Date</ThTW>
                                            <ThTW>Entry By</ThTW>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white">
                                        {filtered.map((r, idx) => (
                                            <tr
                                                key={r.id}
                                                className="border-t border-slate-100 hover:bg-slate-50/60"
                                            >
                                                <TdTW>{idx + 1}</TdTW>
                                                <TdTW className="font-bold text-slate-800">
                                                    {r.exhibitorName}
                                                </TdTW>
                                                <TdTW>{r.exhibitorMobile}</TdTW>
                                                <TdTW>{r.email ?? "-"}</TdTW>
                                                <TdTW>{r.companyName}</TdTW>
                                                <TdTW className="max-w-[260px] truncate">
                                                    {r.address ?? "-"}
                                                </TdTW>
                                                <TdTW>{r.state ?? "-"}</TdTW>
                                                <TdTW>{r.city ?? "-"}</TdTW>
                                                <TdTW>
                                                    {(r.category ?? "-") + (r.subcategory ? ` / ${r.subcategory}` : "")}
                                                </TdTW>
                                                <TdTW>{toDateOnly(r.createdAt)}</TdTW>
                                                <TdTW>-</TdTW>
                                            </tr>
                                        ))}

                                        {filtered.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={11}
                                                    className="py-10 text-center text-slate-500 font-semibold"
                                                >
                                                    No data found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
                                <div className="text-sm text-slate-600 font-semibold">
                                    Page 1 of 1
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="h-9 px-4 rounded-lg border border-slate-200 text-slate-500 font-semibold bg-white"
                                        disabled
                                    >
                                        Prev
                                    </button>
                                    <button
                                        className="h-9 px-4 rounded-lg border border-slate-200 text-slate-500 font-semibold bg-white"
                                        disabled
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                        <style>{`
              .inputTW {
                width: 100%;
                height: 44px;
                border-radius: 12px;
                border: 1px solid rgb(226 232 240);
                padding: 0 12px;
                outline: none;
                background: #fff;
                color: rgb(15 23 42);
              }
              .inputTW:focus {
                border-color: rgb(59 130 246);
                box-shadow: 0 0 0 3px rgba(59,130,246,.15);
              }
            `}</style>
                    </div>
                </div>

                <div className="mt-10 text-center text-sm text-slate-500">
                    © 2026 Aries Expo — All Rights Reserved.
                </div>
            </div>
        </div>
    );
}

/** ---------------- Small Components ---------------- */
function FieldTW({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="text-xs font-bold text-slate-600 mb-2">{label}</div>
            {children}
        </div>
    );
}

function ThTW({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wide whitespace-nowrap">
            {children}
        </th>
    );
}

function TdTW({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <td className={`px-4 py-3 text-slate-700 whitespace-nowrap ${className}`}>
            {children}
        </td>
    );
}