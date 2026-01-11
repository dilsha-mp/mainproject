import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useState } from "react";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT – LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#E11C2A]"
        >
          EventEase
        </Link>

        {/* CENTER – NAV LINKS */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-800">
          <Link className="hover:text-[#E11C2A]" to="/">
            Home
          </Link>

        
            <Link className="hover:text-[#E11C2A]" to="/events">
              Find Events
            </Link>
          

          {user?.role === "organizer" && (
            <Link className="hover:text-[#E11C2A]" to="/organizer/create-event">
              Create Events
            </Link>
          )}
        </nav>

        {/* RIGHT – AUTH & BOOKINGS */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <Link
              to="/bookings"
              className="text-gray-700 hover:text-[#E11C2A]"
            >
              My Bookings
            </Link>
          )}

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#E11C2A] text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
              className="border px-4 py-1.5 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>

          {user && (
            <Link to="/events" onClick={() => setOpen(false)}>
              Find Events
            </Link>
          )}

          {user?.role === "organizer" && (
            <Link to="/create-event" onClick={() => setOpen(false)}>
              Create Events
            </Link>
          )}

          {user && (
            <Link to="/bookings" onClick={() => setOpen(false)}>
              My Bookings
            </Link>
          )}

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#E11C2A] text-white py-2 rounded-md"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => {
                dispatch(logout());
                setOpen(false);
              }}
              className="w-full border py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
