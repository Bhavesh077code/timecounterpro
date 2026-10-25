// src/pages/NotFound.jsx
// Shown for any unknown URL. SEO (noindex) is set in App.jsx; the prerender step
// also writes this page to dist/404.html so the server returns a real 404 status.
import React from "react";
import { Link } from "react-router-dom";
import { trafficRoutes } from "../data/siteRoutes";

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center">
      <p className="text-sm font-semibold tracking-[.18em] uppercase text-indigo-600">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">
        We could not find that page
      </h1>
      <p className="mt-4 text-slate-600 leading-7">
        The link may be out of date or the page may have been removed. Try one
        of our timers instead:
      </p>
      <ul className="mt-6 grid gap-2 text-left sm:grid-cols-2">
        {trafficRoutes.map((r) => (
          <li key={r.path}>
            <Link
              to={r.path}
              className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-indigo-300 hover:text-indigo-700"
            >
              {r.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotFound;
