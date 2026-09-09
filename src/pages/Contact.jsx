import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiTwitter, FiGithub, FiSend, FiCheckCircle, FiClock, FiMapPin, FiGlobe } from 'react-icons/fi';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || "TimeCounterPro feedback");
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:timecounterpro@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Contact info items
  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'timecounterpro@gmail.com',
      link: 'mailto:timecounterpro@gmail.com'
    },
    {
      icon: FiTwitter,
      label: 'Twitter',
      value: '@TimeCounterPro',
      link: 'https://twitter.com/TimeCounterPro'
    },
    {
      icon: FiGlobe,
      label: 'Website',
      value: 'timecounterpro.com',
      link: 'https://timecounterpro.com'
    },
    {
      icon: FiClock,
      label: 'Response Time',
      value: 'Within 24 hours'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact TimeCounterPro | Feedback & Support</title>
        <meta name="description" content="Contact TimeCounterPro with questions, feedback, bug reports or suggestions about our online timer tools." />
        <link rel="canonical" href="https://timecounterpro.com/contact" />
      </Helmet>
      <div className="max-w-5xl mx-auto animate-fade-in px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl border border-indigo-100 mb-4">
          <FiMail size={28} className="text-indigo-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
          Contact Us
        </h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Have questions, feedback, or suggestions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Contact Info - 2 columns on md+ */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Get in Touch
            </h2>
            
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0 border border-indigo-100">
                    <item.icon size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {item.label}
                    </p>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        target={item.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-indigo-600 transition-colors text-sm font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-slate-700 text-sm font-medium">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Office Hours
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Monday - Friday</span>
                <span className="text-slate-700 font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saturday</span>
                <span className="text-slate-700 font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sunday</span>
                <span className="text-slate-400">Closed</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-200 pt-3">
              We respond to all inquiries within 24 hours
            </p>
          </div>
        </div>

        {/* Contact Form - 3 columns on md+ */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Send a Message
            </h2>
            
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="John Doe" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="john@example.com" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    placeholder="How can we help?" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    rows="4" 
                    placeholder="Tell us what's on your mind..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" 
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <><FiSend size={16} /> Open Email</>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Your email app will open with the message addressed to timecounterpro@gmail.com
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-4">
        <p>We value your feedback and aim to respond to all messages within 24 hours.</p>
      </div>
      </div>
    </>
  );
}

export default Contact;