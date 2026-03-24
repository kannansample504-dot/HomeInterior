import { useEffect, useState, useRef } from 'react';
import { cmsApi } from '../../../../api/cms.api';

const PAGES = ['home', 'about', 'howitworks', 'estimate'];

const SEO_FIELDS = [
  { key: 'meta_title', label: 'Meta Title', hint: 'Max 60 characters — shown in browser tab & search results', max: 60 },
  { key: 'meta_description', label: 'Meta Description', hint: 'Max 160 characters — search result snippet', max: 160 },
  { key: 'og_title', label: 'OG Title', hint: 'Open Graph title for social sharing', max: 70 },
  { key: 'og_description', label: 'OG Description', hint: 'Open Graph description for social sharing', max: 200 },
  { key: 'og_image_url', label: 'OG Image URL', hint: 'Full URL to image shown when sharing on social media', max: null },
  { key: 'canonical_url', label: 'Canonical URL', hint: 'Canonical URL to prevent duplicate content issues', max: null },
];

export default function SEOTab() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [seo, setSeo] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const msgTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSeo({});
    cmsApi.getSEO(selectedPage).then(r => setSeo(r.data as any)).catch(() => setSeo({}));
  }, [selectedPage]);

  useEffect(() => {
    if (!msg) return;
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 4000);
    return () => clearTimeout(msgTimer.current);
  }, [msg]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await cmsApi.updateSEO(selectedPage, seo);
      setMsg('SEO settings saved!');
    } catch {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Page selector */}
      <div className="flex gap-3 mb-8 overflow-x-auto">
        {PAGES.map(p => (
          <button key={p} onClick={() => { setSelectedPage(p); setMsg(''); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedPage === p ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}>
            {p === 'howitworks' ? 'How It Works' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">travel_explore</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">SEO Settings — {selectedPage}</h3>
            <p className="text-xs text-secondary">Configure search engine and social media metadata</p>
          </div>
        </div>

        {SEO_FIELDS.map(field => (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">{field.label}</label>
              {field.max && (
                <span className={`text-[10px] font-semibold ${
                  ((seo[field.key] || '').length > field.max) ? 'text-error' : 'text-secondary'
                }`}>
                  {(seo[field.key] || '').length}/{field.max}
                </span>
              )}
            </div>
            <input
              type={field.key.includes('url') ? 'url' : 'text'}
              value={(seo[field.key] || '')}
              onChange={e => setSeo(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.hint}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[10px] text-secondary mt-1">{field.hint}</p>
          </div>
        ))}

        {/* OG Preview */}
        {(seo.og_title || seo.og_description) && (
          <div className="rounded-2xl overflow-hidden mt-4 bg-surface-container-low">
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">preview</span>
              <span className="text-xs font-semibold text-secondary">Social Preview</span>
            </div>
            {seo.og_image_url && (
              <div className="h-32 bg-surface-container-high overflow-hidden">
                <img src={seo.og_image_url} alt="OG preview"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
            )}
            <div className="p-4">
              <p className="text-[10px] text-secondary uppercase">homeinterior.in</p>
              <p className="font-bold text-sm text-on-surface mt-0.5">{seo.og_title || seo.meta_title}</p>
              <p className="text-xs text-secondary mt-1 line-clamp-2">{seo.og_description || seo.meta_description}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="bg-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
          {msg && <span className={`text-sm font-medium ${msg.includes('saved') ? 'text-primary' : 'text-error'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
