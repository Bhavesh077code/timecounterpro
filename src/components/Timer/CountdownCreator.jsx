/*/ src/components/Timer/CountdownCreator.jsx
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

*/



// src/components/Timer/CountdownCreator.jsx working
/*

import React, { useState, useContext, useEffect, useRef } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { ShareButtons } from '../../Viral/ShareButtons';
import { URLGenerator } from '../../Viral/URLGenerator';
import toast from 'react-hot-toast';

const THEMES = [
  { id: 'neon', label: 'Neon Dark', bg: 'from-purple-900 to-pink-900', emoji: '🌙' },
  { id: 'sunset', label: 'Sunset', bg: 'from-orange-600 to-pink-600', emoji: '🌅' },
  { id: 'cyber', label: 'Cyberpunk', bg: 'from-cyan-900 to-purple-900', emoji: '🤖' },
  { id: 'ocean', label: 'Ocean Blue', bg: 'from-blue-900 to-teal-900', emoji: '🌊' },
  { id: 'forest', label: 'Forest Green', bg: 'from-green-900 to-emerald-900', emoji: '🌿' },
];

function CountdownCreator() {
  const { addTimer, generateShareURL } = useContext(TimerContext);
  const [eventName, setEventName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('23:59');
  const [selectedTheme, setSelectedTheme] = useState('neon');
  const [generatedURL, setGeneratedURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef(null);

  // ✅ Get base URL
  const getBaseURL = () => {
    if (typeof window === 'undefined') return 'https://timecounterpro.com';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
    }
    return 'https://timecounterpro.com';
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

  // ✅ Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName || !targetDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const dateTime = `${targetDate}T${targetTime}`;
      const targetDateTime = new Date(dateTime).getTime();
      const currentTime = Date.now();
      const duration = Math.max(0, targetDateTime - currentTime);
      
      if (duration === 0) {
        toast.warning('Event time is in the past!');
        setIsLoading(false);
        return;
      }

      addTimer(
        eventName,
        duration,
        'countdown',
        dateTime,
        selectedTheme
      );

      toast.success('🎉 Countdown created successfully!');
      
      const base = getBaseURL();
      const query = new URLSearchParams({
        event: eventName,
        date: dateTime,
        theme: selectedTheme,
      }).toString();
      const url = `${base}?${query}`;
      setGeneratedURL(url);
      
      // ✅ Scroll to URL section
      setTimeout(() => {
        document.getElementById('url-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
    } catch (error) {
      toast.error('Failed to create countdown');
      console.error('Countdown creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Test Link
  const handleTestLink = () => {
    if (generatedURL) {
      window.open(generatedURL, '_blank');
    }
  };

  // ✅ Handle Copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedURL);
      setIsCopied(true);
      toast.success('Link copied! 📋');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-in">
     
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📅</span>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Create Custom Countdown</h2>
          <p className="text-xs sm:text-sm text-gray-400">Share your countdown with friends and family</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        <div>
          <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">
            Event Name <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🎯</span>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., New Year 2025 🎆"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              required
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">
              Target Date <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📆</span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">
              Target Time
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">⏰</span>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        
        <div>
          <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">
            Theme Color
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                  selectedTheme === theme.id
                    ? `bg-gradient-to-br ${theme.bg} border-purple-500 shadow-lg shadow-purple-500/25 scale-105`
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="text-xl sm:text-2xl">{theme.emoji}</div>
                <div className="text-[10px] sm:text-xs text-white mt-0.5">{theme.label}</div>
              </button>
            ))}
          </div>
        </div>

   
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl transition-all duration-300 ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating...
            </span>
          ) : (
            '🚀 Create Countdown'
          )}
        </button>
      </form>

     
      {generatedURL && (
        <div id="url-section" className="mt-6 pt-6 border-t border-white/5 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔗</span>
            <h3 className="text-sm sm:text-base font-semibold text-white">Shareable Link</h3>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">Ready</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={inputRef}
              type="text"
              value={generatedURL}
              readOnly
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-1.5 ${
                  isCopied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isCopied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button
                onClick={handleTestLink}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-1.5"
              >
                🔗 Test
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <ShareButtons url={generatedURL} title={eventName} />
          </div>
          
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <span>💡</span>
            <span>Click <span className="text-purple-400 font-medium">"Test"</span> to preview the countdown</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountdownCreator;

*/



import React, { useContext, useEffect, useRef, useState } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { ShareButtons } from '../../Viral/ShareButtons';
import { URLGenerator } from '../../Viral/URLGenerator';
import toast from 'react-hot-toast';

