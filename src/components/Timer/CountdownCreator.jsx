// src/components/Timer/CountdownCreator.jsx
import React, { useState, useContext, useEffect } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { ShareButtons } from '../../Viral/ShareButtons';
import { URLGenerator } from '../../Viral/URLGenerator';
import toast from 'react-hot-toast';

const THEMES = [
  { id: 'neon', label: 'Neon Dark', bg: 'from-purple-900 to-pink-900' },
  { id: 'sunset', label: 'Sunset', bg: 'from-orange-600 to-pink-600' },
  { id: 'cyber', label: 'Cyberpunk', bg: 'from-cyan-900 to-purple-900' },
  { id: 'ocean', label: 'Ocean Blue', bg: 'from-blue-900 to-teal-900' },
  { id: 'forest', label: 'Forest Green', bg: 'from-green-900 to-emerald-900' },
];

function CountdownCreator() {
  const { addTimer, generateShareURL } = useContext(TimerContext);
  const [eventName, setEventName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('23:59');
  const [selectedTheme, setSelectedTheme] = useState('neon');
  const [generatedURL, setGeneratedURL] = useState('');

  // ✅ Get base URL dynamically
  const getBaseURL = () => {
    // Production domain
    const productionDomain = 'https://timecounterpro.com';
    
    // If on localhost, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
    }
    
    // Use production domain
    return productionDomain;
  };

  // ✅ Generate URL on change
  useEffect(() => {
    if (eventName && targetDate) {
      const dateTime = `${targetDate}T${targetTime}`;
      const base = getBaseURL();
      const query = new URLSearchParams({
        event: eventName,
        date: dateTime,
        theme: selectedTheme,
      }).toString();
      const url = `${base}?${query}`;
      setGeneratedURL(url);
    } else {
      setGeneratedURL('');
    }
  }, [eventName, targetDate, targetTime, selectedTheme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName || !targetDate) {
      toast.error('Please fill in all fields');
      return;
    }

    const dateTime = `${targetDate}T${targetTime}`;
    
    addTimer({
      name: eventName,
      targetDate: dateTime,
      type: 'countdown',
      theme: selectedTheme,
    });

    toast.success('Countdown created! 🎉');
    
    const base = getBaseURL();
    const query = new URLSearchParams({
      event: eventName,
      date: dateTime,
      theme: selectedTheme,
    }).toString();
    const url = `${base}?${query}`;
    setGeneratedURL(url);
  };

  const handleTestLink = () => {
    if (generatedURL) {
      window.open(generatedURL, '_blank');
    }
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">📅 Create Custom Countdown</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1.5">Event Name *</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., New Year 2025 🎆"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1.5">Target Date *</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1.5">Target Time</label>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1.5">Theme Color</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTheme === theme.id
                    ? `bg-gradient-to-br ${theme.bg} border-purple-500 shadow-lg shadow-purple-500/25`
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <span className="text-xs text-white">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300"
        >
          🚀 Create Countdown
        </button>
      </form>

      {generatedURL && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <URLGenerator url={generatedURL} />
          
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={handleTestLink}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300"
            >
              🔗 Test Link
            </button>
            <ShareButtons url={generatedURL} title={eventName} />
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            💡 Click <span className="text-purple-400">"Test Link"</span> to preview the countdown
          </div>
        </div>
      )}
    </div>
  );
}

export default CountdownCreator;