import Event from "../models/Event.js";

/* ======================================================
   ORGANIZER → CREATE EVENT
====================================================== */
export const createEvent = async (req, res) => {
  try {
    let imageUrl;

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url;
    } else if (req.body.image || req.body.imageUrl) {
      imageUrl = req.body.image || req.body.imageUrl;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Event image is required" });
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
      image: imageUrl,
      organizer: req.user._id,
       isApproved: false,  // ✅ single source of truth
    });

    res.status(201).json({
      message: "Event created and sent for admin approval",
      event,
    });
  } catch (error) {
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

  Object.assign(event, {
    title: req.body.title ?? event.title,
    description: req.body.description ?? event.description,
    category: req.body.category ?? event.category,
    location: req.body.location ?? event.location,
    date: req.body.date ?? event.date,
    ticketPrice: req.body.ticketPrice ?? event.ticketPrice,
    image: req.body.image ?? event.image,
     isApproved: false, // ✅ reset approval on edit
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
  const event =await Event.findByIdAndUpdate(req.params.id, {
  isApproved: true,
});


  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event approved", event });
};

export const rejectEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, {
  isApproved: false,
});


  if (!event) return res.status(404).json({ message: "Event not found" });
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
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

/* ======================================================
   ADMIN → GET PENDING EVENTS
====================================================== */
export const getPendingEvents = async (req, res) => {
  const events = await Event.find({ status: "pending" }).populate(
    "organizer",
    "name email"
  );
  res.json(events);
};
