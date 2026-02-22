'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/useIntegrations';

type Step = 'platform' | 'account-token' | 'webhook-setup' | 'access-token' | 'complete';

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'platform', title: 'Select Platform', description: 'Choose your e-commerce platform' },
  { id: 'account-token', title: 'Account Token', description: 'Enter your EasyEcom account token' },
  { id: 'webhook-setup', title: 'Webhook Setup', description: 'Configure webhooks in EasyEcom' },
  { id: 'access-token', title: 'Access Token', description: 'Enter the access token you set' },
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
  const [copied, setCopied] = useState<'inventory' | 'order' | null>(null);

  // Generate webhook URL when account token is submitted
  const generateWebhookUrl = () => {
    // In production, this would come from the backend after creating the integration
    // For now, generate a demo URL based on a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `https://api.ecom-hub.in/webhook/${token}`;
  };

  // If platform is pre-selected, skip to account-token step
  useEffect(() => {
    if (platform) {
      setCurrentStep('account-token');
    }
  }, []);

  const handleSelectPlatform = (p: 'easyecom') => {
    setPlatform(p);
    setCurrentStep('account-token');
  };

  const handleSubmitAccountToken = async () => {
    if (!accountToken.trim()) {
      setError('Please enter your Account Token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate webhook URL for this seller
      const url = generateWebhookUrl();
      setWebhookBaseUrl(url);
      setCurrentStep('webhook-setup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate webhook URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhookSetupComplete = () => {
    setCurrentStep('access-token');
  };

  const handleSubmitAccessToken = async () => {
    if (!accessToken.trim()) {
      setError('Please enter the Access Token you configured in EasyEcom');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create the integration with all credentials
      await create({
        platform: platform!,
        apiKey: accountToken.trim(), // Account Token (for API calls)
        accessToken: accessToken.trim(), // Access Token (for webhook validation)
      });
      setCurrentStep('complete');
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

        {/* Step 2: Account Token */}
        {currentStep === 'account-token' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Enter Account Token</h2>
              <p className="text-[#64748b] text-sm mt-1">
                Your Account Token is used to identify your EasyEcom account
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#1a1a2e] mb-3">How to find your Account Token:</h3>
              <ol className="text-[#64748b] text-sm space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  <div>
                    Log into your <span className="text-[#1a1a2e] font-medium">EasyEcom Dashboard</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  <div>
                    Click your <span className="text-[#1a1a2e] font-medium">profile icon</span> in the top-right corner
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                  <div>
                    Your <span className="text-[#1a1a2e] font-medium">Account Token</span> is displayed in the dropdown menu
                  </div>
                </li>
              </ol>
            </div>

            {/* Form */}
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep('platform')}
                className="px-4 py-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitAccountToken}
                disabled={isLoading || !accountToken}
                className="px-6 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Webhook URLs'
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
              <ol className="text-[#64748b] text-sm space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  <div>
                    Go to <span className="text-[#ff6b35] font-medium">Settings → Other Settings → Webhook Settings</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  <div>
                    Paste the <span className="text-[#1a1a2e] font-medium">Inventory Webhook URL</span> for inventory events
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                  <div>
                    Add another webhook with the <span className="text-[#1a1a2e] font-medium">Order Webhook URL</span> for order events
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">4</span>
                  <div>
                    <span className="text-[#1a1a2e] font-medium">Set your Access Token</span> in EasyEcom&apos;s webhook settings (you choose this yourself)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">5</span>
                  <div>
                    Enable the events you want: <span className="text-[#1a1a2e] font-medium">Inventory Updates</span>, <span className="text-[#1a1a2e] font-medium">Order Created</span>, etc.
                  </div>
                </li>
              </ol>
            </div>

            {/* Important Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="text-blue-700 font-medium">Remember your Access Token!</p>
                  <p className="text-blue-600 mt-1">
                    You&apos;ll need to enter the Access Token you set in the next step. We use it to verify that webhook requests are genuinely from EasyEcom.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep('account-token')}
                className="px-4 py-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleWebhookSetupComplete}
                className="px-6 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                I&apos;ve configured the webhooks
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Access Token */}
        {currentStep === 'access-token' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1a1a2e]">Enter Your Access Token</h2>
              <p className="text-[#64748b] text-sm mt-1">
                Enter the Access Token you configured in EasyEcom&apos;s Webhook Settings
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#1a1a2e] mb-3">Where to find your Access Token:</h3>
              <ol className="text-[#64748b] text-sm space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  <div>
                    Go to <span className="text-[#ff6b35] font-medium">Settings → Other Settings → Webhook Settings</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  <div>
                    Copy the <span className="text-[#1a1a2e] font-medium">Access Token</span> you set when configuring the webhook
                  </div>
                </li>
              </ol>
            </div>

            {/* Form */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste the Access Token you set in EasyEcom"
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-lg text-[#1a1a2e] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35]"
              />
              <p className="text-[#94a3b8] text-xs mt-2">
                This is the token EasyEcom sends with each webhook request. We use it to verify authenticity.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep('webhook-setup')}
                className="px-4 py-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitAccessToken}
                disabled={isLoading || !accessToken}
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
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#00d9a5]/20 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-[#00d9a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">You&apos;re All Set!</h2>
              <p className="text-[#64748b]">
                Your EasyEcom integration is now active. You&apos;ll start receiving real-time updates.
              </p>
            </div>

            <div className="bg-[#faf8f5] border border-[#e5e7eb] rounded-lg p-4 text-left">
              <h3 className="text-sm font-medium text-[#1a1a2e] mb-3">What happens next:</h3>
              <ul className="text-[#64748b] text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#00d9a5] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><span className="text-[#1a1a2e] font-medium">Inventory data</span> will sync via <code className="text-[#ff6b35] bg-[#ff6b35]/10 px-1 rounded">/inventory</code> webhook</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#00d9a5] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><span className="text-[#1a1a2e] font-medium">Order updates</span> will sync via <code className="text-[#00d9a5] bg-[#00d9a5]/10 px-1 rounded">/order</code> webhook</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#00d9a5] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Low stock alerts will be enabled
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#00d9a5] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  First 50 webhooks are free (then ₹0.50 per webhook)
                </li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              className="px-8 py-3 bg-[#ff6b35] text-white font-semibold rounded-lg hover:bg-[#e55a2b] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
