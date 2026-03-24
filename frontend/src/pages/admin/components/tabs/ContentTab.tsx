import { useEffect, useState, useRef } from 'react';
import { cmsApi } from '../../../../api/cms.api';

const PAGES = ['home', 'about', 'howitworks', 'estimate'];

export default function ContentTab() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const msgTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setContent({});
    cmsApi.getPageContent(selectedPage).then(r => setContent(r.data)).catch(() => setContent({}));
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
      const fields = Object.entries(content).map(([field_key, field_value]) => ({ field_key, field_value }));
      await cmsApi.updatePageContent(selectedPage, fields);
      setMsg('Content saved!');
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
            <span className="material-symbols-outlined text-primary">article</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">Page Content — {selectedPage}</h3>
            <p className="text-xs text-secondary">Edit the text and copy shown on this page</p>
          </div>
        </div>

        {Object.keys(content).length === 0 ? (
          <p className="text-sm text-secondary py-8 text-center">No editable content for this page yet.</p>
        ) : (
          Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">
                {key.replace(/_/g, ' ')}
              </label>
              <textarea
                value={value}
                onChange={e => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                rows={value.length > 100 ? 4 : 2}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 resize-y"
              />
            </div>
          ))
        )}

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="bg-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Content'}
          </button>
          {msg && <span className={`text-sm font-medium ${msg.includes('saved') ? 'text-primary' : 'text-error'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
