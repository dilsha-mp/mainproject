import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then((res) => {
      setBookings(res.data);
    });
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">
                  {b.event.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Tickets: {b.tickets}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  b.paymentStatus === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {b.paymentStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
