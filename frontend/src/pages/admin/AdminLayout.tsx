import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../../components/common/UserAvatar';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'cms', label: 'CMS Management', icon: 'article' },
  { key: 'projects', label: 'Recent Projects', icon: 'home_work' },
  { key: 'company', label: 'Company Settings', icon: 'business' },
  { key: 'seo', label: 'SEO Management', icon: 'travel_explore' },
  { key: 'users', label: 'User Management', icon: 'group' },
  { key: 'estimates', label: 'Estimate Management', icon: 'receipt_long' },
  { key: 'pricing', label: 'Pricing Engine', icon: 'payments' },
  { key: 'analytics', label: 'Reports & Analytics', icon: 'bar_chart' },
  { key: 'settings', label: 'System Settings', icon: 'settings' },
];

interface Props {
  section: string;
  onSection: (s: string) => void;
  children: ReactNode;
  search: string;
  onSearch: (s: string) => void;
}

function ProfileDropdown() {
  const { user, logout, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const msgTimer = useRef<ReturnType<typeof setTimeout>>();

  const showMsg = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(msgTimer.current);
    if (m) msgTimer.current = setTimeout(() => setMsg(''), 4000);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setEditMode(false);
        setMsg('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openEdit = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditCity(user?.city || '');
    setMsg('');
    setEditMode(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: editName, phone: editPhone, city: editCity });
      showMsg('Saved!');
      setEditMode(false);
    } catch {
      showMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(v => !v); setEditMode(false); setMsg(''); }}
        className="flex items-center gap-2 pl-3 ml-1 hover:opacity-80 transition-opacity"
      >
        <span className="text-sm font-semibold text-on-surface">Admin Profile</span>
        <UserAvatar userId={user.id} name={user.name} email={user.email} size={32} />
        <span className="material-symbols-outlined text-secondary text-sm">expand_more</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden z-50">
          {/* User header */}
          <div className="flex items-center gap-3 p-4 bg-surface-container-low">
            <UserAvatar userId={user.id} name={user.name} email={user.email} size={44} editable />
            <div className="min-w-0">
              <p className="font-bold text-on-surface text-sm truncate">{user.name}</p>
              <p className="text-xs text-secondary truncate">{user.email}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize mt-0.5 inline-block">
                {user.role}
              </span>
            </div>
          </div>

          {!editMode ? (
            <>
              {/* Info rows */}
              <div className="px-4 py-3 space-y-2 bg-surface-container-lowest">
                {[
                  { icon: 'phone', label: user.phone || 'No phone set' },
                  { icon: 'location_on', label: user.city || 'No city set' },
                  { icon: 'calendar_today', label: `Joined ${new Date(user.date_joined).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}` },
                ].map(row => (
                  <div key={row.icon} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">{row.icon}</span>
                    <span className="text-xs text-secondary">{row.label}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-2 bg-surface-container-low">
                <button onClick={openEdit}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-left">
                  <span className="material-symbols-outlined text-secondary text-base">edit</span>
                  <span className="text-sm font-medium text-on-surface">Edit Profile</span>
                </button>
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-error-container transition-colors text-left">
                  <span className="material-symbols-outlined text-error text-base">logout</span>
                  <span className="text-sm font-medium text-error">Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-sm font-bold text-on-surface">Edit Profile</p>
              {[
                { label: 'Name', value: editName, set: setEditName, type: 'text' },
                { label: 'Phone', value: editPhone, set: setEditPhone, type: 'tel' },
                { label: 'City', value: editCity, set: setEditCity, type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
              {msg && <p className={`text-xs font-semibold ${msg === 'Saved!' ? 'text-primary' : 'text-error'}`}>{msg}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditMode(false)}
                  className="flex-1 bg-surface-container text-secondary py-2 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ section, onSection, children, search, onSearch }: Props) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-surface-container-low overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest flex flex-col shadow-sm flex-shrink-0 overflow-y-auto">
        {/* Branding */}
        <div className="px-6 py-6 bg-surface-container-low">
          <p className="font-headline text-lg font-extrabold text-on-surface tracking-tight">Interior Admin</p>
          <p className="text-[10px] font-bold tracking-[0.18em] text-secondary uppercase mt-0.5">Management Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => onSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                section === item.key
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${section === item.key ? 'text-white' : 'text-secondary'}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="px-4 py-4 bg-surface-container-low">
          <div className="flex items-center gap-3">
            {user && <UserAvatar userId={user.id} name={user.name} email={user.email} size={40} />}
            <div className="min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-secondary">
                {user?.role === 'admin' ? 'Chief Architect' : user?.role === 'staff' ? 'Staff' : 'Manager'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-surface-container-lowest flex items-center px-6 gap-4 shadow-sm flex-shrink-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-xl">search</span>
              <input
                type="text"
                value={search}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search estimates, clients, or materials..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder-secondary border-none outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl">notifications</span>
            </button>
            <button className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl">help_outline</span>
            </button>
            <ProfileDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
