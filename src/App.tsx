import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CityList from "./pages/city/CityList";
import IndustryList from "./pages/Industry/IndustryList";
import IndustryForm from "./pages/Industry/ IndustryForm";
import ExpoList from "./pages/Expo/ExpoList";
import ExpoForm from "./pages/Expo/ ExpoForm";
import UserList from "./pages/Users/UserList";
import UserForm from "./pages/Users/UserForm";
import Logout from "./pages/Logout";
import DummyAdminPage from "./pages/Form/Formlist";



export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="industry/add" element={<IndustryForm />} />
          <Route path="industry/edit/:id" element={<IndustryForm />} />

          {/* EXPO ROUTES */}
          <Route path="expo" element={<ExpoList />} />
          <Route path="expo/add" element={<ExpoForm />} />
          <Route path="expo/edit/:id" element={<ExpoForm />} />

          {/* USERS ROUTES */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />;

          <Route path="form2" element={<DummyAdminPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
