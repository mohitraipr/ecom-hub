"use client";

import { useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: { icon: 28, text: "text-base" },
    md: { icon: 36, text: "text-lg" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div
      className={`flex items-center gap-2.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hub Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300"
        style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
      >
        {/* Background hexagon */}
        <path
          d="M24 4L42.5 14V34L24 44L5.5 34V14L24 4Z"
          fill="url(#inkGradient)"
          className="transition-all duration-300"
        />

        {/* Connection lines */}
        <g className="transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0.6 }}>
          {/* Top left to center */}
          <line x1="14" y1="14" x2="24" y2="24" stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="2 2">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
          {/* Top right to center */}
          <line x1="34" y1="14" x2="24" y2="24" stroke="#00d9a5" strokeWidth="1.5" strokeDasharray="2 2">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </line>
          {/* Bottom left to center */}
          <line x1="14" y1="34" x2="24" y2="24" stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="2 2">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </line>
          {/* Bottom right to center */}
          <line x1="34" y1="34" x2="24" y2="24" stroke="#00d9a5" strokeWidth="1.5" strokeDasharray="2 2">
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Outer nodes */}
        <g>
          {/* Top left node - Saffron */}
          <circle
            cx="14"
            cy="14"
            r="4"
            fill="#ff6b35"
            className="transition-all duration-300"
            style={{
              filter: isHovered ? "drop-shadow(0 0 6px rgba(255,107,53,0.6))" : "none",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transformOrigin: "14px 14px",
            }}
          />
          {/* Top right node - Teal */}
          <circle
            cx="34"
            cy="14"
            r="4"
            fill="#00d9a5"
            className="transition-all duration-300"
            style={{
              filter: isHovered ? "drop-shadow(0 0 6px rgba(0,217,165,0.6))" : "none",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transformOrigin: "34px 14px",
            }}
          />
          {/* Bottom left node - Saffron */}
          <circle
            cx="14"
            cy="34"
            r="4"
            fill="#ff6b35"
            className="transition-all duration-300"
            style={{
              filter: isHovered ? "drop-shadow(0 0 6px rgba(255,107,53,0.6))" : "none",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transformOrigin: "14px 34px",
            }}
          />
          {/* Bottom right node - Teal */}
          <circle
            cx="34"
            cy="34"
            r="4"
            fill="#00d9a5"
            className="transition-all duration-300"
            style={{
              filter: isHovered ? "drop-shadow(0 0 6px rgba(0,217,165,0.6))" : "none",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transformOrigin: "34px 34px",
            }}
          />
        </g>

        {/* Center hub node */}
        <circle
          cx="24"
          cy="24"
          r="6"
          fill="url(#saffronGradient)"
          className="transition-all duration-300"
          style={{
            filter: isHovered
              ? "drop-shadow(0 0 12px rgba(255,107,53,0.8))"
              : "drop-shadow(0 0 6px rgba(255,107,53,0.4))",
          }}
        />
        <circle cx="24" cy="24" r="2.5" fill="white" />

        {/* Gradients */}
        <defs>
          <linearGradient id="inkGradient" x1="5.5" y1="4" x2="42.5" y2="44">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>
          <linearGradient id="saffronGradient" x1="18" y1="18" x2="30" y2="30">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#e85a2a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wordmark */}
      {showText && (
        <span
          className={`font-display font-bold ${textSize} tracking-tight transition-colors duration-300`}
          style={{ color: "#1a1a2e" }}
        >
          ecom
          <span style={{ color: "#ff6b35" }}>-</span>
          hub
        </span>
      )}
    </div>
  );
}

// Simple static logo for footer/small contexts
export function LogoSimple({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4L42.5 14V34L24 44L5.5 34V14L24 4Z"
          fill="#1a1a2e"
        />
        <circle cx="24" cy="24" r="6" fill="#ff6b35" />
        <circle cx="24" cy="24" r="2.5" fill="white" />
      </svg>
      <span className="font-semibold text-white">
        ecom<span className="text-[#ff6b35]">-</span>hub
      </span>
    </div>
  );
}
