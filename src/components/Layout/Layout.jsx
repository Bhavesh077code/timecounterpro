
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
import { useLocation, useNavigate } from "react-router-dom"; // Back controls ke liye useNavigate best hai
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Footer from "./Footer";
import AdSlot from "../AdSlot";
import { AD_SLOTS } from "../../config/ads";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isHome = currentPath === "/";

  // Inhi 12 target routes par conditional ad processing hooks trigger honge
  const allowedAdRoutes = [
    "/",
    "/pomodoro",
    "/stopwatch",
    "/world-clock",
    "/time-card-calculator-online",
    "/hiit-timer",
    "/fasting-tracker-timer",
    "/mock-test-timer",
    "/presentation-timer",
    "/10-minute-timer",
    "/meditation-timer-with-sound",
    "/create"
  ];

  const showAds = allowedAdRoutes.includes(currentPath);

  // Home, Pomodoro, Stopwatch, World Clock, aur Time Card pages par Sidebar nahi chahiye
  const mainNavbarPages = [
    "/",
    "/pomodoro",
    "/stopwatch",
    "/world-clock",
    "/time-card-calculator-online"
  ];
  
  const isCoreNavbarPage = mainNavbarPages.includes(currentPath);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Universal Header Navigation Block */}
      <Navbar />
      
      {/* 2. Top Fluid Ad Frame */}
      {showAds && (
        <div className="w-full flex justify-center py-3 bg-white border-b border-slate-200">
          <AdSlot slot={AD_SLOTS?.topLeaderboard || "top-banner"} />
        </div>
      )}

      {/* 3. Pure Original Style Content Controller Layout */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        
        {/* Dynamic Back Navigation Anchor Node */}
        {!isHome && (
          <button 
            onClick={() => navigate(-1)} 
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <span>←</span> Back
          </button>
        )}

        {/* Operational Structural Segment Wrapper */}
        {isCoreNavbarPage ? (
          // Pehle 5 pages ke liye aapka structural original view layout (Bina grid layout ke full container wide area)
          <div className="w-full">
            {children}
          </div>
        ) : (
          // Baaki utility sidebar components ke liye processing dynamic block panel view
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <Sidebar />
              {showAds && (
                <div className="mt-6 p-2 bg-white border border-slate-200 rounded-lg shadow-sm sticky top-24 hidden lg:block">
                  <AdSlot slot={AD_SLOTS?.sidebarVertical || "sidebar-ad"} />
                </div>
              )}
            </aside>
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        )}
      </main>

      {/* 4. Global Structural Footer Area Link Wrapper */}
      <Footer />
    </div>
  );
}


