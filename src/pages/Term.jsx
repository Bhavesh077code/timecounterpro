import React from 'react';

function Terms() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-purple-500/25 mb-4">
          <span className="text-6xl">📋</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        <p className="text-gray-400 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-300 leading-relaxed">By using TimeCounterPro, you agree to these Terms & Conditions. If you do not agree, please do not use our website.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">2. Use of Service</h2>
          <ul className="text-gray-300 space-y-2 list-disc pl-6">
            <li>You must be at least 13 years old to use this service</li>
            <li>You agree not to misuse or abuse the service</li>
            <li>All countdowns and data are stored locally in your browser</li>
            <li>We reserve the right to modify or discontinue the service</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">3. Disclaimer</h2>
          <p className="text-gray-300 leading-relaxed">TimeCounterPro is provided "as is" without any warranties. We are not responsible for any data loss or damages arising from the use of our service. All data is stored locally on your device.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">4. Prohibited Activities</h2>
          <ul className="text-gray-300 space-y-2 list-disc pl-6">
            <li>Clicking your own ads (fraudulent activity)</li>
            <li>Using bots or automated scripts</li>
            <li>Attempting to hack or disrupt the service</li>
            <li>Misusing the countdown functionality</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">5. Contact</h2>
          <p className="text-gray-300">For questions about these terms, contact us at:</p>
          <p className="text-purple-400 mt-2">📧 legal@timecounterpro.app</p>
        </div>
      </div>
    </div>
  );
}

export default Terms;