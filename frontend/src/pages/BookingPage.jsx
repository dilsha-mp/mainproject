import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { Crown } from "lucide-react";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Data from EventDetails
  const {
    tickets: initialTickets = 1,
    isVip: initialVip = false,
    finalPrice: initialFinalPrice,
  } = location.state || {};

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(initialTickets);
  const [isVip] = useState(initialVip);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH + FETCH ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => navigate("/"));
  }, [id, user, navigate]);

  if (!event) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ================= PRICE ================= */
  const basePrice = event.ticketPrice * tickets;
  const vipFee = isVip ? 500 * tickets : 0;
  const totalAmount =
    initialFinalPrice || Math.round(basePrice + vipFee);

  /* ================= BOOK ================= */
  const handleBooking = async () => {
    if (tickets > event.availableTickets) {
      alert("Not enough tickets available");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/bookings",
        {
          eventId: event._id,
          tickets,
          isVip,
          totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/payment/${res.data.booking._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Booking</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="md:col-span-2 border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-gray-500 mt-1">
            {event.location}
          </p>

          {/* TICKETS */}
          <div className="mt-6">
            <label className="font-semibold text-sm">
              Tickets
            </label>

            <div className="flex items-center gap-4 mt-2">
              <button
                disabled={tickets <= 1}
                onClick={() => setTickets((t) => t - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                −
              </button>

              <span className="text-lg font-bold">{tickets}</span>

              <button
                disabled={tickets >= event.availableTickets}
                onClick={() => setTickets((t) => t + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Available tickets: {event.availableTickets}
            </p>
          </div>

          {/* VIP INFO */}
          {isVip && (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-300">
              <Crown className="text-yellow-500" />
              <div>
                <p className="font-semibold">VIP Ticket Selected</p>
                <p className="text-sm text-gray-600">
                  Premium seating & benefits included
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="border rounded-xl p-6 bg-white shadow-lg h-fit">
          <h3 className="text-lg font-semibold mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tickets</span>
              <span>{tickets}</span>
            </div>

            <div className="flex justify-between">
              <span>Price per ticket</span>
              <span>₹{event.ticketPrice}</span>
            </div>

            {isVip && (
              <div className="flex justify-between text-yellow-600">
                <span>VIP Add-on</span>
                <span>₹{500 * tickets}</span>
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-[#E31B23]">
              ₹{totalAmount}
            </span>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full mt-6 bg-[#E31B23] text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
