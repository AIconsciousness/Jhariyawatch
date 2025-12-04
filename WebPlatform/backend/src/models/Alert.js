const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  alertType: {
    type: String,
    enum: ['emergency', 'warning', 'info', 'update'],
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  title: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  message: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  targetZones: [String],
  targetAll: { type: Boolean, default: false },
  affectedArea: {
    type: { type: String, enum: ['Polygon', 'Circle'] },
    coordinates: [[[Number]]],
    radius: Number
  },
  validFrom: { type: Date, default: Date.now },
  validUntil: Date,
  isActive: { type: Boolean, default: true },
  source: {
    type: String,
    enum: ['admin', 'system', 'bccl', 'ndma', 'auto_detection'],
    required: true
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notificationSent: { type: Boolean, default: false },
  notificationSentAt: Date,
  recipientCount: Number,
  relatedReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  instructions: {
    en: [String],
    hi: [String]
  },
  evacuationAdvised: { type: Boolean, default: false },
  emergencyContacts: [{
    name: String,
    phone: String,
    role: String
  }]
}, {
  timestamps: true
});

alertSchema.index({ alertType: 1 });
alertSchema.index({ isActive: 1, validUntil: 1 });
alertSchema.index({ targetZones: 1 });

module.exports = mongoose.model('Alert', alertSchema);
