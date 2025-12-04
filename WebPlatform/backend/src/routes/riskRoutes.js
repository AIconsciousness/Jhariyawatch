const express = require('express');
const router = express.Router();
const RiskZone = require('../models/RiskZone');

const getRiskColor = (level) => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c',
    moderate: '#ca8a04',
    low: '#65a30d',
    stable: '#16a34a',
    uplifting: '#2563eb'
  };
  return colors[level] || '#6b7280';
};

const getRiskDescription = (level) => {
  const descriptions = {
    critical: {
      en: 'You are in a CRITICAL subsidence zone. This area has recorded significant ground movement. Please exercise extreme caution and consider evacuation.',
      hi: 'आप एक गंभीर धंसाव क्षेत्र में हैं। इस क्षेत्र में महत्वपूर्ण जमीन की गति दर्ज की गई है। कृपया अत्यधिक सावधानी बरतें और निकासी पर विचार करें।'
    },
    high: {
      en: 'You are in a HIGH risk subsidence zone. Regular monitoring is essential. Be alert to any ground changes.',
      hi: 'आप उच्च जोखिम वाले धंसाव क्षेत्र में हैं। नियमित निगरानी आवश्यक है। किसी भी जमीन के बदलाव पर ध्यान दें।'
    },
    moderate: {
      en: 'You are in a MODERATE risk zone. Some subsidence activity detected. Stay informed about area updates.',
      hi: 'आप मध्यम जोखिम वाले क्षेत्र में हैं। कुछ धंसाव गतिविधि का पता चला है। क्षेत्र के अपडेट के बारे में सूचित रहें।'
    },
    low: {
      en: 'You are in a LOW risk zone. Minimal subsidence activity recorded.',
      hi: 'आप कम जोखिम वाले क्षेत्र में हैं। न्यूनतम धंसाव गतिविधि दर्ज की गई है।'
    },
    stable: {
      en: 'This location is in a STABLE zone with minimal subsidence risk.',
      hi: 'यह स्थान न्यूनतम धंसाव जोखिम वाले स्थिर क्षेत्र में है।'
    },
    uplifting: {
      en: 'This area shows UPLIFTING trend. Ground is rising slightly.',
      hi: 'यह क्षेत्र उत्थान की प्रवृत्ति दिखाता है। जमीन थोड़ी ऊपर उठ रही है।'
    }
  };
  return descriptions[level] || descriptions.stable;
};

router.get('/zones', async (req, res) => {
  try {
    const { riskLevel, bounds } = req.query;

    const query = { isActive: true };
    if (riskLevel) {
      query.riskLevel = riskLevel;
    }

    if (bounds) {
      const [minLng, minLat, maxLng, maxLat] = bounds.split(',').map(Number);
      query.geometry = {
        $geoWithin: {
          $box: [[minLng, minLat], [maxLng, maxLat]]
        }
      };
    }

    const zones = await RiskZone.find(query).lean();

    const geoJson = {
      type: 'FeatureCollection',
      features: zones.map(zone => ({
        type: 'Feature',
        properties: {
          zoneId: zone.zoneId,
          zoneName: zone.zoneName,
          riskLevel: zone.riskLevel,
          riskScore: zone.riskScore,
          subsidenceRate: zone.subsidenceData?.averageRate,
          maxRate: zone.subsidenceData?.maxRate,
          cumulativeDisplacement: zone.subsidenceData?.cumulativeDisplacement,
          description: zone.description,
          color: getRiskColor(zone.riskLevel),
          affectedArea: zone.affectedArea,
          estimatedPopulation: zone.estimatedPopulation,
          bccl_area: zone.bccl_area,
          psinsar: zone.psinsar
        },
        geometry: zone.geometry
      })),
      metadata: {
        totalZones: zones.length,
        criticalZones: zones.filter(z => z.riskLevel === 'critical').length,
        highZones: zones.filter(z => z.riskLevel === 'high').length,
        moderateZones: zones.filter(z => z.riskLevel === 'moderate').length,
        lastUpdated: new Date().toISOString()
      }
    };

    res.json({ success: true, data: geoJson });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Failed to fetch zones', hi: 'ज़ोन प्राप्त करने में विफल' } }
    });
  }
});

