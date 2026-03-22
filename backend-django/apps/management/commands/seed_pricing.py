from django.core.management.base import BaseCommand
from apps.pricing.models import PricingMatrix, TaxConfig


# Default pricing: room_type → {tier: price_per_sqft in INR}
DEFAULT_PRICING = {
    "living_room": {"basic": 800, "standard": 1200, "premium": 1800, "luxury": 2800},
    "bedroom": {"basic": 700, "standard": 1100, "premium": 1600, "luxury": 2500},
    "kitchen": {"basic": 1000, "standard": 1500, "premium": 2200, "luxury": 3500},
    "bathroom": {"basic": 900, "standard": 1400, "premium": 2000, "luxury": 3200},
    "dining_room": {"basic": 750, "standard": 1100, "premium": 1700, "luxury": 2600},
    "home_office": {"basic": 650, "standard": 1000, "premium": 1500, "luxury": 2400},
}


class Command(BaseCommand):
    help = "Seed the pricing matrix with default values"

    def handle(self, *args, **options):
        created_count = 0
        for room_type, tiers in DEFAULT_PRICING.items():
            for tier, price in tiers.items():
                _, created = PricingMatrix.objects.get_or_create(
                    room_type=room_type,
                    tier=tier,
                    defaults={"price_per_sqft": price},
                )
                if created:
                    created_count += 1

        # Ensure TaxConfig singleton exists
        TaxConfig.load()

        self.stdout.write(
            self.style.SUCCESS(
                f"Pricing seeded: {created_count} new entries. "
                f"Total: {PricingMatrix.objects.count()} pricing rows."
            )
        )
