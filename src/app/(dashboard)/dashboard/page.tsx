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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    status: 'active'
  },
  {
    name: 'Orders Dashboard',
    description: 'View and manage all marketplace orders in one place',
    href: '/dashboard/orders',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    status: 'active'
  },
  {
    name: 'Catalog AI',
    description: 'AI-powered product attribute extraction from images',
    href: '/dashboard/catalog',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    status: 'active',
    badge: 'New'
  },
  {
    name: 'QC Pass / RGP',
    description: 'Automate Myntra QC Pass and return processing',
    href: '/dashboard/qc-pass',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    status: 'active',
    badge: 'New'
  },
  {
    name: 'Ajio Mail',
    description: 'Automated email responses with CCTV video links',
    href: '/dashboard/ajio-mail',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with {tenant?.name || 'your store'} today
          </p>
        </div>
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>₹{wallet?.balance?.toFixed(0) || '0'}</span>
          <span className="text-white/70 text-sm">Balance</span>
        </Link>
      </div>

      {/* Setup Alert */}
      {!hasActiveIntegration && !integrationsLoading && (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Complete Your Setup</h3>
                <p className="text-white/80">Connect EasyEcom to start receiving inventory data and tracking orders</p>
              </div>
            </div>
            <Link
              href="/dashboard/integrations/new?platform=easyecom"
              className="shrink-0 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Connect Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SKUs Tracked */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {overview?.stats.totalSkus ?? '—'}
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                SKUs Tracked
              </p>
            </>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-orange-500">
                {(overview?.stats.outOfStockSkus ?? 0) + (overview?.stats.lowStockSkus ?? 0)}
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Low Stock Alerts
              </p>
            </>
          )}
        </div>

        {/* Free Webhooks */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          {walletLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-green-500">
                {wallet?.freeWebhooksRemaining ?? 50}
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Free Webhooks
              </p>
            </>
          )}
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          {integrationsLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-100 rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hasActiveIntegration ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {hasActiveIntegration && (
                    <span className="absolute w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></span>
                  )}
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {hasActiveIntegration ? 'Connected' : 'Not Connected'}
                </p>
              </div>
              <p className="text-gray-500 text-sm mt-1">EasyEcom Integration</p>
            </>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Services</h2>
          <Link href="/dashboard/integrations" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Manage integrations
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="group relative bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all"
            >
              {service.badge && (
                <div className="absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                  {service.badge}
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{service.description}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${service.textColor} ${service.bgColor} px-2 py-1 rounded-full`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  Active
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming Soon + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coming Soon */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coming Soon
          </h3>
          <div className="space-y-3">
            {comingSoon.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                  Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Pricing */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/integrations"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Integrations</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Wallet</span>
              </Link>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="font-bold text-gray-900 mb-3">Pricing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-purple-100">
                <span className="text-gray-600">Out of Stock / Order webhook</span>
                <span className="font-semibold text-gray-900">₹0.50</span>
              </div>
              <div className="flex justify-between py-2 border-b border-purple-100">
                <span className="text-gray-600">Catalog AI (3 images)</span>
                <span className="font-semibold text-gray-900">₹1.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-purple-100">
                <span className="text-gray-600">QC Pass per tracking ID</span>
                <span className="font-semibold text-gray-900">₹0.50</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-green-600 font-medium">Free webhooks included</span>
                <span className="font-bold text-green-600">50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