router.get('/check', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: { en: 'Latitude and longitude required', hi: 'अक्षांश और देशांतर आवश्यक है' } }
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const point = [longitude, latitude];

    const containingZone = await RiskZone.findOne({
      isActive: true,
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: point
          }
        }
      }
    }).lean();

    let nearestZone = null;
    if (!containingZone) {
      const zones = await RiskZone.find({ isActive: true }).lean();
      let minDistance = Infinity;
      
      for (const zone of zones) {
        if (zone.geometry && zone.geometry.coordinates && zone.geometry.coordinates[0]) {
          const centroid = zone.geometry.coordinates[0].reduce((acc, coord) => {
            return [acc[0] + coord[0] / zone.geometry.coordinates[0].length, acc[1] + coord[1] / zone.geometry.coordinates[0].length];
          }, [0, 0]);
          
          const distance = Math.sqrt(Math.pow(centroid[0] - longitude, 2) + Math.pow(centroid[1] - latitude, 2)) * 111;
          if (distance < minDistance) {
            minDistance = distance;
            nearestZone = { ...zone, distance: Math.round(distance * 10) / 10 };
          }
        }
      }
    }

    const response = {
      location: {
        coordinates: point,
        lat: latitude,
        lng: longitude
      },
      riskAssessment: {
        isInRiskZone: !!containingZone
      }
    };

    if (containingZone) {
      response.riskAssessment.zone = {
        zoneId: containingZone.zoneId,
        zoneName: containingZone.zoneName,
        riskLevel: containingZone.riskLevel,
        riskScore: containingZone.riskScore
      };
      response.riskAssessment.subsidenceData = containingZone.subsidenceData;
      response.riskAssessment.psinsar = containingZone.psinsar;
      response.riskAssessment.riskDescription = getRiskDescription(containingZone.riskLevel);
      response.safetyRecommendations = containingZone.safetyRecommendations;
      response.nearestSafeZone = containingZone.nearestSafeZone;
      response.color = getRiskColor(containingZone.riskLevel);
    } else {
      response.riskAssessment.riskLevel = 'stable';
      response.riskAssessment.riskScore = 15;
      response.riskAssessment.riskDescription = getRiskDescription('stable');
      response.color = getRiskColor('stable');
      
      if (nearestZone) {
        response.riskAssessment.nearestRiskZone = {
          zoneId: nearestZone.zoneId,
          zoneName: nearestZone.zoneName,
          riskLevel: nearestZone.riskLevel,
          distance: nearestZone.distance,
          unit: 'km'
        };
      }
    }

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Check risk error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Failed to check risk', hi: 'जोखिम जांच में विफल' } }
    });
  }
});

router.get('/zones/:zoneId', async (req, res) => {
  try {
    const zone = await RiskZone.findOne({ zoneId: req.params.zoneId, isActive: true }).lean();

    if (!zone) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: { en: 'Zone not found', hi: 'ज़ोन नहीं मिला' } }
      });
    }

    res.json({
      success: true,
      data: {
        zone,
        color: getRiskColor(zone.riskLevel)
      }
    });
  } catch (error) {
    console.error('Get zone details error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Failed to fetch zone details', hi: 'ज़ोन विवरण प्राप्त करने में विफल' } }
    });
  }
});

router.get('/statistics', async (req, res) => {
  try {
    const zones = await RiskZone.find({ isActive: true }).lean();

    const stats = {
      totalZones: zones.length,
      byRiskLevel: {
        critical: zones.filter(z => z.riskLevel === 'critical').length,
        high: zones.filter(z => z.riskLevel === 'high').length,
        moderate: zones.filter(z => z.riskLevel === 'moderate').length,
        low: zones.filter(z => z.riskLevel === 'low').length,
        stable: zones.filter(z => z.riskLevel === 'stable').length
      },
      totalAffectedArea: zones.reduce((sum, z) => sum + (z.affectedArea || 0), 0),
      totalPopulationAtRisk: zones.reduce((sum, z) => sum + (z.estimatedPopulation || 0), 0),
      maxSubsidenceRate: Math.max(...zones.map(z => z.subsidenceData?.maxRate || 0)),
      avgSubsidenceRate: zones.reduce((sum, z) => sum + (z.subsidenceData?.averageRate || 0), 0) / zones.length
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Failed to fetch statistics', hi: 'आंकड़े प्राप्त करने में विफल' } }
    });
  }
});

module.exports = router;
