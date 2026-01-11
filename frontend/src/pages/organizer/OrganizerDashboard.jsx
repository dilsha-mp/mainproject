import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events/my-events").then((res) => {
      setEvents(res.data);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Organizer Dashboard</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events created yet</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover rounded"
              />
              <h2 className="font-semibold mt-2">{event.title}</h2>
              <p className="text-sm text-gray-500">{event.category}</p>

              <p className="text-sm mt-1">
                Tickets Left: {event.availableTickets}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                  event.isApproved
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {event.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
