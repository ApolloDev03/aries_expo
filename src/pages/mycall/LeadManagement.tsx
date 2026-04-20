// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { apiUrl } from "../../config";

// type AssignedExpo = {
//   assign_id: number;
//   expo_name: string;
//   expo_date: string;
//   city_name: string;
//   state_name: string;
//   expo_id: number;
//   slugname: string;
//   industry_name: string;
// };

// type VisitorInfo = {
//   id: number;
//   mobileno: string;
//   companyname: string;
//   name: string | null;
//   email: string | null;
//   stateid: number | null;
//   cityid: number | null;
//   address: string | null;
//   iStatus: number;
//   iSDelete: number;
//   created_at: string;
//   updated_at: string;
//   user_id: number;
//   expo_id: number | null;
//   enter_by: string | null;
//   industry_id: number | null;
//   visitor_category_id: number | null;
//   pincode: string | null;
// };

// const getApiErrorMessage = (data: any, fallback: string) => {
//   return data?.message || data?.error || fallback;
// };

// const formatDateTimeForInput = (date: Date) => {
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
//     date.getDate()
//   )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
// };

// const formatDateTimeForApi = (value: string) => {
//   if (!value) return "";
//   return value.replace("T", " ") + ":00";
// };

// const formatTimeForApi = (date: Date) => {
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
// };

// const normalizeVisitor = (data: any): VisitorInfo | null => {
//   if (!data || !data.id) return null;

//   return {
//     id: Number(data.id),
//     mobileno: String(data.mobileno ?? ""),
//     companyname: String(data.companyname ?? ""),
//     name: data.name ?? null,
//     email: data.email ?? null,
//     stateid: data.stateid ? Number(data.stateid) : null,
//     cityid: data.cityid ? Number(data.cityid) : null,
//     address: data.address ?? null,
//     iStatus: Number(data.iStatus ?? 0),
//     iSDelete: Number(data.iSDelete ?? 0),
//     created_at: String(data.created_at ?? ""),
//     updated_at: String(data.updated_at ?? ""),
//     user_id: Number(data.user_id ?? 0),
//     expo_id: data.expo_id ? Number(data.expo_id) : null,
//     enter_by: data.enter_by ?? null,
//     industry_id: data.industry_id ? Number(data.industry_id) : null,
//     visitor_category_id: data.visitor_category_id
//       ? Number(data.visitor_category_id)
//       : null,
//     pincode: data.pincode ?? null,
//   };
// };

// const LeadManagement = () => {

//   const [showForm, setShowForm] = useState(false);
//   const [seconds, setSeconds] = useState(0);

//   const [expoList, setExpoList] = useState<AssignedExpo[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [loadingVisitor, setLoadingVisitor] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [currentVisitor, setCurrentVisitor] = useState<VisitorInfo | null>(null);
//   const [recordStartTime, setRecordStartTime] = useState<Date | null>(null);
//   const [showDateError, setShowDateError] = useState(false);

//   const [formData, setFormData] = useState({
//     expo_id: "",
//     industry_id: "",
//     visitor_category_id: "",
//     status: "",
//     remarks: "",
//     next_follow_up: formatDateTimeForInput(new Date()),
//   });

//   useEffect(() => {
//     let interval: ReturnType<typeof setInterval> | undefined;

//     if (showForm && currentVisitor) {
//       interval = setInterval(() => {
//         setSeconds((prev) => prev + 1);
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [showForm, currentVisitor]);
//   const userId = localStorage.getItem("User_Id");

//   if (!userId) {
//     console.error("User_Id not found in localStorage");
//     setLoading(false);
//     return;
//   }
//   const fetchAssignedExpoList = async () => {
//     if (!userId) {
//       setExpoList([]);
//       toast.error("User ID not found");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${apiUrl}/Assign/Expolist`, {
//         user_id: String(userId),
//       });

//       if (res.data?.success) {
//         const list: AssignedExpo[] = (res.data?.data || []).map((x: any) => ({
//           assign_id: Number(x.assign_id),
//           expo_name: String(x.expo_name ?? ""),
//           expo_date: String(x.expo_date ?? ""),
//           city_name: String(x.city_name ?? ""),
//           state_name: String(x.state_name ?? ""),
//           expo_id: Number(x.expo_id ?? ""),
//           slugname: String(x.slugname ?? ""),
//           industry_name: String(x.industry_name ?? ""),
//         }));

