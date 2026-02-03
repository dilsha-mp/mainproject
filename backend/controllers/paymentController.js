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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ message: "Missing payment parameters" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking || !booking.event) {
      return res.status(404).json({ message: "Booking or event not found" });
    }

    if (!booking.user || booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    const ticketsBooked = booking.tickets || 1;
    booking.event.availableTickets = Math.max(
      0,
      booking.event.availableTickets - ticketsBooked
    );
    await booking.event.save();

    res.json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
