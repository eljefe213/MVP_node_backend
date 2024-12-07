import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{ message: string }>;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Login Error:', error.response?.data);
    }
    throw error;
  }
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  skills: string;
  availability: string;
  role?: 'volunteer' | 'admin' | 'superadmin';
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Register Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Get Users Error:', error.response?.data);
    }
    throw error;
  }
};

export default api;