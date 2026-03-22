from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "phone", "city", "role", "is_active", "date_joined", "last_login"]
        read_only_fields = ["id", "email", "role", "is_active", "date_joined", "last_login"]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "phone", "city"]
