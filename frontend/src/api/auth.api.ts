import api from './axiosInstances';
import type { AuthResponse } from '../types';

export const authApi = {
  register: (data: { email: string; name: string; phone?: string; city?: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post('/api/auth/refresh', { refresh_token: refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/api/auth/logout', { refresh_token: refreshToken }),
};
