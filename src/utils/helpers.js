export const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return { short: '0s', formatted: '00:00:00' };
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
    short: h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`,
    formatted: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  };
};

export const calculateStats = (timers) => {
  const total = timers.length;
  const totalTime = timers.reduce((acc, t) => acc + (t.duration || 0), 0);
  const averageTime = total > 0 ? Math.round(totalTime / total) : 0;
  const mostUsed = timers.reduce((acc, t) => {
    acc[t.name] = (acc[t.name] || 0) + 1;
    return acc;
  }, {});
  const mostPopular = Object.keys(mostUsed).reduce((a, b) => 
    mostUsed[a] > mostUsed[b] ? a : b, ''
  );

  return { total, totalTime, averageTime, mostPopular };
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Copy failed:', error);
    return false;
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const getTimeRemaining = (targetDate) => {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const diff = target - now;
  
  if (diff <= 0) return null;
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
};