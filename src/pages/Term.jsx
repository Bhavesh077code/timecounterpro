import React from 'react';
import { 
  FiFileText, FiCheckCircle, FiAlertCircle, FiShield, 
  FiUserX, FiMail, FiLock, FiInfo, FiExternalLink
} from 'react-icons/fi';

function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-3xl border border-indigo-100 mb-4 shadow-sm">
            <FiFileText size={40} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
            Terms & Conditions
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Effective from: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Section 1: Acceptance of Terms */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 flex-shrink-0">
                <FiCheckCircle size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">1. Acceptance of Terms</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  By accessing or using TimeCounterPro, you agree to be bound by these Terms & Conditions. 
                  If you do not agree to these terms, please do not use our website or services.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  These terms apply to all visitors, users, and others who access or use the service.
                </p>
                <div className="mt-3 flex items-start gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <FiInfo size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <p className="text-indigo-700 text-xs">
                    <span className="font-semibold">Important:</span> By using this service, you confirm that you have 
                    read, understood, and agree to these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Use of Service */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 flex-shrink-0">
                <FiShield size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">2. Use of Service</h2>
                <p className="text-slate-600 text-sm mb-3">
                  By using TimeCounterPro, you agree to the following conditions:
                </p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm">
                  <li>You must be at least 13 years old to use this service</li>
                  <li>You agree not to misuse, abuse, or exploit the service</li>
                  <li>All countdowns and data are stored locally in your browser</li>
                  <li>We reserve the right to modify, suspend, or discontinue the service at any time</li>
                  <li>You are responsible for maintaining the security of your device</li>
                </ul>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 text-xs flex items-start gap-2">
                    <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold">Data Storage:</span> All timers and countdowns are stored locally 
                      on your device. We do not store your data on our servers.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: User Responsibilities */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0">
                <FiLock size={18} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">3. User Responsibilities</h2>
                <p className="text-slate-600 text-sm mb-3">As a user of TimeCounterPro, you are responsible for:</p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm">
                  <li>Ensuring the accuracy of your timer and countdown settings</li>
                  <li>Maintaining the confidentiality of your device and browser</li>
                  <li>Using the service in compliance with all applicable laws</li>
                  <li>Not interfering with or disrupting the service</li>
                  <li>Reporting any issues or bugs to us</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Prohibited Activities */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-100 flex-shrink-0">
                <FiUserX size={18} className="text-rose-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">4. Prohibited Activities</h2>
                <p className="text-slate-600 text-sm mb-3">The following activities are strictly prohibited:</p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm">
                  <li><span className="font-medium">Click Fraud:</span> Clicking your own ads or engaging in fraudulent activity</li>
                  <li><span className="font-medium">Automated Access:</span> Using bots, crawlers, or automated scripts</li>
                  <li><span className="font-medium">Security Violations:</span> Attempting to hack, disrupt, or compromise the service</li>
                  <li><span className="font-medium">Misuse:</span> Using the countdown functionality for illegal purposes</li>
                  <li><span className="font-medium">Content Abuse:</span> Creating offensive or inappropriate timer names</li>
                  <li><span className="font-medium">Service Interference:</span> Overloading or disrupting the service</li>
                </ul>
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <p className="text-rose-700 text-xs flex items-start gap-2">
                    <FiAlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold">Violation:</span> Any violation of these prohibited activities may 
                      result in immediate termination of access to the service.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Intellectual Property */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-50 rounded-lg border border-purple-100 flex-shrink-0">
                <FiFileText size={18} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">5. Intellectual Property</h2>
                <p className="text-slate-600 text-sm">
                  All content, features, and functionality on TimeCounterPro are owned by us and are protected by 
                  copyright, trademark, and other intellectual property laws.
                </p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm mt-3">
                  <li>You may not copy, modify, or distribute our content without permission</li>
                  <li>All timers and countdowns created by you remain your property</li>
                  <li>We reserve all rights not expressly granted</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6: Disclaimer of Warranties */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100 flex-shrink-0">
                <FiAlertCircle size={18} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">6. Disclaimer of Warranties</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  TimeCounterPro is provided on an "as is" and "as available" basis without any warranties of any kind.
                </p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm mt-3">
                  <li>We do not warrant that the service will be uninterrupted or error-free</li>
                  <li>We are not responsible for any data loss or damages</li>
                  <li>All data is stored locally on your device</li>
                  <li>We make no guarantees about the accuracy of timers</li>
                  <li>Use of the service is at your own risk</li>
                </ul>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 text-xs flex items-start gap-2">
                    <FiInfo size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold">Important:</span> We are not liable for any loss or damage 
                      arising from your use of the service.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Limitation of Liability */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex-shrink-0">
                <FiShield size={18} className="text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">7. Limitation of Liability</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  To the maximum extent permitted by law, TimeCounterPro and its affiliates shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages.
                </p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm mt-3">
                  <li>Loss of data or content</li>
                  <li>Loss of profits or business</li>
                  <li>Service interruptions or downtime</li>
                  <li>Any other damages arising from your use of the service</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 8: Termination */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-teal-50 rounded-lg border border-teal-100 flex-shrink-0">
                <FiCheckCircle size={18} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">8. Termination</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  We reserve the right to terminate or suspend your access to the service at any time, 
                  without prior notice, for any reason, including but not limited to:
                </p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm mt-3">
                  <li>Violation of these Terms & Conditions</li>
                  <li>Engaging in prohibited activities</li>
                  <li>Misuse or abuse of the service</li>
                  <li>At our sole discretion</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 9: Governing Law */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 flex-shrink-0">
                <FiExternalLink size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">9. Governing Law</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  These Terms & Conditions are governed by and construed in accordance with the laws of the United States, 
                  without regard to its conflict of law provisions.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Any disputes arising from these terms shall be resolved in the courts of the United States.
                </p>
              </div>
            </div>
          </div>

          {/* Section 10: Contact Us */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg border border-indigo-200 flex-shrink-0">
                <FiMail size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">10. Contact Us</h2>
                <p className="text-slate-600 text-sm">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-200 inline-block">
                  <a 
                    href="mailto:timecounterpro@gmail.com" 
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-2"
                  >
                    <FiMail size={14} />
                    timecounterpro@gmail.com
                  </a>
                </div>
                <p className="text-slate-400 text-xs mt-3">
                  We aim to respond to all inquiries within 48 hours.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-4">
          <p>TimeCounterPro · Terms & Conditions</p>
          <p className="mt-1">
            <a href="/" className="hover:text-slate-600 transition-colors">Home</a>
            <span className="mx-2">·</span>
            <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="/terms" className="hover:text-slate-600 transition-colors">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;