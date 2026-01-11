import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleBook = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/events/${event._id}`);
    }
  };

  return (
    <div
      className="group cursor-pointer rounded-lg overflow-hidden bg-white border hover:shadow-xl transition-all duration-300"
      onClick={handleBook}
    >
      {/* POSTER */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {event.category}
        </span>
      </div>

      {/* DETAILS */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm truncate">
          {event.title}
        </h3>

        <p className="text-xs text-gray-500">
          {event.location}
        </p>

        <p className="text-xs text-gray-500">
          {event.date}
        </p>

        <p className="text-sm font-semibold text-[#E31B23]">
          ₹{event.price}
        </p>
      </div>
    </div>
  );
}
