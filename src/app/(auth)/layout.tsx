import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center">
            <Logo size="md" variant="dark" />
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4 font-display">
              Automate Your E-commerce Operations
            </h1>
            <p className="text-ink-400 text-lg leading-relaxed">
              Real-time inventory alerts, automated email responses, and powerful tools designed for Indian e-commerce sellers.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-saffron-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-ink-300">Out of Stock Management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-ink-300">Ajio Mail Automation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-ink-300">Pay-per-use Billing</span>
              </div>
            </div>
          </div>

          <p className="text-ink-500 text-sm">
            &copy; {new Date().getFullYear()} ecom-hub.in
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-ink-950">
        {/* Mobile Header */}
        <header className="lg:hidden p-6 border-b border-ink-800">
          <Link href="/" className="flex items-center">
            <Logo size="sm" variant="dark" />
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
