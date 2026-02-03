import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OrganizerRevenue() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await api.get("/events/my-events");

        const chartData = res.data.map((e) => ({
          name: e.title,
          revenue: e.ticketPrice * (e.soldTickets || 0),
        }));

        setData(chartData);
      } catch (err) {
        console.error("Revenue API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Revenue Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Revenue generated per event
        </p>
      </div>

      {/* Card */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 h-[360px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading revenue data...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <Tooltip
                formatter={(value) =>
                  `₹${value.toLocaleString("en-IN")}`
                }
              />
              <Bar dataKey="revenue" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
