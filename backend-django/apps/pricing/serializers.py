from rest_framework import serializers
from .models import PricingMatrix, PriceHistory, TaxConfig


class PricingMatrixSerializer(serializers.ModelSerializer):
    room_type_display = serializers.CharField(source="get_room_type_display", read_only=True)
    tier_display = serializers.CharField(source="get_tier_display", read_only=True)

    class Meta:
        model = PricingMatrix
        fields = [
            "id", "room_type", "room_type_display",
            "tier", "tier_display", "price_per_sqft", "updated_at",
        ]


class PricingBulkUpdateSerializer(serializers.Serializer):
    """Accepts a list of {id, price_per_sqft} for bulk update."""
    prices = serializers.ListField(
        child=serializers.DictField()
    )


class PriceHistorySerializer(serializers.ModelSerializer):
    room_type = serializers.CharField(source="pricing_matrix.room_type")
    tier = serializers.CharField(source="pricing_matrix.tier")

    class Meta:
        model = PriceHistory
        fields = ["id", "room_type", "tier", "old_price", "new_price", "changed_at"]


class TaxConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxConfig
        fields = ["gst_percent", "labour_percent", "updated_at"]
