/**
 * Wallet API functions for ecom-hub
 * Handles wallet balance, transactions, and Razorpay payments
 */

import { authFetch } from './auth';
import { config } from '../config';

// Types
export interface Wallet {
  balance: number;
  freeWebhooksRemaining: number;
  isPaused: boolean;
  lowBalanceThreshold: number;
}

export interface Transaction {
  id: string;
  type: 'recharge' | 'usage' | 'refund' | 'bonus' | 'adjustment' | 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  description: string;
  service?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface UsageEntry {
  date: string;
  service: string;
  totalWebhooks: number;
  billableWebhooks: number;
  freeWebhooks: number;
  totalCost: number;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerification {
  success: boolean;
  amount: number;
  newBalance: number;
  paymentId: string;
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Get wallet balance and info
 */
export async function getWallet(): Promise<Wallet> {
  const result = await authFetch<{ success: boolean; data: Wallet }>('/api/wallet');
  return result.data;
}

/**
 * Get transaction history
 */
export async function getTransactions(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  transactions: Transaction[];
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

  const query = queryParams.toString();
  const endpoint = query ? `/api/wallet/transactions?${query}` : '/api/wallet/transactions';

  const result = await authFetch<{
    success: boolean;
    data: {
      transactions: Transaction[];
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
 * Get usage statistics
 */
export async function getUsage(days?: number): Promise<UsageEntry[]> {
  const endpoint = days ? `/api/wallet/usage?days=${days}` : '/api/wallet/usage';
  const result = await authFetch<{ success: boolean; data: { usage: UsageEntry[] } }>(endpoint);
  return result.data.usage;
}

/**
 * Create Razorpay order for wallet recharge
 */
export async function createRechargeOrder(amount: number): Promise<RazorpayOrder> {
  const result = await authFetch<{ success: boolean; data: RazorpayOrder }>(
    '/api/wallet/recharge',
    {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }
  );
  return result.data;
}

/**
 * Verify Razorpay payment and credit wallet
 */
export async function verifyPayment(paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<PaymentVerification> {
  const result = await authFetch<{ success: boolean; data: PaymentVerification }>(
    '/api/wallet/verify',
    {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }
  );
  return result.data;
}

/**
 * Load Razorpay checkout script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout and handle payment
 */
export async function initiatePayment(
  amount: number,
  userInfo?: { name?: string; email?: string; phone?: string }
): Promise<PaymentVerification> {
  // Load Razorpay script if not already loaded
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay checkout');
  }

  // Create order
  const order = await createRechargeOrder(amount);

  return new Promise((resolve, reject) => {
    const options: RazorpayOptions = {
      key: order.keyId,
      amount: order.amount * 100, // Razorpay expects amount in paise
      currency: order.currency,
      name: 'ecom-hub',
      description: 'Wallet Recharge',
      order_id: order.orderId,
      handler: async (response) => {
        try {
          const verification = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(verification);
        } catch (error) {
          reject(error);
        }
      },
      prefill: {
        name: userInfo?.name,
        email: userInfo?.email,
        contact: userInfo?.phone,
      },
      theme: {
        color: '#F97316', // Saffron color from branding
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled'));
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  });
}
