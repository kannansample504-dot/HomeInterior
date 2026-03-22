import api from './axiosInstances';
import type { EstimateResult, EstimationRecord, RoomInput } from '../types';

export const estimatesApi = {
  calculate: (data: { rooms: RoomInput[]; tier: string }) =>
    api.post<EstimateResult>('/api/estimates/calculate/', data),

  save: (data: {
    rooms: RoomInput[];
    tier: string;
    project_type?: string;
    property_type?: string;
    style?: string;
    guest_email?: string;
  }) => api.post<EstimationRecord>('/api/estimates/', data),

  getMine: () =>
    api.get<{ results: EstimationRecord[] }>('/api/estimates/mine/'),

  getById: (id: string) =>
    api.get<EstimationRecord>(`/api/estimates/${id}/`),

  delete: (id: string) =>
    api.delete(`/api/estimates/${id}/`),
};
