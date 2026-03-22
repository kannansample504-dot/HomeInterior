import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        USER = "user", "User"
        STAFF = "staff", "Staff"
        ADMIN = "admin", "Admin"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.name} ({self.email})"
