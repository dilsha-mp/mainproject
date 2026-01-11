import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    ticketPrice: "",
    totalTickets: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", form);
      alert("Event submitted for approval");
      navigate("/organizer/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Event Description"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <select
          name="category"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option>Movies</option>
          <option>Sports</option>
          <option>Workshops</option>
          <option>Music</option>
          <option>Activities</option>
        </select>

        <select
          name="location"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        >
          <option value="">Select Location</option>
          <option>Kochi</option>
          <option>Trivandrum</option>
          <option>Kozhikode</option>
          <option>Thrissur</option>
          <option>Palakkad</option>
        </select>

        <input
          type="date"
          name="date"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="ticketPrice"
          placeholder="Ticket Price"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="totalTickets"
          placeholder="Total Tickets"
          required
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Submit Event
        </button>
      </form>
    </div>
  );
}
