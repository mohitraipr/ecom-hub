'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getOrders, Order, OrdersParams } from '@/lib/api/orders';
import Link from 'next/link';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<OrdersParams>({
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getOrders(filters);
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isAuthenticated, filters]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return '-';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('complete')) return 'bg-green-100 text-green-700';
    if (s.includes('cancel') || s.includes('return')) return 'bg-red-100 text-red-700';
    if (s.includes('ship') || s.includes('transit')) return 'bg-blue-100 text-blue-700';
    if (s.includes('pending') || s.includes('process')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2bbd5e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => setFilters({ ...filters })}
            className="px-4 py-2 bg-[#2bbd5e] text-white rounded-lg hover:bg-[#25a352] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a1a2e]">Orders</h1>
            <p className="text-[#64748b] mt-1">View orders received from EasyEcom</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-12 text-center">
          <div className="w-16 h-16 bg-[#2bbd5e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2bbd5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">No Orders Yet</h3>
          <p className="text-[#64748b] mb-6 max-w-md mx-auto">
            Orders will appear here once EasyEcom sends order webhook data. Make sure you have configured the Order webhook URL in EasyEcom.
          </p>
          <Link
            href="/dashboard/integrations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2bbd5e] text-white rounded-lg hover:bg-[#25a352] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Check Integrations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Orders</h1>
          <p className="text-[#64748b] mt-1">
            {pagination.total.toLocaleString()} orders from EasyEcom
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <span className="w-2 h-2 bg-[#2bbd5e] rounded-full animate-pulse"></span>
          Live from EasyEcom
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e5e7eb]">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  SKUs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-[#1a1a2e]">
                      {order.orderId}
                    </span>
                    {order.referenceCode && (
                      <span className="block text-xs text-[#64748b] mt-0.5">
                        {order.referenceCode}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a2e]">
                      {order.marketplace || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a2e]">
                      {formatDate(order.orderDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-[#1a1a2e]">
                      {formatAmount(order.totalAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-[#2bbd5e]/10 text-[#2bbd5e] rounded-full">
                      {order.suborderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#64748b] truncate block max-w-[200px]" title={order.skus || ''}>
                      {order.skus || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#e5e7eb] flex items-center justify-between">
            <p className="text-sm text-[#64748b]">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total.toLocaleString()} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm border border-[#e5e7eb] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-[#64748b]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-[#e5e7eb] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
