'use client';

import { useState, useEffect, useCallback } from 'react';
import { isDemo } from '../config';
import { fetchStockMarketData } from '../api/stock-market';
import { StockMarketData, InventoryItem, StockPeriod } from '../api/types';
import { ApiError } from '../api/client';

// Demo data matching the original hardcoded data
const demoInventoryData: InventoryItem[] = [
  { sku: "KOTTY-BLK-L", warehouse: "Delhi", inventory: 15, makingTime: 5, yesterdayOrders: 8, daysLeft: -3, status: "red" },
  { sku: "KOTTY-WHT-M", warehouse: "Faridabad", inventory: 45, makingTime: 4, yesterdayOrders: 6, daysLeft: 3, status: "orange" },
  { sku: "KOTTY-BLU-S", warehouse: "Delhi", inventory: 120, makingTime: 3, yesterdayOrders: 4, daysLeft: 27, status: "green" },
  { sku: "KOTTY-RED-XL", warehouse: "Faridabad", inventory: 8, makingTime: 5, yesterdayOrders: 5, daysLeft: -3, status: "red" },
  { sku: "KOTTY-GRY-L", warehouse: "Delhi", inventory: 55, makingTime: 4, yesterdayOrders: 7, daysLeft: 4, status: "orange" },
  { sku: "KOTTY-PNK-M", warehouse: "Faridabad", inventory: 200, makingTime: 3, yesterdayOrders: 3, daysLeft: 64, status: "green" },
];

const createDemoData = (period: StockPeriod): StockMarketData => ({
  inventory: demoInventoryData,
  orders: [],
  slowMovers: [],
  period,
  lastUpdated: new Date().toISOString(),
});

export interface UseStockMarketResult {
  data: StockMarketData | null;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  refetch: () => void;
  setPeriod: (period: StockPeriod) => void;
  period: StockPeriod;
}

/**
 * Hook for fetching stock market data with demo fallback
 */
export function useStockMarket(initialPeriod: StockPeriod = '1d'): UseStockMarketResult {
  const [data, setData] = useState<StockMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(isDemo);
  const [period, setPeriod] = useState<StockPeriod>(initialPeriod);

  const fetchData = useCallback(async () => {
    // If demo mode is forced, use demo data immediately
    if (isDemo) {
      setData(createDemoData(period));
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchStockMarketData(period);
      setData(result);
      setIsDemoMode(false);
    } catch (err) {
      console.error('Failed to fetch stock market data:', err);

      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          setError('Authentication required. Showing demo data.');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Backend unavailable. Showing demo data.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Showing demo data.');
      }

      // Fallback to demo data on any error
      setData(createDemoData(period));
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isDemo: isDemoMode,
    refetch: fetchData,
    setPeriod,
    period,
  };
}
