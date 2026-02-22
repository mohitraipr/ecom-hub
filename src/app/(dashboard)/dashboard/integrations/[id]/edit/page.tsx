'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/useIntegrations';

export default function EditIntegrationPage() {
  const router = useRouter();
  const params = useParams();
  const integrationId = params.id as string;
  const { integrations, isLoading: integrationsLoading } = useIntegrations();

  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState<'inventory' | 'order' | null>(null);

  const integration = integrations.find(i => i.id === integrationId);

  // Demo webhook URL (in production this would come from the backend)
  const webhookBaseUrl = `https://api.ecom-hub.in/webhook/${integrationId}`;

  const copyToClipboard = (text: string, type: 'inventory' | 'order') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async () => {
    if (!accessToken.trim()) {
      setError('Please enter your Access Token');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // In production, this would call the API to update the integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully!');
      setTimeout(() => {
        router.push('/dashboard/integrations');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (integrationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">Integration not found</h2>
        <Link href="/dashboard/integrations" className="text-[#ff6b35] hover:underline">
          Go back to integrations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Integrations
        </Link>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Edit EasyEcom Integration</h1>
        <p className="text-[#64748b] mt-1">Update your webhook settings and access token</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-[#00d9a5]/10 border border-[#00d9a5]/30 rounded-lg p-4 text-[#00a67c] mb-6">
          {success}
        </div>
      )}

      {/* Webhook URLs */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Webhook URLs</h2>
        <p className="text-[#64748b] text-sm mb-4">
          These URLs should be configured in your EasyEcom Webhook Settings
        </p>

        <div className="space-y-4">
          {/* Inventory Webhook */}
          <div className="bg-[#faf8f5] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[#ff6b35]/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#1a1a2e]">Inventory Webhook</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${webhookBaseUrl}/inventory`}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(`${webhookBaseUrl}/inventory`, 'inventory')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  copied === 'inventory'
                    ? 'bg-[#00d9a5] text-white'
                    : 'bg-[#ff6b35] text-white hover:bg-[#e55a2b]'
                }`}
              >
                {copied === 'inventory' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Order Webhook */}
          <div className="bg-[#faf8f5] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[#00d9a5]/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-[#00d9a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#1a1a2e]">Order Webhook</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${webhookBaseUrl}/order`}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(`${webhookBaseUrl}/order`, 'order')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  copied === 'order'
                    ? 'bg-[#00d9a5] text-white'
                    : 'bg-[#00d9a5] text-white hover:bg-[#00c896]'
                }`}
              >
                {copied === 'order' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Access Token */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Access Token</h2>
        <p className="text-[#64748b] text-sm mb-4">
          Update the Access Token you configured in EasyEcom&apos;s Webhook Settings
        </p>

        <div>
          <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
            New Access Token
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter new Access Token to update"
            className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
          />
          <p className="text-[#94a3b8] text-xs mt-2">
            Leave empty to keep the current Access Token
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/integrations"
          className="px-4 py-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
