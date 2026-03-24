from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/auth/register/"

    def test_register_success(self):
        resp = self.client.post(self.url, {
            "email": "new@test.com",
            "name": "New User",
            "password": "Strongpass1",
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data["user"]["email"], "new@test.com")

    def test_register_duplicate_email(self):
        User.objects.create_user(email="dup@test.com", password="pass1234", name="Dup")
        resp = self.client.post(self.url, {
            "email": "dup@test.com",
            "name": "Dup2",
            "password": "Strongpass1",
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_short_password(self):
        resp = self.client.post(self.url, {
            "email": "short@test.com",
            "name": "Short",
            "password": "abc",
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_email(self):
        resp = self.client.post(self.url, {
            "name": "No Email",
            "password": "Strongpass1",
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/auth/login/"
        self.user = User.objects.create_user(
            email="login@test.com", password="Testpass123", name="Login User"
        )

    def test_login_success(self):
        resp = self.client.post(self.url, {
            "email": "login@test.com",
            "password": "Testpass123",
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data["user"]["email"], "login@test.com")

    def test_login_wrong_password(self):
        resp = self.client.post(self.url, {
            "email": "login@test.com",
            "password": "wrongpass",
        })
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        resp = self.client.post(self.url, {
            "email": "ghost@test.com",
            "password": "anything",
        })
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_inactive_user(self):
        self.user.is_active = False
        self.user.save()
        resp = self.client.post(self.url, {
            "email": "login@test.com",
            "password": "Testpass123",
        })
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_stamps_last_login(self):
        self.assertIsNone(self.user.last_login)
        self.client.post(self.url, {
            "email": "login@test.com",
            "password": "Testpass123",
        })
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.last_login)


class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="logout@test.com", password="Testpass123", name="Logout User"
        )
        resp = self.client.post("/api/auth/login/", {
            "email": "logout@test.com",
            "password": "Testpass123",
        })
        self.access = resp.data["access"]
        self.refresh = resp.data["refresh"]

    def test_logout_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")
        resp = self.client.post("/api/auth/logout/", {"refresh": self.refresh})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_logout_unauthenticated(self):
        resp = self.client.post("/api/auth/logout/", {"refresh": self.refresh})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")
        resp = self.client.post("/api/auth/logout/", {"refresh": "invalid-token"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
