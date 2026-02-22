'use client';

import Link from 'next/link';
import { LogoSimple } from '@/components/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] min-h-screen bg-ink-950 flex">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ink-900 to-ink-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center">
            <LogoSimple />
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Automate Your<br />
              <span className="text-saffron-500">E-commerce</span> Operations
            </h1>
            <p className="text-ink-300 text-lg leading-relaxed mb-8">
              Real-time inventory alerts, automated email responses, and powerful tools designed for Indian e-commerce sellers.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-ink-800/50 rounded-xl border border-ink-700/50">
                <div className="w-12 h-12 rounded-lg bg-saffron-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Out of Stock Management</h3>
                  <p className="text-ink-400 text-sm">Never miss a restock again</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-ink-800/50 rounded-xl border border-ink-700/50">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Ajio Mail Automation</h3>
                  <p className="text-ink-400 text-sm">Bulk reply with video links</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-ink-500 text-sm">
            &copy; {new Date().getFullYear()} ecom-hub.in. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-ink-950">
        {/* Mobile Header */}
        <header className="lg:hidden p-6 border-b border-ink-800">
          <Link href="/" className="flex items-center">
            <LogoSimple />
          </Link>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Mobile Footer */}
        <footer className="lg:hidden p-6 text-center border-t border-ink-800">
          <p className="text-ink-500 text-sm">
            &copy; {new Date().getFullYear()} ecom-hub.in. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
