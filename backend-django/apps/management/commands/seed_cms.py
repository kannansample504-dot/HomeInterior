from django.core.management.base import BaseCommand
from apps.cms.models import CompanyProfile, CMSContent, SEOMeta, Testimonial, FAQ


class Command(BaseCommand):
    help = "Seed CMS content, company profile, SEO meta, testimonials, and FAQs"

    def handle(self, *args, **options):
        self._seed_company()
        self._seed_pages()
        self._seed_seo()
        self._seed_testimonials()
        self._seed_faqs()
        self.stdout.write(self.style.SUCCESS("CMS content seeded successfully."))

    def _seed_company(self):
        CompanyProfile.objects.update_or_create(
            pk=1,
            defaults={
                "name": "Home Interior",
                "tagline": "Transform Your Space with Precision Estimates",
                "phone": "+91 98765 43210",
                "email": "hello@homeinterior.in",
                "whatsapp": "+91 98765 43210",
                "address": "123 Design Avenue, Koramangala, Bangalore - 560034",
                "social_links": {
                    "facebook": "https://facebook.com/homeinterior",
                    "instagram": "https://instagram.com/homeinterior",
                    "twitter": "https://twitter.com/homeinterior",
                    "linkedin": "https://linkedin.com/company/homeinterior",
                    "youtube": "https://youtube.com/@homeinterior",
                },
                "footer_text": "Elevating residential spaces through precision engineering and architectural foresight.",
            },
        )
        self.stdout.write("  Company profile seeded.")

    def _seed_pages(self):
        pages = {
            "home": {
                "hero_title": "Transform Your Space with Precision Estimates",
                "hero_subtitle": "Get instant, detailed cost estimates for any room. Choose styles, materials, and budget — we calculate the rest.",
                "hero_cta_primary": "Get Free Estimate",
                "hero_cta_secondary": "See How It Works",
                "stats_projects": "2,500+",
                "stats_clients": "1,800+",
                "stats_cities": "25+",
                "stats_experience": "12+",
                "cta_title": "Ready to Start Your Dream Interior?",
                "cta_subtitle": "Get a free, detailed estimate in under 5 minutes",
            },
            "about": {
                "page_title": "About Us",
                "page_subtitle": "Crafting Beautiful Spaces Since 2014",
                "story_title": "Born from a Passion for Beautiful Living",
                "story_paragraph_1": "Home Interior was founded with a simple belief — everyone deserves a beautifully designed living space without the stress of unpredictable costs. What started as a small design studio has grown into a technology-driven platform that has transformed over 2,500 homes across 25+ cities.",
                "story_paragraph_2": "We combined our deep expertise in interior design with cutting-edge estimation technology to create a platform that gives you transparent, detailed cost breakdowns before you commit.",
                "mission_title": "Our Mission",
                "mission_text": "To make professional interior design accessible and transparent for everyone.",
                "vision_title": "Our Vision",
                "vision_text": "To be the most trusted interior design estimation platform in the country.",
            },
            "howitworks": {
                "page_title": "How It Works",
                "page_subtitle": "Your Dream Interior in 4 Simple Steps",
                "step1_title": "Tell Us About Your Space",
                "step1_description": "Select property type, BHK configuration, carpet area, and city.",
                "step2_title": "Choose Your Design Style",
                "step2_description": "Browse curated design themes and select your preferred budget range.",
                "step3_title": "Select Rooms & Services",
                "step3_description": "Pick rooms, choose services for each, and select material tier.",
                "step4_title": "Get Your Detailed Estimate",
                "step4_description": "View room-wise cost breakdown, download PDF, and save your estimate.",
            },
        }

        count = 0
        for page_slug, fields in pages.items():
            for key, value in fields.items():
                _, created = CMSContent.objects.get_or_create(
                    page_slug=page_slug,
                    field_key=key,
                    defaults={"field_value": value, "field_type": "text"},
                )
                if created:
                    count += 1
        self.stdout.write(f"  {count} CMS fields seeded.")

    def _seed_seo(self):
        seo_data = [
            {
                "page_slug": "home",
                "meta_title": "Home Interior — Instant Interior Design Cost Estimates",
                "meta_description": "Get instant, detailed cost estimates for your interior design project. Professional designs for every room and budget.",
            },
            {
                "page_slug": "about",
                "meta_title": "About Us — Home Interior",
                "meta_description": "Learn about Home Interior's mission to make professional interior design accessible. Meet our team.",
            },
            {
                "page_slug": "howitworks",
                "meta_title": "How It Works — Home Interior",
                "meta_description": "Get instant interior design estimates in 4 simple steps. Select rooms, choose styles, and get pricing.",
            },
            {
                "page_slug": "estimate",
                "meta_title": "Get Your Estimate — Home Interior",
                "meta_description": "Calculate your interior design costs instantly. Select rooms, styles, and materials.",
            },
            {
                "page_slug": "login",
                "meta_title": "Login — Home Interior",
                "meta_description": "Sign in to save your interior design estimates and track your projects.",
            },
        ]
        for data in seo_data:
            SEOMeta.objects.get_or_create(
                page_slug=data["page_slug"],
                defaults=data,
            )
        self.stdout.write(f"  {len(seo_data)} SEO meta entries seeded.")

    def _seed_testimonials(self):
        testimonials = [
            {
                "name": "Priya Sharma",
                "city": "Mumbai",
                "content": "Home Interior transformed our apartment into something out of a magazine. The estimate was spot-on and the process was seamless.",
                "rating": 5,
                "order": 1,
            },
            {
                "name": "Rahul Mehta",
                "city": "Bangalore",
                "content": "The detailed breakdown helped us plan our budget perfectly. No surprises, no hidden costs. Highly recommend!",
                "rating": 5,
                "order": 2,
            },
            {
                "name": "Anita Desai",
                "city": "Delhi",
                "content": "From the first estimate to the final installation, every step was transparent and professional.",
                "rating": 5,
                "order": 3,
            },
        ]
        for t in testimonials:
            Testimonial.objects.get_or_create(
                name=t["name"],
                defaults=t,
            )
        self.stdout.write(f"  {len(testimonials)} testimonials seeded.")

    def _seed_faqs(self):
        faqs = [
            {
                "question": "How accurate are the estimates?",
                "answer": "Our estimates are based on real market data, updated monthly. They are typically accurate within 5-10% of final project costs.",
                "order": 1,
            },
            {
                "question": "Is there any cost to get an estimate?",
                "answer": "No! Our estimation tool is completely free. Create unlimited estimates, save them, and compare options at no charge.",
                "order": 2,
            },
            {
                "question": "Can I customize the estimate after generating it?",
                "answer": "Yes! Go back and modify any aspect — rooms, styles, material tiers. Each change recalculates instantly.",
                "order": 3,
            },
            {
                "question": "What areas and cities do you serve?",
                "answer": "We serve all major metros: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and Ahmedabad.",
                "order": 4,
            },
            {
                "question": "How do I book a consultation?",
                "answer": "After generating your estimate, click 'Book Consultation' to schedule a free call with our design experts.",
                "order": 5,
            },
            {
                "question": "What's included in Full Home Interior?",
                "answer": "Covers every room — living room, bedrooms, kitchen, bathrooms, dining, balcony. Includes furniture, flooring, painting, false ceiling, lighting, and fixtures.",
                "order": 6,
            },
        ]
        for f in faqs:
            FAQ.objects.get_or_create(
                question=f["question"],
                defaults=f,
            )
        self.stdout.write(f"  {len(faqs)} FAQs seeded.")
