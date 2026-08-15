import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-gray-400 mt-2">We'd love to hear from you! 👋</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📬 Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">timecounterpro@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐦</span>
                <div>
                  <p className="text-gray-400 text-sm">Twitter</p>
                  <p className="text-white">@TimeCounterPro</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💻</span>
                <div>
                  <p className="text-gray-400 text-sm"></p>
                  <p className="text-white"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📝 Send Message</h2>
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-white font-bold text-lg">Message Sent!</h3>
              <p className="text-gray-400 mt-2">We'll get back to you soon. 🚀</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Subject" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="Your Message..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300">📤 Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;