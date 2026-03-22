from django.urls import path
from .views import AdminStatsView, AdminUserListView, AdminUserDetailView, AdminEstimateListView

urlpatterns = [
    path("stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("users/", AdminUserListView.as_view(), name="admin-users"),
    path("users/<uuid:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("estimates/", AdminEstimateListView.as_view(), name="admin-estimates"),
]
