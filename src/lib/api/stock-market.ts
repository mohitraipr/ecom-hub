import { apiFetch } from './client';
import { StockMarketData, StockPeriod } from './types';

/**
 * Fetch stock market data from kotty-track backend
 *
 * @param period - Time period for data aggregation
 * @returns Stock market data with inventory, orders, and slow movers
 */
export async function fetchStockMarketData(
  period: StockPeriod = '1d'
): Promise<StockMarketData> {
  const data = await apiFetch<StockMarketData>(
    `/easyecom/stock-market/data?period=${period}`
  );

  // Transform backend response to match our types if needed
  return {
    ...data,
    inventory: data.inventory.map(item => ({
      sku: item.sku,
      warehouse: item.warehouse,
      warehouse_id: item.warehouse_id,
      inventory: item.inventory,
      makingTime: item.makingTime,
      yesterdayOrders: item.yesterdayOrders,
      daysLeft: item.daysLeft,
      status: item.status,
    })),
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * Period options for display
 */
export const periodOptions: { value: StockPeriod; label: string }[] = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '12h', label: 'Last 12 hours' },
  { value: '1d', label: 'Last 24 hours' },
  { value: '3d', label: 'Last 3 days' },
  { value: '7d', label: 'Last 7 days' },
];
