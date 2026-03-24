import api from './axiosInstances';
import type { CompanyProfile, SEOMeta, Testimonial, FAQ, PortfolioProject } from '../types';

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

  getProjects: () =>
    api.get<PortfolioProject[]>('/api/cms/projects/'),

  adminGetProjects: () =>
    api.get<PortfolioProject[]>('/api/cms/admin/projects/'),

  adminCreateProject: (data: Omit<PortfolioProject, 'id'>) =>
    api.post<PortfolioProject>('/api/cms/admin/projects/', data),

  adminUpdateProject: (id: number, data: Partial<PortfolioProject>) =>
    api.patch<PortfolioProject>(`/api/cms/admin/projects/${id}/`, data),

  adminDeleteProject: (id: number) =>
    api.delete(`/api/cms/admin/projects/${id}/`),
};
