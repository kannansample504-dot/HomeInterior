from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from .models import PricingMatrix, TaxConfig, PriceHistory

User = get_user_model()


class TaxConfigModelTest(TestCase):
    def test_singleton_behavior(self):
        t1 = TaxConfig.load()
        t1.gst_percent = 20
        t1.save()
        t2 = TaxConfig.load()
        self.assertEqual(float(t2.gst_percent), 20.0)
        self.assertEqual(TaxConfig.objects.count(), 1)

    def test_default_values(self):
        tc = TaxConfig.load()
        self.assertEqual(float(tc.gst_percent), 18.0)
        self.assertEqual(float(tc.labour_percent), 12.0)

    def test_str(self):
        tc = TaxConfig.load()
        self.assertIn("GST", str(tc))
        self.assertIn("Labour", str(tc))


class PricingMatrixModelTest(TestCase):
    def test_create_pricing(self):
        p = PricingMatrix.objects.create(
            room_type="bedroom", tier="standard", price_per_sqft=80
        )
        self.assertEqual(float(p.price_per_sqft), 80.0)
        self.assertIn("Bedroom", str(p))

    def test_unique_room_tier(self):
        PricingMatrix.objects.create(room_type="bedroom", tier="basic", price_per_sqft=50)
        with self.assertRaises(Exception):
            PricingMatrix.objects.create(room_type="bedroom", tier="basic", price_per_sqft=60)


class PricingViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        for room in ["living_room", "bedroom", "kitchen", "bathroom", "dining_room", "home_office"]:
            for tier, price in [("basic", 50), ("standard", 80), ("premium", 120), ("luxury", 200)]:
                PricingMatrix.objects.create(room_type=room, tier=tier, price_per_sqft=price)

    def test_get_pricing_public(self):
        resp = self.client.get("/api/pricing/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_get_tax_config(self):
        TaxConfig.load()
        resp = self.client.get("/api/pricing/tax/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("gst_percent", resp.data)
