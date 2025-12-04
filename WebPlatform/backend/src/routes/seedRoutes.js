const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../data/seedData');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/seed', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: { en: 'Admin access required', hi: 'व्यवस्थापक पहुंच आवश्यक' } }
      });
    }

    const success = await seedDatabase();
    if (success) {
      res.json({
        success: true,
        message: { en: 'Database seeded successfully', hi: 'डेटाबेस सफलतापूर्वक सीड किया गया' }
      });
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SEED_FAILED', message: { en: 'Failed to seed database', hi: 'डेटाबेस सीड करने में विफल' } }
      });
    }
  } catch (error) {
    console.error('Seed route error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Seed operation failed', hi: 'सीड ऑपरेशन विफल' } }
    });
  }
});

module.exports = router;
