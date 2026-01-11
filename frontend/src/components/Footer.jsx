import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1f2533] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              EvenEase
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop platform to discover, book and manage events.
              Experience seamless and secure event bookings with EvenEase.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3 uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3 uppercase tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} EvenEase. All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">
            Made with ❤️ for events
          </p>
        </div>

      </div>
    </footer>
  );
}
