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
    <div className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl ${glowColors[color] || 'shadow-purple-500/20'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color] || 'from-purple-500 to-pink-500'} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="text-3xl mb-2">{icon || '📊'}</div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title || 'Stats'}</p>
          <p className={`text-3xl font-bold mt-1 bg-gradient-to-r ${colors[color] || 'from-purple-500 to-pink-500'} bg-clip-text text-transparent`}>
            {displayValue}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color] || 'from-purple-500 to-pink-500'} opacity-10 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center`}>
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors[color] || 'from-purple-500 to-pink-500'} opacity-50`}></div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;