import { authFetch } from './auth';

export interface MailConfig {
  configured: boolean;
  connected: boolean;
  senderEmail?: string;
  dc?: string;
  error?: string;
}

export interface Email {
  messageId: string;
  subject: string;
  fromAddress: string;
  toAddress?: string;
  receivedTime: string;
  summary?: string;
  classification: string;
}

export interface EmailContent {
  content: string;
  subject?: string;
  fromAddress?: string;
}

export interface ExtractedDetails {
  orderId: string | null;
  packingTime: string | null;
  ticket: string | null;
  returnAwb: string | null;
  outboundAwb: string | null;
}

export interface MappingStats {
  count: number;
  loaded: boolean;
}

export interface PricingInfo {
  pricePerReply: number;
  currency: string;
  description: string;
}

/**
 * Get mail configuration status
 */
export async function getMailConfig(): Promise<MailConfig> {
  const response = await authFetch<{ success: boolean; data: MailConfig }>(
    '/api/mail/config'
  );
  return response.data;
}

/**
 * Save mail configuration
 */
export async function saveMailConfig(config: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  dc?: string;
  senderEmail: string;
}): Promise<{ configured: boolean; connected: boolean; accountId?: string }> {
  const response = await authFetch<{ success: boolean; data: { configured: boolean; connected: boolean; accountId?: string } }>(
    '/api/mail/config',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }
  );
  return response.data;
}

/**
 * Upload Order-AWB mapping Excel
 */
export async function uploadMapping(file: File): Promise<{ count: number; skipped: number; message: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authFetch<{ success: boolean; data: { count: number; skipped: number; message: string } }>(
    '/api/mail/upload-mapping',
    {
      method: 'POST',
      body: formData,
    }
  );
  return response.data;
}

/**
 * Get mapping statistics
 */
export async function getMappingStats(): Promise<MappingStats> {
  const response = await authFetch<{ success: boolean; data: MappingStats }>(
    '/api/mail/mapping-stats'
  );
  return response.data;
}

/**
 * Lookup AWB by Order ID
 */
export async function lookupAwb(orderId: string): Promise<{ found: boolean; orderId: string; awb: string | null }> {
  const response = await authFetch<{ success: boolean; data: { found: boolean; orderId: string; awb: string | null } }>(
    `/api/mail/lookup-awb/${encodeURIComponent(orderId)}`
  );
  return response.data;
}

/**
 * Search emails
 */
export async function searchEmails(query: string, limit = 200, start = 0): Promise<{ emails: Email[]; count: number }> {
  const params = new URLSearchParams({
    query,
    limit: limit.toString(),
    start: start.toString(),
  });

  const response = await authFetch<{ success: boolean; data: { emails: Email[]; count: number } }>(
    `/api/mail/emails/search?${params.toString()}`
  );
  return response.data;
}

/**
 * Get inbox emails
 */
export async function getInboxEmails(limit = 50, start = 0): Promise<{ emails: Email[]; count: number }> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    start: start.toString(),
  });

  const response = await authFetch<{ success: boolean; data: { emails: Email[]; count: number } }>(
    `/api/mail/emails/inbox?${params.toString()}`
  );
  return response.data;
}

/**
 * Get email content
 */
export async function getEmailContent(
  messageId: string,
  subject?: string,
  fromAddress?: string
): Promise<{
  details: { messageId: string; subject: string; fromAddress: string };
  content: EmailContent | null;
  extracted: ExtractedDetails;
  classification: string;
}> {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (fromAddress) params.set('fromAddress', fromAddress);

  const response = await authFetch<{
    success: boolean;
    data: {
      details: { messageId: string; subject: string; fromAddress: string };
      content: EmailContent | null;
      extracted: ExtractedDetails;
      classification: string;
    };
  }>(`/api/mail/emails/${messageId}?${params.toString()}`);
  return response.data;
}

/**
 * Send reply with video links
 */
export async function sendReply(data: {
  messageId: string;
  toAddress: string;
  subject: string;
  orderId?: string;
  videos?: Array<{ awb: string; url: string; filename?: string }>;
  outboundAwb?: string;
}): Promise<{ message: string; orderId?: string; awb?: string; cost: number }> {
  const response = await authFetch<{
    success: boolean;
    data: { message: string; orderId?: string; awb?: string; cost: number };
  }>('/api/mail/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.data;
}

/**
 * Get pricing info
 */
export async function getPricing(): Promise<PricingInfo> {
  const response = await authFetch<{ success: boolean; data: PricingInfo }>(
    '/api/mail/pricing'
  );
  return response.data;
}

export interface VideoSearchResult {
  awb: string;
  key: string;
  url: string;
  filename: string;
  size: number;
  sizeFormatted: string;
}

export interface S3Config {
  configured: boolean;
  bucket?: string;
  region?: string;
  prefix?: string;
}

/**
 * Search for videos by AWB numbers
 */
export async function searchVideos(
  awbList: string[],
  packingDates?: Record<string, string>
): Promise<{ videos: VideoSearchResult[]; found: number; searched: number }> {
  const response = await authFetch<{
    success: boolean;
    data: { videos: VideoSearchResult[]; found: number; searched: number };
  }>('/api/mail/videos/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ awbList, packingDates }),
  });
  return response.data;
}

/**
 * Search for a single video by AWB
 */
export async function searchVideoByAwb(awb: string): Promise<{ found: boolean; video: VideoSearchResult | null }> {
  const response = await authFetch<{
    success: boolean;
    data: { found: boolean; video: VideoSearchResult | null };
  }>(`/api/mail/videos/search/${encodeURIComponent(awb)}`);
  return response.data;
}

/**
 * Get S3 configuration status
 */
export async function getS3Config(): Promise<S3Config> {
  const response = await authFetch<{ success: boolean; data: S3Config }>(
    '/api/mail/s3-config'
  );
  return response.data;
}

/**
 * Save S3 configuration
 */
export async function saveS3Config(config: {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region?: string;
  prefix?: string;
}): Promise<{ configured: boolean; bucket: string; region: string }> {
  const response = await authFetch<{
    success: boolean;
    data: { configured: boolean; bucket: string; region: string };
  }>('/api/mail/s3-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return response.data;
}
