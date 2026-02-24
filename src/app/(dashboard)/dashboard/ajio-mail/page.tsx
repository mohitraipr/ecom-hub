'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getMailConfig,
  saveMailConfig,
  uploadMapping,
  getMappingStats,
  searchEmails,
  getInboxEmails,
  getEmailContent,
  sendReply,
  Email,
  MailConfig,
  MappingStats,
} from '@/lib/api/mail';

export default function AjioMailPage() {
  const [config, setConfig] = useState<MailConfig | null>(null);
  const [mappingStats, setMappingStats] = useState<MappingStats | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailContent, setEmailContent] = useState<string>('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('CCTV');

  // Config form
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    dc: 'IN',
    senderEmail: '',
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Mapping upload
  const mappingFileRef = useRef<HTMLInputElement>(null);
  const [isUploadingMapping, setIsUploadingMapping] = useState(false);

  // Search/Reply
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configData, statsData] = await Promise.all([
        getMailConfig(),
        getMappingStats(),
      ]);
      setConfig(configData);
      setMappingStats(statsData);

      if (!configData.configured) {
        setShowConfig(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setError('');

    try {
      const result = await saveMailConfig(configForm);
      setConfig({
        configured: result.configured,
        connected: result.connected,
        senderEmail: configForm.senderEmail,
        dc: configForm.dc,
      });
      setShowConfig(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save config');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleUploadMapping = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMapping(true);
    setError('');

    try {
      const result = await uploadMapping(file);
      setMappingStats({ count: result.count, loaded: true });
      alert(`Uploaded ${result.count} mappings`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload mapping');
    } finally {
      setIsUploadingMapping(false);
      if (mappingFileRef.current) {
        mappingFileRef.current.value = '';
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setEmails([]);
    setSelectedEmail(null);

    try {
      const result = await searchEmails(searchQuery.trim());
      setEmails(result.emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search emails');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadInbox = async () => {
    setIsSearching(true);
    setError('');
    setEmails([]);
    setSelectedEmail(null);

    try {
      const result = await getInboxEmails(100);
      setEmails(result.emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbox');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    setEmailContent('');
    setExtractedData(null);

    try {
      const content = await getEmailContent(email.messageId, email.subject, email.fromAddress);
      setEmailContent(content.content?.content || '');
      setExtractedData(content.extracted);
    } catch (err) {
      console.error('Failed to load email content:', err);
    }
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !extractedData) return;

    setIsSendingReply(true);
    setError('');

    try {
      // For now, send without video (video search requires S3 config)
      const result = await sendReply({
        messageId: selectedEmail.messageId,
        toAddress: selectedEmail.fromAddress,
        subject: selectedEmail.subject,
        orderId: extractedData.orderId,
        outboundAwb: extractedData.outboundAwb,
        videos: [], // Would need S3 integration for videos
      });

      alert(`Reply sent! Cost: ₹${result.cost}`);

      // Remove from list
      setEmails(prev => prev.filter(e => e.messageId !== selectedEmail.messageId));
      setSelectedEmail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'initial': return 'text-blue-400 bg-blue-400/20';
      case 'proceeding': return 'text-amber-400 bg-amber-400/20';
      case 'closed': return 'text-emerald-400 bg-emerald-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
          <h1 className="text-2xl font-bold text-white">Ajio Mail Automation</h1>
          <p className="text-[#8b9dc3] mt-1">Respond to CCTV requests with video links</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#2bbd5e]/20 text-[#2bbd5e] rounded-full text-sm font-medium">
            ₹1 per reply
          </span>
          <button
            onClick={() => setShowConfig(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a3441] hover:bg-[#3a4451] text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </div>

      {/* Error */}
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

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e2533] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Zoho Mail Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b9dc3] mb-1">Client ID</label>
                <input
                  type="text"
                  value={configForm.clientId}
                  onChange={e => setConfigForm(prev => ({ ...prev, clientId: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e]"
                  placeholder="1000.XXXXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b9dc3] mb-1">Client Secret</label>
                <input
                  type="password"
                  value={configForm.clientSecret}
                  onChange={e => setConfigForm(prev => ({ ...prev, clientSecret: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b9dc3] mb-1">Refresh Token</label>
                <textarea
                  value={configForm.refreshToken}
                  onChange={e => setConfigForm(prev => ({ ...prev, refreshToken: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b9dc3] mb-1">Data Center</label>
                  <select
                    value={configForm.dc}
                    onChange={e => setConfigForm(prev => ({ ...prev, dc: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e]"
                  >
                    <option value="IN">India (IN)</option>
                    <option value="US">US</option>
                    <option value="EU">Europe</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8b9dc3] mb-1">Sender Email</label>
                  <input
                    type="email"
                    value={configForm.senderEmail}
                    onChange={e => setConfigForm(prev => ({ ...prev, senderEmail: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#151b27] border border-[#2a3441] rounded-lg text-white focus:outline-none focus:border-[#2bbd5e]"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-2.5 bg-[#2a3441] hover:bg-[#3a4451] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="flex-1 py-2.5 bg-[#2bbd5e] hover:bg-[#25a852] disabled:bg-[#2a3441] text-white rounded-lg transition-colors"
              >
                {isSavingConfig ? 'Saving...' : 'Save & Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config?.connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="text-[#8b9dc3]">Zoho Connection</span>
          </div>
          <p className="text-white font-medium mt-2">
            {config?.connected ? 'Connected' : 'Not Connected'}
          </p>
          {config?.senderEmail && (
            <p className="text-sm text-[#6b7c93] mt-1">{config.senderEmail}</p>
          )}
        </div>

        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${mappingStats?.loaded ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-[#8b9dc3]">AWB Mapping</span>
          </div>
          <p className="text-white font-medium mt-2">
            {mappingStats?.count || 0} mappings
          </p>
          <input
            ref={mappingFileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleUploadMapping}
            className="hidden"
          />
          <button
            onClick={() => mappingFileRef.current?.click()}
            disabled={isUploadingMapping}
            className="text-sm text-[#2bbd5e] hover:text-[#25a852] mt-1"
          >
            {isUploadingMapping ? 'Uploading...' : 'Upload Excel'}
          </button>
        </div>

        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#8b9dc3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[#8b9dc3]">Emails Found</span>
          </div>
          <p className="text-white font-medium mt-2">{emails.length}</p>
        </div>
      </div>

      {/* Search */}
      {config?.connected && (
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search emails (e.g., CCTV, INC number)"
              className="flex-1 px-4 py-2 bg-[#151b27] border border-[#2a3441] rounded-lg text-white placeholder-[#6b7c93] focus:outline-none focus:border-[#2bbd5e]"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-[#2bbd5e] hover:bg-[#25a852] disabled:bg-[#2a3441] text-white rounded-lg transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleLoadInbox}
              disabled={isSearching}
              className="px-4 py-2 bg-[#2a3441] hover:bg-[#3a4451] text-white rounded-lg transition-colors"
            >
              Inbox
            </button>
          </div>
        </div>
      )}

      {/* Email List & Content */}
      {config?.connected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email List */}
          <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2a3441]">
              <h3 className="text-lg font-semibold text-white">Emails</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {emails.length === 0 ? (
                <div className="p-6 text-center text-[#8b9dc3]">
                  <p>No emails found</p>
                  <p className="text-sm mt-1">Search for CCTV requests</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2a3441]">
                  {emails.map(email => (
                    <div
                      key={email.messageId}
                      onClick={() => handleSelectEmail(email)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedEmail?.messageId === email.messageId ? 'bg-[#252d3a]' : 'hover:bg-[#252d3a]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getClassificationColor(email.classification)}`}>
                          {email.classification}
                        </span>
                        <span className="text-xs text-[#6b7c93]">
                          {new Date(parseInt(email.receivedTime)).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white font-medium text-sm truncate">{email.subject}</p>
                      <p className="text-xs text-[#8b9dc3] truncate mt-1">{email.fromAddress}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2a3441]">
              <h3 className="text-lg font-semibold text-white">Email Details</h3>
            </div>
            {selectedEmail ? (
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-[#8b9dc3]">Subject</p>
                  <p className="text-white">{selectedEmail.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8b9dc3]">From</p>
                  <p className="text-white">{selectedEmail.fromAddress}</p>
                </div>

                {extractedData && (
                  <div className="bg-[#151b27] rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-white">Extracted Data</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-[#8b9dc3]">Order ID:</span>
                        <span className="text-white ml-2">{extractedData.orderId || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[#8b9dc3]">Ticket:</span>
                        <span className="text-white ml-2">{extractedData.ticket || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[#8b9dc3]">Return AWB:</span>
                        <span className="text-white ml-2">{extractedData.returnAwb || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[#8b9dc3]">Outbound AWB:</span>
                        <span className={`ml-2 ${extractedData.outboundAwb ? 'text-emerald-400' : 'text-red-400'}`}>
                          {extractedData.outboundAwb || 'Not found'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="max-h-48 overflow-y-auto bg-[#151b27] rounded-lg p-4">
                  <p className="text-sm text-[#8b9dc3] whitespace-pre-wrap">{emailContent || 'Loading...'}</p>
                </div>

                <button
                  onClick={handleSendReply}
                  disabled={isSendingReply || !extractedData?.outboundAwb}
                  className="w-full py-3 bg-[#2bbd5e] hover:bg-[#25a852] disabled:bg-[#2a3441] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {isSendingReply ? 'Sending...' : 'Send Reply (₹1)'}
                </button>
                {!extractedData?.outboundAwb && (
                  <p className="text-xs text-amber-400 text-center">
                    Upload AWB mapping to find outbound AWB for this order
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-[#8b9dc3]">
                <p>Select an email to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Not configured message */}
      {!config?.connected && (
        <div className="bg-[#1e2533] border border-[#2a3441] rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Zoho Mail Not Configured</h3>
          <p className="text-[#8b9dc3] mb-4">
            Configure your Zoho Mail OAuth credentials to start using email automation.
          </p>
          <button
            onClick={() => setShowConfig(true)}
            className="px-6 py-2 bg-[#2bbd5e] hover:bg-[#25a852] text-white rounded-lg transition-colors"
          >
            Configure Now
          </button>
        </div>
      )}
    </div>
  );
}
