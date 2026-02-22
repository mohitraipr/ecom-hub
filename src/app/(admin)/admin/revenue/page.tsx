'use client';

import { useState, useEffect, useMemo } from 'react';
import { getRevenue, RevenueData } from '@/lib/api/admin';

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [period, setPeriod] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Calculate totals from daily data
  const totals = useMemo(() => {
    if (!revenue?.daily) return { totalRevenue: 0, totalTransactions: 0 };
    return revenue.daily.reduce(
      (acc, day) => ({
        totalRevenue: acc.totalRevenue + day.revenue,
        totalTransactions: acc.totalTransactions + day.transactions,
      }),
      { totalRevenue: 0, totalTransactions: 0 }
    );
  }, [revenue]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getRevenue(period);
        setRevenue(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [period]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Revenue Analytics</h1>
          <p className="text-ink-400 mt-1">Track platform revenue and growth</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">₹{totals.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-ink-400">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totals.totalTransactions}</p>
              <p className="text-sm text-ink-400">Transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{revenue?.topTenants.length ?? 0}</p>
              <p className="text-sm text-ink-400">Active Tenants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
        <div className="h-64 flex items-center justify-center border border-dashed border-ink-700 rounded-lg">
          <div className="text-center">
            <svg className="w-12 h-12 text-ink-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-ink-500">Revenue chart coming soon</p>
            <p className="text-ink-600 text-sm">Historical data visualization will appear here</p>
          </div>
        </div>
      </div>

      {/* Top Tenants */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Top Revenue Contributors</h2>
        {revenue && revenue.topTenants.length > 0 ? (
          <div className="space-y-3">
            {revenue.topTenants.map((tenant, index) => (
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
                <div className="text-right">
                  <p className="text-white font-semibold">₹{tenant.totalSpend.toFixed(0)}</p>
                  <p className="text-ink-500 text-sm">
                    {((tenant.totalSpend / (totals.totalRevenue || 1)) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-ink-500">No revenue data yet</p>
            <p className="text-ink-600 text-sm">Revenue will appear once tenants start using the platform</p>
          </div>
        )}
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Revenue by Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-ink-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Out of Stock</p>
                <p className="text-ink-500 text-sm">Webhook processing</p>
              </div>
            </div>
            <p className="text-white font-semibold">₹{totals.totalRevenue.toFixed(0)}</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-ink-800/50 rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Ajio Mail</p>
                <p className="text-ink-500 text-sm">Coming soon</p>
              </div>
            </div>
            <p className="text-ink-500 font-semibold">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}
