import { useEffect, useState } from 'react';
import { cmsApi } from '../../../../api/cms.api';

const PAGES = ['home', 'about', 'howitworks', 'estimate'];

export default function ContentTab() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<Record<string, string>>({});
  const [seo, setSeo] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    cmsApi.getPageContent(selectedPage).then(r => setContent(r.data)).catch(() => setContent({}));
    cmsApi.getSEO(selectedPage).then(r => setSeo(r.data as any)).catch(() => setSeo({}));
  }, [selectedPage]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const fields = Object.entries(content).map(([field_key, field_value]) => ({ field_key, field_value }));
      await cmsApi.updatePageContent(selectedPage, fields);
      await cmsApi.updateSEO(selectedPage, seo);
      setMsg('Saved successfully!');
    } catch {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex gap-3 mb-8 overflow-x-auto">
        {PAGES.map(p => (
          <button key={p} onClick={() => setSelectedPage(p)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap ${
              selectedPage === p ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface-variant'
            }`}>
            {p}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-3xl space-y-6">
        <h3 className="font-headline text-lg font-bold">Page Content: {selectedPage}</h3>
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">{key.replace(/_/g, ' ')}</label>
            <textarea
              value={value}
              onChange={e => setContent(prev => ({ ...prev, [key]: e.target.value }))}
              rows={value.length > 100 ? 4 : 2}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>
        ))}

        <h3 className="font-headline text-lg font-bold pt-6">SEO Meta</h3>
        {['meta_title', 'meta_description', 'og_title', 'og_description'].map(key => (
          <div key={key}>
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">{key.replace(/_/g, ' ')}</label>
            <input
              value={(seo as any)[key] || ''}
              onChange={e => setSeo(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}

        <div className="flex items-center gap-4 pt-4">
          <button onClick={handleSave} disabled={saving}
            className="bg-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {msg && <span className={`text-sm font-medium ${msg.includes('success') ? 'text-emerald-600' : 'text-error'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
