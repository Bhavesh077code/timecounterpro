
/*
// src/components/Seo.jsx
//
// One place for per-page meta tags.
//
// Previously index.html carried a hard-coded canonical pointing at the
// homepage, which meant every route told Google "my real address is /".
// That canonical has been removed from index.html; each page now sets its
// own through this component.

import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://timecounterpro.com";

function Seo({
  title,
  description,
  path = "/",
  noindex = false,
  image = `${SITE_URL}/icons/icon-512.png`,
  schema = null,
}) {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TimeCounterPro" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

export default Seo;


*/

/*
// src/components/Seo.jsx
//
// Every page's <head> data comes from here, driven by src/data/siteRoutes.js.
// It outputs: title, description, canonical, robots, Open Graph, Twitter card
// and JSON-LD (WebApplication + BreadcrumbList + FAQPage).
//
// The same output is captured at build time by src/scripts/prerender.mjs and
// written into the static HTML, so Googlebot sees it without running JavaScript.

import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE_URL, getRoute } from "../data/siteRoutes";
import { seoContent } from "../data/seoContent";

const DEFAULT_IMAGE = `${SITE_URL}/icons/icon-512.png`;

function buildSchema(route, canonical) {
  const graph = [];

  if (route.path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "TimeCounterPro",
      inLanguage: "en",
    });
  }

  if (route.appCategory) {
    graph.push({
      "@type": "WebApplication",
      name: route.name,
      url: canonical,
      description: route.description,
      applicationCategory: route.appCategory,
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      inLanguage: "en",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  }

  if (route.path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: route.name, item: canonical },
      ],
    });
  }

  const faq = seoContent[route.path]?.faq;
  if (faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function Seo({ path, noindex = false, title, description }) {
  const route = getRoute(path);

  // Unknown route (404) -> noindex page with no canonical.
  if (!route) {
    return (
      <Helmet>
        <title>{title || "Page not found - TimeCounterPro"}</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
    );
  }

  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const pageTitle = title || route.title;
  const pageDesc = description || route.description;
  const hidden = noindex || route.noindex;
  const schema = hidden ? null : buildSchema(route, canonical);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={hidden ? "noindex,follow" : "index,follow,max-image-preview:large"}
      />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TimeCounterPro" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

export default Seo;
*/


/*
// src/components/Seo.jsx
//
// One place for per-page meta tags.
//
// Previously index.html carried a hard-coded canonical pointing at the
// homepage, which meant every route told Google "my real address is /".
// That canonical has been removed from index.html; each page now sets its
// own through this component.

import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://timecounterpro.com";

function Seo({
  title,
  description,
  path = "/",
  noindex = false,
  image = `${SITE_URL}/icons/icon-512.png`,
  schema = null,
}) {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TimeCounterPro" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

export default Seo;


*/


// src/components/Seo.jsx
//
// Every page's <head> data comes from here, driven by src/data/siteRoutes.js.
// It outputs: title, description, canonical, robots, Open Graph, Twitter card
// and JSON-LD (WebApplication + BreadcrumbList).
//
// The same output is captured at build time by src/scripts/prerender.mjs and
// written into the static HTML, so Googlebot sees it without running JavaScript.

import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE_URL, getRoute } from "../data/siteRoutes";

const DEFAULT_IMAGE = `${SITE_URL}/icons/icon-512.png`;

function buildSchema(route, canonical) {
  const graph = [];

  if (route.path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "TimeCounterPro",
      inLanguage: "en",
    });
  }

  if (route.appCategory) {
    graph.push({
      "@type": "WebApplication",
      name: route.name,
      url: canonical,
      description: route.description,
      applicationCategory: route.appCategory,
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      inLanguage: "en",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  }

  if (route.path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: route.name, item: canonical },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function Seo({ path, noindex = false, title, description }) {
  const route = getRoute(path);

  // Unknown route (404) -> noindex page with no canonical.
  if (!route) {
    return (
      <Helmet>
        <title>{title || "Page not found - TimeCounterPro"}</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
    );
  }

  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const pageTitle = title || route.title;
  const pageDesc = description || route.description;
  const hidden = noindex || route.noindex;
  const schema = hidden ? null : buildSchema(route, canonical);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={hidden ? "noindex,follow" : "index,follow,max-image-preview:large"}
      />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TimeCounterPro" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

export default Seo;
