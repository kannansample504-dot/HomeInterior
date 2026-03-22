import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import StatsTab from './components/tabs/StatsTab';
import ContentTab from './components/tabs/ContentTab';
import PricingTab from './components/tabs/PricingTab';
import UsersTab from './components/tabs/UsersTab';
import RecordsTab from './components/tabs/RecordsTab';
import CompanyTab from './components/tabs/CompanyTab';

const TABS = [
  { key: 'stats', label: 'Stats', icon: 'bar_chart' },
  { key: 'content', label: 'Page Content', icon: 'edit_note' },
  { key: 'pricing', label: 'Pricing', icon: 'payments' },
  { key: 'users', label: 'Users', icon: 'group' },
  { key: 'records', label: 'Estimates', icon: 'receipt_long' },
  { key: 'company', label: 'Company', icon: 'business' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <>
      <Helmet><title>Admin Dashboard — Home Interior</title></Helmet>
      <div className="max-w-7xl mx-auto py-28 px-4 sm:px-8">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2">Admin Dashboard</h1>
        <p className="text-sm text-secondary mb-8">Manage your platform content, pricing, users, and estimates</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'pricing' && <PricingTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'records' && <RecordsTab />}
        {activeTab === 'company' && <CompanyTab />}
      </div>
    </>
  );
}
