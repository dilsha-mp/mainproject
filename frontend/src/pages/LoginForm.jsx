import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { loginSuccess } from "../redux/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email,
      password,
    });

    // Save auth to redux
    dispatch(loginSuccess(res.data));

    const role = res.data.user?.role;

    // Role-based redirect
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;

      case "organizer":
        navigate("/organizer/dashboard");
        break;

      case "user":
      default:
        navigate("/");
        break;
    }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">

        {/* Header */}
        <div className="border-b px-6 py-5 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Login to EvenEase
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Book tickets • Create events • Manage seamlessly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E31B23] text-white py-2.5 rounded-md font-semibold hover:bg-red-600 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            New to EvenEase?
            <Link
              to="/register"
              className="text-[#E31B23] font-semibold ml-1 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
