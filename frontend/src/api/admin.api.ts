import api from './axiosInstances';
import type { AdminStats, User } from '../types';

export const adminApi = {
  getStats: () =>
    api.get<AdminStats>('/api/admin/stats/'),

  getUsers: (params?: Record<string, string>) =>
    api.get<{ results: User[] }>('/api/admin/users/', { params }),

  updateUser: (id: string, data: { is_active?: boolean; role?: string }) =>
    api.patch(`/api/admin/users/${id}/`, data),

  getEstimates: (params?: Record<string, string>) =>
    api.get('/api/admin/estimates/', { params }),
};
