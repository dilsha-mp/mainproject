import express from "express";
import { getAllUsers,getAllOrganizers, getPendingEvents,getApprovedEvents } from "../controllers/adminController.js";const router = express.Router();
// Get users  Details
router.get("/users", getAllUsers);
// Get organizer Details
router.get("/organizers", getAllOrganizers);
// Get pending events
router.get("/pending", getPendingEvents);
//Get approved events
router.get("/approved", getApprovedEvents);

export default router;