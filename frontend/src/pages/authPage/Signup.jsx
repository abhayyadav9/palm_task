import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../services/api";
import axios from "axios";
// import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(registerApi, formData);

      if (response.data.status) {
        alert("Account created successfully");
        navigate("/");
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Palm Chat
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Create Account
          </h2>

          <form onSubmit={register} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition mt-2"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;