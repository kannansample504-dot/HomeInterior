from decimal import Decimal
from apps.pricing.models import PricingMatrix, TaxConfig


# Default room areas in square feet
ROOM_AREA_DEFAULTS = {
    "living_room": 300,
    "bedroom": 180,
    "kitchen": 150,
    "bathroom": 60,
    "dining_room": 200,
    "home_office": 160,
}


def calculate_estimate(rooms, tier):
    """
    Calculate interior design cost estimate.

    Args:
        rooms: list of {"room_type": str, "count": int}
        tier: "basic" | "standard" | "premium" | "luxury"

    Returns:
        dict with breakdown and totals
    """
    # Fetch all pricing for the given tier
    pricing = {
        p.room_type: p.price_per_sqft
        for p in PricingMatrix.objects.filter(tier=tier)
    }

    # Fetch current tax config
    tax = TaxConfig.load()

    breakdown = []
    material_total = Decimal("0.00")

    for room in rooms:
        room_type = room["room_type"]
        count = int(room.get("count", 1))

        default_area = ROOM_AREA_DEFAULTS.get(room_type, 200)
        area = default_area * count
        price_per_sqft = pricing.get(room_type, Decimal("0.00"))
        room_cost = Decimal(str(area)) * price_per_sqft

        breakdown.append({
            "room_type": room_type,
            "count": count,
            "area_sqft": area,
            "price_per_sqft": float(price_per_sqft),
            "room_cost": float(room_cost),
        })

        material_total += room_cost

    labour_cost = material_total * (tax.labour_percent / Decimal("100"))
    subtotal = material_total + labour_cost
    gst_amount = subtotal * (tax.gst_percent / Decimal("100"))
    grand_total = subtotal + gst_amount

    return {
        "breakdown": breakdown,
        "material_cost": float(material_total),
        "labour_cost": float(labour_cost),
        "labour_percent": float(tax.labour_percent),
        "subtotal": float(subtotal),
        "gst_amount": float(gst_amount),
        "gst_percent": float(tax.gst_percent),
        "grand_total": float(grand_total),
        "tier": tier,
    }
