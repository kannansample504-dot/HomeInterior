from rest_framework import serializers
from .models import EstimationRecord


class RoomInputSerializer(serializers.Serializer):
    room_type = serializers.ChoiceField(choices=[
        "living_room", "bedroom", "kitchen", "bathroom", "dining_room", "home_office",
    ])
    count = serializers.IntegerField(min_value=1, max_value=10, default=1)


class CalculateInputSerializer(serializers.Serializer):
    rooms = RoomInputSerializer(many=True)
    tier = serializers.ChoiceField(choices=["basic", "standard", "premium", "luxury"])


class SaveEstimateSerializer(serializers.Serializer):
    project_type = serializers.ChoiceField(choices=["new", "renovation"], default="new")
    property_type = serializers.ChoiceField(
        choices=["apartment", "villa", "house", "penthouse"], default="apartment",
    )
    style = serializers.CharField(required=False, default="")
    rooms = RoomInputSerializer(many=True)
    tier = serializers.ChoiceField(choices=["basic", "standard", "premium", "luxury"])
    guest_email = serializers.EmailField(required=False, default="")


class EstimationRecordSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True, default="")
    user_email = serializers.CharField(source="user.email", read_only=True, default="")

    class Meta:
        model = EstimationRecord
        fields = [
            "id", "user_name", "user_email", "guest_email",
            "project_type", "property_type", "style", "tier",
            "rooms_breakdown", "material_cost", "labour_cost",
            "labour_percent_snapshot", "subtotal", "gst_amount",
            "gst_percent_snapshot", "grand_total", "status",
            "created_at", "updated_at",
        ]
        read_only_fields = fields
