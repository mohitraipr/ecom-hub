'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/useIntegrations';
import { config } from '@/lib/config';

type Step = 'platform' | 'credentials' | 'webhook-setup' | 'complete';

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'platform', title: 'Select Platform', description: 'Choose your e-commerce platform' },
  { id: 'credentials', title: 'Enter Credentials', description: 'Enter your EasyEcom tokens' },
  { id: 'webhook-setup', title: 'Webhook Setup', description: 'Configure webhooks in EasyEcom' },
  { id: 'complete', title: 'Complete', description: "You're all set!" },
];

export default function NewIntegrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { create } = useIntegrations();

  const [currentStep, setCurrentStep] = useState<Step>('platform');
  const [platform, setPlatform] = useState<'easyecom' | null>(
    searchParams.get('platform') === 'easyecom' ? 'easyecom' : null
  );
  const [accountToken, setAccountToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [webhookBaseUrl, setWebhookBaseUrl] = useState('');
  const [integrationId, setIntegrationId] = useState('');
  const [copied, setCopied] = useState<'inventory' | 'order' | null>(null);

  // If platform is pre-selected, skip to credentials step
  useEffect(() => {
    if (platform) {
      setCurrentStep('credentials');
    }
  }, []);

  const handleSelectPlatform = (p: 'easyecom') => {
    setPlatform(p);
    setCurrentStep('credentials');
  };

  const handleSubmitCredentials = async () => {
    if (!accountToken.trim()) {
      setError('Please enter your Account Token');
      return;
    }
    if (!accessToken.trim()) {
      setError('Please enter your Access Token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create the integration in the backend - it returns the webhook URL
      const integration = await create({
        platform: platform!,
        apiKey: accountToken.trim(), // Account Token (for API calls)
        accessToken: accessToken.trim(), // Access Token (for webhook validation)
      });

      // Extract the base webhook URL from the backend response
      // The backend returns: https://api.ecom-hub.in/webhook/{token}/inventory
      // We need the base: https://api.ecom-hub.in/webhook/{token}
      const webhookUrl = integration.webhookUrl || '';
      const baseUrl = webhookUrl.replace('/inventory', '');
      setWebhookBaseUrl(baseUrl);
      setIntegrationId(integration.id);
      setCurrentStep('webhook-setup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create integration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard/integrations');
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const copyToClipboard = (text: string, type: 'inventory' | 'order') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

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
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Add Integration</h1>
        <p className="text-[#64748b] mt-1">Connect your e-commerce platform</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStepIndex
                  ? 'bg-[#00d9a5] text-white'
                  : index === currentStepIndex
                  ? 'bg-[#ff6b35]/20 text-[#ff6b35] border-2 border-[#ff6b35]'
                  : 'bg-[#e5e7eb] text-[#94a3b8]'
              }`}
            >
              {index < currentStepIndex ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 md:w-12 h-0.5 mx-1 md:mx-2 ${
                  index < currentStepIndex ? 'bg-[#00d9a5]' : 'bg-[#e5e7eb]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Select Platform */}
        {currentStep === 'platform' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Select Platform</h2>
              <p className="text-[#64748b] text-sm mt-1">
                Choose the e-commerce platform you want to connect
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleSelectPlatform('easyecom')}
                className="flex items-center gap-4 p-4 bg-[#faf8f5] border border-[#e5e7eb] rounded-xl hover:border-[#ff6b35]/50 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">EasyEcom</h3>
                  <p className="text-[#64748b] text-sm">Inventory management & order tracking</p>
                </div>
                <svg className="w-5 h-5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Credentials */}
        {currentStep === 'credentials' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Enter Your Credentials</h2>
              <p className="text-[#64748b] text-sm mt-1">
                We need your EasyEcom credentials to set up the integration
              </p>
            </div>

            {/* Account Token Instructions */}
            <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#1a1a2e] mb-3">How to find your Account Token:</h3>
              <ol className="text-[#64748b] text-sm space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  <div>Log into <span className="text-[#1a1a2e] font-medium">EasyEcom Dashboard</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  <div>Click your <span className="text-[#1a1a2e] font-medium">profile icon</span> (top-right)</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                  <div>Copy your <span className="text-[#1a1a2e] font-medium">Account Token</span> from dropdown</div>
                </li>
              </ol>
            </div>

            {/* Account Token Input */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Account Token
              </label>
              <input
                type="text"
                value={accountToken}
                onChange={(e) => setAccountToken(e.target.value)}
                placeholder="Paste your Account Token here"
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
              />
            </div>

            {/* Access Token Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-3">About Access Token:</h3>
              <p className="text-blue-700 text-sm mb-2">
                The Access Token is used to verify webhook requests. Go to <span className="font-medium">Settings → Other Settings → Webhook Settings</span> in EasyEcom to find or set it.
              </p>
              <p className="text-blue-600 text-xs">
                If you haven&apos;t set one yet, create any secure token and save it in both places.
              </p>
            </div>

            {/* Access Token Input */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste your Access Token here"
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep('platform')}
                className="px-4 py-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitCredentials}
                disabled={isLoading || !accountToken || !accessToken}
                className="px-6 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Integration'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Webhook Setup */}
        {currentStep === 'webhook-setup' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Configure Webhooks in EasyEcom</h2>
              <p className="text-[#64748b] text-sm mt-1">
                Copy these URLs and paste them into your EasyEcom webhook settings
              </p>
            </div>

            {/* Success message */}
            <div className="bg-[#00d9a5]/10 border border-[#00d9a5]/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00d9a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[#00a67c] font-medium">Integration created successfully!</p>
              </div>
            </div>

            {/* Webhook URLs */}
            <div className="space-y-4">
              {/* Inventory Webhook */}
              <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#ff6b35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-[#1a1a2e]">Inventory Webhook URL</h3>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${webhookBaseUrl}/inventory`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(`${webhookBaseUrl}/inventory`, 'inventory')}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      copied === 'inventory'
                        ? 'bg-[#00d9a5] text-white'
                        : 'bg-[#ff6b35] text-white hover:bg-[#e55a2b]'
                    }`}
                  >
                    {copied === 'inventory' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[#94a3b8] text-xs mt-2">Use this for inventory level updates (stock changes)</p>
              </div>

              {/* Order Webhook */}
              <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00d9a5]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#00d9a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-[#1a1a2e]">Order Webhook URL</h3>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${webhookBaseUrl}/order`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(`${webhookBaseUrl}/order`, 'order')}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      copied === 'order'
                        ? 'bg-[#00d9a5] text-white'
                        : 'bg-[#00d9a5] text-white hover:bg-[#00c896]'
                    }`}
                  >
                    {copied === 'order' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[#94a3b8] text-xs mt-2">Use this for order updates (new orders, status changes)</p>
              </div>
            </div>

            {/* Configuration Instructions */}
            <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#1a1a2e] mb-3">Steps to configure in EasyEcom:</h3>
              <ol className="text-[#64748b] text-sm space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  <div>Go to <span className="text-[#ff6b35] font-medium">Settings → Other Settings → Webhook Settings</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  <div>Paste the <span className="text-[#1a1a2e] font-medium">Inventory Webhook URL</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                  <div>Add another webhook with the <span className="text-[#1a1a2e] font-medium">Order Webhook URL</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">4</span>
                  <div>Enable the events: <span className="text-[#1a1a2e] font-medium">Inventory Updates</span>, <span className="text-[#1a1a2e] font-medium">Order Created</span></div>
                </li>
              </ol>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                Go to Integrations
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete - Now handled by webhook-setup step */}
      </div>
    </div>
  );
}
