'use client';

import { useState, useCallback, useRef } from 'react';
import { processImages, estimateCost, downloadCsv, CatalogRow, ProcessResult, EstimateResult } from '@/lib/api/catalog';

export default function CatalogPage() {
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState('');
  const [attributes, setAttributes] = useState('');
  const [attributeSheet, setAttributeSheet] = useState<File | null>(null);
  const [sizeSheet, setSizeSheet] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const attrSheetRef = useRef<HTMLInputElement>(null);
  const sizeSheetRef = useRef<HTMLInputElement>(null);

  // Common categories
  const categories = ['JEANS', 'SHIRT', 'T-SHIRT', 'KURTA', 'DRESS', 'TOP', 'JACKET', 'SAREE', 'LEHENGA'];

  // Common attributes
  const commonAttributes = [
    'Color', 'Pattern', 'Fabric', 'Fit', 'Sleeve Length', 'Neck Type',
    'Occasion', 'Style', 'Length', 'Rise', 'Wash Care'
  ];

  const handleImageSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(f =>
      f.type.startsWith('image/')
    );

    setImages(prev => [...prev, ...imageFiles]);
    setError('');

    // Update estimate
    const newCount = images.length + imageFiles.length;
    if (newCount > 0) {
      try {
        const est = await estimateCost(newCount);
        setEstimate(est);
      } catch (err) {
        console.error('Failed to estimate cost:', err);
      }
    }
  }, [images.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageSelect(e.dataTransfer.files);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = useCallback(async (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (newImages.length > 0) {
      try {
        const est = await estimateCost(newImages.length);
        setEstimate(est);
      } catch (err) {
        console.error('Failed to estimate cost:', err);
      }
    } else {
      setEstimate(null);
    }
  }, [images]);

  const toggleAttribute = useCallback((attr: string) => {
    const current = attributes.split(',').map(a => a.trim()).filter(a => a);
    if (current.includes(attr)) {
      setAttributes(current.filter(a => a !== attr).join(', '));
    } else {
      setAttributes([...current, attr].join(', '));
    }
  }, [attributes]);

  const handleProcess = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    if (!category.trim()) {
      setError('Please select or enter a category');
      return;
    }
    if (!attributes.trim()) {
      setError('Please select or enter attributes to extract');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const data = await processImages(
        images,
        category.trim(),
        attributes.trim(),
        attributeSheet || undefined,
        sizeSheet || undefined
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.rows) {
      downloadCsv(result.rows, `catalog_${category.toLowerCase()}_${Date.now()}.csv`);
    }
  };

  const handleReset = () => {
    setImages([]);
    setCategory('');
    setAttributes('');
    setAttributeSheet(null);
    setSizeSheet(null);
    setResult(null);
    setEstimate(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Catalog AI</h1>
          <p className="text-[#8b9dc3] mt-1">Generate product attributes from images using AI</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#8b9dc3]">Pricing:</span>
          <span className="px-3 py-1 bg-[#2bbd5e]/20 text-[#2bbd5e] rounded-full font-medium">
            Rs1 per 3 images
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Main Content */}
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[#2bbd5e] bg-[#2bbd5e]/10'
                  : 'border-[#2a3441] hover:border-[#3a4451]'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageSelect(e.target.files)}
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2a3441] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#8b9dc3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">Drop images here or click to upload</p>
              <p className="text-[#8b9dc3] text-sm">Supports JPG, PNG, WebP (max 10MB each, up to 50 images)</p>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="bg-[#1e2533] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">{images.length} images selected</h3>
                  <button
                    onClick={() => setImages([])}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {images.map((file, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-[#1e2533] rounded-xl p-4">
              <label className="block text-white font-medium mb-3">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e]"
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or enter custom category"
                value={categories.includes(category) ? '' : category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-2 px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-white placeholder-[#6b7c93] focus:outline-none focus:border-[#2bbd5e]"
              />
            </div>

            {/* Attributes */}
            <div className="bg-[#1e2533] rounded-xl p-4">
              <label className="block text-white font-medium mb-3">Attributes to Extract *</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonAttributes.map(attr => {
                  const isSelected = attributes.split(',').map(a => a.trim()).includes(attr);
                  return (
                    <button
                      key={attr}
                      onClick={() => toggleAttribute(attr)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#2bbd5e] text-white'
                          : 'bg-[#2a3441] text-[#8b9dc3] hover:bg-[#3a4451]'
                      }`}
                    >
                      {attr}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={attributes}
                onChange={(e) => setAttributes(e.target.value)}
                placeholder="Or enter comma-separated attributes..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-white placeholder-[#6b7c93] focus:outline-none focus:border-[#2bbd5e] resize-none"
              />
            </div>

            {/* Optional Sheets */}
            <div className="bg-[#1e2533] rounded-xl p-4">
              <label className="block text-white font-medium mb-3">Optional Files</label>

              {/* Attribute Sheet */}
              <div className="mb-3">
                <input
                  ref={attrSheetRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => setAttributeSheet(e.target.files?.[0] || null)}
                />
                <button
                  onClick={() => attrSheetRef.current?.click()}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-[#8b9dc3] hover:border-[#3a4451] transition-colors"
                >
                  <span>{attributeSheet?.name || 'Attribute Options Sheet'}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <p className="text-xs text-[#6b7c93] mt-1">Excel with allowed values for each attribute</p>
              </div>

              {/* Size Sheet */}
              <div>
                <input
                  ref={sizeSheetRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => setSizeSheet(e.target.files?.[0] || null)}
                />
                <button
                  onClick={() => sizeSheetRef.current?.click()}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-[#8b9dc3] hover:border-[#3a4451] transition-colors"
                >
                  <span>{sizeSheet?.name || 'Size Mapping Sheet'}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <p className="text-xs text-[#6b7c93] mt-1">Excel with SKU to size mappings</p>
              </div>
            </div>

            {/* Cost Estimate & Process */}
            <div className="bg-[#1e2533] rounded-xl p-4">
              {estimate && (
                <div className="mb-4 p-3 bg-[#151b27] rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8b9dc3]">Images:</span>
                    <span className="text-white">{estimate.imageCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-[#8b9dc3]">Estimated Cost:</span>
                    <span className="text-[#2bbd5e] font-medium">Rs{estimate.estimatedCost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleProcess}
                disabled={isProcessing || images.length === 0}
                className="w-full py-3 bg-[#2bbd5e] hover:bg-[#25a852] disabled:bg-[#2a3441] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Attributes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Result Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#1e2533] rounded-xl p-4">
              <p className="text-[#8b9dc3] text-sm">Images Processed</p>
              <p className="text-2xl font-bold text-white">{result.imagesProcessed}</p>
            </div>
            <div className="bg-[#1e2533] rounded-xl p-4">
              <p className="text-[#8b9dc3] text-sm">Rows Generated</p>
              <p className="text-2xl font-bold text-white">{result.totalRows}</p>
            </div>
            <div className="bg-[#1e2533] rounded-xl p-4">
              <p className="text-[#8b9dc3] text-sm">Cost</p>
              <p className="text-2xl font-bold text-[#2bbd5e]">Rs{result.cost.toFixed(2)}</p>
            </div>
            <div className="bg-[#1e2533] rounded-xl p-4">
              <p className="text-[#8b9dc3] text-sm">Errors</p>
              <p className="text-2xl font-bold text-white">{result.errors?.length || 0}</p>
            </div>
          </div>

          {/* Error List */}
          {result.errors && result.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-400 font-medium mb-2">Processing Errors</h3>
              <ul className="space-y-1 text-sm text-red-300">
                {result.errors.map((err, i) => (
                  <li key={i}>
                    <span className="font-medium">{err.filename}:</span> {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Results Table */}
          {result.rows.length > 0 && (
            <div className="bg-[#1e2533] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#2a3441]">
                <h3 className="text-white font-medium">Generated Catalog Data</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2bbd5e] hover:bg-[#25a852] text-white rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CSV
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a3441] hover:bg-[#3a4451] text-white rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Process More
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#151b27]">
                      {Object.keys(result.rows[0]).map(header => (
                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-[#8b9dc3] uppercase tracking-wider whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3441]">
                    {result.rows.slice(0, 50).map((row, index) => (
                      <tr key={index} className="hover:bg-[#252d3a]">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-3 text-sm text-white whitespace-nowrap">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.rows.length > 50 && (
                  <div className="p-4 text-center text-[#8b9dc3] text-sm">
                    Showing 50 of {result.rows.length} rows. Download CSV to see all.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
