'use client';

import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/useIntegrations';
import { getStatusColor, getPlatformInfo, Integration } from '@/lib/api/integrations';

export default function IntegrationsPage() {
  const { integrations, isLoading, error, pause, resume, remove } = useIntegrations();

  const handlePauseResume = async (integration: Integration) => {
    if (integration.status === 'paused') {
      await resume(integration.id);
    } else if (integration.status === 'active') {
      await pause(integration.id);
    }
  };

  const handleDelete = async (integration: Integration) => {
    if (confirm(`Are you sure you want to remove ${getPlatformInfo(integration.platform).name}?`)) {
      await remove(integration.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Integrations</h1>
          <p className="text-[#64748b] mt-1">Connect your platforms to start receiving data</p>
        </div>
        <Link
          href="/dashboard/integrations/new"
          className="px-4 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Integration
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Integrations List */}
      {integrations.length === 0 ? (
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">No integrations yet</h2>
          <p className="text-[#64748b] max-w-md mx-auto mb-6">
            Connect your EasyEcom account to start receiving real-time inventory data and automate your workflow.
          </p>
          <Link
            href="/dashboard/integrations/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Integration
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {integrations.map((integration) => {
            const platformInfo = getPlatformInfo(integration.platform);
            const statusColors = getStatusColor(integration.status);

            return (
              <div
                key={integration.id}
                className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">
                        {platformInfo.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a1a2e]">{platformInfo.name}</h3>
                      <p className="text-[#64748b] text-sm">
                        {integration.testMode ? 'Test mode' : 'Live'} •
                        {integration.lastValidatedAt
                          ? ` Last validated ${new Date(integration.lastValidatedAt).toLocaleDateString()}`
                          : ' Not validated yet'}
                      </p>
                      {integration.lastError && (
                        <p className="text-red-600 text-sm mt-1">{integration.lastError}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}
                    >
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </span>

                    <div className="flex items-center gap-1">
                      {(integration.status === 'active' || integration.status === 'paused') && (
                        <button
                          onClick={() => handlePauseResume(integration)}
                          className="p-2 text-[#64748b] hover:text-[#1a1a2e] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                          title={integration.status === 'paused' ? 'Resume' : 'Pause'}
                        >
                          {integration.status === 'paused' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      )}

                      <Link
                        href={`/dashboard/integrations/${integration.id}`}
                        className="p-2 text-[#64748b] hover:text-[#1a1a2e] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                        title="Settings"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => handleDelete(integration)}
                        className="p-2 text-[#64748b] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Available Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/integrations/new?platform=easyecom"
            className="bg-white border border-[#e5e7eb] rounded-xl p-6 hover:border-saffron-300 hover:shadow-md transition-all cursor-pointer block shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1a1a2e]">EasyEcom</h3>
                <p className="text-[#64748b] text-sm">Inventory management & order tracking</p>
              </div>
              <svg className="w-5 h-5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 opacity-60 cursor-not-allowed shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1a1a2e]">Uniware</h3>
                <p className="text-[#64748b] text-sm">Coming soon</p>
              </div>
              <span className="px-2 py-1 bg-[#f1f5f9] text-[#64748b] text-xs rounded-full">Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
