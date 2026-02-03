import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  IndianRupee,
  LogOut,
} from "lucide-react";

export default function OrganizerLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-red-600 mb-10">
          Organizer Panel
        </h2>

        <nav className="space-y-3">
          <SidebarLink to="/organizer/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarLink to="/organizer/events" icon={<Calendar />} label="My Events" />
          <SidebarLink to="/organizer/revenue" icon={<IndianRupee />} label="Revenue" />

          <button
            onClick={logout}
            className="flex items-center gap-3 text-gray-600 hover:text-red-600 mt-10"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg ${
          isActive
            ? "bg-red-100 text-red-600"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
