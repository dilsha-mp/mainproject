import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useState } from "react";
import {
  Menu,
  X,
  Ticket,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-[#E31B23]"
        >
          EventEase
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-800">
          <Link to="/" className="hover:text-[#E31B23] transition">
            Home
          </Link>

          <Link to="/events" className="hover:text-[#E31B23] transition">
            Find Events
          </Link>

          {user?.role === "organizer" && (
            <Link
              to="/organizer/dashboard"
              className="flex items-center gap-1 text-[#E31B23] font-semibold"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-[#E31B23] font-semibold"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <Link
              to="/my-bookings"
              className="flex items-center gap-1 text-gray-700 hover:text-[#E31B23]"
            >
              <Ticket size={18} />
              My Bookings
            </Link>
          )}

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#E31B23] text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
              className="flex items-center gap-1 border px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-4 text-gray-800">

            <MobileLink to="/" label="Home" setOpen={setOpen} />
            <MobileLink to="/events" label="Find Events" setOpen={setOpen} />

            {user?.role === "organizer" && (
              <MobileLink
                to="/organizer/dashboard"
                label="Organizer Dashboard"
                setOpen={setOpen}
              />
            )}

            {user?.role === "admin" && (
              <MobileLink
                to="/admin/dashboard"
                label="Admin Dashboard"
                setOpen={setOpen}
              />
            )}

            {user && (
              <MobileLink
                to="/my-bookings"
                label="My Bookings"
                setOpen={setOpen}
              />
            )}

            <div className="pt-3 border-t">
              {!user ? (
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#E31B23] text-white py-2.5 rounded-md font-semibold"
                >
                  <LogIn size={18} />
                  Login / Register
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(logout());
                    setOpen(false);
                    navigate("/");
                  }}
                  className="w-full flex items-center justify-center gap-2 border py-2.5 rounded-md"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}

/* MOBILE LINK COMPONENT */
function MobileLink({ to, label, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="block font-medium hover:text-[#E31B23]"
    >
      {label}
    </Link>
  );
}
