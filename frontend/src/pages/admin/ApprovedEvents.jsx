import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function ApprovedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

 const fetchApprovedEvents = async () => {
  try {
    const res = await api.get("/admin/approved");

    
    setEvents(res.data.data || []);

  } catch (err) {
    console.error("Error fetching approved events:", err.message);
    setEvents([]); // optional safety
  } finally {
    setLoading(false);
  }
};

  const unapproveEvent = async (id) => {
    //  Confirmation BEFORE API call
    const confirmUnapprove = window.confirm(
      "Are you sure you want to unapprove this event?"
    );

    // ❌ If Cancel clicked → stop
    if (!confirmUnapprove) return;

    try {
      await api.put(`/events/reject/${id}`);

      //  Remove event from UI
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== id)
      );

      alert("Event Unapproved Successfully!");
    } catch (err) {
      console.error("Unapprove error:", err.message);
      alert("Failed to unapprove event");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar active="Approved Events" />

      <div className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">
          Approved Events
        </h2>

        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No approved events found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Name / Title</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium">
                        {event.title}
                      </td>

                      <td>₹{event.ticketPrice}</td>

                      <td>{event.location}</td>

                      <td className="text-right">
                        <button
                          onClick={() => unapproveEvent(event._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition"
                        >
                          Unapprove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}