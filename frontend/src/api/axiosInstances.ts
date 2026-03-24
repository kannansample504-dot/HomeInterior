import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

// Single axios instance — Nginx routes to correct backend
const api = axios.create({ baseURL: BASE });

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = sessionStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${BASE}/api/auth/refresh/`, {
            refresh,
          });
          sessionStorage.setItem('access_token', res.data.access);
          sessionStorage.setItem('refresh_token', res.data.refresh);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
