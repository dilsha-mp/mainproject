import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return navigate("/login");
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id, user, navigate]);

  if (!event) return <div className="h-[60vh] flex items-center justify-center">Loading...</div>;

  const maxTickets = Math.min(event.availableTickets, 10);
  const totalAmount = tickets * event.ticketPrice;

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
        { eventId: event._id, tickets },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/payment/${res.data.booking._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Book Tickets</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border rounded-lg p-5">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-gray-500 mt-1">{event.location}</p>
          <div className="mt-6">
            <label className="font-medium">Select Tickets</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                disabled={tickets <= 1}
                onClick={() => setTickets((t) => t - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                −
              </button>
              <span className="text-lg font-semibold">{tickets}</span>
              <button
                disabled={tickets >= maxTickets}
                onClick={() => setTickets((t) => t + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Available tickets: {event.availableTickets}</p>
          </div>
        </div>

        <div className="border rounded-lg p-5 h-fit">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <p className="flex justify-between">
            <span>Tickets</span>
            <span>{tickets}</span>
          </p>
          <p className="flex justify-between mt-2">
            <span>Price</span>
            <span>₹{event.ticketPrice}</span>
          </p>
          <hr className="my-3" />
          <p className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </p>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full mt-4 bg-[#E31B23] text-white py-3 rounded-md font-semibold hover:bg-red-600 transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
