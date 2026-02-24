'use client';

import Link from 'next/link';

export default function MyntraBrokennessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Myntra Brokenness & Ranking</h1>
        <p className="text-[#8b9dc3] mt-1">Monitor and improve your Myntra seller metrics</p>
      </div>

      <div className="bg-gradient-to-br from-[#1e2533] to-[#252d3a] border border-[#2a3441] rounded-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-[#8b9dc3] max-w-lg mx-auto mb-6">
          Track your brokenness rates, seller ranking, and quality metrics. Get alerts and actionable insights to improve performance.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a3441] rounded-full text-sm text-[#8b9dc3]">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          Under Development
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Brokenness Tracking</h3>
          <p className="text-[#8b9dc3] text-sm">Monitor return rates due to damage and quality issues</p>
        </div>
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Ranking Analytics</h3>
          <p className="text-[#8b9dc3] text-sm">Track your seller ranking and visibility scores</p>
        </div>
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Improvement Alerts</h3>
          <p className="text-[#8b9dc3] text-sm">Get notifications when metrics drop below thresholds</p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#2bbd5e] hover:text-[#25a852]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
