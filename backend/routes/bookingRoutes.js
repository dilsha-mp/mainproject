import express from "express";
import {
  createBooking,
  confirmPayment,
  getMyBookings,
} from "../controllers/bookingController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// User creates booking
router.post("/", protect, authorizeRoles("user"), createBooking);

// User confirms payment
router.post("/payment", protect, authorizeRoles("user"), confirmPayment);

// User booking history
router.get("/my", protect, authorizeRoles("user"), getMyBookings);

export default router;
