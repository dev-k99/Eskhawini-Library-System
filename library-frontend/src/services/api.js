import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7090/api';

const api = axios.create({
  baseURL: API_URL,
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

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  requestPasswordReset: (email) => api.post('/auth/request-password-reset', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Books endpoints
export const booksApi = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  remove: (id) => api.delete(`/books/${id}`),
};

// Loans endpoints
export const loansApi = {
  getAll: () => api.get('/loans'),
  getMy: () => api.get('/loans/my'),
  getById: (id) => api.get(`/loans/${id}`),
  create: (data) => api.post('/loans', data),
  return: (id, data) => api.post(`/loans/${id}/return`, data || {}),
  getQRCode: (id) => api.get(`/loans/${id}/qrcode`),
  getOverdue: () => api.get('/loans/overdue'),
};

// Reservations endpoints
export const reservationsApi = {
  getAll: () => api.get('/reservations'),
  getMy: () => api.get('/reservations/my'),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.delete(`/reservations/${id}`),
};

// Users endpoints (Admin only)
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Analytics endpoints
export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary'),
  getMostBorrowed: (count = 10) => api.get('/analytics/most-borrowed', { params: { count } }),
  getUserActivity: (count = 10) => api.get('/analytics/user-activity', { params: { count } }),
  getGenreTrends: () => api.get('/analytics/genre-trends'),
};

// Sustainability endpoints
export const sustainabilityApi = {
  getStats: () => api.get('/sustainability/stats'),
  calculate: (data) => api.post('/sustainability/calculate', data),
  getEcoImpact: () => api.get('/sustainability/eco-impact'),
};

export default api;
