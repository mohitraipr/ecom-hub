import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            E-commerce Automation Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Automate Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-commerce Operations
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Powerful tools to manage inventory, automate customer responses, and keep your
            e-commerce business running smoothly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/out-of-stock"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Explore Out of Stock
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/ajio-mail"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200"
            >
              Explore Ajio Mail
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Two Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each feature is designed to save hours of manual work and prevent costly mistakes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Out of Stock Card */}
            <Link href="/out-of-stock" className="group">
              <div className="feature-card bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">Out of Stock Management</h3>
                <p className="text-gray-600 mb-6">
                  Never miss a restock again. Real-time inventory monitoring with intelligent alerts
                  based on production lead times and daily order velocity.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-orange-600 font-bold text-sm">1</span>
                    </div>
                    <span className="text-gray-700">Connect to EasyEcom API</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-orange-600 font-bold text-sm">2</span>
                    </div>
                    <span className="text-gray-700">Set making time for each SKU</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-orange-600 font-bold text-sm">3</span>
                    </div>
                    <span className="text-gray-700">Get RED/ORANGE/GREEN status alerts</span>
                  </div>
                </div>

                <div className="flex items-center text-orange-600 font-medium group-hover:gap-3 gap-2 transition-all">
                  View Demo & Documentation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Ajio Mail Card */}
            <Link href="/ajio-mail" className="group">
              <div className="feature-card bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ajio Mail Replying</h3>
                <p className="text-gray-600 mb-6">
                  Automatically respond to CCTV footage requests from Ajio marketplace.
                  Extract order details, find videos, and send professional replies.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <span className="text-gray-700">Connect Zoho Mail (or Gmail)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <span className="text-gray-700">Upload Order ID → AWB mapping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <span className="text-gray-700">Bulk reply with video links</span>
                  </div>
                </div>

                <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 gap-2 transition-all">
                  View Demo & Documentation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our step-by-step documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Connect APIs", desc: "Link your EasyEcom account and mail provider" },
              { step: "2", title: "Configure Rules", desc: "Set making times, thresholds, and mappings" },
              { step: "3", title: "Monitor Dashboard", desc: "View real-time status and alerts" },
              { step: "4", title: "Take Action", desc: "Respond to alerts and automate replies" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Automate?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Explore the interactive demos and documentation to see exactly how each feature works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/out-of-stock"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
              >
                Start with Out of Stock
              </Link>
              <Link
                href="/ajio-mail"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-all border border-blue-400"
              >
                Start with Ajio Mail
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
