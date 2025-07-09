import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Applications API
export const applicationsAPI = {
  submitBirthCertificate: (formData) => {
    return api.post('/applications/birth-certificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submitPassport: (formData) => {
    return api.post('/applications/passport', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submitBoth: (formData) => {
    return api.post('/applications/both', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyApplications: () => api.get('/applications/my-applications'),
};

// Tracking API
export const trackingAPI = {
  trackByApplicationId: (applicationId) => api.get(`/tracking/application/${applicationId}`),
  trackByEmail: (email) => api.post('/tracking/by-email', { email }),
};

export default api;