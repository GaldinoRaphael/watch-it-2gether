import axios from 'axios';
import { environmentService } from '../services/environmentService';

export const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Resolve baseURL lazily and inject auth token on every request
httpClient.interceptors.request.use((config) => {
  config.baseURL = environmentService.apiBaseUrl;
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout when a stored token is rejected by the server
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('auth_token')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.replace('/login');
    }
    return Promise.reject(error);
  },
);
