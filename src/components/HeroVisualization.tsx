"use client";

import { useEffect, useState } from "react";

export function HeroVisualization({ className = "" }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`relative w-full max-w-lg mx-auto ${className}`}>
      <svg
        viewBox="0 0 400 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Background glow effects */}
        <defs>
          <radialGradient id="saffronGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tealGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d9a5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00d9a5" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGradientSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ff6b35" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGradientTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d9a5" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00d9a5" stopOpacity="1" />
            <stop offset="100%" stopColor="#00d9a5" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from nodes to hub */}
        <g className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {/* Inventory node to hub */}
          <path
            d="M100 100 Q150 175 200 175"
            stroke="url(#lineGradientSaffron)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
            className="animate-data-flow"
            style={{ animationDelay: "0s" }}
          />

          {/* Email node to hub */}
          <path
            d="M300 100 Q250 175 200 175"
            stroke="url(#lineGradientTeal)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
            className="animate-data-flow"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Hub to output */}
          <path
            d="M200 175 L200 280"
            stroke="#e8e4de"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
        </g>

        {/* Floating data particles */}
        <g className={`transition-opacity duration-1000 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {/* Particles from inventory */}
          <circle cx="120" cy="120" r="3" fill="#ff6b35" className="animate-float" style={{ animationDelay: "0s" }}>
            <animate attributeName="cy" values="120;140;120" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="140" r="2" fill="#ff6b35" className="animate-float" style={{ animationDelay: "0.5s" }}>
            <animate attributeName="cy" values="140;160;140" dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Particles from email */}
          <circle cx="280" cy="120" r="3" fill="#00d9a5" className="animate-float" style={{ animationDelay: "0.3s" }}>
            <animate attributeName="cy" values="120;145;120" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="260" cy="140" r="2" fill="#00d9a5" className="animate-float" style={{ animationDelay: "0.8s" }}>
            <animate attributeName="cy" values="140;165;140" dur="3.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Inventory Node (Left) */}
        <g
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Glow */}
          <circle cx="100" cy="80" r="50" fill="url(#saffronGlow)" />

          {/* Node background */}
          <rect x="60" y="50" width="80" height="60" rx="12" fill="#1a1a2e" />

          {/* Icon - Inventory/Box */}
          <g transform="translate(85, 65)">
            <path
              d="M15 4L27 10V22L15 28L3 22V10L15 4Z"
              stroke="#ff6b35"
              strokeWidth="2"
              fill="none"
            />
            <path d="M3 10L15 16L27 10" stroke="#ff6b35" strokeWidth="2" fill="none" />
            <path d="M15 16V28" stroke="#ff6b35" strokeWidth="2" />
          </g>

          {/* Label */}
          <text x="100" y="130" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="500">
            Inventory
          </text>
        </g>

        {/* Email Node (Right) */}
        <g
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Glow */}
          <circle cx="300" cy="80" r="50" fill="url(#tealGlow)" />

          {/* Node background */}
          <rect x="260" y="50" width="80" height="60" rx="12" fill="#1a1a2e" />

          {/* Icon - Email */}
          <g transform="translate(283, 65)">
            <rect x="2" y="4" width="30" height="22" rx="3" stroke="#00d9a5" strokeWidth="2" fill="none" />
            <path d="M2 8L17 18L32 8" stroke="#00d9a5" strokeWidth="2" fill="none" />
          </g>

          {/* Label */}
          <text x="300" y="130" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="500">
            Emails
          </text>
        </g>

        {/* Central Hub */}
        <g
          className={`transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          style={{ transitionDelay: "600ms", transformOrigin: "200px 175px" }}
        >
          {/* Outer glow ring */}
          <circle cx="200" cy="175" r="55" fill="none" stroke="#ff6b35" strokeWidth="1" strokeOpacity="0.2">
            <animate attributeName="r" values="55;60;55" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Hub background */}
          <circle cx="200" cy="175" r="45" fill="#1a1a2e" filter="url(#glow)" />

          {/* Hub inner ring */}
          <circle cx="200" cy="175" r="35" fill="none" stroke="#ff6b35" strokeWidth="2" strokeOpacity="0.5" />

          {/* Hub center */}
          <circle cx="200" cy="175" r="20" fill="url(#saffronGradientHub)">
            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="175" r="8" fill="white" />

          {/* Hub label */}
          <text x="200" y="245" textAnchor="middle" fill="#1a1a2e" fontSize="14" fontWeight="600">
            ecom-hub
          </text>
        </g>

        {/* Output Dashboard */}
        <g
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "800ms" }}
        >
          {/* Dashboard card */}
          <rect x="130" y="275" width="140" height="55" rx="8" fill="#1a1a2e" />

          {/* Mini status indicators */}
          <circle cx="155" cy="295" r="6" fill="#ef4444" />
          <rect x="170" y="291" width="40" height="8" rx="2" fill="#2d2d44" />

          <circle cx="155" cy="315" r="6" fill="#22c55e" />
          <rect x="170" y="311" width="60" height="8" rx="2" fill="#2d2d44" />

          {/* Arrow icon */}
          <g transform="translate(235, 290)">
            <path d="M5 10L15 10M15 10L10 5M15 10L10 15" stroke="#64748b" strokeWidth="2" fill="none" />
          </g>
        </g>

        {/* Additional gradient for hub */}
        <defs>
          <linearGradient id="saffronGradientHub" x1="180" y1="155" x2="220" y2="195">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#e85a2a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Decorative floating elements */}
      <div className="absolute top-10 left-0 w-3 h-3 bg-[#ff6b35] rounded-full opacity-40 animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute top-20 right-10 w-2 h-2 bg-[#00d9a5] rounded-full opacity-40 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-20 left-10 w-2 h-2 bg-[#ff6b35] rounded-full opacity-30 animate-float" style={{ animationDelay: "2s" }} />
    </div>
  );
}
