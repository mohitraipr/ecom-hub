'use client';

import Link from 'next/link';

export default function AjioMailDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Ajio Mail Automation</h1>
        <p className="text-[#64748b] mt-1">Automate bulk email responses for Ajio return requests</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center shadow-sm">
        <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Coming Soon
        </div>
        <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">This feature is under development</h2>
        <p className="text-[#64748b] max-w-md mx-auto mb-6">
          Ajio Mail Automation will help you respond to return requests in bulk with personalized video links.
          We&apos;re working hard to bring this feature to you soon.
        </p>
      </div>

      {/* Feature Preview */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">What to expect</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-[#1a1a2e]">Bulk Upload</h4>
              <p className="text-sm text-[#64748b]">Upload return request emails in bulk via CSV</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-[#1a1a2e]">Video Links</h4>
              <p className="text-sm text-[#64748b]">Auto-attach product video links to responses</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-[#1a1a2e]">Auto Send</h4>
              <p className="text-sm text-[#64748b]">Automatically send responses via Gmail/Outlook</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#1a1a2e] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
