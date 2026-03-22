import { useEffect, useState } from 'react';
import { adminApi } from '../../../../api/admin.api';
import { formatINR } from '../../../../utils/formatCurrency';
import { STATUS_COLORS } from '../../../../utils/constants';

export default function RecordsTab() {
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getEstimates()
      .then(r => setEstimates(Array.isArray(r.data) ? r.data : r.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Property', 'Tier', 'Grand Total', 'Status', 'Date'];
    const rows = estimates.map(e => [
      e.id, e.user_name, e.user_email || e.guest_email, e.property_type, e.tier,
      e.grand_total, e.status, new Date(e.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estimates_export.csv';
    a.click();
  };

  if (loading) return <div className="text-center py-12 text-secondary">Loading estimates...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-secondary">{estimates.length} total estimates</p>
        <button onClick={exportCSV}
          className="bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:bg-surface-dim">
          <span className="material-symbols-outlined text-lg">download</span> Export CSV
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-bold uppercase text-outline">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Property</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Tier</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {estimates.map(e => {
                const sc = STATUS_COLORS[e.status] || STATUS_COLORS.draft;
                return (
                  <tr key={e.id} className="hover:bg-surface-container-low/30">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-on-surface">{e.user_name || 'Guest'}</p>
                      <p className="text-xs text-secondary">{e.user_email || e.guest_email}</p>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant capitalize">{e.property_type}</td>
                    <td className="px-6 py-4 text-on-surface-variant capitalize">{e.tier}</td>
                    <td className="px-6 py-4 font-bold text-on-surface">{formatINR(Number(e.grand_total))}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${sc.bg} ${sc.text} text-[11px] font-bold`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{new Date(e.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
