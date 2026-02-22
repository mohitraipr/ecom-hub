"use client";

interface ConnectionStatusProps {
  isDemo: boolean;
  lastUpdated?: string;
  className?: string;
}

export function ConnectionStatus({ isDemo, lastUpdated, className = "" }: ConnectionStatusProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      {/* Connection indicator */}
      <span className={`inline-flex items-center gap-1.5 ${isDemo ? 'text-[#e85a2a]' : 'text-[#00b386]'}`}>
        <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-[#ff6b35]' : 'bg-[#00d9a5]'} ${!isDemo ? 'animate-pulse' : ''}`} />
        <span className="font-medium">
          {isDemo ? 'Demo Mode' : 'Live Data'}
        </span>
      </span>

      {/* Last updated timestamp */}
      {lastUpdated && (
        <>
          <span className="text-[#e8e4de]">|</span>
          <span className="text-[#64748b]">
            Updated: {formatTime(lastUpdated)}
          </span>
        </>
      )}
    </div>
  );
}

// Compact version for tight spaces
export function ConnectionStatusCompact({ isDemo }: { isDemo: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${isDemo ? 'text-[#e85a2a]' : 'text-[#00b386]'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-[#ff6b35]' : 'bg-[#00d9a5]'}`} />
      {isDemo ? 'Demo' : 'Live'}
    </span>
  );
}
