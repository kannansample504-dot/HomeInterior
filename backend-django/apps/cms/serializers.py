from rest_framework import serializers
from .models import CompanyProfile, CMSContent, SEOMeta, Testimonial, FAQ, PortfolioProject


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            "name", "tagline", "logo_url", "phone", "email",
            "whatsapp", "address", "social_links", "footer_text", "updated_at",
        ]


class CMSContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSContent
        fields = ["id", "page_slug", "field_key", "field_value", "field_type", "updated_at"]


class CMSContentBulkUpdateSerializer(serializers.Serializer):
    """Accepts a list of {field_key, field_value} pairs for a given page_slug."""
    fields = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField()),
    )


class SEOMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMeta
        fields = [
            "page_slug", "meta_title", "meta_description",
            "og_title", "og_description", "og_image_url", "canonical_url",
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "name", "city", "content", "rating", "is_visible", "order"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order", "is_visible"]


class PortfolioProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.URLField(
        allow_blank=True, required=False, default="",
        validators=[],
    )

    class Meta:
        model = PortfolioProject
        fields = ["id", "title", "city", "style", "image_url", "is_visible", "order"]

    def validate_image_url(self, value):
        if value and not value.startswith(("http://", "https://")):
            raise serializers.ValidationError("Image URL must be a valid http/https URL.")
        return value
