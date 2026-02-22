import Link from "next/link";
import { Logo, LogoSimple } from "@/components/Logo";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e4de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/out-of-stock"
                className="text-[#64748b] hover:text-[#1a1a2e] transition-colors font-medium relative group"
              >
                Out of Stock
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff6b35] transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/ajio-mail"
                className="text-[#64748b] hover:text-[#1a1a2e] transition-colors font-medium relative group"
              >
                Ajio Mail
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00d9a5] transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/login"
                className="text-[#64748b] hover:text-[#1a1a2e] transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-saffron text-sm py-2.5 px-5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                href="/login"
                className="text-[#64748b] hover:text-[#1a1a2e] transition-colors font-medium text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#ff6b35] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <LogoSimple className="mb-4" />
              <p className="text-[#64748b] text-sm max-w-sm leading-relaxed">
                Powerful automation tools designed for Indian e-commerce sellers.
                Manage inventory, automate responses, and grow your business.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-4 text-[#ff6b35]">Features</h3>
              <ul className="space-y-3 text-[#94a3b8] text-sm">
                <li>
                  <Link href="/out-of-stock" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full" />
                    Out of Stock Management
                  </Link>
                </li>
                <li>
                  <Link href="/ajio-mail" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00d9a5] rounded-full" />
                    Ajio Mail Replying
                  </Link>
                </li>
                <li>
                  <Link href="/get-started" className="hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#64748b] rounded-full" />
                    Get Started Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-[#00d9a5]">Get in Touch</h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                Ready to automate your e-commerce operations?
                Check out our documentation to get started.
              </p>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 mt-4 text-[#ff6b35] hover:text-[#ff8c5a] transition-colors text-sm font-medium"
              >
                View Setup Guide
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="border-t border-[#2d2d44] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#64748b] text-sm">
              &copy; {new Date().getFullYear()} ecom-hub.in. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[#64748b] text-xs">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              Systems operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
