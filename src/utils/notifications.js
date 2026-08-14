// src/utils/notifications.js

const STORAGE_KEY = 'timecounter_notifications_enabled';

export const isNotificationSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window;

export const getNotificationEnabled = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
};

export const setNotificationEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    return 'denied';
  }
};

export const enableNotifications = async () => {
  const permission = await requestNotificationPermission();

  if (permission === 'granted') {
    setNotificationEnabled(true);
    return true;
  }

  setNotificationEnabled(false);
  return false;
};

export const disableNotifications = () => {
  setNotificationEnabled(false);
};

export const notifyTimerComplete = (title = 'Timer complete', body = 'Your TimeCounterPro timer is complete.') => {
  if (
    !isNotificationSupported() ||
    Notification.permission !== 'granted' ||
    !getNotificationEnabled()
  ) {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.svg',
      tag: 'timecounterpro-timer-complete',
      renotify: true,
    });

    window.setTimeout(() => notification.close(), 8000);
    return true;
  } catch (error) {
    console.warn('Unable to show notification:', error);
    return false;
  }
};
