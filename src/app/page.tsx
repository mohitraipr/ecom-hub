"use client";

import Link from "next/link";
import { HeroVisualization } from "@/components/HeroVisualization";
import { GrainSection } from "@/components/GrainOverlay";
import { useEffect, useState } from "react";

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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
    <span className="font-display font-bold text-3xl md:text-4xl text-[#1a1a2e]">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <GrainSection opacity={0.02} />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up">
                <span className="w-2 h-2 bg-[#00d9a5] rounded-full animate-pulse" />
                E-commerce Automation Platform
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] mb-6 animate-fade-in-up delay-100">
                Automate Your
                <span className="block mt-2">
                  <span className="text-[#ff6b35]">E-commerce</span>
                  <span className="text-[#00d9a5]"> Operations</span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-[#64748b] max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up delay-200">
                Powerful tools to manage inventory alerts, automate CCTV video responses,
                and keep your e-commerce business running smoothly.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link
                  href="/out-of-stock"
                  className="btn-saffron inline-flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Out of Stock
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/ajio-mail"
                  className="btn-outline inline-flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Ajio Mail
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right side - Visualization */}
            <div className="animate-slide-in-right delay-400">
              <HeroVisualization />
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 pt-12 border-t border-[#e8e4de]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in-up delay-100">
                <AnimatedCounter target={500} suffix="+" />
                <p className="text-[#64748b] text-sm mt-1">SKUs Tracked</p>
              </div>
              <div className="text-center animate-fade-in-up delay-200">
                <AnimatedCounter target={10000} suffix="+" />
                <p className="text-[#64748b] text-sm mt-1">Emails Processed</p>
              </div>
              <div className="text-center animate-fade-in-up delay-300">
                <AnimatedCounter target={2} />
                <p className="text-[#64748b] text-sm mt-1">Warehouses</p>
              </div>
              <div className="text-center animate-fade-in-up delay-400">
                <AnimatedCounter target={99} suffix="%" />
                <p className="text-[#64748b] text-sm mt-1">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Two Powerful Features
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              Each feature is designed to save hours of manual work and prevent costly mistakes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Out of Stock Card */}
            <Link href="/out-of-stock" className="group">
              <div className="feature-card bg-gradient-to-br from-[#faf8f5] to-[#fff5f0] rounded-2xl p-8 border border-[#e8e4de] h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b35] to-[#e85a2a] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#ff6b35]/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-3">
                  Out of Stock Management
                </h3>
                <p className="text-[#64748b] mb-6 leading-relaxed">
                  Never miss a restock again. Real-time inventory monitoring with intelligent alerts
                  based on production lead times and daily order velocity.
                </p>

                {/* Feature list */}
                <div className="space-y-3 mb-8">
                  {[
                    { text: "Connect to EasyEcom API", color: "bg-[#ff6b35]" },
                    { text: "Set making time for each SKU", color: "bg-[#ff8c5a]" },
                    { text: "Get RED/ORANGE/GREEN status alerts", color: "bg-[#ffac8a]" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {i + 1}
                      </div>
                      <span className="text-[#1a1a2e]">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center text-[#ff6b35] font-semibold group-hover:gap-3 gap-2 transition-all">
                  View Demo & Documentation
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Ajio Mail Card */}
            <Link href="/ajio-mail" className="group">
              <div className="feature-card bg-gradient-to-br from-[#faf8f5] to-[#f0fdf9] rounded-2xl p-8 border border-[#e8e4de] h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#00d9a5] to-[#00b386] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#00d9a5]/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-3">
                  Ajio Mail Replying
                </h3>
                <p className="text-[#64748b] mb-6 leading-relaxed">
                  Automatically respond to CCTV footage requests from Ajio marketplace.
                  Extract order details, find videos, and send professional replies.
                </p>

                {/* Feature list */}
                <div className="space-y-3 mb-8">
                  {[
                    { text: "Connect Zoho Mail (or Gmail)", color: "bg-[#00d9a5]" },
                    { text: "Upload Order ID to AWB mapping", color: "bg-[#4de8c2]" },
                    { text: "Bulk reply with video links", color: "bg-[#7eefd6]" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {i + 1}
                      </div>
                      <span className="text-[#1a1a2e]">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center text-[#00d9a5] font-semibold group-hover:gap-3 gap-2 transition-all">
                  View Demo & Documentation
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              How It Works
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              Get started in minutes with our step-by-step documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Connect APIs",
                desc: "Link your EasyEcom account and mail provider",
                color: "bg-[#ff6b35]",
              },
              {
                step: "2",
                title: "Configure Rules",
                desc: "Set making times, thresholds, and mappings",
                color: "bg-[#00d9a5]",
              },
              {
                step: "3",
                title: "Monitor Dashboard",
                desc: "View real-time status and alerts",
                color: "bg-[#ff6b35]",
              },
              {
                step: "4",
                title: "Take Action",
                desc: "Respond to alerts and automate replies",
                color: "bg-[#00d9a5]",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-6 text-center border border-[#e8e4de] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-2">{item.title}</h3>
                  <p className="text-[#64748b] text-sm">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#e8e4de] text-2xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-12 text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35] rounded-full opacity-10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d9a5] rounded-full opacity-10 blur-3xl" />

            <div className="relative text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Automate?
              </h2>
              <p className="text-[#94a3b8] mb-10 max-w-xl mx-auto">
                Explore the interactive demos and documentation to see exactly how each feature works.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/out-of-stock"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ff6b35] text-white font-semibold rounded-xl hover:bg-[#e85a2a] transition-all shadow-lg shadow-[#ff6b35]/20"
                >
                  Start with Out of Stock
                </Link>
                <Link
                  href="/ajio-mail"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Start with Ajio Mail
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
