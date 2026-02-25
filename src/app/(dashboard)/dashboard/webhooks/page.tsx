'use client';

import { useState, useEffect } from 'react';
import { getWebhookLogs, getWebhookStats, WebhookLog, WebhookStats } from '@/lib/api/webhooks';
import { config } from '@/lib/config';

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [service, setService] = useState<'all' | 'out_of_stock' | 'orders'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [logsData, statsData] = await Promise.all([
          getWebhookLogs({
            page,
            limit: 20,
            service: service === 'all' ? undefined : service,
          }),
          getWebhookStats(),
        ]);
        setLogs(logsData.logs);
        setTotalPages(logsData.pagination.totalPages);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch webhook logs:', error);
      } finally {
        setLoading(false);
      }
    }

    if (config.apiBaseUrl) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [page, service]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#e5e7eb] rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#e5e7eb] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-[#e5e7eb] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Incoming Webhooks</h1>
        <p className="text-[#64748b] mt-1">View all incoming data from EasyEcom integrations</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Out of Stock Webhooks</p>
                <p className="text-2xl font-bold text-[#1a1a2e]">{stats.outOfStock.total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-2">Last: {formatTimeAgo(stats.outOfStock.lastReceived)}</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Orders Webhooks</p>
                <p className="text-2xl font-bold text-[#1a1a2e]">{stats.orders.total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-2">Last: {formatTimeAgo(stats.orders.lastReceived)}</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Cost (24h)</p>
                <p className="text-2xl font-bold text-[#1a1a2e]">
                  Rs{stats.usageLast24h.reduce((sum, u) => sum + u.totalCost, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-2">
              {stats.usageLast24h.reduce((sum, u) => sum + u.count, 0)} webhooks processed
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-[#64748b]">Filter by service:</label>
        <select
          value={service}
          onChange={(e) => {
            setService(e.target.value as typeof service);
            setPage(1);
          }}
          className="px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
        >
          <option value="all">All Services</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="orders">Orders</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Summary</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[#64748b]">
                  No webhooks received yet. Connect your EasyEcom integration to start receiving data.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <>
                  <tr key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 text-sm text-[#64748b]">
                      {formatDate(log.receivedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.service === 'out_of_stock'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.service === 'out_of_stock' ? 'Out of Stock' : 'Orders'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1a1a2e]">
                      {log.service === 'out_of_stock' ? (
                        <span>
                          SKU: <strong>{log.summary.sku}</strong> |
                          Inventory: <strong>{log.summary.inventory}</strong>
                        </span>
                      ) : (
                        <span>
                          Order: <strong>{log.summary.orderId}</strong> |
                          {log.summary.marketplace} |
                          Status: <strong>{log.summary.status}</strong>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="text-sm text-saffron-600 hover:text-saffron-700 font-medium"
                      >
                        {expandedId === log.id ? 'Hide' : 'View'} Raw Data
                      </button>
                    </td>
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`${log.id}-expanded`}>
                      <td colSpan={4} className="px-4 py-4 bg-[#f8fafc]">
                        <div className="bg-[#1a1a2e] rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                            {JSON.stringify(log.rawData, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb] bg-[#f8fafc]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-[#e5e7eb] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
            >
              Previous
            </button>
            <span className="text-sm text-[#64748b]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border border-[#e5e7eb] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
