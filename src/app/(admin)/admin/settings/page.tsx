'use client';

import { useState, useEffect } from 'react';
import { authFetch } from '@/lib/api/auth';

interface PlatformSettings {
  min_recharge_amount: number;
  free_webhook_quota: number;
  low_balance_threshold: number;
  webhook_price_out_of_stock: number;
  webhook_price_orders: number;
  require_tenant_approval: boolean;
  maintenance_mode: boolean;
  accept_new_registrations: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    min_recharge_amount: 100,
    free_webhook_quota: 50,
    low_balance_threshold: 100,
    webhook_price_out_of_stock: 0.5,
    webhook_price_orders: 0.5,
    require_tenant_approval: false,
    maintenance_mode: false,
    accept_new_registrations: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      interface SettingValue {
        value: string | number | boolean;
        type: string;
        description: string;
      }
      interface SettingsResponse {
        success: boolean;
        data: {
          settings: Record<string, SettingValue>;
        };
      }
      const data = await authFetch<SettingsResponse>('/api/admin/settings');

      if (data.success && data.data.settings) {
        const s = data.data.settings;
        setSettings({
          min_recharge_amount: Number(s.min_recharge_amount?.value ?? 100),
          free_webhook_quota: Number(s.free_webhook_quota?.value ?? 50),
          low_balance_threshold: Number(s.low_balance_threshold?.value ?? 100),
          webhook_price_out_of_stock: Number(s.webhook_price_out_of_stock?.value ?? 0.5),
          webhook_price_orders: Number(s.webhook_price_orders?.value ?? 0.5),
          require_tenant_approval: Boolean(s.require_tenant_approval?.value ?? false),
          maintenance_mode: Boolean(s.maintenance_mode?.value ?? false),
          accept_new_registrations: Boolean(s.accept_new_registrations?.value ?? true),
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      interface SaveResponse {
        success: boolean;
        error?: { message: string };
      }
      const data = await authFetch<SaveResponse>('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(data.error?.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleNumberChange = (key: keyof PlatformSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const handleToggle = (key: keyof PlatformSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
          <p className="text-ink-400 mt-1">Configure platform-wide options</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-saffron-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-ink-400 mt-1">Configure platform-wide options</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-500/20 border border-green-500/50 text-green-400'
            : 'bg-red-500/20 border border-red-500/50 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

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
              value={settings.webhook_price_out_of_stock}
              onChange={(e) => handleNumberChange('webhook_price_out_of_stock', e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Price per webhook processed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">
              Orders Webhook Price (Rs)
            </label>
            <input
              type="number"
              value={settings.webhook_price_orders}
              onChange={(e) => handleNumberChange('webhook_price_orders', e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Price per orders webhook</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-300 mb-2">
              Free Webhook Quota
            </label>
            <input
              type="number"
              value={settings.free_webhook_quota}
              onChange={(e) => handleNumberChange('free_webhook_quota', e.target.value)}
              min="0"
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
              value={settings.low_balance_threshold}
              onChange={(e) => handleNumberChange('low_balance_threshold', e.target.value)}
              min="0"
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
              value={settings.min_recharge_amount}
              onChange={(e) => handleNumberChange('min_recharge_amount', e.target.value)}
              min="1"
              className="w-full px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-white focus:outline-none focus:border-saffron-500"
            />
            <p className="text-ink-500 text-sm mt-1">Minimum wallet recharge amount</p>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Platform Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-ink-800">
            <div>
              <p className="text-white font-medium">Require Tenant Approval</p>
              <p className="text-ink-500 text-sm">New signups need admin approval</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('require_tenant_approval')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.require_tenant_approval ? 'bg-saffron-500' : 'bg-ink-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.require_tenant_approval ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-ink-800">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-ink-500 text-sm">Disable new registrations and webhooks</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('maintenance_mode')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.maintenance_mode ? 'bg-saffron-500' : 'bg-ink-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.maintenance_mode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white font-medium">Accept New Registrations</p>
              <p className="text-ink-500 text-sm">Allow new tenants to sign up</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('accept_new_registrations')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.accept_new_registrations ? 'bg-saffron-500' : 'bg-ink-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.accept_new_registrations ? 'translate-x-5' : 'translate-x-0'
              }`} />
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
