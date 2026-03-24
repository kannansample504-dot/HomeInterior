from django.urls import path
from .views import (
    CompanyProfileView, CMSContentView, SEOMetaView,
    TestimonialListView, FAQListView,
    PortfolioProjectListView, PortfolioProjectAdminView, PortfolioProjectDetailView,
)

urlpatterns = [
    path("company/", CompanyProfileView.as_view(), name="company-profile"),
    path("seo/<str:slug>/", SEOMetaView.as_view(), name="seo-meta"),
    path("testimonials/", TestimonialListView.as_view(), name="testimonials"),
    path("faqs/", FAQListView.as_view(), name="faqs"),
    path("projects/", PortfolioProjectListView.as_view(), name="portfolio-projects"),
    path("admin/projects/", PortfolioProjectAdminView.as_view(), name="portfolio-admin"),
    path("admin/projects/<int:pk>/", PortfolioProjectDetailView.as_view(), name="portfolio-detail"),
    path("<str:page_slug>/", CMSContentView.as_view(), name="cms-content"),
]
