import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../config";

type StateItem = { stateId: number; stateName: string };
type CityItem = { id: number; name: string; stateid?: number };

export default function AddVisitor() {
  const location = useLocation();

  const expoName = location.state?.expo_name || "Expo";
  const expoId = String(location.state?.expoid || location.state?.assign_id || "");
  const userId = localStorage.getItem("User_Id") || "";

  const [todayCount, setTodayCount] = useState<number>(0);

  const [mobile, setMobile] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [stateId, setStateId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");

  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);

  const [loadingInit, setLoadingInit] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [saving, setSaving] = useState(false);

  // prevent repeated calls for same number
  const [lastFetchedMobile, setLastFetchedMobile] = useState<string>("");

  // ---------------- Fetch ALL States (pagination) ----------------
  const fetchAllStates = async (): Promise<StateItem[]> => {
    const all: StateItem[] = [];
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage) {
      const res = await axios.post(`${apiUrl}/statelist`, { page: String(page) });
      if (!res.data?.success) throw new Error(res.data?.message || "State fetch failed");

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

  // ---------------- Fetch Cities By State ----------------
  const fetchCitiesByState = async (sid: string, keepCityId?: string) => {
    if (!sid) {
      setCities([]);
      setCityId("");
      return;
    }

    try {
      setLoadingCity(true);

      const res = await axios.post(`${apiUrl}/CityByState`, {
        stateid: String(sid),
      });

      if (res.data?.success) {
        const list: CityItem[] = (res.data?.data || []).map((c: any) => ({
          id: Number(c.id),
          name: String(c.name),
          stateid: Number(c.stateid),
        }));

        setCities(list);

        // if mobile lookup gave cityId, select it after list loaded
        if (keepCityId) {
          const exists = list.some((x) => String(x.id) === String(keepCityId));
          setCityId(exists ? String(keepCityId) : "");
        } else {
          setCityId("");
        }
      } else {
        setCities([]);
        setCityId("");
        toast.error(res.data?.message || "City fetch failed");
      }
    } catch (err: any) {
      console.error(err);
      setCities([]);
      setCityId("");
      toast.error(err?.response?.data?.message || "City fetch failed");
    } finally {
      setLoadingCity(false);
    }
  };

  // ---------------- Init ----------------
  useEffect(() => {
    const init = async () => {
      if (!userId) toast.error("User not logged in (User_Id missing)");
      if (!expoId) toast.error("Expo id missing");

      try {
        setLoadingInit(true);
        const stateList = await fetchAllStates();
        setStates(stateList);
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "State fetch failed");
        setStates([]);
      } finally {
        setLoadingInit(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Mobile Lookup (onBlur) ----------------
  const fetchVisitorByMobile = async (m: string) => {
    if (!/^\d{10}$/.test(m)) return;
    if (m === lastFetchedMobile) return;

    try {
      setLoadingMobile(true);

      const res = await axios.post(`${apiUrl}/visitor/by-mobile`, {
        mobileno: String(m),
      });

      if (res.data?.success && res.data?.data) {
        const v = res.data.data;

        setCompanyName(String(v.companyname ?? ""));
        setName(String(v.name ?? ""));
        setEmail(String(v.email ?? ""));

        const sid = v.stateid !== null && v.stateid !== undefined ? String(v.stateid) : "";
        const cid = v.cityid !== null && v.cityid !== undefined ? String(v.cityid) : "";

        setStateId(sid);

        // ✅ load cities by that state, then select city
        await fetchCitiesByState(sid, cid);

        toast.success("Visitor details loaded");
        setLastFetchedMobile(m);
      } else {
        setLastFetchedMobile(m);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message;
      if (msg) toast.error(msg);
      setLastFetchedMobile(m);
    } finally {
      setLoadingMobile(false);
    }
  };

  // ---------------- Save Visitor ----------------
  const handleSave = async () => {
    if (!/^\d{10}$/.test(mobile)) return toast.error("Enter valid 10 digit mobile");
    if (!companyName) return toast.error("Company name is required");
    if (!name) return toast.error("Name is required");
    if (!email) return toast.error("Email is required");
    if (!stateId) return toast.error("State is required");
    if (!cityId) return toast.error("City is required");
    if (!userId) return toast.error("User not found");
    if (!expoId) return toast.error("Expo not found");

    try {
      setSaving(true);

      const payload = {
        mobileno: mobile,
        companyname: companyName,
        name,
        email,
        stateid: String(stateId),
        cityid: String(cityId),
        userid: String(userId),
        expoid: String(expoId),
      };

      const res = await axios.post(`${apiUrl}/Visitor/Add`, payload);

      if (res.data?.success) {
        toast.success(res.data?.message || "Visitor Added Successfully");
        if (typeof res.data?.today_visitor_count === "number") {
          setTodayCount(res.data.today_visitor_count);
        }

        // reset
        setMobile("");
        setCompanyName("");
        setName("");
        setEmail("");
        setStateId("");
        setCityId("");
        setCities([]);
        setLastFetchedMobile("");
      } else {
        toast.error(res.data?.message || "Visitor add failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Visitor add failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{expoName}</h1>

        <div className="text-white bg-[#2e56a6] px-5 py-2 rounded-lg shadow">
          Today’s Entry: <span className="font-semibold">{todayCount}</span>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Visitor</h2>

        {loadingInit ? (
          <div className="flex items-center gap-3 text-gray-600 py-6">
            <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            Loading states...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* MOBILE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>

                <div className="relative">
                  <input
                    type="text"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d*$/.test(v)) setMobile(v);
                      if (v.length < 10) setLastFetchedMobile("");
                    }}
                    onBlur={() => fetchVisitorByMobile(mobile)}
                    placeholder="Enter mobile number"
                    className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring focus:ring-blue-300"
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

            {/* COMPANY + NAME + EMAIL */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
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

            {/* STATE + CITY */}
            <div className="grid grid-cols-2 gap-4">
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
                    <option value="">
                      {loadingCity ? "Loading cities..." : "Select City"}
                    </option>

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
            </div>

            {/* SAVE BUTTON */}
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
