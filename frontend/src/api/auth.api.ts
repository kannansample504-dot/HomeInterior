import api from './axiosInstances';
import type { AuthResponse } from '../types';

export const authApi = {
  // Use Django endpoints for auth (consistent password hashing)
  register: (data: { email: string; name: string; phone?: string; city?: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/register/', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login/', data),

  refresh: (refreshToken: string) =>
    api.post('/api/auth/refresh/', { refresh: refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/api/auth/logout/', { refresh: refreshToken }),

  getMe: () =>
    api.get('/api/users/me/'),

  updateProfile: (data: { name?: string; phone?: string; city?: string }) =>
    api.patch('/api/users/me/', data),
};
