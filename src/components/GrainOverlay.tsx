"use client";

interface GrainOverlayProps {
  opacity?: number;
  className?: string;
}

export function GrainOverlay({ opacity = 0.03, className = "" }: GrainOverlayProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="w-full h-full">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}

// Inline grain for specific sections (not fixed positioned)
export function GrainSection({ opacity = 0.04, className = "" }: GrainOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="w-full h-full">
        <filter id="section-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#section-grain-filter)" />
      </svg>
    </div>
  );
}
