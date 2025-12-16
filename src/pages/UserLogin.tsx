// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../assets/logo.png";
// import { apiUrl } from "../config";
// import { useAuth } from "../components/context/AuthContext";
// import { toast } from "react-toastify";

// export default function UserLogin() {
//   const [showPassword, setShowPassword] = useState(false);
//   const nav = useNavigate();

//   // ✅ change phone -> mobile (because API expects mobile)
//   const [form, setForm] = useState({ mobile: "", password: "" });

//   const { login: authLogin } = useAuth();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post(`${apiUrl}/User/login`, form);

//       if (res.data?.success) {
//         const token = res.data?.authorisation?.token;
//         const userData = res.data?.data;
//         authLogin(userData, token);
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         if (res?.data?.data?.id) localStorage.setItem("User_Id", String(res?.data?.data?.id));
//         toast.success(res.data?.message || "Login successful");
//         nav("/users");
//       } else {
//         alert(res.data?.message || "Login failed");
//       }
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Invalid credentials or server error");
//     }
//   };

//   return (
//     <div
//       className="relative h-screen w-full overflow-hidden flex items-center justify-center
// bg-gradient-to-br from-[#6fb1fc] via-[#4e85c5] to-[#2d4f73]"
//     >
//       <div className="absolute w-72 h-72 bg-white/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
//       <div className="absolute w-96 h-96 bg-[#ffe3c4]/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

//       <div
//         className="relative w-[380px] md:w-[420px]
//       bg-white/20 backdrop-blur-2xl border border-white/30
//       p-10 rounded-2xl shadow-2xl"
//       >
//         <div className="flex justify-center mb-4">
//           <div className="p-3 bg-white/60 rounded-xl shadow-lg backdrop-blur-md">
//             <img src={logo} alt="Logo" className="w-40" />
//           </div>
//         </div>

//         <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-sm">
//           User Login
//         </h2>

//         {/* MOBILE */}
//         <label className="text-white font-medium text-sm">Mobile Number</label>
//         <input
//           type="tel"
//           maxLength={10}
//           className="w-full p-3 border border-white/40 bg-white/20 text-white rounded-lg mt-1 mb-4 focus:ring-2 focus:ring-[#bf7e4e] outline-none placeholder-white/70"
//           placeholder="Enter mobile number"
//           value={form.mobile}
//           onChange={(e) => {
//             const val = e.target.value;
//             if (/^\d*$/.test(val)) setForm({ ...form, mobile: val });
//           }}
//         />

//         {/* PASSWORD */}
//         <label className="text-white font-medium text-sm">Password</label>
//         <div className="relative mb-6">
//           <input
//             type={showPassword ? "text" : "password"}
//             className="w-full p-3 pr-12 border border-white/40 bg-white/20 text-white rounded-lg mt-1 focus:ring-2 focus:ring-[#bf7e4e] outline-none placeholder-white/70"
//             placeholder="Enter password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />

//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>

//         <button
//           onClick={handleLogin}
//           className="w-full bg-[#bf7e4e] text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#a5663d] transition active:scale-95"
//         >
//           Login
//         </button>

//         <p className="text-center text-sm text-white/80 mt-4">
//           Forgot password?{" "}
//           <span className="text-white font-semibold cursor-pointer hover:underline">
//             Reset
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { apiUrl } from "../config";
import { useAuth } from "../components/context/AuthContext";
import { toast } from "react-toastify";

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  // API expects mobile
  const [form, setForm] = useState({ mobile: "", password: "" });

  const { login: authLogin } = useAuth();

  // ✅ LOGIN FUNCTION (used by Enter + Button)
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
        nav("/users");
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ ENTER KEY HANDLER
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

        {/* MOBILE */}
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

        {/* PASSWORD */}
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
          className={`w-full bg-[#bf7e4e] text-white py-3 rounded-lg font-semibold text-lg
          shadow-lg transition active:scale-95 ${loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#a5663d]"
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
