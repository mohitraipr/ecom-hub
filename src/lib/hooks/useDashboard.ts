'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DashboardOverview,
  Alert,
  StockMarketResponse,
  getDashboardOverview,
  getStockMarket,
  getAlerts,
  acknowledgeAlert,
  getWarehouses,
} from '@/lib/api/dashboard';
import { StockStatus } from '@/lib/api/types';

// Overview hook
interface UseDashboardOverviewState {
  overview: DashboardOverview | null;
  isLoading: boolean;
  error: string | null;
}

interface UseDashboardOverviewReturn extends UseDashboardOverviewState {
  refresh: () => Promise<void>;
}

export function useDashboardOverview(): UseDashboardOverviewReturn {
  const [state, setState] = useState<UseDashboardOverviewState>({
    overview: null,
    isLoading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const overview = await getDashboardOverview();
      setState({ overview, isLoading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load dashboard',
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}

// Stock Market hook
interface UseStockMarketState {
  data: StockMarketResponse | null;
  warehouses: { id: number; name: string }[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: StockStatus;
    warehouse?: string;
    search?: string;
  };
}

interface UseStockMarketReturn extends UseStockMarketState {
  refresh: () => Promise<void>;
  setFilters: (filters: UseStockMarketState['filters']) => void;
  loadWarehouses: () => Promise<void>;
}

export function useStockMarket(): UseStockMarketReturn {
  const [state, setState] = useState<UseStockMarketState>({
    data: null,
    warehouses: [],
    isLoading: true,
    error: null,
    filters: {},
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getStockMarket(state.filters);
      setState((prev) => ({ ...prev, data, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load stock data',
      }));
    }
  }, [state.filters]);

  const setFilters = useCallback((filters: UseStockMarketState['filters']) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const loadWarehouses = useCallback(async () => {
    try {
      const warehouses = await getWarehouses();
      setState((prev) => ({ ...prev, warehouses }));
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  return { ...state, refresh, setFilters, loadWarehouses };
}

// Alerts hook
interface UseAlertsState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

interface UseAlertsReturn extends UseAlertsState {
  refresh: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  acknowledge: (alertId: string) => Promise<void>;
}

export function useAlerts(params?: {
  type?: Alert['type'];
  acknowledged?: boolean;
}): UseAlertsReturn {
  const [state, setState] = useState<UseAlertsState>({
    alerts: [],
    isLoading: true,
    error: null,
    pagination: null,
  });

  const loadPage = useCallback(
    async (page = 1) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await getAlerts({ ...params, page, limit: 20 });
        setState({
          alerts: result.alerts,
          pagination: result.pagination,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load alerts',
        }));
      }
    },
    [params]
  );

  const refresh = useCallback(() => loadPage(1), [loadPage]);

  const acknowledge = useCallback(
    async (alertId: string) => {
      await acknowledgeAlert(alertId);
      await refresh();
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh, loadPage, acknowledge };
}
