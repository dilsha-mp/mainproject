import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader,
  Download,
} from "lucide-react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printTicket, setPrintTicket] = useState(null);

  const navigate = useNavigate();
  const controllerRef = useRef(null);

  /* ---------------- Fetch My Bookings ---------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();

        const res = await api.get("/bookings/my", {
          signal: controllerRef.current.signal,
        });

        setBookings(res.data || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    return () => controllerRef.current?.abort();
  }, []);

  /* ---------------- Generate PDF ---------------- */
  useEffect(() => {
    if (!printTicket) return;

    const generatePDF = async () => {
      await new Promise((r) => setTimeout(r, 100));

      const element = document.getElementById("ticket-pdf-template");
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const width = 190;
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, width, height);
      pdf.save(`Ticket-${printTicket._id.slice(-6)}.pdf`);

      setPrintTicket(null);
    };

    generatePDF();
  }, [printTicket]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* ---------------- PDF TEMPLATE ---------------- */}
      {printTicket && (
        <div
          id="ticket-pdf-template"
          className="fixed -top-[9999px] left-0 w-[800px] bg-white border flex"
        >
          <div className="flex-1 p-6 border-r border-dashed">
            <h1 className="text-2xl font-black text-red-600">EventEase</h1>
            <h2 className="text-3xl font-bold mt-4">
              {printTicket.event.title}
            </h2>

            <div className="mt-6 space-y-2 text-sm">
              <p>📅 {new Date(printTicket.event.date).toLocaleDateString("en-IN")}</p>
              <p>📍 {printTicket.event.location}</p>
              <p>🎟 Tickets: {printTicket.tickets}</p>
              <p className="text-xs text-gray-500">
                Booking ID: {printTicket._id}
              </p>
            </div>
          </div>

          <div className="w-64 flex flex-col items-center justify-center bg-gray-50">
            <QRCode value={printTicket._id} size={140} />
            <p className="mt-4 font-bold text-xl">
              ₹{printTicket.totalAmount}
            </p>
          </div>
        </div>
      )}

      {/* ---------------- HEADER ---------------- */}
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="max-w-4xl mx-auto h-16 px-4 flex items-center">
          <button onClick={() => navigate("/home")}>
            <ArrowLeft />
          </button>
          <h1 className="mx-auto text-xl font-bold">My Tickets</h1>
        </div>
      </div>

      {/* ---------------- BOOKINGS ---------------- */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {bookings.length === 0 ? (
          <div className="text-center text-gray-500">
            You haven’t booked any events yet.
          </div>
        ) : (
          bookings.map((b) => {
            if (!b.event) return null;

            const eventDate = new Date(b.event.date);
            const expired = eventDate < new Date();

            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl shadow-lg border overflow-hidden"
              >
                {/* Top Gradient Strip */}
                <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500" />

                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  {/* Left Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold">
                        {b.event.title}
                      </h2>

                      {expired ? (
                        <span className="flex items-center gap-1 text-xs bg-gray-100 px-3 py-1 rounded-full">
                          <XCircle size={14} /> EXPIRED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs bg-green-100 px-3 py-1 rounded-full">
                          <CheckCircle size={14} /> VALID
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        {eventDate.toLocaleDateString("en-IN")}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={14} />
                        {b.event.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Ticket size={14} />
                        {b.tickets} Tickets
                      </p>
                    </div>
                  </div>

                  {/* Right QR */}
                  <div className="flex flex-col items-center justify-between border-l pl-6">
                    <QRCode value={b._id} size={90} />
                    <div className="text-center mt-3">
                      <p className="text-xs text-gray-400">Total Paid</p>
                      <p className="text-2xl font-black">
                        ₹{b.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-3 flex justify-end bg-gray-50">
                  <button
                    onClick={() => setPrintTicket(b)}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
                  >
                    <Download size={16} />
                    Download PDF Ticket
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
