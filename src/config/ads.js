
// src/config/ads.js
//
// AdSense configuration.
//
// HOW ADS ARE CONTROLLED
// ----------------------
// 1. The AdSense loader script is NOT in index.html any more. It is added only
//    on the 10 traffic pages (routes with `ads: true` in src/data/siteRoutes.js):
//      - statically, by src/scripts/prerender.mjs (so crawlers see it)
//      - dynamically, by <AdsLoader /> during in-app navigation
//    About, Contact, Privacy, Terms, History and 404 never load it.
//
// 2. To show ads, create 2 "Display ad" units in AdSense
//    (Ads > By ad unit > Display ads) and paste their numeric slot IDs below.
//    While a slot ID is empty, <AdSlot /> renders nothing, so nothing breaks.
//
// 3. In AdSense > Sites > timecounterpro.com > Auto ads, switch Auto ads OFF
//    (manual units below are more policy-safe because they never sit inside the
//    timer UI). If you prefer Auto ads, leave it ON - it will still only run on
//    the 10 pages above.

export const ADSENSE_CLIENT = "ca-pub-8793114997971427";

export const AD_SLOTS = {
  // Placed after the 2nd section of the article (between content blocks)
  inArticle: "",
  // Placed after the FAQ, just above the footer
  bottom: "",
};
