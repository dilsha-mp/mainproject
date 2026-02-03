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
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch event details
  useEffect(() => {
    api
      .get("/events/my-events")
      .then((res) => {
        const event = res.data.find((e) => e._id === id);
        if (!event) {
          navigate("/organizer/dashboard");
          return;
        }

        // 🔒 Disable edit after approval
        if (event.isApproved) {
          alert("Approved events cannot be edited");
          navigate("/organizer/dashboard");
          return;
        }

        setForm({
          title: event.title,
          description: event.description,
          category: event.category,
          location: event.location,
          date: event.date.split("T")[0],
          ticketPrice: event.ticketPrice,
          image: event.image,
        });
      })
      .catch((err) => {
        console.error("Fetch event error:", err);
        navigate("/organizer/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/events/${id}`, form);
      alert("Event updated successfully and sent for approval");
      navigate("/organizer/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
        <p className="text-gray-500 mt-1">
          Update your event information and submit for approval
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={submitHandler}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-6"
      >
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Event Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Event Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category & Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option>Movies</option>
              <option>Sports</option>
              <option>Workshops</option>
              <option>Comedy</option>
              <option>Music</option>
              <option>Activities</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Location
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option>Kochi</option>
              <option>Trivandrum</option>
              <option>Kozhikode</option>
              <option>Thrissur</option>
              <option>Palakkad</option>
            </select>
          </div>
        </div>

        {/* Date & Price */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ticket Price (₹)
            </label>
            <input
              type="number"
              name="ticketPrice"
              value={form.ticketPrice}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Event Image URL
          </label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/organizer/dashboard")}
            className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => setShowPreview(true)}
            className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Preview
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">Event Preview</h2>

            {form.image && (
              <img
                src={form.image}
                alt="Event"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-lg font-semibold">{form.title}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {form.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <p><strong>Category:</strong> {form.category}</p>
              <p><strong>Location:</strong> {form.location}</p>
              <p><strong>Date:</strong> {form.date}</p>
              <p><strong>Price:</strong> ₹{form.ticketPrice}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
