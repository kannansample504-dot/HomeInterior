import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { cmsApi } from '../../api/cms.api';

const VALUES = [
  { icon: 'visibility', color: 'text-primary', title: 'Transparency', desc: 'Clear pricing with no hidden costs. Every rupee is accounted for in your detailed estimate.' },
  { icon: 'workspace_premium', color: 'text-amber-600', title: 'Quality', desc: 'We partner with premium material suppliers and skilled craftspeople to deliver lasting excellence.' },
  { icon: 'lightbulb', color: 'text-emerald-600', title: 'Innovation', desc: 'Technology-driven solutions that make the design process faster, smarter, and more accurate.' },
  { icon: 'favorite', color: 'text-rose-600', title: 'Customer First', desc: 'Your satisfaction is our priority. Personalized service from first estimate to final installation.' },
];

const TEAM = [
  { name: 'Arjun Kapoor', role: 'Founder & Lead Designer', bio: 'With 15 years in luxury interior design, Arjun leads our creative vision and design philosophy.' },
  { name: 'Meera Patel', role: 'Head of Operations', bio: 'Meera ensures every project runs smoothly from estimate to installation, with a focus on client satisfaction.' },
  { name: 'Vikram Singh', role: 'Chief Technology Officer', bio: 'Vikram built our estimation engine, bringing AI and data science to interior design costing.' },
  { name: 'Sneha Reddy', role: 'Senior Interior Designer', bio: 'Sneha specializes in modern minimalist design and has curated over 500 residential projects.' },
];

export default function AboutPage() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    cmsApi.getPageContent('about').then(r => setContent(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>About Us — Home Interior</title></Helmet>

      {/* Header */}
      <section className="pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <p className="text-xs text-secondary font-body">
          <Link to="/" className="text-primary hover:underline">Home</Link> &gt; About Us
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-on-surface mt-4">
          {content.page_title || 'About Us'}
        </h1>
        <p className="text-lg text-secondary mt-3">{content.page_subtitle || 'Crafting Beautiful Spaces Since 2014'}</p>
      </section>

      {/* Story */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-widest text-primary font-bold">Our Story</p>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface mt-3">
              {content.story_title || 'Born from a Passion for Beautiful Living'}
            </h2>
            <p className="text-secondary text-base leading-relaxed mt-6">
              {content.story_paragraph_1 || 'Home Interior was founded with a simple belief — everyone deserves a beautifully designed living space without the stress of unpredictable costs.'}
            </p>
            <p className="text-secondary text-base leading-relaxed mt-4">
              {content.story_paragraph_2 || 'We combined our deep expertise in interior design with cutting-edge estimation technology to create a platform that gives you transparent, detailed cost breakdowns before you commit.'}
            </p>
            <div className="bg-surface-container-low p-6 rounded-2xl mt-8 border-l-4 border-primary">
              <p className="font-headline text-lg font-bold text-on-surface">"Design should be accessible, transparent, and delightful."</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-ambient-lg bg-surface-container-high aspect-[4/5] flex items-center justify-center">
              <span className="material-symbols-outlined text-primary/10 text-[120px]">architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 sm:px-8 bg-surface-container-low">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            { icon: 'flag', title: content.mission_title || 'Our Mission', text: content.mission_text || 'To make professional interior design accessible and transparent for everyone.' },
            { icon: 'visibility', title: content.vision_title || 'Our Vision', text: content.vision_text || 'To be the most trusted interior design estimation platform in the country.' },
          ].map((item) => (
            <div key={item.title} className="bg-surface-container-lowest p-10 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-on-surface">{item.title}</h3>
              <p className="text-secondary text-sm leading-relaxed mt-4">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">What Drives Us</p>
        <h2 className="font-headline text-3xl font-extrabold text-center text-on-surface mt-2">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-surface-container-lowest p-8 rounded-3xl text-center hover:shadow-ambient transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                <span className={`material-symbols-outlined ${v.color} text-2xl`}>{v.icon}</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">{v.title}</h3>
              <p className="text-sm text-secondary mt-3 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 sm:px-8 bg-surface-container-low">
        <p className="text-xs uppercase tracking-widest text-primary font-bold text-center">The People Behind the Designs</p>
        <h2 className="font-headline text-3xl font-extrabold text-center text-on-surface mt-2">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
          {TEAM.map((m) => (
            <div key={m.name} className="bg-surface-container-lowest rounded-3xl overflow-hidden">
              <div className="aspect-[4/5] bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/10 text-[80px]">person</span>
              </div>
              <div className="p-6">
                <h4 className="font-headline text-lg font-bold text-on-surface">{m.name}</h4>
                <p className="text-sm text-primary font-semibold mt-1">{m.role}</p>
                <p className="text-xs text-secondary mt-3 leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-8 mx-4 sm:mx-8 mb-16 rounded-3xl bg-gradient-to-br from-primary-container to-primary text-center">
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white">Start Your Design Journey Today</h2>
        <p className="text-white/70 mt-3">Join 1,800+ happy homeowners who trusted us with their interiors</p>
        <Link to="/estimate" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm mt-8 inline-block">Get Your Free Estimate</Link>
      </section>
    </>
  );
}
