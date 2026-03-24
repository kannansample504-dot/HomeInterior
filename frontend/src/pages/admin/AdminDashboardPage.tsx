import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminApi } from '../../api/admin.api';
import { formatINR } from '../../utils/formatCurrency';
import type { AdminStats } from '../../types';

// Existing tab components
import ContentTab from './components/tabs/ContentTab';
import SEOTab from './components/tabs/SEOTab';
import PricingTab from './components/tabs/PricingTab';
import UsersTab from './components/tabs/UsersTab';
import RecordsTab from './components/tabs/RecordsTab';
import CompanyTab from './components/tabs/CompanyTab';
import StatsTab from './components/tabs/StatsTab';
import ProjectsTab from './components/tabs/ProjectsTab';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const ACTIVITY_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  estimate: { icon: 'receipt_long', bg: 'bg-primary/10', color: 'text-primary' },
  cms:      { icon: 'cached',       bg: 'bg-tertiary/10', color: 'text-tertiary' },
  user:     { icon: 'person_add',   bg: 'bg-primary/5', color: 'text-primary' },
  alert:    { icon: 'warning',      bg: 'bg-error-container', color: 'text-error' },
};

function OverviewDashboard({ stats, estimates, onSection }: { stats: AdminStats; estimates: any[]; onSection: (s: string) => void }) {
  const maxTrend = Math.max(...stats.monthly_trend.map(m => m.count), 1);

  // Build recent activity from last 4 estimates
  const recentActivity = estimates.slice(0, 4).map((e, i) => {
    const types = ['estimate', 'cms', 'user', 'alert'];
    const type = types[i % types.length];
    const messages: Record<string, string> = {
      estimate: `${e.user_name || 'Guest'} created a new ${e.property_type || 'home'} estimate.`,
      cms:      'CMS Update: new content published.',
      user:     `${e.user_name || 'User'} joined as a client.`,
      alert:    'Low estimate volume detected.',
    };
    return {
      type,
      message: messages[type],
      time: timeAgo(e.created_at),
    };
  });

  const STAT_CARDS = [
    {
      label: 'Total Users',
      value: stats.total_users.toLocaleString(),
      icon: 'group',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      badge: '+12%',
      badgeColor: 'text-primary bg-primary/10',
    },
    {
      label: 'Active Estimates',
      value: stats.total_estimates.toLocaleString(),
      icon: 'description',
      iconBg: 'bg-tertiary/10',
      iconColor: 'text-tertiary',
      badge: '+5.4%',
      badgeColor: 'text-primary bg-primary/10',
    },
    {
      label: 'New Leads Today',
      value: Math.max(1, Math.round(stats.total_estimates * 0.06)).toString(),
      icon: 'bolt',
      iconBg: 'bg-error-container',
      iconColor: 'text-error',
      badge: 'New',
      badgeColor: 'text-error bg-error-container',
    },
    {
      label: 'Monthly Revenue',
      value: formatINR(stats.total_revenue),
      icon: 'payments',
      iconBg: 'bg-primary/5',
      iconColor: 'text-primary',
      badge: '+24%',
      badgeColor: 'text-primary bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting row */}
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">{getGreeting()}, Admin</h1>
        <p className="text-sm text-secondary mt-1">Here's what is happening with your atelier today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map(c => (
          <div key={c.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-2xl ${c.iconColor}`}>{c.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.badgeColor}`}>{c.badge}</span>
            </div>
            <p className="text-sm text-secondary mt-4">{c.label}</p>
            <p className="font-headline text-2xl font-extrabold text-on-surface mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Estimate Trends + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Estimate Trends</h3>
              <p className="text-xs text-secondary mt-0.5">Volume analytics for the last {stats.monthly_trend.length} months</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2 text-sm text-secondary cursor-default">
              Last {stats.monthly_trend.length} Months
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>

          {stats.monthly_trend.length > 0 ? (
            <>
              <div className="flex items-end gap-3 h-52 pt-8 mt-4">
                {stats.monthly_trend.map((m, i) => {
                  const barH = maxTrend > 0 ? (m.count / maxTrend) * 100 : 0;
                  const isMax = m.count === maxTrend;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full group cursor-default">
                      <div className="relative w-full flex justify-center">
                        {isMax && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                            {m.count} est.
                          </div>
                        )}
                        <div
                          className={`w-full rounded-t-lg transition-all ${isMax ? 'bg-primary' : 'bg-surface-container-high'}`}
                          style={{ height: `${Math.max(barH, 4)}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-secondary mt-2 text-center leading-tight truncate w-full px-1">
                        {m.month.length > 7 ? m.month.slice(0, 7) : m.month}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-52 flex items-center justify-center text-secondary text-sm">No trend data yet</div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-headline text-lg font-bold text-on-surface">Recent Activity</h3>
            <button onClick={() => onSection('estimates')} className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((a, i) => {
                const meta = ACTIVITY_ICONS[a.type] || ACTIVITY_ICONS.estimate;
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-base ${meta.color}`}>{meta.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface leading-snug">{a.message}</p>
                      <p className="text-xs text-secondary mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-secondary text-center py-8">No recent activity</p>
          )}
          <div className="mt-5 pt-4 bg-surface-container-low -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Atelier Pro Tip</p>
            <p className="text-xs text-secondary mt-1">Use Estimate Management to follow up on saved estimates and convert them to projects.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
        <h3 className="font-headline text-lg font-bold text-on-surface mb-5">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/estimate" target="_blank"
            className="flex flex-col items-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary/5 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">add_circle</span>
            </div>
            <p className="text-sm font-semibold text-on-surface">New Estimate</p>
          </Link>
          <button onClick={() => onSection('estimates')}
            className="flex flex-col items-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary/5 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary text-2xl">description</span>
            </div>
            <p className="text-sm font-semibold text-on-surface">View Estimates</p>
          </button>
          <button onClick={() => onSection('analytics')}
            className="flex flex-col items-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary/5 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center group-hover:bg-error-container/80 transition-colors">
              <span className="material-symbols-outlined text-error text-2xl">bar_chart</span>
            </div>
            <p className="text-sm font-semibold text-on-surface">Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default function AdminDashboardPage() {
  const [section, setSection] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [estimates, setEstimates] = useState<any[]>([]);

  useEffect(() => {
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {});
    adminApi.getEstimates().then(r => {
      const data = r.data;
      setEstimates(Array.isArray(data) ? data : data.results || []);
    }).catch(() => {});
  }, []);

  const renderSection = () => {
    switch (section) {
      case 'dashboard':
        if (!stats) return <div className="text-center py-20 text-secondary">Loading dashboard...</div>;
        return <OverviewDashboard stats={stats} estimates={estimates} onSection={setSection} />;
      case 'cms':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">CMS Management</h2>
            <ContentTab />
          </div>
        );
      case 'seo':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">SEO Management</h2>
            <SEOTab />
          </div>
        );
      case 'projects':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Recent Projects</h2>
            <ProjectsTab />
          </div>
        );
      case 'company':
      case 'settings':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
              {section === 'settings' ? 'System Settings' : 'Company Settings'}
            </h2>
            <CompanyTab />
          </div>
        );
      case 'users':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">User Management</h2>
            <UsersTab />
          </div>
        );
      case 'estimates':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Estimate Management</h2>
            <RecordsTab />
          </div>
        );
      case 'pricing':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Pricing Engine</h2>
            <PricingTab />
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Reports & Analytics</h2>
            <StatsTab />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet><title>Admin — Home Interior</title></Helmet>
      <AdminLayout section={section} onSection={setSection} search={search} onSearch={setSearch}>
        {renderSection()}
      </AdminLayout>
    </>
  );
}
