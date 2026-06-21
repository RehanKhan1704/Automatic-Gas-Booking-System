require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const sensorRoutes = require("./routes/sensor");
const alertRoutes  = require("./routes/alerts");
const voiceRoutes  = require("./routes/voice");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/sensor", sensorRoutes);   // NodeMCU posts telemetry here
app.use("/api/alerts", alertRoutes);    // React dashboard fetches alerts here
app.use("/api/voice",  voiceRoutes);    // Twilio fetches TwiML XML here

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "Smart Gas Booking & Safety System API",
    endpoints: {
      postTelemetry: "POST /api/sensor",
      getSensorData: "GET  /api/sensor",
      getAlerts:     "GET  /api/alerts",
      getAlertStats: "GET  /api/alerts/stats",
      voiceXML:      "GET  /api/voice?type=leak|booking",
    },
  });
});

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
