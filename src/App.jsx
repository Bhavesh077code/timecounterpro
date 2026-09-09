
// src/App.jsx
import React, { useEffect, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TimerProvider, TimerContext } from "./context/TimerContext";
import Home from "./pages/Home";
import About from "./pages/About";
import History from "./pages/History";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Term";
import Contact from "./pages/Contact";
import Layout from "./components/Layout/Layout";
import TimerSlugPage from "./pages/TimerSlugPage";
import SharedCountdown from "./components/Timer/SharedCountdown";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PomodoroTimer from "./components/Timer/PomodoroTimer";
import Stopwatch from "./components/Timer/Stopwatch";
import Timers from "./pages/Timers";
import { Navigate } from "react-router-dom";


function SharedCountdownWrapper() {
  const { shareData, setShareData } = useContext(TimerContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const event = params.get("event");
    const date = params.get("date");
    const theme = params.get("theme");

    if (event && date) {
      setShareData({
        event,
        date,
        theme: theme || "neon",
      });
    } else if (!event && !date) {
      setShareData(null);
    }
  }, [location.search, setShareData]);

  if (shareData?.event && shareData?.date) {
    return (
      <Layout showAds={false}>
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedCountdownWrapper />,
  },
  {
    path: "/timers",
    element: (
      <Layout>
        <Timers />
      </Layout>
    ),
  },
  {
    path: "/countdown",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/pomodoro",
    element: (
      <Layout>
        <PomodoroTimer />
      </Layout>
    ),
  },
  {
    path: "/about",
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: "/blog",
    element: (
      <Layout>
        <Blog />
      </Layout>
    ),
  },
  {
    path: "/blog/:slug",
    element: (
      <Layout>
        <BlogPost />
      </Layout>
    ),
  },
  {
    path: "/history",
    element: (
      <Layout>
        <History />
      </Layout>
    ),
  },
   {
    path: "/stopwatch",
    element: (
      <Layout>
        <Stopwatch />
      </Layout>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Layout>
        <PrivacyPolicy />
      </Layout>
    ),
  },
  {
    path: "/terms",
    element: (
      <Layout>
        <Terms />
      </Layout>
    ),
  },
  {
    path: "/contact",
    element: (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
  {
    path: "/timer/:slug",
    element: <TimerSlugPage />,
  },
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
