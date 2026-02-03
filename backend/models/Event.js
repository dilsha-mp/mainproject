import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
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

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* AUTO SET AVAILABLE TICKETS */
eventSchema.pre("save", function () {
  this.updatedAt = Date.now();
});


export default mongoose.model("Event", eventSchema);
