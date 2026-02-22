"use client";

import { useState } from "react";
import Link from "next/link";

export default function GetStartedPage() {
  const [selectedFeature, setSelectedFeature] = useState<"out-of-stock" | "ajio-mail" | "both">("both");

  const allCredentials = {
    "out-of-stock": [
      { name: "EASYECOM_ACCESS_TOKEN", description: "EasyEcom API token for webhook authentication", required: true },
      { name: "DB_HOST", description: "MySQL database host", required: true },
      { name: "DB_USER", description: "Database username", required: true },
      { name: "DB_PASSWORD", description: "Database password", required: true },
      { name: "DB_NAME", description: "Database name", required: true },
    ],
    "ajio-mail": [
      { name: "ZOHO_CLIENT_ID", description: "Zoho OAuth client ID", required: true },
      { name: "ZOHO_CLIENT_SECRET", description: "Zoho OAuth client secret", required: true },
      { name: "ZOHO_REFRESH_TOKEN", description: "Zoho OAuth refresh token", required: true },
      { name: "ZOHO_DC", description: "Zoho data center (IN, US, EU, AU)", required: true },
      { name: "ZOHO_SENDER_EMAIL", description: "Email address for sending replies", required: true },
      { name: "AWS_ACCESS_KEY_ID", description: "AWS access key for S3", required: true },
      { name: "AWS_SECRET_ACCESS_KEY", description: "AWS secret key for S3", required: true },
      { name: "S3_BUCKET_NAME", description: "S3 bucket containing videos", required: true },
    ],
  };

  const getCredentials = () => {
    if (selectedFeature === "both") {
      return [...allCredentials["out-of-stock"], ...allCredentials["ajio-mail"]];
    }
    return allCredentials[selectedFeature];
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 font-display">Get Started with ecom-hub</h1>
          <p className="text-[#a0aec0] text-lg">
            Follow this checklist to set up your e-commerce automation tools.
          </p>
        </div>
      </section>

      {/* Feature Selection */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Which features do you want to set up?</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => setSelectedFeature("out-of-stock")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedFeature === "out-of-stock"
                  ? "border-[#ff6b35] bg-[#ff6b35]/5"
                  : "border-[#e8e4de] bg-white hover:border-[#ff6b35]/50"
              }`}
            >
              <div className="w-10 h-10 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#ff6b35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="font-semibold text-[#1a1a2e]">Out of Stock Only</div>
              <div className="text-sm text-[#64748b] mt-1">Inventory monitoring</div>
            </button>

            <button
              onClick={() => setSelectedFeature("ajio-mail")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedFeature === "ajio-mail"
                  ? "border-[#00d9a5] bg-[#00d9a5]/5"
                  : "border-[#e8e4de] bg-white hover:border-[#00d9a5]/50"
              }`}
            >
              <div className="w-10 h-10 bg-[#00d9a5]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#00d9a5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-semibold text-[#1a1a2e]">Ajio Mail Only</div>
              <div className="text-sm text-[#64748b] mt-1">Email automation</div>
            </button>

            <button
              onClick={() => setSelectedFeature("both")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedFeature === "both"
                  ? "border-[#ff6b35] bg-gradient-to-br from-[#ff6b35]/5 to-[#00d9a5]/5"
                  : "border-[#e8e4de] bg-white hover:border-[#ff6b35]/50"
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35]/10 to-[#00d9a5]/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#ff6b35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="font-semibold text-[#1a1a2e]">Both Features</div>
              <div className="text-sm text-[#64748b] mt-1">Complete setup</div>
            </button>
          </div>

          {/* Credentials Checklist */}
          <div className="bg-white rounded-2xl border border-[#e8e4de] p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Required Credentials</h2>
            <p className="text-[#64748b] mb-6">
              Collect these credentials before setting up. Check off each item as you obtain it.
            </p>

            <div className="space-y-3">
              {getCredentials().map((cred, i) => (
                <label key={i} className="flex items-start gap-4 p-4 bg-[#faf8f5] rounded-lg cursor-pointer hover:bg-[#f5f0eb] transition-colors">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-[#ff6b35] rounded border-[#e8e4de] focus:ring-[#ff6b35]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-[#1a1a2e]">{cred.name}</code>
                      {cred.required && (
                        <span className="text-xs text-[#ff6b35] font-medium">Required</span>
                      )}
                    </div>
                    <div className="text-sm text-[#64748b] mt-1">{cred.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Environment File Template */}
          <div className="bg-white rounded-2xl border border-[#e8e4de] p-8 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1a2e]">.env File Template</h2>
              <button
                onClick={() => {
                  const envContent = getCredentials().map(c => `${c.name}=`).join("\n");
                  navigator.clipboard.writeText(envContent);
                }}
                className="px-4 py-2 bg-[#faf8f5] text-[#1a1a2e] rounded-lg hover:bg-[#f5f0eb] transition-colors text-sm font-medium flex items-center gap-2 border border-[#e8e4de]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 text-white font-mono text-sm overflow-x-auto">
              <div className="text-[#64748b] mb-4"># .env file - Add your values after the = sign</div>
              {getCredentials().map((cred, i) => (
                <div key={i}>
                  <span className="text-[#00d9a5]">{cred.name}</span>=<span className="text-[#64748b]">your_value_here</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-[#e8e4de] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Next Steps</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {(selectedFeature === "out-of-stock" || selectedFeature === "both") && (
                <Link
                  href="/out-of-stock#setup"
                  className="flex items-center gap-4 p-4 bg-[#ff6b35]/5 rounded-xl hover:bg-[#ff6b35]/10 transition-colors border border-[#ff6b35]/20"
                >
                  <div className="w-12 h-12 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#ff6b35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1a2e]">Out of Stock Setup Guide</div>
                    <div className="text-sm text-[#64748b]">Step-by-step EasyEcom integration</div>
                  </div>
                  <svg className="w-5 h-5 text-[#64748b] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              {(selectedFeature === "ajio-mail" || selectedFeature === "both") && (
                <Link
                  href="/ajio-mail#setup"
                  className="flex items-center gap-4 p-4 bg-[#00d9a5]/5 rounded-xl hover:bg-[#00d9a5]/10 transition-colors border border-[#00d9a5]/20"
                >
                  <div className="w-12 h-12 bg-[#00d9a5]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#00d9a5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1a2e]">Ajio Mail Setup Guide</div>
                    <div className="text-sm text-[#64748b]">Configure Zoho Mail integration</div>
                  </div>
                  <svg className="w-5 h-5 text-[#64748b] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-white border-t border-[#e8e4de]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Need Help?</h2>
          <p className="text-[#64748b] mb-6">
            If you&apos;re having trouble setting up or have questions, reach out for assistance.
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#faf8f5] rounded-xl border border-[#e8e4de]">
            <svg className="w-6 h-6 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[#1a1a2e]">Contact support via ecom-hub.in</span>
          </div>
        </div>
      </section>
    </div>
  );
}
