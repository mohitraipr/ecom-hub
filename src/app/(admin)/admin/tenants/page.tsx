'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTenants, TenantListItem } from '@/lib/api/admin';

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const loadTenants = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getTenants({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setTenants(data.tenants);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTenants(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'suspended':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-ink-700 text-ink-400 border-ink-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tenants</h1>
          <p className="text-ink-400 mt-1">Manage all registered sellers</p>
        </div>
        <span className="px-3 py-1 bg-ink-800 text-ink-300 rounded-full text-sm">
          {pagination.total} total
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-2 bg-ink-800 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-ink-800 border border-ink-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-ink-900/50 border border-ink-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ink-400">No tenants found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-ink-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Integrations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-ink-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium">{tenant.name}</p>
                      <p className="text-ink-500 text-sm">{tenant.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(tenant.status)}`}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className={`font-medium ${tenant.wallet.isPaused ? 'text-red-400' : 'text-white'}`}>
                        Rs{tenant.wallet.balance.toFixed(0)}
                      </p>
                      <p className="text-ink-500 text-sm">
                        {tenant.wallet.freeWebhooksRemaining} free left
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ink-300">
                    {tenant.integrationCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ink-400 text-sm">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/admin/tenants/${tenant.id}`}
                      className="text-saffron-500 hover:text-saffron-400 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-ink-800">
            <button
              onClick={() => loadTenants(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-lg bg-ink-800 text-ink-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-ink-400 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => loadTenants(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded-lg bg-ink-800 text-ink-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
