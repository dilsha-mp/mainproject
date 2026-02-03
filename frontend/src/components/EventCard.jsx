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

    if (!user) {
      navigate("/login");
    } else {
      navigate(`/events/${event._id}`);
    }
  };

  // ✅ Format date
  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // ✅ Safe image handling
  const imageUrl = event.image
    ? event.image
    : "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg";

  return (
    <div
      onClick={handleBook}
      className={`group rounded-lg overflow-hidden border transition-all duration-300
        ${
          isExpired
            ? "bg-gray-100 opacity-70 cursor-not-allowed"
            : "bg-white hover:shadow-xl cursor-pointer"
        }`}
    >
      {/* POSTER */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          onError={(e) => {
            e.target.src =
              "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg";
          }}
          className={`w-full h-full object-cover transition duration-500
            ${!isExpired && "group-hover:scale-110"}`}
        />

        {/* CATEGORY */}
        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {event.category}
        </span>

        {/* PRICE */}
        <span className="absolute bottom-2 left-2 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
          {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
        </span>

        {/* EXPIRED BADGE */}
        {isExpired && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Expired
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm truncate text-gray-900">
          {event.title}
        </h3>

        <p className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin size={12} />
          {event.location}
        </p>

        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar size={12} />
          {formattedDate}
        </p>

        {/* EXPIRED TEXT */}
        {isExpired && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <Clock size={12} />
            Event has ended
          </p>
        )}
      </div>
    </div>
  );
}
