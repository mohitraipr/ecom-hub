"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { HeroVisualization } from "@/components/HeroVisualization";

// Scroll-triggered animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated counter component with scroll trigger
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;

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
  }, [target, isVisible]);

  return (
    <div ref={ref}>
      <span className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
    </div>
  );
}

// Service card component with animations
function ServiceCard({
  title,
  description,
  icon,
  href,
  features,
  badge,
  pricing,
  delay = 0
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  features: string[];
  badge?: string;
  pricing?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link href={href} className="group block h-full">
        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 h-full overflow-hidden">
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/30 transition-all duration-500" />

          {badge && (
            <div className={`absolute -top-0 right-4 px-3 py-1.5 ${
              badge === 'Popular' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
              badge === 'New' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
              'bg-gray-700'
            } text-white text-xs font-bold rounded-b-lg shadow-lg`}>
              {badge}
            </div>
          )}

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
              <div className="text-emerald-600">
                {icon}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>

            <ul className="space-y-2 mb-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {pricing && (
              <div className="pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Starting at </span>
                <span className="font-bold text-emerald-600">{pricing}</span>
              </div>
            )}

            <div className="mt-4 flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
              Explore
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(226 232 240) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(226 232 240) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Trusted by 50+ E-commerce Sellers
              </div>

              {/* Main heading with gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Automate your
                <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  e-commerce operations
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed">
                All-in-one platform for Indian sellers. Inventory tracking, order management,
                QC automation, and AI cataloging — in one simple dashboard.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]"
                >
                  Start free trial
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md"
                >
                  Sign in
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="font-medium">Bank-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">99.9% uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-medium">Pay as you go</span>
                </div>
              </div>
            </div>

            {/* Right content - Hero Visualization */}
            <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <HeroVisualization className="w-full max-w-lg mx-auto lg:max-w-none" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-gray-300 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <AnimatedCounter target={10000} suffix="+" />
              <p className="text-gray-500 text-sm mt-2 font-medium">Orders processed</p>
            </div>
            <div className="p-6">
              <AnimatedCounter target={500} suffix="+" />
              <p className="text-gray-500 text-sm mt-2 font-medium">SKUs tracked</p>
            </div>
            <div className="p-6">
              <AnimatedCounter target={5000} suffix="+" />
              <p className="text-gray-500 text-sm mt-2 font-medium">Emails automated</p>
            </div>
            <div className="p-6">
              <AnimatedCounter target={99} suffix="%" />
              <p className="text-gray-500 text-sm mt-2 font-medium">Accuracy rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">scale</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive tools designed specifically for Indian e-commerce sellers.
              Works with Myntra, Ajio, Flipkart, Amazon, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Out of Stock Monitor"
              description="Real-time inventory tracking with intelligent alerts based on production lead times."
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              delay={0}
            />

            <ServiceCard
              title="Orders Dashboard"
              description="Track all marketplace orders in one unified dashboard with real-time status updates."
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              delay={100}
            />

            <ServiceCard
              title="Catalog AI"
              description="AI-powered product cataloging. Upload images, get attributes automatically extracted."
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              delay={200}
            />

            <ServiceCard
              title="QC Pass / RGP"
              description="Automate Myntra QC Pass submissions. Process RGP, RTO, and returns automatically."
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              delay={300}
            />

            <ServiceCard
              title="Ajio Mail Automation"
              description="Automatically respond to CCTV footage requests with matched return videos."
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              delay={400}
            />

            {/* Coming Soon Card */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 border border-gray-200 h-full opacity-75">
              <div className="absolute top-0 right-4 px-3 py-1.5 bg-gray-400 text-white text-xs font-bold rounded-b-lg">
                Coming Soon
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">More Services</h3>
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
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get started in{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">minutes</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Simple setup process. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-200" />

            {[
              { step: "1", title: "Create Account", desc: "Sign up in 30 seconds with just your email", color: "from-emerald-500 to-emerald-600" },
              { step: "2", title: "Connect APIs", desc: "Link EasyEcom, Zoho Mail, or other services", color: "from-teal-500 to-teal-600" },
              { step: "3", title: "Configure", desc: "Set your preferences, rules, and alerts", color: "from-cyan-500 to-cyan-600" },
              { step: "4", title: "Automate", desc: "Let the platform handle the rest", color: "from-blue-500 to-blue-600" },
            ].map((item, i) => {
              const { ref, isVisible } = useScrollAnimation();
              return (
                <div
                  key={i}
                  ref={ref}
                  className={`relative text-center transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} text-white font-bold text-2xl flex items-center justify-center shadow-lg relative z-10`}>
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple,{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">transparent</span>{" "}
              pricing
            </h2>
            <p className="text-gray-600 text-lg">
              Pay only for what you use. No monthly fees. No hidden charges.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pay-as-you-go</h3>
                  <p className="text-gray-500">Get 50 free webhooks to start</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">₹0</div>
                  <div className="text-sm text-gray-500">to get started</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Out of Stock webhook", price: "₹0.50" },
                  { label: "Order sync", price: "₹0.50" },
                  { label: "Catalog AI (3 images)", price: "₹1.00" },
                  { label: "QC Pass per ID", price: "₹0.50" },
                  { label: "Email reply", price: "₹1.00" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.price}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 font-medium">Free webhooks included</span>
                  <span className="font-bold text-emerald-700 text-lg">50</span>
                </div>
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to automate your business?
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg">
            Join 50+ sellers who are saving hours every day with ecom-hub automation tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Get started for free
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/30"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
