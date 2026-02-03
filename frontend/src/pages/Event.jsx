import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import CategoryChips from "../components/CategoryChips";
import EventCard from "../components/EventCard";
import { Search, ChevronDown } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("soonest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- Filter + Sort ---------------- */
  const filteredEvents = useMemo(() => {
    let data = [...events];
    const s = search.trim().toLowerCase();

    data = data.filter((e) => {
      const okSearch =
        !s ||
        e.title.toLowerCase().includes(s) ||
        e.location.toLowerCase().includes(s);
      const okCategory = category === "All" || e.category === category;
      return okSearch && okCategory;
    });

    if (sortBy === "soonest") data.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "priceLow") data.sort((a, b) => a.ticketPrice - b.ticketPrice);
    if (sortBy === "priceHigh") data.sort((a, b) => b.ticketPrice - a.ticketPrice);

    return data;
  }, [events, search, category, sortBy]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ---------------- HERO ---------------- */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Events & Experiences
            </h1>
            <p className="text-gray-500 mt-1">
              Discover concerts, comedy shows, workshops & more
            </p>
          </div>

          {/* Compact search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, artists..."
              className="w-full rounded-full border px-10 py-2 text-sm shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* ---------------- FILTER STRIP ---------------- */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Categories */}
          <CategoryChips active={category} setActive={setCategory} />

          {/* Sort Dropdown */}
          <div className="relative inline-block w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-md border px-4 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
            >
              <option value="soonest">Soonest First</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ---------------- EVENTS GRID ---------------- */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-gray-700">
              No events found
            </p>
            <p className="text-gray-500 mt-1">
              Try adjusting your filters or search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
