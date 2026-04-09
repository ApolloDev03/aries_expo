import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  History,
  User,
  Briefcase,
  Phone,
} from "lucide-react";
import { apiUrl } from "../../config";
import { toast } from "react-toastify";

type FollowupItem = {
  visitor_followup_id: number;
  visitor_id: number;
  expo_id: number;
  industry_id: number;
  visitor_category_id: number;
  followup_user_id: number;
  followup_status: number;
  start_time: string;
  end_time: string;
  total_minutes_different: number;
  visitor_followup_history_id: number;
  next_followup_date: string;
  next_followup_time: string;
  followup_remark: string;
  name: string | null;
  companyname: string | null;
  mobileno: string | null;
  days_overdue?: number;
};

type FollowupHistoryItem = {
  visitor_followup_history_id: number;
  visitor_followup_id: number;
  followup_status: number;
  followup_remark: string;
  next_followup_date: string;
  next_followup_time: string;
  start_time: string;
  end_time: string;
  total_minutes_different: number;
  created_at: string;
  name: string | null;
  companyname: string | null;
  mobileno: string | null;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    today_followup_count: number;
    overdue_followup_count: number;
    type: string;
    selectedList: FollowupItem[];
    currentRecord: FollowupItem | null;
    followupHistory: FollowupHistoryItem[];
  };
};