const THEMES = [
  { id: 'neon', label: 'Neon Dark', bg: 'from-purple-900 to-pink-900', emoji: '🌙' },
  { id: 'sunset', label: 'Sunset', bg: 'from-orange-600 to-pink-600', emoji: '🌅' },
  { id: 'cyber', label: 'Cyberpunk', bg: 'from-cyan-900 to-purple-900', emoji: '🤖' },
  { id: 'ocean', label: 'Ocean Blue', bg: 'from-blue-900 to-teal-900', emoji: '🌊' },
  { id: 'forest', label: 'Forest Green', bg: 'from-green-900 to-emerald-900', emoji: '🌿' },
];

const getBaseURL = () => {
  if (typeof window === 'undefined') return 'https://timecounterpro.com';
  return window.location.origin;
};

const toLocalDateTime = (date, time) => `${date}T${time}:00`;

function CountdownCreator() {
  const { addTimer } = useContext(TimerContext);
  const [eventName, setEventName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('23:59');
  const [selectedTheme, setSelectedTheme] = useState('neon');
  const [generatedURL, setGeneratedURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!eventName.trim() || !targetDate) {
      setGeneratedURL('');
      return;
    }

    const target = new Date(toLocalDateTime(targetDate, targetTime));
    if (Number.isNaN(target.getTime())) {
      setGeneratedURL('');
      return;
    }

    // Store an ISO UTC timestamp in the share URL so viewers in different timezones see the same instant.
    const query = new URLSearchParams({
      event: eventName.trim(),
      date: target.toISOString(),
      theme: selectedTheme,
    });
    setGeneratedURL(`${getBaseURL()}?${query.toString()}`);
  }, [eventName, targetDate, targetTime, selectedTheme]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!eventName.trim() || !targetDate) {
      toast.error('Please enter an event name and target date.');
      return;
    }

    const target = new Date(toLocalDateTime(targetDate, targetTime));
    const targetAt = target.getTime();
    const duration = Math.ceil((targetAt - Date.now()) / 1000);

    if (!Number.isFinite(targetAt) || duration <= 0) {
      toast.warning('Please choose a future date and time.');
      return;
    }

    setIsLoading(true);
    try {
      addTimer({
        name: eventName.trim(),
        duration,
        type: 'countdown',
        targetDate: target.toISOString(),
        theme: selectedTheme,
      });

      const query = new URLSearchParams({
        event: eventName.trim(),
        date: target.toISOString(),
        theme: selectedTheme,
      });
      const url = `${getBaseURL()}?${query.toString()}`;
      setGeneratedURL(url);
      toast.success('🎉 Countdown created successfully!');

      setTimeout(() => document.getElementById('url-section')?.scrollIntoView({ behavior: 'smooth' }), 150);
    } catch (error) {
      console.error('Countdown creation error:', error);
      toast.error('Failed to create countdown. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedURL) return;
    try {
      await navigator.clipboard.writeText(generatedURL);
      setIsCopied(true);
      toast.success('Link copied! 📋');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setIsCopied(true);
        toast.success('Link copied! 📋');
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        toast.error('Unable to copy the link.');
      }
    }
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📅</span>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Create Custom Countdown</h2>
          <p className="text-xs sm:text-sm text-gray-400">Create a countdown and share one exact moment with anyone.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">Event Name <span className="text-purple-400">*</span></label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} maxLength={80} placeholder="e.g. New Year 2027 🎆" className="w-full px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">Target Date <span className="text-purple-400">*</span></label>
            <input type="date" value={targetDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">Target Time</label>
            <input type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-1.5">Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {THEMES.map((theme) => (
              <button key={theme.id} type="button" onClick={() => setSelectedTheme(theme.id)} className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${selectedTheme === theme.id ? `bg-gradient-to-br ${theme.bg} border-purple-500 shadow-lg shadow-purple-500/25` : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                <div className="text-xl sm:text-2xl">{theme.emoji}</div>
                <div className="text-[10px] sm:text-xs text-white mt-1">{theme.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-purple-500/25">
          {isLoading ? 'Creating...' : '🚀 Create Countdown'}
        </button>
      </form>

      {generatedURL && (
        <div id="url-section" className="mt-6 pt-6 border-t border-white/5 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔗</span>
            <h3 className="text-sm sm:text-base font-semibold text-white">Shareable Link</h3>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">Ready</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input ref={inputRef} type="text" value={generatedURL} readOnly className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none" />
            <div className="flex gap-2">
              <button type="button" onClick={handleCopy} className={`px-4 py-2.5 rounded-lg text-sm font-medium ${isCopied ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>{isCopied ? '✅ Copied!' : '📋 Copy'}</button>
              <button type="button" onClick={() => window.open(generatedURL, '_blank', 'noopener,noreferrer')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">🔗 Test</button>
            </div>
          </div>
          <div className="mt-4"><URLGenerator url={generatedURL} /></div>
          <div className="mt-3"><ShareButtons url={generatedURL} title={eventName} /></div>
        </div>
      )}
    </div>
  );
}

export default CountdownCreator;
