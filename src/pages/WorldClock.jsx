import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const CITIES = [
  { city: "Kathmandu", country: "Nepal", timeZone: "Asia/Kathmandu" },
  { city: "New Delhi", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Dubai", country: "UAE", timeZone: "Asia/Dubai" },
  { city: "London", country: "UK", timeZone: "Europe/London" },
  { city: "New York", country: "USA", timeZone: "America/New_York" },
  { city: "Los Angeles", country: "USA", timeZone: "America/Los_Angeles" },
  { city: "Toronto", country: "Canada", timeZone: "America/Toronto" },
  { city: "São Paulo", country: "Brazil", timeZone: "America/Sao_Paulo" },
  { city: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo" },
  { city: "Singapore", country: "Singapore", timeZone: "Asia/Singapore" },
  { city: "Sydney", country: "Australia", timeZone: "Australia/Sydney" },
  { city: "Auckland", country: "New Zealand", timeZone: "Pacific/Auckland" },
];

const DEFAULT_CITIES = [
  "Asia/Kathmandu",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
  "Asia/Tokyo",
];

function getOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  const utcTime = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return Math.round((utcTime - date.getTime()) / 60000);
}

function formatDifference(minutes) {
  if (minutes === 0) return "Same time";

  const sign = minutes > 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const mins = absolute % 60;

  if (mins === 0) {
    return `${sign}${hours}h`;
  }

  return `${sign}${hours}h ${mins}m`;
}

function getLocalHour(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hourPart = parts.find((part) => part.type === "hour");
  return hourPart ? Number(hourPart.value) : 0;
}

function getWeekday(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(date);
}

function getWorkingStatus(date, timeZone) {
  const hour = getLocalHour(date, timeZone);
  const weekday = getWeekday(date, timeZone);

  if (weekday === "Sat" || weekday === "Sun") {
    return "Weekend";
  }

  if (hour >= 9 && hour < 17) {
    return "Working hours";
  }

  return "Outside working hours";
}

function formatOffset(date, timeZone) {
  const minutes = getOffsetMinutes(date, timeZone);

  if (minutes === 0) return "UTC+0";

  const sign = minutes > 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const mins = absolute % 60;

  return mins === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(mins).padStart(2, "0")}`;
}

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");
  const [is24Hour, setIs24Hour] = useState(false);

  const [selectedZones, setSelectedZones] = useState(() => {
    try {
      const saved = localStorage.getItem("tcp-world-clock-cities");
      return saved ? JSON.parse(saved) : DEFAULT_CITIES;
    } catch {
      return DEFAULT_CITIES;
    }
  });

  const [homeZone, setHomeZone] = useState(() => {
    try {
      return localStorage.getItem("tcp-world-clock-home") || "Asia/Kathmandu";
    } catch {
      return "Asia/Kathmandu";
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tcp-world-clock-cities",
      JSON.stringify(selectedZones)
    );
  }, [selectedZones]);

  useEffect(() => {
    localStorage.setItem("tcp-world-clock-home", homeZone);
  }, [homeZone]);

  const filteredCities = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return CITIES;

    return CITIES.filter(
      (item) =>
        item.city.toLowerCase().includes(value) ||
        item.country.toLowerCase().includes(value)
    );
  }, [search]);

  const homeCity =
    CITIES.find((city) => city.timeZone === homeZone) || CITIES[0];

  const homeOffset = getOffsetMinutes(now, homeCity.timeZone);

  const addCity = (timeZone) => {
    if (!selectedZones.includes(timeZone)) {
      setSelectedZones((prev) => [...prev, timeZone]);
    }
  };

  const removeCity = (timeZone) => {
    if (timeZone === homeZone && selectedZones.length > 1) {
      const nextCity = selectedZones.find((zone) => zone !== timeZone);
      if (nextCity) setHomeZone(nextCity);
    }

    setSelectedZones((prev) => prev.filter((zone) => zone !== timeZone));
  };

  const resetCities = () => {
    setSelectedZones(DEFAULT_CITIES);
    setHomeZone("Asia/Kathmandu");
  };

  const copyTime = async (city) => {
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: city.timeZone,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour,
    }).format(now);

    try {
      await navigator.clipboard.writeText(
        `${city.city}: ${time} (${formatOffset(now, city.timeZone)})`
      );
      alert("Time copied!");
    } catch {
      alert("Unable to copy time.");
    }
  };

  return (
    <>
      <Helmet>
        <title>World Clock - Current Time Around the World | TimeCounterPro</title>

        <meta
          name="description"
          content="Check the current local time in cities around the world. Compare time zones, see time differences, working hours and UTC offsets with TimeCounterPro World Clock."
        />

        <link
          rel="canonical"
          href="https://timecounterpro.com/world-clock"
        />

        <meta
          property="og:title"
          content="World Clock - Current Time Around the World"
        />

        <meta
          property="og:description"
          content="Compare current times and time zones around the world with TimeCounterPro World Clock."
        />

        <meta
          property="og:url"
          content="https://timecounterpro.com/world-clock"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "TimeCounterPro World Clock",
            url: "https://timecounterpro.com/world-clock",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            description:
              "A world clock for checking current time, UTC offsets and time differences between cities.",
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
        <div className="mx-auto max-w-6xl">

         {/* Header */}
        <header className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">
            Time & timezone tool
          </p>

          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
            World Clock
          </h1>

          <p className="mt-4 text-slate-600 leading-7">
            Check the current local time in cities around the world.
            Compare multiple time zones at a glance for meetings,
            travel, remote work and everyday planning.
          </p>
        </header>


          {/* CONTROLS */}
          <section className="bg-white dark:bg-gray-900  shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Search city
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search London, Tokyo, Dubai..."
                  className="w-full  border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Home / reference city
                </label>

                <select
                  value={homeZone}
                  onChange={(e) => {
                    setHomeZone(e.target.value);
                    addCity(e.target.value);
                  }}
                  className="w-full md:w-64  border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3"
                >
                  {CITIES.map((city) => (
                    <option key={city.timeZone} value={city.timeZone}>
                      {city.city}, {city.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIs24Hour((prev) => !prev)}
                  className=" bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 font-medium"
                >
                  {is24Hour ? "24 Hour" : "12 Hour"}
                </button>

                <button
                  onClick={resetCities}
                  className=" border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium"
                >
                  Reset
                </button>
              </div>

            </div>
          </section>

          {/* CLOCK CARDS */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedZones.map((zone) => {
              const city = CITIES.find((item) => item.timeZone === zone);

              if (!city) return null;

              const offset = getOffsetMinutes(now, city.timeZone);
              const difference = offset - homeOffset;

              const time = new Intl.DateTimeFormat("en-US", {
                timeZone: city.timeZone,
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: !is24Hour,
              }).format(now);

              const date = new Intl.DateTimeFormat("en-US", {
                timeZone: city.timeZone,
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(now);

              const status = getWorkingStatus(now, city.timeZone);

              return (
                <article
                  key={city.timeZone}
                  className="bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-800 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {city.city}
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {city.country}
                      </p>
                    </div>

                    {city.timeZone === homeZone && (
                      <span className="text-xs font-semibold  px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Home
                      </span>
                    )}

                  </div>

                  <div className="mt-5">
                    <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {time}
                    </div>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {date}
                    </p>
                  </div>

                  {/* TIME DIFFERENCE */}
                  <div className="mt-5  bg-gray-50 dark:bg-gray-800 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Time difference from {homeCity.city}
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {city.timeZone === homeZone
                        ? "Reference time"
                        : formatDifference(difference)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                      {formatOffset(now, city.timeZone)}
                    </span>

                    <span className=" bg-gray-100 dark:bg-gray-800 px-3 py-1">
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => copyTime(city)}
                      className="flex-1  border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-medium"
                    >
                      Copy time
                    </button>

                    <button
                      onClick={() => removeCity(city.timeZone)}
                      className=" border border-red-200 dark:border-red-900 text-red-600 px-3 py-2 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {/* ADD CITIES */}
          <section className="mt-8 bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add a city
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add another city to your world clock.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {filteredCities.map((city) => {
                const exists = selectedZones.includes(city.timeZone);

                return (
                  <button
                    key={city.timeZone}
                    disabled={exists}
                    onClick={() => addCity(city.timeZone)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                      exists
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {exists ? "✓ " : "+ "}
                    {city.city}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SEO CONTENT */}
          <section className="mt-10 bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-800 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              World Clock and Time Zone Comparison
            </h2>

            <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-400 leading-7">
              <p>
                TimeCounterPro World Clock helps you check the current local
                time in different cities around the world. You can add cities,
                choose a home city and compare the time difference between
                locations.
              </p>

              <p>
                This tool is useful when planning international meetings,
                contacting friends or family abroad, working with remote teams,
                travelling between countries, or scheduling online events.
              </p>

              <p>
                Select your home or reference city to see how many hours ahead
                or behind another location is. The clock also shows the UTC
                offset and whether the location is currently within typical
                weekday working hours.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
              How to use the World Clock
            </h3>

            <ol className="mt-4 list-decimal pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Search for a city or country.</li>
              <li>Add the cities you want to compare.</li>
              <li>Select your home or reference city.</li>
              <li>Check the current local time and UTC offset.</li>
              <li>Compare the time difference between cities.</li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mt-8 bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-800 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>

            <div className="mt-5 space-y-5">

              <details className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  What is a world clock?
                </summary>

                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-7">
                  A world clock displays the current local time in different
                  cities and time zones around the world.
                </p>
              </details>

              <details className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  How do I compare two time zones?
                </summary>

                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-7">
                  Add both cities to the World Clock and select one city as
                  your home or reference city. The tool will show the time
                  difference for the other city.
                </p>
              </details>

              <details className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  What does UTC offset mean?
                </summary>

                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-7">
                  A UTC offset indicates how far a local time zone is ahead of
                  or behind Coordinated Universal Time (UTC).
                </p>
              </details>

              <details>
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  Can I use this world clock for international meetings?
                </summary>

                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-7">
                  Yes. You can add the cities where meeting participants are
                  located and compare their local times before choosing a
                  suitable meeting time.
                </p>
              </details>

            </div>
          </section>

          {/* RELATED TOOLS */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Related Time Tools
            </h2>

            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <a
                href="/timers"
                className=" bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Countdown Timers
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Create countdown timers for study, work and daily tasks.
                </p>
              </a>

              <a
                href="/pomodoro"
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Pomodoro Timer
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Work in focused sessions with regular breaks.
                </p>
              </a>

              <a
                href="/stopwatch"
                className=" bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Online Stopwatch
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Measure elapsed time with a simple online stopwatch.
                </p>
              </a>

              <a
                href="/timer/meeting-timer"
                className=" bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Meeting Timer
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Keep meetings and discussions on schedule.
                </p>
              </a>

            </div>
          </section>

        </div>
      </main>
    </>
  );
}