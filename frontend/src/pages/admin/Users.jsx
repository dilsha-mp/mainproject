import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users"); // make sure backend route exists
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar active="Users" />

      <div className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">
          Users Management
        </h2>

        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium">
                        {user.name}
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          Active {user.status}
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