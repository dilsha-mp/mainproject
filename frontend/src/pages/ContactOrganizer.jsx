import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader,
  CheckCircle,
  CalendarDays
} from "lucide-react";

export default function ContactOrganizer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  /* FETCH EVENT */
  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => navigate("/events"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await api.post(`/events/${id}/contact-organizer`, form);
      console.log("Contact response:", response.data);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      
      // Auto-reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
      
      // Set specific error message
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.code === "NETWORK_ERROR") {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("Failed to send message. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-red-600 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — CONTACT INFO */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-red-600" />
                </span>
                Contact Info
              </h3>

              <div className="space-y-5 text-sm text-slate-600">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Email Us</p>
                    <p>{event.organizer?.email || "organizer@email.com"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Call Us</p>
                    <p>{event.organizer?.phone || "+91 9876543210"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Office</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* EVENT DETAILS */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 text-red-600 mr-2" />
                Event Details
              </h3>

              <p className="font-semibold text-slate-900">{event.title}</p>
              <p className="text-sm text-slate-500 mt-1">{event.location}</p>
              <p className="text-sm text-slate-500">
                {new Date(event.date).toDateString()}
              </p>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow border">

              {status === "success" ? (
                <div className="py-20 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Message Sent</h3>
                  <p className="text-slate-500 mt-2">
                    The organizer will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">Send us a message</h2>
                  <p className="text-slate-500 text-sm mt-1 mb-8">
                    We typically reply within a few hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Your Name
                        </label>
                        <input
                         name="name"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border"
                            placeholder="Type your full name here"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border"
                           placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Subject
                      </label>
                      <input
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border"
                         placeholder="E.g., Issue with booking #1234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows="6"
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border resize-none"
                        placeholder="Please describe your issue in detail so we can assist you better..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-red-700 transition"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <div className="text-center">
                        <p className="text-red-600 text-sm">
                          {errorMessage || "Something went wrong. Please try again."}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setStatus("idle");
                            setErrorMessage("");
                          }}
                          className="mt-2 text-red-600 text-sm underline hover:text-red-700"
                        >
                          Clear Error
                        </button>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
