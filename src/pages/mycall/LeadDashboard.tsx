import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, AlertCircle, UserPlus, Users, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";

const LeadDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    today_followup_count: 0,
    overdue_followup_count: 0,
    totalRegisterCount: 0,
    todayRegisterCount: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const userId = localStorage.getItem("User_Id");

    if (!userId) {
      console.error("User_Id not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${apiUrl}/FollowUpDashboard`, {
        user_id: userId,
      });

      if (response.data?.success) {
        setDashboardData({
          today_followup_count: response.data?.data?.today_followup_count || 0,
          overdue_followup_count: response.data?.data?.overdue_followup_count || 0,
          totalRegisterCount: response.data?.data?.totalRegisterCount || 0,
          todayRegisterCount: response.data?.data?.todayRegisterCount || 0,
        });
      }
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Today's Follow-up",
      count: dashboardData.today_followup_count,
      color: "bg-blue-500",
      icon: <Clock size={20} />,
      path: "/users/followup/Todayfollowup",
    },
    {
      label: "Overdue Follow-up",
      count: dashboardData.overdue_followup_count,
      color: "bg-red-500",
      icon: <AlertCircle size={20} />,
      path: "/users/followup/overduefollowup",
    },
    {
      label: "New Call",
      count: "",
      color: "bg-emerald-500",
      icon: <UserPlus size={20} />,
      path: "/users/new-clients",
    },
    {
      label: "Today Register",
      count: dashboardData.todayRegisterCount,
      color: "bg-orange-500",
      icon: <ClipboardList size={20} />,
      path: "/users/register/Todayregister",
    },
    {
      label: "Total Register",
      count: dashboardData.totalRegisterCount,
      color: "bg-purple-500",
      icon: <Users size={20} />,
      path: "/users/register/Totalregister",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="cursor-pointer rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {loading ? "..." : item.count}
                  </h3>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl ${item.color} text-white flex items-center justify-center`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadDashboard;