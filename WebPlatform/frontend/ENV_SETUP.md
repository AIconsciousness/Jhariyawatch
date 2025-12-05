# Environment Variables Setup

## Frontend `.env` File

Create a `.env` file in `WebPlatform/frontend/` directory with the following content:

```env
# Backend API URL
# Development: http://localhost:3001
# Production: https://jhariyawatch-backend.onrender.com
# Note: If not set, production will auto-detect and use backend URL
VITE_API_URL=http://localhost:3001

# Cloudinary Configuration (CONFIGURED ✅)
VITE_CLOUDINARY_CLOUD_NAME=dhrzekva0
VITE_CLOUDINARY_API_KEY=668573826234893
VITE_CLOUDINARY_API_SECRET=uBSa7-0cCoOXoIWF7-DLpGE0ZmQ
VITE_CLOUDINARY_UPLOAD_PRESET=jharia_reports

# Google Earth Engine Configuration (CONFIGURED ✅)
VITE_GOOGLE_EARTH_ENGINE_API_KEY=AIzaSyDqDM0UtR42QblS2NKXFSa0scXiNxTe7qw
VITE_GOOGLE_EARTH_ENGINE_PROJECT_ID=jharia-watch

# Firebase Configuration (Add when available)
# VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
# VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
# VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
# VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
# VITE_FIREBASE_APP_ID=YOUR_APP_ID
# VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

## Important Notes

1. **Cloudinary**: Already configured with your credentials
   - All images will be uploaded to Cloudinary
   - Images stored in `jharia-reports` folder
   - URLs will be saved in MongoDB

2. **OTP Verification**: Mock OTP enabled
   - Use `123456` or `000000` for testing
   - Real Firebase OTP will work when Firebase is configured

3. **Google Earth Engine**: API key added
   - Ready for Sentinel-1 data integration

4. **Image Upload Flow**:
   - User selects image → Uploads to Cloudinary → URL saved in MongoDB
   - No local file storage needed

## Setup Steps

1. Create `.env` file in `WebPlatform/frontend/` directory
2. Copy the content above
3. Restart frontend server: `npm run dev`

