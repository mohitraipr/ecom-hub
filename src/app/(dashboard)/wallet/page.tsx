'use client';

import { useState } from 'react';

export default function WalletPage() {
  const [balance] = useState(0);
  const [freeWebhooks] = useState(50);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Wallet</h1>
        <p className="text-ink-400 mt-1">Manage your balance and view transactions</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-saffron-500/20 to-saffron-600/10 border border-saffron-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-400 text-sm">Current Balance</p>
              <p className="text-4xl font-bold text-white mt-2">₹{balance.toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-saffron-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors">
            Recharge Wallet
          </button>
        </div>

        <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-400 text-sm">Free Webhooks Remaining</p>
              <p className="text-4xl font-bold text-white mt-2">{freeWebhooks}</p>
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
              style={{ width: `${(freeWebhooks / 50) * 100}%` }}
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
            <p className="text-white font-semibold">₹0.50</p>
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
            <p className="text-white font-semibold">₹1.00</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-ink-400">No transactions yet</p>
          <p className="text-ink-500 text-sm mt-1">Your transaction history will appear here</p>
        </div>
      </div>
    </div>
  );
}
