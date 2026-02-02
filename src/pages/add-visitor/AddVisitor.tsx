import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config";

type StateItem = { stateId: number; stateName: string };
type CityItem = { id: number; name: string; stateid?: number };
type VisitorCategoryItem = { id: number; name: string };

function getApiErrorMessage(data: any, fallback = "Something went wrong") {
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

function safeJsonParse<T = any>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function AddVisitor() {
  const { slug } = useParams<{ slug: string }>();
  const userId = String(localStorage.getItem("User_Id") || "");
  const adminUser = safeJsonParse<{ id?: number; name?: string }>(
    localStorage.getItem("user")
  );
  const username = String(adminUser?.name);
  const [expo_name, setExpo_Name] = useState<string>("");
  const [todayCount, setTodayCount] = useState<number>(0);

  const [mobile, setMobile] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [stateId, setStateId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");

  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [address, setAddress] = useState("");
  const [loadingInit, setLoadingInit] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [saving, setSaving] = useState(false);

  const [loadingCount, setLoadingCount] = useState(false);
  const [lastFetchedMobile, setLastFetchedMobile] = useState<string>("");

  const [mobileExists, setMobileExists] = useState(false);

  const mobileRef = useRef<HTMLInputElement | null>(null);
  const companyRef = useRef<HTMLInputElement | null>(null);
  const [visitorCategories, setVisitorCategories] = useState<VisitorCategoryItem[]>([]);
  const [visitorCategoryId, setVisitorCategoryId] = useState<string>("0");
  const [loadingVisitorCategory, setLoadingVisitorCategory] = useState(false);

  const focusMobile = () => requestAnimationFrame(() => mobileRef.current?.focus());
  const focusCompany = () => requestAnimationFrame(() => companyRef.current?.focus());

  const clearVisitorFields = () => {
    setCompanyName("");
    setName("");
    setEmail("");
    setAddress("");
    setStateId("");
    setCityId("");
    setCities([]);
    setVisitorCategoryId("0");
  };

  const fetchTodayVisitorCount = async () => {
    if (!userId) return;
    try {
      setLoadingCount(true);
      const res = await axios.post(`${apiUrl}/Expowise/count`, {
        user_id: String(userId),
        expo_slugname: String(slug),
      });

      if (res.data?.success) {
        const today = Number(res.data?.todayVisitors ?? 0);
        setTodayCount(today);
      } else {
        toast.error(res.data || "Visitor count fetch failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data || "Visitor count fetch failed");
    } finally {
      setLoadingCount(false);
    }
  };

  const fetchAllStates = async (): Promise<StateItem[]> => {
    const all: StateItem[] = [];
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage) {
      const res = await axios.post(`${apiUrl}/statelist`, { page: String(page), expo_slugname: slug });
      if (!res.data?.success) throw new Error(getApiErrorMessage(res.data, "State fetch failed"));
      setExpo_Name(res?.data?.expo_name)
      const data: StateItem[] = (res.data?.data || []).map((s: any) => ({
        stateId: Number(s.stateId),
        stateName: String(s.stateName),
      }));

      all.push(...data);
      lastPage = Number(res.data?.last_page || 1);
      page += 1;
    }

    const map = new Map<number, StateItem>();
    all.forEach((x) => map.set(x.stateId, x));
    return Array.from(map.values()).sort((a, b) => a.stateName.localeCompare(b.stateName));
  };

  const fetchCitiesByState = async (sid: string, keepCityId?: string) => {
    if (!sid) {
      setCities([]);
      setCityId("");
      return;
    }

    try {
      setLoadingCity(true);
      const res = await axios.post(`${apiUrl}/CityByState`, { stateid: String(sid) });

      if (res.data?.success) {
        const list: CityItem[] = (res.data?.data || []).map((c: any) => ({
          id: Number(c.id),
          name: String(c.name),
          stateid: Number(c.stateid),
        }));

        setCities(list);

        if (keepCityId) {
          const exists = list.some((x) => String(x.id) === String(keepCityId));
          setCityId(exists ? String(keepCityId) : "");
        } else {
          setCityId("");
        }
      } else {
        setCities([]);
        setCityId("");
        toast.error(res.data || "City fetch failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data || "City fetch failed");
      setCities([]);
      setCityId("");
    } finally {
      setLoadingCity(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!userId) toast.error("User not logged in (User_Id missing)");
      if (!slug) toast.error("Expo slug missing");

      try {
        setLoadingInit(true);
        const stateList = await fetchAllStates();
        setStates(stateList);
        await fetchTodayVisitorCount();
        await fetchVisitorCategories();
        focusMobile();
      } catch (err: any) {
        toast.error(err?.message || "Init failed");
        setStates([]);
      } finally {
        setLoadingInit(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVisitorByMobile = async (m: string) => {
    if (!/^\d{10}$/.test(m)) return;
    if (m === lastFetchedMobile) {
      focusCompany();
      return;
    }

    try {
      setLoadingMobile(true);

      const res = await axios.post(`${apiUrl}/visitor/by-mobile`, {
        mobileno: String(m),
        expo_slugname: String(slug),
        userid: String(userId),
      });

      if (res.data?.success && res.data?.data) {
        const v = res.data.data;

        setCompanyName(String(v.companyname ?? ""));
        setName(String(v.name ?? ""));
        setEmail(String(v.email ?? ""));
        setAddress(String(v.address ?? ""));


        const sid = v.stateid != null ? String(v.stateid) : "";
        const cid = v.cityid != null ? String(v.cityid) : "";

        setStateId(sid);
        await fetchCitiesByState(sid, cid);

        setMobileExists(true);
        setLastFetchedMobile(m);
        // ✅ optional: set category if backend returns it
        const catId =
          v.visitor_category_id != null
            ? String(v.visitor_category_id)
            : v.visitorCategoryId != null
              ? String(v.visitorCategoryId)
              : "0";

        setVisitorCategoryId(catId);

      } else {
        clearVisitorFields();
        setMobileExists(false);
        if (res.data?.message) toast.info(String(res.data.message));
        setLastFetchedMobile(m);
      }
    } catch (err: any) {
      clearVisitorFields();
      setMobileExists(false);
      setLastFetchedMobile(m);
      toast.error(err?.response?.data || "Mobile lookup failed");
    } finally {
      setLoadingMobile(false);
      focusCompany();
    }
  };
  const fetchVisitorCategories = async () => {
    try {
      setLoadingVisitorCategory(true);

      const res = await axios.post(
        `https://rsw-laravel.ariesevents.in/api/visitor-category/index`,
        {}
      );

      if (res.data?.status) {
        const list: VisitorCategoryItem[] = (res.data?.data || []).map((x: any) => ({
          id: Number(x.id),
          name: String(x.strVisitorCategory ?? ""),
        }));

        setVisitorCategories(list);
      } else {
        toast.error(res.data?.message || "Visitor category fetch failed");
        setVisitorCategories([]);
      }
    } catch (err: any) {
      toast.error(err?.response?.data || "Visitor category fetch failed");
      setVisitorCategories([]);
    } finally {
      setLoadingVisitorCategory(false);
    }
  };

  // ✅ CHANGE HERE: Save button API changes by mobileExists
  const handleSave = async () => {
    if (!/^\d{10}$/.test(mobile)) return toast.error("Please Enter Mobile mobile");

    try {
      setSaving(true);

      const payload = {
        mobileno: mobile,
        companyname: companyName,
        name,
        email,
        stateid: String(stateId),
        cityid: String(cityId),
        expo_slugname: String(slug),
        username: String(username),
        userid: String(userId),
        address: address,
        visitor_category_id: Number(visitorCategoryId || "0"),
      };

      // ✅ if exists → call by-mobile (your update flow), else → call Add
      const endpoint = mobileExists ? `${apiUrl}/visitor/by-mobile` : `${apiUrl}/Visitor/Add`;

      const res = await axios.post(endpoint, payload);

      if (res.data?.success) {
        toast.success(
          res.data?.message || (mobileExists ? "Visitor Updated" : "Visitor Added")
        );

        await fetchTodayVisitorCount();

        setMobile("");
        clearVisitorFields();
        setLastFetchedMobile("");
        setMobileExists(false);
        focusMobile();
      } else {
        toast.error(getApiErrorMessage(res.data, "Visitor save failed"));
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err?.response?.data, "Visitor save failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{expo_name}</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Today Visitors </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold">
            <span className="font-semibold">{loadingCount ? "--" : todayCount}</span>
          </span>
        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Visitor</h2>

        {loadingInit ? (
          <div className="flex items-center gap-3 text-gray-600 py-6">
            <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            Loading states...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number <span className="text-red-600">*</span></label>

                <div className="relative">
                  <input
                    ref={mobileRef}
                    type="text"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d*$/.test(v)) setMobile(v);

                      if (v.length < 10) {
                        setLastFetchedMobile("");
                        setMobileExists(false);
                        clearVisitorFields();
                      }
                    }}
                    onBlur={() => fetchVisitorByMobile(mobile)}
                    placeholder="Enter mobile number"
                    className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-300"
                    required
                  />

                  {loadingMobile && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" />
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Enter 10 digits and press Tab to auto-fill details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  ref={companyRef}
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                  disabled={loadingMobile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                  disabled={loadingMobile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                  disabled={loadingMobile}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  value={stateId}
                  onChange={async (e) => {
                    const sid = e.target.value;
                    setStateId(sid);
                    setCityId("");
                    await fetchCitiesByState(sid);
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                  disabled={loadingMobile}
                >
                  <option value="">Select State</option>
                  {states.map((st) => (
                    <option key={st.stateId} value={String(st.stateId)}>
                      {st.stateName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>

                <div className="relative">
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-300"
                    disabled={!stateId || loadingMobile || loadingCity}
                  >
                    <option value="">{loadingCity ? "Loading cities..." : "Select City"}</option>

                    {cities.map((ct) => (
                      <option key={ct.id} value={String(ct.id)}>
                        {ct.name}
                      </option>
                    ))}
                  </select>

                  {loadingCity && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 resize-none"
                  disabled={loadingMobile}
                  placeholder="Enter address"
                />
              </div>

              {/* Address */}

            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Visitor Category
                </label>

                <div className="relative">
                  <select
                    value={visitorCategoryId}
                    onChange={(e) => setVisitorCategoryId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-300"
                    disabled={loadingMobile || loadingVisitorCategory}
                  >
                    <option value="0">
                      {loadingVisitorCategory ? "Loading categories..." : "Select Category"}
                    </option>

                    {visitorCategories.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {loadingVisitorCategory && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 text-end">
              <button
                onClick={handleSave}
                disabled={saving || loadingMobile || loadingCity}
                className="bg-[#2e56a6] disabled:opacity-60 text-white px-6 py-2 rounded-lg shadow inline-flex items-center gap-2"
              >
                {(saving || loadingMobile || loadingCity) && (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
