import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-purple-500/25 mb-4">
          <span className="text-6xl">🔒</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            Welcome to TimeCounterPro. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you use our website.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">2. Cookies & Third-Party Advertising</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We use cookies to enhance your experience and serve personalized ads. Third-party vendors, 
            including Google, use cookies to serve ads based on your previous visits to our website.
          </p>
          {/*
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <span className="font-bold">📌 Google AdSense Disclosure:</span> Google uses cookies to serve ads on our site. 
              Users may opt out of personalized advertising by visiting 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">
                Google Ads Settings
              </a>.
            </p>
          </div> */}
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">3. Data We Collect</h2>
          <ul className="text-gray-300 space-y-2 list-disc pl-6">
            <li>Usage data (pages visited, time spent)</li>
            <li>Device information (browser, IP address)</li>
            <li>Cookies for ad personalization</li>
            <li>Local storage data (countdowns you create)</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">4. Your Rights</h2>
          <ul className="text-gray-300 space-y-2 list-disc pl-6">
            <li>Access your personal data</li>
            <li>Request data deletion</li>
            <li>Opt-out of personalized ads</li>
            <li>Clear your local storage data anytime</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
          <p className="text-gray-300">If you have any questions about this privacy policy, please contact us at:</p>
          <p className="text-purple-400 mt-2">📧 privacy@timecounterpro.app</p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;