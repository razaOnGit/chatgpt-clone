import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
export const geminiAPI = {
  summarize: (text) => api.post('/gemini/summarize', { text }),
  generateParagraph: (topic) => api.post('/gemini/paragraph', { topic }),
  chat: (message) => api.post('/gemini/chat', { message }),
  convertToJs: (text) => api.post('/gemini/jsconvert', { text }),
  imageToText: (image) => api.post('/gemini/imagetotext', { image }),
};

export const authAPI = {
  login: (credentials) => api.post('/v1/auth/login', credentials),
  register: (userData) => api.post('/v1/auth/register', userData),
  logout: () => api.post('/v1/auth/logout'),
};

export default api;