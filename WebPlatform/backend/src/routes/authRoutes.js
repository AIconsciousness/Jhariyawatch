const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'jharia-watch-secret-key-2025';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('phone').trim().notEmpty().isMobilePhone('en-IN'),
  body('addressDetails.area').trim().notEmpty(),
  body('addressDetails.street').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: { en: 'Invalid input data', hi: 'अमान्य इनपुट डेटा' }, details: errors.array() }
      });
    }

    const { email, password, name, phone, preferredLanguage, addressDetails, homeLocation } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: { en: 'Email already registered', hi: 'ईमेल पहले से पंजीकृत है' } }
      });
    }

    const userData = {
      email,
      password,
      name,
      phone,
      preferredLanguage: preferredLanguage || 'hi',
      addressDetails: {
        area: addressDetails.area,
        street: addressDetails.street,
        landmark: addressDetails.landmark || '',
        pincode: addressDetails.pincode || '',
        nearbyMiningSite: addressDetails.nearbyMiningSite || ''
      }
    };

    // Only add homeLocation if coordinates are provided
    if (homeLocation && homeLocation.coordinates && homeLocation.coordinates.length === 2) {
      userData.homeLocation = homeLocation;
    }

    const user = new User(userData);

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: { en: 'User registered successfully', hi: 'उपयोगकर्ता सफलतापूर्वक पंजीकृत हो गया' },
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: { code: 'DUPLICATE_EMAIL', message: { en: 'Email already registered', hi: 'ईमेल पहले से पंजीकृत है' } }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Registration failed', hi: 'पंजीकरण विफल' } }
    });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: { en: 'Invalid credentials', hi: 'अमान्य क्रेडेंशियल' } }
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: { en: 'Invalid email or password', hi: 'अमान्य ईमेल या पासवर्ड' } }
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: { en: 'Invalid email or password', hi: 'अमान्य ईमेल या पासवर्ड' } }
      });
    }

    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Login failed', hi: 'लॉगिन विफल' } }
    });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: { en: 'User not found', hi: 'उपयोगकर्ता नहीं मिला' } }
      });
    }

    res.json({
      success: true,
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Failed to get profile', hi: 'प्रोफ़ाइल प्राप्त करने में विफल' } }
    });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token, user: firebaseUser } = req.body;

    if (!token || !firebaseUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_DATA', message: { en: 'Firebase token and user data required', hi: 'Firebase टोकन और उपयोगकर्ता डेटा आवश्यक है' } }
      });
    }

    // Verify Firebase token (in production, verify with Firebase Admin SDK)
    // For now, we'll trust the token and create/login user

    let user = await User.findOne({ email: firebaseUser.email });
    
    if (!user) {
      // Create new user from Google sign in
      user = new User({
        email: firebaseUser.email,
        name: firebaseUser.name || firebaseUser.displayName || 'User',
        phone: firebaseUser.phoneNumber || '',
        preferredLanguage: 'hi',
        password: Math.random().toString(36).slice(-12), // Random password for Google users
        addressDetails: {
          area: 'Other',
          street: ''
        },
        isActive: true
      });
      await user.save();
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token: jwtToken,
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Google authentication failed', hi: 'Google प्रमाणीकरण विफल' } }
    });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, preferredLanguage, addressDetails, homeLocation, notifications } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
    if (addressDetails) updateData.addressDetails = addressDetails;
    if (homeLocation) updateData.homeLocation = homeLocation;
    if (notifications) updateData.notifications = notifications;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true }
    );

    res.json({
      success: true,
      message: { en: 'Profile updated successfully', hi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई' },
      data: { user: user.toJSON() }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: { en: 'Failed to update profile', hi: 'प्रोफ़ाइल अपडेट करने में विफल' } }
    });
  }
});

module.exports = router;
