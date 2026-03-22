from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CompanyProfile, CMSContent, SEOMeta, Testimonial, FAQ
from .serializers import (
    CompanyProfileSerializer,
    CMSContentSerializer,
    CMSContentBulkUpdateSerializer,
    SEOMetaSerializer,
    TestimonialSerializer,
    FAQSerializer,
)


# ── Company Profile ──────────────────────────────────────

class CompanyProfileView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @method_decorator(cache_page(300))
    def get(self, request):
        profile = CompanyProfile.load()
        return Response(CompanyProfileSerializer(profile).data)

    def put(self, request):
        profile = CompanyProfile.load()
        serializer = CompanyProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        cache.delete_pattern("*company*")
        return Response(serializer.data)


# ── CMS Content ──────────────────────────────────────────

class CMSContentView(APIView):
    """GET returns flat {key: value} dict. PUT accepts bulk updates."""

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @method_decorator(cache_page(300))
    def get(self, request, page_slug):
        items = CMSContent.objects.filter(page_slug=page_slug)
        data = {item.field_key: item.field_value for item in items}
        return Response(data)

    def put(self, request, page_slug):
        serializer = CMSContentBulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for field_data in serializer.validated_data["fields"]:
            CMSContent.objects.update_or_create(
                page_slug=page_slug,
                field_key=field_data["field_key"],
                defaults={
                    "field_value": field_data.get("field_value", ""),
                    "field_type": field_data.get("field_type", "text"),
                    "updated_by": request.user,
                },
            )
        cache.delete_pattern(f"*{page_slug}*")
        items = CMSContent.objects.filter(page_slug=page_slug)
        return Response({item.field_key: item.field_value for item in items})


# ── SEO Meta ─────────────────────────────────────────────

class SEOMetaView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @method_decorator(cache_page(300))
    def get(self, request, slug):
        seo, _ = SEOMeta.objects.get_or_create(page_slug=slug)
        return Response(SEOMetaSerializer(seo).data)

    def put(self, request, slug):
        seo, _ = SEOMeta.objects.get_or_create(page_slug=slug)
        serializer = SEOMetaSerializer(seo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        cache.delete_pattern(f"*seo*{slug}*")
        return Response(serializer.data)


# ── Testimonials ─────────────────────────────────────────

class TestimonialListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.filter(is_visible=True)
    pagination_class = None

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


# ── FAQs ─────────────────────────────────────────────────

class FAQListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = FAQSerializer
    queryset = FAQ.objects.filter(is_visible=True)
    pagination_class = None

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
