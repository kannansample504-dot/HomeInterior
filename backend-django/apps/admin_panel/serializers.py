from rest_framework import serializers
from apps.users.models import User
from apps.estimates.models import EstimationRecord


class AdminUserSerializer(serializers.ModelSerializer):
    estimates_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "name", "phone", "city", "role",
            "is_active", "date_joined", "last_login", "estimates_count",
        ]

    def get_estimates_count(self, obj):
        return obj.estimates.count()


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["is_active", "role"]


class AdminEstimateSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True, default="")
    user_email = serializers.CharField(source="user.email", read_only=True, default="")

    class Meta:
        model = EstimationRecord
        fields = [
            "id", "user_name", "user_email", "guest_email",
            "project_type", "property_type", "style", "tier",
            "rooms_breakdown", "material_cost", "labour_cost",
            "subtotal", "gst_amount", "grand_total", "status",
            "created_at",
        ]


class AdminStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_estimates = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    avg_estimate_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_trend = serializers.ListField()
