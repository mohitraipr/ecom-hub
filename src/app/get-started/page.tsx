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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Get Started with ecom-hub</h1>
          <p className="text-gray-300 text-lg">
            Follow this checklist to set up your e-commerce automation tools.
          </p>
        </div>
      </section>

      {/* Feature Selection */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Which features do you want to set up?</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => setSelectedFeature("out-of-stock")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedFeature === "out-of-stock"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">Out of Stock Only</div>
              <div className="text-sm text-gray-500 mt-1">Inventory monitoring</div>
            </button>

            <button
              onClick={() => setSelectedFeature("ajio-mail")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedFeature === "ajio-mail"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">Ajio Mail Only</div>
              <div className="text-sm text-gray-500 mt-1">Email automation</div>
            </button>

            <button
              onClick={() => setSelectedFeature("both")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedFeature === "both"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">Both Features</div>
              <div className="text-sm text-gray-500 mt-1">Complete setup</div>
            </button>
          </div>

          {/* Credentials Checklist */}
          <div className="bg-white rounded-2xl border p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Required Credentials</h2>
            <p className="text-gray-600 mb-6">
              Collect these credentials before setting up. Check off each item as you obtain it.
            </p>

            <div className="space-y-3">
              {getCredentials().map((cred, i) => (
                <label key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-gray-900">{cred.name}</code>
                      {cred.required && (
                        <span className="text-xs text-red-600 font-medium">Required</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{cred.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Environment File Template */}
          <div className="bg-white rounded-2xl border p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">.env File Template</h2>
              <button
                onClick={() => {
                  const envContent = getCredentials().map(c => `${c.name}=`).join("\n");
                  navigator.clipboard.writeText(envContent);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-white font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-4"># .env file - Add your values after the = sign</div>
              {getCredentials().map((cred, i) => (
                <div key={i}>
                  <span className="text-green-400">{cred.name}</span>=<span className="text-gray-500">your_value_here</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {(selectedFeature === "out-of-stock" || selectedFeature === "both") && (
                <Link
                  href="/out-of-stock#setup"
                  className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Out of Stock Setup Guide</div>
                    <div className="text-sm text-gray-600">Step-by-step EasyEcom integration</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              {(selectedFeature === "ajio-mail" || selectedFeature === "both") && (
                <Link
                  href="/ajio-mail#setup"
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Ajio Mail Setup Guide</div>
                    <div className="text-sm text-gray-600">Configure Zoho Mail integration</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you&apos;re having trouble setting up or have questions, reach out for assistance.
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-100 rounded-xl">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700">Contact support via ecom-hub.in</span>
          </div>
        </div>
      </section>
    </div>
  );
}
