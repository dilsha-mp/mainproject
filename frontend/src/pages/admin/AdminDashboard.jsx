import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";
import PendingEvents from "./PendingEvents";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/events?status=pending");
      setEvents(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const approveEvent = async (id) => {
    try {
      await api.put(`/events/approve/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
        <div className=" bg-gray-100 min-h-screen">
      <PendingEvents/>

  
    </div>
  );
}