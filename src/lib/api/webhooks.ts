/**
 * Webhook Logs API functions for ecom-hub
 * Fetches incoming EasyEcom webhook data
 */

import { authFetch } from './auth';

export interface WebhookLogSummary {
  // Out of Stock
  sku?: string;
  inventory?: number;
  warehouseId?: number;
  // Orders
  orderId?: number;
  invoiceId?: string;
  marketplace?: string;
  status?: string;
  amount?: number;
  quantity?: number;
}

export interface WebhookLog {
  id: string;
  service: 'out_of_stock' | 'orders';
  summary: WebhookLogSummary;
  rawData: Record<string, unknown>;
  receivedAt: string;
}

export interface WebhookStats {
  outOfStock: {
    total: number;
    lastReceived: string | null;
  };
  orders: {
    total: number;
    lastReceived: string | null;
  };
  usageLast24h: {
    service: string;
    count: number;
    totalCost: number;
  }[];
}

export interface WebhookLogsResponse {
  logs: WebhookLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get webhook logs for current tenant (seller view)
 */
export async function getWebhookLogs(params?: {
  page?: number;
  limit?: number;
  service?: 'out_of_stock' | 'orders';
  startDate?: string;
  endDate?: string;
}): Promise<WebhookLogsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.service) queryParams.set('service', params.service);
  if (params?.startDate) queryParams.set('startDate', params.startDate);
  if (params?.endDate) queryParams.set('endDate', params.endDate);

  const query = queryParams.toString();
  const endpoint = query ? `/api/webhook-logs?${query}` : '/api/webhook-logs';

  const result = await authFetch<{ success: boolean; data: WebhookLogsResponse }>(endpoint);
  return result.data;
}

/**
 * Get webhook statistics for current tenant
 */
export async function getWebhookStats(): Promise<WebhookStats> {
  const result = await authFetch<{ success: boolean; data: WebhookStats }>('/api/webhook-logs/stats');
  return result.data;
}

/**
 * Admin: Get webhook logs for a specific tenant
 */
export async function getAdminWebhookLogs(
  tenantId: string,
  params?: {
    page?: number;
    limit?: number;
    service?: 'out_of_stock' | 'orders';
  }
): Promise<WebhookLogsResponse & { tenant: { id: string; name: string } }> {
  const queryParams = new URLSearchParams();
  queryParams.set('tenant_id', tenantId);
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.service) queryParams.set('service', params.service);

  const endpoint = `/api/admin/webhook-logs?${queryParams.toString()}`;
  const result = await authFetch<{
    success: boolean;
    data: WebhookLogsResponse & { tenant: { id: string; name: string } };
  }>(endpoint);
  return result.data;
}
