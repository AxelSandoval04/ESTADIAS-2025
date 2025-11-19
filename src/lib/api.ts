// Users
export const usersAPI = {
  updateProfile: (data: { name: string; email: string; password?: string; newPassword?: string }) =>
    api.put('/auth/profile', data),
};
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a cada request
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
};

// Projects
export const projectsAPI = {
  getAll: (featured?: boolean) => 
    api.get('/projects', { params: { featured } }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  deactivate: (id: string) => api.patch(`/projects/${id}/deactivate`),
};

// Quotes
export const quotesAPI = {
  create: (data: any) => api.post('/quotes', data),
  getAll: (status?: string) => 
    api.get('/quotes', { params: { status } }),
  getById: (id: string) => api.get(`/quotes/${id}`),
  update: (id: string, data: any) => api.put(`/quotes/${id}`, data),
  respond: (id: string, message: string) => 
    api.post(`/quotes/${id}/respond`, { message }),
  delete: (id: string) => api.delete(`/quotes/${id}`),
};

// Reviews
export const reviewsAPI = {
  getAll: (params?: { project?: string }) => 
    api.get('/reviews', { params }),
  getAllForAdmin: () => 
    api.get('/reviews/all'),
  getApproved: () => 
    api.get('/reviews/approved').then(res => res.data),
  create: (data: { comment: string; rating: number; project?: string }) => 
    api.post('/reviews', data),
  moderate: (id: string, status: 'approved' | 'rejected') => 
    api.post(`/reviews/${id}/moderate`, { status }),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  deactivate: (id: string) => api.patch(`/categories/${id}/deactivate`),
};

export default api;
