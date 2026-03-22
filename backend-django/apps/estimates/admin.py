from django.contrib import admin
from .models import EstimationRecord


@admin.register(EstimationRecord)
class EstimationRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "property_type", "tier", "grand_total", "status", "created_at")
    list_filter = ("status", "tier", "property_type", "project_type")
    search_fields = ("user__name", "user__email", "guest_email")
    readonly_fields = (
        "id", "rooms_breakdown", "material_cost", "labour_cost",
        "subtotal", "gst_amount", "grand_total", "created_at",
    )
