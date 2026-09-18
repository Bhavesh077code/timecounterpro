// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const suggestions = [
  ["/timers", "Browse all timers"],
  ["/pomodoro", "Pomodoro timer"],
  ["/stopwatch", "Stopwatch"],
  ["/world-clock", "World clock"],
];

function NotFound() {
  return (
    <>
      <Seo
        title="Page not found | TimeCounterPro"
        description="This page does not exist. Browse the timer library, the Pomodoro timer or the stopwatch instead."
        path="/404"
        noindex
      />
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-sm font-semibold tracking-[.18em] uppercase text-indigo-600">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          We could not find that page
        </h1>
        <p className="mt-4 text-slate-600 leading-7">
          The link may be out of date. In early 2026 we removed several hundred
          auto-generated timer URLs and replaced them with 24 hand-written timer
          pages, so some old bookmarks no longer resolve.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {suggestions.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="px-5 py-2.5 border border-slate-300 text-sm font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-700 transition"
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          to="/"
          className="inline-block mt-8 text-sm font-medium text-indigo-600 hover:underline"
        >
          Or create a custom timer on the home page →
        </Link>
      </div>
    </>
  );
}

export default NotFound;
