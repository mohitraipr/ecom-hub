"use client";

import Link from "next/link";
import { useState } from "react";

const services = [
  { name: "Out of Stock", href: "/dashboard/out-of-stock", description: "Inventory tracking & alerts" },
  { name: "Orders", href: "/dashboard/orders", description: "Multi-marketplace order management" },
  { name: "Catalog AI", href: "/dashboard/catalog", description: "AI-powered product cataloging", badge: "New" },
  { name: "QC Pass", href: "/dashboard/qc-pass", description: "Myntra QC automation", badge: "New" },
  { name: "Ajio Mail", href: "/dashboard/ajio-mail", description: "Email automation with videos" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-gray-900">ecom-hub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  onBlur={() => setTimeout(() => setServicesOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Services
                  <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{service.name}</span>
                            {service.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">
                                {service.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{service.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/#pricing"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Pricing
              </Link>

              <div className="w-px h-5 bg-gray-200 mx-2" />

              <Link
                href="/login"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="ml-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Sign in
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Services</p>
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">{service.name}</span>
                  {service.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">
                      {service.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg"
              >
                Get started free
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-semibold">ecom-hub</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automation tools for Indian e-commerce sellers.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-medium mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard/out-of-stock" className="hover:text-white">Out of Stock Monitor</Link></li>
                <li><Link href="/dashboard/orders" className="hover:text-white">Orders Dashboard</Link></li>
                <li><Link href="/dashboard/catalog" className="hover:text-white">Catalog AI</Link></li>
                <li><Link href="/dashboard/qc-pass" className="hover:text-white">QC Pass / RGP</Link></li>
                <li><Link href="/dashboard/ajio-mail" className="hover:text-white">Ajio Mail</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
                <li><Link href="/register" className="hover:text-white">Create account</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h3 className="font-medium mb-4">Get started</h3>
              <p className="text-gray-400 text-sm mb-4">
                Start automating your e-commerce operations today.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
              >
                Start free trial
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ecom-hub.in
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
