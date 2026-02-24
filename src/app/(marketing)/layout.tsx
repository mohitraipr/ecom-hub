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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ecom-hub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  onBlur={() => setTimeout(() => setServicesOpen(false), 200)}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50"
                >
                  Services
                  <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{service.name}</span>
                            {service.badge && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                                {service.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                      <Link
                        href="/register"
                        className="flex items-center gap-2 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        <span>View all services</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/#pricing"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50"
              >
                Pricing
              </Link>

              <div className="w-px h-6 bg-gray-200 mx-2" />

              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Login
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Services</p>
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{service.name}</span>
                  {service.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
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
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="font-bold text-xl">ecom-hub</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automation tools for Indian e-commerce sellers. Save hours every day.
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link href="/dashboard/out-of-stock" className="hover:text-white transition-colors">
                    Out of Stock Monitor
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/orders" className="hover:text-white transition-colors">
                    Orders Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/catalog" className="hover:text-white transition-colors flex items-center gap-2">
                    Catalog AI
                    <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">New</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/qc-pass" className="hover:text-white transition-colors flex items-center gap-2">
                    QC Pass / RGP
                    <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">New</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/ajio-mail" className="hover:text-white transition-colors">
                    Ajio Mail Automation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Get Started</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Start automating your e-commerce operations today. Free to try.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Start Free Trial
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ecom-hub.in. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
