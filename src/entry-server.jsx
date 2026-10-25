// src/entry-server.jsx
//
// Build-time server renderer. Used ONLY by src/scripts/prerender.mjs:
//   vite build --ssr src/entry-server.jsx --outDir dist-ssr
// It renders the real React app for a URL to an HTML string, plus the <head>
// tags collected from <Seo>. Nothing here ships to the browser.

import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { TimerProvider } from "./context/TimerContext";
import { routes } from "./App";

const handler = createStaticHandler(routes);

export async function render(url) {
  const request = new Request(`http://localhost${url}`);
  const context = await handler.query(request);
  if (context instanceof Response) {
    throw new Error(`Unexpected redirect while rendering ${url}`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <TimerProvider>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </TimerProvider>
    </HelmetProvider>,
  );

  // React 19 renders <title>/<meta>/<link> inline in the markup. Pull them out
  // so prerender.mjs can place them in <head>, where crawlers expect them.
  const headParts = [];
  const take = (re) => {
    body = body.replace(re, (m) => {
      // data-prerender marks tags that App removes once React has mounted and
      // added its own copies (otherwise the browser would hold duplicates).
      headParts.push(m.replace(/^<(\w+)/, "<$1 data-prerender"));
      return "";
    });
  };
  let body = html;
  take(/<title>[\s\S]*?<\/title>/g);
  take(/<meta\b[^>]*>/g);
  take(/<link rel="canonical"[^>]*>/g);
  take(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
  void helmetContext;

  return { html: body, head: headParts.join("\n    "), status: context.statusCode };
}
