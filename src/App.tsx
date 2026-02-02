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
            <Route path="add-exhivitor/:slug" element={<AddExhivitor />} />
            <Route path="/users/exhibitors-list/:label" element={<ExhibitorListDesign />} />
            <Route path="/users/exhibitor/edit/:id" element={<ExhibitorEditDesign />} />

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

            {/* CITY ROUTES */}
            <Route path="city" element={<CityList />} />

            {/* INDUSTRY ROUTES */}
            <Route path="industry" element={<IndustryList />} />

            <Route path="expo" element={<ExpoMaster />} />

            <Route path="department" element={<DepartmentMaster />} />

            <Route path="profile" element={<AdminProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />


            {/* USERS ROUTES */}
            <Route path="users" element={<UserList />} />
            <Route path="users/assign/:id" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />;
            <Route path="category" element={<CategoryMaster />} />
            <Route path="subcategory" element={<SubCategoryMaster />} />
            <Route path="users" element={<UserList />} />
            <Route path="report" element={<VisitorReportPage />} />;
            <Route path="visitor-category" element={<VisitorCategoryMaster />} />
            <Route path="form2" element={<DummyAdminPage />} />

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
