from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserManagerTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            email="test@example.com", password="Testpass123", name="Test User"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.name, "Test User")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.role, "user")
        self.assertTrue(user.check_password("Testpass123"))

    def test_create_user_normalizes_email(self):
        user = User.objects.create_user(
            email="Test@EXAMPLE.COM", password="Testpass123", name="Test"
        )
        self.assertEqual(user.email, "Test@example.com")

    def test_create_user_no_email_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="Testpass123", name="Test")

    def test_create_superuser(self):
        user = User.objects.create_superuser(
            email="admin@example.com", password="Admin@1234", name="Admin"
        )
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertEqual(user.role, "admin")

    def test_create_superuser_not_staff_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="a@b.com", password="x", name="X", is_staff=False
            )

    def test_create_superuser_not_superuser_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="a@b.com", password="x", name="X", is_superuser=False
            )


class UserModelTest(TestCase):
    def test_uuid_primary_key(self):
        user = User.objects.create_user(
            email="u@test.com", password="pass1234", name="UUID User"
        )
        self.assertIsNotNone(user.id)
        self.assertEqual(len(str(user.id)), 36)  # UUID format

    def test_str_representation(self):
        user = User.objects.create_user(
            email="str@test.com", password="pass1234", name="Str User"
        )
        self.assertEqual(str(user), "Str User (str@test.com)")

    def test_default_fields(self):
        user = User.objects.create_user(
            email="d@test.com", password="pass1234", name="Default"
        )
        self.assertEqual(user.phone, "")
        self.assertEqual(user.city, "")
        self.assertEqual(user.role, "user")
