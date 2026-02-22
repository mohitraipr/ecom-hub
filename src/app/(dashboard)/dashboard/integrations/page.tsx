'use client';

import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/useIntegrations';
import { getStatusColor, getPlatformInfo, Integration } from '@/lib/api/integrations';

export default function IntegrationsPage() {
  const { integrations, isLoading, error, pause, resume, remove } = useIntegrations();

  // Check if a platform is already integrated
  const hasEasyEcom = integrations.some(i => i.platform === 'easyecom');
  const easyEcomIntegration = integrations.find(i => i.platform === 'easyecom');

  const handlePauseResume = async (integration: Integration) => {
    if (integration.status === 'paused') {
      await resume(integration.id);
    } else if (integration.status === 'active') {
      await pause(integration.id);
    }
  };

  const handleDelete = async (integration: Integration) => {
    if (confirm(`Are you sure you want to remove ${getPlatformInfo(integration.platform).name}? This action cannot be undone.`)) {
      await remove(integration.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Integrations</h1>
        <p className="text-[#64748b] mt-1">Manage your platform connections</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Current Integration */}
      {easyEcomIntegration ? (
        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">EasyEcom</h2>
                <p className="text-blue-100 text-sm">Inventory & Order Management</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {(() => {
                  const statusColors = getStatusColor(easyEcomIntegration.status);
                  return (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                      {easyEcomIntegration.status.charAt(0).toUpperCase() + easyEcomIntegration.status.slice(1)}
                    </span>
                  );
                })()}
                <span className="text-[#64748b] text-sm">
                  {easyEcomIntegration.testMode ? 'Test Mode' : 'Live Mode'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {(easyEcomIntegration.status === 'active' || easyEcomIntegration.status === 'paused') && (
                  <button
                    onClick={() => handlePauseResume(easyEcomIntegration)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      easyEcomIntegration.status === 'paused'
                        ? 'bg-[#00d9a5] text-white hover:bg-[#00c896]'
                        : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {easyEcomIntegration.status === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                )}

                <Link
                  href={`/dashboard/integrations/${easyEcomIntegration.id}/edit`}
                  className="px-4 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
                >
                  Edit Settings
                </Link>
              </div>
            </div>

            {/* Integration Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#faf8f5] rounded-lg p-4">
                <p className="text-[#64748b] text-sm">Last Validated</p>
                <p className="text-[#1a1a2e] font-medium">
                  {easyEcomIntegration.lastValidatedAt
                    ? new Date(easyEcomIntegration.lastValidatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Not validated yet'}
                </p>
              </div>
              <div className="bg-[#faf8f5] rounded-lg p-4">
                <p className="text-[#64748b] text-sm">Webhooks Configured</p>
                <p className="text-[#1a1a2e] font-medium">Inventory, Orders</p>
              </div>
              <div className="bg-[#faf8f5] rounded-lg p-4">
                <p className="text-[#64748b] text-sm">Created</p>
                <p className="text-[#1a1a2e] font-medium">
                  {new Date(easyEcomIntegration.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Error Display */}
            {easyEcomIntegration.lastError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-red-700 font-medium">Last Error</p>
                    <p className="text-red-600 text-sm">{easyEcomIntegration.lastError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="border-t border-[#e5e7eb] pt-6">
              <button
                onClick={() => handleDelete(easyEcomIntegration)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Integration
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* No Integration - Show Setup Card */
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Connect EasyEcom</h2>
          <p className="text-[#64748b] max-w-md mx-auto mb-8">
            Link your EasyEcom account to receive real-time inventory updates and automate your out-of-stock management.
          </p>

          <Link
            href="/dashboard/integrations/new?platform=easyecom"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-semibold rounded-lg hover:bg-[#e55a2b] transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Set Up EasyEcom
          </Link>
        </div>
      )}

      {/* Other Platforms - Coming Soon */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">More Platforms</h2>
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 opacity-60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Uniware</h3>
              <p className="text-[#64748b] text-sm">Warehouse management integration</p>
            </div>
            <span className="px-3 py-1 bg-[#f1f5f9] text-[#64748b] text-sm rounded-full font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
