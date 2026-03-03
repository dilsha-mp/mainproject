import express from "express";
import {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
    getAllEvents,
  getApprovedEvents,
  getPendingEvents,
  getSingleEvent,
  getOrganizerDashboard,
  contactOrganizer
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/all", getAllEvents);
router.get("/", getApprovedEvents);
router.post("/:id/contact-organizer", contactOrganizer);


// ORGANIZER
router.get("/my-events", protect, authorizeRoles("organizer"), getMyEvents);
router.post(
  "/",
  protect,
  authorizeRoles("organizer"),
  createEvent
);
router.put(
  "/:id",
  protect,
  authorizeRoles("organizer"),
  updateEvent
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("organizer"),
  deleteEvent
);
router.get(
  "/organizer/dashboard",
  protect,
  authorizeRoles("organizer"),
  getOrganizerDashboard
);

// ADMIN
router.get("/pending", protect, authorizeRoles("admin"), getPendingEvents);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveEvent);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectEvent);

// SINGLE EVENT
router.get("/:id", getSingleEvent);


export default router;

