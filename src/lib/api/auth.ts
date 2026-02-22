/**
 * Auth API functions for ecom-hub
 */

import { config } from '../config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'viewer';
  emailVerified: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    tenant: Tenant;
    tokens: AuthTokens;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  companyName: string;
}

const TOKEN_KEY = 'ecom_hub_token';
const REFRESH_KEY = 'ecom_hub_refresh';

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

/**
 * Store tokens
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

/**
 * Clear tokens
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/**
 * Make authenticated API request
 */
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Try to refresh token if unauthorized
    if (response.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        headers['Authorization'] = `Bearer ${getAccessToken()}`;
        const retryResponse = await fetch(`${config.apiBaseUrl}${endpoint}`, {
          ...options,
          headers,
        });
        return retryResponse.json();
      }
    }
    throw new Error(data.error?.message || 'Request failed');
  }

  return data;
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<LoginResponse> {
  const response = await fetch(`${config.apiBaseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Registration failed');
  }

  // Store tokens
  setTokens(result.data.tokens.accessToken, result.data.tokens.refreshToken);

  return result;
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${config.apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Login failed');
  }

  // Store tokens
  setTokens(result.data.tokens.accessToken, result.data.tokens.refreshToken);

  return result;
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const result = await response.json();
    setTokens(result.data.accessToken, result.data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await fetch(`${config.apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore errors on logout
    }
  }

  clearTokens();
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<{ user: User; tenant: Tenant } | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const result = await authFetch<{ success: boolean; data: { user: User; tenant: Tenant } }>(
      '/api/auth/me'
    );
    return result.data;
  } catch {
    return null;
  }
}

export { authFetch };
