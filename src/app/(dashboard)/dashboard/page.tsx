'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useDashboardOverview } from '@/lib/hooks/useDashboard';
import { useWallet } from '@/lib/hooks/useWallet';
import { useIntegrations } from '@/lib/hooks/useIntegrations';
import Link from 'next/link';

const services = [
  {
    name: 'Out of Stock Monitor',
    description: 'Track inventory levels and get alerts for low stock SKUs',
    href: '/dashboard/out-of-stock',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    status: 'active'
  },
  {
    name: 'Orders Dashboard',
    description: 'View and manage all marketplace orders in one place',
    href: '/dashboard/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    status: 'active'
  },
  {
    name: 'Catalog AI',
    description: 'AI-powered product attribute extraction from images',
    href: '/dashboard/catalog',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    status: 'active',
    badge: 'New'
  },
  {
    name: 'QC Pass / RGP',
    description: 'Automate Myntra QC Pass and return processing',
    href: '/dashboard/qc-pass',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: 'active',
    badge: 'New'
  },
  {
    name: 'Ajio Mail',
    description: 'Automated email responses with CCTV video links',
    href: '/dashboard/ajio-mail',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    status: 'active'
  },
];

const comingSoon = [
  { name: 'Flipkart Ticket', description: 'Automated ticket management' },
  { name: 'Myntra MOP', description: 'MOP price management' },
  { name: 'Shopify Returns', description: 'Return processing automation' },
];

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with {tenant?.name || 'your store'} today
          </p>
        </div>
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>₹{wallet?.balance?.toFixed(0) || '0'}</span>
          <span className="text-emerald-200">Balance</span>
        </Link>
      </div>

      {/* Setup Alert */}
      {!hasActiveIntegration && !integrationsLoading && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Complete your setup</h3>
                <p className="text-sm text-gray-600">Connect EasyEcom to start receiving inventory data</p>
              </div>
            </div>
            <Link
              href="/dashboard/integrations/new?platform=easyecom"
              className="shrink-0 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Connect now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SKUs Tracked */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-7 w-12 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-semibold text-gray-900">
                {overview?.stats.totalSkus ?? '—'}
              </p>
              <p className="text-sm text-gray-500">SKUs tracked</p>
            </>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-7 w-12 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-semibold text-orange-600">
                {(overview?.stats.outOfStockSkus ?? 0) + (overview?.stats.lowStockSkus ?? 0)}
              </p>
              <p className="text-sm text-gray-500">Low stock alerts</p>
            </>
          )}
        </div>

        {/* Free Webhooks */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          {walletLoading ? (
            <div className="animate-pulse">
              <div className="h-7 w-12 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-semibold text-emerald-600">
                {wallet?.freeWebhooksRemaining ?? 50}
              </p>
              <p className="text-sm text-gray-500">Free webhooks</p>
            </>
          )}
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          {integrationsLoading ? (
            <div className="animate-pulse">
              <div className="h-7 w-12 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasActiveIntegration ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                <p className="text-lg font-medium text-gray-900">
                  {hasActiveIntegration ? 'Connected' : 'Not connected'}
                </p>
              </div>
              <p className="text-sm text-gray-500">EasyEcom</p>
            </>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Services</h2>
          <Link href="/dashboard/integrations" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Manage integrations
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="group bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors text-sm">
                      {service.name}
                    </h3>
                    {service.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coming Soon */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coming soon
          </h3>
          <div className="space-y-2">
            {comingSoon.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                  Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Pricing */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/integrations"
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Integrations</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Wallet</span>
              </Link>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Webhook</span>
                <span className="font-medium text-gray-900">₹0.50</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Catalog AI (3 images)</span>
                <span className="font-medium text-gray-900">₹1.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">QC Pass per ID</span>
                <span className="font-medium text-gray-900">₹0.50</span>
              </div>
              <div className="flex justify-between py-1 pt-2 border-t border-emerald-200">
                <span className="text-emerald-700 font-medium">Free webhooks</span>
                <span className="font-semibold text-emerald-700">50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
