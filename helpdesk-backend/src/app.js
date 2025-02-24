// src/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ticketRoutes = require("./routes/ticket.routes");
const authRoutes = require("./routes/auth.routes");
const auth = require("./middleware/auth.middleware");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", auth, ticketRoutes); // ใช้ auth middleware ด้วย
app.use("/api/admin", adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// แยกการเริ่ม server ออกไป 
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // MongoDB connection in non-test environment
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}


module.exports = app;
