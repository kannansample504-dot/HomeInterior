from django.urls import path
from .views import PricingMatrixView, TaxConfigView, PriceHistoryView

urlpatterns = [
    path("", PricingMatrixView.as_view(), name="pricing-matrix"),
    path("tax/", TaxConfigView.as_view(), name="tax-config"),
    path("history/", PriceHistoryView.as_view(), name="price-history"),
]
