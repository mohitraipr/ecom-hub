"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Animated counter component
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-bold text-4xl md:text-5xl text-gray-900">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Service card component
function ServiceCard({
  title,
  description,
  icon,
  href,
  features,
  badge,
  pricing
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  features: string[];
  badge?: string;
  pricing?: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 h-full">
        {badge && (
          <div className={`absolute -top-3 right-4 px-3 py-1 ${
            badge === 'Popular' ? 'bg-emerald-500' :
            badge === 'New' ? 'bg-blue-500' :
            'bg-gray-700'
          } text-white text-xs font-bold rounded-full`}>
            {badge}
          </div>
        )}

        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
          <div className="text-emerald-600">
            {icon}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>

        <ul className="space-y-2 mb-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {pricing && (
          <div className="pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Starting at </span>
            <span className="font-semibold text-gray-900">{pricing}</span>
          </div>
        )}

        <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
          Learn more
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Trusted by 50+ E-commerce Sellers
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Automate your
              <span className="block text-emerald-600">e-commerce operations</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              All-in-one platform for Indian sellers. Inventory tracking, order management,
              QC automation, and AI cataloging — in one simple dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Start free trial
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
              >
                Sign in
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Bank-grade security
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                99.9% uptime
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay as you go
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter target={10000} suffix="+" />
                <p className="text-gray-500 text-sm mt-1">Orders processed</p>
              </div>
              <div>
                <AnimatedCounter target={500} suffix="+" />
                <p className="text-gray-500 text-sm mt-1">SKUs tracked</p>
              </div>
              <div>
                <AnimatedCounter target={5000} suffix="+" />
                <p className="text-gray-500 text-sm mt-1">Emails automated</p>
              </div>
              <div>
                <AnimatedCounter target={99} suffix="%" />
                <p className="text-gray-500 text-sm mt-1">Accuracy rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to scale
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive tools designed specifically for Indian e-commerce sellers.
              Works with Myntra, Ajio, Flipkart, Amazon, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Out of Stock */}
            <ServiceCard
              title="Out of Stock Monitor"
              description="Real-time inventory tracking with intelligent alerts based on production lead times."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              href="/dashboard/out-of-stock"
              features={[
                "Connect EasyEcom API",
                "Set making time per SKU",
                "RED/ORANGE/GREEN alerts",
                "Daily velocity tracking"
              ]}
              badge="Popular"
              pricing="₹0.50/webhook"
            />

            {/* Orders */}
            <ServiceCard
              title="Orders Dashboard"
              description="Track all marketplace orders in one unified dashboard with real-time status updates."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              href="/dashboard/orders"
              features={[
                "Multi-marketplace sync",
                "Order status tracking",
                "Shipment updates",
                "Analytics & reports"
              ]}
              pricing="₹0.50/order sync"
            />

            {/* Catalog AI */}
            <ServiceCard
              title="Catalog AI"
              description="AI-powered product cataloging. Upload images, get attributes automatically extracted."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              href="/dashboard/catalog"
              features={[
                "GPT-4o Vision AI",
                "Batch image processing",
                "Attribute extraction",
                "Export to CSV/Excel"
              ]}
              badge="New"
              pricing="₹1/3 images"
            />

            {/* QC Pass */}
            <ServiceCard
              title="QC Pass / RGP"
              description="Automate Myntra QC Pass submissions. Process RGP, RTO, and returns automatically."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              href="/dashboard/qc-pass"
              features={[
                "Browser automation",
                "Bulk tracking IDs",
                "Live progress view",
                "Export results"
              ]}
              badge="New"
              pricing="₹0.50/tracking ID"
            />

            {/* Ajio Mail */}
            <ServiceCard
              title="Ajio Mail Automation"
              description="Automatically respond to CCTV footage requests with matched return videos."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              href="/dashboard/ajio-mail"
              features={[
                "Zoho/Gmail integration",
                "Auto-extract Order ID",
                "S3 video matching",
                "Bulk email replies"
              ]}
              pricing="₹1/email reply"
            />

            {/* Coming Soon Card */}
            <div className="relative bg-gray-100 rounded-2xl p-6 border border-gray-200 h-full">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gray-400 text-white text-xs font-bold rounded-full">
                Coming Soon
              </div>

              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">More Services</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Flipkart Tickets, Myntra MOP, Shopify Returns, and more coming soon.
              </p>

              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Flipkart Ticket Automation
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Myntra MOP Management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get started in minutes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Simple setup process. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                desc: "Sign up in 30 seconds with just your email",
              },
              {
                step: "2",
                title: "Connect APIs",
                desc: "Link EasyEcom, Zoho Mail, or other services",
              },
              {
                step: "3",
                title: "Configure",
                desc: "Set your preferences, rules, and alerts",
              },
              {
                step: "4",
                title: "Automate",
                desc: "Let the platform handle the rest",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>

                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600 text-lg">
              Pay only for what you use. No monthly fees. No hidden charges.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pay-as-you-go</h3>
                  <p className="text-gray-500">Get 50 free webhooks to start</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">₹0</div>
                  <div className="text-sm text-gray-500">to get started</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Out of Stock webhook</span>
                  <span className="font-semibold text-gray-900">₹0.50</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Order sync</span>
                  <span className="font-semibold text-gray-900">₹0.50</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Catalog AI (3 images)</span>
                  <span className="font-semibold text-gray-900">₹1.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">QC Pass per ID</span>
                  <span className="font-semibold text-gray-900">₹0.50</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Email reply</span>
                  <span className="font-semibold text-gray-900">₹1.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-700">Free webhooks included</span>
                  <span className="font-bold text-emerald-700">50</span>
                </div>
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to automate your business?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join 50+ sellers who are saving hours every day with ecom-hub automation tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Get started for free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
