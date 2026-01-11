import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events/pending").then((res) => {
      setEvents(res.data);
    });
  }, []);

  const approveEvent = async (id) => {
    await api.put(`/events/approve/${id}`);
    setEvents(events.filter((e) => e._id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No pending events</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500">
                  Organizer: {event.organizer?.name}
                </p>
              </div>

              <button
                onClick={() => approveEvent(event._id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
