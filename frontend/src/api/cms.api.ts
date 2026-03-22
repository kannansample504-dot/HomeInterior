import api from './axiosInstances';
import type { CompanyProfile, SEOMeta, Testimonial, FAQ } from '../types';

export const cmsApi = {
  getCompanyProfile: () =>
    api.get<CompanyProfile>('/api/cms/company/'),

  updateCompanyProfile: (data: Partial<CompanyProfile>) =>
    api.put('/api/cms/company/', data),

  getPageContent: (pageSlug: string) =>
    api.get<Record<string, string>>(`/api/cms/${pageSlug}/`),

  updatePageContent: (pageSlug: string, fields: { field_key: string; field_value: string }[]) =>
    api.put(`/api/cms/${pageSlug}/`, { fields }),

  getSEO: (slug: string) =>
    api.get<SEOMeta>(`/api/cms/seo/${slug}/`),

  updateSEO: (slug: string, data: Partial<SEOMeta>) =>
    api.put(`/api/cms/seo/${slug}/`, data),

  getTestimonials: () =>
    api.get<Testimonial[]>('/api/cms/testimonials/'),

  getFAQs: () =>
    api.get<FAQ[]>('/api/cms/faqs/'),
};
