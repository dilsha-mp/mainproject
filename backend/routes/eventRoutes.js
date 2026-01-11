import express from "express";
import {
  createEvent,
  approveEvent,
  deleteEvent,
  getApprovedEvents,
  getPendingEvents,
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ORGANIZER → Create event
router.post(
  "/",
  protect,
  authorizeRoles("organizer"),
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      next();
    });
  },
  createEvent
);

// USER → Get approved events (with optional category)
router.get("/", getApprovedEvents);

// ADMIN → View pending events
router.get(
  "/pending",
  protect,
  authorizeRoles("admin"),
  getPendingEvents
);

// ADMIN → Approve event
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("admin"),
  approveEvent
);

// ADMIN → Reject event
router.delete(
  "/reject/:id",
  protect,
  authorizeRoles("admin"),
  deleteEvent
);

export default router;
