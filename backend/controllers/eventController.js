import Event from "../models/Event.js";

/* ======================================================
   ORGANIZER → CREATE EVENT
====================================================== */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      ticketPrice,
      totalTickets,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !date ||
      ticketPrice == null ||
      totalTickets == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(ticketPrice) || isNaN(totalTickets)) {
      return res.status(400).json({
        message: "Ticket price and total tickets must be valid numbers",
      });
    }

    if (Number(ticketPrice) < 0 || Number(totalTickets) <= 0) {
      return res.status(400).json({
        message:
          "Ticket price must be >= 0 and total tickets must be greater than 0",
      });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid event date" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imageUrl =
      req.file?.path ||
      req.file?.secure_url ||
      req.body.image ||
      req.body.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({ message: "Event image is required" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      location,
      date: eventDate,
      ticketPrice: Number(ticketPrice),
      totalTickets: Number(totalTickets),
      image: imageUrl,
      organizer: req.user._id,
      isApproved: false,
    });

    res.status(201).json({
      message: "Event created and sent for admin approval",
      event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/* ======================================================
   ORGANIZER → GET MY EVENTS
====================================================== */
export const getMyEvents = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(events);
};

/* ======================================================
   ORGANIZER → UPDATE EVENT
====================================================== */
export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (event.isApproved) {
    return res.status(403).json({
      message: "Approved events cannot be edited",
    });
  }

  Object.assign(event, {
    title: req.body.title ?? event.title,
    description: req.body.description ?? event.description,
    category: req.body.category ?? event.category,
    location: req.body.location ?? event.location,
    date: req.body.date ?? event.date,
    ticketPrice: req.body.ticketPrice ?? event.ticketPrice,
    image: req.body.image ?? event.image,
    isApproved: false,
  });

  await event.save();

  res.json({
    message: "Event updated and sent for re-approval",
    event,
  });
};

/* ======================================================
   ORGANIZER → DELETE EVENT
====================================================== */
export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });
  if (event.organizer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  await event.deleteOne();
  res.json({ message: "Event deleted successfully" });
};

/* ======================================================
   ADMIN → APPROVE / REJECT
====================================================== */
export const approveEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ message: "Event approved", event });
};

export const rejectEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { isApproved: false },
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ message: "Event rejected", event });
};

/* ======================================================
   USER → GET APPROVED EVENTS
====================================================== */
export const getApprovedEvents = async (req, res) => {
  try {
    const filter = { isApproved: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const events = await Event.find(filter)
      .populate("organizer", "name")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ======================================================
   USER → GET SINGLE APPROVED EVENT
====================================================== */
export const getSingleEvent = async (req, res) => {
  const event = await Event.findOne({
    _id: req.params.id,
    isApproved: true,
  }).populate("organizer", "name email phone");

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

export const contactOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, message } = req.body;

    const event = await Event.findById(id).populate("organizer", "email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("CONTACT MESSAGE:", {
      to: event.organizer.email,
      from: email,
      name,
      subject,
      message,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
/* ======================================================
   ADMIN → GET PENDING EVENTS
====================================================== */
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false })
      .populate("organizer", "name email")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getOrganizerDashboard = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const totalEvents = await Event.countDocuments({
      organizer: organizerId,
    });

    const approvedEvents = await Event.countDocuments({
      organizer: organizerId,
      isApproved: true,
    });

    const pendingEvents = await Event.countDocuments({
      organizer: organizerId,
      isApproved: false,
    });

    const events = await Event.find({ organizer: organizerId })
      .sort({ createdAt: -1 })
      .select("title date location ticketPrice totalTickets isApproved");

    res.json({
      stats: {
        totalEvents,
        approvedEvents,
        pendingEvents,
      },
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

