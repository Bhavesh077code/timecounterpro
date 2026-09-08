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
