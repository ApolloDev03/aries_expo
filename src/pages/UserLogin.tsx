import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { apiUrl } from "../config";
import { toast } from "react-toastify";
import { useUserAuth } from "../components/context/UserAuthContext";

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const { userLogin: authLogin } = useUserAuth();

  const handleLogin = async () => {
    if (loading) return;

    if (!form.mobile || !form.password) {
      toast.error("Please enter mobile number and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/User/login`, form);

      if (res.data?.success) {
        const token = res.data?.authorisation?.token;
        const userData = res.data?.data;

        if (!token) {
          toast.error("Token not found");
          return;
        }

        authLogin(userData, token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        if (userData?.id) {
          localStorage.setItem("User_Id", String(userData.id));
        }

        toast.success(res.data?.message || "Login successful");

        // direct dashboard open
        nav("/users");
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex items-center justify-center
      bg-gradient-to-br from-[#6fb1fc] via-[#4e85c5] to-[#2d4f73]"
    >
      <div className="absolute w-72 h-72 bg-white/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-[#ffe3c4]/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <div
        className="relative w-[380px] md:w-[420px]
        bg-white/20 backdrop-blur-2xl border border-white/30
        p-10 rounded-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/60 rounded-xl shadow-lg backdrop-blur-md">
            <img src={logo} alt="Logo" className="w-40" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-sm">
          User Login
        </h2>

        <label className="text-white font-medium text-sm">
          Mobile Number
        </label>
        <input
          type="tel"
          maxLength={10}
          className="w-full p-3 border border-white/40 bg-white/20 text-white rounded-lg mt-1 mb-4
          focus:ring-2 focus:ring-[#bf7e4e] outline-none placeholder-white/70"
          placeholder="Enter mobile number"
          value={form.mobile}
          disabled={loading}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              setForm({ ...form, mobile: val });
            }
          }}
          onKeyDown={handleKeyDown}
        />

        <label className="text-white font-medium text-sm">Password</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 pr-12 border border-white/40 bg-white/20 text-white rounded-lg mt-1
            focus:ring-2 focus:ring-[#bf7e4e] outline-none placeholder-white/70"
            placeholder="Enter password"
            value={form.password}
            disabled={loading}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
            disabled={loading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full bg-[#bf7e4e] text-white py-3 rounded-lg font-semibold text-lg
          shadow-lg transition active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#a5663d]"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-white/80 mt-4">
          Forgot password?{" "}
          <span className="text-white font-semibold cursor-pointer hover:underline">
            Reset
          </span>
        </p>
      </div>
    </div>
  );
}