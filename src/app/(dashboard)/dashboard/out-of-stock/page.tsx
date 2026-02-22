'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/api/auth';
import { config } from '@/lib/config';

interface InventoryItem {
  sku: string;
  warehouse: string;
  inventory: number;
  makingTime: number;
  yesterdayOrders: number;
  daysLeft: number;
  status: 'red' | 'orange' | 'green';
}

export default function OutOfStockDashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasIntegration, setHasIntegration] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Check if there's an active integration
        const integrations = await authFetch<{ success: boolean; data: { integrations: { status: string }[] } }>(
          '/api/integrations'
        );

        const activeIntegration = integrations.data.integrations.find(
          (i) => i.status === 'active' || i.status === 'testing'
        );

        setHasIntegration(!!activeIntegration);

        if (activeIntegration) {
          // Fetch stock data from dashboard API
          const stockData = await authFetch<{ success: boolean; data: { stock: InventoryItem[] } }>(
            '/api/dashboard/stock'
          );
          setInventory(stockData.data.stock || []);
        }
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (config.apiBaseUrl) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'red': return 'bg-red-100 border-red-200 text-red-600';
      case 'orange': return 'bg-orange-100 border-orange-200 text-orange-600';
      case 'green': return 'bg-green-100 border-green-200 text-green-600';
      default: return 'bg-[#f1f5f9] border-[#e5e7eb] text-[#64748b]';
    }
  };

  const getRowColor = (status: string) => {
    switch (status) {
      case 'red': return 'bg-red-50';
      case 'orange': return 'bg-orange-50';
      case 'green': return 'bg-green-50';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#e5e7eb] rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#e5e7eb] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-[#e5e7eb] rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!hasIntegration) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Out of Stock Management</h1>
          <p className="text-[#64748b] mt-1">Monitor inventory levels and get alerts for low stock SKUs</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-saffron-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">Connect Your EasyEcom Account</h2>
          <p className="text-[#64748b] max-w-md mx-auto mb-6">
            To start monitoring your inventory levels, you need to connect your EasyEcom account first.
            This will enable real-time inventory tracking and low stock alerts.
          </p>
          <Link
            href="/dashboard/integrations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            Set Up Integration
          </Link>
        </div>
      </div>
    );
  }

  const redCount = inventory.filter((i) => i.status === 'red').length;
  const orangeCount = inventory.filter((i) => i.status === 'orange').length;
  const greenCount = inventory.filter((i) => i.status === 'green').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Out of Stock Management</h1>
          <p className="text-[#64748b] mt-1">Monitor inventory levels and get alerts for low stock SKUs</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#1a1a2e] rounded-lg hover:bg-[#f1f5f9] transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
          <p className="text-[#64748b] text-sm">Total SKUs</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{inventory.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
          <p className="text-red-600 text-sm">Critical (RED)</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{redCount}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm">
          <p className="text-orange-600 text-sm">Warning (ORANGE)</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{orangeCount}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <p className="text-green-600 text-sm">Safe (GREEN)</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{greenCount}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#e5e7eb]">
          <h2 className="text-lg font-semibold text-[#1a1a2e]">Inventory Status</h2>
        </div>

        {inventory.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#64748b]">No inventory data yet.</p>
            <p className="text-[#94a3b8] text-sm mt-1">
              Inventory will appear here once EasyEcom sends webhook data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#64748b] border-b border-[#e5e7eb] bg-[#f8f9fa]">
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Warehouse</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Making Time</th>
                  <th className="px-6 py-4 font-medium">Daily Orders</th>
                  <th className="px-6 py-4 font-medium">Days Left</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={index} className={`border-b border-[#e5e7eb] last:border-0 ${getRowColor(item.status)}`}>
                    <td className="px-6 py-4 font-mono text-sm text-[#1a1a2e]">{item.sku}</td>
                    <td className="px-6 py-4 text-[#64748b]">{item.warehouse}</td>
                    <td className="px-6 py-4 text-[#1a1a2e] font-medium">{item.inventory}</td>
                    <td className="px-6 py-4 text-[#64748b]">{item.makingTime} days</td>
                    <td className="px-6 py-4 text-[#64748b]">{item.yesterdayOrders}</td>
                    <td className="px-6 py-4">
                      <span className={item.daysLeft < 0 ? 'text-red-600 font-bold' : item.daysLeft < 5 ? 'text-orange-600 font-medium' : 'text-green-600'}>
                        {item.daysLeft < 0 ? item.daysLeft : `+${item.daysLeft}`} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
        <h3 className="text-[#1a1a2e] font-semibold mb-4">Status Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
            <div>
              <p className="text-red-600 font-medium">RED - Critical</p>
              <p className="text-[#64748b] text-sm">Reorder immediately! Stock will run out before production can complete.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-orange-500 mt-1" />
            <div>
              <p className="text-orange-600 font-medium">ORANGE - Warning</p>
              <p className="text-[#64748b] text-sm">Approaching reorder point. Plan production soon.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
            <div>
              <p className="text-green-600 font-medium">GREEN - Safe</p>
              <p className="text-[#64748b] text-sm">Sufficient stock. No action required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
