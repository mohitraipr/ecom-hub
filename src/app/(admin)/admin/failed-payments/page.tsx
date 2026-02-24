'use client';

import { useState, useEffect } from 'react';
import { getFailedPayments, resolveFailedPayment, FailedPayment } from '@/lib/api/admin';

export default function FailedPaymentsPage() {
  const [payments, setPayments] = useState<FailedPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolving, setResolving] = useState<number | null>(null);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setIsLoading(true);
      const data = await getFailedPayments(100);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResolve(paymentId: number) {
    const notes = prompt('Add resolution notes (optional):');
    if (notes === null) return; // User cancelled

    try {
      setResolving(paymentId);
      await resolveFailedPayment(paymentId, notes || undefined);
      // Refresh the list
      await loadPayments();
    } catch (err) {
      alert('Failed to resolve payment: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setResolving(null);
    }
  }

  const filteredPayments = showResolved
    ? payments
    : payments.filter(p => !p.resolved);

  const unresolvedCount = payments.filter(p => !p.resolved).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Failed Payments</h1>
          <p className="text-purple-300/60 mt-1">
            Track and resolve payment issues from tenants
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unresolvedCount > 0 && (
            <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="text-red-400 text-sm font-medium">
                {unresolvedCount} unresolved
              </span>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-purple-300">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded bg-purple-900/30 border-purple-500/30 text-purple-600 focus:ring-purple-500"
            />
            Show resolved
          </label>
        </div>
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="bg-[#1a1030] border border-purple-900/30 rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {showResolved ? 'No failed payments' : 'All caught up!'}
          </h3>
          <p className="text-purple-300/60">
            {showResolved
              ? 'No failed payment attempts have been recorded.'
              : 'No unresolved failed payments at the moment.'}
          </p>
        </div>
      )}

      {/* Payments Table */}
      {filteredPayments.length > 0 && (
        <div className="bg-[#1a1030] border border-purple-900/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-900/30">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Error
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-purple-900/10">
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-purple-300/60">
                        {new Date(payment.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-medium">
                        {payment.tenantName || 'Unknown'}
                      </div>
                      <div className="text-xs text-purple-300/60">
                        {payment.tenantEmail || `ID: ${payment.tenantId}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-semibold">
                        Rs{payment.amount.toFixed(2)}
                      </div>
                      {payment.razorpayOrderId && (
                        <div className="text-xs text-purple-300/60 font-mono">
                          {payment.razorpayOrderId.substring(0, 20)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-red-400 truncate" title={payment.errorMessage}>
                        {payment.errorMessage}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.resolved ? (
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Resolved
                          </span>
                          {payment.notes && (
                            <div className="text-xs text-purple-300/60 mt-1 truncate max-w-[150px]" title={payment.notes}>
                              {payment.notes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                          Unresolved
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!payment.resolved && (
                        <button
                          onClick={() => handleResolve(payment.id)}
                          disabled={resolving === payment.id}
                          className="px-3 py-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {resolving === payment.id ? 'Resolving...' : 'Mark Resolved'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-400">How to handle failed payments</h4>
            <p className="text-sm text-blue-300/60 mt-1">
              When a payment fails, verify the transaction in Razorpay dashboard. If the payment was actually successful,
              credit the tenant's wallet using the Tenant Management page, then mark this as resolved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
