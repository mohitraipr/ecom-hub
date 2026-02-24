import { authFetch } from './auth';

export interface CatalogRow {
  sku: string;
  image_name: string;
  [key: string]: string;
}

export interface ProcessResult {
  rows: CatalogRow[];
  imagesProcessed: number;
  totalRows: number;
  cost: number;
  errors?: Array<{ filename: string; error: string }>;
}

export interface PricingInfo {
  pricePerUnit: number;
  unitSize: number;
  unitName: string;
  description: string;
}

export interface EstimateResult {
  imageCount: number;
  estimatedCost: number;
  pricePerThreeImages: number;
}

/**
 * Process images with Catalog AI
 */
export async function processImages(
  images: File[],
  category: string,
  attributes: string,
  attributeSheet?: File,
  sizeSheet?: File
): Promise<ProcessResult> {
  const formData = new FormData();

  // Add images
  for (const image of images) {
    formData.append('images', image);
  }

  // Add form fields
  formData.append('category', category);
  formData.append('attributes', attributes);

  // Add optional sheets
  if (attributeSheet) {
    formData.append('attribute_sheet', attributeSheet);
  }
  if (sizeSheet) {
    formData.append('size_sheet', sizeSheet);
  }

  const response = await authFetch<{ success: boolean; data: ProcessResult }>(
    '/api/catalog/process',
    {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let browser set it with boundary
    }
  );

  return response.data;
}

/**
 * Get catalog pricing info
 */
export async function getPricing(): Promise<PricingInfo> {
  const response = await authFetch<{ success: boolean; data: PricingInfo }>(
    '/api/catalog/pricing'
  );
  return response.data;
}

/**
 * Estimate cost for processing
 */
export async function estimateCost(imageCount: number): Promise<EstimateResult> {
  const response = await authFetch<{ success: boolean; data: EstimateResult }>(
    '/api/catalog/estimate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageCount }),
    }
  );
  return response.data;
}

/**
 * Convert rows to CSV string
 */
export function rowsToCsv(rows: CatalogRow[]): string {
  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map((h) => {
      const val = String(row[h] || '');
      // Escape quotes and wrap in quotes if contains comma or quote
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvLines.push(values.join(','));
  }

  return csvLines.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCsv(rows: CatalogRow[], filename: string = 'catalog.csv'): void {
  const csv = rowsToCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
