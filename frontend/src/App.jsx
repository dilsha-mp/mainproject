import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

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
import Event from "./pages/Event";
import ContactOrganizer from "./pages/ContactOrganizer";

/* Organizer */
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import OrganizerLayout from "./pages/organizer/OrganizerLayout";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import OrganizerRevenue from "./pages/organizer/OrganizerRevenue";

/* Admin */
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

/* Route Guard */
import ProtectedRoute from "./routes/ProtectedRoute";

function Layout({ children }) {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/organizer");

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* ---------- Public ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Event />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/contact" element={<ContactOrganizer />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* ---------- Authenticated ---------- */}
          <Route element={<ProtectedRoute allowedRoles={["user", "organizer", "admin"]} />}>
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* ---------- Organizer ---------- */}
          <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
            <Route element={<OrganizerLayout />}>
              <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
              <Route path="/organizer/events" element={<OrganizerEvents />} />
              <Route path="/organizer/revenue" element={<OrganizerRevenue />} />
              <Route path="/organizer/create-event" element={<CreateEvent />} />
              <Route path="/organizer/edit-event/:id" element={<EditEvent />} />
            </Route>
          </Route>

          {/* ---------- Admin ---------- */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

        </Routes>
      </Layout>
    </Router>
  );
}
