import Event from "../models/Event.js";

// ORGANIZER → Create Event
export const createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Event image is required",
      });
    }

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      date: new Date(req.body.date),
      ticketPrice: Number(req.body.ticketPrice),
      totalTickets: Number(req.body.totalTickets),
      availableTickets: Number(req.body.totalTickets),
     image: req.file.path || req.file.secure_url,
      organizer: req.user._id,
    });

    res.status(201).json({
      message: "Event created, waiting for admin approval",
      event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({
      message: error.message || "Failed to create event",
    });
  }
};

// ADMIN → Approve Event
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isApproved = true;
    await event.save();

    res.json({ message: "Event approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN → Reject/Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event rejected and deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER → Get Approved Events
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true }).populate(
      "organizer",
      "name"
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN → View Pending Events
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false }).populate(
      "organizer",
      "name email"
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
