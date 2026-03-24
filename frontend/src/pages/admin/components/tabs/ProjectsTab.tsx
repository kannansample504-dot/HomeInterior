import { useEffect, useState, useRef } from 'react';
import { cmsApi } from '../../../../api/cms.api';
import type { PortfolioProject } from '../../../../types';

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1586023492125-27272f1144b3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555041469-fd26927b8d5a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb514cc4a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
];
const FALLBACK_IMG = FALLBACK_IMGS[0];

const STYLE_OPTIONS = [
  'Modern Minimalist', 'Contemporary Chic', 'Traditional Elegance',
  'Industrial Loft', 'Scandinavian', 'Luxury Classic',
];

const EMPTY: Omit<PortfolioProject, 'id'> = {
  title: '', city: '', style: '', image_url: '', is_visible: true, order: 0,
};

export default function ProjectsTab() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<Omit<PortfolioProject, 'id'>>(EMPTY);
  const msgTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!msg) return;
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 4000);
    return () => clearTimeout(msgTimer.current);
  }, [msg]);

  const load = () => {
    setLoading(true);
    cmsApi.adminGetProjects()
      .then(r => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm({ ...EMPTY, order: projects.length + 1 });
    setEditId('new');
    setMsg('');
  };

  const openEdit = (p: PortfolioProject) => {
    setForm({ title: p.title, city: p.city, style: p.style, image_url: p.image_url, is_visible: p.is_visible, order: p.order });
    setEditId(p.id);
    setMsg('');
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setMsg('Title is required.'); return; }
    setSaving(true);
    setMsg('');
    try {
      if (editId === 'new') {
        await cmsApi.adminCreateProject(form);
      } else {
        await cmsApi.adminUpdateProject(editId as number, form);
      }
      setEditId(null);
      load();
      setMsg('Saved!');
    } catch {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await cmsApi.adminDeleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleVisible = async (p: PortfolioProject) => {
    await cmsApi.adminUpdateProject(p.id, { is_visible: !p.is_visible });
    setProjects(prev => prev.map(x => x.id === p.id ? { ...x, is_visible: !x.is_visible } : x));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-secondary">{projects.length} project{projects.length !== 1 ? 's' : ''} · shown on home page</p>
        </div>
        <button onClick={openNew}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-lg">add</span> Add Project
        </button>
      </div>

      {/* Edit / New form */}
      {editId !== null && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 mb-6 shadow-sm">
          <h3 className="font-headline text-lg font-bold text-on-surface mb-5">
            {editId === 'new' ? 'New Project' : 'Edit Project'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Project Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Modern Minimalist 3BHK"
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">City</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Design Style</label>
              <select value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">— Select style —</option>
                {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Display Order</label>
              <input type="number" min={0} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Image URL</label>
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="https://... (leave blank to use a sample image)"
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
              {/* Image preview */}
              <div className="mt-3 flex items-start gap-4">
                <div className="w-32 h-24 rounded-xl overflow-hidden bg-surface-container-high flex-shrink-0 relative">
                  <span className="material-symbols-outlined text-primary/20 text-[40px] absolute inset-0 flex items-center justify-center">home</span>
                  <img
                    src={form.image_url || FALLBACK_IMG}
                    alt="preview"
                    className="w-full h-full object-cover absolute inset-0"
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== FALLBACK_IMG) { img.src = FALLBACK_IMG; } else { img.style.display = 'none'; }
                    }}
                  />
                </div>
                <p className="text-xs text-secondary mt-1">
                  Paste any image URL above. If left blank, a sample interior photo will be used on the home page.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm(f => ({ ...f, is_visible: !f.is_visible }))}
                className={`w-12 h-7 rounded-full relative transition-colors ${form.is_visible ? 'bg-primary' : 'bg-surface-container-high'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${form.is_visible ? 'left-6' : 'left-1'}`} />
              </button>
              <span className="text-sm font-medium text-on-surface">
                {form.is_visible ? 'Visible on home page' : 'Hidden from home page'}
              </span>
            </div>
          </div>

          {msg && <p className={`text-sm font-medium mt-3 ${msg === 'Saved!' ? 'text-primary' : 'text-error'}`}>{msg}</p>}

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors">
              {saving ? 'Saving...' : 'Save Project'}
            </button>
            <button onClick={() => { setEditId(null); setMsg(''); }}
              className="bg-surface-container-low text-secondary px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects grid */}
      {loading ? (
        <div className="text-center py-16 text-secondary">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-surface-container-high text-[80px]">home_work</span>
          <p className="font-headline text-xl font-bold text-on-surface mt-4">No Projects Yet</p>
          <p className="text-sm text-secondary mt-2">Add your first portfolio project to showcase on the home page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, idx) => {
            const fallback = FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
            const imgSrc = p.image_url || fallback;
            return (
              <div key={p.id} className={`bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm ${!p.is_visible ? 'opacity-50' : ''}`}>
                <div className="aspect-[4/3] bg-surface-container-high relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary/20 text-[50px] absolute">home</span>
                  <img src={imgSrc} alt={p.title}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== fallback) { img.src = fallback; } else { img.style.display = 'none'; }
                    }} />
                  {!p.is_visible && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      Hidden
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    #{p.order || idx + 1}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-on-surface">{p.title}</p>
                  <div className="flex items-center justify-between mt-1 mb-3">
                    <p className="text-xs text-secondary">{p.city}</p>
                    {p.style && <span className="text-[10px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{p.style}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)}
                      className="flex-1 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors inline-flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">edit</span> Edit
                    </button>
                    <button onClick={() => toggleVisible(p)}
                      className="flex-1 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors inline-flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">{p.is_visible ? 'visibility_off' : 'visibility'}</span>
                      {p.is_visible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="py-2 px-3 rounded-xl bg-error-container text-error text-xs font-semibold hover:bg-error-container/80 transition-colors">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
