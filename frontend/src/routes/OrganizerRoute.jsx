import { Navigate } from "react-router-dom";

export default function OrganizerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "organizer") {
    return <Navigate to="/login" />;
  }

  return children;
}
