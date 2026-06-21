const mongoose = require("mongoose");

// Schema for alerts triggered by the system (booking or leak)
const AlertSchema = new mongoose.Schema({
  alertType: {
    type: String,
    enum: ["booking", "leak"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  callSid: {
    type: String,   // Twilio Call SID
    default: null,
  },
  smsSid: {
    type: String,   // Twilio SMS SID (booking alerts only)
    default: null,
  },
  status: {
    type: String,
    enum: ["sent", "failed"],
    default: "sent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Alert", AlertSchema);
