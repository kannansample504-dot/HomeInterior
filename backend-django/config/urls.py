from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # API docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    # App routes
    path("api/auth/", include("apps.authentication.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/cms/", include("apps.cms.urls")),
    path("api/pricing/", include("apps.pricing.urls")),
    path("api/estimates/", include("apps.estimates.urls")),
    path("api/admin/", include("apps.admin_panel.urls")),
]
