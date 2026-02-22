'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useDashboardOverview } from '@/lib/hooks/useDashboard';
import { useWallet } from '@/lib/hooks/useWallet';
import { useIntegrations } from '@/lib/hooks/useIntegrations';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, tenant } = useAuth();
  const { overview, isLoading: overviewLoading } = useDashboardOverview();
  const { wallet, isLoading: walletLoading } = useWallet();
  const { integrations, isLoading: integrationsLoading } = useIntegrations();

  const hasActiveIntegration = integrations.some(i => i.status === 'active');
  const isLoading = overviewLoading || walletLoading || integrationsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            {tenant?.name || 'Your Store'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/wallet"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#faf8f5] transition-colors"
          >
            <span className="text-[#00d9a5] font-semibold">₹{wallet?.balance?.toFixed(0) || '0'}</span>
            <span className="text-[#64748b] text-sm">Balance</span>
          </Link>
        </div>
      </div>

      {/* Setup Alert - Only show if no active integration */}
      {!hasActiveIntegration && !integrationsLoading && (
        <div className="bg-gradient-to-r from-[#ff6b35]/10 to-[#00d9a5]/10 border border-[#ff6b35]/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ff6b35]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Complete Your Setup</h3>
                <p className="text-[#64748b] text-sm">Connect EasyEcom to start receiving inventory data</p>
              </div>
            </div>
            <Link
              href="/dashboard/integrations/new?platform=easyecom"
              className="px-4 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
            >
              Connect Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SKUs Tracked */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-[#e5e7eb] rounded mb-2"></div>
              <div className="h-4 w-24 bg-[#e5e7eb] rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-[#1a1a2e]">
                {overview?.stats.totalSkus ?? '—'}
              </p>
              <p className="text-[#64748b] text-sm mt-1">SKUs Tracked</p>
            </>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-[#e5e7eb] rounded mb-2"></div>
              <div className="h-4 w-24 bg-[#e5e7eb] rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-[#ff6b35]">
                {(overview?.stats.outOfStockSkus ?? 0) + (overview?.stats.lowStockSkus ?? 0)}
              </p>
              <p className="text-[#64748b] text-sm mt-1">Low Stock Alerts</p>
            </>
          )}
        </div>

        {/* Free Webhooks */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          {walletLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-[#e5e7eb] rounded mb-2"></div>
              <div className="h-4 w-24 bg-[#e5e7eb] rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-[#00d9a5]">
                {wallet?.freeWebhooksRemaining ?? 50}
              </p>
              <p className="text-[#64748b] text-sm mt-1">Free Webhooks</p>
            </>
          )}
        </div>

        {/* Integration Status */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          {integrationsLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-[#e5e7eb] rounded mb-2"></div>
              <div className="h-4 w-24 bg-[#e5e7eb] rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hasActiveIntegration ? 'bg-[#00d9a5]' : 'bg-[#94a3b8]'}`}></div>
                <p className="text-lg font-bold text-[#1a1a2e]">
                  {hasActiveIntegration ? 'Connected' : 'Not Connected'}
                </p>
              </div>
              <p className="text-[#64748b] text-sm mt-1">EasyEcom</p>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[#1a1a2e]">Services</h2>

          {/* Out of Stock */}
          <Link
            href="/dashboard/out-of-stock"
            className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#ff6b35]/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1a1a2e]">Out of Stock Monitor</h3>
                <p className="text-[#64748b] text-sm">Track inventory levels and get alerts for low stock SKUs</p>
              </div>
              <svg className="w-5 h-5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Ajio Mail - Coming Soon */}
          <Link
            href="/dashboard/ajio-mail"
            className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#00d9a5]/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#00d9a5]/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#00d9a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">Ajio Mail Automation</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-[#00d9a5]/10 text-[#00a67c] rounded-full">Coming Soon</span>
                </div>
                <p className="text-[#64748b] text-sm">Automate bulk email responses for return requests</p>
              </div>
              <svg className="w-5 h-5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1a1a2e]">Quick Actions</h2>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 space-y-3">
            <Link
              href="/dashboard/integrations"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#faf8f5] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#1a1a2e]">Integrations</p>
                <p className="text-[#94a3b8] text-xs">Manage connections</p>
              </div>
            </Link>

            <Link
              href="/dashboard/wallet"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#faf8f5] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00d9a5]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00d9a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#1a1a2e]">Wallet</p>
                <p className="text-[#94a3b8] text-xs">View balance & recharge</p>
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#faf8f5] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#64748b]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#1a1a2e]">Settings</p>
                <p className="text-[#94a3b8] text-xs">Account preferences</p>
              </div>
            </Link>
          </div>

          {/* Pricing Info */}
          <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-xl p-5">
            <h3 className="font-medium text-[#1a1a2e] mb-3">Pricing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Out of Stock webhook</span>
                <span className="font-medium text-[#1a1a2e]">₹0.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Free webhooks</span>
                <span className="font-medium text-[#00d9a5]">50 included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
