🎟️ Eventase – Event Management System (MERN Stack)

Eventase is a full-stack Event Management and Booking Platform that allows users to discover and book events while organizers can create and manage their own events.
The platform also includes QR-based ticket verification and secure online payments.
Built using the MERN Stack with authentication, event approval system, and modern UI.

🚀 Features
👤 User Features

Register and login securely
Browse available events
Book event tickets
Secure online payment
QR code ticket generation
View booking history

🎪 Organizer Features

Create and manage events
View event bookings
Scan and verify tickets using QR scanner
Organizer dashboard with event statistics

🛡️ Admin Features

Approve or reject events
Monitor organizers and users

🛠️ Tech Stack

Frontend

React
React Router
Tailwind CSS
Axios
QR Scanner (@yudiel/react-qr-scanner)
Lucide React Icons

Backend

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcrypt

Other Integrations

Razorpay (Payment Gateway)
QR Code generation
Cloud image uploads
Render (Backend Deployment)
Vercel (Frontend Deployment)

📂 Project Structure
eventase/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── context/
│   └── App.jsx
│
└── README.md

🔐 Authentication Flow

User registers with name, email, and password
Password is securely hashed using bcrypt
User logs in and receives a JWT token
Token is stored in localStorage
Protected routes verify the token
Users access features based on their role (User / Organizer / Admin)

🎫 Event Booking Flow

Organizer creates an event
Admin approves the event
Users browse and book tickets
Payment is processed using Razorpay
A QR code ticket is generated
Organizer scans QR code at event entry
Ticket is verified in real-time

📦 API Endpoints

Auth Routes
POST   /api/auth/register   → Register user
POST   /api/auth/login      → Login user

Event Routes
GET    /api/events                 → Get approved events
POST   /api/events                 → Create event (Organizer)
GET    /api/events/my-events       → Organizer events
PUT    /api/events/:id             → Update event
DELETE /api/events/:id             → Delete event

Booking Routes
POST   /api/bookings               → Create booking
GET    /api/bookings/my-bookings   → User bookings
GET    /api/bookings/verify/:id    → Verify ticket (QR Scanner)

Payment Routes
POST   /api/payments/create-order  → Create payment order
POST   /api/payments/verify        → Verify Razorpay payment

▶️ Run Locally

Backend

cd backend
npm install
npm start

Frontend

cd frontend
npm install
npm run dev

🌐 Deployment

Frontend
Deployed on Vercel

Backend
Deployed on Render