//         setExpoList(list);
//       } else {
//         setExpoList([]);
//         toast.error(res.data?.message || "Failed to fetch expos");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setExpoList([]);
//       toast.error(err?.response?.data?.message || "Failed to fetch expos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssignedExpoList();
//   }, []);


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     if (name === "expo_id") {
//       setFormData((prev) => ({
//         ...prev,
//         expo_id: value,
//       }));
//       return;
//     }

//     if (name === "industry_id") {
//       setFormData((prev) => ({
//         ...prev,
//         industry_id: value,
//         visitor_category_id: "",
//       }));
//       setCurrentVisitor(null);
//       return;
//     }

//     if (name === "status") {
//       setFormData((prev) => ({
//         ...prev,
//         status: value,
//         next_follow_up:
//           value === "not-interested" ? "" : prev.next_follow_up || formatDateTimeForInput(new Date()),
//       }));
//       setShowDateError(false);
//       return;
//     }

//     if (name === "next_follow_up") {
//       setFormData((prev) => ({
//         ...prev,
//         next_follow_up: value,
//       }));

//       if (value) {
//         setShowDateError(false);
//       }
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const resetFollowupFields = () => {
//     setFormData((prev) => ({
//       ...prev,
//       status: "",
//       remarks: "",
//       next_follow_up: formatDateTimeForInput(new Date()),
//     }));
//     setShowDateError(false);
//   };
//   const setNextRecordFromResponse = (visitorData: any) => {
//     const nextVisitor = normalizeVisitor(visitorData);

//     if (nextVisitor) {
//       setCurrentVisitor(nextVisitor);
//       setShowForm(true);
//       setSeconds(0);
//       setRecordStartTime(new Date());
//       resetFollowupFields();
//       return true;
//     }

//     return false;
//   };

//   const fetchUniqueVisitor = async () => {
//     if (!userId) {
//       toast.error("User ID not found");
//       return;
//     }

//     if (!formData.expo_id) {
//       toast.error("Please select expo");
//       return;
//     }


//     try {
//       setLoadingVisitor(true);

//       const payload = {
//         user_id: String(userId),
//         expo_id: String(formData.expo_id),
//         industry_id: 0,
//         visitor_category_id: 0,
//       };

//       const res = await axios.post(`${apiUrl}/Get_unique_visitor`, payload);

//       if (!res.data?.success || !res.data?.data) {
//         throw new Error(getApiErrorMessage(res.data, "No visitor found"));
//       }

//       const visitor = normalizeVisitor(res.data.data);

//       if (!visitor) {
//         throw new Error("Invalid visitor data received");
//       }

//       setCurrentVisitor(visitor);
//       setShowForm(true);
//       setSeconds(0);
//       setRecordStartTime(new Date());
//       resetFollowupFields();

//       toast.success(res.data?.message || "Visitor fetched successfully");
//     } catch (err: any) {
//       console.error(err);
//       setCurrentVisitor(null);
//       toast.error(err?.response?.data?.message || err?.message || "Failed to fetch visitor");
//     } finally {
//       setLoadingVisitor(false);
//     }
//   };

//   const getFollowupStatusValue = (status: string) => {
//     switch (status) {
//       case "wrong-number":
//         return "1";
//       case "business-change":
//         return "2";
//       case "to-be-call-back":
//         return "3";
//       case "register":
//         return "4";
//       case "information-passed":
//         return "5";
//       default:
//         return "";
//     }
//   };

//   const handleStartNewRecord = async () => {
//     await fetchUniqueVisitor();
//   };

//   const handleSubmit = async () => {
//     if (!currentVisitor?.id) {
//       toast.error("Visitor not found");
//       return;
//     }

//     if (!formData.status) {
//       toast.error("Please select status");
//       return;
//     }

//     if (
//       formData.status === "to-be-call-back" &&
//       !formData.next_follow_up
//     ) {
//       setShowDateError(true);
//       return;
//     }

//     setShowDateError(false);

//     try {
//       setSubmitting(true);

//       const now = new Date();
//       const startDate = recordStartTime || now;

//       const payload = {
//         visitor_id: String(currentVisitor.id),
//         user_id: String(userId),
//         expo_id: String(formData.expo_id || 0),
//         industry_id: 0,
//         visitor_category_id: 0,
//         followup_status: getFollowupStatusValue(formData.status),
//         start_time: formatTimeForApi(startDate),
//         end_time: formatTimeForApi(now),
//         next_followup_date:
//           formData.status === "not-interested"
//             ? ""
//             : formatDateTimeForApi(formData.next_follow_up),
//         followup_remark: formData.remarks,
//       };

//       const res = await axios.post(`${apiUrl}/visitor_followup_create`, payload);

//       if (!res.data?.success) {
//         throw new Error(
//           getApiErrorMessage(res.data, "Visitor followup created failed")
//         );
//       }

//       toast.success(res.data?.message || "Visitor followup created successfully");

//       const nextSet = setNextRecordFromResponse(res.data?.data);

//       if (!nextSet) {
//         setShowForm(false);
//         setCurrentVisitor(null);
//         setRecordStartTime(null);
//         setSeconds(0);
//         resetFollowupFields();
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error(
//         err?.response?.data?.message || err?.message || "Failed to create followup"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   const inputClass =
//     "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c] transition";
//   const labelClass = "block text-sm font-medium text-gray-700 mb-2";

//   return (
//     <div className=" bg-[#f3f4f6] flex items-center justify-center px-4 py-24 text-black font-sans">
//       {!showForm ? (
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
//           <h2 className="text-2xl font-bold text-center mb-6">New Client Setup</h2>

//           <div className="space-y-5">
//             <div>
//               <label className={labelClass}>Expo</label>
//               <select
//                 name="expo_id"
//                 value={formData.expo_id}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="">{loading ? "Loading expos..." : "Select Expo"}</option>
//                 {expoList.map((expo) => (
//                   <option key={expo.assign_id} value={String(expo.expo_id)}>
//                     {expo.expo_name} - {expo.city_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button
//               onClick={handleStartNewRecord}
//               disabled={loadingVisitor}
//               className="w-full bg-[#d47d4c] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
//             >
//               {loadingVisitor ? "Loading..." : "New Record"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.96 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
//         >
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//             <h2 className="text-2xl sm:text-3xl font-bold">
//               Record {currentVisitor?.id || "-"}
//             </h2>

//             <div className="bg-[#f4e3d8] text-[#8a4d2f] px-4 py-2 rounded-full text-sm font-medium">
//               Timer: {Math.floor(seconds / 60)}:
//               {(seconds % 60).toString().padStart(2, "0")}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wider">Client Name</p>
//               <p className="text-lg font-semibold">{currentVisitor?.name || "-"}</p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wider">Company</p>
//               <p className="text-lg font-semibold">{currentVisitor?.companyname || "-"}</p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wider">Phone Number</p>
//               <p className="text-lg font-semibold tracking-wide">
//                 {currentVisitor?.mobileno || "-"}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
//               <p className="text-lg font-semibold">{currentVisitor?.email || "-"}</p>
//             </div>

//             <div className="sm:col-span-2">
//               <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
//               <p className="text-base font-medium">{currentVisitor?.address || "-"}</p>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <label className={labelClass}>Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option value="">Select Status</option>
//                 <option value="wrong-number">Wrong Number </option>
//                 <option value="business-change">Business Change</option>
//                 <option value="to-be-call-back">Busy Now... Call Back</option>
//                 <option value="register">Registered </option>
//                 <option value="information-passed">Information Passed </option>
//               </select>
//             </div>

//             <div>
//               <label className={labelClass}>Remarks</label>
//               <textarea
//                 name="remarks"
//                 value={formData.remarks}
//                 onChange={handleChange}
//                 className={`${inputClass} min-h-[120px] resize-none`}
//                 placeholder="Enter remarks..."
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Next Follow Up</label>
//               <input
//                 name="next_follow_up"
//                 type="datetime-local"
//                 value={formData.next_follow_up}
//                 onChange={handleChange}
//                 disabled={formData.status === "not-interested" || formData.status === "register"}
//                 className={`w-full rounded-lg px-4 py-3 outline-none transition ${formData.status === "not-interested" || formData.status === "register"
//                   ? "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
//                   : showDateError && formData.status === "to-be-call-back"
//                     ? "bg-white border border-red-500 focus:ring-2 focus:ring-red-500"
//                     : "bg-white border border-gray-300 focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c]"
//                   }`}
//               />

//               {showDateError && formData.status === "to-be-call-back" && (
//                 <p className="text-sm text-red-500 mt-2">
//                   Next follow up date & time is required.
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false);
//                   setSeconds(0);
//                   setCurrentVisitor(null);
//                   setRecordStartTime(null);
//                 }}
//                 className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
//               >
//                 Back
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="w-full bg-[#d47d4c] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
//               >
//                 {submitting ? "Submitting..." : "Submit & Next"}
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default LeadManagement;


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../config";

type AssignedExpo = {
  assign_id: number;
  expo_name: string;
  expo_date: string;
  city_name: string;
  state_name: string;
  expo_id: number;
  slugname: string;
  industry_name: string;
};

type VisitorInfo = {
  id: number;
  mobileno: string;
  companyname: string;
  name: string | null;
  email: string | null;
  stateid: number | null;
  cityid: number | null;
  address: string | null;
  iStatus: number;
  iSDelete: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  expo_id: number | null;
  enter_by: string | null;
  industry_id: number | null;
  visitor_category_id: number | null;
  pincode: string | null;
};

const getApiErrorMessage = (data: any, fallback: string) => {
  return data?.message || data?.error || fallback;
};

const formatDateTimeForInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateTimeForApi = (value: string) => {
  if (!value) return null;
  return value.replace("T", " ") + ":00";
};

const formatTimeForApi = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const normalizeVisitor = (data: any): VisitorInfo | null => {
  if (!data || !data.id) return null;

  return {
    id: Number(data.id),
    mobileno: String(data.mobileno ?? ""),
    companyname: String(data.companyname ?? ""),
    name: data.name ?? null,
    email: data.email ?? null,
    stateid: data.stateid ? Number(data.stateid) : null,
    cityid: data.cityid ? Number(data.cityid) : null,
    address: data.address ?? null,
    iStatus: Number(data.iStatus ?? 0),
    iSDelete: Number(data.iSDelete ?? 0),
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
    user_id: Number(data.user_id ?? 0),
    expo_id: data.expo_id ? Number(data.expo_id) : null,
    enter_by: data.enter_by ?? null,
    industry_id: data.industry_id ? Number(data.industry_id) : null,
    visitor_category_id: data.visitor_category_id
      ? Number(data.visitor_category_id)
      : null,
    pincode: data.pincode ?? null,
  };
};

const LeadManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [expoList, setExpoList] = useState<AssignedExpo[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingVisitor, setLoadingVisitor] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentVisitor, setCurrentVisitor] = useState<VisitorInfo | null>(null);
  const [recordStartTime, setRecordStartTime] = useState<Date | null>(null);
  const [showDateError, setShowDateError] = useState(false);

  const [visitorCategories, setVisitorCategories] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    expo_id: "",
    industry_id: "",
    state_id: "",
    visitor_category_id: "",
    status: "" as string | number,
    remarks: "",
    next_follow_up: "",
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (showForm && currentVisitor) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showForm, currentVisitor]);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("User_Id") : null;

  const fetchAssignedExpoList = async () => {
    if (!userId) {
      setExpoList([]);
      toast.error("User ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/Assign/Expolist`, {
        user_id: String(userId),
      });

      if (res.data?.success) {
        const list: AssignedExpo[] = (res.data?.data || []).map((x: any) => ({
          assign_id: Number(x.assign_id),
          expo_name: String(x.expo_name ?? ""),
          expo_date: String(x.expo_date ?? ""),
          city_name: String(x.city_name ?? ""),
          state_name: String(x.state_name ?? ""),
          expo_id: Number(x.expo_id ?? ""),
          slugname: String(x.slugname ?? ""),
          industry_name: String(x.industry_name ?? ""),
        }));

        setExpoList(list);
      } else {
        setExpoList([]);
        toast.error(res.data?.message || "Failed to fetch expos");
      }
    } catch (err: any) {
      console.error(err);
      setExpoList([]);
      toast.error(err?.response?.data?.message || "Failed to fetch expos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedExpoList();
  }, []);

  const fetchVisitorCategoryAndState = async (expoId: string) => {
    if (!userId || !expoId) return;

    try {
      const res = await axios.post(
        `${apiUrl}/Expo_to_industry_get`,
        {
          user_id: String(userId),
          expo_id: String(expoId),
        }
      );

      if (res.data?.success) {
        setVisitorCategories(res.data.data.visitor_category || []);
        setStates(res.data.data.state || []);

        // set industry_id automatically from API
        setFormData((prev) => ({
          ...prev,
          industry_id: String(res.data.data.industry_id || ""),
        }));
      } else {
        setVisitorCategories([]);
        setStates([]);
        toast.error(res.data?.message || "Failed to fetch data");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch visitor category");
      setVisitorCategories([]);
      setStates([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "expo_id") {
      setFormData((prev) => ({
        ...prev,
        expo_id: value,
        visitor_category_id: "",
        state_id: "",
      }));

      fetchVisitorCategoryAndState(value);

      return;
    }

    if (name === "industry_id") {
      setFormData((prev) => ({
        ...prev,
        industry_id: value,
        visitor_category_id: "",
      }));
      setCurrentVisitor(null);
      return;
    }

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        next_follow_up:
          value === "3" ? prev.next_follow_up || formatDateTimeForInput(new Date()) : "",
      }));
      setShowDateError(false);
      return;
    }

    if (name === "next_follow_up") {
      setFormData((prev) => ({
        ...prev,
        next_follow_up: value,
      }));

      if (value) {
        setShowDateError(false);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFollowupFields = () => {
    setFormData((prev) => ({
      ...prev,
      status: "",
      remarks: "",
      next_follow_up: "",
    }));
    setShowDateError(false);
  };

  const setNextRecordFromResponse = (visitorData: any) => {
    const nextVisitor = normalizeVisitor(visitorData);

    if (nextVisitor) {
      setCurrentVisitor(nextVisitor);
      setShowForm(true);
      setSeconds(0);
      setRecordStartTime(new Date());
      resetFollowupFields();
      return true;
    }

    return false;
  };

  const fetchUniqueVisitor = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    if (!formData.expo_id) {
      toast.error("Please select expo");
      return;
    }

    try {
      setLoadingVisitor(true);

      const payload = {
        user_id: String(userId),
        expo_id: String(formData.expo_id),
        industry_id: Number(formData.industry_id || 0),
        visitor_category_id: Number(formData.visitor_category_id || 0),
      };

      const res = await axios.post(`${apiUrl}/Get_unique_visitor`, payload);

      if (!res.data?.success || !res.data?.data) {
        throw new Error(getApiErrorMessage(res.data, "No visitor found"));
      }

      const visitor = normalizeVisitor(res.data.data);

      if (!visitor) {
        throw new Error("Invalid visitor data received");
      }

      setCurrentVisitor(visitor);
      setShowForm(true);
      setSeconds(0);
      setRecordStartTime(new Date());
      resetFollowupFields();

      toast.success(res.data?.message || "Visitor fetched successfully");
    } catch (err: any) {
      console.error(err);
      setCurrentVisitor(null);
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch visitor");
    } finally {
      setLoadingVisitor(false);
    }
  };

  // const getFollowupStatusValue = (status: string) => {
  //   switch (status) {
  //     case "wrong-number":
  //       return "1";
  //     case "business-change":
  //       return "2";
  //     case "to-be-call-back":
  //       return "3";
  //     case "register":
  //       return "4";
  //     case "information-passed":
  //       return "5";
  //     default:
  //       return "";
  //   }
  // };

  const handleStartNewRecord = async () => {
    await fetchUniqueVisitor();
  };

  const handleSubmit = async () => {
    if (!currentVisitor?.id) {
      toast.error("Visitor not found");
      return;
    }

    if (!formData.status) {
      toast.error("Please select status");
      return;
    }

    if (Number(formData.status) === 3 && !formData.next_follow_up) {
      setShowDateError(true);
      return;
    }

    console.log("STATUS:", formData.status);
    console.log("NEXT FOLLOW UP:", formData.next_follow_up);

    setShowDateError(false);

    try {
      setSubmitting(true);

      const now = new Date();
      const startDate = recordStartTime || now;

      const payload = {
        visitor_id: String(currentVisitor.id),
        user_id: String(userId),
        expo_id: String(formData.expo_id || 0),
        industry_id: Number(formData.industry_id || 0),
        visitor_category_id: Number(formData.visitor_category_id || 0),
        state_id: Number(formData.state_id || 0),
        followup_status: Number(formData.status),
        start_time: formatTimeForApi(startDate),
        end_time: formatTimeForApi(now),
        next_followup_date:
          Number(formData.status) === 3 && formData.next_follow_up
            ? formatDateTimeForApi(formData.next_follow_up)
            : null,
        followup_remark: formData.remarks,
      };

      const res = await axios.post(`${apiUrl}/visitor_followup_create`, payload);

      if (!res.data?.success) {
        throw new Error(
          getApiErrorMessage(res.data, "Visitor followup created failed")
        );
      }

      toast.success(res.data?.message || "Visitor followup created successfully");

      const nextSet = setNextRecordFromResponse(res.data?.data);

      if (!nextSet) {
        setShowForm(false);
        setCurrentVisitor(null);
        setRecordStartTime(null);
        setSeconds(0);
        resetFollowupFields();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create followup"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c] transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="bg-[#f3f4f6] flex items-center justify-center px-4 py-24 text-black font-sans">
      {!showForm ? (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">New Call Setup</h2>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Expo</label>
              <select
                name="expo_id"
                value={formData.expo_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">{loading ? "Loading expos..." : "Select Expo"}</option>
                {expoList.map((expo) => (
                  <option key={expo.assign_id} value={String(expo.expo_id)}>
                    {expo.expo_name} - {expo.city_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Visitor Category */}
            <div>
              <label className={labelClass}>Visitor Category</label>
              <select
                name="visitor_category_id"
                value={formData.visitor_category_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Category</option>
                {visitorCategories
                  // .filter((v) => v.isDelete === 0) 
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.strVisitorCategory}
                    </option>
                  ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className={labelClass}>State</label>
              <select
                name="state_id"
                value={formData.state_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>


            <button
              onClick={handleStartNewRecord}
              disabled={loadingVisitor}
              className="w-full bg-[#d47d4c] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
            >
              {loadingVisitor ? "Loading..." : "New Record"}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Record
            </h2>

            <div className="bg-[#f4e3d8] text-[#8a4d2f] px-4 py-2 rounded-full text-sm font-medium">
              Timer: {Math.floor(seconds / 60)}:
              {(seconds % 60).toString().padStart(2, "0")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Client Name</p>
              <p className="text-lg font-semibold">{currentVisitor?.name || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Company</p>
              <p className="text-lg font-semibold">{currentVisitor?.companyname || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Phone Number</p>
              <p className="text-lg font-semibold tracking-wide">
                {currentVisitor?.mobileno || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-lg font-semibold">{currentVisitor?.email || "-"}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
              <p className="text-base font-medium">{currentVisitor?.address || "-"}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Status</option>
                <option value="1">Registered</option>
                <option value="2">Wrong Number</option>
                <option value="3">Busy Now... Call Back</option>
                <option value="4">Business Change</option>
                <option value="5">Information Passed</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className={`${inputClass} min-h-[120px] resize-none`}
                placeholder="Enter remarks..."
              />
            </div>

            {formData.status === "3" && (
              <div>
                <label className={labelClass}>Next Follow Up</label>
                <input
                  name="next_follow_up"
                  type="datetime-local"
                  value={formData.next_follow_up}
                  onChange={handleChange}
                  className={`w-full rounded-lg px-4 py-3 outline-none transition ${showDateError
                    ? "bg-white border border-red-500 focus:ring-2 focus:ring-red-500"
                    : "bg-white border border-gray-300 focus:ring-2 focus:ring-[#d47d4c] focus:border-[#d47d4c]"
                    }`}
                />

                {showDateError && (
                  <p className="text-sm text-red-500 mt-2">
                    Next follow up date & time is required.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSeconds(0);
                  setCurrentVisitor(null);
                  setRecordStartTime(null);
                  resetFollowupFields();
                }}
                className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#d47d4c] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit & Next"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LeadManagement;