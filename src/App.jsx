// src/App.jsx
//
// Changes from the previous version:
//  - /blog and /blog/:slug removed (Blog.jsx, BlogPost.jsx, BlogData.js deleted)
//  - /pomodoro and /stopwatch now render dedicated page components that carry
//    their own title, description and canonical
//  - added a "*" catch-all so unknown URLs return a noindexed 404 page instead
//    of silently rendering something indexable

import React, { useEffect, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TimerProvider, TimerContext } from "./context/TimerContext";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Timers from "./pages/Timers";
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

  if (shareData?.event && shareData?.date) {
    return (
      <Layout>
        <SharedCountdown />
      </Layout>
    );
  }

  return (
    <Layout>
      <Home />
    </Layout>
  );
}

const withLayout = (element) => <Layout>{element}</Layout>;

const router = createBrowserRouter([
  { path: "/", element: <SharedCountdownWrapper /> },
  { path: "/timers", element: withLayout(<Timers />) },
  { path: "/countdown", element: <Navigate to="/" replace /> },
  { path: "/pomodoro", element: withLayout(<PomodoroPage />) },
  { path: "/stopwatch", element: withLayout(<StopwatchPage />) },
  { path: "/world-clock", element: withLayout(<WorldClock />) },
  { path: "/history", element: withLayout(<History />) },
  { path: "/about", element: withLayout(<About />) },
  { path: "/contact", element: withLayout(<Contact />) },
  { path: "/privacy", element: withLayout(<PrivacyPolicy />) },
  { path: "/terms", element: withLayout(<Terms />) },
  

  // Old blog URLs -> timer library, so existing links do not dead-end.
  { path: "/blog", element: <Navigate to="/timers" replace /> },
  { path: "/blog/:slug", element: <Navigate to="/timers" replace /> },

  { path: "*", element: withLayout(<NotFound />) },
]);

function App() {
  return (
    <HelmetProvider>
      <TimerProvider>
        <RouterProvider router={router} />
      </TimerProvider>
    </HelmetProvider>
  );
}

export default App;
