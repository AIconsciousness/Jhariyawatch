import axios from 'axios';

const API_BASE_URL = '/api';

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
  submit: (formData) => api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
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
