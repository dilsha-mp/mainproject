import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Movies", "Sports", "Workshops", "Comedy", "Music", "Activities"],
      required: true,
    },
    location: {
      type: String,
      enum: [
        "Kochi",
        "Trivandrum",
        "Kozhikode",
        "Thrissur",
        "Palakkad",
        "Kannur",
        "Alappuzha",
        "Kottayam",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    totalTickets: {
      type: Number,
      required: true,
    },
    availableTickets: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
