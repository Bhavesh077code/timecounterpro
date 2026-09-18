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
