from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import User
from apps.estimates.models import EstimationRecord
from .permissions import IsAdminOrStaff
from .serializers import (
    AdminUserSerializer,
    AdminUserUpdateSerializer,
    AdminEstimateSerializer,
    AdminStatsSerializer,
)
from .services import get_admin_stats


class AdminStatsView(APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        stats = get_admin_stats()
        serializer = AdminStatsSerializer(stats)
        return Response(serializer.data)


class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()
    filterset_fields = ["role", "is_active", "city"]
    search_fields = ["name", "email", "phone"]
    ordering_fields = ["date_joined", "last_login", "name"]


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminOrStaff]
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return AdminUserUpdateSerializer
        return AdminUserSerializer


class AdminEstimateListView(generics.ListAPIView):
    permission_classes = [IsAdminOrStaff]
    serializer_class = AdminEstimateSerializer
    queryset = EstimationRecord.objects.select_related("user").all()
    filterset_fields = ["status", "tier", "property_type"]
    search_fields = ["user__name", "user__email", "guest_email"]
    ordering_fields = ["created_at", "grand_total"]
