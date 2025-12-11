import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CityList from "./pages/city/CityList";
import IndustryList from "./pages/Industry/IndustryList";



import UserList from "./pages/Users/UserList";
import UserForm from "./pages/Users/UserForm";
import Logout from "./pages/Logout";
import DummyAdminPage from "./pages/Form/Formlist";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpoMaster from "./pages/expo/ExpoList";
import DepartmentMaster from "./pages/department/DepartmentList";



export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
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

          {/* USERS ROUTES */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />;

          <Route path="form2" element={<DummyAdminPage />} />

        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
