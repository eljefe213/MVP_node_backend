import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
  skills: string;
  availability: string;
}) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users/me');
  return [response.data]; // Wrap the single user in an array for consistency
};

export default api;