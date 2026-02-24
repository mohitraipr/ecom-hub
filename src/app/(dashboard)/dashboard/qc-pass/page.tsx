'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  createJob,
  getJobs,
  getJob,
  launchJob,
  startJob,
  pauseJob,
  resumeJob,
  stopJob,
  deleteJob,
  getJobResults,
  getWarehouses,
  downloadResults,
  QCJob,
  QCResult,
} from '@/lib/api/qcpass';

type JobType = 'qcpass' | 'rto' | 'return';
type ProcessingMode = 'browser' | 'api';

export default function QCPassPage() {
  const [jobs, setJobs] = useState<QCJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<QCJob | null>(null);
  const [results, setResults] = useState<QCResult[]>([]);
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // New job form
  const [showNewJob, setShowNewJob] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobType, setJobType] = useState<JobType>('qcpass');
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('browser');
  const [warehouse, setWarehouse] = useState('');
  const [deskCode, setDeskCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load jobs and warehouses
  useEffect(() => {
    loadData();
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Poll for job updates when there's an active job
  useEffect(() => {
    if (selectedJob && ['launching', 'waiting', 'running', 'paused'].includes(selectedJob.status)) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const updated = await getJob(selectedJob.id);
          setSelectedJob(updated);

          if (['completed', 'stopped', 'error'].includes(updated.status)) {
            // Job finished, load results
            const jobResults = await getJobResults(updated.id);
            setResults(jobResults);
            loadData(); // Refresh job list
          }
        } catch (err) {
          console.error('Failed to poll job:', err);
        }
      }, 2000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [selectedJob?.id, selectedJob?.status]);

  const loadData = async () => {
    try {
      const [jobsData, warehousesData] = await Promise.all([
        getJobs(),
        getWarehouses(),
      ]);
      setJobs(jobsData);
      setWarehouses(warehousesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!file) {
      setError('Please select a file with tracking IDs');
      return;
    }

    if (['rto', 'return'].includes(jobType) && (!warehouse || !deskCode)) {
      setError('Warehouse and Desk Code are required for RTO/Return jobs');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const result = await createJob(file, jobType, processingMode, warehouse, deskCode);

      // Reset form
      setFile(null);
      setShowNewJob(false);
      setJobType('qcpass');
      setWarehouse('');
      setDeskCode('');

      // Reload jobs
      await loadData();

      // Select the new job
      const newJob = await getJob(result.job_id);
      setSelectedJob(newJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLaunchJob = async () => {
    if (!selectedJob) return;

    try {
      await launchJob(selectedJob.id);
      const updated = await getJob(selectedJob.id);
      setSelectedJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to launch job');
    }
  };

  const handleStartJob = async () => {
    if (!selectedJob) return;

    try {
      await startJob(selectedJob.id);
      const updated = await getJob(selectedJob.id);
      setSelectedJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start job');
    }
  };

  const handlePauseJob = async () => {
    if (!selectedJob) return;

    try {
      await pauseJob(selectedJob.id);
      const updated = await getJob(selectedJob.id);
      setSelectedJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause job');
    }
  };

  const handleResumeJob = async () => {
    if (!selectedJob) return;

    try {
      await resumeJob(selectedJob.id);
      const updated = await getJob(selectedJob.id);
      setSelectedJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume job');
    }
  };

  const handleStopJob = async () => {
    if (!selectedJob) return;

    try {
      await stopJob(selectedJob.id);
      const updated = await getJob(selectedJob.id);
      setSelectedJob(updated);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteJob(jobId);
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
        setResults([]);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  const handleViewResults = async (job: QCJob) => {
    setSelectedJob(job);
    if (['completed', 'stopped', 'error'].includes(job.status)) {
      try {
        const jobResults = await getJobResults(job.id);
        setResults(jobResults);
      } catch (err) {
        console.error('Failed to load results:', err);
      }
    }
  };

  const handleDownloadResults = () => {
    if (results.length > 0 && selectedJob) {
      downloadResults(results, `qc_results_${selectedJob.id}.csv`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/20';
      case 'running': return 'text-blue-400 bg-blue-400/20';
      case 'paused': return 'text-amber-400 bg-amber-400/20';
      case 'waiting': return 'text-purple-400 bg-purple-400/20';
      case 'launching': return 'text-cyan-400 bg-cyan-400/20';
      case 'stopped': return 'text-gray-400 bg-gray-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'qcpass': return 'QC Pass';
      case 'rto': return 'RTO';
      case 'return': return 'Return';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2bbd5e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">QC Pass / RGP Automation</h1>
          <p className="text-[#8b9dc3] mt-1">Automate Myntra QC Pass, RTO, and Return processing</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#2bbd5e]/20 text-[#2bbd5e] rounded-full text-sm font-medium">
            Rs0.50 per tracking ID
          </span>
          <button
            onClick={() => setShowNewJob(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2bbd5e] hover:bg-[#25a852] text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Job
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* New Job Modal */}
      {showNewJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e2533] rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create New Job</h2>

            {/* Job Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#8b9dc3] mb-2">Job Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['qcpass', 'rto', 'return'] as JobType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setJobType(type)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      jobType === type
                        ? 'bg-[#2bbd5e] text-white'
                        : 'bg-[#2a3441] text-[#8b9dc3] hover:bg-[#3a4451]'
                    }`}
                  >
                    {getJobTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Processing Mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#8b9dc3] mb-2">Processing Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setProcessingMode('browser')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    processingMode === 'browser'
                      ? 'bg-[#2bbd5e] text-white'
                      : 'bg-[#2a3441] text-[#8b9dc3] hover:bg-[#3a4451]'
                  }`}
                >
                  Browser (Visual)
                </button>
                <button
                  onClick={() => setProcessingMode('api')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    processingMode === 'api'
                      ? 'bg-[#2bbd5e] text-white'
                      : 'bg-[#2a3441] text-[#8b9dc3] hover:bg-[#3a4451]'
                  }`}
                >
                  API (Fast)
                </button>
              </div>
            </div>

            {/* Warehouse & Desk Code (for RTO/Return) */}
            {['rto', 'return'].includes(jobType) && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#8b9dc3] mb-2">Warehouse *</label>
                  <select
                    value={warehouse}
                    onChange={e => setWarehouse(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e]"
                  >
                    <option value="">Select warehouse...</option>
                    {warehouses.map(wh => (
                      <option key={wh} value={wh}>{wh}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#8b9dc3] mb-2">Desk Code *</label>
                  <input
                    type="text"
                    value={deskCode}
                    onChange={e => setDeskCode(e.target.value)}
                    placeholder="e.g., DESK001"
                    className="w-full px-4 py-2.5 bg-[#151b27] border border-[#2a3441] rounded-lg text-white placeholder-[#6b7c93] focus:outline-none focus:border-[#2bbd5e]"
                  />
                </div>
              </>
            )}

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#8b9dc3] mb-2">Tracking IDs File *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,.xlsx,.xls"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#151b27] border border-[#2a3441] rounded-lg text-[#8b9dc3] hover:border-[#3a4451] transition-colors"
              >
                <span>{file?.name || 'Choose file (TXT, CSV, Excel)'}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
              <p className="text-xs text-[#6b7c93] mt-1">One tracking ID per line, or comma/semicolon separated</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewJob(false);
                  setFile(null);
                }}
                className="flex-1 py-2.5 bg-[#2a3441] hover:bg-[#3a4451] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                disabled={isCreating || !file}
                className="flex-1 py-2.5 bg-[#2bbd5e] hover:bg-[#25a852] disabled:bg-[#2a3441] disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e2533] rounded-xl">
            <div className="p-4 border-b border-[#2a3441]">
              <h2 className="text-lg font-semibold text-white">Jobs</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="p-6 text-center text-[#8b9dc3]">
                  <p>No jobs yet</p>
                  <p className="text-sm mt-1">Create a new job to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2a3441]">
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      onClick={() => handleViewResults(job)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedJob?.id === job.id ? 'bg-[#252d3a]' : 'hover:bg-[#252d3a]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-[#6b7c93]">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white font-medium text-sm truncate">{job.filename}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[#8b9dc3]">
                        <span className="px-2 py-0.5 bg-[#2a3441] rounded">{getJobTypeLabel(job.job_type)}</span>
                        <span>{job.total_ids} IDs</span>
                        {job.status === 'running' && (
                          <span className="text-blue-400">{Math.round((job.current_index / job.total_ids) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Details & Controls */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <div className="space-y-6">
              {/* Job Info Card */}
              <div className="bg-[#1e2533] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedJob.filename}</h3>
                    <p className="text-sm text-[#8b9dc3]">Job ID: {selectedJob.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                </div>

                {/* Progress */}
                {['running', 'paused', 'completed', 'stopped'].includes(selectedJob.status) && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#8b9dc3]">Progress</span>
                      <span className="text-white">
                        {selectedJob.current_index} / {selectedJob.total_ids}
                        ({Math.round((selectedJob.current_index / selectedJob.total_ids) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[#2a3441] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2bbd5e] transition-all"
                        style={{ width: `${(selectedJob.current_index / selectedJob.total_ids) * 100}%` }}
                      />
                    </div>
                    <div className="flex gap-6 mt-3 text-sm">
                      <span className="text-emerald-400">Passed: {selectedJob.passed_count}</span>
                      <span className="text-red-400">Errors: {selectedJob.error_count}</span>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap gap-3">
                  {selectedJob.status === 'pending' && (
                    <button
                      onClick={handleLaunchJob}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2bbd5e] hover:bg-[#25a852] text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Launch Browser
                    </button>
                  )}

                  {selectedJob.status === 'waiting' && (
                    <button
                      onClick={handleStartJob}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2bbd5e] hover:bg-[#25a852] text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      I'm Ready - Start Processing
                    </button>
                  )}

                  {selectedJob.status === 'running' && (
                    <button
                      onClick={handlePauseJob}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pause
                    </button>
                  )}

                  {selectedJob.status === 'paused' && (
                    <button
                      onClick={handleResumeJob}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2bbd5e] hover:bg-[#25a852] text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      Resume
                    </button>
                  )}

                  {['launching', 'waiting', 'running', 'paused'].includes(selectedJob.status) && (
                    <button
                      onClick={handleStopJob}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop
                    </button>
                  )}

                  {results.length > 0 && (
                    <button
                      onClick={handleDownloadResults}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2a3441] hover:bg-[#3a4451] text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download CSV
                    </button>
                  )}

                  {['completed', 'stopped', 'error'].includes(selectedJob.status) && (
                    <button
                      onClick={() => handleDeleteJob(selectedJob.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2a3441] hover:bg-red-500/20 text-[#8b9dc3] hover:text-red-400 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>

                {/* Browser View Notice */}
                {['launching', 'waiting', 'running'].includes(selectedJob.status) && selectedJob.processing_mode === 'browser' && (
                  <div className="mt-4 p-4 bg-[#151b27] rounded-lg">
                    <p className="text-[#8b9dc3] text-sm">
                      <strong className="text-white">Browser View:</strong> The QC Pass service runs in a separate container with noVNC.
                      When deployed, you can view the browser at the noVNC URL.
                    </p>
                  </div>
                )}
              </div>

              {/* Results Table */}
              {results.length > 0 && (
                <div className="bg-[#1e2533] rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-[#2a3441]">
                    <h3 className="text-lg font-semibold text-white">Results ({results.length})</h3>
                  </div>
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full">
                      <thead className="bg-[#151b27] sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#8b9dc3] uppercase">Tracking ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#8b9dc3] uppercase">Item Barcode</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#8b9dc3] uppercase">Article No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#8b9dc3] uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#8b9dc3] uppercase">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2a3441]">
                        {results.map((result, index) => (
                          <tr key={index} className="hover:bg-[#252d3a]">
                            <td className="px-4 py-3 text-sm text-white">{result.tracking_id}</td>
                            <td className="px-4 py-3 text-sm text-[#8b9dc3]">{result.item_barcode || '-'}</td>
                            <td className="px-4 py-3 text-sm text-[#8b9dc3]">{result.article_no || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              {result.pass_clicked ? (
                                <span className="text-emerald-400">Passed</span>
                              ) : result.error ? (
                                <span className="text-red-400">Error</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-red-400 max-w-xs truncate">{result.error || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#1e2533] rounded-xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2a3441] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#8b9dc3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">Select a job to view details</p>
              <p className="text-[#8b9dc3] text-sm">Or create a new job to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
