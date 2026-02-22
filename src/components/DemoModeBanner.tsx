"use client";

interface DemoModeBannerProps {
  message?: string;
  error?: string | null;
}

export function DemoModeBanner({
  message = "You're viewing demo data. Connect to backend for real data.",
  error,
}: DemoModeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#fff5f0] to-[#fef3e7] border-b border-[#ffceb3] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-[#e85a2a]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Demo Mode</span>
        </div>
        <span className="text-[#64748b]">|</span>
        <span className="text-[#64748b]">{error || message}</span>
      </div>
    </div>
  );
}
