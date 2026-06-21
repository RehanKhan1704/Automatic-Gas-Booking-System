const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// ─── GET /api/alerts ─────────────────────────────────────────────────────────
// Returns last 20 alerts for the React dashboard
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ timestamp: -1 })
      .limit(20);
    return res.json(alerts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/alerts/stats ────────────────────────────────────────────────────
// Summary stats: total booking alerts, total leak alerts
router.get("/stats", async (req, res) => {
  try {
    const bookingCount = await Alert.countDocuments({ alertType: "booking" });
    const leakCount    = await Alert.countDocuments({ alertType: "leak" });
    const lastAlert    = await Alert.findOne().sort({ timestamp: -1 });
    return res.json({ bookingCount, leakCount, lastAlert });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
