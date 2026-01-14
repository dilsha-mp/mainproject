import { useEffect, useState } from "react";
import axios from "../api/axios";
import CategoryChips from "../components/CategoryChips";
import EventCard from "../components/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const s = search.trim().toLowerCase();

    const okSearch =
      !s ||
      e.title.toLowerCase().includes(s) ||
      e.location.toLowerCase().includes(s);

    const okCategory = category === "All" || e.category === category;

    return okSearch && okCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Events in your city
          </h1>
          <p className="text-gray-500 mt-1">
            Discover movies, sports, workshops & live experiences
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-16 z-30 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for events, venues, cities..."
            className="w-full rounded-lg border px-4 py-3 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Categories */}
          <CategoryChips active={category} setActive={setCategory} />
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">
            Loading events...
          </p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-medium text-gray-700">
              No events found
            </p>
            <p className="text-gray-500 mt-2">
              Try changing filters or search keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
