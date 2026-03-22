import uuid
from django.conf import settings
from django.db import models


class EstimationRecord(models.Model):
    class ProjectType(models.TextChoices):
        NEW = "new", "New Interior"
        RENOVATION = "renovation", "Renovation"

    class PropertyType(models.TextChoices):
        APARTMENT = "apartment", "Apartment"
        VILLA = "villa", "Villa"
        HOUSE = "house", "Independent House"
        PENTHOUSE = "penthouse", "Penthouse"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="estimates",
    )
    guest_email = models.EmailField(blank=True, default="")
    project_type = models.CharField(max_length=20, choices=ProjectType.choices, default=ProjectType.NEW)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices, default=PropertyType.APARTMENT)
    style = models.CharField(max_length=50, blank=True, default="")
    tier = models.CharField(max_length=10, blank=True, default="")
    rooms_breakdown = models.JSONField(default=list)
    material_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    labour_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    labour_percent_snapshot = models.DecimalField(max_digits=5, decimal_places=2, default=12)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_percent_snapshot = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20, default="draft",
        choices=[
            ("draft", "Draft"),
            ("saved", "Saved"),
            ("reviewed", "Reviewed"),
            ("converted", "Converted"),
        ],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "estimation_records"
        ordering = ["-created_at"]

    def __str__(self):
        name = self.user.name if self.user else self.guest_email or "Guest"
        return f"Estimate #{str(self.id)[:8]} — {name} — ₹{self.grand_total}"
