import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { estimatesApi } from '../../api/estimates.api';
import { ROOM_TYPES, TIERS, PROPERTY_TYPES, DESIGN_STYLES } from '../../utils/constants';
import { formatINR } from '../../utils/formatCurrency';
import type { RoomInput, EstimateResult } from '../../types';

const STEP_LABELS = ['Property Details', 'Design Style', 'Room Selection', 'Your Estimate'];

export default function EstimatePage() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [propertyType, setPropertyType] = useState('apartment');
  const [bhk, setBhk] = useState('2 BHK');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 2
  const [style, setStyle] = useState('modern_minimalist');
  const [tier, setTier] = useState('standard');

  // Step 3
  const [rooms, setRooms] = useState<Record<string, { enabled: boolean; count: number }>>(() => {
    const init: Record<string, { enabled: boolean; count: number }> = {};
    ROOM_TYPES.forEach(r => { init[r.value] = { enabled: r.value === 'living_room' || r.value === 'bedroom' || r.value === 'kitchen', count: r.value === 'bedroom' ? 2 : 1 }; });
    return init;
  });

  // Step 4
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [saved, setSaved] = useState(false);

  const selectedRooms: RoomInput[] = Object.entries(rooms)
    .filter(([_, v]) => v.enabled)
    .map(([k, v]) => ({ room_type: k, count: v.count }));

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await estimatesApi.calculate({ rooms: selectedRooms, tier });
      setResult(res.data);
      setStep(3);
    } catch (e) {
      alert('Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setLoading(true);
    try {
      await estimatesApi.save({
        rooms: selectedRooms,
        tier,
        project_type: 'new',
        property_type: propertyType,
        style,
        guest_email: !isAuthenticated ? email : undefined,
      });
      setSaved(true);
    } catch {
      alert('Failed to save estimate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Get Your Estimate — Home Interior</title></Helmet>
      <div className="max-w-5xl mx-auto py-28 px-4 sm:px-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-16">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                </div>
                <span className={`text-xs font-semibold mt-2 hidden sm:block ${i === step ? 'text-primary' : 'text-secondary'}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-3 ${i < step ? 'bg-emerald-500' : 'bg-surface-container-high'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Property */}
        {step === 0 && (
          <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-sm">
            <h2 className="font-headline text-2xl font-extrabold text-on-surface">Tell Us About Your Space</h2>
            <p className="text-sm text-secondary mt-2">Help us understand your property to provide an accurate estimate</p>

            <div className="mt-10 space-y-8">
              <div>
                <label className="text-sm font-bold text-on-surface mb-4 block">Property Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PROPERTY_TYPES.map(p => (
                    <button key={p.value} onClick={() => setPropertyType(p.value)}
                      className={`p-6 rounded-2xl text-center cursor-pointer transition-all ${propertyType === p.value ? 'ring-2 ring-primary bg-primary/5' : 'bg-surface-container-low'}`}>
                      <span className="material-symbols-outlined text-primary text-3xl block mx-auto mb-3">{p.icon}</span>
                      <span className="text-sm font-semibold text-on-surface">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-on-surface mb-4 block">BHK Configuration</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map(b => (
                    <button key={b} onClick={() => setBhk(b)}
                      className={`px-6 py-4 rounded-xl text-center text-sm font-bold cursor-pointer transition-all ${bhk === b ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-10">
              <button onClick={() => setStep(1)} className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-blue-500/10 inline-flex items-center gap-2">
                Next: Choose Style <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Style */}
        {step === 1 && (
          <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-sm">
            <h2 className="font-headline text-2xl font-extrabold text-on-surface">Choose Your Design Style</h2>
            <p className="text-sm text-secondary mt-2">Select a theme that matches your vision</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {DESIGN_STYLES.map(s => (
                <button key={s.value} onClick={() => setStyle(s.value)}
                  className={`rounded-2xl overflow-hidden text-left transition-all ${style === s.value ? 'ring-3 ring-primary' : ''}`}>
                  <div className="aspect-[4/3] bg-surface-container-high flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-primary/15 text-[60px]">palette</span>
                    {style === s.value && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-5">
                      <p className="text-white font-headline font-bold">{s.label}</p>
                      <p className="text-white/70 text-xs">{s.multiplier}x multiplier</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10">
              <label className="text-sm font-bold text-on-surface mb-4 block">Pricing Tier</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TIERS.map(t => (
                  <button key={t.value} onClick={() => setTier(t.value)}
                    className={`p-5 rounded-2xl text-center cursor-pointer transition-all ${tier === t.value ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface'}`}>
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className={`text-xs mt-1 ${tier === t.value ? 'opacity-70' : 'text-secondary'}`}>{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <button onClick={() => setStep(0)} className="text-secondary font-semibold text-sm">Back</button>
              <button onClick={() => setStep(2)} className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-blue-500/10 inline-flex items-center gap-2">
                Next: Select Rooms <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Rooms */}
        {step === 2 && (
          <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-sm">
            <h2 className="font-headline text-2xl font-extrabold text-on-surface">Select Rooms & Services</h2>
            <p className="text-sm text-secondary mt-2">Toggle rooms on/off and set the count for each</p>

            <div className="space-y-4 mt-10">
              {ROOM_TYPES.map(rt => (
                <div key={rt.value} className={`rounded-2xl overflow-hidden transition-all ${rooms[rt.value]?.enabled ? 'bg-surface-container-low' : 'bg-surface-container-low/50'}`}>
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">{rt.icon}</span>
                      </div>
                      <div>
                        <p className="font-headline text-base font-bold text-on-surface">{rt.label}</p>
                        <p className="text-xs text-secondary">{rt.area} sq ft default</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {rooms[rt.value]?.enabled && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setRooms(prev => ({ ...prev, [rt.value]: { ...prev[rt.value], count: Math.max(1, prev[rt.value].count - 1) } }))}
                            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface font-bold">-</button>
                          <span className="text-sm font-bold w-8 text-center">{rooms[rt.value]?.count}</span>
                          <button onClick={() => setRooms(prev => ({ ...prev, [rt.value]: { ...prev[rt.value], count: Math.min(10, prev[rt.value].count + 1) } }))}
                            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface font-bold">+</button>
                        </div>
                      )}
                      <button onClick={() => setRooms(prev => ({ ...prev, [rt.value]: { ...prev[rt.value], enabled: !prev[rt.value].enabled } }))}
                        className={`w-12 h-7 rounded-full relative transition-colors ${rooms[rt.value]?.enabled ? 'bg-primary' : 'bg-surface-container-high'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${rooms[rt.value]?.enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-10">
              <button onClick={() => setStep(1)} className="text-secondary font-semibold text-sm">Back</button>
              <button onClick={handleCalculate} disabled={loading || selectedRooms.length === 0}
                className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-blue-500/10 inline-flex items-center gap-2 disabled:opacity-50">
                {loading ? 'Calculating...' : 'View Full Estimate'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 3 && result && (
          <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-sm">
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">Your Detailed Estimate</h2>
            <p className="text-sm text-secondary mt-2">Here's a complete breakdown of your interior design costs</p>

            {/* Grand Total Card */}
            <div className="bg-primary p-8 rounded-3xl text-white mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-70">Grand Total</p>
                  <p className="font-headline text-3xl sm:text-4xl font-extrabold mt-2">{formatINR(result.grand_total)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Subtotal: {formatINR(result.subtotal)}</p>
                  <p className="text-xs opacity-70 mt-1">GST ({result.gst_percent}%): {formatINR(result.gst_amount)}</p>
                  <p className="text-xs opacity-70 mt-1">Labour ({result.labour_percent}%): {formatINR(result.labour_cost)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Rooms: {result.breakdown.length}</p>
                  <p className="text-xs opacity-70 mt-1">Tier: {tier}</p>
                  <p className="text-xs opacity-70 mt-1">Style: {style.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-10">
              <h3 className="font-headline text-xl font-bold">Room-wise Cost Breakdown</h3>
              <div className="space-y-4 mt-6">
                {result.breakdown.map(room => {
                  const rt = ROOM_TYPES.find(r => r.value === room.room_type);
                  return (
                    <div key={room.room_type} className="bg-surface-container-low rounded-2xl px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary">{rt?.icon || 'room'}</span>
                        <div>
                          <p className="font-bold text-sm text-on-surface">{rt?.label || room.room_type}</p>
                          <p className="text-xs text-secondary">{room.count}x &middot; {room.area_sqft} sq ft &middot; {formatINR(room.price_per_sqft)}/sqft</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary text-sm">{formatINR(room.room_cost)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-12 justify-center">
              <button onClick={handleSave} disabled={loading || saved}
                className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined text-lg">bookmark</span>
                {saved ? 'Saved!' : 'Save Estimate'}
              </button>
              <button onClick={() => setStep(0)} className="bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">edit</span> Modify Estimate
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
