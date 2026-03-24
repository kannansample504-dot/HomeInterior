import { useEffect, useState } from 'react';
import { adminApi } from '../../../../api/admin.api';
import { formatINR } from '../../../../utils/formatCurrency';
import type { AdminStats } from '../../../../types';

export default function StatsTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="text-center py-12 text-secondary">Loading stats...</div>;

  const cards = [
    { label: 'Total Estimates', value: stats.total_estimates, icon: 'receipt_long', color: 'bg-primary' },
    { label: 'Avg Estimate Value', value: formatINR(stats.avg_estimate_value), icon: 'trending_up', color: 'bg-tertiary' },
    { label: 'Active Users', value: stats.active_users, icon: 'group', color: 'bg-secondary' },
    { label: 'Total Revenue', value: formatINR(stats.total_revenue), icon: 'payments', color: 'bg-inverse-surface' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(c => (
          <div key={c.label} className={`${c.color} p-6 rounded-3xl text-white relative overflow-hidden`}>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{c.label}</p>
            <h3 className="text-2xl font-headline font-extrabold mt-2">{c.value}</h3>
            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-[60px] opacity-10 pointer-events-none">{c.icon}</span>
          </div>
        ))}
      </div>

      {stats.monthly_trend.length > 0 && (
        <div className="bg-surface-container-lowest p-6 rounded-3xl">
          <h3 className="font-headline text-lg font-bold mb-4">Monthly Trend</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-outline uppercase">
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-left py-3 px-4">Estimates</th>
                  <th className="text-left py-3 px-4">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthly_trend.map(m => (
                  <tr key={m.month} className="border-t border-surface-container-low">
                    <td className="py-3 px-4 font-medium">{m.month}</td>
                    <td className="py-3 px-4">{m.count}</td>
                    <td className="py-3 px-4 font-bold text-primary">{formatINR(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
