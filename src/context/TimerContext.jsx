import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalTimers: 0,
    totalTime: 0,
    presetsUsed: 0,
    customsCreated: 0
  });
  const [shareData, setShareData] = useState(null);

  const isSavingRef = useRef(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('timerproData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setCompletedTimers(data.completed || []);
        setTotalStats(data.stats || { totalTimers: 0, totalTime: 0, presetsUsed: 0, customsCreated: 0 });
        
        const savedActive = data.activeTimers || [];
        if (savedActive.length > 0) {
          const restoredTimers = savedActive.map(t => {
            const elapsed = Math.floor((Date.now() - (t.startTime || Date.now())) / 1000);
            const remaining = Math.max(0, (t.duration || 0) - elapsed);
            return {
              ...t,
              remaining: remaining,
              status: remaining > 0 ? 'running' : 'completed',
              isPaused: t.isPaused || false,
              startTime: t.startTime || Date.now()
            };
          });
          setActiveTimers(restoredTimers);
        }
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    try {
      const dataToSave = {
        completed: completedTimers,
        stats: totalStats,
        activeTimers: activeTimers.map(t => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          type: t.type,
          status: t.status,
          startTime: t.startTime,
          createdAt: t.createdAt,
          isPaused: t.isPaused || false
        }))
      };
      localStorage.setItem('timerproData', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [completedTimers, totalStats, activeTimers]);

  const generateShareURL = useCallback((data) => {
    const base = window.location.origin;
    const query = new URLSearchParams(data).toString();
    return `${base}?${query}`;
  }, []);

  const addTimer = useCallback((name, duration, type) => {
    if (!duration || duration <= 0) {
      console.warn('Invalid duration:', duration);
      return;
    }

    const newTimer = {
      id: Date.now(),
      name: name || `${type} Timer`,
      duration,
      remaining: duration,
      type: type || 'custom',
      status: 'running',
      startTime: Date.now(),
      createdAt: new Date().toISOString(),
      isPaused: false
    };
    
    setActiveTimers(prev => [...prev, newTimer]);
    
    if (type === 'preset') {
      setTotalStats(prev => ({ ...prev, presetsUsed: (prev.presetsUsed || 0) + 1 }));
    } else {
      setTotalStats(prev => ({ ...prev, customsCreated: (prev.customsCreated || 0) + 1 }));
    }
  }, []);

  const updateTimer = useCallback((timerId, newRemaining, isComplete = false, isPaused = false) => {
    if (!timerId) return;

    setActiveTimers(prev => {
      let completedTimer = null;
      const updatedTimers = prev.map(t => {
        if (t.id === timerId) {
          if (isComplete || newRemaining <= 0) {
            completedTimer = {
              ...t,
              remaining: 0,
              completedAt: new Date().toISOString(),
              status: 'completed'
            };
            return null;
          }
          
          const safeRemaining = Math.max(0, newRemaining);
          return {
            ...t,
            remaining: safeRemaining,
            status: safeRemaining > 0 ? 'running' : 'completed',
            isPaused: isPaused || false,
            startTime: isPaused ? t.startTime : Date.now() - (t.duration - safeRemaining) * 1000
          };
        }
        return t;
      }).filter(t => t !== null);

      if (completedTimer) {
        setCompletedTimers(prevCompleted => [...prevCompleted, completedTimer]);
        setTotalStats(prevStats => ({
          ...prevStats,
          totalTimers: (prevStats.totalTimers || 0) + 1,
          totalTime: (prevStats.totalTime || 0) + completedTimer.duration
        }));
      }

      return updatedTimers;
    });
  }, []);

  const completeTimer = useCallback((timerId) => {
    if (!timerId) return;

    setActiveTimers(prev => {
      const timer = prev.find(t => t.id === timerId);
      if (timer) {
        setCompletedTimers(prevCompleted => [...prevCompleted, {
          ...timer,
          remaining: 0,
          completedAt: new Date().toISOString(),
          status: 'completed'
        }]);
        setTotalStats(prevStats => ({
          ...prevStats,
          totalTimers: (prevStats.totalTimers || 0) + 1,
          totalTime: (prevStats.totalTime || 0) + timer.duration
        }));
        return prev.filter(t => t.id !== timerId);
      }
      return prev;
    });
  }, []);

  const removeTimer = useCallback((timerId) => {
    if (!timerId) return;
    setActiveTimers(prev => prev.filter(t => t.id !== timerId));
  }, []);

  const clearHistory = useCallback(() => {
    setCompletedTimers([]);
    setTotalStats({
      totalTimers: 0,
      totalTime: 0,
      presetsUsed: 0,
      customsCreated: 0
    });
  }, []);

  const resetTimer = useCallback((timerId) => {
    if (!timerId) return;
    
    setActiveTimers(prev => 
      prev.map(t => {
        if (t.id === timerId) {
          return {
            ...t,
            remaining: t.duration,
            startTime: Date.now(),
            status: 'running',
            isPaused: false
          };
        }
        return t;
      })
    );
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const event = urlParams.get('event');
    const date = urlParams.get('date');
    const theme = urlParams.get('theme');
    const embed = urlParams.get('embed');

    if (event && date) {
      setShareData({ event, date, theme, embed });
    }
  }, []);

  return (
    <TimerContext.Provider value={{
      activeTimers,
      completedTimers,
      totalStats,
      shareData,
      setShareData,
      addTimer,
      completeTimer,
      removeTimer,
      clearHistory,
      updateTimer,
      resetTimer,
      generateShareURL
    }}>
      {children}
    </TimerContext.Provider>
  );
};