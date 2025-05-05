import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const restaurantAPI = {
  getAll: () => api.get('/api/restaurants'),
  getById: (id: string) => api.get(`/api/restaurants/${id}`),
  getMenu: (id: string) => api.get(`/api/restaurants/${id}/menu`),
};

export const menuAPI = {
  getAll: () => api.get('/api/menu'),
  getById: (id: string) => api.get(`/api/menu/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/api/orders', data),
  getAll: () => api.get('/api/orders'),
  getById: (id: string) => api.get(`/api/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/api/orders/${id}`, { status }),
};

export const userAPI = {
  signup: (data: any) => api.post('/api/users/signup', data),
  signin: (data: any) => api.post('/api/users/signin', data),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: any) => api.put('/api/users/profile', data),
};

export default api;
