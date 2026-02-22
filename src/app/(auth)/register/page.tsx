'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="bg-ink-800/50 backdrop-blur-xl rounded-2xl border border-ink-700/50 p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-ink-400">Start automating your e-commerce operations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-300 mb-2">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-300 mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-ink-300 mb-2">
            Company name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="Your Company Pvt Ltd"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-300 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="Min 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-300 mb-2">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-ink-900/50 border border-ink-600 rounded-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
            placeholder="Confirm your password"
          />
        </div>

        <div className="pt-2">
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
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </div>

        <p className="text-xs text-ink-500 text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-saffron-500 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-saffron-500 hover:underline">Privacy Policy</Link>
        </p>
      </form>

      <div className="mt-6 text-center">
        <p className="text-ink-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-saffron-500 hover:text-saffron-400 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
