from rest_framework.permissions import BasePermission


class IsAdminOrStaff(BasePermission):
    """Allow access only to admin or staff users."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ("admin", "staff") or request.user.is_staff
