"use client";

import { useState } from "react";
import Link from "next/link";
import { useMailManager } from "@/lib/hooks/useMailManager";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { ConnectionStatus } from "@/components/ConnectionStatus";

const steps = [
  {
    number: 1,
    title: "Set Up Zoho Mail OAuth",
    description: "Register your application with Zoho and get OAuth credentials for secure email access.",
    details: [
      "Go to Zoho Developer Console (api-console.zoho.com)",
      "Create a new Self Client or Server-based Application",
      "Add scopes: ZohoMail.messages.READ, ZohoMail.messages.CREATE",
      "Generate refresh token using OAuth flow"
    ],
    credentials: ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"]
  },
  {
    number: 2,
    title: "Configure Mail Provider",
    description: "Set the data center and sender email address for your Zoho Mail account.",
    details: [
      "ZOHO_DC: IN (India), US (USA), EU (Europe), AU (Australia)",
      "ZOHO_SENDER_EMAIL: Your email address that will send replies",
      "The sender email must have access to read inbox and send emails"
    ],
    credentials: ["ZOHO_DC", "ZOHO_SENDER_EMAIL"]
  },
  {
    number: 3,
    title: "Upload Order-AWB Mapping",
    description: "Upload an Excel file mapping Order IDs to Outbound AWBs. This is critical for video lookup.",
    details: [
      "Excel columns: Order ID, AWB (outbound waybill number)",
      "The RT number in emails is RETURN tracking - not for video search",
      "Videos are named by OUTBOUND AWB when Kotty shipped the item",
      "Without this mapping, the system cannot find matching videos"
    ],
    credentials: []
  },
  {
    number: 4,
    title: "Connect S3 for Video Storage",
    description: "Configure AWS S3 access to search for CCTV footage videos by AWB number.",
    details: [
      "Videos should be uploaded to S3 with AWB in filename",
      "The system searches for videos matching the outbound AWB",
      "Returns pre-signed URLs valid for 3 days"
    ],
    credentials: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET_NAME"]
  },
  {
    number: 5,
    title: "Process & Reply to Emails",
    description: "Search AJIO emails, view extracted details, and send bulk replies with video links.",
    details: [
      "Search emails by keyword (e.g., 'CCTV', 'video', 'footage')",
      "System auto-extracts Order ID and RT number from subject/body",
      "Select emails and click Bulk Reply to process multiple at once",
      "Rate limiting: 1.5 second delay between API calls"
    ],
    credentials: []
  }
];

const mailProviders = [
  {
    name: "Zoho Mail",
    icon: "Z",
    color: "bg-red-500",
    status: "Supported",
    config: ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN", "ZOHO_DC"]
  },
  {
    name: "Gmail",
    icon: "G",
    color: "bg-blue-500",
    status: "Coming Soon",
    config: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]
  },
  {
    name: "Outlook",
    icon: "O",
    color: "bg-cyan-500",
    status: "Planned",
    config: ["MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET", "MICROSOFT_REFRESH_TOKEN"]
  }
];

