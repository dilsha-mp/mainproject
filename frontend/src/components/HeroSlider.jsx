import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
    {
        image: "https://t3.ftcdn.net/jpg/02/87/04/00/360_F_287040077_U2ckmhpzeyqDHiybj0dfCfX6NRCEKdoe.jpg",
        title: "Where Every Match Matters",
        subtitle: "Plan, manage, and track sports events in one place.",
        buttonText: "Explore More",
        position: "left",
    },
    {
        image: "https://fossbytes.com/wp-content/uploads/2019/06/hindi-movie-sites-.jpg",
        title: "The Ultimate Movie Event Platform",
        subtitle: "Manage movie premieres, screenings, and film events seamlessly. ",
        buttonText: "Explore More",
        position: "left",
    },
];

function HeroSlider() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    function redirectToEvents() {
        navigate("/events");
    }

    const currentSlide = slides[index];

    return (
        <div className="relative max-w-[1240px] mx-auto h-[260px] md:h-[360px] lg:h-[420px] rounded-xl overflow-hidden">

            {/* Slide Image */}
            <img
                src={currentSlide.image}
                alt={`slide-${index}`}
                className="w-full h-full object-cover object-center brightness-90 contrast-110 scale-105 transition-opacity duration-700 opacity-100"
            />

            {/* Soft Gradient Overlay */}
            <div
                className={`absolute inset-0 pointer-events-none ${currentSlide.position === "left"
                    ? "bg-gradient-to-r from-black/80 via-black/40 to-transparent"
                    : "bg-gradient-to-l from-black/80 via-black/40 to-transparent"
                    }`}
            />

            <div
                className={`absolute bottom-10 md:bottom-16 max-w-xl text-white space-y-3 ${currentSlide.position === "left"
                    ? "left-5 md:left-14 text-left"
                    : "right-5 md:right-14 text-right"
                    }`}
            >
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
                    {currentSlide.title}
                </h2>

                <p className="text-sm sm:text-base md:text-lg opacity-90">
                    {currentSlide.subtitle}
                </p>

                <button
                    onClick={() => redirectToEvents(true)}
                    className="inline-block mt-2 px-5 py-2.5 bg-[#E31B23] rounded-md text-sm md:text-base font-semibold hover:bg-red-600 transition"
                >
                    {currentSlide.buttonText}
                </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`cursor-pointer transition-all ${i === index
                            ? "w-6 h-2 bg-white rounded-full"
                            : "w-2 h-2 bg-gray-400 rounded-full"
                            }`}
                    />
                ))}
            </div>
        </div>)
}

export default HeroSlider;
