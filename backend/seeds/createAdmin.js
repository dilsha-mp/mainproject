import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@eventease.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

createAdmin();
