import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { Crown } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tickets, setTickets] = useState(1);
  const [isVip, setIsVip] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");

  /* ================= FETCH EVENT ================= */
  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-red-500 text-lg">Event not found</p>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const applyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoMessage("🎉 Promo applied! 10% discount");
    } else {
      setPromoApplied(false);
      setPromoMessage("❌ Invalid promo code");
    }
  };

  const basePrice = event.ticketPrice * tickets;
  const vipFee = isVip ? 500 * tickets : 0;
  const discount = promoApplied ? basePrice * 0.1 : 0;
  const finalPrice = Math.round(basePrice + vipFee - discount);

  const handleBookNow = () => {
    if (!user) return navigate("/login");
    if (event.availableTickets < tickets)
      return alert("Not enough tickets available");

    navigate(`/book/${event._id}`, {
      state: { tickets, isVip, finalPrice },
    });
  };

  return (
    <>
      {/* IMAGE HERO */}
      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video lg:aspect-[21/9] bg-gray-200 group">
          <img
            src={event.image || "https://via.placeholder.com/1600x900"}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-2xl md:text-4xl font-bold">{event.title}</h1>
            <p className="mt-2 text-gray-200">
              {formattedDate} • {event.location}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1240px] mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        
        {/* LEFT */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-2">About the Event</h2>
            <p className="text-gray-600">{event.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Event Details</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Category:</strong> {event.category}</li>
              <li><strong>Date:</strong> {formattedDate}</li>
              <li><strong>Venue:</strong> {event.location}</li>
              <li><strong>Available Tickets:</strong> {event.availableTickets}</li>
            </ul>
          </section>

          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Contact Organizer</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {event.organizer?.name || "Event Organizer"}
                </p>
                <p className="text-sm text-gray-500">
                  Have questions about this event?
                </p>
              </div>
              <button
                onClick={() => navigate(`/events/${event._id}/contact`)}
                className="px-6 py-3 border border-[#E31B23] text-[#E31B23] rounded-lg font-semibold hover:bg-red-50"
              >
                Contact Organizer
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white border rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Ticket Summary</h3>

            <p className="text-3xl font-bold text-[#E31B23] mt-2">
              ₹{finalPrice}
            </p>

            <div className="mt-4">
              <label className="text-sm font-semibold">Tickets</label>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => setTickets(Math.max(1, tickets - 1))} className="px-3 py-1 border rounded">−</button>
                <span className="font-bold">{tickets}</span>
                <button onClick={() => setTickets(Math.min(event.availableTickets, tickets + 1))} className="px-3 py-1 border rounded">+</button>
              </div>
            </div>

            <div
              onClick={() => setIsVip(!isVip)}
              className={`mt-5 p-4 rounded-xl border-2 cursor-pointer ${
                isVip ? "border-yellow-400 bg-yellow-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="text-yellow-500" />
                <div>
                  <p className="font-semibold">VIP Ticket</p>
                  <p className="text-sm text-gray-500">
                    Premium seating (+₹500 per ticket)
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full mt-6 py-3 rounded-lg bg-[#E31B23] text-white font-semibold hover:bg-red-600"
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
