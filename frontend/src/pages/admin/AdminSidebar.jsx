import { CheckCircle, Clock, Users, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ active }) {
  const navigate = useNavigate();

  const menu = [
    { name: "Pending Events", icon: <Clock size={18} />, path: "/admin/pending" },
    { name: "Approved Events", icon: <CheckCircle size={18} />, path: "/admin/approved" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { name: "Organizers", icon: <User size={18} />, path: "/admin/organizers" },
  ];

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to home
    navigate("/", { replace: true });
  };

  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-6">
      <h1 className="text-xl font-bold text-red-600 mb-8">Admin Panel</h1>

      <ul className="space-y-3">
        {menu.map((item) => (
          <li
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm font-medium
              ${
                active === item.name
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.name}
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t pt-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
        >
          <LogOut size={18} />
          Go To Home
        </button>
      </div>
    </div>
  );
}