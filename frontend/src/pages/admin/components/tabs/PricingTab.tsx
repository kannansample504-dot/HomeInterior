import { useEffect, useState, useRef } from 'react';
import { pricingApi } from '../../../../api/pricing.api';
import type { PricingItem, TaxConfig } from '../../../../types';

export default function PricingTab() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [tax, setTax] = useState<TaxConfig>({ gst_percent: 18, labour_percent: 12 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const msgTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    pricingApi.getMatrix().then(r => setPricing(r.data.flat)).catch(() => {});
    pricingApi.getTaxConfig().then(r => setTax(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!msg) return;
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 4000);
    return () => clearTimeout(msgTimer.current);
  }, [msg]);

  const updatePrice = (id: number, value: string) => {
    setPricing(prev => prev.map(p => p.id === id ? { ...p, price_per_sqft: parseFloat(value) || 0 } : p));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const prices = pricing.map(p => ({ id: p.id, price_per_sqft: p.price_per_sqft }));
      await pricingApi.updateMatrix(prices);
      await pricingApi.updateTaxConfig(tax);
      setMsg('Pricing updated!');
    } catch {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  // Group by room type
  const roomTypes = [...new Set(pricing.map(p => p.room_type))];
  const tiers = ['basic', 'standard', 'premium', 'luxury'];

  return (
    <div className="space-y-8">
      <div className="bg-surface-container-lowest p-6 rounded-3xl">
        <h3 className="font-headline text-lg font-bold mb-6">Pricing Matrix (per sq ft)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-outline uppercase">
                <th className="text-left py-3 px-4">Room Type</th>
                {tiers.map(t => <th key={t} className="text-left py-3 px-4">{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {roomTypes.map(rt => (
                <tr key={rt} className="border-t border-surface-container-low">
                  <td className="py-3 px-4 font-medium capitalize">{rt.replace(/_/g, ' ')}</td>
                  {tiers.map(tier => {
                    const item = pricing.find(p => p.room_type === rt && p.tier === tier);
                    return (
                      <td key={tier} className="py-3 px-4">
                        {item ? (
                          <input
                            type="number"
                            value={item.price_per_sqft}
                            onChange={e => updatePrice(item.id, e.target.value)}
                            className="w-24 px-3 py-2 bg-surface-container-low rounded-lg text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        ) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-3xl">
        <h3 className="font-headline text-lg font-bold mb-6">Tax Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">GST (%)</label>
            <input type="number" step="0.01" value={tax.gst_percent}
              onChange={e => setTax(prev => ({ ...prev, gst_percent: parseFloat(e.target.value) || 0 }))}
              className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-2 block">Labour (%)</label>
            <input type="number" step="0.01" value={tax.labour_percent}
              onChange={e => setTax(prev => ({ ...prev, labour_percent: parseFloat(e.target.value) || 0 }))}
              className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="bg-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Save All Pricing'}
        </button>
        {msg && <span className={`text-sm font-medium ${msg.includes('updated') ? 'text-primary' : 'text-error'}`}>{msg}</span>}
      </div>
    </div>
  );
}
