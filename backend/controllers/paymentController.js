import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

// ================================
// CREATE RAZORPAY ORDER
// ================================
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: "Booking ID is required" });

    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const amountInPaise = Math.round(booking.totalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    });

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================================
// VERIFY PAYMENT
// ================================

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // 1️⃣ Check for missing parameters
    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment parameters" });
    }

    // 2️⃣ Check if Razorpay key secret is set
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET not found in environment variables!");
      return res.status(500).json({ message: "Payment configuration error" });
    }

    // 3️⃣ Find booking and populate event
    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (!booking.event) return res.status(404).json({ message: "Event not found" });

    // 4️⃣ Ensure the user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    // 5️⃣ Generate HMAC signature and compare
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.warn("Payment signature mismatch!", { generatedSignature, razorpay_signature });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 6️⃣ Update booking and event
    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    booking.event.availableTickets -= booking.tickets;
    if (booking.event.availableTickets < 0) booking.event.availableTickets = 0;
    await booking.event.save();

    // 7️⃣ Success response
    res.json({ message: "Payment successful", bookingId: booking._id });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
