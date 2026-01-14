import express from "express";
import {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getApprovedEvents,
  getPendingEvents,
  getSingleEvent,
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// PUBLIC
router.get("/", getApprovedEvents);

// ORGANIZER
router.get("/my-events", protect, authorizeRoles("organizer"), getMyEvents);

// ADMIN
router.get("/pending", protect, authorizeRoles("admin"), getPendingEvents);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveEvent);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectEvent);

// SINGLE EVENT (LAST!)
router.get("/:id", getSingleEvent);

// CRUD
router.post("/", protect, authorizeRoles("organizer"), upload.single("image"), createEvent);
router.put("/:id", protect, authorizeRoles("organizer"), upload.single("image"), updateEvent);
router.delete("/:id", protect, authorizeRoles("organizer"), deleteEvent);


export default router;

