import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ecom-hub.in | E-commerce Automation Tools",
  description: "Powerful automation tools for e-commerce sellers - Out of Stock Management, Ajio Mail Replying, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-semibold text-lg">ecom-hub.in</span>
              </Link>

              <div className="flex items-center gap-6">
                <Link href="/out-of-stock" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Out of Stock
                </Link>
                <Link href="/ajio-mail" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Ajio Mail
                </Link>
                <Link
                  href="/get-started"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="font-semibold text-lg">ecom-hub.in</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Powerful automation tools for e-commerce sellers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/out-of-stock" className="hover:text-white transition-colors">Out of Stock Management</Link></li>
                  <li><Link href="/ajio-mail" className="hover:text-white transition-colors">Ajio Mail Replying</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <p className="text-gray-400 text-sm">
                  Questions? Reach out to get started with your automation journey.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              © 2026 ecom-hub.in. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
