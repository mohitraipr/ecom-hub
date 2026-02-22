'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { isDemo } from '../config';
import { fetchInbox, bulkCheckVideos, createBulkReplyStream } from '../api/mail-manager';
import { EmailItem, BulkReplyEvent } from '../api/types';
import { ApiError } from '../api/client';

// Demo email data matching the original hardcoded data
const demoEmails: EmailItem[] = [
  {
    id: "msg_001",
    messageId: "msg_001",
    from: "ajio-claims@ajio.com",
    subject: "CCTV Footage Request - Order FN9735702115 - ||RT205327752||",
    orderId: "FN9735702115",
    rtNumber: "RT205327752",
    status: "initial",
    hasMapping: true,
    hasVideo: true,
    receivedAt: new Date().toISOString(),
  },
  {
    id: "msg_002",
    messageId: "msg_002",
    from: "ajio-claims@ajio.com",
    subject: "Request for Video Evidence - OD478291034 - ||RT205891234||",
    orderId: "OD478291034",
    rtNumber: "RT205891234",
    status: "initial",
    hasMapping: true,
    hasVideo: true,
    receivedAt: new Date().toISOString(),
  },
  {
    id: "msg_003",
    messageId: "msg_003",
    from: "ajio-claims@ajio.com",
    subject: "CCTV Request - FN8827361234 - ||RT206114567||",
    orderId: "FN8827361234",
    rtNumber: "RT206114567",
    status: "initial",
    hasMapping: false,
    hasVideo: false,
    receivedAt: new Date().toISOString(),
  },
  {
    id: "msg_004",
    messageId: "msg_004",
    from: "ajio-claims@ajio.com",
    subject: "Re: CCTV Footage Request - Order FN9512783456",
    orderId: "FN9512783456",
    rtNumber: "RT204998765",
    status: "replied",
    hasMapping: true,
    hasVideo: true,
    receivedAt: new Date().toISOString(),
  },
];

export interface BulkReplyResult {
  messageId: string;
  status: 'replied' | 'failed' | 'no_mapping' | 'no_video';
  error?: string;
}

export interface BulkReplyState {
  isProcessing: boolean;
  progress: number;
  total: number;
  results: BulkReplyResult[];
}

export interface UseMailManagerResult {
  emails: EmailItem[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  refetch: () => void;
  bulkReply: BulkReplyState;
  startBulkReply: (messageIds: string[]) => void;
  cancelBulkReply: () => void;
  checkVideos: (messageIds: string[]) => Promise<void>;
}

/**
 * Hook for mail manager with SSE bulk reply support
 */
export function useMailManager(): UseMailManagerResult {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(isDemo);

  const [bulkReply, setBulkReply] = useState<BulkReplyState>({
    isProcessing: false,
    progress: 0,
    total: 0,
    results: [],
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch inbox emails
  const fetchData = useCallback(async () => {
    if (isDemo) {
      setEmails(demoEmails);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchInbox();
      setEmails(result.emails);
      setIsDemoMode(false);
    } catch (err) {
      console.error('Failed to fetch inbox:', err);

      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          setError('Authentication required. Showing demo data.');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Backend unavailable. Showing demo data.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Showing demo data.');
      }

      setEmails(demoEmails);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Cleanup on unmount
    return () => {
      eventSourceRef.current?.close();
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, [fetchData]);

  // Start bulk reply process
  const startBulkReply = useCallback((messageIds: string[]) => {
    // Close any existing connection
    eventSourceRef.current?.close();
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
    }

    // Demo mode simulation
    if (isDemoMode) {
      setBulkReply({
        isProcessing: true,
        progress: 0,
        total: messageIds.length,
        results: [],
      });

      let processed = 0;
      demoIntervalRef.current = setInterval(() => {
        processed++;
        const email = emails.find(e => e.id === messageIds[processed - 1]);

        let status: BulkReplyResult['status'] = 'replied';
        if (!email?.hasMapping) status = 'no_mapping';
        else if (!email?.hasVideo) status = 'no_video';

        setBulkReply(prev => ({
          ...prev,
          progress: processed,
          results: [...prev.results, {
            messageId: messageIds[processed - 1],
            status,
          }],
        }));

        // Update email status in demo
        if (status === 'replied') {
          setEmails(prev => prev.map(e =>
            e.id === messageIds[processed - 1]
              ? { ...e, status: 'replied' as const }
              : e
          ));
        }

        if (processed >= messageIds.length) {
          if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current);
          }
          setBulkReply(prev => ({ ...prev, isProcessing: false }));
        }
      }, 1500); // 1.5s per email to simulate API rate limiting

      return;
    }

    // Real SSE connection
    setBulkReply({
      isProcessing: true,
      progress: 0,
      total: messageIds.length,
      results: [],
    });

    eventSourceRef.current = createBulkReplyStream(
      messageIds,
      (event: BulkReplyEvent) => {
        switch (event.type) {
          case 'start':
            setBulkReply(prev => ({
              ...prev,
              total: event.total || prev.total,
            }));
            break;

          case 'progress':
            setBulkReply(prev => ({
              ...prev,
              progress: event.current || event.progress || prev.progress,
            }));
            break;

          case 'replied':
            setBulkReply(prev => ({
              ...prev,
              progress: prev.progress + 1,
              results: [...prev.results, {
                messageId: event.messageId!,
                status: 'replied',
              }],
            }));
            // Update email in list
            setEmails(prev => prev.map(e =>
              e.messageId === event.messageId
                ? { ...e, status: 'replied' as const }
                : e
            ));
            break;

          case 'failed':
            setBulkReply(prev => ({
              ...prev,
              progress: prev.progress + 1,
              results: [...prev.results, {
                messageId: event.messageId!,
                status: 'failed',
                error: event.error,
              }],
            }));
            break;

          case 'complete':
            setBulkReply(prev => ({ ...prev, isProcessing: false }));
            fetchData(); // Refresh inbox
            break;

          case 'error':
            setError(event.message || 'Bulk reply failed');
            setBulkReply(prev => ({ ...prev, isProcessing: false }));
            break;
        }
      },
      (err) => {
        setError(err.message);
        setBulkReply(prev => ({ ...prev, isProcessing: false }));
      }
    );
  }, [isDemoMode, emails, fetchData]);

  // Cancel bulk reply
  const cancelBulkReply = useCallback(() => {
    eventSourceRef.current?.close();
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
    }
    setBulkReply(prev => ({ ...prev, isProcessing: false }));
  }, []);

  // Check videos for messages
  const checkVideos = useCallback(async (messageIds: string[]) => {
    if (isDemoMode) return;

    try {
      const result = await bulkCheckVideos(messageIds);
      setEmails(prev => prev.map(email => {
        const videoResult = result.results.find(r => r.messageId === email.id);
        if (videoResult) {
          return {
            ...email,
            hasVideo: videoResult.ready,
            hasMapping: !!videoResult.awb,
          };
        }
        return email;
      }));
    } catch (err) {
      console.error('Video check failed:', err);
    }
  }, [isDemoMode]);

  return {
    emails,
    loading,
    error,
    isDemo: isDemoMode,
    refetch: fetchData,
    bulkReply,
    startBulkReply,
    cancelBulkReply,
    checkVideos,
  };
}
