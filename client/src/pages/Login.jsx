import React from "react";
import { useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      formData.role === "Employer"
        ? "/employer/login"
        : "/employee/login";
    try {
      const res = await api.post(
        url,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      toast.success("Login successful");
      if (formData.role === "Employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Login failed: ${error.response?.data?.message}`);
    }
  };
  return (
    <div className="flex justify-center items-center h-160 text-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-gray-700 p-10 rounded-2xl space-y-4 w-full max-w-lg shadow-2xl"
      >
        <h2 className="flex justify-center text-4xl font-bold">Log In</h2>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="p-3 rounded-2xl bg-gray-600 outline-0"
        >
          <option value="Employee">Employee</option>
          <option value="Employer">Employer</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded-2xl bg-gray-600 outline-0"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="p-3 rounded-2xl bg-gray-600 outline-0"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-2xl font-bold"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
