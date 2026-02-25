'use client';

import { useState, useEffect } from 'react';
import { getTenants, TenantListItem } from '@/lib/api/admin';
import { getAdminWebhookLogs, WebhookLog } from '@/lib/api/webhooks';

export default function AdminWebhooksPage() {
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [selectedTenantName, setSelectedTenantName] = useState<string>('');
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [service, setService] = useState<'all' | 'out_of_stock' | 'orders'>('all');

  // Load tenants on mount
  useEffect(() => {
    async function loadTenants() {
      try {
        const data = await getTenants({ limit: 100 });
        setTenants(data.tenants);
      } catch (error) {
        console.error('Failed to load tenants:', error);
      } finally {
        setTenantsLoading(false);
      }
    }
    loadTenants();
  }, []);

  // Load webhook logs when tenant is selected
  useEffect(() => {
    async function loadLogs() {
      if (!selectedTenant) {
        setLogs([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getAdminWebhookLogs(selectedTenant, {
          page,
          limit: 20,
          service: service === 'all' ? undefined : service,
        });
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        setSelectedTenantName(data.tenant.name);
      } catch (error) {
        console.error('Failed to load webhook logs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [selectedTenant, page, service]);

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Webhook Logs</h1>
        <p className="text-ink-400 mt-1">View incoming EasyEcom webhook data by tenant</p>
      </div>

      {/* Tenant Selector */}
      <div className="bg-ink-800/50 border border-ink-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-ink-400 mb-2">Select Tenant</label>
            <select
              value={selectedTenant}
              onChange={(e) => {
                setSelectedTenant(e.target.value);
                setPage(1);
              }}
              disabled={tenantsLoading}
              className="w-full px-4 py-2 bg-ink-900 border border-ink-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="">
                {tenantsLoading ? 'Loading tenants...' : 'Select a tenant...'}
              </option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.email})
                </option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm text-ink-400 mb-2">Service Filter</label>
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value as typeof service);
                setPage(1);
              }}
              disabled={!selectedTenant}
              className="w-full px-4 py-2 bg-ink-900 border border-ink-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 disabled:opacity-50"
            >
              <option value="all">All Services</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="orders">Orders</option>
            </select>
          </div>
        </div>

        {selectedTenant && (
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-ink-400">
              Showing webhooks for <span className="text-white font-medium">{selectedTenantName}</span>
            </span>
            <span className="text-ink-500">|</span>
            <span className="text-ink-400">
              {total.toLocaleString()} total records
            </span>
          </div>
        )}
      </div>

      {/* Logs Table */}
      {!selectedTenant ? (
        <div className="bg-ink-800/50 border border-ink-700 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-ink-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-ink-400">Select a tenant to view their webhook logs</p>
        </div>
      ) : loading ? (
        <div className="bg-ink-800/50 border border-ink-700 rounded-xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-400">Loading webhook logs...</p>
        </div>
      ) : (
        <div className="bg-ink-800/50 border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-ink-900/50 border-b border-ink-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Summary</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-ink-400">
                    No webhooks received for this tenant yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <>
                    <tr key={log.id} className="hover:bg-ink-700/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-ink-300">
                        {formatDate(log.receivedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.service === 'out_of_stock'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}>
                          {log.service === 'out_of_stock' ? 'Out of Stock' : 'Orders'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {log.service === 'out_of_stock' ? (
                          <span>
                            SKU: <span className="text-saffron-400">{log.summary.sku}</span> |
                            Inventory: <span className="text-saffron-400">{log.summary.inventory}</span>
                          </span>
                        ) : (
                          <span>
                            Order: <span className="text-saffron-400">{log.summary.orderId}</span> |
                            {log.summary.marketplace} |
                            Status: <span className="text-saffron-400">{log.summary.status}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="text-sm text-saffron-400 hover:text-saffron-300 font-medium"
                        >
                          {expandedId === log.id ? 'Hide' : 'View'} Raw Data
                        </button>
                      </td>
                    </tr>
                    {expandedId === log.id && (
                      <tr key={`${log.id}-expanded`}>
                        <td colSpan={4} className="px-4 py-4 bg-ink-900/50">
                          <div className="bg-ink-950 rounded-lg p-4 overflow-x-auto">
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-ink-700 bg-ink-900/50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-ink-600 rounded-lg text-ink-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-700"
              >
                Previous
              </button>
              <span className="text-sm text-ink-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-ink-600 rounded-lg text-ink-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
