from django.conf import settings
from django.db import models


class PricingMatrix(models.Model):
    class RoomType(models.TextChoices):
        LIVING_ROOM = "living_room", "Living Room"
        BEDROOM = "bedroom", "Bedroom"
        KITCHEN = "kitchen", "Kitchen"
        BATHROOM = "bathroom", "Bathroom"
        DINING_ROOM = "dining_room", "Dining Room"
        HOME_OFFICE = "home_office", "Home Office"

    class Tier(models.TextChoices):
        BASIC = "basic", "Basic"
        STANDARD = "standard", "Standard"
        PREMIUM = "premium", "Premium"
        LUXURY = "luxury", "Luxury"

    room_type = models.CharField(max_length=20, choices=RoomType.choices)
    tier = models.CharField(max_length=10, choices=Tier.choices)
    price_per_sqft = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="pricing_updates",
    )

    class Meta:
        db_table = "pricing_matrix"
        unique_together = ("room_type", "tier")
        ordering = ["room_type", "tier"]

    def __str__(self):
        return f"{self.get_room_type_display()} — {self.get_tier_display()}: ₹{self.price_per_sqft}/sqft"


class PriceHistory(models.Model):
    pricing_matrix = models.ForeignKey(
        PricingMatrix, on_delete=models.CASCADE, related_name="history",
    )
    old_price = models.DecimalField(max_digits=10, decimal_places=2)
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL,
    )
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "price_history"
        ordering = ["-changed_at"]

    def __str__(self):
        return f"{self.pricing_matrix} | ₹{self.old_price} → ₹{self.new_price}"


class TaxConfig(models.Model):
    """Singleton — GST and labour percentages for estimation calculations."""

    gst_percent = models.DecimalField(max_digits=5, decimal_places=2, default=18.00)
    labour_percent = models.DecimalField(max_digits=5, decimal_places=2, default=12.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tax_config"
        verbose_name = "Tax Config"
        verbose_name_plural = "Tax Config"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"GST: {self.gst_percent}% | Labour: {self.labour_percent}%"
