import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function PendingEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const fetchPendingEvents = async () => {
        try {
            // ✅ Use only ONE endpoint
            const res = await api.get("/admin/pending");
            setEvents(res.data.data || []);
        } catch (err) {
            console.error("Error fetching pending events:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const approveEvent = async (id) => {
        const confirmApprove = window.confirm(
            "Are you sure you want to approve this event?"
        );

        if (!confirmApprove) return;

        try {
            await api.put(`/events/approve/${id}`);

            // Remove approved event from UI
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== id)
            );

            alert("Event Approved Successfully!");
        } catch (err) {
            console.error("Approve error:", err.message);
            alert("Failed to approve event");
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar active="Pending Events" />

            <div className="flex-1 p-10">
                <h2 className="text-2xl font-semibold mb-6">
                    Pending Management
                </h2>

                <div className="bg-white rounded-xl shadow p-6">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : events.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">
                            No pending events found.
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
                                            className="border-b last:border-none hover:bg-gray-50"
                                        >
                                            <td className="py-4 font-medium">
                                                {event.title}
                                            </td>

                                            <td>₹{event.ticketPrice}</td>

                                            <td>{event.location}</td>

                                            <td className="text-right">
                                                <button
                                                    onClick={() => approveEvent(event._id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition"
                                                >
                                                    Approve
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