import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1561917488-91aa9bc0a3a7?q=80&w=1488&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Where Every Match Matters",
    subtitle: "Plan, manage, and track sports events in one place.",
    buttonText: "Explore Sports Events",
    position: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    title: "The Ultimate Movie Event Platform",
    subtitle: "Manage movie premieres, screenings, and film events seamlessly.",
    buttonText: "Explore Movie Events",
    position: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    title: "Host Unforgettable Live Shows",
    subtitle: "Create concerts, festivals, and entertainment events with ease.",
    buttonText: "Explore Live Events",
    position: "left",
  },
];

function HeroSlider() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  /* ---------------- Auto Slide ---------------- */
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  /* Stop auto when manual navigation happens */
  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    startAutoSlide();
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
    resetAutoSlide();
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetAutoSlide();
  };

  function redirectToEvents() {
    navigate("/events");
  }

  const currentSlide = slides[index];

  return (
    <div className="relative max-w-[1240px] mx-auto h-[260px] md:h-[360px] lg:h-[420px] rounded-xl overflow-hidden group">

      {/* Slide Image */}
      <img
        src={currentSlide.image}
        alt={currentSlide.title}
        className="w-full h-full object-cover object-center scale-105 transition-opacity duration-700"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 ${
          currentSlide.position === "left"
            ? "bg-gradient-to-r from-black/80 via-black/40 to-transparent"
            : "bg-gradient-to-l from-black/80 via-black/40 to-transparent"
        }`}
      />

      {/* Slide Content */}
      <div
        className={`absolute bottom-10 md:bottom-16 max-w-xl text-white space-y-4 transition-all duration-700 ${
          currentSlide.position === "left"
            ? "left-5 md:left-14 text-left animate-slideUp"
            : "right-5 md:right-14 text-right animate-slideUp"
        }`}
      >
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
          {currentSlide.title}
        </h2>

        <p className="text-sm sm:text-base md:text-lg opacity-90">
          {currentSlide.subtitle}
        </p>

        <button
          onClick={redirectToEvents}
          className="inline-block mt-2 px-6 py-3 bg-[#E31B23] rounded-lg text-sm md:text-base font-semibold hover:bg-red-600 transition"
        >
          {currentSlide.buttonText}
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={26} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={26} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => {
              setIndex(i);
              resetAutoSlide();
            }}
            className={`cursor-pointer transition-all ${
              i === index
                ? "w-6 h-2 bg-white rounded-full"
                : "w-2 h-2 bg-gray-400 rounded-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;
