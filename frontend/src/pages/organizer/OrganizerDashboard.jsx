import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  Calendar,
  IndianRupee,
} from "lucide-react";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await api.get("/events/my-events");
    setEvents(res.data);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  const totalRevenue = events.reduce(
    (sum, e) => sum + e.ticketPrice * (e.soldTickets || 0),
    0
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-red-600 mb-10">
          Organizer panel
        </h2>

        <nav className="space-y-4">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
          <SidebarItem icon={<Calendar />} label="My Events" />
          <SidebarItem icon={<IndianRupee />} label="Revenue" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-gray-500">
              Manage your events professionally
            </p>
          </div>

          <button
            onClick={() => navigate("/organizer/create-event")}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            <Plus size={18} />
            Create Event
          </button>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Events" value={events.length} />
          <StatCard
            title="Approved Events"
            value={events.filter(e => e.isApproved).length}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue}`}
          />
        </div>

        {/* EVENT TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Event</th>
                <th>Status</th>
                <th>Tickets Sold</th>
                <th>Revenue</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map(event => (
                <tr key={event._id} className="border-t">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-12 w-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {event.category} • {event.location}
                      </p>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td>
                    {event.soldTickets || 0} / {event.totalTickets}
                  </td>

                  <td>
                    ₹{event.ticketPrice * (event.soldTickets || 0)}
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/organizer/edit-event/${event._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => deleteEvent(event._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No events created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* COMPONENTS */

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
        active
          ? "bg-red-100 text-red-600"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
