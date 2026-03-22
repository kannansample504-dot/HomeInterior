import api from './axiosInstances';
import type { PricingItem, TaxConfig } from '../types';

export const pricingApi = {
  getMatrix: () =>
    api.get<{ flat: PricingItem[]; grouped: Record<string, Record<string, number>> }>('/api/pricing/'),

  updateMatrix: (prices: { id: number; price_per_sqft: number }[]) =>
    api.put('/api/pricing/', { prices }),

  getTaxConfig: () =>
    api.get<TaxConfig>('/api/pricing/tax/'),

  updateTaxConfig: (data: Partial<TaxConfig>) =>
    api.put('/api/pricing/tax/', data),

  getPriceHistory: () =>
    api.get('/api/pricing/history/'),
};
