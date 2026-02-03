import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Lock, CreditCard } from "lucide-react";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const paymentInitiated = useRef(false);

  /* ---------------------------------------------
     Load Razorpay SDK safely
  --------------------------------------------- */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  /* ---------------------------------------------
     Verify payment
  --------------------------------------------- */
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

      navigate("/my-bookings");
    } catch (err) {
      console.error("Payment verification failed:", err);
      alert(err.response?.data?.message || "Payment verification failed!");
    }
  };

  /* ---------------------------------------------
     Start payment
  --------------------------------------------- */
  const startPayment = async () => {
    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert("Unable to load payment gateway");
        return;
      }

      const token = localStorage.getItem("token");

      const { data } = await api.post(
        "/payments/create-order",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "EventEase",
        description: "Secure Event Booking",
        order_id: data.id,

        handler: handlePaymentSuccess,

        theme: {
          color: "#E31B23",
        },

        modal: {
          ondismiss: () => navigate("/my-bookings"),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        alert(response.error.description || "Payment failed");
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Error initializing payment");
    }
  };

  /* ---------------------------------------------
     Auto start once
  --------------------------------------------- */
  useEffect(() => {
    if (bookingId && !paymentInitiated.current) {
      paymentInitiated.current = true;
      startPayment();
    }
  }, [bookingId]);

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-red-50 mb-4">
          <CreditCard className="text-[#E31B23]" size={28} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Processing Payment
        </h2>

        <p className="text-gray-500 mt-2">
          Please wait while we securely redirect you to the payment gateway.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-[#E31B23] rounded-full animate-spin" />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock size={14} />
          <span>100% Secure & Encrypted Payment</span>
        </div>
      </div>
    </div>
  );
}
