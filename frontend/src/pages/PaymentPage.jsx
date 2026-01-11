import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function startPayment() {
      const { data } = await api.post("/payments/create-order", {
        bookingId,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "EventEase",
        description: "Event Ticket Booking",
        order_id: data.id,
        handler: async function (response) {
          await api.post("/payments/verify", {
            orderId: data.id,
            paymentId: response.razorpay_payment_id,
            bookingId,
          });

          navigate("/my-bookings");
        },
        theme: { color: "#E31B23" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    }

    startPayment();
  }, [bookingId, navigate]);

  return (
    <div className="h-[60vh] flex items-center justify-center">
      <p className="text-gray-600">Redirecting to payment...</p>
    </div>
  );
}
