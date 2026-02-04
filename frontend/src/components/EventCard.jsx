import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const eventDate = new Date(event.date);
  const isExpired = eventDate < new Date();

  const handleBook = () => {
    if (isExpired) return;

    if (!user) navigate("/login");
    else navigate(`/events/${event._id}`);
  };

  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const imageUrl =
    event.image ||
    "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg";

  return (
    <div
      onClick={handleBook}
      className={`group rounded-2xl overflow-hidden transition-all duration-300
      ${
        isExpired
          ? "bg-gray-100 opacity-70 cursor-not-allowed"
          : "bg-white shadow hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
      }`}
    >
      {/* ================= POSTER ================= */}
      <div className="relative h-[260px] overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          onError={(e) =>
            (e.target.src =
              "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg")
          }
          className={`w-full h-full object-cover transition duration-500 ${
            !isExpired && "group-hover:scale-110"
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full">
          {event.category}
        </span>

        {/* Price Tag */}
        <span className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
        </span>

        {/* Expired Badge */}
        {isExpired && (
          <span className="absolute top-3 right-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full">
            Expired
          </span>
        )}
      </div>

      {/* ================= DETAILS ================= */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-1">
          {event.title}
        </h3>

        <div className="flex items-center text-xs text-gray-500 gap-2">
          <MapPin size={13} />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 gap-2">
          <Calendar size={13} />
          {formattedDate}
        </div>

        {isExpired && (
          <div className="flex items-center text-xs text-red-500 gap-2 pt-1">
            <Clock size={13} />
            Event Ended
          </div>
        )}
      </div>
    </div>
  );
}
