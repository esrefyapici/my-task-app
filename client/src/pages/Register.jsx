import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import toast from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyCode: "",
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
        ? "/employer/register"
        : "/employee/register";
    try {
      const res = await api.post(url, {
        email: formData.email,
        password: formData.password,
        companyCode: formData.companyCode,
      });
      toast.success("registration successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(`Registration failed: ${error.response?.data?.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-160 text-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-gray-700 p-10 rounded-2xl space-y-4 w-full max-w-lg shadow-2xl"
      >
        <h2 className="flex justify-center text-4xl font-bold">Register</h2>
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
        <input
          type="text"
          name="companyCode"
          placeholder="Company Code"
          required
          value={formData.companyCode}
          onChange={handleChange}
          className="p-3 rounded-2xl bg-gray-600 outline-0"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-2xl font-bold"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
