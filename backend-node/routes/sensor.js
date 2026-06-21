const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const SensorData = require("../models/SensorData");
const Alert = require("../models/Alert");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// Thresholds
const WEIGHT_THRESHOLD_KG = 2.0;   // Below this → trigger booking alert
const GAS_LEVEL_THRESHOLD = 400;   // Above this raw MQ-2 value → leak detected

// ─── POST /api/sensor ────────────────────────────────────────────────────────
// Called by NodeMCU ESP8266 every few seconds with sensor readings
router.post("/", async (req, res) => {
  try {
    const { weight, gasDetected, gasLevel } = req.body;

    if (weight === undefined || gasDetected === undefined) {
      return res.status(400).json({ error: "weight and gasDetected are required fields" });
    }

    // 1. Save raw telemetry to MongoDB
    const sensorEntry = new SensorData({ weight, gasDetected, gasLevel });
    await sensorEntry.save();

    const responsePayload = {
      saved: true,
      sensorId: sensorEntry._id,
      timestamp: sensorEntry.timestamp,
      alertTriggered: false,
    };

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // 2. Check for GAS LEAKAGE — highest priority
    if (gasDetected || (gasLevel && gasLevel > GAS_LEVEL_THRESHOLD)) {
      const voiceUrl = `${baseUrl}/api/voice?type=leak`;

      // Call SECONDARY_PHONE for gas leak emergency
      const call = await client.calls.create({
        url: voiceUrl,
        to: process.env.SECONDARY_PHONE,
        from: process.env.TWILIO_PHONE,
      });

      // Save alert to MongoDB
      const alert = new Alert({
        alertType: "leak",
        message: "Gas leakage detected. Immediate action required.",
        callSid: call.sid,
        status: "sent",
      });
      await alert.save();

      responsePayload.alertTriggered = true;
      responsePayload.alertType = "leak";
      responsePayload.callSid = call.sid;
    }

    // 3. Check for LOW GAS / BOOKING needed
    else if (weight < WEIGHT_THRESHOLD_KG) {
      const voiceUrl = `${baseUrl}/api/voice?type=booking`;

      // Call TARGET_PHONE with booking voice notification
      const call = await client.calls.create({
        url: voiceUrl,
        to: process.env.TARGET_PHONE,
        from: process.env.TWILIO_PHONE,
      });

      // SMS to SECONDARY_PHONE
      const sms = await client.messages.create({
        body: `🔔 Gas Booking Alert: Cylinder weight is ${weight}kg. A new cylinder has been booked automatically.`,
        from: process.env.TWILIO_PHONE,
        to: process.env.SECONDARY_PHONE,
      });

      // Save alert to MongoDB
      const alert = new Alert({
        alertType: "booking",
        message: `Gas level low (${weight}kg). Booking initiated automatically.`,
        callSid: call.sid,
        smsSid: sms.sid,
        status: "sent",
      });
      await alert.save();

      responsePayload.alertTriggered = true;
      responsePayload.alertType = "booking";
      responsePayload.callSid = call.sid;
      responsePayload.smsSid = sms.sid;
    }

    return res.status(201).json(responsePayload);

  } catch (err) {
    console.error("Sensor route error:", err.message);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// ─── GET /api/sensor ─────────────────────────────────────────────────────────
// Returns last 50 sensor readings for the dashboard
router.get("/", async (req, res) => {
  try {
    const readings = await SensorData.find()
      .sort({ timestamp: -1 })
      .limit(50);
    return res.json(readings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
