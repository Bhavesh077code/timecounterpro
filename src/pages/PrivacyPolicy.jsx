import React from 'react';
import { 
  FiShield, FiInfo, FiDatabase, FiUserCheck, 
  FiMail, FiLock, FiFileText, FiGlobe, FiAlertCircle,
  FiCpu, FiTool, FiLink, FiExternalLink
} from 'react-icons/fi';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-3xl border border-indigo-100 mb-4 shadow-sm">
            <FiShield size={40} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
            Privacy Policy
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
          
          {/* Section 1: Introduction */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 flex-shrink-0">
                <FiInfo size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">1. Introduction</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Welcome to TimeCounterPro. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, and safeguard your information when you use our website.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  By using TimeCounterPro, you agree to the collection and use of information in accordance with this policy.
                </p>
                <div className="mt-3 flex items-start gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <FiAlertCircle size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <p className="text-indigo-700 text-xs">
                    <span className="font-semibold">Our Commitment:</span> We do not sell, rent, or share your personal data 
                    with third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 flex-shrink-0">
                <FiDatabase size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">2. Information We Collect</h2>
                <p className="text-slate-600 text-sm mb-3">We collect the following types of information:</p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm">
                  <li><span className="font-medium">Usage Data:</span> Pages visited, time spent on the site, and interactions with our timers</li>
                  <li><span className="font-medium">Device Information:</span> Browser type, IP address, operating system, and device type</li>
                  <li><span className="font-medium">Cookies:</span> Used for analytics, ad personalization, and improving user experience</li>
                  <li><span className="font-medium">Local Storage:</span> Timers, countdowns, and preferences you create on our site</li>
                  <li><span className="font-medium">Session Data:</span> Maintains your timer state and settings during your visit</li>
                </ul>
                <p className="text-slate-400 text-xs mt-2">
                  <span className="font-medium text-slate-500">Note:</span> We do not collect personal information such as your name, 
                  email, or phone number unless you voluntarily provide it through contact forms.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Cookies & Advertising */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100 flex-shrink-0">
                <FiLink size={18} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">3. Cookies & Third-Party Advertising</h2>
                <p className="text-slate-600 leading-relaxed text-sm mb-3">
                  We use cookies to enhance your experience and serve personalized ads. Third-party vendors, 
                  including Google, use cookies to serve ads based on your previous visits to our website.
                </p>
                
                {/* Google AdSense Disclosure */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-700 text-sm flex items-start gap-2">
                    <FiAlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold">Google AdSense Disclosure:</span> 
                      Google uses cookies to serve ads on our site. Users may opt out of personalized advertising by visiting 
                      <a 
                        href="https://www.google.com/settings/ads" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 hover:underline"
                      >
                        Google Ads Settings
                      </a>.
                    </span>
                  </p>
                </div>

                <p className="text-slate-500 text-xs mt-3">
                  <span className="font-medium">Third-Party Vendors:</span> We use Google AdSense, Google Analytics, and other 
                  third-party services that may use cookies to collect information about your browsing activities.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: How We Use Your Data */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 flex-shrink-0">
                <FiCpu size={18} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">4. How We Use Your Data</h2>
                <p className="text-slate-600 text-sm mb-3">We use the information we collect for the following purposes:</p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm">
                  <li>To provide and maintain our timer services</li>
                  <li>To improve and optimize user experience</li>
                  <li>To analyze usage patterns and site performance</li>
                  <li>To serve relevant advertisements through Google AdSense</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Your Rights */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-50 rounded-lg border border-purple-100 flex-shrink-0">
                <FiUserCheck size={18} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">5. Your Rights</h2>
                <p className="text-slate-600 text-sm mb-3">Under data protection laws, you have the following rights:</p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm">
                  <li><span className="font-medium">Right to Access:</span> Request a copy of your personal data</li>
                  <li><span className="font-medium">Right to Rectification:</span> Correct inaccurate or incomplete data</li>
                  <li><span className="font-medium">Right to Erasure:</span> Request deletion of your personal data</li>
                  <li><span className="font-medium">Right to Object:</span> Opt-out of personalized advertising</li>
                  <li><span className="font-medium">Right to Data Portability:</span> Request data transfer</li>
                  <li><span className="font-medium">Right to Withdraw Consent:</span> Withdraw consent at any time</li>
                </ul>
                <p className="text-slate-400 text-xs mt-2">
                  You can also clear your local storage data anytime from your browser settings.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Data Security */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-100 flex-shrink-0">
                <FiLock size={18} className="text-rose-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">6. Data Security</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  We implement appropriate technical and organizational measures to protect your personal data 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="text-slate-600 space-y-1.5 list-disc pl-5 text-sm mt-3">
                  <li>All data is stored locally on your device</li>
                  <li>We use HTTPS encryption for all data transmission</li>
                  <li>No personal data is stored on our servers</li>
                  <li>We regularly review our security practices</li>
                </ul>
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-emerald-700 text-xs flex items-center gap-2">
                    <FiShield size={14} />
                    <span><span className="font-semibold">Our Promise:</span> We do not sell, rent, or share your personal data with third parties.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Children's Privacy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-teal-50 rounded-lg border border-teal-100 flex-shrink-0">
                <FiUserCheck size={18} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">7. Children's Privacy</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Our service is not directed to children under 13. We do not knowingly collect personal information 
                  from children under 13. If you are a parent or guardian and believe your child has provided us with 
                  personal information, please contact us immediately.
                </p>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 text-xs">
                    <span className="font-semibold">COPPA Compliance:</span> We comply with the Children's Online Privacy 
                    Protection Act (COPPA) and do not target children under 13.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Contact Us */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg border border-indigo-200 flex-shrink-0">
                <FiMail size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">8. Contact Us</h2>
                <p className="text-slate-600 text-sm">
                  If you have any questions about this privacy policy, data practices, or your rights, please contact us:
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-200 inline-block">
                  <a 
                    href="mailto:privacy@timecounterpro.app" 
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

          {/* Section 9: Policy Updates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex-shrink-0">
                <FiFileText size={18} className="text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">9. Policy Updates</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  We may update this privacy policy from time to time. We will notify you of any changes by 
                  posting the new policy on this page and updating the "Last Updated" date. We encourage you to 
                  review this policy periodically for any changes.
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-4">
          <p>TimeCounterPro · Your privacy matters to us</p>
          <p className="mt-1">
            <a href="/" className="hover:text-slate-600 transition-colors">Home</a>
            <span className="mx-2">·</span>
            <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;