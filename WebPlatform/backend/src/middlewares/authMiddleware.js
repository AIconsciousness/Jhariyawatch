const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jharia-watch-secret-key-2025';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: { en: 'Authentication required', hi: 'प्रमाणीकरण आवश्यक है' }
        }
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: { en: 'Token expired, please login again', hi: 'टोकन समाप्त हो गया, कृपया फिर से लॉगिन करें' }
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: { en: 'Invalid token', hi: 'अमान्य टोकन' }
      }
    });
  }
};

module.exports = authMiddleware;
