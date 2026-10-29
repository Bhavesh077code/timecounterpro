
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ADSENSE_CLIENT } from "../config/ads";

export default function AdsLoader({ enabled = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Do not load AdSense on disabled routes or in development.
    if (!enabled || !import.meta.env.PROD) return;

    // Avoid adding the same AdSense script more than once.
    const existingScript = document.querySelector(
      'script[src*="pagead/js/adsbygoogle.js"]'
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.async = true;
    script.src =
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }, [enabled, pathname]);

  return null;
}
