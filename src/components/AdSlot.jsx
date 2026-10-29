
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ADSENSE_CLIENT } from "../config/ads";

export default function AdSlot({ slot }) {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !slot || !import.meta.env.PROD) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      // AdSense may not be ready, or an ad blocker may interfere.
      console.warn("AdSense could not initialize this ad slot.", error);
    }
  }, [mounted, slot, pathname]);

  if (!mounted || !slot || !import.meta.env.PROD) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className="my-8 min-h-0"
    >
      <p className="mb-1 text-center text-xs text-slate-500">
        Advertisement
      </p>

      <ins
        key={`${pathname}-${slot}`}
        className="adsbygoogle"
        style={{ display: "block", minHeight: "100px" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

