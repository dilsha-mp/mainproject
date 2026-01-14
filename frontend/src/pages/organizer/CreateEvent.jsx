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
      alert("🎉 Event submitted for admin approval");
      navigate("/organizer/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        
        {/* Header */}
        <div className="border-b px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New Event
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to publish your event
          </p>
        </div>

        <form onSubmit={submitHandler} className="px-8 py-6 space-y-6">

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              name="description"
              rows="4"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option>Movies</option>
                <option>Sports</option>
                <option>Workshops</option>
                <option>Music</option>
                <option>Comedy</option>
                <option>Activities</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="location"
                required
                className="w-full border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
                onChange={handleChange}
              >
                <option value="">Select Location</option>
                <option>Kochi</option>
                <option>Trivandrum</option>
                <option>Kozhikode</option>
                <option>Thrissur</option>
                <option>Palakkad</option>
                <option>Kannur</option>
                <option>Kottayam</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="date"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Price (₹)
              </label>
              <input
                type="number"
                name="ticketPrice"
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Tickets
              </label>
              <input
                type="number"
                name="totalTickets"
                required
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image URL
            </label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.jpg"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Image Preview */}
          {form.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview</p>
              <img
                src={form.image}
                alt="Preview"
                className="h-40 rounded-lg object-cover border"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
