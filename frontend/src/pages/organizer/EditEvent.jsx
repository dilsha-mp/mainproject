import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    ticketPrice: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/my-events`).then((res) => {
      const event = res.data.find((e) => e._id === id);
      if (!event) return navigate("/organizer/dashboard");

      setForm({
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        date: event.date.split("T")[0],
        ticketPrice: event.ticketPrice,
        image: event.image,
      });
      setLoading(false);
    });
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form with ID:", id, "and data:", form);
      const res = await api.put(`/events/${id}`, form);
      console.log("SUCCESS RESPONSE:", res.data);
      alert(res.data.message || "Event updated & sent for approval");
      navigate("/organizer/dashboard");
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Full error:", JSON.stringify(error.response?.data, null, 2));
      alert(error.response?.data?.message || error.message || "Failed to update event");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

      <form
        onSubmit={submitHandler}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Event Title"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Description"
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option>Movies</option>
            <option>Sports</option>
            <option>Workshops</option>
            <option>Comedy</option>
            <option>Music</option>
            <option>Activities</option>
          </select>

          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option>Kochi</option>
            <option>Trivandrum</option>
            <option>Kozhikode</option>
            <option>Thrissur</option>
            <option>Palakkad</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          <input
            type="number"
            name="ticketPrice"
            value={form.ticketPrice}
            onChange={handleChange}
            className="border p-3 rounded"
            placeholder="Ticket Price"
          />
        </div>

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Image URL"
        />

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/organizer/dashboard")}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
}
