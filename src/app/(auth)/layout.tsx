import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-semibold text-white">ecom-hub</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-ink-400 text-sm">
          &copy; {new Date().getFullYear()} ecom-hub.in. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
