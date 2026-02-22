'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPlatformStats, getRevenue, PlatformStats, RevenueData } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, revenueData] = await Promise.all([
          getPlatformStats(),
          getRevenue(30),
        ]);
        setStats(statsData);
        setRevenue(revenueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Admin</h1>
        <p className="text-ink-400 mt-1">Overview of ecom-hub platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tenants */}
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.tenants.total ?? 0}</p>
              <p className="text-sm text-ink-400">Total Tenants</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="text-emerald-400">{stats?.tenants.active} active</span>
            <span className="text-amber-400">{stats?.tenants.pending} pending</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Rs{stats?.revenue.total.toFixed(0) ?? 0}</p>
              <p className="text-sm text-ink-400">Total Revenue</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="text-ink-400">30d: Rs{stats?.revenue.last30Days.toFixed(0)}</span>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.webhooks.total ?? 0}</p>
              <p className="text-sm text-ink-400">Total Webhooks</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="text-ink-400">Today: {stats?.webhooks.today}</span>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.integrations.total ?? 0}</p>
              <p className="text-sm text-ink-400">Integrations</p>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-emerald-400">{stats?.integrations.active} active</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/tenants"
          className="bg-ink-900/50 border border-ink-800 rounded-xl p-6 hover:border-saffron-500/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Manage Tenants</h3>
              <p className="text-ink-400 text-sm mt-1">View and manage all sellers</p>
            </div>
            <svg className="w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/admin/revenue"
          className="bg-ink-900/50 border border-ink-800 rounded-xl p-6 hover:border-saffron-500/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
              <p className="text-ink-400 text-sm mt-1">Track platform revenue</p>
            </div>
            <svg className="w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-ink-900/50 border border-ink-800 rounded-xl p-6 hover:border-saffron-500/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Platform Settings</h3>
              <p className="text-ink-400 text-sm mt-1">Configure platform options</p>
            </div>
            <svg className="w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Top Tenants */}
      {revenue && revenue.topTenants.length > 0 && (
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Tenants by Revenue</h2>
          <div className="space-y-3">
            {revenue.topTenants.slice(0, 5).map((tenant, index) => (
              <div
                key={tenant.id}
                className="flex items-center justify-between py-3 border-b border-ink-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-saffron-500/20 flex items-center justify-center text-saffron-500 font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tenant.name}</p>
                    <p className="text-ink-500 text-sm">{tenant.transactionCount} transactions</p>
                  </div>
                </div>
                <p className="text-white font-semibold">Rs{tenant.totalSpend.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
