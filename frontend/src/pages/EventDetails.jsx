import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
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

  if (!event || !event.isApproved) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-red-500">
          This event is not available
        </p>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleBookNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (event.availableTickets === 0) {
      alert("Tickets sold out");
      return;
    }

    navigate(`/booking/${event._id}`);
  };

  return (
    <>
      {/* 🔥 BANNER */}
      <div className="relative h-[320px] md:h-[420px]">
        <img
          src={event.image || "/placeholder.jpg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1240px] mx-auto px-4 pb-8 text-white w-full">
            <h1 className="text-2xl md:text-4xl font-bold">
              {event.title}
            </h1>

            <p className="mt-2 text-sm md:text-base">
              {formattedDate} • {event.location}
            </p>

            <button
              onClick={handleBookNow}
              className="mt-4 bg-[#E31B23] px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Book Tickets
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 CONTENT */}
      <div className="max-w-[1240px] mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              About the Event
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {event.description}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Event Details
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li><strong>Category:</strong> {event.category}</li>
              <li><strong>Date:</strong> {formattedDate}</li>
              <li><strong>Venue:</strong> {event.location}</li>
              <li>
                <strong>Available Tickets:</strong>{" "}
                {event.availableTickets} / {event.totalTickets}
              </li>
            </ul>
          </section>
        </div>

        {/* RIGHT */}
        <div className="border rounded-lg p-5 h-fit shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            Ticket Price
          </h3>

          <p className="text-2xl font-bold text-[#E31B23]">
            ₹{event.ticketPrice}
          </p>

          <button
            onClick={handleBookNow}
            disabled={event.availableTickets === 0}
            className={`w-full mt-4 py-3 rounded-md font-semibold transition ${
              event.availableTickets === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#E31B23] text-white hover:bg-red-600"
            }`}
          >
            {event.availableTickets === 0
              ? "Sold Out"
              : "Book Now"}
          </button>

          {!user && (
            <p className="text-xs text-gray-500 mt-2">
              Login required to book tickets
            </p>
          )}
        </div>
      </div>
    </>
  );
}
