'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Integration,
  IntegrationDetails,
  CreateIntegrationData,
  TestConnectionResult,
  getIntegrations,
  getIntegration,
  createIntegration,
  testConnection,
  activateIntegration,
  pauseIntegration,
  resumeIntegration,
  deleteIntegration,
  getWebhookUrl,
} from '@/lib/api/integrations';

interface UseIntegrationsState {
  integrations: Integration[];
  isLoading: boolean;
  error: string | null;
}

interface UseIntegrationsReturn extends UseIntegrationsState {
  refresh: () => Promise<void>;
  create: (data: CreateIntegrationData) => Promise<Integration>;
  test: (id: string) => Promise<TestConnectionResult>;
  activate: (id: string) => Promise<Integration>;
  pause: (id: string) => Promise<Integration>;
  resume: (id: string) => Promise<Integration>;
  remove: (id: string) => Promise<void>;
}

export function useIntegrations(): UseIntegrationsReturn {
  const [state, setState] = useState<UseIntegrationsState>({
    integrations: [],
    isLoading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const integrations = await getIntegrations();
      setState({ integrations, isLoading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load integrations',
      }));
    }
  }, []);

  const create = useCallback(
    async (data: CreateIntegrationData): Promise<Integration> => {
      const integration = await createIntegration(data);
      await refresh();
      return integration;
    },
    [refresh]
  );

  const test = useCallback(async (id: string): Promise<TestConnectionResult> => {
    return testConnection(id);
  }, []);

  const activate = useCallback(
    async (id: string): Promise<Integration> => {
      const integration = await activateIntegration(id);
      await refresh();
      return integration;
    },
    [refresh]
  );

  const pause = useCallback(
    async (id: string): Promise<Integration> => {
      const integration = await pauseIntegration(id);
      await refresh();
      return integration;
    },
    [refresh]
  );

  const resume = useCallback(
    async (id: string): Promise<Integration> => {
      const integration = await resumeIntegration(id);
      await refresh();
      return integration;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await deleteIntegration(id);
      await refresh();
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
    create,
    test,
    activate,
    pause,
    resume,
    remove,
  };
}

// Hook for single integration details
interface UseIntegrationDetailState {
  integration: IntegrationDetails | null;
  webhookUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseIntegrationDetailReturn extends UseIntegrationDetailState {
  refresh: () => Promise<void>;
  loadWebhookUrl: () => Promise<void>;
}

export function useIntegrationDetail(id: string | null): UseIntegrationDetailReturn {
  const [state, setState] = useState<UseIntegrationDetailState>({
    integration: null,
    webhookUrl: null,
    isLoading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!id) {
      setState({ integration: null, webhookUrl: null, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const integration = await getIntegration(id);
      setState((prev) => ({ ...prev, integration, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load integration',
      }));
    }
  }, [id]);

  const loadWebhookUrl = useCallback(async () => {
    if (!id) return;

    try {
      const result = await getWebhookUrl(id);
      setState((prev) => ({ ...prev, webhookUrl: result.url }));
    } catch (err) {
      console.error('Failed to load webhook URL:', err);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
    loadWebhookUrl,
  };
}
