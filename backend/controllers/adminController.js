import User from "../models/User.js";
import Event from "../models/Event.js";

// GET ALL USERS (Admin)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch users but exclude password field
    const users = await User.find({ role: "user" }).select("name email role");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// GET ALL ORGANIZERS (Admin)
export const getAllOrganizers = async (req, res) => {
  try {
    // Find users where role is organizer
    const organizers = await User.find({ role: "organizer" })
      .select("name email role");

    res.status(200).json(organizers);
  } catch (error) {
    console.error("Error fetching organizers:", error.message);
    res.status(500).json({
      message: "Failed to fetch organizers",
    });
  }
};
// Get all pending events (Admin)
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false })
      .populate("organizer", "name email") // optional
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending events",
      error: error.message,
    });
  }
};
//Get all approved events (Admin)
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true })
      .populate("organizer", "name email") // optional
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved events",
      error: error.message,
    });
  }
};