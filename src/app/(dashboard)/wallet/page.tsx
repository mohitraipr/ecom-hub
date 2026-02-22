'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useAuth } from '@/lib/context/AuthContext';

const RECHARGE_AMOUNTS = [100, 500, 1000, 2000, 5000];

export default function WalletPage() {
  const { user } = useAuth();
  const { wallet, transactions, pagination, isLoading, error, loadTransactions, recharge } = useWallet();
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeError, setRechargeError] = useState('');
  const [rechargeSuccess, setRechargeSuccess] = useState('');

  const handleRecharge = async () => {
    const amount = customAmount ? parseFloat(customAmount) : rechargeAmount;

    if (amount < 100) {
      setRechargeError('Minimum recharge amount is Rs100');
      return;
    }

    setIsRecharging(true);
    setRechargeError('');
    setRechargeSuccess('');

    try {
      const result = await recharge(amount, {
        name: user?.name,
        email: user?.email,
      });
      setRechargeSuccess(`Successfully added Rs${result.amount} to your wallet!`);
      setShowRechargeModal(false);
      loadTransactions();
    } catch (err) {
      if (err instanceof Error && err.message === 'Payment cancelled') {
        // User cancelled, don't show error
      } else {
        setRechargeError(err instanceof Error ? err.message : 'Recharge failed');
      }
    } finally {
      setIsRecharging(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return (
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'usage':
        return (
          <div className="w-10 h-10 rounded-lg bg-saffron-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case 'refund':
        return (
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-ink-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  if (isLoading && !wallet) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Wallet</h1>
        <p className="text-ink-400 mt-1">Manage your balance and view transactions</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}
      {rechargeSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-emerald-400">
          {rechargeSuccess}
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-saffron-500/20 to-saffron-600/10 border border-saffron-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-400 text-sm">Current Balance</p>
              <p className="text-4xl font-bold text-white mt-2">
                Rs{(wallet?.balance ?? 0).toFixed(2)}
              </p>
              {wallet?.isPaused && (
                <p className="text-red-400 text-sm mt-2">
                  Wallet is paused due to low balance
                </p>
              )}
            </div>
            <div className="w-16 h-16 rounded-full bg-saffron-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="mt-6 w-full py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors"
          >
            Recharge Wallet
          </button>
        </div>

        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-400 text-sm">Free Webhooks Remaining</p>
              <p className="text-4xl font-bold text-white mt-2">
                {wallet?.freeWebhooksRemaining ?? 50}
              </p>
              <p className="text-ink-500 text-xs mt-1">of 50 free webhooks</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 bg-ink-800 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${((wallet?.freeWebhooksRemaining ?? 50) / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-ink-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Out of Stock Webhook</p>
                <p className="text-ink-500 text-sm">Per webhook processed</p>
              </div>
            </div>
            <p className="text-white font-semibold">Rs0.50</p>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Ajio Mail Processing</p>
                <p className="text-ink-500 text-sm">Per email processed</p>
              </div>
            </div>
            <p className="text-white font-semibold">Rs1.00</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          {pagination && pagination.total > 0 && (
            <span className="text-ink-500 text-sm">
              {pagination.total} total transactions
            </span>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-ink-400">No transactions yet</p>
            <p className="text-ink-500 text-sm mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-ink-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <p className="text-ink-500 text-sm">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'recharge' || tx.type === 'refund' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {tx.type === 'recharge' || tx.type === 'refund' ? '+' : '-'}Rs{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-ink-500 text-xs">Balance: Rs{tx.balanceAfter.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => loadTransactions(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-lg bg-ink-800 text-ink-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-ink-400 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => loadTransactions(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded-lg bg-ink-800 text-ink-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-ink-900 border border-ink-700 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recharge Wallet</h3>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="text-ink-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {rechargeError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">
                {rechargeError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RECHARGE_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setRechargeAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                        rechargeAmount === amount && !customAmount
                          ? 'bg-saffron-500 text-white'
                          : 'bg-ink-800 text-ink-300 hover:bg-ink-700'
                      }`}
                    >
                      Rs{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">Rs</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    className="w-full pl-10 pr-4 py-3 bg-ink-800 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
                <p className="text-ink-500 text-xs mt-1">Minimum recharge: Rs100</p>
              </div>

              <div className="bg-ink-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Amount to pay</span>
                  <span className="text-2xl font-bold text-white">
                    Rs{customAmount || rechargeAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRecharge}
                disabled={isRecharging}
                className="w-full py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRecharging ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay with Razorpay'
                )}
              </button>

              <p className="text-center text-ink-500 text-xs">
                Secured by Razorpay. UPI, Cards, Net Banking accepted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
