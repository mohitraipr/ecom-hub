'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve query parameters when redirecting
    const platform = searchParams.get('platform');
    const redirectUrl = platform
      ? `/dashboard/integrations/new?platform=${platform}`
      : '/dashboard/integrations/new';
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return null;
}

export default function IntegrationsNewRedirect() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
      <Suspense fallback={null}>
        <RedirectContent />
      </Suspense>
    </div>
  );
}
