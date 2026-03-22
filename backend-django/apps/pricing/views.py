from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PricingMatrix, PriceHistory, TaxConfig
from .serializers import (
    PricingMatrixSerializer,
    PricingBulkUpdateSerializer,
    PriceHistorySerializer,
    TaxConfigSerializer,
)


class PricingMatrixView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @method_decorator(cache_page(600))
    def get(self, request):
        items = PricingMatrix.objects.all()
        serializer = PricingMatrixSerializer(items, many=True)

        # Also return grouped by room_type
        grouped = {}
        for item in serializer.data:
            rt = item["room_type"]
            if rt not in grouped:
                grouped[rt] = {}
            grouped[rt][item["tier"]] = float(item["price_per_sqft"])

        return Response({"flat": serializer.data, "grouped": grouped})

    def put(self, request):
        serializer = PricingBulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for price_data in serializer.validated_data["prices"]:
            try:
                obj = PricingMatrix.objects.get(id=price_data["id"])
                obj.price_per_sqft = price_data["price_per_sqft"]
                obj.updated_by = request.user
                obj.save()
            except (PricingMatrix.DoesNotExist, KeyError):
                continue

        cache.delete_pattern("*pricing*")
        items = PricingMatrix.objects.all()
        return Response(PricingMatrixSerializer(items, many=True).data)


class TaxConfigView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        config = TaxConfig.load()
        return Response(TaxConfigSerializer(config).data)

    def put(self, request):
        config = TaxConfig.load()
        serializer = TaxConfigSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PriceHistoryView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        history = PriceHistory.objects.select_related("pricing_matrix")[:100]
        return Response(PriceHistorySerializer(history, many=True).data)
