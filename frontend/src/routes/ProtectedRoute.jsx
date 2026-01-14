import { Navigate, Outlet } from "react-router-dom";

// allowedRoles: array of roles that can access this route
export default function ProtectedRoute({ allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user")); // adjust if using context or redux

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
