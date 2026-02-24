/**
 * Orders API functions for ecom-hub
 */

import { authFetch } from './auth';

export interface Order {
  orderId: number;
  invoiceId: string | null;
  referenceCode: string | null;
  marketplace: string | null;
  warehouseId: number | null;
  status: string | null;
  orderDate: string | null;
  totalAmount: number | null;
  totalTax: number | null;
  shippingCharge: number | null;
  discount: number | null;
  collectableAmount: number | null;
  quantity: number | null;
  suborderCount: number;
  skus: string | null;
  receivedAt: string;
}

export interface Suborder {
  suborderId: number;
  sku: string | null;
  marketplaceSku: string | null;
  productId: number | null;
  companyProductId: number | null;
  quantity: number | null;
  sellingPrice: number | null;
  tax: number | null;
  taxRate: number | null;
  status: string | null;
  shipmentType: string | null;
  size: string | null;
  brand: string | null;
  category: string | null;
  productName: string | null;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: {
    order: Order & {
      companyName: string | null;
      marketplaceId: number | null;
      locationKey: string | null;
      statusId: number | null;
      importDate: string | null;
      tat: string | null;
      lastUpdateDate: string | null;
    };
    suborders: Suborder[];
  };
}

export interface OrderStatsResponse {
  success: boolean;
  data: {
    totalOrders: number;
    todayOrders: number;
    weekOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    marketplaceCount: number;
  };
}

export interface OrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  marketplace?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

/**
 * Get orders with pagination and filters
 */
export async function getOrders(params: OrdersParams = {}): Promise<OrdersResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.status) searchParams.set('status', params.status);
  if (params.marketplace) searchParams.set('marketplace', params.marketplace);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.search) searchParams.set('search', params.search);

  const queryString = searchParams.toString();
  const url = `/api/orders${queryString ? `?${queryString}` : ''}`;

  return authFetch<OrdersResponse>(url);
}

/**
 * Get order details with suborders
 */
export async function getOrderDetail(orderId: number): Promise<OrderDetailResponse> {
  return authFetch<OrderDetailResponse>(`/api/orders/${orderId}`);
}

/**
 * Get order statistics for dashboard
 */
export async function getOrderStats(): Promise<OrderStatsResponse> {
  return authFetch<OrderStatsResponse>('/api/orders/stats/summary');
}
