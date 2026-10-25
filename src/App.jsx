
// src/App.jsx
//
// 14 public pages: 10 traffic pages + About, Contact, Privacy, Terms,
// plus /history (noindex utility) and a noindex 404.
//
// `routes` is exported so the build-time prerender (src/entry-server.jsx) can
// render exactly the same pages the browser does.

import React, { useEffect, useContext, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TimerProvider, TimerContext } from "./context/TimerContext";

import Layout from "./components/Layout/Layout";
import Footer from "./components/Layout/Footer";
import Seo from "./components/Seo";
import SeoArticle from "./components/SeoArticle";
import AdsLoader from "./components/AdsLoader";
import AdSlot from "./components/AdSlot";
import { AD_SLOTS } from "./config/ads";
import { getRoute } from "./data/siteRoutes";

import Home from "./pages/Home";
import PomodoroPage from "./pages/PomodoroPage";
import StopwatchPage from "./pages/StopwatchPage";
import WorldClock from "./pages/WorldClock";
import About from "./pages/About";
import Contact from "./pages/Contact";
import History from "./pages/History";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Term";
import NotFound from "./pages/NotFound";
import SharedCountdown from "./components/Timer/SharedCountdown";
import HiitTabataTimer from "./Tools/HiitTabataTimer";
import MockTestTimer from "./Tools/MockTestTimer";
import FastingTrackerClock from "./Tools/FastingTrackerClock";
import PresentationAlertTimer from "./Tools/PresentationAlertTimer";
import MeditationTimer from "./Tools/MeditationTimer";
import TimeCardCalculator from "./Tools/TimeCardCalculator";

import Animation from "./Tools/Animation";
import CreateTimer from "./pages/CreateTimer";
import SpeedrunSplitTimer from "./Tools/SpeedrunSplitTimer";


/**
 * Wraps a page with its <head> data (from siteRoutes.js), the ad loader (only
 * for ad-enabled routes) and the written article under the tool.
 *
 *  layout="site"  -> uses the shared Navbar/Footer layout (Home, Pomodoro...)
 *  layout="tool"  -> the tool renders its own Navbar; we add the article + Footer
 */
function Page({ path, layout = "site", article = true, noindex = false, children }) {
  const route = getRoute(path);
  const adsOn = !!route?.ads;

  const body = (
    <>
      <Seo path={path} noindex={noindex} />
      <AdsLoader enabled={adsOn} />
      {children}
      {article && <SeoArticle path={path} />}
    </>
  );

  if (layout === "tool") {
    return (
      <>
        {body}
        {adsOn && !article && <AdSlot slot={AD_SLOTS.bottom} />}
        <Footer />
      </>
    );
  }
  return <Layout>{body}</Layout>;
}

function SharedCountdownWrapper() {
  const { shareData, setShareData } = useContext(TimerContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const event = params.get("event");
    const date = params.get("date");
    const theme = params.get("theme");

    if (event && date) {
      setShareData({ event, date, theme: theme || "neon" });
    } else if (!event && !date) {
      setShareData(null);
    }
  }, [location.search, setShareData]);

  // Shared links (?event=...&date=...) are user-generated: canonical -> "/", noindex, no ads.
  if (shareData?.event && shareData?.date) {
    return (
      <Layout>
        <Seo path="/" noindex />
        <SharedCountdown />
      </Layout>
    );
  }

  return (
    <Page path="/">
      <Home />
    </Page>
  );
}

export const routes = [
  { path: "/", element: <SharedCountdownWrapper /> },
  { path: "/pomodoro", element: <Page path="/pomodoro"><PomodoroPage /></Page> },
  { path: "/stopwatch", element: <Page path="/stopwatch"><StopwatchPage /></Page> },
  { path: "/world-clock", element: <Page path="/world-clock"><WorldClock /></Page> },
  { path: "/create", element: <Page path="/create" layout="tool"><CreateTimer /></Page> },

  { path: "/hiit-timer", element: <Page path="/hiit-timer" layout="tool"><HiitTabataTimer /></Page> },
  { path: "/mock-test-timer", element: <Page path="/mock-test-timer" layout="tool"><MockTestTimer /></Page> },
  { path: "/fasting-tracker-timer", element: <Page path="/fasting-tracker-timer" layout="tool"><FastingTrackerClock /></Page> },
  { path: "/presentation-timer", element: <Page path="/presentation-timer" layout="tool"><PresentationAlertTimer /></Page> },
  { path: "/meditation-timer-with-sound", element: <Page path="/meditation-timer-with-sound" layout="tool"><MeditationTimer /></Page> },
  { path: "/time-card-calculator-online", element: <Page path="/time-card-calculator-online" layout="tool"><TimeCardCalculator /></Page> },
  {path: "/10-minute-timer", element: <Page path="/10-minute-timer" layout="tool"><Animation /></Page>,},
  { path: "/online-rubiks-cube-stopwatch-with-milliseconds", element: <Page path="/online-rubiks-cube-stopwatch-with-milliseconds" layout="tool"><SpeedrunSplitTimer /></Page>,},


  { path: "/about", element: <Page path="/about" article={false}><About /></Page> },
  { path: "/contact", element: <Page path="/contact" article={false}><Contact /></Page> },
  { path: "/privacy", element: <Page path="/privacy" article={false}><PrivacyPolicy /></Page> },
  { path: "/terms", element: <Page path="/terms" article={false}><Terms /></Page> },
  { path: "/history", element: <Page path="/history" article={false}><History /></Page> },

  {
    path: "*",
    element: (
      <Layout>
        <Seo />
        <NotFound />
      </Layout>
    ),
  },
];

function App() {
  const router = useMemo(() => createBrowserRouter(routes), []);

  // The static HTML from the prerender carries its own <head> tags. Once React
  // has mounted and added its live copies, drop the static ones so there are no
  // duplicates and later navigation updates the right title/canonical.
  useEffect(() => {
    document
      .querySelectorAll("head [data-prerender]")
      .forEach((el) => el.remove());
  }, []);

  return (
    <HelmetProvider>
      <TimerProvider>
        <RouterProvider router={router} />
      </TimerProvider>
    </HelmetProvider>
  );
}

export default App;
