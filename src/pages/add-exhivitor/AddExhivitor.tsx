import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { apiUrl } from "../../config";

/** ---------- helpers ---------- */
function safeJsonParse<T = any>(value: string | null): T | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

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

/** ---------- static data (no API) ---------- */
const INDIAN_STATES = [
    "Gujarat",
    "Maharashtra",
    "Rajasthan",
    "Madhya Pradesh",
    "Delhi",
    "Uttar Pradesh",
    "Bihar",
    "Punjab",
    "Haryana",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "West Bengal",
    "Kerala",
    "Odisha",
    "Assam",
    "Chhattisgarh",
    "Jharkhand",
    "Uttarakhand",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Goa",
    "Andhra Pradesh",
];

const INDUSTRIES = ["Optical", "Pharma", "IT", "Manufacturing", "Education", "Other"];

const CATEGORY_BY_INDUSTRY: Record<string, string[]> = {
    Optical: ["Frames", "Lenses", "Machines", "Accessories", "Other"],
    Pharma: ["Medicine", "Equipment", "Raw Material", "Other"],
    IT: ["Software", "Hardware", "Services", "Other"],
    Manufacturing: ["Machinery", "Tools", "Components", "Other"],
    Education: ["Courses", "Books", "Services", "Other"],
    Other: ["Other"],
};

const SUBCATEGORY_BY_CATEGORY: Record<string, string[]> = {
    Frames: ["Metal", "Plastic", "Kids", "Premium", "Other"],
    Lenses: ["Single Vision", "Bifocal", "Progressive", "Blue Cut", "Other"],
    Machines: ["Edger", "Lensometer", "Autorefractor", "Other"],
    Accessories: ["Cases", "Cloths", "Solutions", "Other"],

    Medicine: ["OTC", "Prescription", "Supplements", "Other"],
    Equipment: ["Diagnostic", "Surgical", "Hospital", "Other"],
    "Raw Material": ["Chemicals", "Packaging", "Other"],

    Software: ["CRM", "ERP", "Mobile App", "Web App", "Other"],
    Hardware: ["Laptop", "Desktop", "POS", "Other"],
    Services: ["Consulting", "Development", "Support", "Other"],

    Machinery: ["CNC", "Injection", "Automation", "Other"],
    Tools: ["Hand Tools", "Power Tools", "Other"],
    Components: ["Electrical", "Mechanical", "Other"],

    Courses: ["Online", "Offline", "Corporate", "Other"],
    Books: ["Academic", "Competitive", "Other"],

    Other: ["Other"],
};

/** ---------- types ---------- */
type ContactRow = {
    id: string;
    mobile: string;
    name: string;
    designation: string;
    email: string;
};

