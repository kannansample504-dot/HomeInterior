from django.contrib import admin
from .models import CompanyProfile, CMSContent, SEOMeta, Testimonial, FAQ


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "updated_at")

    def has_add_permission(self, request):
        return not CompanyProfile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CMSContent)
class CMSContentAdmin(admin.ModelAdmin):
    list_display = ("page_slug", "field_key", "field_type", "updated_at")
    list_filter = ("page_slug", "field_type")
    search_fields = ("field_key", "field_value")


@admin.register(SEOMeta)
class SEOMetaAdmin(admin.ModelAdmin):
    list_display = ("page_slug", "meta_title", "updated_at")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "rating", "is_visible", "order")
    list_editable = ("is_visible", "order")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_visible", "order")
    list_editable = ("is_visible", "order")
