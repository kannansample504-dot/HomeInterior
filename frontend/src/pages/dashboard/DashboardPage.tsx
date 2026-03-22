import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { estimatesApi } from '../../api/estimates.api';
import { formatINR } from '../../utils/formatCurrency';
import { ROOM_TYPES, STATUS_COLORS } from '../../utils/constants';
import type { EstimationRecord } from '../../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [estimates, setEstimates] = useState<EstimationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    estimatesApi.getMine()
      .then(r => setEstimates(Array.isArray(r.data) ? r.data : r.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this estimate?')) return;
    await estimatesApi.delete(id);
    setEstimates(prev => prev.filter(e => e.id !== id));
  };

  const totalValue = estimates.reduce((sum, e) => sum + Number(e.grand_total), 0);

  return (
    <>
      <Helmet><title>Dashboard — Home Interior</title></Helmet>
      <div className="max-w-7xl mx-auto py-28 px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-on-surface">Welcome, {user?.name}</h1>
            <p className="text-sm text-secondary mt-1">Manage and track your interior design estimates</p>
          </div>
          <Link to="/estimate" className="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:bg-primary shadow-lg shadow-blue-500/10">
            <span className="material-symbols-outlined text-lg">add</span> New Estimate
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Pipeline Value</p>
            <h3 className="text-3xl font-headline font-extrabold mt-1">{formatINR(totalValue)}</h3>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] opacity-10 pointer-events-none">payments</span>
          </div>
          <div className="bg-surface-container-highest p-6 rounded-3xl">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Estimates</p>
            <h3 className="text-3xl font-headline font-extrabold text-on-surface mt-1">{estimates.length}</h3>
          </div>
          <div className="bg-surface-container-highest p-6 rounded-3xl">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Account</p>
            <p className="text-sm font-medium text-on-surface mt-3">{user?.email}</p>
            <p className="text-xs text-secondary mt-1">{user?.city || 'No city set'}</p>
          </div>
        </div>

        {/* Estimates Table */}
        {loading ? (
          <div className="text-center py-20 text-secondary">Loading estimates...</div>
        ) : estimates.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-surface-container-high text-[100px]">calculate</span>
            <h3 className="font-headline text-2xl font-extrabold text-on-surface mt-4">No Estimates Yet</h3>
            <p className="text-sm text-secondary mt-3">Create your first interior design estimate to see it here.</p>
            <Link to="/estimate" className="bg-primary-container text-on-primary px-8 py-3.5 rounded-xl font-semibold text-sm mt-8 inline-block">
              Create Your First Estimate
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Project</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Date</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Total</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline">Status</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-outline text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {estimates.map(est => {
                    const sc = STATUS_COLORS[est.status] || STATUS_COLORS.draft;
                    return (
                      <>
                        <tr key={est.id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer" onClick={() => setExpandedId(expandedId === est.id ? null : est.id)}>
                          <td className="px-6 py-5">
                            <p className="font-bold text-on-surface text-sm">{est.property_type} — {est.tier}</p>
                            <p className="text-[11px] text-secondary">{est.style?.replace(/_/g, ' ') || 'No style'}</p>
                          </td>
                          <td className="px-6 py-5 text-sm text-on-surface-variant">{new Date(est.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-5 font-bold text-on-surface text-sm">{formatINR(Number(est.grand_total))}</td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${sc.bg} ${sc.text} text-[11px] font-bold`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {est.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(est.id); }}
                              className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                        {expandedId === est.id && (
                          <tr key={`${est.id}-detail`}>
                            <td colSpan={5} className="px-6 py-4 bg-surface-container-low/20">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                {est.rooms_breakdown?.map((room: any) => {
                                  const rt = ROOM_TYPES.find(r => r.value === room.room_type);
                                  return (
                                    <div key={room.room_type} className="flex items-center gap-3">
                                      <span className="material-symbols-outlined text-primary text-lg">{rt?.icon || 'room'}</span>
                                      <div>
                                        <p className="font-semibold text-on-surface">{rt?.label || room.room_type}</p>
                                        <p className="text-xs text-secondary">{room.count}x &middot; {formatINR(room.room_cost)}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex gap-6 mt-4 text-xs text-secondary">
                                <span>Material: {formatINR(Number(est.material_cost))}</span>
                                <span>Labour: {formatINR(Number(est.labour_cost))}</span>
                                <span>GST: {formatINR(Number(est.gst_amount))}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
