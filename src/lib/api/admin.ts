/**
 * Admin API functions for ecom-hub platform administrators
 */

import { authFetch } from './auth';

// Types
export interface PlatformStats {
  tenants: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
  revenue: {
    total: number;
    last30Days: number;
    last7Days: number;
    today: number;
  };
  webhooks: {
    total: number;
    today: number;
    thisWeek: number;
    totalCost: number;
  };
  integrations: {
    total: number;
    active: number;
  };
}

export interface TenantListItem {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  wallet: {
    balance: number;
    freeWebhooksRemaining: number;
    isPaused: boolean;
  };
  integrationCount: number;
  userCount: number;
}

export interface TenantDetails {
  tenant: {
    id: string;
    name: string;
    slug: string;
    email: string;
    phone: string | null;
    gstin: string | null;
    status: string;
    createdAt: string;
  };
  wallet: {
    balance: number;
    freeWebhooksRemaining: number;
    isPaused: boolean;
    lowBalanceThreshold: number;
  };
  users: {
    id: string;
    email: string;
    name: string;
    role: string;
    lastLogin: string | null;
    createdAt: string;
  }[];
  integrations: {
    id: string;
    platform: string;
    name: string;
    status: string;
    testMode: boolean;
    lastValidatedAt: string | null;
    createdAt: string;
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    balanceAfter: number;
    description: string;
    createdAt: string;
  }[];
}

export interface RevenueData {
  daily: {
    date: string;
    revenue: number;
    transactions: number;
  }[];
  topTenants: {
    id: string;
    name: string;
    totalSpend: number;
    transactionCount: number;
  }[];
}

/**
 * Get platform-wide statistics
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  const result = await authFetch<{ success: boolean; data: PlatformStats }>('/api/admin/stats');
  return result.data;
}

/**
 * Get list of all tenants
 */
export async function getTenants(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{
  tenants: TenantListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.status) queryParams.set('status', params.status);
  if (params?.search) queryParams.set('search', params.search);

  const query = queryParams.toString();
  const endpoint = query ? `/api/admin/tenants?${query}` : '/api/admin/tenants';

  const result = await authFetch<{
    success: boolean;
    data: {
      tenants: TenantListItem[];
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
 * Get tenant details
 */
export async function getTenantDetails(id: string): Promise<TenantDetails> {
  const result = await authFetch<{ success: boolean; data: TenantDetails }>(
    `/api/admin/tenants/${id}`
  );
  return result.data;
}

/**
 * Adjust tenant wallet balance
 */
export async function adjustWallet(
  tenantId: string,
  data: {
    amount: number;
    type: 'bonus' | 'adjustment' | 'refund';
    description: string;
  }
): Promise<{
  previousBalance: number;
  adjustment: number;
  newBalance: number;
}> {
  const result = await authFetch<{
    success: boolean;
    data: {
      previousBalance: number;
      adjustment: number;
      newBalance: number;
    };
  }>(`/api/admin/tenants/${tenantId}/adjust`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return result.data;
}

/**
 * Update tenant status
 */
export async function updateTenantStatus(
  tenantId: string,
  status: 'active' | 'suspended',
  reason?: string
): Promise<void> {
  await authFetch<{ success: boolean }>(`/api/admin/tenants/${tenantId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status, reason }),
  });
}

/**
 * Get revenue analytics
 */
export async function getRevenue(days?: number): Promise<RevenueData> {
  const endpoint = days ? `/api/admin/revenue?days=${days}` : '/api/admin/revenue';
  const result = await authFetch<{ success: boolean; data: RevenueData }>(endpoint);
  return result.data;
}
