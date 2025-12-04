const mongoose = require('mongoose');
const RiskZone = require('../models/RiskZone');
const Alert = require('../models/Alert');

const createSquarePolygon = (centerLat, centerLng, sizeKm) => {
  const offset = sizeKm / 111;
  return [[
    [centerLng - offset, centerLat - offset],
    [centerLng + offset, centerLat - offset],
    [centerLng + offset, centerLat + offset],
    [centerLng - offset, centerLat + offset],
    [centerLng - offset, centerLat - offset]
  ]];
};

const riskZonesData = [
  {
    zoneId: 'alkusa_critical_01',
    zoneName: { en: 'Alkusa Critical Zone - East of Shankar Road', hi: 'अल्कुसा क्रिटिकल ज़ोन - शंकर रोड के पूर्व' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.767, 86.396, 0.5) },
    riskLevel: 'critical',
    riskScore: 95,
    subsidenceData: {
      averageRate: 27, maxRate: 29, cumulativeDisplacement: 90,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR (2018-2021)'
    },
    psinsar: { coherence: 0.85, velocityStdDev: 2.1, temporalBaseline: 1095, spatialBaseline: 120 },
    description: {
      en: 'Critical subsidence zone over Alkusa opencast mine overburden dump. PSInSAR analysis shows maximum LOS velocity of -29 mm/year. High risk of sudden ground collapse.',
      hi: 'अल्कुसा ओपनकास्ट खदान के ऊपर क्रिटिकल धंसाव क्षेत्र। PSInSAR विश्लेषण -29 मिमी/वर्ष की अधिकतम LOS वेग दर्शाता है।'
    },
    affectedArea: 0.44, estimatedPopulation: 5000,
    safetyRecommendations: {
      en: ['Avoid staying in this area if possible', 'Regular building inspection required every 3 months', 'Keep emergency evacuation kit ready', 'Report any new cracks immediately via app'],
      hi: ['यदि संभव हो तो इस क्षेत्र में रहने से बचें', 'हर 3 महीने में नियमित भवन निरीक्षण आवश्यक', 'आपातकालीन निकासी किट तैयार रखें', 'ऐप के माध्यम से किसी भी नई दरार की तुरंत रिपोर्ट करें']
    },
    nearestSafeZone: { zoneId: 'dhanbad_safe_01', distance: 5.2, name: { en: 'Dhanbad City Center', hi: 'धनबाद शहर केंद्र' } },
    bccl_area: 'Area VIII', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'ena_critical_01',
    zoneName: { en: 'Ena Colliery Critical Zone', hi: 'एना कोलियरी क्रिटिकल ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.758, 86.401, 0.4) },
    riskLevel: 'critical',
    riskScore: 90,
    subsidenceData: {
      averageRate: 28, maxRate: 28, cumulativeDisplacement: 85,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.82, velocityStdDev: 2.5, temporalBaseline: 1095, spatialBaseline: 115 },
    description: {
      en: 'Critical zone near Ena Colliery with active subsidence. Multiple PS points showing consistent downward movement.',
      hi: 'एना कोलियरी के पास सक्रिय धंसाव वाला क्रिटिकल ज़ोन। कई PS बिंदु लगातार नीचे की ओर गति दिखा रहे हैं।'
    },
    affectedArea: 0.35, estimatedPopulation: 3500,
    safetyRecommendations: {
      en: ['Evacuate if building shows cracks', 'Avoid heavy construction work', 'Report ground subsidence immediately'],
      hi: ['यदि भवन में दरारें दिखें तो निकासी करें', 'भारी निर्माण कार्य से बचें', 'जमीन धंसने की तुरंत रिपोर्ट करें']
    },
    bccl_area: 'Area VIII', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'tisra_critical_01',
    zoneName: { en: 'Tisra - Jayrampur Critical Zone', hi: 'तिसरा - जयरामपुर क्रिटिकल ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.715, 86.434, 0.45) },
    riskLevel: 'critical',
    riskScore: 88,
    subsidenceData: {
      averageRate: 22, maxRate: 25, cumulativeDisplacement: 70,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.78, velocityStdDev: 3.0, temporalBaseline: 1095, spatialBaseline: 125 },
    description: {
      en: 'Critical subsidence zone at B.R. Company Jayrampur Colliery area in Tisra. Historical mining activities have weakened ground stability.',
      hi: 'तिसरा में B.R. कंपनी जयरामपुर कोलियरी क्षेत्र में क्रिटिकल धंसाव ज़ोन।'
    },
    affectedArea: 0.4, estimatedPopulation: 4200,
    safetyRecommendations: {
      en: ['Monitor building foundations regularly', 'Report unusual ground sounds', 'Know emergency contact numbers'],
      hi: ['नियमित रूप से भवन की नींव की निगरानी करें', 'असामान्य जमीन की आवाजों की रिपोर्ट करें', 'आपातकालीन संपर्क नंबर जानें']
    },
    bccl_area: 'Area IX', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'bera_dobari_high_01',
    zoneName: { en: 'Bera-Dobari High Risk Zone', hi: 'बेरा-डोबारी उच्च जोखिम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.758, 86.435, 0.5) },
    riskLevel: 'high',
    riskScore: 78,
    subsidenceData: {
      averageRate: 18, maxRate: 28, cumulativeDisplacement: 87,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.80, velocityStdDev: 2.8, temporalBaseline: 1095, spatialBaseline: 118 },
    description: {
      en: 'High risk zone with variable subsidence rates. Dobari Opencast area shows significant deformation.',
      hi: 'परिवर्तनीय धंसाव दरों वाला उच्च जोखिम क्षेत्र।'
    },
    affectedArea: 0.55, estimatedPopulation: 6000,
    safetyRecommendations: {
      en: ['Regular structural assessments recommended', 'Avoid heavy vehicle parking near buildings'],
      hi: ['नियमित संरचनात्मक मूल्यांकन की सिफारिश', 'भवनों के पास भारी वाहन पार्किंग से बचें']
    },
    bccl_area: 'Area IX', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'bastacola_high_01',
    zoneName: { en: 'Bastacola High Risk Zone', hi: 'बस्ताकोला उच्च जोखिम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.745, 86.420, 0.4) },
    riskLevel: 'high',
    riskScore: 72,
    subsidenceData: {
      averageRate: 10, maxRate: 15, cumulativeDisplacement: 30,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.83, velocityStdDev: 1.8, temporalBaseline: 1095, spatialBaseline: 110 },
    description: {
      en: 'High risk zone with moderate subsidence. Ongoing monitoring recommended.',
      hi: 'मध्यम धंसाव के साथ उच्च जोखिम क्षेत्र। निरंतर निगरानी की सिफारिश।'
    },
    affectedArea: 0.35, estimatedPopulation: 4000,
    bccl_area: 'Area IX', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'ck_siding_high_01',
    zoneName: { en: 'CK-Siding High Risk Zone', hi: 'CK-साइडिंग उच्च जोखिम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.730, 86.410, 0.4) },
    riskLevel: 'high',
    riskScore: 70,
    subsidenceData: {
      averageRate: 15, maxRate: 21, cumulativeDisplacement: 60,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.79, velocityStdDev: 2.2, temporalBaseline: 1095, spatialBaseline: 112 },
    description: {
      en: 'High risk zone near CK-Siding railway area. Underground voids present.',
      hi: 'CK-साइडिंग रेलवे क्षेत्र के पास उच्च जोखिम क्षेत्र।'
    },
    affectedArea: 0.3, estimatedPopulation: 3000,
    bccl_area: 'Area IX', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'jeenagora_moderate_01',
    zoneName: { en: 'Jeenagora Moderate Risk Zone', hi: 'जीनगोरा मध्यम जोखिम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.702, 86.452, 0.5) },
    riskLevel: 'moderate',
    riskScore: 55,
    subsidenceData: {
      averageRate: 5, maxRate: 8, cumulativeDisplacement: 20,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.86, velocityStdDev: 1.2, temporalBaseline: 1095, spatialBaseline: 105 },
    description: {
      en: 'Moderate risk zone near BCCL Hospital. Slow but consistent subsidence detected.',
      hi: 'BCCL अस्पताल के पास मध्यम जोखिम क्षेत्र।'
    },
    affectedArea: 0.5, estimatedPopulation: 5500,
    bccl_area: 'Area X', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'jorapokhar_moderate_01',
    zoneName: { en: 'Jorapokhar - Begariya More Moderate Zone', hi: 'जोरापोखर - बेगरिया मोड़ मध्यम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.699, 86.427, 0.45) },
    riskLevel: 'moderate',
    riskScore: 50,
    subsidenceData: {
      averageRate: 4, maxRate: 7, cumulativeDisplacement: 15,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.88, velocityStdDev: 1.0, temporalBaseline: 1095, spatialBaseline: 100 },
    description: {
      en: 'Moderate risk zone at Begariya More junction in Jorapokhar.',
      hi: 'जोरापोखर में बेगरिया मोड़ जंक्शन पर मध्यम जोखिम क्षेत्र।'
    },
    affectedArea: 0.4, estimatedPopulation: 4500,
    bccl_area: 'Area IX', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'kusunda_low_01',
    zoneName: { en: 'Kusunda Low Risk Zone', hi: 'कुसुंडा निम्न जोखिम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.780, 86.410, 0.6) },
    riskLevel: 'low',
    riskScore: 30,
    subsidenceData: {
      averageRate: 2, maxRate: 4, cumulativeDisplacement: 8,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.91, velocityStdDev: 0.8, temporalBaseline: 1095, spatialBaseline: 95 },
    description: {
      en: 'Low risk zone with minimal subsidence. PSInSAR shows stable ground conditions.',
      hi: 'न्यूनतम धंसाव वाला निम्न जोखिम क्षेत्र।'
    },
    affectedArea: 0.7, estimatedPopulation: 8000,
    bccl_area: 'Area VIII', isActive: true, lastUpdated: new Date()
  },
  {
    zoneId: 'lodna_moderate_01',
    zoneName: { en: 'Lodna Colliery Moderate Zone', hi: 'लोदना कोलियरी मध्यम ज़ोन' },
    geometry: { type: 'Polygon', coordinates: createSquarePolygon(23.724, 86.438, 0.4) },
    riskLevel: 'moderate',
    riskScore: 52,
    subsidenceData: {
      averageRate: 6, maxRate: 10, cumulativeDisplacement: 25,
      measurementPeriod: { start: new Date('2018-01-01'), end: new Date('2021-12-31') },
      dataSource: 'Sentinel-1 PSInSAR'
    },
    psinsar: { coherence: 0.84, velocityStdDev: 1.5, temporalBaseline: 1095, spatialBaseline: 108 },
    description: {
      en: 'Moderate risk zone around Lodna Colliery. Some ground instability detected.',
      hi: 'लोदना कोलियरी के आसपास मध्यम जोखिम क्षेत्र।'
    },
    affectedArea: 0.35, estimatedPopulation: 3800,
    bccl_area: 'Area IX', isActive: true, lastUpdated: new Date()
  }
];

const alertsData = [
  {
    alertId: 'ALT-20251201-001',
    alertType: 'warning',
    severity: 'high',
    title: {
      en: 'Increased Subsidence Activity in Alkusa Area',
      hi: 'अल्कुसा क्षेत्र में धंसाव गतिविधि में वृद्धि'
    },
    message: {
      en: 'Recent PSInSAR monitoring shows 15% increase in ground movement rate in Alkusa critical zone. Residents are advised to stay alert.',
      hi: 'हाल की PSInSAR निगरानी अल्कुसा क्रिटिकल ज़ोन में जमीन की गति दर में 15% वृद्धि दर्शाती है। निवासियों को सतर्क रहने की सलाह।'
    },
    targetZones: ['alkusa_critical_01'],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true,
    source: 'system',
    notificationSent: true,
    recipientCount: 5000,
    instructions: {
      en: ['Monitor walls and floors for new cracks', 'Keep important documents ready', 'Know your nearest safe assembly point'],
      hi: ['दीवारों और फर्श पर नई दरारों की निगरानी करें', 'महत्वपूर्ण दस्तावेज तैयार रखें', 'अपने निकटतम सुरक्षित सभा स्थल को जानें']
    },
    evacuationAdvised: false,
    emergencyContacts: [
      { name: 'BCCL Control Room', phone: '0326-2222000', role: 'Primary Contact' },
      { name: 'Dhanbad DC Office', phone: '0326-2222001', role: 'Administration' },
      { name: 'NDMA Helpline', phone: '1078', role: 'National Disaster' }
    ]
  },
  {
    alertId: 'ALT-20251202-001',
    alertType: 'info',
    severity: 'medium',
    title: {
      en: 'Monsoon Season Safety Advisory',
      hi: 'मानसून सीजन सुरक्षा सलाह'
    },
    message: {
      en: 'With monsoon approaching, soil conditions may change. Please remain vigilant and avoid construction in high-risk zones.',
      hi: 'मानसून के आने के साथ, मिट्टी की स्थिति बदल सकती है। कृपया सतर्क रहें।'
    },
    targetAll: true,
    targetZones: [],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    source: 'admin',
    notificationSent: true,
    recipientCount: 15000,
    instructions: {
      en: ['Ensure proper drainage around your home', 'Avoid digging near buildings', 'Report water logging in risk zones'],
      hi: ['अपने घर के चारों ओर उचित जल निकासी सुनिश्चित करें', 'भवनों के पास खुदाई से बचें', 'जोखिम क्षेत्रों में जलभराव की रिपोर्ट करें']
    },
    evacuationAdvised: false
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');
    await RiskZone.deleteMany({});
    await Alert.deleteMany({});
    console.log('Cleared existing data');

    await RiskZone.insertMany(riskZonesData);
    console.log(`Inserted ${riskZonesData.length} risk zones`);

    await Alert.insertMany(alertsData);
    console.log(`Inserted ${alertsData.length} alerts`);

    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Seed error:', error);
    return false;
  }
};

module.exports = { seedDatabase, riskZonesData, alertsData };
