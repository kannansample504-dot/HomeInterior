import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { estimatesApi } from '../../api/estimates.api';
import { ROOM_TYPES, TIERS, PROPERTY_TYPES, DESIGN_STYLES } from '../../utils/constants';
import { formatINR } from '../../utils/formatCurrency';
import type { RoomInput, EstimateResult } from '../../types';

const STEP_LABELS = ['Property Details', 'Design Style', 'Room Selection', 'Your Estimate'];

export default function EstimatePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
  const [calcError, setCalcError] = useState('');
  const [saveError, setSaveError] = useState('');

  const selectedRooms: RoomInput[] = Object.entries(rooms)
    .filter(([_, v]) => v.enabled)
    .map(([k, v]) => ({ room_type: k, count: v.count }));

  const handleCalculate = async () => {
    setLoading(true);
    setCalcError('');
    try {
      const res = await estimatesApi.calculate({ rooms: selectedRooms, tier });
      setResult(res.data);
      setStep(3);
    } catch {
      setCalcError('Calculation failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/estimate' } } });
      return;
    }
    setLoading(true);
    setSaveError('');
    try {
      await estimatesApi.save({
        rooms: selectedRooms,
        tier,
        project_type: 'new',
        property_type: propertyType,
        style,
      });
      setSaved(true);
    } catch {
      setSaveError('Failed to save estimate. Please try again.');
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
                  i < step ? 'bg-primary/80 text-white' : i === step ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                </div>
                <span className={`text-xs font-semibold mt-2 hidden sm:block ${i === step ? 'text-primary' : 'text-secondary'}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-3 ${i < step ? 'bg-primary/80' : 'bg-surface-container-high'}`} />
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
              <button
                onClick={() => setStep(1)}
                disabled={!name.trim() || !phone.trim() || !email.trim()}
                className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-primary/10 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-container"
              >
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
                  className={`rounded-2xl overflow-hidden text-left transition-all ${style === s.value ? 'ring-3 ring-primary shadow-lg shadow-primary/20' : ''}`}>
                  <div className="aspect-[4/3] bg-surface-container-high relative flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/20 text-[60px] absolute">palette</span>
                    <img
                      src={s.image}
                      alt={s.label}
                      className="w-full h-full object-cover absolute inset-0"
                      loading="lazy"
                      onError={e => {
                        const img = e.target as HTMLImageElement;
                        const fb = 'https://images.unsplash.com/photo-1586023492125-27272f1144b3?auto=format&fit=crop&w=800&q=80';
                        if (img.src !== fb) { img.src = fb; } else { img.style.display = 'none'; }
                      }}
                    />
                    {style === s.value && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
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
              <button onClick={() => setStep(2)} className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-primary/10 inline-flex items-center gap-2">
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

            {calcError && (
              <p className="mt-4 text-sm font-medium text-error bg-error-container px-4 py-3 rounded-xl">{calcError}</p>
            )}
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="text-secondary font-semibold text-sm">Back</button>
              <button onClick={handleCalculate} disabled={loading || selectedRooms.length === 0}
                className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-primary/10 inline-flex items-center gap-2 disabled:opacity-50">
                {loading ? 'Calculating...' : 'View Full Estimate'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 3 && result && (() => {
          const totalRooms = result.breakdown.reduce((s, r) => s + r.count, 0);
          const maxRoomCost = Math.max(...result.breakdown.map(r => r.room_cost));
          const miscCost = result.material_cost * 0.2;
          const designFee = result.material_cost * 0.08;
          const labourDisp = result.labour_cost;
          const materialDisp = result.material_cost - miscCost - designFee;
          const totalWeeks = Math.max(8, Math.round(totalRooms * 2.5));
          const designWeeks = 3;
          const civilWeeks = 1;
          const buildWeeks = totalWeeks - designWeeks - civilWeeks - 1;
          const contingencyWeeks = 1;
          const formatLacs = (v: number) => `\u20B9${(v / 100000).toFixed(2)} Lacs`;

          const SERVICES_BREAKDOWN = [
            { name: 'Carpentry', icon: 'carpenter', color: 'bg-amber-100 text-amber-700', pct: 0.30 },
            { name: 'Loose Furniture', icon: 'chair', color: 'bg-emerald-100 text-emerald-700', pct: 0.14 },
            { name: 'Painting', icon: 'format_paint', color: 'bg-teal-100 text-teal-700', pct: 0.09 },
            { name: 'Design', icon: 'design_services', color: 'bg-rose-100 text-rose-700', pct: 0.08 },
            { name: 'Soft Furnishing', icon: 'curtains', color: 'bg-pink-100 text-pink-700', pct: 0.06 },
            { name: 'False Ceiling', icon: 'roofing', color: 'bg-blue-100 text-blue-700', pct: 0.06 },
            { name: 'Electrical', icon: 'electrical_services', color: 'bg-purple-100 text-purple-700', pct: 0.06 },
            { name: 'Civil', icon: 'construction', color: 'bg-green-100 text-green-700', pct: 0.02 },
          ];

          return (
          <div className="space-y-6">
            {/* Row 1: Cost Break-up + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Break-up */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline text-lg font-bold text-on-surface">Cost Break-up</h3>
                  <p className="font-headline text-lg font-bold text-on-surface">Total: {formatLacs(result.grand_total)}</p>
                </div>
                <p className="text-xs text-secondary mb-6">The break-up of labor and material costs are provided based on certain assumptions which can be customised.</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-amber-700 text-white p-3 rounded-lg">
                    <p className="text-[10px] font-bold uppercase">Labour</p>
                    <p className="text-sm font-bold mt-1">{formatLacs(labourDisp)}</p>
                  </div>
                  <div className="bg-amber-900 text-white p-3 rounded-lg">
                    <p className="text-[10px] font-bold uppercase">Material</p>
                    <p className="text-sm font-bold mt-1">{formatLacs(materialDisp)}</p>
                  </div>
                  <div className="bg-teal-700 text-white p-3 rounded-lg">
                    <p className="text-[10px] font-bold uppercase">Misc. Costs</p>
                    <p className="text-sm font-bold mt-1">{formatLacs(miscCost)}</p>
                  </div>
                  <div className="bg-teal-900 text-white p-3 rounded-lg">
                    <p className="text-[10px] font-bold uppercase">Design Fee</p>
                    <p className="text-sm font-bold mt-1">{formatLacs(designFee)}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline text-lg font-bold text-on-surface">Timeline</h3>
                  <p className="font-headline text-lg font-bold text-on-surface">{totalWeeks - 1} - {totalWeeks} Weeks</p>
                </div>
                <div className="space-y-3">
                  {/* Gantt bars */}
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-surface-container-low rounded-full h-6 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-amber-400 rounded-full" style={{ width: `${(designWeeks / totalWeeks) * 100}%` }} />
                      <div className="absolute top-0 h-full bg-rose-500 rounded-full" style={{ left: `${(designWeeks / totalWeeks) * 100}%`, width: `${(civilWeeks / totalWeeks) * 100}%` }} />
                      <div className="absolute top-0 h-full bg-primary/80 rounded-full" style={{ left: `${((designWeeks + civilWeeks) / totalWeeks) * 100}%`, width: `${(buildWeeks / totalWeeks) * 100}%` }} />
                      <div className="absolute top-0 h-full bg-sky-300 rounded-full" style={{ left: `${((designWeeks + civilWeeks + buildWeeks) / totalWeeks) * 100}%`, width: `${(contingencyWeeks / totalWeeks) * 100}%` }} />
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-400" /><span className="text-xs text-secondary">Design ({designWeeks} Weeks)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-500" /><span className="text-xs text-secondary">Civil ({civilWeeks} Week)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary/80" /><span className="text-xs text-secondary">Build* ({buildWeeks} Weeks)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-sky-300" /><span className="text-xs text-secondary">Contingency ({contingencyWeeks} Week)</span></div>
                  </div>
                  <p className="text-[10px] text-secondary bg-surface-container-low inline-block px-3 py-1 rounded-full mt-2">* Build includes Carpentry, Painting, Electrical, False Ceiling etc.</p>
                </div>
              </div>
            </div>

            {/* Row 2: Cost by Rooms + Cost by Services */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cost by Rooms (Bar Chart) */}
              <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline text-lg font-bold text-on-surface">Cost by Rooms</h3>
                  <p className="text-sm font-bold text-on-surface">Total: {totalRooms} rooms</p>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-lg">settings</span>
                  <span className="text-sm font-semibold text-primary">Aggregate cost: {formatLacs(result.material_cost)}</span>
                </div>

                {/* Bar chart */}
                <div className="flex items-end gap-3 h-64 border-b border-surface-container-high px-2">
                  {result.breakdown.map(room => {
                    const rt = ROOM_TYPES.find(r => r.value === room.room_type);
                    const barHeight = maxRoomCost > 0 ? (room.room_cost / maxRoomCost) * 100 : 0;
                    return (
                      <div key={room.room_type} className="flex-1 flex flex-col items-center justify-end h-full">
                        <p className="text-[10px] font-bold text-on-surface mb-1">{formatINR(room.room_cost)}</p>
                        <div
                          className="w-full bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg min-h-[4px] transition-all"
                          style={{ height: `${barHeight}%` }}
                        />
                        <p className="text-[10px] text-secondary mt-2 text-center leading-tight truncate w-full" title={rt?.label}>
                          {rt?.label || room.room_type}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Y-axis labels */}
                <div className="flex justify-between mt-2 px-2">
                  <span className="text-[10px] text-secondary">{formatINR(0)}</span>
                  <span className="text-[10px] text-secondary">{formatINR(maxRoomCost / 2)}</span>
                  <span className="text-[10px] text-secondary">{formatINR(maxRoomCost)}</span>
                </div>
              </div>

              {/* Cost by Services */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
                <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Cost by Services</h3>
                <div className="space-y-4">
                  {SERVICES_BREAKDOWN.map(svc => {
                    const svcCost = result.grand_total * svc.pct;
                    return (
                      <div key={svc.name} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${svc.color} flex items-center justify-center flex-shrink-0`}>
                          <span className="material-symbols-outlined text-lg">{svc.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface underline decoration-dotted cursor-pointer">{svc.name}</p>
                          <p className="text-xs text-secondary">{formatLacs(svcCost)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Room-wise Detail Cards */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
              <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Room-wise Breakdown</h3>
              <div className="space-y-3">
                {result.breakdown.map(room => {
                  const rt = ROOM_TYPES.find(r => r.value === room.room_type);
                  const pct = result.material_cost > 0 ? (room.room_cost / result.material_cost) * 100 : 0;
                  return (
                    <div key={room.room_type} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">{rt?.icon || 'room'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-sm text-on-surface">{rt?.label || room.room_type}</p>
                          <p className="font-bold text-sm text-primary">{formatINR(room.room_cost)}</p>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-2">
                          <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-secondary mt-1">{room.count}x &middot; {room.area_sqft} sq ft &middot; {formatINR(room.price_per_sqft)}/sqft &middot; {pct.toFixed(1)}% of total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grand Total Summary */}
            <div className="bg-on-surface p-6 rounded-2xl text-white">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Material</p>
                  <p className="font-headline text-lg font-bold mt-1">{formatLacs(materialDisp)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Labour ({result.labour_percent}%)</p>
                  <p className="font-headline text-lg font-bold mt-1">{formatLacs(labourDisp)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">GST ({result.gst_percent}%)</p>
                  <p className="font-headline text-lg font-bold mt-1">{formatLacs(result.gst_amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Misc + Design</p>
                  <p className="font-headline text-lg font-bold mt-1">{formatLacs(miscCost + designFee)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Grand Total</p>
                  <p className="font-headline text-xl font-extrabold mt-1">{formatLacs(result.grand_total)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {saveError && (
              <p className="text-sm font-medium text-error bg-error-container px-4 py-3 rounded-xl text-center">{saveError}</p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={handleSave} disabled={loading || saved}
                className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined text-lg">bookmark</span>
                {saved ? 'Saved!' : 'Save Estimate'}
              </button>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span> Download PDF
              </button>
              <button onClick={() => { setStep(0); setSaved(false); setResult(null); }} className="bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">edit</span> Modify Estimate
              </button>
            </div>
          </div>
          );
        })()}
      </div>
    </>
  );
}
