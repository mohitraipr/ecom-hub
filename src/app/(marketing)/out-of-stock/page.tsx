"use client";

import { useState } from "react";
import Link from "next/link";
import { useStockMarket } from "@/lib/hooks/useStockMarket";
import { periodOptions } from "@/lib/api/stock-market";
import { StockPeriod } from "@/lib/api/types";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { ConnectionStatus } from "@/components/ConnectionStatus";

const steps = [
  {
    number: 1,
    title: "Get EasyEcom API Access",
    description: "Contact EasyEcom support to get your API access token. This token is used for webhook authentication.",
    details: [
      "Email: support@easyecom.io",
      "Request: API access token for inventory webhooks",
      "You'll receive a Bearer token like: ee_live_abc123xyz..."
    ],
    credentials: ["EASYECOM_ACCESS_TOKEN"]
  },
  {
    number: 2,
    title: "Configure Webhook URL",
    description: "Tell EasyEcom where to send inventory and order updates. They'll push data to your server automatically.",
    details: [
      "Inventory Webhook: POST https://your-domain/webhook/inventory",
      "Order Webhook: POST https://your-domain/webhook/order",
      "Both use Access-Token header for authentication"
    ],
    credentials: []
  },
  {
    number: 3,
    title: "Set Up Database Tables",
    description: "Run the SQL migration to create the necessary tables for storing inventory snapshots and health data.",
    details: [
      "ee_inventory_snapshots - Raw inventory data from EasyEcom",
      "ee_orders / ee_suborders - Order data for DRR calculation",
      "ee_replenishment_rules - Making time and thresholds per SKU",
      "ee_inventory_health - Calculated status (RED/ORANGE/GREEN)"
    ],
    credentials: ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"]
  },
  {
    number: 4,
    title: "Configure Making Times",
    description: "Set the production lead time for each SKU. This is crucial for calculating when to reorder.",
    details: [
      "Making Time = Days needed to produce/restock an item",
      "Example: If SKU takes 5 days to make, set making_time = 5",
      "Bulk upload via CSV: SKU, Warehouse, Making_Time_Days"
    ],
    credentials: []
  },
  {
    number: 5,
    title: "Monitor the Dashboard",
    description: "View real-time inventory status and take action before running out of stock.",
    details: [
      "RED: Inventory critical - need to reorder immediately",
      "ORANGE: Warning zone - approaching reorder point",
      "GREEN: Safe - sufficient stock above reorder point"
    ],
    credentials: []
  }
];

