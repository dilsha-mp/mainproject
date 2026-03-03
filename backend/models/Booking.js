import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  tickets: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,
   isCheckedIn: {
    type: Boolean,
    default: false,
  },

  checkedInAt: Date,

  ticketType: {
    type: String,
    default: "Regular"
  }
}, { timestamps: true });


export default mongoose.model("Booking", bookingSchema);