export default function AjioMailPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const {
    emails,
    loading,
    error,
    isDemo,
    refetch,
    bulkReply,
    startBulkReply,
    cancelBulkReply,
  } = useMailManager();

  const toggleEmailSelection = (id: string) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selectAllInitial = () => {
    const initialIds = emails.filter(e => e.status === "initial").map(e => e.id);
    setSelectedEmails(initialIds);
  };

  const handleBulkReply = () => {
    startBulkReply(selectedEmails);
    setSelectedEmails([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "initial": return "bg-[#00d9a5]/10 text-[#00b386]";
      case "replied": return "bg-green-100 text-green-700";
      case "no_mapping": return "bg-amber-100 text-amber-700";
      case "no_video": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Demo Mode Banner */}
      {isDemo && <DemoModeBanner error={error} />}

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#00d9a5] to-[#00b386] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-teal-100 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold">Ajio Mail Replying</h1>
              <p className="text-teal-100 mt-1">Automated CCTV footage response system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#e8e4de] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8">
            <a href="#demo" className="py-4 border-b-2 border-[#00d9a5] text-[#00b386] font-medium">
              Live Demo
            </a>
            <a href="#setup" className="py-4 border-b-2 border-transparent text-[#64748b] hover:text-[#1a1a2e] font-medium">
              Setup Guide
            </a>
            <a href="#flow" className="py-4 border-b-2 border-transparent text-[#64748b] hover:text-[#1a1a2e] font-medium">
              How It Works
            </a>
            <a href="#providers" className="py-4 border-b-2 border-transparent text-[#64748b] hover:text-[#1a1a2e] font-medium">
              Mail Providers
            </a>
          </nav>
        </div>
      </div>

      {/* Live Demo Section */}
      <section id="demo" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">Live Demo: Mail Manager</h2>
              <p className="text-[#64748b]">
                This simulates the mail manager interface. Select emails and process bulk replies.
              </p>
            </div>
            <ConnectionStatus isDemo={isDemo} />
          </div>

          {/* Demo Interface */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e8e4de] overflow-hidden">
            {/* Mail Interface Header */}
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                <span className="ml-4 text-sm text-gray-300">Mail Manager - AJIO CCTV Requests</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Mapping loaded: 1,234 orders</span>
                <span className="text-sm text-[#00d9a5]">● Connected to Zoho</span>
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#faf8f5] border-b border-[#e8e4de] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllInitial}
                  className="px-4 py-2 bg-[#00d9a5]/10 text-[#00b386] rounded-lg hover:bg-[#00d9a5]/20 transition-colors text-sm font-medium"
                >
                  Select Initial Requests
                </button>
                <span className="text-sm text-[#64748b]">
                  {selectedEmails.length} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                {bulkReply.isProcessing && (
                  <button
                    onClick={cancelBulkReply}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleBulkReply}
                  disabled={selectedEmails.length === 0 || bulkReply.isProcessing}
                  className="px-6 py-2 bg-[#00d9a5] text-white rounded-lg hover:bg-[#00b386] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {bulkReply.isProcessing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Bulk Reply
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {bulkReply.isProcessing && (
              <div className="bg-[#f0fdf9] border-b border-[#00d9a5]/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#00b386]">Processing emails...</span>
                  <span className="text-sm text-[#00b386]">{bulkReply.progress} / {bulkReply.total}</span>
                </div>
                <div className="w-full bg-[#00d9a5]/20 rounded-full h-2">
                  <div
                    className="bg-[#00d9a5] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(bulkReply.progress / bulkReply.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Email List */}
            <div className="divide-y divide-[#e8e4de]">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                emails.map((email) => {
                  const result = bulkReply.results.find(r => r.messageId === email.id);
                  const isSelected = selectedEmails.includes(email.id);

                  return (
                    <div
                      key={email.id}
                      className={`p-4 hover:bg-[#faf8f5] transition-colors ${
                        result ? (result.status === "replied" ? "bg-green-50" : "bg-amber-50") : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEmailSelection(email.id)}
                          disabled={email.status === "replied" || bulkReply.isProcessing}
                          className="mt-1.5 w-4 h-4 text-[#00d9a5] rounded border-[#e8e4de] focus:ring-[#00d9a5] disabled:opacity-50"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium text-[#1a1a2e] truncate">{email.from}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(result?.status || email.status)}`}>
                              {(result?.status || email.status).replace("_", " ").toUpperCase()}
                            </span>
                          </div>

                          <div className="text-[#1a1a2e] truncate mb-2">{email.subject}</div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="inline-flex items-center gap-1">
                              <span className="text-[#64748b]">Order:</span>
                              <code className="bg-[#f0f0f0] px-2 py-0.5 rounded text-[#1a1a2e]">{email.orderId}</code>
                              <span className="tooltip">
                                <svg className="w-4 h-4 text-[#64748b] cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="tooltip-text">Order ID extracted from email subject. Used to lookup outbound AWB.</span>
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <span className="text-[#64748b]">RT:</span>
                              <code className="bg-[#f0f0f0] px-2 py-0.5 rounded text-[#1a1a2e]">{email.rtNumber}</code>
                              <span className="tooltip">
                                <svg className="w-4 h-4 text-amber-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="tooltip-text"><strong>IMPORTANT:</strong> RT is RETURN tracking number - NOT used for video lookup! Videos are named by OUTBOUND AWB.</span>
                              </span>
                            </span>

                            {email.hasMapping ? (
                              <span className="inline-flex items-center gap-1 text-[#00b386]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mapping found
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#ef4444]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                No mapping
                              </span>
                            )}

                            {email.hasVideo && email.hasMapping && (
                              <span className="inline-flex items-center gap-1 text-[#00b386]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Video found
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bulk Reply Results */}
          {bulkReply.results.length > 0 && !bulkReply.isProcessing && (
            <div className="mt-6 bg-white rounded-xl p-6 border border-[#e8e4de]">
              <h3 className="font-semibold text-[#1a1a2e] mb-4">Bulk Reply Results</h3>
              <div className="space-y-2">
                {bulkReply.results.map((result, i) => {
                  const email = emails.find(e => e.id === result.messageId);
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                      result.status === "replied" ? "bg-green-50" : "bg-amber-50"
                    }`}>
                      <span className="font-mono text-sm">{email?.orderId}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(result.status)}`}>
                        {result.status === "replied" ? "Replied Successfully" :
                         result.status === "no_mapping" ? "No AWB Mapping" : "No Video Found"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Insight Box */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Critical: RT vs Outbound AWB</h4>
                <p className="text-amber-700 text-sm">
                  The <strong>RT number</strong> in emails is the <em>Return</em> tracking number - used when the customer sends an item back.
                  But CCTV videos are named by the <strong>Outbound AWB</strong> - the tracking number from when Kotty originally shipped the item.
                  <br /><br />
                  This is why you must upload an Excel mapping: <code className="bg-amber-100 px-1 rounded">Order ID → Outbound AWB</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section id="setup" className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">Setup Guide</h2>
            <p className="text-[#64748b]">Follow these steps to set up Ajio Mail Replying for your store.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Steps List */}
            <div className="lg:col-span-1 space-y-3">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    activeStep === step.number
                      ? "bg-[#00d9a5] text-white shadow-lg shadow-[#00d9a5]/20"
                      : "bg-[#faf8f5] hover:bg-[#f0ede8] text-[#1a1a2e]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      activeStep === step.number ? "bg-white text-[#00d9a5]" : "bg-[#00d9a5]/10 text-[#00d9a5]"
                    }`}>
                      {step.number}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Step Details */}
            <div className="lg:col-span-2">
              {steps.filter(s => s.number === activeStep).map((step) => (
                <div key={step.number} className="bg-[#faf8f5] rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#00d9a5] text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a2e]">{step.title}</h3>
                  </div>

                  <p className="text-[#64748b] mb-6">{step.description}</p>

                  <div className="space-y-3 mb-6">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e8e4de]">
                        <svg className="w-5 h-5 text-[#00d9a5] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#1a1a2e]">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {step.credentials.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Required Credentials
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {step.credentials.map((cred, i) => (
                          <code key={i} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm font-mono">
                            {cred}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Flow Diagram */}
      <section id="flow" className="py-12 px-4 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">How It Works</h2>
            <p className="text-[#64748b]">Understanding the email processing flow from inbox to reply.</p>
          </div>

          {/* Flow Diagram */}
          <div className="bg-white rounded-2xl p-8 border border-[#e8e4de] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[900px]">
              {[
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Zoho Inbox", desc: "Search emails", color: "bg-blue-100 border-blue-300 text-blue-600" },
                { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "Extract", desc: "Order ID, RT#", color: "bg-purple-100 border-purple-300 text-purple-600" },
                { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Lookup", desc: "Order → AWB", color: "bg-[#fff5f0] border-[#ffceb3] text-[#ff6b35]" },
                { icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", title: "Find Video", desc: "S3 by AWB", color: "bg-green-100 border-green-300 text-green-600" },
                { icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", title: "Send Reply", desc: "With video link", color: "bg-[#f0fdf9] border-[#00d9a5]/30 text-[#00d9a5]" },
              ].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${step.color}`}>
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-semibold text-[#1a1a2e]">{step.title}</div>
                      <div className="text-xs text-[#64748b]">{step.desc}</div>
                    </div>
                  </div>
                  {i < 4 && <div className="text-[#e8e4de] text-xl mx-4">→</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Reply Email Preview */}
          <div className="mt-8 bg-white rounded-2xl p-8 border border-[#e8e4de]">
            <h3 className="font-bold text-[#1a1a2e] mb-6">Sample Reply Email</h3>

            <div className="bg-[#1a1a2e] rounded-xl p-6 font-mono text-sm">
              <div className="text-[#64748b] mb-4">
                <div>To: ajio-claims@ajio.com</div>
                <div>Subject: Re: CCTV Footage Request - Order FN9735702115</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-[#1a1a2e]">
                <p>Dear Team,</p>
                <br />
                <p>Please find the CCTV footage links for Order ID: <strong>FN9735702115</strong></p>
                <br />
                <table className="w-full border-collapse border border-[#e8e4de] text-left">
                  <thead>
                    <tr className="bg-[#faf8f5]">
                      <th className="border border-[#e8e4de] px-3 py-2">AWB</th>
                      <th className="border border-[#e8e4de] px-3 py-2">Video Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#e8e4de] px-3 py-2">SF205327752</td>
                      <td className="border border-[#e8e4de] px-3 py-2 text-[#00d9a5]">
                        <span className="underline">SF205327752_packing.mp4</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <p><strong>Note:</strong> These links will expire in 3 days. Please download before expiry.</p>
                <br />
                <p>Thanks & Regards,<br />Kotty Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mail Providers Section */}
      <section id="providers" className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">Supported Mail Providers</h2>
            <p className="text-[#64748b]">Configure your preferred email provider for sending replies.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mailProviders.map((provider, i) => (
              <div key={i} className={`rounded-2xl p-6 border ${
                provider.status === "Supported" ? "bg-white border-[#00d9a5]/30" : "bg-[#faf8f5] border-[#e8e4de]"
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                    {provider.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1a2e]">{provider.name}</div>
                    <div className={`text-sm ${
                      provider.status === "Supported" ? "text-[#00b386]" :
                      provider.status === "Coming Soon" ? "text-blue-600" : "text-[#64748b]"
                    }`}>
                      {provider.status}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[#64748b] mb-4">Required credentials:</div>
                <div className="flex flex-wrap gap-2">
                  {provider.config.map((cred, j) => (
                    <code key={j} className="px-2 py-1 bg-[#faf8f5] text-[#64748b] rounded text-xs font-mono">
                      {cred}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#00d9a5] to-[#00b386] rounded-2xl p-10 text-white">
            <h2 className="font-display text-2xl font-bold mb-4">Ready to Automate Email Replies?</h2>
            <p className="text-teal-100 mb-6">
              Set up Ajio Mail Replying and save hours of manual work every day.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/get-started"
                className="inline-flex items-center px-6 py-3 bg-white text-[#00b386] font-semibold rounded-xl hover:bg-teal-50 transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/out-of-stock"
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
              >
                ← Explore Out of Stock
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
