import { config } from '../config';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Base fetch wrapper with:
 * - X-API-Key header for authentication
 * - Timeout handling with AbortController
 * - Error normalization
 * - JSON parsing
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = config.apiTimeout, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Add API key if configured
    if (config.apiKey) {
      (headers as Record<string, string>)['X-API-Key'] = config.apiKey;
    }

    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new ApiError(
        errorBody.message || `HTTP ${response.status}`,
        response.status,
        errorBody.code
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT');
    }

    // Network error or backend unavailable
    throw new ApiError(
      'Unable to connect to server',
      0,
      'NETWORK_ERROR'
    );
  }
}

/**
 * Check if the backend is reachable
 */
export async function checkConnection(): Promise<boolean> {
  if (config.isDemoMode || config.forceDemoMode) {
    return false;
  }

  try {
    await apiFetch('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
