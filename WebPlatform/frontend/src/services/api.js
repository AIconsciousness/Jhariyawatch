import axios from 'axios';

// Use environment variable for production, fallback to proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log all errors for debugging
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method
      });
    } else if (error.request) {
      // Request made but no response received (network error, CORS, etc.)
      console.error('API Network Error:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        hint: 'Backend server might not be running or CORS issue'
      });
    } else {
      // Something else happened
      console.error('API Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const riskAPI = {
  getZones: (params) => api.get('/risk/zones', { params }),
  checkLocation: (lat, lng) => api.get('/risk/check', { params: { lat, lng } }),
  getZoneDetails: (zoneId) => api.get(`/risk/zones/${zoneId}`),
  getStatistics: () => api.get('/risk/statistics')
};

export const reportAPI = {
  submit: (data) => api.post('/reports', data, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getMyReports: (params) => api.get('/reports', { params }),
  getAllReports: (params) => api.get('/reports/all', { params }),
  getReport: (reportId) => api.get(`/reports/${reportId}`)
};

export const alertAPI = {
  getAlerts: (params) => api.get('/alerts', { params }),
  getAlert: (alertId) => api.get(`/alerts/${alertId}`)
};

export const adminAPI = {
  seedDatabase: () => api.post('/admin/seed')
};

export default api;
