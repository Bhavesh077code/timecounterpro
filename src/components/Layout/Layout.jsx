
/*
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <Navbar />
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {!isHome && <button onClick={() => window.history.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition"><span>←</span> Back</button>}
      {children}
    </main>
    <Footer />
  </div>;
}
export default Layout;

*/


import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "./Footer";
import AdSlot from "../AdSlot";
import { AD_SLOTS } from "../../config/ads";

const ALLOWED_AD_ROUTES = [
  "/",
  "/pomodoro",
  "/stopwatch",
  "/world-clock",
  "/time-card-calculator",
  "/hiit-timer",
  "/fasting-tracker-timer",
  "/mock-test-timer",
  "/presentation-timer",
  "/10-minute-timer",
  "/meditation-timer-with-sound",
  "/create",
  "/rubiks-cube-timer",
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.replace(/\/+$/, "") || "/";
  const isHome = currentPath === "/";

  const showAds = ALLOWED_AD_ROUTES.includes(currentPath);

  // Only render an ad when a real AdSense slot ID is configured.
  const topAdSlot = AD_SLOTS?.topLeaderboard;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Top ad: selected pages only, and only with a real slot ID */}
      {showAds && topAdSlot && (
        <div className="w-full flex justify-center bg-white">
          <div className="w-full max-w-7xl px-4 py-3">
            <AdSlot slot={topAdSlot} />
          </div>
        </div>
      )}

      {/* Keep page content centered; do not force a sidebar layout */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {!isHome && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <span>←</span>
            Back
          </button>
        )}

        <div className="w-full min-w-0">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
