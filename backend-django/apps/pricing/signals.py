from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import PricingMatrix, PriceHistory


@receiver(pre_save, sender=PricingMatrix)
def log_price_change(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = PricingMatrix.objects.get(pk=instance.pk)
    except PricingMatrix.DoesNotExist:
        return
    if old.price_per_sqft != instance.price_per_sqft:
        PriceHistory.objects.create(
            pricing_matrix=instance,
            old_price=old.price_per_sqft,
            new_price=instance.price_per_sqft,
            changed_by=instance.updated_by,
        )
