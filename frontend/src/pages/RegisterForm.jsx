import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        role: form.role === "organizer" ? "organizer" : "user",
      };

      await api.post("/auth/register", payload);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">

        {/* Header */}
        <div className="border-b px-6 py-5 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create your EvenEase account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Join events • Host events • Experience more
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Register as
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="user">User (Book Events)</option>
              <option value="organizer">Organizer (Create Events)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E31B23] text-white py-2.5 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="border-t px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="text-[#E31B23] font-semibold ml-1 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
