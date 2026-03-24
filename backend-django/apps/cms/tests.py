from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from .models import CompanyProfile, CMSContent, SEOMeta, Testimonial, FAQ, PortfolioProject

User = get_user_model()


class CompanyProfileModelTest(TestCase):
    def test_singleton_behavior(self):
        p1 = CompanyProfile.load()
        p1.name = "Test Company"
        p1.save()
        p2 = CompanyProfile.load()
        self.assertEqual(p2.name, "Test Company")
        self.assertEqual(CompanyProfile.objects.count(), 1)

    def test_pk_always_one(self):
        p = CompanyProfile(name="New")
        p.save()
        self.assertEqual(p.pk, 1)


class SEOMetaModelTest(TestCase):
    def test_max_length_enforced(self):
        seo = SEOMeta(page_slug="home", meta_title="x" * 70)
        seo.full_clean()  # should not raise
        seo.save()
        self.assertEqual(len(seo.meta_title), 70)


class PortfolioProjectModelTest(TestCase):
    def test_create_project(self):
        p = PortfolioProject.objects.create(
            title="Test Project", city="Mumbai", style="Modern"
        )
        self.assertTrue(p.is_visible)
        self.assertEqual(p.order, 0)
        self.assertIn("Mumbai", str(p))

    def test_ordering(self):
        PortfolioProject.objects.create(title="B", order=2)
        PortfolioProject.objects.create(title="A", order=1)
        projects = list(PortfolioProject.objects.values_list("title", flat=True))
        self.assertEqual(projects[0], "A")


class CompanyProfileViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/cms/company/"

    def test_get_public(self):
        CompanyProfile.load()
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("name", resp.data)

    def test_put_requires_admin(self):
        resp = self.client.put(self.url, {"name": "Hacker"})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_put_as_admin(self):
        admin = User.objects.create_superuser(
            email="admin@test.com", password="Admin@1234", name="Admin"
        )
        self.client.force_authenticate(user=admin)
        resp = self.client.put(self.url, {"name": "Updated Co"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["name"], "Updated Co")


class CMSContentViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_page_content(self):
        CMSContent.objects.create(page_slug="home", field_key="hero_title", field_value="Welcome")
        resp = self.client.get("/api/cms/home/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["hero_title"], "Welcome")

    def test_get_empty_page(self):
        resp = self.client.get("/api/cms/nonexistent/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, {})

    def test_put_requires_admin(self):
        resp = self.client.put("/api/cms/home/", {
            "fields": [{"field_key": "hero_title", "field_value": "Hacked"}]
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class TestimonialViewTest(TestCase):
    def test_list_visible_only(self):
        Testimonial.objects.create(name="Alice", content="Great!", is_visible=True)
        Testimonial.objects.create(name="Bob", content="Hidden", is_visible=False)
        resp = self.client.get("/api/cms/testimonials/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]["name"], "Alice")


class FAQViewTest(TestCase):
    def test_list_visible_only(self):
        FAQ.objects.create(question="Q1?", answer="A1", is_visible=True)
        FAQ.objects.create(question="Q2?", answer="A2", is_visible=False)
        resp = self.client.get("/api/cms/faqs/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)


class PortfolioProjectViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_public_list_visible_only(self):
        PortfolioProject.objects.create(title="Visible", is_visible=True)
        PortfolioProject.objects.create(title="Hidden", is_visible=False)
        resp = self.client.get("/api/cms/projects/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]["title"], "Visible")

    def test_admin_crud(self):
        admin = User.objects.create_superuser(
            email="admin@test.com", password="Admin@1234", name="Admin"
        )
        self.client.force_authenticate(user=admin)

        # Create
        resp = self.client.post("/api/cms/admin/projects/", {
            "title": "New Project", "city": "Delhi"
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        pk = resp.data["id"]

        # List all (including hidden)
        resp = self.client.get("/api/cms/admin/projects/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Update
        resp = self.client.patch(f"/api/cms/admin/projects/{pk}/", {"city": "Mumbai"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["city"], "Mumbai")

        # Delete
        resp = self.client.delete(f"/api/cms/admin/projects/{pk}/")
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_endpoints_require_auth(self):
        resp = self.client.get("/api/cms/admin/projects/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_image_url_validation(self):
        admin = User.objects.create_superuser(
            email="admin2@test.com", password="Admin@1234", name="Admin2"
        )
        self.client.force_authenticate(user=admin)
        resp = self.client.post("/api/cms/admin/projects/", {
            "title": "Bad URL", "image_url": "ftp://bad.com/img.jpg"
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
