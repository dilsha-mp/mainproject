import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function Organizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const res = await api.get("/admin/organizers"); // backend route
      setOrganizers(res.data || []);
    } catch (err) {
      console.error("Error fetching organizers:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar active="Organizers" />

      <div className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">
          Organizers Management
        </h2>

        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : organizers.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No organizers found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role Status</th>
                  </tr>
                </thead>

                <tbody>
                  {organizers.map((organizer) => (
                    <tr
                      key={organizer._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium">
                        {organizer.name}
                      </td>

                      <td>{organizer.email}</td>

                      <td>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        Active   {organizer.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}