export default function AddExhivitor() {
    const location = useLocation();
    const { slug } = useParams<{ slug: string }>();
    const expoName = location.state?.expo_name || "Expo";

    const userId = String(localStorage.getItem("User_Id") || "");
    const adminUser = safeJsonParse<{ id?: number; name?: string }>(localStorage.getItem("user"));
    const username = String(adminUser?.name || "");

    /** ---------- company info ---------- */
    const [companyName, setCompanyName] = useState("");
    const [gst, setGst] = useState("");
    const [stateName, setStateName] = useState("");
    const [cityName, setCityName] = useState("");
    const [address, setAddress] = useState("");

    const [industry, setIndustry] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    /** ---------- contacts (multiple cards) ---------- */
    const [contacts, setContacts] = useState<ContactRow[]>([
        { id: newId(), mobile: "", name: "", designation: "", email: "" },
    ]);

    const [saving, setSaving] = useState(false);

    const categoryOptions = useMemo(() => {
        return CATEGORY_BY_INDUSTRY[industry] || [];
    }, [industry]);

    const subcategoryOptions = useMemo(() => {
        return SUBCATEGORY_BY_CATEGORY[category] || [];
    }, [category]);

    const addContactCard = () => {
        setContacts((prev) => [
            ...prev,
            { id: newId(), mobile: "", name: "", designation: "", email: "" },
        ]);
    };

    const removeContactCard = (id: string) => {
        setContacts((prev) => prev.filter((x) => x.id !== id));
    };

    const updateContact = (id: string, patch: Partial<ContactRow>) => {
        setContacts((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    };

    /** ---------- validations ---------- */
    const validateBeforeSave = () => {
        if (!userId) return toast.error("User not logged in (User_Id missing)"), false;
        if (!slug) return toast.error("Expo slug missing"), false;

        if (!companyName.trim()) return toast.error("Company Name is required"), false;
        if (!stateName.trim()) return toast.error("State is required"), false;
        if (!cityName.trim()) return toast.error("City is required"), false;
        if (!address.trim()) return toast.error("Address is required"), false;
        if (!industry) return toast.error("Industry is required"), false;
        if (!category) return toast.error("Category is required"), false;
        if (!subcategory) return toast.error("Subcategory is required"), false;

        for (let i = 0; i < contacts.length; i++) {
            const c = contacts[i];
            const label = `Contact #${i + 1}`;

            if (!isValidMobile(c.mobile)) return toast.error(`${label}: Mobile must be 10 digits`), false;
            if (!c.name.trim()) return toast.error(`${label}: Name is required`), false;
            if (!c.designation.trim()) return toast.error(`${label}: Designation is required`), false;
            if (!isValidEmail(c.email)) return toast.error(`${label}: Email is invalid`), false;
        }

        return true;
    };

    /** ---------- save ---------- */
    const handleSave = async () => {
        if (!validateBeforeSave()) return;

        try {
            setSaving(true);

            // ✅ One payload: company info + contacts[]
            const payload = {
                expo_slugname: String(slug),
                userid: String(userId),
                username: String(username),

                company: {
                    companyname: companyName,
                    gst,
                    state: stateName,
                    city: cityName,
                    address,
                    industry,
                    category,
                    subcategory,
                },

                contacts: contacts.map((c) => ({
                    mobileno: c.mobile,
                    name: c.name,
                    designation: c.designation,
                    email: c.email,
                })),
            };

            // 🔁 Change this endpoint as per your backend API
            const endpoint = `${apiUrl}/Exhibitor/Add`;

            const res = await axios.post(endpoint, payload);

            if (res.data?.success) {
                toast.success(res.data?.message || "Exhibitor saved successfully");

                // reset
                setCompanyName("");
                setGst("");
                setStateName("");
                setCityName("");
                setAddress("");
                setIndustry("");
                setCategory("");
                setSubcategory("");
                setContacts([{ id: newId(), mobile: "", name: "", designation: "", email: "" }]);
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
                <h1 className="text-2xl font-bold text-gray-800">{expoName}</h1>
            </div>

            {/* Company Information */}
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
                            placeholder="Enter GST "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            State 
                        </label>
                        <select
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                        >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            City
                        </label>
                        <input
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 resize-none"
                            placeholder="Enter address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Industry 
                        </label>
                        <select
                            value={industry}
                            onChange={(e) => {
                                setIndustry(e.target.value);
                                setCategory("");
                                setSubcategory("");
                            }}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                        >
                            <option value="">Select Industry</option>
                            {INDUSTRIES.map((x) => (
                                <option key={x} value={x}>
                                    {x}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category 
                        </label>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setSubcategory("");
                            }}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={!industry}
                        >
                            <option value="">{industry ? "Select Category" : "Select Industry first"}</option>
                            {categoryOptions.map((x) => (
                                <option key={x} value={x}>
                                    {x}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Subcategory 
                        </label>
                        <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            disabled={!category}
                        >
                            <option value="">{category ? "Select Subcategory" : "Select Category first"}</option>
                            {subcategoryOptions.map((x) => (
                                <option key={x} value={x}>
                                    {x}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Exhibitor Contacts */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Exhibitor Contacts</h2>

                    {/* + button */}
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
                                <div className="font-semibold text-gray-700">
                                    Contact {index + 1}
                                </div>

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
                                    <label className="block text-sm font-medium mb-1">
                                        Mobile <span className="text-red-600">*</span>
                                    </label>
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
                                    <label className="block text-sm font-medium mb-1">
                                        Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={c.name}
                                        onChange={(e) => updateContact(c.id, { name: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Designation 
                                    </label>
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
                        </div>
                    ))}
                </div>

                {/* Save */}
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
