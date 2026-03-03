import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();


const allowedOrigins = [
  "http://localhost:5178",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://mainproject-black.vercel.app"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");
    if (isLocalhost || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS Blocked Origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);


app.get("/", (req, res) => {
  res.send("Event Management API Running");
});


app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