export default function OutOfStockPage() {
  const [activeStep, setActiveStep] = useState(1);
  const { data, loading, error, isDemo, refetch, period, setPeriod } = useStockMarket('1d');

  const inventoryData = data?.inventory || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "red": return "bg-red-50 text-red-900 border-red-200";
      case "orange": return "bg-orange-50 text-orange-900 border-orange-200";
      case "green": return "bg-green-50 text-green-900 border-green-200";
      default: return "bg-gray-50 text-gray-900";
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Demo Mode Banner */}
      {isDemo && <DemoModeBanner error={error} />}

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#ff6b35] to-[#e85a2a] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-orange-100 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold">Out of Stock Management</h1>
              <p className="text-orange-100 mt-1">Real-time inventory monitoring with intelligent alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#e8e4de] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8">
            <a href="#demo" className="py-4 border-b-2 border-[#ff6b35] text-[#ff6b35] font-medium">
              Live Demo
            </a>
            <a href="#setup" className="py-4 border-b-2 border-transparent text-[#64748b] hover:text-[#1a1a2e] font-medium">
              Setup Guide
            </a>
            <a href="#flow" className="py-4 border-b-2 border-transparent text-[#64748b] hover:text-[#1a1a2e] font-medium">
              How It Works
            </a>
            <a href="#credentials" className="py-4 border-b-2 border-transparent text-[#64748b] hover:text-[#1a1a2e] font-medium">
              Credentials
            </a>
          </nav>
        </div>
      </div>

      {/* Live Demo Section */}
      <section id="demo" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">Live Demo: Inventory Runway Dashboard</h2>
              <p className="text-[#64748b]">
                This is how your inventory health dashboard looks. The system calculates days until stockout based on
                making time and daily order velocity.
              </p>
            </div>
            <ConnectionStatus isDemo={isDemo} lastUpdated={data?.lastUpdated} />
          </div>

          {/* Demo Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e8e4de] overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                <span className="ml-4 text-sm text-gray-300">Stock Market Dashboard</span>
              </div>
              <div className="flex items-center gap-4">
                {/* Period Selector */}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as StockPeriod)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                >
                  {periodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Refresh Button */}
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-[#faf8f5] border-b border-[#e8e4de]">
              <div className="bg-white rounded-xl p-4 border border-[#e8e4de] shadow-sm">
                <div className="text-sm text-[#64748b] mb-1">Total SKUs Tracked</div>
                <div className="text-2xl font-bold text-[#1a1a2e]">{loading ? '...' : inventoryData.length}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#e8e4de] shadow-sm">
                <div className="text-sm text-[#64748b] mb-1">Critical (RED)</div>
                <div className="text-2xl font-bold text-[#ef4444]">
                  {loading ? '...' : inventoryData.filter(d => d.status === "red").length}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#e8e4de] shadow-sm">
                <div className="text-sm text-[#64748b] mb-1">Warning (ORANGE)</div>
                <div className="text-2xl font-bold text-[#f97316]">
                  {loading ? '...' : inventoryData.filter(d => d.status === "orange").length}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#e8e4de] shadow-sm">
                <div className="text-sm text-[#64748b] mb-1">Safe (GREEN)</div>
                <div className="text-2xl font-bold text-[#22c55e]">
                  {loading ? '...' : inventoryData.filter(d => d.status === "green").length}
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-[#64748b] border-b border-[#e8e4de]">
                      <th className="pb-3 font-medium">SKU</th>
                      <th className="pb-3 font-medium">Warehouse</th>
                      <th className="pb-3 font-medium">
                        <span className="inline-flex items-center gap-1">
                          Current Stock
                          <span className="tooltip">
                            <svg className="w-4 h-4 text-[#64748b] cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="tooltip-text">Current inventory level received from EasyEcom webhook</span>
                          </span>
                        </span>
                      </th>
                      <th className="pb-3 font-medium">
                        <span className="inline-flex items-center gap-1">
                          Making Time
                          <span className="tooltip">
                            <svg className="w-4 h-4 text-[#64748b] cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="tooltip-text">Days required to produce/restock this SKU. Set by admin based on production capacity.</span>
                          </span>
                        </span>
                      </th>
                      <th className="pb-3 font-medium">
                        <span className="inline-flex items-center gap-1">
                          Yesterday Orders
                          <span className="tooltip">
                            <svg className="w-4 h-4 text-[#64748b] cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="tooltip-text">Number of units ordered yesterday. Used to calculate daily run rate.</span>
                          </span>
                        </span>
                      </th>
                      <th className="pb-3 font-medium">
                        <span className="inline-flex items-center gap-1">
                          Days Left
                          <span className="tooltip">
                            <svg className="w-4 h-4 text-[#64748b] cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="tooltip-text">Days until stockout, accounting for making time. Negative means you should have ordered already! Formula: (Inventory / Daily Orders) - Making Time</span>
                          </span>
                        </span>
                      </th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((item, i) => (
                      <tr key={i} className={`border-b border-[#e8e4de] last:border-0 ${getStatusColor(item.status)} transition-colors`}>
                        <td className="py-4 font-mono text-sm font-medium">{item.sku}</td>
                        <td className="py-4">{item.warehouse}</td>
                        <td className="py-4 font-medium">{item.inventory}</td>
                        <td className="py-4">{item.makingTime} days</td>
                        <td className="py-4">{item.yesterdayOrders}</td>
                        <td className="py-4">
                          <span className={`font-bold ${item.daysLeft < 0 ? "text-[#ef4444]" : item.daysLeft < 5 ? "text-[#f97316]" : "text-[#22c55e]"}`}>
                            {item.daysLeft < 0 ? item.daysLeft : `+${item.daysLeft}`} days
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "red" ? "bg-[#ef4444] text-white" :
                            item.status === "orange" ? "bg-[#f97316] text-white" :
                            "bg-[#22c55e] text-white"
                          }`}>
                            <span className="w-2 h-2 rounded-full bg-white/50"></span>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-xl p-6 border border-[#e8e4de]">
            <h3 className="font-semibold text-[#1a1a2e] mb-4">Status Legend</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="w-4 h-4 rounded-full bg-[#ef4444] mt-0.5"></div>
                <div>
                  <div className="font-medium text-red-800">RED - Critical</div>
                  <div className="text-sm text-red-600">Reorder immediately! Stock will run out before production can complete.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-4 h-4 rounded-full bg-[#f97316] mt-0.5"></div>
                <div>
                  <div className="font-medium text-orange-800">ORANGE - Warning</div>
                  <div className="text-sm text-orange-600">Approaching reorder point. Plan production soon.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-4 h-4 rounded-full bg-[#22c55e] mt-0.5"></div>
                <div>
                  <div className="font-medium text-green-800">GREEN - Safe</div>
                  <div className="text-sm text-green-600">Sufficient stock. No action required.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section id="setup" className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">Setup Guide</h2>
            <p className="text-[#64748b]">Follow these steps to set up Out of Stock Management for your store.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Steps List */}
            <div className="lg:col-span-1 space-y-3">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    activeStep === step.number
                      ? "bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20"
                      : "bg-[#faf8f5] hover:bg-[#f0ede8] text-[#1a1a2e]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      activeStep === step.number ? "bg-white text-[#ff6b35]" : "bg-[#ff6b35]/10 text-[#ff6b35]"
                    }`}>
                      {step.number}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Step Details */}
            <div className="lg:col-span-2">
              {steps.filter(s => s.number === activeStep).map((step) => (
                <div key={step.number} className="bg-[#faf8f5] rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a2e]">{step.title}</h3>
                  </div>

                  <p className="text-[#64748b] mb-6">{step.description}</p>

                  <div className="space-y-3 mb-6">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e8e4de]">
                        <svg className="w-5 h-5 text-[#ff6b35] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#1a1a2e]">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {step.credentials.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Required Credentials
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {step.credentials.map((cred, i) => (
                          <code key={i} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm font-mono">
                            {cred}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Flow Diagram */}
      <section id="flow" className="py-12 px-4 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">How It Works</h2>
            <p className="text-[#64748b]">Understanding the data flow from EasyEcom to your dashboard.</p>
          </div>

          {/* Flow Diagram */}
          <div className="bg-white rounded-2xl p-8 border border-[#e8e4de] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[800px]">
              {/* EasyEcom */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-300">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="mt-3 text-center">
                  <div className="font-semibold text-[#1a1a2e]">EasyEcom</div>
                  <div className="text-xs text-[#64748b]">Marketplace Aggregator</div>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="text-[#e8e4de] text-2xl">→</div>
                <div className="text-xs text-[#64748b] mt-1">Webhook POST</div>
              </div>

              {/* Webhook Handler */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center border-2 border-purple-300">
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-3 text-center">
                  <div className="font-semibold text-[#1a1a2e]">Webhook Handler</div>
                  <div className="text-xs text-[#64748b]">/webhook/inventory</div>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="text-[#e8e4de] text-2xl">→</div>
                <div className="text-xs text-[#64748b] mt-1">Queue Update</div>
              </div>

              {/* Health Queue */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-[#fff5f0] rounded-2xl flex items-center justify-center border-2 border-[#ffceb3]">
                  <svg className="w-12 h-12 text-[#ff6b35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mt-3 text-center">
                  <div className="font-semibold text-[#1a1a2e]">Health Queue</div>
                  <div className="text-xs text-[#64748b]">Batches every 30s</div>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="text-[#e8e4de] text-2xl">→</div>
                <div className="text-xs text-[#64748b] mt-1">Calculate Status</div>
              </div>

              {/* Dashboard */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center border-2 border-green-300">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="mt-3 text-center">
                  <div className="font-semibold text-[#1a1a2e]">Dashboard</div>
                  <div className="text-xs text-[#64748b]">RED/ORANGE/GREEN</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Formula */}
          <div className="mt-8 bg-white rounded-2xl p-8 border border-[#e8e4de]">
            <h3 className="font-bold text-[#1a1a2e] mb-6">Status Calculation Formula</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-[#64748b] mb-3">Step 1: Calculate Reorder Point</h4>
                <div className="bg-[#1a1a2e] p-4 rounded-lg font-mono text-sm">
                  <div className="text-[#00d9a5]">reorder_point = making_time × daily_orders</div>
                  <div className="text-[#64748b] mt-2">// Example: 5 days × 8 orders/day = 40 units</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#64748b] mb-3">Step 2: Calculate Days Until Production Needed</h4>
                <div className="bg-[#1a1a2e] p-4 rounded-lg font-mono text-sm">
                  <div className="text-[#00d9a5]">days_left = (inventory - reorder_point) ÷ daily_orders</div>
                  <div className="text-[#64748b] mt-2">// Example: (15 - 40) ÷ 8 = -3 days (RED!)</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="font-semibold text-amber-800 mb-2">Why This Matters</div>
              <p className="text-amber-700 text-sm">
                A negative &quot;days left&quot; means you&apos;ve already missed the window to start production.
                Even if you start making the product today, you&apos;ll run out of stock before it&apos;s ready.
                This is why we show RED status - immediate action required!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section id="credentials" className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">Required Credentials</h2>
            <p className="text-[#64748b]">Environment variables needed to run the Out of Stock feature.</p>
          </div>

          <div className="bg-[#1a1a2e] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
            <div className="text-[#64748b] mb-4"># .env file</div>

            <div className="space-y-4">
              <div>
                <div className="text-[#64748b]"># EasyEcom Integration</div>
                <div><span className="text-[#00d9a5]">EASYECOM_ACCESS_TOKEN</span>=<span className="text-[#ff6b35]">ee_live_your_token_here</span></div>
              </div>

              <div>
                <div className="text-[#64748b]"># Database Connection</div>
                <div><span className="text-[#00d9a5]">DB_HOST</span>=<span className="text-[#ff6b35]">your-database-host.com</span></div>
                <div><span className="text-[#00d9a5]">DB_USER</span>=<span className="text-[#ff6b35]">your_db_username</span></div>
                <div><span className="text-[#00d9a5]">DB_PASSWORD</span>=<span className="text-[#ff6b35]">your_db_password</span></div>
                <div><span className="text-[#00d9a5]">DB_NAME</span>=<span className="text-[#ff6b35]">your_database_name</span></div>
              </div>

              <div>
                <div className="text-[#64748b]"># Optional: GCP Cloud SQL (if using Google Cloud)</div>
                <div><span className="text-[#00d9a5]">GOOGLE_CLOUD_PROJECT</span>=<span className="text-[#ff6b35]">your-project-id</span></div>
                <div><span className="text-[#00d9a5]">CLOUDSQL_CONNECTION_NAME</span>=<span className="text-[#ff6b35]">project:region:instance</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-semibold text-blue-800">How to Get EasyEcom Token</div>
                <p className="text-blue-700 text-sm mt-1">
                  Contact EasyEcom support at <span className="font-medium">support@easyecom.io</span> and request
                  API access for inventory webhooks. They will provide you with a Bearer token for authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#ff6b35] to-[#e85a2a] rounded-2xl p-10 text-white">
            <h2 className="font-display text-2xl font-bold mb-4">Ready to Set Up?</h2>
            <p className="text-orange-100 mb-6">
              Follow the setup guide above or get in touch for personalized assistance.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/get-started"
                className="inline-flex items-center px-6 py-3 bg-white text-[#ff6b35] font-semibold rounded-xl hover:bg-orange-50 transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/ajio-mail"
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
              >
                Explore Ajio Mail →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
