import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { Logo, LogoSimple } from "@/components/Logo";

export const metadata: Metadata = {
  title: "ecom-hub.in | E-commerce Automation Tools",
  description: "Powerful automation tools for e-commerce sellers - Out of Stock Management, Ajio Mail Replying, and more. Built for Indian e-commerce businesses.",
  keywords: ["e-commerce", "automation", "inventory management", "email automation", "India", "EasyEcom", "Ajio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Clash Display from Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-outfit: 'Outfit', system-ui, sans-serif;
            --font-clash: 'Clash Display', system-ui, sans-serif;
          }
          body {
            font-family: var(--font-outfit);
          }
          .font-display {
            font-family: var(--font-clash);
          }
        `}</style>
      </head>
      <body className="antialiased">
        <Providers>
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
                  href="/get-started"
                  className="btn-saffron text-sm py-2.5 px-5"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Link
                  href="/get-started"
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
        </Providers>
      </body>
    </html>
  );
}
