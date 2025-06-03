// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_name: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/feed"); // or home page
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="user_name"
          placeholder="Username"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Log In
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      <div className="mt-6 text-center">
        <p className="text-sm">Don't have an account?</p>
        <button
          onClick={() => navigate("/register")}
          className="mt-2 text-blue-600 underline"
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
