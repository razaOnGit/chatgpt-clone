import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "https://ai2backend.vercel.app"; // Fallback for local development

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Add this for cookies
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
// api.js
export const geminiAPI = {
  summarize: (text) => api.post('/gemini/summarize', { text }),
  generateParagraph: (topic) => api.post('/gemini/paragraph', { topic }),
  chat: (message) => api.post('/gemini/chat', { message }),
  convertToJs: (text) => api.post('/gemini/code', { text }), // Changed to match backend route
  imageToText: (image) => api.post('/gemini/image-to-text', { image }) // Match backend route
};

export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials), // Added /api prefix
  register: (userData) => api.post('/api/v1/auth/register', userData), // Added /api prefix
  logout: () => api.post('/api/v1/auth/logout'), // Added /api prefix
};

export default api;