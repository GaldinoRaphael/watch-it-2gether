import axios from 'axios';
import { environmentService } from '../services/environmentService';

export const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Resolve baseURL lazily so environmentService.configure() can run first
httpClient.interceptors.request.use((config) => {
  config.baseURL = environmentService.apiBaseUrl;
  return config;
});
