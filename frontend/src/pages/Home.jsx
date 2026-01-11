import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import CategoryChips from "../components/CategoryChips";
import EventCard from "../components/EventCard";
import api from "../api/axios";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api.get("/events").then((res) => {
      setEvents(res.data);
    });
  }, []);

  // 🔥 FILTER LOGIC
  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter(
          (event) => event.category === activeCategory
        );

  return (
    <>
      <HeroSlider />

      <CategoryChips
        active={activeCategory}
        setActive={setActiveCategory}
      />

      {/* EVENTS SECTION */}
      <div className="max-w-[1240px] mx-auto px-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === "All"
            ? "Recommended Events"
            : `${activeCategory} Events`}
        </h2>

        {filteredEvents.length === 0 ? (
          <p className="text-gray-500">
            No events available.
          </p>
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
