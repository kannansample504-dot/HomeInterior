from django.urls import path
from .views import CalculateView, SaveEstimateView, MyEstimatesView, EstimateDetailView

urlpatterns = [
    path("calculate/", CalculateView.as_view(), name="estimate-calculate"),
    path("", SaveEstimateView.as_view(), name="estimate-save"),
    path("mine/", MyEstimatesView.as_view(), name="estimate-mine"),
    path("<uuid:pk>/", EstimateDetailView.as_view(), name="estimate-detail"),
]
