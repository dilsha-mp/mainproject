import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  date: Date,

  ticketPrice: Number,
  totalTickets: Number,
  availableTickets: Number,
  soldTickets: { type: Number, default: 0 },

  image: String,

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

/* AUTO SET AVAILABLE TICKETS */
eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.availableTickets = this.totalTickets;
  }
  next();
});

export default mongoose.model("Event", eventSchema);
