import { apiFetch } from './client';
import { config } from '../config';
import {
  EmailInboxResponse,
  BulkCheckVideosResponse,
  BulkReplyEvent,
  AwbLookupResponse,
  FindVideosResponse,
} from './types';

/**
 * Fetch inbox emails from kotty-track backend
 */
export async function fetchInbox(
  limit: number = 50,
  start: number = 0
): Promise<EmailInboxResponse> {
  return apiFetch<EmailInboxResponse>(
    `/mail-manager/emails/inbox?limit=${limit}&start=${start}`
  );
}

/**
 * Get email details with classification
 */
export async function fetchEmailDetails(
  messageId: string,
  options?: { subject?: string; fromAddress?: string }
): Promise<unknown> {
  const params = new URLSearchParams();
  if (options?.subject) params.set('subject', options.subject);
  if (options?.fromAddress) params.set('fromAddress', options.fromAddress);

  const query = params.toString() ? `?${params}` : '';
  return apiFetch(`/mail-manager/emails/${messageId}${query}`);
}

/**
 * Check video availability for multiple messages
 */
export async function bulkCheckVideos(
  messageIds: string[]
): Promise<BulkCheckVideosResponse> {
  return apiFetch<BulkCheckVideosResponse>('/mail-manager/bulk-check-videos', {
    method: 'POST',
    body: JSON.stringify({ messageIds }),
  });
}

/**
 * Look up AWB by order ID
 */
export async function lookupAwb(orderId: string): Promise<AwbLookupResponse> {
  return apiFetch<AwbLookupResponse>(`/mail-manager/lookup-awb/${orderId}`);
}

/**
 * Find videos by order ID or AWB
 */
export async function findVideos(
  params: { orderId?: string; awb?: string; packingDate?: string }
): Promise<FindVideosResponse> {
  return apiFetch<FindVideosResponse>('/mail-manager/find-videos', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Create SSE connection for bulk reply stream
 *
 * @param messageIds - Array of message IDs to process
 * @param onEvent - Callback for each SSE event
 * @param onError - Callback for errors
 * @returns EventSource instance (call .close() to cancel)
 */
export function createBulkReplyStream(
  messageIds: string[],
  onEvent: (event: BulkReplyEvent) => void,
  onError: (error: Error) => void
): EventSource {
  const params = new URLSearchParams();
  params.set('messageIds', messageIds.join(','));

  const url = `${config.apiBaseUrl}/mail-manager/bulk-reply-stream?${params}`;

  const eventSource = new EventSource(url, {
    withCredentials: false, // Using API key, not session cookies
  });

  eventSource.onmessage = (event) => {
    try {
      const data: BulkReplyEvent = JSON.parse(event.data);
      onEvent(data);

      // Close connection when complete
      if (data.type === 'complete' || data.type === 'error') {
        eventSource.close();
      }
    } catch (err) {
      onError(new Error('Failed to parse SSE event'));
    }
  };

  eventSource.onerror = () => {
    onError(new Error('SSE connection error'));
    eventSource.close();
  };

  return eventSource;
}

/**
 * Test mail connection
 */
export async function testConnection(): Promise<{ success: boolean; accountId?: string; error?: string }> {
  return apiFetch('/mail-manager/test-connection');
}
