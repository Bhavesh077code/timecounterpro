// src/components/AdSlot.jsx
//
// One responsive AdSense display unit. Renders nothing until a slot ID is set
// in src/config/ads.js, so it is safe to leave in place. Only used inside
// <SeoArticle /> (between written content), never next to timer controls.
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ADSENSE_CLIENT } from "../config/ads";

export default function AdSlot({ slot }) {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !slot || !import.meta.env.PROD) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or script not ready: ignore */
    }
  }, [mounted, slot, pathname]);

  if (!mounted || !slot || !import.meta.env.PROD) return null;

  return (
    <aside aria-label="Advertisement" className="my-8">
      <p className="mb-1 text-center text-[10px] uppercase tracking-wide text-slate-400">
        Advertisement
      </p>
      <ins
        key={pathname}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
