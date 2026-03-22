import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { cmsApi } from '../../api/cms.api';
import type { FAQ } from '../../types';

const STEPS = [
  {
    badge: 'Step 1', title: 'Tell Us About Your Space', icon: 'home_work',
    desc: 'Start by giving us the basics about your property. This helps us tailor the estimate to your specific needs and location.',
    checks: ['Select property type — Apartment, Villa, Independent House, or Penthouse', 'Choose your BHK configuration — 1 BHK to 5+ BHK', 'Enter your carpet area in square feet', 'Select your city for location-based pricing'],
  },
  {
    badge: 'Step 2', title: 'Choose Your Design Style', icon: 'palette',
    desc: 'Browse through curated design themes and select the one that matches your vision. Each style affects material selection and overall cost.',
    checks: ['Browse 6 curated design themes with real project images', 'Understand how each style impacts your budget', 'Select your preferred budget range — Budget-Friendly to Ultra-Premium', 'Mix and match styles across different rooms'],
  },
  {
    badge: 'Step 3', title: 'Select Rooms & Services', icon: 'checklist',
    desc: 'Pick exactly which rooms you want designed and choose specific services for each. Our modular approach lets you control every detail.',
    checks: ['Toggle rooms on/off — Living Room, Bedrooms, Kitchen, Bathrooms, and more', 'Choose services per room — Furniture, Flooring, Paint, False Ceiling, Lighting', 'Select your material tier — Essential, Premium, or Luxury', 'Add special areas like Pooja Room, Foyer, or Balcony'],
  },
  {
    badge: 'Step 4', title: 'Get Your Detailed Estimate', icon: 'receipt_long',
    desc: 'Receive a comprehensive, room-by-room cost breakdown instantly. Save, download, or share your estimate.',
    checks: ['View itemized costs for every room and service', 'See material specifications and tier details', 'Download your estimate as a professional PDF', 'Save multiple estimates and compare them', 'Book a free consultation with our design experts'],
  },
];

export default function HowItWorksPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    cmsApi.getFAQs().then(r => setFaqs(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>How It Works — Home Interior</title></Helmet>

      {/* Header */}
      <section className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <p className="text-xs text-secondary"><Link to="/" className="text-primary hover:underline">Home</Link> &gt; How It Works</p>
        <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-on-surface mt-4">How It Works</h1>
        <p className="text-lg text-secondary mt-3">Your Dream Interior in 4 Simple Steps</p>
      </section>

      {/* Steps */}
      <section className="py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-24">
        {STEPS.map((step, i) => (
          <div key={step.badge} className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <span className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary font-bold text-sm">{step.badge}</span>
              <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface mt-6">{step.title}</h2>
              <p className="text-secondary mt-4 leading-relaxed">{step.desc}</p>
              <div className="space-y-3 mt-6">
                {step.checks.map((c) => (
                  <div key={c} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    <p className="text-sm text-on-surface">{c}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient flex items-center justify-center aspect-[4/3]">
                <span className="material-symbols-outlined text-primary/15 text-[100px]">{step.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-8 bg-surface-container-low">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { icon: 'home_work', label: 'Property Details', time: '2 min' },
            { icon: 'palette', label: 'Design Style', time: '1 min' },
            { icon: 'checklist', label: 'Room Selection', time: '2 min' },
            { icon: 'receipt_long', label: 'Your Estimate', time: 'Instant' },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex flex-col md:flex-row items-center gap-4 flex-1">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{node.icon}</span>
                </div>
                <p className="font-headline text-sm font-bold text-on-surface mt-4 text-center">{node.label}</p>
                <p className="text-xs text-secondary mt-1">{node.time}</p>
              </div>
              {i < arr.length - 1 && <div className="hidden md:block h-1 bg-primary/20 flex-1 mx-2 rounded" />}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">Frequently Asked Questions</p>
          <h2 className="font-headline text-3xl font-extrabold text-center text-on-surface mt-2">Got Questions? We've Got Answers</h2>
          <div className="space-y-4 mt-16">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="font-headline text-base font-bold text-on-surface">{faq.question}</span>
                  <span className={`material-symbols-outlined text-primary transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {openFaq === faq.id && (
                  <div className="px-8 pb-6">
                    <p className="text-sm text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 sm:px-8 mx-4 sm:mx-8 mb-16 rounded-3xl bg-gradient-to-br from-primary-container to-primary text-center">
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white">Ready? Get Your Free Estimate Now</h2>
        <p className="text-white/70 mt-3">It takes less than 5 minutes. No signup required to start.</p>
        <Link to="/estimate" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm mt-8 inline-block shadow-xl">Start Estimating</Link>
      </section>
    </>
  );
}
