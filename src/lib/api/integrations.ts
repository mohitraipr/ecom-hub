/**
 * Integrations API functions for ecom-hub
 * Handles platform integrations (EasyEcom, Uniware, etc.)
 */

import { authFetch } from './auth';

// Types
export type Platform = 'easyecom' | 'uniware';
export type IntegrationStatus = 'setup' | 'testing' | 'active' | 'paused' | 'error';

export interface Integration {
  id: string;
  platform: Platform;
  status: IntegrationStatus;
  testMode: boolean;
  webhookUrl: string;
  lastValidatedAt: string | null;
  lastError: string | null;
  createdAt: string;
}

export interface IntegrationDetails extends Integration {
  webhookStats: {
    total: number;
    today: number;
    lastReceived: string | null;
  };
}

export interface CreateIntegrationData {
  platform: Platform;
  apiKey: string;
  accessToken: string;
}

export interface TestConnectionResult {
  success: boolean;
  accountName?: string;
  companyInfo?: {
    name: string;
    id: string;
  };
  error?: string;
}

/**
 * Get all integrations for tenant
 */
export async function getIntegrations(): Promise<Integration[]> {
  const result = await authFetch<{ success: boolean; data: { integrations: Integration[] } }>(
    '/api/integrations'
  );
  return result.data.integrations;
}

/**
 * Get integration details
 */
export async function getIntegration(id: string): Promise<IntegrationDetails> {
  const result = await authFetch<{ success: boolean; data: IntegrationDetails }>(
    `/api/integrations/${id}`
  );
  return result.data;
}

/**
 * Create new integration
 */
export async function createIntegration(data: CreateIntegrationData): Promise<Integration> {
  const result = await authFetch<{ success: boolean; data: Integration }>(
    '/api/integrations',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return result.data;
}

/**
 * Test integration credentials
 */
export async function testConnection(id: string): Promise<TestConnectionResult> {
  const result = await authFetch<{ success: boolean; data: TestConnectionResult }>(
    `/api/integrations/${id}/test`,
    { method: 'POST' }
  );
  return result.data;
}

/**
 * Activate integration (go live)
 */
export async function activateIntegration(id: string): Promise<Integration> {
  const result = await authFetch<{ success: boolean; data: Integration }>(
    `/api/integrations/${id}/activate`,
    { method: 'POST' }
  );
  return result.data;
}

/**
 * Pause integration
 */
export async function pauseIntegration(id: string): Promise<Integration> {
  const result = await authFetch<{ success: boolean; data: Integration }>(
    `/api/integrations/${id}/pause`,
    { method: 'POST' }
  );
  return result.data;
}

/**
 * Resume integration
 */
export async function resumeIntegration(id: string): Promise<Integration> {
  const result = await authFetch<{ success: boolean; data: Integration }>(
    `/api/integrations/${id}/resume`,
    { method: 'POST' }
  );
  return result.data;
}

/**
 * Delete integration
 */
export async function deleteIntegration(id: string): Promise<void> {
  await authFetch<{ success: boolean }>(
    `/api/integrations/${id}`,
    { method: 'DELETE' }
  );
}

/**
 * Get webhook URL for integration
 */
export async function getWebhookUrl(id: string): Promise<{ url: string }> {
  const result = await authFetch<{ success: boolean; data: { url: string } }>(
    `/api/integrations/${id}/webhook-url`
  );
  return result.data;
}

/**
 * Trigger manual sync
 */
export async function triggerSync(id: string): Promise<{ message: string }> {
  const result = await authFetch<{ success: boolean; data: { message: string } }>(
    `/api/integrations/${id}/sync`,
    { method: 'POST' }
  );
  return result.data;
}

/**
 * Update integration credentials
 */
export async function updateCredentials(
  id: string,
  data: { apiKey?: string; accessToken?: string }
): Promise<Integration> {
  const result = await authFetch<{ success: boolean; data: Integration }>(
    `/api/integrations/${id}/credentials`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return result.data;
}

/**
 * Get platform display info
 */
export function getPlatformInfo(platform: Platform): {
  name: string;
  description: string;
  logo: string;
  setupGuideUrl: string;
} {
  const platformInfo: Record<Platform, ReturnType<typeof getPlatformInfo>> = {
    easyecom: {
      name: 'EasyEcom',
      description: 'Warehouse and inventory management platform',
      logo: '/logos/easyecom.png',
      setupGuideUrl: 'https://docs.easyecom.io/api-integration',
    },
    uniware: {
      name: 'Uniware',
      description: 'Order and inventory management system',
      logo: '/logos/uniware.png',
      setupGuideUrl: 'https://docs.unicommerce.com/api',
    },
  };

  return platformInfo[platform];
}

/**
 * Get status color for display
 */
export function getStatusColor(status: IntegrationStatus): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<IntegrationStatus, ReturnType<typeof getStatusColor>> = {
    setup: { bg: 'bg-ink-700', text: 'text-ink-300', border: 'border-ink-600' },
    testing: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    paused: { bg: 'bg-ink-700', text: 'text-ink-400', border: 'border-ink-600' },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  };

  return colors[status];
}
