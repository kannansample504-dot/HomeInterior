from django.contrib import admin
from .models import PricingMatrix, PriceHistory, TaxConfig


@admin.register(PricingMatrix)
class PricingMatrixAdmin(admin.ModelAdmin):
    list_display = ("room_type", "tier", "price_per_sqft", "updated_at")
    list_filter = ("room_type", "tier")
    list_editable = ("price_per_sqft",)


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ("pricing_matrix", "old_price", "new_price", "changed_by", "changed_at")
    list_filter = ("changed_at",)
    readonly_fields = ("pricing_matrix", "old_price", "new_price", "changed_by", "changed_at")


@admin.register(TaxConfig)
class TaxConfigAdmin(admin.ModelAdmin):
    list_display = ("gst_percent", "labour_percent", "updated_at")

    def has_add_permission(self, request):
        return not TaxConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
