import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

// USER → Create Booking
export const createBooking = async (req, res) => {
  const { eventId, tickets } = req.body;

  const event = await Event.findOne({
    _id: eventId,
    isApproved: true,
  });
     if (!event) {
    return res.status(404).json({ message: "Event not available" });
  }

  if (event.availableTickets < tickets) {
    return res.status(400).json({ message: "Not enough tickets" });
  }

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      tickets,
      totalAmount: tickets * event.ticketPrice,
    });


  res.status(201).json({ booking }); 
};


   

// USER → Confirm Payment (SIMULATED)
export const confirmPayment = async (req, res) => {
  const { bookingId, paymentId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    // Deduct tickets
    booking.event.availableTickets -= booking.tickets;
    await booking.event.save();

    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    await booking.save();

    res.json({
      message: "Payment successful, booking confirmed",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER → My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    console.log("Verifying ticket:", ticketId);
    console.log("User making request:", req.user._id, req.user.role);

    const booking = await Booking.findById(ticketId)
      .populate("user", "name")
      .populate("event", "title organizer");

    if (!booking) {
      console.log("Booking not found");
      return res.status(404).json({ message: "Invalid Ticket" });
    }

    console.log("Booking found:", {
      id: booking._id,
      paymentStatus: booking.paymentStatus,
      isCheckedIn: booking.isCheckedIn,
      eventOrganizer: booking.event.organizer,
      userId: req.user._id
    });

    if (booking.paymentStatus !== "paid") {
      console.log("Payment not completed");
      return res.status(400).json({ message: "Ticket not paid" });
    }

    // ✅ Prevent duplicate check-in
    if (booking.isCheckedIn) {
      console.log("Ticket already used");
      return res.status(400).json({ message: "Ticket already used" });
    }

    if (
      booking.event.organizer &&
      booking.event.organizer.toString() !== req.user._id.toString()
    ) {
      console.log("Unauthorized scanner - organizer mismatch");
      return res.status(403).json({ message: "Unauthorized scanner" });
    }

    console.log("Ticket verification successful");

    // ✅ Mark attendance
    booking.isCheckedIn = true;
    booking.checkedInAt = new Date();

    await booking.save();

    res.json({
      booking: {
        guestName: booking.user.name,
        eventName: booking.event.title,
        quantity: booking.tickets,
        isVip: booking.ticketType === "VIP"
      }
    });

  } catch (error) {
       console.log("Error in verifyTicket:", error);
    res.status(500).json({ message: "Server error" });
  }
};
