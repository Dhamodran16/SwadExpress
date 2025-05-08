import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Please check if the backend server is running');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const restaurantAPI = {
  getAll: () => api.get('/api/restaurants'),
  getById: (id: string) => api.get(`/api/restaurants/${id}`),
};

export const menuAPI = {
  getAll: () => api.get('/api/menu'),
  getByRestaurantId: (restaurantId: string) => api.get(`/api/menu/restaurant/${restaurantId}`),
  getById: (id: string) => api.get(`/api/menu/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/api/orders', data),
  getAll: () => api.get('/api/orders'),
  getById: (id: string) => api.get(`/api/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/api/orders/${id}`, { status }),
};

export const userAPI = {
  // Signup: POST /api/users
  signup: (data: any) => api.post('/api/users', data),
  // Get profile: GET /api/users/:firebaseUid
  getProfile: (firebaseUid: string) => api.get(`/api/users/${firebaseUid}`),
  // Update profile: PATCH /api/users/:firebaseUid
  updateProfile: (firebaseUid: string, data: any) => api.patch(`/api/users/${firebaseUid}`, data),
  // Delete profile: DELETE /api/users/:firebaseUid
  deleteProfile: (firebaseUid: string) => api.delete(`/api/users/${firebaseUid}`),
  // Update password: PATCH /api/users/:firebaseUid/password
  updatePassword: (firebaseUid: string, data: any) => api.patch(`/api/users/${firebaseUid}/password`, data),
};

export default api;
