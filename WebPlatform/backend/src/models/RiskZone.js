const mongoose = require('mongoose');

const riskZoneSchema = new mongoose.Schema({
  zoneId: {
    type: String,
    required: true,
    unique: true
  },
  zoneName: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  geometry: {
    type: { type: String, enum: ['Polygon', 'MultiPolygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true }
  },
  riskLevel: {
    type: String,
    enum: ['critical', 'high', 'moderate', 'low', 'stable', 'uplifting'],
    required: true
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  subsidenceData: {
    averageRate: Number,
    maxRate: Number,
    cumulativeDisplacement: Number,
    measurementPeriod: {
      start: Date,
      end: Date
    },
    dataSource: String
  },
  psinsar: {
    coherence: Number,
    velocityStdDev: Number,
    temporalBaseline: Number,
    spatialBaseline: Number
  },
  description: {
    en: String,
    hi: String
  },
  affectedArea: Number,
  estimatedPopulation: Number,
  landmarks: [{
    name: { en: String, hi: String },
    coordinates: [Number],
    type: String
  }],
  safetyRecommendations: {
    en: [String],
    hi: [String]
  },
  evacuationRoutes: [{
    name: String,
    path: {
      type: String,
      coordinates: [[Number]]
    }
  }],
  nearestSafeZone: {
    zoneId: String,
    distance: Number,
    name: { en: String, hi: String }
  },
  bccl_area: String,
  isActive: { type: Boolean, default: true },
  lastUpdated: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

riskZoneSchema.index({ geometry: '2dsphere' });
riskZoneSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('RiskZone', riskZoneSchema);
