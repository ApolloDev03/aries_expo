import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import CityList from "./pages/city/CityList";
import IndustryList from "./pages/Industry/IndustryList";
import UserList from "./pages/Users/UserList";
import UserForm from "./pages/Users/AssignForm";
import Logout from "./pages/Logout";
import DummyAdminPage from "./pages/Form/Formlist";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpoMaster from "./pages/expo/ExpoList";
import DepartmentMaster from "./pages/department/DepartmentList";
import AdminProfile from "./pages/adminProfile/Profile";
import EditProfile from "./pages/adminProfile/EditProfile";
import UserLogin from "./pages/UserLogin";
import UserLayout from "./layout/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import AssignedExpoList from "./pages/my-expo/MyExpo";
import AddVisitor from "./pages/add-visitor/AddVisitor";
import ProtectedRoute from "./components/AdminProtectedRoute";
import UserProfile from "./pages/userProfile/UserProfile";
import EditUserProfile from "./pages/userProfile/EditUserProfile";
import UserLogout from "./pages/UserLogout";
import VisitorList from "./pages/add-visitor/VisitorList";
import UserProtectedRoute from "./components/UserProtectedRoute";
import { Suspense } from "react";
import UploadVisitor from "./pages/upload-visitor/UploadVisitor";
import VisitorReportPage from "./pages/report/ReportVisitor";
import AddExhivitor from "./pages/add-exhibitor/AddExhibitor";
import ExhibitorListDesign from "./pages/add-exhibitor/ExhibitorList";
import ExhibitorEditDesign from "./pages/add-exhibitor/EditExhibitor";
import ExpectedVisitor from "./pages/add-visitor/ExpectedVisitor";
import CategoryMaster from "./pages/Cat/Category";
import SubCategoryMaster from "./pages/Subcategory/SubCategory";
import VisitorCategoryMaster from "./pages/visitor-category/page";
import ExpectedExhivitor from "./pages/add-exhibitor/ExpectedExhibitor";
import ExpectedExhibitorListDesign from "./pages/add-exhibitor/ExpectedExhibitorList";
import ExpectedExhibitorEdit from "./pages/add-exhibitor/EditExpectedExhibitor";
import BusinessTypeMaster from "./pages/buissness-type/page";
import AdminUserVisits from "./pages/adminuserlist/AdminUserVisits";
import AdminExhibitorReports from "./pages/report/ReportExhibitor";
import StateMaster from "./pages/state/Statelist";
import UploadExhibitor from "./pages/upload-exhibitor/uploadExhibitor";
import VisitorListingPage from "./pages/adminuserlist/VisitorListingPage";
import UserWiseCountPage from "./pages/adminuserlist/UserWiseCountPage";
import LeadDashboard from "./pages/mycall/LeadDashboard";
import LeadManagement from "./pages/mycall/LeadManagement";
import VisitorIndustrys from "./pages/adminuserlist/VisitorIndustrys";
import OverdueFollowUp from "./pages/mycall/LeadFollowup";
import RegisterListing from "./pages/mycall/RegisterList";
import CallingPage from "./pages/allcall/TellingCalling";
import CallingList from "./pages/allcall/CallingList";
import CallingReportPage from "./pages/allcall/CallReport";


export default function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* admin login */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/logout" element={<UserLogout />} />

          {/* admin login */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/logout" element={<Logout />} />

          {/* users */}
          <Route
            path="/users"
            element={
              <UserProtectedRoute >
                <UserLayout />
              </UserProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />

            <Route path="my-expo" element={<AssignedExpoList />} />

            <Route path="add-visitors/:slug" element={<AddVisitor />} />
            <Route path="expectedvisitor" element={<ExpectedVisitor />} />
            <Route path="/users/visitors-list/:label" element={<VisitorList />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="edit-profile" element={<EditUserProfile />} />
            <Route path="upload-visitor" element={<UploadVisitor />} />
            <Route path="upload-Exhibitors" element={<UploadExhibitor />} />
            <Route path="add-exhivitor/:slug" element={<AddExhivitor />} />
            <Route path="expectedexhibitor" element={<ExpectedExhivitor />} />

            <Route path="/users/exhibitors-list/:label" element={<ExhibitorListDesign />} />
            <Route path="/users/exhibitor/edit/:id" element={<ExhibitorEditDesign />} />
            <Route path="/users/expectedexhibitors-list/:label" element={<ExpectedExhibitorListDesign />} />
            <Route path="/users/expectedexhibitor/edit/:id" element={<ExpectedExhibitorEdit />} />
            <Route path="mycall" element={<LeadDashboard />} />
            <Route path="followup/:type" element={<OverdueFollowUp />} />
            <Route path="register/:type" element={<RegisterListing />} />
            <Route path="new-clients" element={<LeadManagement />} />
          </Route>

          {/* admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* DASHBOARD */}
            <Route index element={<Dashboard />} />
            <Route path="adminuservisits" element={<AdminUserVisits />} />
            <Route path="state" element={<StateMaster />} />
            <Route path="calling" element={<CallingPage />} />
            <Route path="calling/:type/:subtype" element={<CallingList />} />
            <Route path="call/report/:type" element={<CallingReportPage />} />
            {/* CITY ROUTES */}
            <Route path="city" element={<CityList />} />

            {/* INDUSTRY ROUTES */}
            <Route path="industry" element={<IndustryList />} />

            <Route path="expo" element={<ExpoMaster />} />

            <Route path="department" element={<DepartmentMaster />} />

            <Route path="profile" element={<AdminProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/assign/:id" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />;
            <Route path="category" element={<CategoryMaster />} />
            <Route path="subcategory" element={<SubCategoryMaster />} />
            <Route path="users" element={<UserList />} />
            <Route path="report/visitor" element={<VisitorReportPage />} />;
            <Route path="report/exhibitor" element={<AdminExhibitorReports />} />;
            <Route path="visitor-category" element={<VisitorCategoryMaster />} />
            <Route path="form2" element={<DummyAdminPage />} />
            <Route path="buissness-type" element={<BusinessTypeMaster />} />
            <Route path="/admin/visitor-industryes/:type" element={<VisitorIndustrys />} />
            <Route path="/admin/visitor-listing/:type" element={<VisitorListingPage />} />
            <Route path="/admin/user-wise/:type" element={<UserWiseCountPage />} />
            {/* <Route path="adminuservisits" element={<AdminUserVisits />} /> */}
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={2000}         // ✅ 1 second
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover={false}     // ✅ optional: don't pause
          draggable
          theme="light"
        />
      </Suspense>

    </>
  );
}
