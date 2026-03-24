import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { cmsApi } from '../../api/cms.api';
import type { Testimonial, PortfolioProject } from '../../types';

const SERVICES = [
  { icon: 'weekend', name: 'Living Room Design', desc: 'Complete living area transformation with furniture, lighting, and decor.', price: '1,50,000' },
  { icon: 'bed', name: 'Bedroom Interior', desc: 'Cozy, functional bedrooms with custom wardrobes and elegant finishes.', price: '1,20,000' },
  { icon: 'countertops', name: 'Kitchen Remodeling', desc: 'Modular kitchens with premium fittings, chimney, and smart storage.', price: '2,00,000' },
  { icon: 'bathtub', name: 'Bathroom Renovation', desc: 'Modern bathrooms with designer tiles, fixtures, and vanity units.', price: '80,000' },
  { icon: 'desktop_windows', name: 'Office / Study Room', desc: 'Productive workspaces with ergonomic furniture and smart lighting.', price: '90,000' },
  { icon: 'home', name: 'Full Home Interior', desc: 'End-to-end interior design for your complete home, all rooms included.', price: '5,00,000' },
];


const STEPS = [
  { num: '1', title: 'Select Your Rooms', desc: 'Tell us about your property and choose which rooms you want designed.' },
  { num: '2', title: 'Choose Style & Materials', desc: 'Pick your preferred design theme and material tier for each room.' },
  { num: '3', title: 'Get Instant Estimate', desc: 'Receive a detailed, room-wise cost breakdown in seconds.' },
];

const STATS = [
  { num: '2,500+', label: 'Projects Completed', icon: 'task_alt' },
  { num: '1,800+', label: 'Happy Clients', icon: 'sentiment_satisfied' },
  { num: '25+', label: 'Cities Served', icon: 'location_city' },
  { num: '12+', label: 'Years Experience', icon: 'workspace_premium' },
];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1586023492125-27272f1144b3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555041469-fd26927b8d5a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb514cc4a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
];

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    cmsApi.getPageContent('home').then(r => setContent(r.data)).catch(() => {});
    cmsApi.getTestimonials().then(r => setTestimonials(r.data)).catch(() => {});
    cmsApi.getProjects().then(r => setPortfolio(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>{content.hero_title || 'Home Interior — Instant Interior Design Cost Estimates'}</title>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-container to-primary min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 font-bold mb-4">Interior Design Estimation Platform</p>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              {content.hero_title || 'Transform Your Space with Precision Estimates'}
            </h1>
            <p className="font-body text-lg text-white/80 mt-6 max-w-lg">
              {content.hero_subtitle || 'Get instant, detailed cost estimates for any room. Choose styles, materials, and budget — we calculate the rest.'}
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/estimate" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all">
                {content.hero_cta_primary || 'Get Free Estimate'}
              </Link>
              <Link to="/how-it-works" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-white/10">
                {content.hero_cta_secondary || 'See How It Works'}
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27272f1144b3?auto=format&fit=crop&w=900&q=85"
                alt="Beautiful interior design"
                className="w-full h-full object-cover"
                onError={e => {
                  const img = e.target as HTMLImageElement;
                  img.src = 'https://images.unsplash.com/photo-1555041469-fd26927b8d5a?auto=format&fit=crop&w=900&q=85';
                  img.onerror = () => { img.style.display = 'none'; };
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">Our Services</p>
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-center text-on-surface mt-2">Design Solutions for Every Space</h2>
        <p className="text-secondary text-center mt-3">From single rooms to complete home makeovers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {SERVICES.map((s) => (
            <Link to="/estimate" key={s.name} className="bg-surface-container-lowest p-8 rounded-3xl hover:shadow-ambient transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">{s.name}</h3>
              <p className="text-sm text-secondary mt-2 leading-relaxed">{s.desc}</p>
              <p className="text-primary font-bold text-sm mt-4">Starting from &#8377;{s.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">Our Work</p>
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-center text-on-surface mt-2">Recent Projects</h2>
        <p className="text-secondary text-center mt-3">A glimpse of spaces we've transformed across India</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {portfolio.map((p, idx) => {
            const fallback = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
            const imgSrc = p.image_url || fallback;
            return (
              <Link to="/estimate" key={p.id} className="group rounded-3xl overflow-hidden bg-surface-container-lowest hover:shadow-ambient transition-all">
                <div className="aspect-[4/3] overflow-hidden bg-surface-container-high relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary/20 text-[60px] absolute">home</span>
                  <img
                    src={imgSrc}
                    alt={p.title}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== fallback) { img.src = fallback; } else { img.style.display = 'none'; }
                    }}
                  />
                </div>
                <div className="p-5">
                  <p className="font-headline font-bold text-on-surface">{p.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-secondary">{p.city}</p>
                    <span className="text-xs font-semibold text-primary bg-primary/5 px-3 py-1 rounded-full">{p.style}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-8 bg-surface-container-low">
        <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">How It Works</p>
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-center text-on-surface mt-2">Your Dream Interior in 3 Simple Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          {STEPS.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white font-headline text-2xl font-bold flex items-center justify-center mx-auto">{s.num}</div>
              <h3 className="font-headline text-xl font-bold mt-6">{s.title}</h3>
              <p className="text-sm text-secondary mt-3 max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/how-it-works" className="text-primary font-semibold text-sm inline-flex items-center gap-2">
            Learn More About Our Process <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-8 bg-primary relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-white">
              <p className="font-headline text-3xl sm:text-4xl font-extrabold">{s.num}</p>
              <p className="text-sm text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">Client Stories</p>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-center text-on-surface mt-2">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-surface-container-lowest p-8 rounded-3xl">
                <span className="material-symbols-outlined text-primary/20 text-4xl">format_quote</span>
                <p className="text-on-surface text-sm leading-relaxed mt-4">{t.content}</p>
                <div className="h-[1px] bg-surface-container-low my-6" />
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${
                    ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500'][t.id % 6]
                  }`}>
                    {t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{t.name}</p>
                    <p className="text-xs text-secondary">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 sm:px-8 mx-4 sm:mx-8 mb-16 rounded-3xl bg-gradient-to-br from-primary-container to-primary text-center relative overflow-hidden">
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white">
          {content.cta_title || 'Ready to Start Your Dream Interior?'}
        </h2>
        <p className="text-white/70 mt-3">{content.cta_subtitle || 'Get a free, detailed estimate in under 5 minutes'}</p>
        <Link to="/estimate" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm mx-auto mt-8 inline-block shadow-xl hover:shadow-2xl">
          Get Your Free Estimate
        </Link>
      </section>
    </>
  );
}
