// ============ Out of Stock Types ============

export type StockStatus = 'red' | 'orange' | 'green';
export type StockPeriod = '1h' | '12h' | '1d' | '3d' | '7d';

export interface InventoryItem {
  sku: string;
  warehouse: string;
  warehouse_id?: number;
  inventory: number;
  makingTime: number;
  yesterdayOrders: number;
  daysLeft: number;
  status: StockStatus;
}

export interface OrderMomentum {
  sku: string;
  warehouse: string;
  orders: number;
  previousOrders: number;
  growth: number;
}

export interface SlowMover {
  sku: string;
  warehouse: string;
  inventory: number;
  orders7d: number;
  orders30d: number;
}

export interface StockMarketData {
  inventory: InventoryItem[];
  orders: OrderMomentum[];
  slowMovers: SlowMover[];
  period: StockPeriod;
  lastUpdated?: string;
}

// ============ Ajio Mail Types ============

export type EmailStatus = 'initial' | 'replied' | 'no_mapping' | 'no_video' | 'error';

export interface EmailItem {
  id: string;
  messageId: string;
  from: string;
  subject: string;
  orderId: string | null;
  rtNumber: string | null;
  receivedAt: string;
  status: EmailStatus;
  hasMapping?: boolean;
  hasVideo?: boolean;
}

export interface EmailInboxResponse {
  emails: EmailItem[];
  count: number;
}

export interface VideoCheckResult {
  messageId: string;
  orderId: string;
  awb: string | null;
  videoUrl: string | null;
  ready: boolean;
}

export interface BulkCheckVideosResponse {
  results: VideoCheckResult[];
  ready: number;
  total: number;
  hasMappingLoaded: boolean;
  mappingCount: number;
}

export interface AwbLookupResponse {
  found: boolean;
  orderId: string;
  awb: string | null;
  source?: string;
  error?: string;
}

export interface FindVideosResponse {
  found: boolean;
  videos: string[];
  error?: string;
}

// SSE Events for bulk reply stream
export type BulkReplyEventType = 'start' | 'progress' | 'replied' | 'failed' | 'complete' | 'error';

export interface BulkReplyEvent {
  type: BulkReplyEventType;
  messageId?: string;
  orderId?: string;
  awb?: string;
  subject?: string;
  progress?: number;
  current?: number;
  total?: number;
  percent?: number;
  error?: string;
  message?: string;
  summary?: {
    replied: number;
    failed: number;
    skipped: number;
    total: number;
  };
  // Start event specific
  toProcess?: number;
  alreadyReplied?: number;
  hasMappingLoaded?: boolean;
  mappingCount?: number;
}

// ============ Common Types ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
