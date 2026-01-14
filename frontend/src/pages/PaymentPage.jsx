import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const paymentInitiated = useRef(false); // prevents double-triggering

  useEffect(() => {
    if (bookingId && !paymentInitiated.current) {
      paymentInitiated.current = true;
      startPayment();
    }
  }, [bookingId]);

  // Async function to verify payment after successful Razorpay checkout
  const handlePaymentSuccess = async (response) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/payments/verify",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to MyBookings after success
      navigate("/my-bookings");
    } catch (err) {
      console.error("Payment verification failed:", err);
      alert(err.response?.data?.message || "Payment verification failed!");
    }
  };

  const startPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post(
        "/payments/create-order",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, // amount in paise
        currency: "INR",
        name: "EventEase",
        description: "Event Ticket Booking",
        order_id: data.id,
        handler: function (response) {
          // Call async verification function safely
          handlePaymentSuccess(response);
        },
        prefill: {
          name: "Customer Name", // you can replace with user.name if available
          email: "customer@example.com", // replace with user.email if available
        },
        theme: { color: "#E31B23" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert(error.response?.data?.message || "Error initializing payment.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Initializing Secure Payment...</h2>
      <p>Please do not refresh the page.</p>
    </div>
  );
}
