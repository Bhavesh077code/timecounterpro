// src/App.jsx/ 
import React, { useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { TimerProvider, TimerContext } from "./context/TimerContext";
import Home from "./pages/Home";
import About from "./pages/About";
import History from "./pages/History";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Term";
import Contact from "./pages/Contact";
import Layout from "./components/Layout/Layout";
import SharedCountdown from "./components/Timer/SharedCountdown";

// ✅ Shared Countdown Wrapper
function SharedCountdownWrapper() {
  const { shareData, setShareData } = useContext(TimerContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const event = params.get('event');
    const date = params.get('date');
    const theme = params.get('theme');

    if (event && date) {
      setShareData({ event, date, theme: theme || 'neon' });
    } else {
      setShareData(null);
    }
  }, [location.search, setShareData]);

  // ✅ If share data exists → SharedCountdown with Layout
  if (shareData?.event && shareData?.date) {
    return (
      <Layout showAds={false}>
        <SharedCountdown />
      </Layout>
    );
  }

  // ✅ Otherwise → Home with Layout
  return (
    <Layout>
      <Home />
    </Layout>
  );
}

// ✅ Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedCountdownWrapper />,
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>,
  },
  {
    path: "/history",
    element: <Layout><History /></Layout>,
  },
  {
    path: "/contact",
    element: <Layout><Contact /></Layout>,
  },
  {
    path: "/privacy",
    element: <Layout><PrivacyPolicy /></Layout>,
  },
  {
    path: "/terms",
    element: <Layout><Terms /></Layout>,
  },
]);

function App() {
  return (
    <TimerProvider>
      <RouterProvider router={router} />
    </TimerProvider>
  );
}

export default App;

