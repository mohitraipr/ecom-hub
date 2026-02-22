'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-ink-400 mt-1">Configure platform-wide options</p>
      </div>

      {/* Pricing Settings */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Pricing Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">
              Out of Stock Webhook Price (Rs)
            </label>
            <input
              type="number"
              defaultValue="0.50"
              step="0.01"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Price per webhook processed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">
              Free Webhook Quota
            </label>
            <input
              type="number"
              defaultValue="50"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Free webhooks for new tenants</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">
              Low Balance Threshold (Rs)
            </label>
            <input
              type="number"
              defaultValue="100"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Alert tenants below this balance</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">
              Minimum Recharge Amount (Rs)
            </label>
            <input
              type="number"
              defaultValue="100"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Minimum wallet recharge amount</p>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Email Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-ink-800">
            <div>
              <p className="text-white font-medium">Low Balance Alerts</p>
              <p className="text-ink-500 text-sm">Send email when tenant balance is low</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-saffron-500 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-ink-800">
            <div>
              <p className="text-white font-medium">Integration Errors</p>
              <p className="text-ink-500 text-sm">Send email on integration failures</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-saffron-500 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white font-medium">Weekly Reports</p>
              <p className="text-ink-500 text-sm">Send weekly usage summary to admin</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-ink-700 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Platform Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-ink-800">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-ink-500 text-sm">Disable new registrations and webhooks</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-ink-700 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white font-medium">Accept New Registrations</p>
              <p className="text-ink-500 text-sm">Allow new tenants to sign up</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-saffron-500 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-saffron-500 text-white font-medium rounded-lg hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
}