const OverdueFollowUp = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const currentType = type || "Todayfollowup";

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiData, setApiData] = useState<ApiResponse["data"] | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<FollowupItem | null>(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");
  const [showDateError, setShowDateError] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("User_Id") : null;

  const pageTitle = useMemo(() => {
    return currentType === "overduefollowup"
      ? "Overdue Follow-ups"
      : "Today's Follow-ups";
  }, [currentType]);

  const badgeText = useMemo(() => {
    if (!apiData) return "";
    return currentType === "overduefollowup"
      ? `${apiData.overdue_followup_count} Delayed`
      : `${apiData.today_followup_count} Today`;
  }, [apiData, currentType]);

  const badgeClass =
    currentType === "overduefollowup"
      ? "text-red-500 bg-red-50"
      : "text-blue-500 bg-blue-50";

  const leftBarClass =
    currentType === "overduefollowup" ? "bg-red-500" : "bg-blue-500";

  const fetchDashboardData = async (keepCurrentId?: number) => {
    if (!userId) {
      console.error("User_Id not found in localStorage");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post<ApiResponse>(
        `${apiUrl}/DashboardCountListData`,
        {
          user_id: userId,
          Type: currentType,
        }
      );

      if (response.data?.success) {
        const resData = response.data.data;
        setApiData(resData);

        let recordToSelect: FollowupItem | null = null;

        if (keepCurrentId) {
          recordToSelect =
            resData?.selectedList?.find(
              (item) => item.visitor_followup_id === keepCurrentId
            ) || null;
        }

        if (!recordToSelect) {
          recordToSelect =
            resData?.currentRecord || resData?.selectedList?.[0] || null;
        }

        setSelectedRecord(recordToSelect);

      }
    } catch (error) {
      console.error("DashboardCountListData API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentType]);

  const handleSelectRecord = (item: FollowupItem) => {
    setSelectedRecord(item);
    setRemarks(item.followup_remark || "");
    setStatus(item.followup_status ? String(item.followup_status) : "");
    setNextFollowUp("");
    setShowDateError(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return "-";
    return `${formatDate(dateStr)} ${timeStr || ""}`.trim();
  };

  const getStatusLabel = (statusValue: number) => {
    switch (statusValue) {
      case 1:
        return "register";
      case 2:
        return "Not Interested";
      case 3:
        return "Call Back";
      default:
        return "Pending";
    }
  };

  const formatTimeToHHMM = (time?: string) => {
    if (!time) return "";
    const parts = time.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  const formatDateTimeLocalToApiDate = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!selectedRecord) {
      toast.error("Please select a record first.");
      return;
    }

    if (!userId) {
      toast.error("User_Id not found in localStorage");
      return;
    }

    if (!status) {
      toast.error("Please select status.");
      return;
    }

    if (!remarks.trim()) {
      toast.error("Please enter remarks.");
      return;
    }

    if (status === "3" && !nextFollowUp) {
      toast.error("Please select next follow-up date.");
      setShowDateError(true);
      return;
    }

    setShowDateError(false);

    try {
      setSubmitting(true);

      const payload = {
        visitor_followup_id: String(selectedRecord.visitor_followup_id),
        visitor_id: String(selectedRecord.visitor_id),
        user_id: String(userId),
        expo_id: String(selectedRecord.expo_id ?? 0),
        industry_id: String(selectedRecord.industry_id ?? ""),
        visitor_category_id: String(selectedRecord.visitor_category_id ?? ""),
        followup_status: String(status),
        start_time: formatTimeToHHMM(selectedRecord.start_time),
        end_time: formatTimeToHHMM(selectedRecord.end_time),
        next_followup_date:
          status === "2" ? "" : formatDateTimeLocalToApiDate(nextFollowUp),
        followup_remark: remarks.trim(),
      };

      const response = await axios.post(
        `${apiUrl}/Today_Overdue_Followup_Create`,
        payload
      );

      if (response.data?.success) {
        toast.success(response.data?.message || "Visitor followup created successfully");

        const currentId = selectedRecord.visitor_followup_id;
        const currentList = apiData?.selectedList || [];
        const currentIndex = currentList.findIndex(
          (item) => item.visitor_followup_id === currentId
        );

        await fetchDashboardData();

        if (currentIndex !== -1) {
          const refreshedResponse = await axios.post<ApiResponse>(
            `${apiUrl}/DashboardCountListData`,
            {
              user_id: userId,
              Type: currentType,
            }
          );

          if (refreshedResponse.data?.success) {
            const refreshedData = refreshedResponse.data.data;
            setApiData(refreshedData);

            const nextItem =
              refreshedData?.selectedList?.[currentIndex] ||
              refreshedData?.selectedList?.[0] ||
              null;

            setSelectedRecord(nextItem);
            setRemarks(nextItem?.followup_remark || "");
            setStatus(nextItem?.followup_status ? String(nextItem.followup_status) : "");
            setNextFollowUp("");
            setShowDateError(false);
          }
        }
      } else {
        toast.error(response.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Today_Overdue_Followup_Create API error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit follow-up."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className={`w-2 h-6 ${leftBarClass} rounded-full`} />
                {pageTitle}
              </h2>

              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${badgeClass}`}
              >
                {badgeText}
              </span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
              {loading ? (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-500">
                  Loading...
                </div>
              ) : apiData?.selectedList?.length ? (
                apiData.selectedList.map((item) => (
                  <motion.div
                    key={item.visitor_followup_id}
                    whileHover={{ x: 5 }}
                    onClick={() => handleSelectRecord(item)}
                    className={`bg-white p-4 rounded-2xl border flex items-center justify-between hover:shadow-sm cursor-pointer transition-all group ${selectedRecord?.visitor_followup_id === item.visitor_followup_id
                      ? "border-orange-400 shadow-sm"
                      : "border-slate-200"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        <User size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {item.name || "N/A"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.companyname || "N/A"}
                        </p>

                        {currentType === "overduefollowup" && (
                          <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                            {item.days_overdue || 0} Day
                            {item.days_overdue !== 1 ? "s" : ""} Overdue
                          </p>
                        )}

                        {currentType === "Todayfollowup" && (
                          <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase">
                            Today Follow-up
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-slate-300 group-hover:text-orange-500"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-500">
                  No follow-up records found.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <User size={12} /> Client Name
                </p>
                <p className="font-bold text-slate-900">
                  {selectedRecord?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Briefcase size={12} /> Company
                </p>
                <p className="font-bold text-slate-900">
                  {selectedRecord?.companyname || "-"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Phone size={12} /> Phone Number
                </p>
                <p className="font-bold text-slate-900">
                  {selectedRecord?.mobileno || "-"}
                </p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStatus(value);
                    setShowDateError(false);

                    if (value === "2") {
                      setNextFollowUp("");
                    }
                  }}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="">Select Status</option>
                  <option value="1">Registered</option>
                  <option value="2">Not Interested</option>
                  <option value="3">Call Back Later</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Remarks
                </label>
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Next Follow Up
                </label>
                <input
                  type="datetime-local"
                  value={nextFollowUp}
                  onChange={(e) => {
                    setNextFollowUp(e.target.value);
                    if (e.target.value) {
                      setShowDateError(false);
                    }
                  }}
                  disabled={status === "2" || status === "1"}
                  className={`w-full p-4 rounded-xl border text-sm outline-none ${status === "2" || status === "1"
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                    : showDateError
                      ? "border-red-500 bg-white focus:ring-2 focus:ring-red-500"
                      : "border-slate-200 bg-white focus:ring-2 focus:ring-orange-500"
                    }`}
                />

                {showDateError && status === "3" && (
                  <p className="text-xs text-red-500 mt-2">
                    Next follow-up date is required for Call Back Later.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="py-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedRecord}
                  className="py-4 rounded-xl bg-[#D97E56] text-white font-bold hover:opacity-90 shadow-lg shadow-orange-900/10 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit & Next"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-2 px-2">
            <History size={20} className="text-slate-400" />
            <h2 className="text-lg font-bold">Follow-up History</h2>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
              Last {apiData?.followupHistory?.length || 0} Records
            </span>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Client
                    </th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Remark
                    </th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {apiData?.followupHistory?.length ? (
                    apiData.followupHistory.map((item) => (
                      <tr
                        key={item.visitor_followup_history_id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-5 font-bold text-slate-700">
                          {item.name || "-"}
                        </td>
                        <td className="p-5 text-slate-500 max-w-xs truncate">
                          {item.followup_remark || "-"}
                        </td>
                        <td className="p-5">
                          <span className="text-[10px] font-bold uppercase tracking-tighter bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
                            {getStatusLabel(item.followup_status)}
                          </span>
                        </td>
                        <td className="p-5 text-[11px] font-medium text-slate-400 text-right italic">
                          {formatDateTime(
                            item.next_followup_date,
                            item.next_followup_time
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-5 text-center text-slate-500">
                        No follow-up history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverdueFollowUp;