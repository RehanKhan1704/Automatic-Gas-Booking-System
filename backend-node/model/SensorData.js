const mongoose = require("mongoose");

// Schema for raw telemetry received from NodeMCU ESP8266
const SensorDataSchema = new mongoose.Schema({
  weight: {
    type: Number,    // Weight in kg from Load Cell + HX711
    required: true,
  },
  gasDetected: {
    type: Boolean,   // true = MQ-2 sensor detected gas leak
    required: true,
  },
  gasLevel: {
    type: Number,    // Raw analog value from MQ-2 (0–1023)
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SensorData", SensorDataSchema);
