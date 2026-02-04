export default function Footer() {
  return (
    <footer className="bg-[#1f2533] text-gray-400">
      <div className="max-w-3xl mx-auto px-4 py-5 text-center space-y-1">

        {/* Brand */}
        <h2 className="text-lg font-semibold text-white">
          EvenEase
        </h2>

        {/* Tagline */}
        <p className="text-sm text-gray-400">
          Simplifying event discovery and bookings
        </p>

        {/* Copyright */}
        <p className="text-xs text-gray-500 pt-1">
          © 2026 EvenEase. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
