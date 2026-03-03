import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function OrganizerEvents() {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/events/my-events").then((res) => {
            setEvents(res.data);
            setLoading(false);
        });
    }, []);

    const filteredEvents = events.filter((e) =>
        filter === "all"
            ? true
            : filter === "approved"
                ? e.isApproved
                : !e.isApproved
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track approval status, ticket sales, and revenue
                    </p>
                </div>

                {/* Filter */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none w-48"
                >
                    <option value="all">All Events</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Approval</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading events...
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No events found for this filter.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
                            <tr>
                                <th className="p-4 text-left">Event</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Tickets Sold</th>
                                <th className="text-right p-4">Revenue</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEvents.map((e, index) => {
                                const sold = e.soldTickets ?? 0;
                                const revenue = e.revenue ?? 0;
                                return (
                                    <tr
                                        key={e._id}
                                        className={`border-t hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                            }`}
                                    >
                                        <td className="p-4 font-medium text-gray-800">
                                            {e.title}
                                        </td>

                                        <td className="text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${e.isApproved
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {e.isApproved ? "Approved" : "Pending"}
                                            </span>
                                        </td>

                                        <td className="text-center text-gray-700">
                                            {sold} / {e.totalTickets}
                                        </td>

                                        <td className="text-right p-4 font-semibold text-gray-800">
                                            ₹{revenue.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
