'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useIntegrations } from '@/lib/hooks/useIntegrations';
import { getWebhookUrl } from '@/lib/api/integrations';

type Step = 'platform' | 'credentials' | 'test' | 'webhook' | 'complete';

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'platform', title: 'Select Platform', description: 'Choose your e-commerce platform' },
  { id: 'credentials', title: 'Enter Credentials', description: 'Add your API key and access token' },
  { id: 'test', title: 'Test Connection', description: 'Verify your credentials work' },
  { id: 'webhook', title: 'Configure Webhook', description: 'Set up real-time data sync' },
  { id: 'complete', title: 'Complete', description: 'You\'re all set!' },
];

export default function NewIntegrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { create, test: testConnection } = useIntegrations();

  const [currentStep, setCurrentStep] = useState<Step>('platform');
  const [platform, setPlatform] = useState<'easyecom' | null>(
    searchParams.get('platform') === 'easyecom' ? 'easyecom' : null
  );
  const [apiKey, setApiKey] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [integrationId, setIntegrationId] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; accountName?: string } | null>(null);
  const [webhookVerified, setWebhookVerified] = useState(false);

  // If platform is pre-selected, skip to credentials
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
    if (!apiKey.trim() || !accessToken.trim()) {
      setError('Please enter both API key and access token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const integration = await create({
        platform: platform!,
        apiKey: apiKey.trim(),
        accessToken: accessToken.trim(),
      });
      setIntegrationId(integration.id);
      setCurrentStep('test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create integration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!integrationId) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await testConnection(integrationId);
      setTestResult(result);

      if (result.success) {
        // Load webhook URL
        const { url } = await getWebhookUrl(integrationId);
        setWebhookUrl(url);
        setCurrentStep('webhook');
      } else {
        setError(result.error || 'Connection test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyWebhook = async () => {
    // In a real implementation, we'd poll for webhook receipt
    // For now, we'll just simulate verification
    setIsLoading(true);
    setError('');

    try {
      // Simulate webhook verification
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setWebhookVerified(true);
      setCurrentStep('complete');
    } catch (err) {
      setError('Webhook verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipWebhookVerification = () => {
    setCurrentStep('complete');
  };

  const handleComplete = () => {
    router.push('/integrations');
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/integrations"
          className="inline-flex items-center gap-2 text-ink-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Integrations
        </Link>
        <h1 className="text-3xl font-bold text-white">Add Integration</h1>
        <p className="text-ink-400 mt-1">Connect your e-commerce platform</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStepIndex
                  ? 'bg-saffron-500 text-white'
                  : index === currentStepIndex
                  ? 'bg-saffron-500/20 text-saffron-500 border-2 border-saffron-500'
                  : 'bg-ink-800 text-ink-500'
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
                className={`w-12 h-0.5 mx-2 ${
                  index < currentStepIndex ? 'bg-saffron-500' : 'bg-ink-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Select Platform */}
        {currentStep === 'platform' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Select Platform</h2>
              <p className="text-ink-400 text-sm mt-1">
                Choose the e-commerce platform you want to connect
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleSelectPlatform('easyecom')}
                className="flex items-center gap-4 p-4 bg-ink-800 border border-ink-700 rounded-xl hover:border-saffron-500/50 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">EasyEcom</h3>
                  <p className="text-ink-400 text-sm">Inventory management & order tracking</p>
                </div>
                <svg className="w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <h2 className="text-xl font-semibold text-white">Enter API Credentials</h2>
              <p className="text-ink-400 text-sm mt-1">
                Enter your EasyEcom API credentials to connect your account
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-ink-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">How to find your credentials:</h3>
              <ol className="text-ink-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  Log into your EasyEcom Dashboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  Go to Settings then API Settings
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  Copy your API Key and Access Token
                </li>
              </ol>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-3 bg-ink-800 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Enter your access token"
                  className="w-full px-4 py-3 bg-ink-800 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep('platform')}
                className="px-4 py-2 text-ink-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitCredentials}
                disabled={isLoading || !apiKey || !accessToken}
                className="px-6 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  'Continue'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Test Connection */}
        {currentStep === 'test' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Test Connection</h2>
              <p className="text-ink-400 text-sm mt-1">
                Let&apos;s verify your credentials work correctly
              </p>
            </div>

            <div className="bg-ink-800 rounded-lg p-6 text-center">
              {testResult?.success ? (
                <div>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Connection Successful!</h3>
                  {testResult.accountName && (
                    <p className="text-ink-400">Connected to: {testResult.accountName}</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 rounded-full bg-saffron-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Test</h3>
                  <p className="text-ink-400 mb-4">
                    Click the button below to test your connection
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep('credentials')}
                className="px-4 py-2 text-ink-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleTestConnection}
                disabled={isLoading}
                className="px-6 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Configure Webhook */}
        {currentStep === 'webhook' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Configure Webhook</h2>
              <p className="text-ink-400 text-sm mt-1">
                Set up real-time inventory updates from EasyEcom
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-ink-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-3">Copy this webhook URL:</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-ink-900 border border-ink-600 rounded-lg text-white text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(webhookUrl)}
                  className="px-3 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-ink-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">How to configure:</h3>
              <ol className="text-ink-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  Go to EasyEcom Dashboard then Settings then Webhook Configuration
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  Paste the webhook URL above
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  Enable &quot;Inventory Updates&quot; events
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center flex-shrink-0 text-xs">4</span>
                  Click &quot;Send Test&quot; in EasyEcom to verify
                </li>
              </ol>
            </div>

            {webhookVerified && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Webhook verified successfully!</span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleSkipWebhookVerification}
                className="px-4 py-2 text-ink-400 hover:text-white transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleVerifyWebhook}
                disabled={isLoading}
                className="px-6 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Waiting for webhook...
                  </>
                ) : (
                  'I\'ve configured the webhook'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">You&apos;re All Set!</h2>
              <p className="text-ink-400">
                Your EasyEcom integration is now active. You&apos;ll start receiving real-time inventory updates.
              </p>
            </div>

            <div className="bg-ink-800 rounded-lg p-4 text-left">
              <h3 className="text-sm font-medium text-white mb-3">What happens next:</h3>
              <ul className="text-ink-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Inventory data will sync automatically
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Low stock alerts will be enabled
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  First 50 webhooks are free
                </li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              className="px-8 py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
