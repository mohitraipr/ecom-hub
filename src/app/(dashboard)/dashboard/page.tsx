'use client';

import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

const services = [
  {
    name: 'Out of Stock',
    description: 'Monitor inventory levels and get alerts for low stock SKUs',
    href: '/dashboard/out-of-stock',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    status: 'active',
    color: 'saffron',
  },
  {
    name: 'Ajio Mail',
    description: 'Automate bulk email responses for Ajio return requests',
    href: '/dashboard/ajio-mail',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    status: 'coming_soon',
    color: 'teal',
  },
];

export default function DashboardPage() {
  const { user, tenant } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-ink-400 mt-1">
          Here&apos;s what&apos;s happening with {tenant?.name}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">--</p>
              <p className="text-sm text-ink-400">Total SKUs Tracked</p>
            </div>
          </div>
        </div>

        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">--</p>
              <p className="text-sm text-ink-400">Low Stock Alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">50</p>
              <p className="text-sm text-ink-400">Free Webhooks Left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className={`group bg-ink-900/50 border border-ink-800 rounded-xl p-6 hover:border-${service.color}-500/50 transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-${service.color}-500/10 flex items-center justify-center text-${service.color}-500`}>
                  {service.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-saffron-500 transition-colors">
                      {service.name}
                    </h3>
                    {service.status === 'coming_soon' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-ink-800 text-ink-400 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-ink-400 text-sm mt-1">{service.description}</p>
                </div>
                <svg className="w-5 h-5 text-ink-600 group-hover:text-saffron-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Setup CTA */}
      <div className="bg-gradient-to-r from-saffron-500/10 to-teal-500/10 border border-saffron-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Complete Your Setup</h3>
            <p className="text-ink-400 text-sm mt-1">
              Connect your EasyEcom account to start receiving real-time inventory data
            </p>
          </div>
          <Link
            href="/dashboard/integrations"
            className="px-4 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors"
          >
            Set Up Integration
          </Link>
        </div>
      </div>
    </div>
  );
}
