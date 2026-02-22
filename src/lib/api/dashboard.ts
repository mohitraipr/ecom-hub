/**
 * Dashboard API functions for ecom-hub
 * Handles dashboard overview data, stats, and alerts
 */

import { authFetch } from './auth';
import { StockStatus } from './types';

// Types
export interface DashboardOverview {
  stats: {
    totalSkus: number;
    outOfStockSkus: number;
    lowStockSkus: number;
    totalWebhooksToday: number;
    walletBalance: number;
    freeWebhooksRemaining: number;
  };
  recentActivity: ActivityItem[];
  integrationStatus: {
    platform: string;
    status: string;
    lastSync: string | null;
  }[];
}

export interface ActivityItem {
  id: string;
  type: 'webhook' | 'recharge' | 'alert' | 'integration';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

export interface StockAlert {
  id: string;
  sku: string;
  warehouse: string;
  currentStock: number;
  status: StockStatus;
  daysLeft: number;
  avgDailySales: number;
  createdAt: string;
}

export interface LowBalanceAlert {
  id: string;
  balance: number;
  threshold: number;
  isPaused: boolean;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'low_balance' | 'integration_error';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  sku?: string;
  warehouse?: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface StockMarketSku {
  sku: string;
  warehouse: string;
  warehouseId?: number;
  inventory: number;
  makingTime: number;
  yesterdayOrders: number;
  daysLeft: number;
  status: StockStatus;
}

export interface StockMarketResponse {
  skus: StockMarketSku[];
  summary: {
    total: number;
    outOfStock: number;
    lowStock: number;
    healthy: number;
  };
  lastUpdated: string;
}

/**
 * Get dashboard overview
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const result = await authFetch<{ success: boolean; data: DashboardOverview }>(
    '/api/dashboard/overview'
  );
  return result.data;
}

/**
 * Get stock market data (SKUs sorted by days left)
 */
export async function getStockMarket(params?: {
  status?: StockStatus;
  warehouse?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<StockMarketResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set('status', params.status);
  if (params?.warehouse) queryParams.set('warehouse', params.warehouse);
  if (params?.search) queryParams.set('search', params.search);
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query ? `/api/dashboard/stock?${query}` : '/api/dashboard/stock';

  const result = await authFetch<{ success: boolean; data: StockMarketResponse }>(endpoint);
  return result.data;
}

/**
 * Get active alerts
 */
export async function getAlerts(params?: {
  type?: Alert['type'];
  acknowledged?: boolean;
  page?: number;
  limit?: number;
}): Promise<{
  alerts: Alert[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.set('type', params.type);
  if (params?.acknowledged !== undefined) {
    queryParams.set('acknowledged', params.acknowledged.toString());
  }
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query ? `/api/dashboard/alerts?${query}` : '/api/dashboard/alerts';

  const result = await authFetch<{
    success: boolean;
    data: {
      alerts: Alert[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }>(endpoint);

  return result.data;
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string): Promise<void> {
  await authFetch<{ success: boolean }>(
    `/api/dashboard/alerts/${alertId}/acknowledge`,
    { method: 'POST' }
  );
}

/**
 * Get warehouse list
 */
export async function getWarehouses(): Promise<{ id: number; name: string }[]> {
  const result = await authFetch<{
    success: boolean;
    data: { warehouses: { id: number; name: string }[] };
  }>('/api/dashboard/warehouses');
  return result.data.warehouses;
}

/**
 * Get activity feed
 */
export async function getActivityFeed(params?: {
  type?: ActivityItem['type'];
  limit?: number;
}): Promise<ActivityItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.set('type', params.type);
  if (params?.limit) queryParams.set('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query ? `/api/dashboard/activity?${query}` : '/api/dashboard/activity';

  const result = await authFetch<{ success: boolean; data: { activity: ActivityItem[] } }>(
    endpoint
  );
  return result.data.activity;
}

/**
 * Get usage analytics
 */
export async function getAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<{
  webhooksByDay: { date: string; count: number; cost: number }[];
  topSkus: { sku: string; webhooks: number }[];
  summary: {
    totalWebhooks: number;
    totalCost: number;
    avgWebhooksPerDay: number;
  };
}> {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.set('startDate', params.startDate);
  if (params?.endDate) queryParams.set('endDate', params.endDate);
  if (params?.groupBy) queryParams.set('groupBy', params.groupBy);

  const query = queryParams.toString();
  const endpoint = query ? `/api/dashboard/analytics?${query}` : '/api/dashboard/analytics';

  const result = await authFetch<{
    success: boolean;
    data: {
      webhooksByDay: { date: string; count: number; cost: number }[];
      topSkus: { sku: string; webhooks: number }[];
      summary: {
        totalWebhooks: number;
        totalCost: number;
        avgWebhooksPerDay: number;
      };
    };
  }>(endpoint);

  return result.data;
}
