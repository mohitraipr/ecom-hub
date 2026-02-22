'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Transaction,
  UsageEntry,
  getWallet,
  getTransactions,
  getUsage,
  initiatePayment,
  PaymentVerification,
} from '@/lib/api/wallet';

interface UseWalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  usage: UsageEntry[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

interface UseWalletReturn extends UseWalletState {
  refresh: () => Promise<void>;
  loadTransactions: (page?: number) => Promise<void>;
  loadUsage: (days?: number) => Promise<void>;
  recharge: (amount: number, userInfo?: { name?: string; email?: string; phone?: string }) => Promise<PaymentVerification>;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<UseWalletState>({
    wallet: null,
    transactions: [],
    usage: [],
    isLoading: true,
    error: null,
    pagination: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const wallet = await getWallet();
      setState((prev) => ({ ...prev, wallet, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load wallet',
      }));
    }
  }, []);

  const loadTransactions = useCallback(async (page = 1) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await getTransactions({ page, limit: 20 });
      setState((prev) => ({
        ...prev,
        transactions: result.transactions,
        pagination: result.pagination,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load transactions',
      }));
    }
  }, []);

  const loadUsage = useCallback(async (days = 30) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const usage = await getUsage(days);
      setState((prev) => ({ ...prev, usage, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load usage',
      }));
    }
  }, []);

  const recharge = useCallback(
    async (
      amount: number,
      userInfo?: { name?: string; email?: string; phone?: string }
    ): Promise<PaymentVerification> => {
      const result = await initiatePayment(amount, userInfo);
      // Refresh wallet after successful payment
      await refresh();
      return result;
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
    loadTransactions,
    loadUsage,
    recharge,
  };
}
