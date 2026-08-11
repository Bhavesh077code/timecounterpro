// src/components/StatsCard.jsx
import React from 'react';

function StatsCard({ icon, title, value, subtitle, color = 'purple' }) {
  const colors = {
    purple: 'from-purple-500 to-pink-500',
    green: 'from-emerald-500 to-green-500',
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
  };

  const glowColors = {
    purple: 'shadow-purple-500/20',
    green: 'shadow-emerald-500/20',
    blue: 'shadow-blue-500/20',
    yellow: 'shadow-amber-500/20',
    red: 'shadow-red-500/20',
  };

  const displayValue = value !== undefined && value !== null ? value : '0';

  return (
    <div className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-4 sm:p-5 md:p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl ${glowColors[color] || 'shadow-purple-500/20'}`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color] || 'from-purple-500 to-pink-500'} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex items-start justify-between">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{icon || '📊'}</div>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider truncate">
            {title || 'Stats'}
          </p>
          <p className={`text-xl sm:text-2xl md:text-3xl font-bold mt-0.5 sm:mt-1 bg-gradient-to-r ${colors[color] || 'from-purple-500 to-pink-500'} bg-clip-text text-transparent`}>
            {displayValue}
          </p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Right Icon */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colors[color] || 'from-purple-500 to-pink-500'} opacity-10 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3`}>
          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br ${colors[color] || 'from-purple-500 to-pink-500'} opacity-50`}></div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;