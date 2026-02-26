import { authFetch } from './auth';

export interface QCJob {
  id: string;
  job_type: 'qcpass' | 'rto' | 'return';
  filename: string;
  total_ids: number;
  status: 'pending' | 'launching' | 'waiting' | 'running' | 'paused' | 'completed' | 'stopped' | 'error';
  current_index: number;
  passed_count: number;
  error_count: number;
  warehouse?: string;
  desk_code?: string;
  processing_mode: 'browser' | 'api';
  cost?: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface QCResult {
  tracking_id: string;
  item_barcode?: string;
  article_no?: string;
  myntra_sku?: string;
  pass_clicked: boolean;
  error?: string;
  processed_at: string;
}

export interface CreateJobResponse {
  job_id: string;
  filename: string;
  total_ids: number;
  job_type: string;
  processing_mode: string;
  estimated_cost: number;
}

export interface PricingInfo {
  pricePerItem: number;
  currency: string;
  description: string;
}

/**
 * Create a new QC Pass job
 */
export async function createJob(
  file: File,
  jobType: 'qcpass' | 'rto' | 'return',
  processingMode: 'browser' | 'api' = 'browser',
  warehouse?: string,
  deskCode?: string
): Promise<CreateJobResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_type', jobType);
  formData.append('processing_mode', processingMode);

  if (warehouse) {
    formData.append('warehouse', warehouse);
  }
  if (deskCode) {
    formData.append('desk_code', deskCode);
  }

  const response = await authFetch<{ success: boolean; data: CreateJobResponse }>(
    '/api/qcpass/jobs',
    {
      method: 'POST',
      body: formData,
    }
  );

  return response.data;
}

/**
 * Get all jobs for current tenant
 */
export async function getJobs(): Promise<QCJob[]> {
  const response = await authFetch<{ success: boolean; data: { jobs: QCJob[] } }>(
    '/api/qcpass/jobs'
  );
  return response.data.jobs;
}

/**
 * Get a specific job
 */
export async function getJob(jobId: string): Promise<QCJob> {
  const response = await authFetch<{ success: boolean; data: QCJob }>(
    `/api/qcpass/jobs/${jobId}`
  );
  return response.data;
}

/**
 * Launch browser for a job
 */
export async function launchJob(jobId: string): Promise<{ status: string; message: string; novnc_url: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string; message: string; novnc_url: string } }>(
    `/api/qcpass/jobs/${jobId}/launch`,
    { method: 'POST' }
  );
  return response.data;
}

/**
 * Start processing (after user is ready)
 */
export async function startJob(jobId: string): Promise<{ status: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string } }>(
    `/api/qcpass/jobs/${jobId}/start`,
    { method: 'POST' }
  );
  return response.data;
}

/**
 * Pause a running job
 */
export async function pauseJob(jobId: string): Promise<{ status: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string } }>(
    `/api/qcpass/jobs/${jobId}/pause`,
    { method: 'POST' }
  );
  return response.data;
}

/**
 * Resume a paused job
 */
export async function resumeJob(jobId: string): Promise<{ status: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string } }>(
    `/api/qcpass/jobs/${jobId}/resume`,
    { method: 'POST' }
  );
  return response.data;
}

/**
 * Stop a job
 */
export async function stopJob(jobId: string): Promise<{ status: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string } }>(
    `/api/qcpass/jobs/${jobId}/stop`,
    { method: 'POST' }
  );
  return response.data;
}

/**
 * Delete a job
 */
export async function deleteJob(jobId: string): Promise<{ deleted: boolean }> {
  const response = await authFetch<{ success: boolean; data: { deleted: boolean } }>(
    `/api/qcpass/jobs/${jobId}`,
    { method: 'DELETE' }
  );
  return response.data;
}

/**
 * Get job results
 */
export async function getJobResults(jobId: string): Promise<QCResult[]> {
  const response = await authFetch<{ success: boolean; data: { results: QCResult[] } }>(
    `/api/qcpass/jobs/${jobId}/results`
  );
  return response.data.results;
}

/**
 * Get list of warehouses
 */
export async function getWarehouses(): Promise<string[]> {
  const response = await authFetch<{ success: boolean; data: { warehouses: string[] } }>(
    '/api/qcpass/warehouses'
  );
  return response.data.warehouses;
}

/**
 * Get pricing info
 */
export async function getPricing(): Promise<PricingInfo> {
  const response = await authFetch<{ success: boolean; data: PricingInfo }>(
    '/api/qcpass/pricing'
  );
  return response.data;
}

/**
 * Estimate cost
 */
export async function estimateCost(count: number): Promise<{ count: number; pricePerItem: number; estimatedCost: number }> {
  const response = await authFetch<{ success: boolean; data: { count: number; pricePerItem: number; estimatedCost: number } }>(
    '/api/qcpass/estimate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    }
  );
  return response.data;
}

/**
 * Convert results to CSV
 */
export function resultsToCsv(results: QCResult[]): string {
  if (results.length === 0) return '';

  const headers = ['Tracking ID', 'Item Barcode', 'Article No', 'Myntra SKU', 'Pass Clicked', 'Error', 'Processed At'];
  const rows = results.map(r => [
    r.tracking_id,
    r.item_barcode || '',
    r.article_no || '',
    r.myntra_sku || '',
    r.pass_clicked ? 'Yes' : 'No',
    r.error || '',
    r.processed_at,
  ]);

  return [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
}

/**
 * Download results as CSV
 */
export function downloadResults(results: QCResult[], filename: string = 'qc_results.csv'): void {
  const csv = resultsToCsv(results);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Get QC Pass service status
 */
export interface ServiceStatus {
  available: boolean;
  service_url: string;
  novnc_url?: string;
  message?: string;
  vm_status?: string;
  vm_ip?: string;
}

export async function getServiceStatus(): Promise<ServiceStatus> {
  const response = await authFetch<{ success: boolean; data: ServiceStatus }>(
    '/api/qcpass/service-status'
  );
  return response.data;
}

/**
 * VM Status interface
 */
export interface VMStatus {
  status: string;
  external_ip: string | null;
  name: string;
  zone: string;
  novnc_url: string | null;
}

/**
 * Get VM status
 */
export async function getVMStatus(): Promise<VMStatus> {
  const response = await authFetch<{ success: boolean; data: VMStatus }>(
    '/api/qcpass/vm/status'
  );
  return response.data;
}

/**
 * Start VM
 */
export async function startVM(): Promise<{ status: string; message: string; external_ip?: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string; message: string; external_ip?: string } }>(
    '/api/qcpass/vm/start',
    { method: 'POST' }
  );
  return response.data;
}

/**
 * Stop VM
 */
export async function stopVM(): Promise<{ status: string; message: string }> {
  const response = await authFetch<{ success: boolean; data: { status: string; message: string } }>(
    '/api/qcpass/vm/stop',
    { method: 'POST' }
  );
  return response.data;
}
