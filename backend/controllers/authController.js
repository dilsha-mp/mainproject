import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN ATTEMPT:", { email, password: password ? "***" : "empty" });

  try {
    const user = await User.findOne({ email });

    console.log("USER FOUND:", user ? { id: user._id, email: user.email, role: user.role } : "NOT FOUND");

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("PASSWORD MATCH - LOGIN SUCCESSFUL");
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      console.log("LOGIN FAILED - INVALID CREDENTIALS");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
