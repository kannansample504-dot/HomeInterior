import { useEffect, useState } from 'react';
import { cmsApi } from '../../../../api/cms.api';
import type { CompanyProfile } from '../../../../types';

const EMPTY: CompanyProfile = {
  name: '', tagline: '', logo_url: '', phone: '', email: '',
  whatsapp: '', address: '', social_links: {}, footer_text: '',
};

export default function CompanyTab() {
  const [profile, setProfile] = useState<CompanyProfile>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    cmsApi.getCompanyProfile().then(r => setProfile(r.data)).catch(() => {});
  }, []);

  const update = (key: keyof CompanyProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const updateSocial = (platform: string, url: string) => {
    setProfile(prev => ({ ...prev, social_links: { ...prev.social_links, [platform]: url } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await cmsApi.updateCompanyProfile(profile);
      setMsg('Company profile updated!');
    } catch {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof CompanyProfile; label: string; type?: string }[] = [
    { key: 'name', label: 'Company Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'logo_url', label: 'Logo URL' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'whatsapp', label: 'WhatsApp' },
  ];

  const socials = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'];

  return (
    <div className="space-y-8">
      <div className="bg-surface-container-lowest p-6 rounded-3xl">
        <h3 className="font-headline text-lg font-bold mb-6">Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-on-surface mb-2 block">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={(profile[f.key] as string) || ''}
                onChange={e => update(f.key, e.target.value)}
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold text-on-surface mb-2 block">Address</label>
          <textarea value={profile.address} onChange={e => update('address', e.target.value)} rows={3}
            className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 resize-y" />
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold text-on-surface mb-2 block">Footer Text</label>
          <textarea value={profile.footer_text} onChange={e => update('footer_text', e.target.value)} rows={2}
            className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 resize-y" />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-3xl">
        <h3 className="font-headline text-lg font-bold mb-6">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socials.map(s => (
            <div key={s}>
              <label className="text-sm font-semibold text-on-surface mb-2 block capitalize">{s}</label>
              <input
                type="url"
                value={profile.social_links?.[s] || ''}
                onChange={e => updateSocial(s, e.target.value)}
                placeholder={`https://${s}.com/...`}
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="bg-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Company Profile'}
        </button>
        {msg && <span className={`text-sm font-medium ${msg.includes('updated') ? 'text-emerald-600' : 'text-error'}`}>{msg}</span>}
      </div>
    </div>
  );
}
