import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { apiUrl } from "../config";
import { useAuth } from "../components/context/AuthContext";


export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });

  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${apiUrl}/userlogin`, form);

      if (res.data.success) {
        const token = res.data.authorisation?.token;
        const userData = res.data.user || { phone: form.phone };
        authLogin(userData, token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        nav("/dashboard");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#a8dadc]">

      {/* Floating Blobs */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-[#bf7e4e]/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Login Card */}
      <div className="relative w-[380px] md:w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-40 drop-shadow-xl" />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-sm">
          User Login
        </h2>

        {/* PHONE NUMBER */}
        <label className="text-white font-medium text-sm">
          Phone Number
        </label>
        <input
          type="tel"
          maxLength={10}
          className="w-full p-3 border border-white/40 bg-white/20 text-white rounded-lg mt-1 mb-4 focus:ring-2 focus:ring-[#bf7e4e] outline-none placeholder-white/70"
          placeholder="Enter phone number"
          value={form.phone}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              setForm({ ...form, phone: val }); // allow only numbers
            }
          }}
        />

        {/* PASSWORD */}
        <label className="text-white font-medium text-sm">
          Password
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 pr-12 border border-white/40 bg-white/20 text-white rounded-lg mt-1 focus:ring-2 focus:ring-[#bf7e4e] outline-none placeholder-white/70"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Show/Hide Password */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
          >
            {showPassword ? (
                // Hide Password Icon
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
                // Show Password Icon
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
          className="w-full bg-[#bf7e4e] text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#a5663d] transition active:scale-95"
        >
          Login
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
