# JhariaWatch 🔥

**Advanced Coal Mine Subsidence Risk Monitoring Platform for Jharia Coalfield**

JhariaWatch is a comprehensive web-based platform designed to monitor and alert residents of the Jharia coalfield area about land subsidence risks using satellite-based PS-InSAR (Persistent Scatterer Interferometric Synthetic Aperture Radar) technology.

## 🌟 Overview

Jharia coalfield in Jharkhand, India, is one of the world's most critical coal mining regions, home to over 1 million people living in constant danger from underground coal fires and land subsidence. JhariaWatch aims to protect lives and property by providing real-time monitoring, risk assessment, and early warning systems.

## ⚠️ The Problem

- **450+ sq km** of active mining and fire-affected area
- **100+ underground fires** burning for decades
- **Thousands of families** at risk from sudden land subsidence
- Limited awareness and delayed response to subsidence events
- Inadequate monitoring infrastructure

## 💡 Our Solution

JhariaWatch leverages cutting-edge satellite technology and modern web infrastructure to:

- **Monitor** land displacement with millimeter-level accuracy using PS-InSAR
- **Alert** residents in real-time when subsidence risks increase
- **Map** risk zones across the entire Jharia region
- **Educate** communities about safety measures and emergency protocols
- **Report** incidents through crowdsourced data collection

## 🚀 Features

### For Residents
- 📍 **Real-time Risk Assessment** - Check subsidence risk for your location
- 🔔 **Instant Alerts** - Get notifications for critical risk changes
- 📱 **Multi-language Support** - Available in English and Hindi
- 📸 **Incident Reporting** - Submit photos and reports of ground changes
- 🗺️ **Interactive Maps** - View detailed risk zones on interactive maps
- 🛡️ **Safety Guidelines** - Access emergency procedures and safety tips

### For Officials & Researchers
- 📊 **Comprehensive Dashboard** - Monitor all risk zones at once
- 📈 **Historical Data** - Access subsidence trends and patterns
- 🔬 **PS-InSAR Integration** - Satellite data processing and analysis
- 📋 **Community Reports** - Review and verify user-submitted incidents
- 🚨 **Alert Management** - Create and broadcast emergency alerts

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for user data and risk zones
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **RESTful API** - Clean API architecture

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Leaflet** - Interactive mapping
- **i18next** - Internationalization (English/Hindi)
- **Axios** - HTTP client

### Satellite Technology
- **PS-InSAR** - Persistent Scatterer Interferometry
- **Sentinel-1** SAR data processing
- **Millimeter-level** displacement accuracy
- **Time-series analysis** for trend detection

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd WebPlatform/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/jhariawatch
# JWT_SECRET=your-secret-key
# PORT=3001

# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd WebPlatform/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5000`
- Backend API: `http://localhost:3001`

## 🗂️ Project Structure

```
JhariaWatch/
├── WebPlatform/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── models/          # Database schemas
│   │   │   ├── routes/          # API endpoints
│   │   │   ├── middlewares/     # Auth & validation
│   │   │   └── data/            # Seed data
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/      # Reusable components
│       │   ├── pages/           # Page components
│       │   ├── context/         # React contexts
│       │   ├── services/        # API services
│       │   └── i18n/            # Translations
│       └── package.json
├── Assets and Research paper/   # Images & research
└── Planning doc/                # Documentation
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Risk Assessment
- `GET /api/risk/zones` - Get all risk zones
- `GET /api/risk/check/:lat/:lng` - Check location risk
- `GET /api/risk/statistics` - Get risk statistics

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert (Admin)
- `PUT /api/alerts/:id` - Update alert

### Reports
- `POST /api/reports` - Submit incident report
- `GET /api/reports` - Get all reports
- `PUT /api/reports/:id` - Update report status

## 🌍 Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Set environment variables
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the application
npm run build

# Deploy the dist folder
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Developed with passion to protect the communities of Jharia coalfield.

## 📞 Contact

For queries, suggestions, or collaborations:
- **Email**: contact@jhariawatch.org
- **Emergency Helpline**: 1800-xxx-xxxx

## 🙏 Acknowledgments

- Sentinel-1 SAR data from ESA Copernicus program
- Research papers on Jharia subsidence monitoring
- Local community feedback and support
- BCCL (Bharat Coking Coal Limited) for data sharing

## ⚠️ Disclaimer

This platform is designed to assist in monitoring and awareness but should not replace official emergency services. Always follow official guidelines and evacuate when authorities recommend.

---

**Built for the people of Jharia. Stay Safe. Stay Informed.**
