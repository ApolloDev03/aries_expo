import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { apiUrl } from "../config";
import { toast } from "react-toastify";
import { useAdminAuth } from "../components/context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const { adminLogin: authLogin } = useAdminAuth();

  const handleLogin = async () => {
    if (loading) return;

    // ✅ basic validation
    if (!form.email?.trim() || !form.password?.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/adminlogin`, form);

      if (res.data?.success) {
        const token = res.data?.authorisation?.token;

        if (!token) {
          toast.error("Token not found in response");
          return;
        }

        // If API returns user details, use that
        const userData = res.data.user || res.data.data || { email: form.email };

        // ✅ This will set state + localStorage (user + artoken)
        authLogin(userData, token);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        if (res?.data?.data?.id) {
          localStorage.setItem("admin_id", String(res?.data?.data?.id));
        }

        toast.success(res.data?.message || "Login successful");
        nav("/admin");
      } else {
        const msg = res.data?.message || res.data?.error || "Login failed";
        toast.error(msg);
      }
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enter key triggers login
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE – Branding Section */}
      <div className="hidden md:flex flex-col justify-center items-start px-16 bg-[#bf7e4e] text-white">
        <img src={logo} alt="Logo" className="w-60 h-30 mb-6 drop-shadow-xl" />

        <h1 className="text-4xl font-bold leading-tight">Welcome Back</h1>
        <p className="mt-3 text-lg text-white/90">
          Access the admin dashboard to manage users, data, analytics, and more.
        </p>

        <div className="mt-8 space-y-3">
          <p className="flex items-center gap-2 text-white/90">✔ Fast & Secure Login</p>
          <p className="flex items-center gap-2 text-white/90">
            ✔ Manage Everything in One Place
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – Login Form */}
      <div className="flex justify-center items-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-16" />
          </div>

          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Admin Login
          </h2>

          {/* EMAIL */}
          <label className="text-gray-700 font-medium text-sm">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg mt-1 mb-4 outline-none focus:ring-2 focus:ring-[#bf7e4e]"
            placeholder="admin@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {/* PASSWORD */}
          <label className="text-gray-700 font-medium text-sm">Password</label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-12 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-[#bf7e4e]"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5
                    c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 
                    4.5c4.756 0 8.773 3.162 10.065 7.5a10.52 10.52 0 01-4.293 
                    5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 
                    7.894L21 21m-3.228-3.228l-3.65-3.65M9.878 
                    9.878A3 3 0 0114.12 14.12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 
                    7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.964 
                    7.178.07.207.07.431 0 .639C20.577 
                    16.49 16.64 19.5 12 19.5c-4.638 
                    0-8.575-3.01-9.964-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full bg-[#bf7e4e] text-white py-3 rounded-lg font-semibold transition ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Forgot password?{" "}
            <span className="text-[#bf7e4e] cursor-pointer hover:underline">
              Reset
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

