from django.db.models import Sum, Avg, Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from apps.users.models import User
from apps.estimates.models import EstimationRecord


def get_admin_stats():
    """Compute dashboard statistics for admin panel."""
    total_users = User.objects.filter(role="user").count()
    active_users = User.objects.filter(
        role="user", is_active=True,
        last_login__gte=timezone.now() - timedelta(days=30),
    ).count()

    estimates_qs = EstimationRecord.objects.all()
    total_estimates = estimates_qs.count()

    aggregates = estimates_qs.aggregate(
        total_revenue=Sum("grand_total"),
        avg_value=Avg("grand_total"),
    )

    # Monthly trend — last 12 months
    twelve_months_ago = timezone.now() - timedelta(days=365)
    monthly_trend = (
        estimates_qs
        .filter(created_at__gte=twelve_months_ago)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(count=Count("id"), total=Sum("grand_total"))
        .order_by("month")
    )

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_estimates": total_estimates,
        "total_revenue": aggregates["total_revenue"] or 0,
        "avg_estimate_value": aggregates["avg_value"] or 0,
        "monthly_trend": [
            {
                "month": item["month"].strftime("%Y-%m"),
                "count": item["count"],
                "total": float(item["total"] or 0),
            }
            for item in monthly_trend
        ],
    }
