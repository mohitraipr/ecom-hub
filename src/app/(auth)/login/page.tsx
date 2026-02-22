'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="bg-ink-800/50 backdrop-blur-xl rounded-2xl border border-ink-700/50 p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-ink-400">Sign in to your ecom-hub account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-300 mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-400">
            <input type="checkbox" className="rounded border-ink-600 bg-ink-900/50 text-saffron-500 focus:ring-saffron-500" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-saffron-500 hover:text-saffron-400 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-lg hover:from-saffron-600 hover:to-saffron-700 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 focus:ring-offset-ink-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-ink-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-saffron-500 hover:text-saffron-400 font-medium transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
