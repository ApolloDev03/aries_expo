import { useState } from "react";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    const res = await axios.post("/login", form);
    saveToken(res.data.token);
    nav("/admin");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={login}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
