import axios from 'axios';
import { getAuthToken } from '../lib/auth';

const API_URL = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')  
? 'https://tecsup-fiver-backend.onrender.com'
  : 'http://localhost:4000';



export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, 
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken(); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o no autorizada. Requiere re-autenticación.');
    }
    return Promise.reject(error);
  }
);