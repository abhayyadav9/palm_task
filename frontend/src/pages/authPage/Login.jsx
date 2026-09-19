import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(loginApi, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.data.status) {
        setUser(response.data.data);
        console.log("Login successful:", response.data.data);
        navigate("/home");
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Palm</h1>

          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Login</h2>

          <form onSubmit={login} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"

              className={`${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition`}
            >
               {
                loading ? "Loading..." : "Login"
            }
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`${
                loading ? "opacity-50 cursor-not-allowed" : "hover:underline"
              } text-blue-600 font-medium hover:underline`}
            >
            Create an account
          
            
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
