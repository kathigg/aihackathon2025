// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    role: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isMilitaryEmail, setIsMilitaryEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });

    if (name === "email") {
      setIsMilitaryEmail(value.trim().toLowerCase().endsWith(".mil"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/register", form, {
        headers: { "Content-Type": "application/json" }
      });
      const user = {
        ...form,
        karma_points: 15,
        verified_dod: form.email.toLowerCase().endsWith(".mil")
      };
      
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/login");
      
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Backend error:", err.response?.data);
          setError(err.response?.data?.error || "Registration failed");
        } else {
          console.error("Unexpected error:", err);
          setError("Unexpected error occurred");
        }
      }
    
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="first_name" placeholder="First Name" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="user_name" placeholder="Username" onChange={handleChange} className="w-full border p-2 rounded" required />
        <div className="relative">
  <input
    name="email"
    type="email"
    placeholder="Email"
    onChange={handleChange}
    className="w-full border p-2 rounded pr-28"
    required
  />
  {isMilitaryEmail && (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-green-600 text-sm">
      <span className="text-lg">✅</span>
      <span>Verified</span>
    </div>
  )}
</div>

        <input name="role" placeholder="Role (e.g. warfighter, technologist)" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <button className="text-blue-600 underline" onClick={() => navigate("/login")}>
          Log in
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;

