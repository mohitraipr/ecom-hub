'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <p className="text-ink-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="fixed inset-y-0 left-0 w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
