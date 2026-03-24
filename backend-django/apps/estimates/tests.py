from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.pricing.models import PricingMatrix, TaxConfig
from .models import EstimationRecord
from .services import calculate_estimate

User = get_user_model()


def seed_pricing():
    """Create minimal pricing data for tests."""
    TaxConfig.objects.get_or_create(pk=1, defaults={"gst_percent": 18, "labour_percent": 12})
    for room in ["living_room", "bedroom", "kitchen", "bathroom", "dining_room", "home_office"]:
        for tier, price in [("basic", 50), ("standard", 80), ("premium", 120), ("luxury", 200)]:
            PricingMatrix.objects.get_or_create(
                room_type=room, tier=tier, defaults={"price_per_sqft": price}
            )


class CalculateEstimateServiceTest(TestCase):
    def setUp(self):
        seed_pricing()

    def test_single_room(self):
        result = calculate_estimate(
            rooms=[{"room_type": "bedroom", "count": 1}],
            tier="standard",
        )
        self.assertEqual(len(result["breakdown"]), 1)
        bd = result["breakdown"][0]
        self.assertEqual(bd["room_type"], "bedroom")
        self.assertEqual(bd["count"], 1)
        self.assertEqual(bd["area_sqft"], 180)  # default area for bedroom
        self.assertEqual(bd["price_per_sqft"], 80.0)
        self.assertEqual(bd["room_cost"], 180 * 80)  # 14400
        self.assertEqual(result["material_cost"], 14400.0)
        self.assertEqual(result["tier"], "standard")

    def test_multiple_rooms(self):
        result = calculate_estimate(
            rooms=[
                {"room_type": "bedroom", "count": 2},
                {"room_type": "kitchen", "count": 1},
            ],
            tier="standard",
        )
        self.assertEqual(len(result["breakdown"]), 2)
        material = (180 * 2 * 80) + (150 * 1 * 80)
        self.assertEqual(result["material_cost"], float(material))

    def test_labour_and_gst_calculation(self):
        result = calculate_estimate(
            rooms=[{"room_type": "living_room", "count": 1}],
            tier="basic",
        )
        material = 300 * 50  # 15000
        labour = material * 0.12  # 1800
        subtotal = material + labour  # 16800
        gst = subtotal * 0.18  # 3024
        grand = subtotal + gst  # 19824
        self.assertAlmostEqual(result["material_cost"], material, places=2)
        self.assertAlmostEqual(result["labour_cost"], labour, places=2)
        self.assertAlmostEqual(result["subtotal"], subtotal, places=2)
        self.assertAlmostEqual(result["gst_amount"], gst, places=2)
        self.assertAlmostEqual(result["grand_total"], grand, places=2)

    def test_different_tiers(self):
        basic = calculate_estimate(rooms=[{"room_type": "bedroom", "count": 1}], tier="basic")
        luxury = calculate_estimate(rooms=[{"room_type": "bedroom", "count": 1}], tier="luxury")
        self.assertGreater(luxury["grand_total"], basic["grand_total"])

    def test_empty_rooms(self):
        result = calculate_estimate(rooms=[], tier="standard")
        self.assertEqual(result["material_cost"], 0.0)
        self.assertEqual(result["grand_total"], 0.0)


class CalculateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/estimates/calculate/"
        seed_pricing()

    def test_calculate_success(self):
        resp = self.client.post(self.url, {
            "rooms": [{"room_type": "bedroom", "count": 2}],
            "tier": "standard",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("breakdown", resp.data)
        self.assertIn("grand_total", resp.data)

    def test_calculate_no_auth_required(self):
        resp = self.client.post(self.url, {
            "rooms": [{"room_type": "kitchen", "count": 1}],
            "tier": "basic",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_calculate_invalid_room_type(self):
        resp = self.client.post(self.url, {
            "rooms": [{"room_type": "garage", "count": 1}],
            "tier": "standard",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_calculate_invalid_tier(self):
        resp = self.client.post(self.url, {
            "rooms": [{"room_type": "bedroom", "count": 1}],
            "tier": "ultra",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_calculate_count_exceeds_max(self):
        resp = self.client.post(self.url, {
            "rooms": [{"room_type": "bedroom", "count": 11}],
            "tier": "standard",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class SaveEstimateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/estimates/"
        seed_pricing()
        self.user = User.objects.create_user(
            email="save@test.com", password="Testpass123", name="Save User"
        )

    def _payload(self, **overrides):
        data = {
            "rooms": [{"room_type": "bedroom", "count": 1}],
            "tier": "standard",
            "project_type": "new",
            "property_type": "apartment",
        }
        data.update(overrides)
        return data

    def test_save_authenticated(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post(self.url, self._payload(), format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "saved")
        record = EstimationRecord.objects.get(id=resp.data["id"])
        self.assertEqual(record.user, self.user)

    def test_save_guest_requires_email(self):
        resp = self.client.post(self.url, self._payload(), format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("guest_email", resp.data)

    def test_save_guest_with_email(self):
        resp = self.client.post(
            self.url, self._payload(guest_email="guest@test.com"), format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "draft")

    def test_save_creates_correct_totals(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post(self.url, self._payload(), format="json")
        self.assertGreater(resp.data["grand_total"], "0")


class MyEstimatesViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        seed_pricing()
        self.user = User.objects.create_user(
            email="my@test.com", password="Testpass123", name="My User"
        )
        self.other = User.objects.create_user(
            email="other@test.com", password="Testpass123", name="Other"
        )

    def test_list_own_estimates_only(self):
        EstimationRecord.objects.create(user=self.user, tier="basic", grand_total=100)
        EstimationRecord.objects.create(user=self.other, tier="basic", grand_total=200)
        self.client.force_authenticate(user=self.user)
        resp = self.client.get("/api/estimates/mine/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = [r["id"] for r in resp.data["results"]]
        self.assertEqual(len(ids), 1)

    def test_unauthenticated_forbidden(self):
        resp = self.client.get("/api/estimates/mine/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
