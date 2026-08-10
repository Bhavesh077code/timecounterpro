import { useState, useEffect, useCallback } from 'react';

export const useURLSync = () => {
  const [params, setParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const event = urlParams.get('event');
    const date = urlParams.get('date');
    const theme = urlParams.get('theme');
    const embed = urlParams.get('embed');

    setParams({ event, date, theme, embed });
  }, []);

  const generateShareURL = useCallback((data) => {
    const base = window.location.origin;
    const query = new URLSearchParams(data).toString();
    return `${base}?${query}`;
  }, []);

  const updateURL = useCallback((data) => {
    const url = generateShareURL(data);
    window.history.pushState({}, '', url);
    setParams(data);
  }, [generateShareURL]);

  return { params, generateShareURL, updateURL };
};