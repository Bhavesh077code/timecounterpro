// src/utils/helpers.js

// ============================================
// 1. FORMAT TIME
// ============================================
export const formatTime = (seconds) => {
  // ✅ Handle invalid input
  if (!seconds || typeof seconds !== 'number' || seconds < 0) {
    return { 
      hours: '00', 
      minutes: '00', 
      seconds: '00',
      short: '0s', 
      formatted: '00:00:00' 
    };
  }

  // ✅ Handle large numbers (prevent overflow)
  const safeSeconds = Math.min(seconds, 86400 * 365); // Max 1 year

  const h = Math.floor(safeSeconds / 3600);
  const m = Math.floor((safeSeconds % 3600) / 60);
  const s = Math.floor(safeSeconds % 60);

  const hours = String(h).padStart(2, '0');
  const minutes = String(m).padStart(2, '0');
  const secondsStr = String(s).padStart(2, '0');

  let short = '';
  if (h > 0) {
    short = `${h}h ${m}m`;
  } else if (m > 0) {
    short = `${m}m ${s}s`;
  } else {
    short = `${s}s`;
  }

  return {
    hours,
    minutes,
    seconds: secondsStr,
    short,
    formatted: `${hours}:${minutes}:${secondsStr}`,
    // ✅ Additional formats
    shortHours: h > 0 ? `${h}h` : '',
    shortMinutes: m > 0 ? `${m}m` : '',
    shortSeconds: s > 0 ? `${s}s` : '',
    totalSeconds: safeSeconds,
  };
};

// ============================================
// 2. CALCULATE STATISTICS
// ============================================
export const calculateStats = (timers) => {
  // ✅ Handle empty or invalid input
  if (!timers || !Array.isArray(timers) || timers.length === 0) {
    return {
      total: 0,
      totalTime: 0,
      averageTime: 0,
      mostPopular: 'N/A',
      mostUsed: {},
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
    };
  }

  // ✅ Filter out invalid timers
  const validTimers = timers.filter(t => t && typeof t === 'object' && t.duration);
  
  if (validTimers.length === 0) {
    return {
      total: 0,
      totalTime: 0,
      averageTime: 0,
      mostPopular: 'N/A',
      mostUsed: {},
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
    };
  }

  const total = validTimers.length;
  const totalTime = validTimers.reduce((acc, t) => acc + (t.duration || 0), 0);
  const averageTime = Math.round(totalTime / total);
  
  // ✅ Most used timer
  const mostUsed = validTimers.reduce((acc, t) => {
    const name = t.name || 'Unnamed Timer';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const mostPopular = Object.keys(mostUsed).reduce((a, b) => 
    mostUsed[a] > mostUsed[b] ? a : b, 'N/A'
  );

  // ✅ Additional stats
  const totalMinutes = Math.floor(totalTime / 60);
  const totalHours = Math.floor(totalTime / 3600);
  const totalDays = Math.floor(totalTime / 86400);

  return {
    total,
    totalTime,
    averageTime,
    mostPopular,
    mostUsed,
    totalMinutes,
    totalHours,
    totalDays,
  };
};

// ============================================
// 3. COPY TO CLIPBOARD
// ============================================
export const copyToClipboard = async (text) => {
  // ✅ Validate input
  if (!text || typeof text !== 'string') {
    console.warn('Copy failed: Invalid text');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Copy failed:', error);
    return false;
  }
};

// ============================================
// 4. GENERATE UNIQUE ID
// ============================================
export const generateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp}-${random}`;
};

// ============================================
// 5. GET TIME REMAINING
// ============================================
export const getTimeRemaining = (targetDate) => {
  // ✅ Validate input
  if (!targetDate) return null;

  const target = new Date(targetDate).getTime();
  if (isNaN(target)) {
    console.warn('Invalid target date:', targetDate);
    return null;
  }

  const now = Date.now();
  const diff = target - now;

  // ✅ If event already passed
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
      isPast: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    total: diff,
    isPast: false,
    // ✅ Additional formatted outputs
    totalHours: days * 24 + hours,
    totalMinutes: days * 24 * 60 + hours * 60 + minutes,
    totalSeconds: diff / 1000,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  };
};

// ============================================
// 6. VALIDATE EMAIL
// ============================================
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ============================================
// 7. TRUNCATE TEXT
// ============================================
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// ============================================
// 8. GET INITIALS
// ============================================
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// ============================================
// 9. FORMAT DATE
// ============================================
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================
// 10. DEBOUNCE (for search/input)
// ============================================
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ============================================
// 11. DARKEN COLOR (for themes)
// ============================================
export const darkenColor = (hex, amount = 20) => {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
  const b = Math.max(0, (num & 0x0000FF) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

// ============================================
// 12. LIGHTEN COLOR
// ============================================
export const lightenColor = (hex, amount = 20) => {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
  const b = Math.min(255, (num & 0x0000FF) + amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default {
  formatTime,
  calculateStats,
  copyToClipboard,
  generateId,
  getTimeRemaining,
  isValidEmail,
  truncateText,
  getInitials,
  formatDate,
  debounce,
  darkenColor,
  lightenColor,
};