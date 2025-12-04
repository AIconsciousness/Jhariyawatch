const mongoose = require('mongoose');

// Schema for individual time-series measurements
const MeasurementSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  losVelocity: {
    type: Number, // mm/year - Line of Sight velocity
    required: true
  },
  verticalDisplacement: {
    type: Number, // mm - Cumulative vertical displacement
    required: true
  },
  coherence: {
    type: Number, // 0-1 - Data quality metric
    required: true,
    min: 0,
    max: 1
  },
  confidence: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  atmosphericCorrection: {
    type: Number, // mm - Seasonal atmospheric delay correction
    default: 0
  }
}, { _id: false });

// Schema for heatmap grid cells
const HeatmapCellSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  intensity: {
    type: Number, // 0-1 normalized intensity
    required: true,
    min: 0,
    max: 1
  },
  velocity: {
    type: Number, // mm/year
    required: true
  }
}, { _id: false });

// Schema for statistical analysis
const StatisticsSchema = new mongoose.Schema({
  trend: {
    type: String,
    enum: ['accelerating', 'stable', 'decelerating', 'improving'],
    required: true
  },
  averageVelocity: {
    type: Number, // mm/year
    required: true
  },
  standardDeviation: {
    type: Number,
    required: true
  },
  minVelocity: {
    type: Number,
    required: true
  },
  maxVelocity: {
    type: Number,
    required: true
  },
  accelerationRate: {
    type: Number, // mm/year²
    required: true
  },
  linearFitR2: {
    type: Number, // R² coefficient for linear fit
    min: 0,
    max: 1
  }
}, { _id: false });

// Schema for prediction data
const PredictionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  predictedVelocity: {
    type: Number, // mm/year
    required: true
  },
  confidenceIntervalLower: {
    type: Number, // 95% confidence interval lower bound
    required: true
  },
  confidenceIntervalUpper: {
    type: Number, // 95% confidence interval upper bound
    required: true
  }
}, { _id: false });

// Main SubsidenceTimeSeries schema
const SubsidenceTimeSeriesSchema = new mongoose.Schema({
  zoneId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  zoneName: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },

  // Time-series measurements (monthly data from 2018-2024)
  measurements: {
    type: [MeasurementSchema],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length >= 12; // At least 12 months of data
      },
      message: 'At least 12 months of measurements required'
    }
  },

  // Heatmap grid data (50x50 cells covering the zone)
  heatmapData: {
    gridSize: {
      rows: { type: Number, default: 50 },
      cols: { type: Number, default: 50 }
    },
    cells: {
      type: [HeatmapCellSchema],
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Statistical analysis
  statistics: {
    type: StatisticsSchema,
    required: true
  },

  // Predictions (6-12 months forecast)
  predictions: {
    forecasts: {
      type: [PredictionSchema],
      required: true
    },
    modelAccuracy: {
      type: Number, // R² score
      min: 0,
      max: 1
    },
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },

  // Metadata
  dataSource: {
    type: String,
    default: 'Sentinel-1 PSInSAR Mock Data'
  },
  temporalResolution: {
    type: String,
    default: '12-day repeat cycle (monthly aggregated)'
  },
  spatialResolution: {
    type: String,
    default: '20m x 20m'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
SubsidenceTimeSeriesSchema.index({ zoneId: 1 });
SubsidenceTimeSeriesSchema.index({ 'measurements.date': 1 });
SubsidenceTimeSeriesSchema.index({ lastUpdated: -1 });

// Methods

// Get recent measurements (last N months)
SubsidenceTimeSeriesSchema.methods.getRecentMeasurements = function(months = 12) {
  return this.measurements
    .sort((a, b) => b.date - a.date)
    .slice(0, months);
};

// Get measurements within date range
SubsidenceTimeSeriesSchema.methods.getMeasurementsByDateRange = function(startDate, endDate) {
  return this.measurements.filter(m =>
    m.date >= startDate && m.date <= endDate
  );
};

// Get heatmap data for specific date (or latest)
SubsidenceTimeSeriesSchema.methods.getHeatmapForDate = function(date = null) {
  // For now, return current heatmap (could be extended to store historical heatmaps)
  return this.heatmapData;
};

// Check if data needs update (older than 30 days)
SubsidenceTimeSeriesSchema.methods.needsUpdate = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.lastUpdated < thirtyDaysAgo;
};

// Static methods

// Find zones by trend type
SubsidenceTimeSeriesSchema.statics.findByTrend = function(trend) {
  return this.find({ 'statistics.trend': trend });
};

// Find zones with high velocity (critical monitoring needed)
SubsidenceTimeSeriesSchema.statics.findHighRiskZones = function(velocityThreshold = -20) {
  return this.find({ 'statistics.averageVelocity': { $lt: velocityThreshold } });
};

// Get aggregate statistics across all zones
SubsidenceTimeSeriesSchema.statics.getAggregateStats = async function() {
  const zones = await this.find({});

  if (zones.length === 0) {
    return null;
  }

  const stats = {
    totalZones: zones.length,
    byTrend: {
      accelerating: 0,
      stable: 0,
      decelerating: 0,
      improving: 0
    },
    averageVelocity: 0,
    criticalZones: 0 // velocity < -20 mm/year
  };

  let velocitySum = 0;

  zones.forEach(zone => {
    stats.byTrend[zone.statistics.trend]++;
    velocitySum += zone.statistics.averageVelocity;
    if (zone.statistics.averageVelocity < -20) {
      stats.criticalZones++;
    }
  });

  stats.averageVelocity = velocitySum / zones.length;

  return stats;
};

const SubsidenceTimeSeries = mongoose.model('SubsidenceTimeSeries', SubsidenceTimeSeriesSchema);

module.exports = SubsidenceTimeSeries;
