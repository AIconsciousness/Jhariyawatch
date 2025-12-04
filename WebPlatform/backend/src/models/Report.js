const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: String,
  reporterPhone: String,
  isAnonymous: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    accuracy: Number,
    address: String,
    locality: String,
    nearestZone: String
  },
  reportType: {
    type: String,
    enum: ['crack', 'subsidence', 'building_damage', 'road_damage', 'other'],
    required: true
  },
  photos: [{
    url: { type: String, required: true },
    thumbnailUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    fileSize: Number
  }],
  aiAnalysis: {
    processed: { type: Boolean, default: false },
    processedAt: Date,
    crackDetected: Boolean,
    crackSeverity: { type: String, enum: ['none', 'minor', 'moderate', 'severe', 'critical'] },
    confidence: Number,
    detectedFeatures: [{
      type: String,
      boundingBox: { x: Number, y: Number, width: Number, height: Number },
      confidence: Number
    }],
    modelVersion: String
  },
  description: String,
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'resolved', 'rejected'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String
  }],
  review: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    verificationStatus: { type: String, enum: ['unverified', 'verified', 'false_report'] },
    adminNotes: String,
    actionTaken: String
  },
  relatedAlertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }
}, {
  timestamps: true
});

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ userId: 1 });

module.exports = mongoose.model('Report', reportSchema);
