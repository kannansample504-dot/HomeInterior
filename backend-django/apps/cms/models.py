from django.conf import settings
from django.db import models


class CompanyProfile(models.Model):
    """Singleton model — company identity used across all pages."""

    name = models.CharField(max_length=255, default="Home Interior")
    tagline = models.CharField(max_length=500, blank=True, default="")
    logo_url = models.URLField(blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    whatsapp = models.CharField(max_length=20, blank=True, default="")
    address = models.TextField(blank=True, default="")
    social_links = models.JSONField(default=dict, blank=True)
    footer_text = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_profile"
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profile"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.name


class CMSContent(models.Model):
    """Key-value content store for all editable page text."""

    class FieldType(models.TextChoices):
        TEXT = "text", "Text"
        RICH = "rich", "Rich Text"
        IMAGE = "image", "Image URL"
        NUMBER = "number", "Number"
        JSON = "json", "JSON"

    page_slug = models.CharField(max_length=50)
    field_key = models.CharField(max_length=100)
    field_value = models.TextField(blank=True, default="")
    field_type = models.CharField(max_length=10, choices=FieldType.choices, default=FieldType.TEXT)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="cms_updates",
    )

    class Meta:
        db_table = "cms_content"
        unique_together = ("page_slug", "field_key")
        ordering = ["page_slug", "field_key"]

    def __str__(self):
        return f"{self.page_slug}.{self.field_key}"


class SEOMeta(models.Model):
    """Per-page SEO and Open Graph metadata."""

    page_slug = models.CharField(max_length=50, unique=True)
    meta_title = models.CharField(max_length=70, blank=True, default="")
    meta_description = models.CharField(max_length=160, blank=True, default="")
    og_title = models.CharField(max_length=70, blank=True, default="")
    og_description = models.CharField(max_length=200, blank=True, default="")
    og_image_url = models.URLField(blank=True, default="")
    canonical_url = models.URLField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "seo_meta"
        verbose_name = "SEO Meta"
        verbose_name_plural = "SEO Meta"

    def __str__(self):
        return f"SEO: {self.page_slug}"


class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, default="")
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_visible = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "testimonials"
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} — {self.city}"


class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        db_table = "faqs"
        ordering = ["order"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question


class PortfolioProject(models.Model):
    """Recent projects shown on the home page portfolio section."""

    title = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, default="")
    style = models.CharField(max_length=100, blank=True, default="")
    image_url = models.URLField(blank=True, default="")
    is_visible = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "portfolio_projects"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.title} — {self.city}"
