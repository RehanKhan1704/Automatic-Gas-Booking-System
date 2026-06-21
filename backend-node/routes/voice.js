const express = require("express");
const router = express.Router();

// ─── GET /api/voice ───────────────────────────────────────────────────────────
// Returns TwiML XML consumed by Twilio to play voice messages during calls
router.get("/", (req, res) => {
  const type = req.query.type || "default";

  let message = "Unknown alert.";
  if (type === "leak") {
    message = "Gas leakage has been detected. Please take immediate action.";
  } else if (type === "booking") {
    message = "Your gas cylinder has been successfully booked.";
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">${message}</Say>
</Response>`;

  res.set("Content-Type", "application/xml");
  return res.send(twiml);
});

module.exports = router;
