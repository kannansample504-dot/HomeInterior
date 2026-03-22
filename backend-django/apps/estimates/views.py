from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EstimationRecord
from .serializers import (
    CalculateInputSerializer,
    SaveEstimateSerializer,
    EstimationRecordSerializer,
)
from .services import calculate_estimate


class CalculateView(APIView):
    """Stateless estimation calculation — no auth required."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CalculateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = calculate_estimate(
            rooms=serializer.validated_data["rooms"],
            tier=serializer.validated_data["tier"],
        )
        return Response(result)


class SaveEstimateView(APIView):
    """Save an estimate — auth optional (guest_email for guests)."""

    def get_permissions(self):
        return [permissions.AllowAny()]

    def post(self, request):
        serializer = SaveEstimateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        result = calculate_estimate(rooms=data["rooms"], tier=data["tier"])

        record = EstimationRecord.objects.create(
            user=request.user if request.user.is_authenticated else None,
            guest_email=data.get("guest_email", ""),
            project_type=data["project_type"],
            property_type=data["property_type"],
            style=data.get("style", ""),
            tier=data["tier"],
            rooms_breakdown=result["breakdown"],
            material_cost=result["material_cost"],
            labour_cost=result["labour_cost"],
            labour_percent_snapshot=result["labour_percent"],
            subtotal=result["subtotal"],
            gst_amount=result["gst_amount"],
            gst_percent_snapshot=result["gst_percent"],
            grand_total=result["grand_total"],
            status="saved" if request.user.is_authenticated else "draft",
        )
        return Response(
            EstimationRecordSerializer(record).data,
            status=status.HTTP_201_CREATED,
        )


class MyEstimatesView(generics.ListAPIView):
    """List current user's estimates."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EstimationRecordSerializer

    def get_queryset(self):
        return EstimationRecord.objects.filter(user=self.request.user)


class EstimateDetailView(generics.RetrieveDestroyAPIView):
    """Get or delete a single estimate (owner only)."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EstimationRecordSerializer

    def get_queryset(self):
        return EstimationRecord.objects.filter(user=self.request.user)
