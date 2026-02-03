import { useEffect, useState, useMemo } from "react";
import HeroSlider from "../components/HeroSlider";
import CategoryChips from "../components/CategoryChips";
import EventCard from "../components/EventCard";
import api from "../api/axios";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("soonest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- Filter + Sort ---------------- */
  const filteredEvents = useMemo(() => {
    let data =
      activeCategory === "All"
        ? [...events]
        : events.filter((event) => event.category === activeCategory);

    if (sortBy === "soonest") data.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "priceLow") data.sort((a, b) => a.ticketPrice - b.ticketPrice);
    if (sortBy === "priceHigh") data.sort((a, b) => b.ticketPrice - a.ticketPrice);

    return data;
  }, [events, activeCategory, sortBy]);

  return (
    <>
      <HeroSlider />

      {/* ---------------- Category + Sort ---------------- */}
      <div className="max-w-[1240px] mx-auto px-4 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CategoryChips active={activeCategory} setActive={setActiveCategory} />

        {/* Sort Dropdown */}
        <div className="relative w-48">
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

      <div className="max-w-[1240px] mx-auto px-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === "All" ? "Recommended Events" : `${activeCategory} Events`}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-gray-500">No events available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
