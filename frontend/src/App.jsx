import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Layout */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Pages */
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import LoginForm from "./pages/LoginForm";
import PaymentPage from "./pages/PaymentPage";
import RegisterForm from "./pages/RegisterForm";

/* Organizer */
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";

/* Admin */
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

/* Route Guards */
import ProtectedRoute from "./routes/ProtectedRoute";
import OrganizerRoute from "./routes/OrganizerRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* ---------- User Protected ---------- */}
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* ---------- Organizer ---------- */}
        <Route
          path="/organizer/dashboard"
          element={
            <OrganizerRoute>
              <OrganizerDashboard />
            </OrganizerRoute>
          }
        />

        <Route
          path="/organizer/create-event"
          element={
            <OrganizerRoute>
              <CreateEvent />
            </OrganizerRoute>
          }
        />

        {/* ---------- Admin ---------- */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}
