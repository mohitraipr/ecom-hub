'use client';

import Link from 'next/link';

export default function FlipkartTicketPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Flipkart Ticket Automation</h1>
        <p className="text-[#8b9dc3] mt-1">Automate Flipkart seller support ticket management</p>
      </div>

      <div className="bg-gradient-to-br from-[#1e2533] to-[#252d3a] border border-[#2a3441] rounded-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-[#8b9dc3] max-w-lg mx-auto mb-6">
          Automatically raise and manage Flipkart seller support tickets for returns, refunds, and disputes.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a3441] rounded-full text-sm text-[#8b9dc3]">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          Under Development
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Bulk Ticket Creation</h3>
          <p className="text-[#8b9dc3] text-sm">Create multiple support tickets from CSV upload</p>
        </div>
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Auto Status Tracking</h3>
          <p className="text-[#8b9dc3] text-sm">Monitor ticket status and get notifications</p>
        </div>
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Template Responses</h3>
          <p className="text-[#8b9dc3] text-sm">Use pre-built templates for common issues</p>
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
