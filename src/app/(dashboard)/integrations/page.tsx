'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const [integrations] = useState<{ platform: string; status: string }[]>([]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Integrations</h1>
          <p className="text-ink-400 mt-1">Connect your platforms to start receiving data</p>
        </div>
        <Link
          href="/dashboard/integrations/new"
          className="px-4 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Integration
        </Link>
      </div>

      {/* Integrations List */}
      {integrations.length === 0 ? (
        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No integrations yet</h2>
          <p className="text-ink-400 max-w-md mx-auto mb-6">
            Connect your EasyEcom account to start receiving real-time inventory data and automate your workflow.
          </p>
          <Link
            href="/dashboard/integrations/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Integration
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {integrations.map((integration, index) => (
            <div key={index} className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center">
                    <span className="text-saffron-500 font-bold">E</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.platform}</h3>
                    <p className="text-ink-400 text-sm">Connected</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  integration.status === 'active'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {integration.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Available Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6 hover:border-saffron-500/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">EasyEcom</h3>
                <p className="text-ink-400 text-sm">Inventory management & order tracking</p>
              </div>
              <svg className="w-5 h-5 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Uniware</h3>
                <p className="text-ink-400 text-sm">Coming soon</p>
              </div>
              <span className="px-2 py-1 bg-ink-800 text-ink-400 text-xs rounded-full">Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
