/**
 * Environment configuration for ecom-hub.in
 *
 * Demo mode is enabled by default when no API URL is configured.
 * Set NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_API_KEY to connect to kotty-track backend.
 */

export const config = {
  // kotty-track backend API URL
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',

  // API key for authentication (read-only access)
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',

  // Demo mode: enabled when no API URL configured
  isDemoMode: !process.env.NEXT_PUBLIC_API_BASE_URL,

  // Force demo mode even if API is configured
  forceDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',

  // API timeout in milliseconds
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
} as const;

// Computed property
export const isDemo = config.isDemoMode || config.forceDemoMode;
