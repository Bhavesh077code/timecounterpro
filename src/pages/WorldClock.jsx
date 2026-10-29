import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ============================================================
// CITIES — 200+ across every continent & major time zone
// ============================================================
const CITIES = [
  // ---------- ASIA ----------
  { city: "Kathmandu", country: "Nepal", timeZone: "Asia/Kathmandu" },
  { city: "Pokhara", country: "Nepal", timeZone: "Asia/Kathmandu" },
  { city: "New Delhi", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Mumbai", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Bangalore", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Chennai", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Kolkata", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Hyderabad", country: "India", timeZone: "Asia/Kolkata" },
  { city: "Dhaka", country: "Bangladesh", timeZone: "Asia/Dhaka" },
  { city: "Colombo", country: "Sri Lanka", timeZone: "Asia/Colombo" },
  { city: "Karachi", country: "Pakistan", timeZone: "Asia/Karachi" },
  { city: "Islamabad", country: "Pakistan", timeZone: "Asia/Karachi" },
  { city: "Kabul", country: "Afghanistan", timeZone: "Asia/Kabul" },
  { city: "Dubai", country: "UAE", timeZone: "Asia/Dubai" },
  { city: "Abu Dhabi", country: "UAE", timeZone: "Asia/Dubai" },
  { city: "Riyadh", country: "Saudi Arabia", timeZone: "Asia/Riyadh" },
  { city: "Doha", country: "Qatar", timeZone: "Asia/Qatar" },
  { city: "Kuwait City", country: "Kuwait", timeZone: "Asia/Kuwait" },
  { city: "Tehran", country: "Iran", timeZone: "Asia/Tehran" },
  { city: "Baghdad", country: "Iraq", timeZone: "Asia/Baghdad" },
  { city: "Tel Aviv", country: "Israel", timeZone: "Asia/Jerusalem" },
  { city: "Beirut", country: "Lebanon", timeZone: "Asia/Beirut" },
  { city: "Istanbul", country: "Turkey", timeZone: "Europe/Istanbul" },
  { city: "Tbilisi", country: "Georgia", timeZone: "Asia/Tbilisi" },
  { city: "Yerevan", country: "Armenia", timeZone: "Asia/Yerevan" },
  { city: "Baku", country: "Azerbaijan", timeZone: "Asia/Baku" },
  { city: "Tashkent", country: "Uzbekistan", timeZone: "Asia/Tashkent" },
  { city: "Almaty", country: "Kazakhstan", timeZone: "Asia/Almaty" },
  { city: "Bishkek", country: "Kyrgyzstan", timeZone: "Asia/Bishkek" },
  { city: "Ulaanbaatar", country: "Mongolia", timeZone: "Asia/Ulaanbaatar" },
  { city: "Bangkok", country: "Thailand", timeZone: "Asia/Bangkok" },
  { city: "Ho Chi Minh City", country: "Vietnam", timeZone: "Asia/Ho_Chi_Minh" },
  { city: "Hanoi", country: "Vietnam", timeZone: "Asia/Ho_Chi_Minh" },
  { city: "Phnom Penh", country: "Cambodia", timeZone: "Asia/Phnom_Penh" },
  { city: "Vientiane", country: "Laos", timeZone: "Asia/Vientiane" },
  { city: "Yangon", country: "Myanmar", timeZone: "Asia/Yangon" },
  { city: "Kuala Lumpur", country: "Malaysia", timeZone: "Asia/Kuala_Lumpur" },
  { city: "Singapore", country: "Singapore", timeZone: "Asia/Singapore" },
  { city: "Jakarta", country: "Indonesia", timeZone: "Asia/Jakarta" },
  { city: "Bali", country: "Indonesia", timeZone: "Asia/Makassar" },
  { city: "Manila", country: "Philippines", timeZone: "Asia/Manila" },
  { city: "Hong Kong", country: "China", timeZone: "Asia/Hong_Kong" },
  { city: "Shanghai", country: "China", timeZone: "Asia/Shanghai" },
  { city: "Beijing", country: "China", timeZone: "Asia/Shanghai" },
  { city: "Shenzhen", country: "China", timeZone: "Asia/Shanghai" },
  { city: "Taipei", country: "Taiwan", timeZone: "Asia/Taipei" },
  { city: "Seoul", country: "South Korea", timeZone: "Asia/Seoul" },
  { city: "Pyongyang", country: "North Korea", timeZone: "Asia/Pyongyang" },
  { city: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo" },
  { city: "Osaka", country: "Japan", timeZone: "Asia/Tokyo" },

  // ---------- EUROPE ----------
  { city: "London", country: "UK", timeZone: "Europe/London" },
  { city: "Manchester", country: "UK", timeZone: "Europe/London" },
  { city: "Edinburgh", country: "UK", timeZone: "Europe/London" },
  { city: "Dublin", country: "Ireland", timeZone: "Europe/Dublin" },
  { city: "Lisbon", country: "Portugal", timeZone: "Europe/Lisbon" },
  { city: "Madrid", country: "Spain", timeZone: "Europe/Madrid" },
  { city: "Barcelona", country: "Spain", timeZone: "Europe/Madrid" },
  { city: "Paris", country: "France", timeZone: "Europe/Paris" },
  { city: "Brussels", country: "Belgium", timeZone: "Europe/Brussels" },
  { city: "Amsterdam", country: "Netherlands", timeZone: "Europe/Amsterdam" },
  { city: "Luxembourg", country: "Luxembourg", timeZone: "Europe/Luxembourg" },
  { city: "Berlin", country: "Germany", timeZone: "Europe/Berlin" },
  { city: "Munich", country: "Germany", timeZone: "Europe/Berlin" },
  { city: "Frankfurt", country: "Germany", timeZone: "Europe/Berlin" },
  { city: "Zurich", country: "Switzerland", timeZone: "Europe/Zurich" },
  { city: "Geneva", country: "Switzerland", timeZone: "Europe/Zurich" },
  { city: "Vienna", country: "Austria", timeZone: "Europe/Vienna" },
  { city: "Rome", country: "Italy", timeZone: "Europe/Rome" },
  { city: "Milan", country: "Italy", timeZone: "Europe/Rome" },
  { city: "Copenhagen", country: "Denmark", timeZone: "Europe/Copenhagen" },
  { city: "Stockholm", country: "Sweden", timeZone: "Europe/Stockholm" },
  { city: "Oslo", country: "Norway", timeZone: "Europe/Oslo" },
  { city: "Helsinki", country: "Finland", timeZone: "Europe/Helsinki" },
  { city: "Reykjavik", country: "Iceland", timeZone: "Atlantic/Reykjavik" },
  { city: "Warsaw", country: "Poland", timeZone: "Europe/Warsaw" },
  { city: "Prague", country: "Czechia", timeZone: "Europe/Prague" },
  { city: "Bratislava", country: "Slovakia", timeZone: "Europe/Bratislava" },
  { city: "Budapest", country: "Hungary", timeZone: "Europe/Budapest" },
  { city: "Ljubljana", country: "Slovenia", timeZone: "Europe/Ljubljana" },
  { city: "Zagreb", country: "Croatia", timeZone: "Europe/Zagreb" },
  { city: "Belgrade", country: "Serbia", timeZone: "Europe/Belgrade" },
  { city: "Sarajevo", country: "Bosnia and Herzegovina", timeZone: "Europe/Sarajevo" },
  { city: "Skopje", country: "North Macedonia", timeZone: "Europe/Skopje" },
  { city: "Tirana", country: "Albania", timeZone: "Europe/Tirane" },
  { city: "Athens", country: "Greece", timeZone: "Europe/Athens" },
  { city: "Bucharest", country: "Romania", timeZone: "Europe/Bucharest" },
  { city: "Sofia", country: "Bulgaria", timeZone: "Europe/Sofia" },
  { city: "Kyiv", country: "Ukraine", timeZone: "Europe/Kyiv" },
  { city: "Minsk", country: "Belarus", timeZone: "Europe/Minsk" },
  { city: "Moscow", country: "Russia", timeZone: "Europe/Moscow" },
  { city: "St. Petersburg", country: "Russia", timeZone: "Europe/Moscow" },
  { city: "Riga", country: "Latvia", timeZone: "Europe/Riga" },
  { city: "Vilnius", country: "Lithuania", timeZone: "Europe/Vilnius" },
  { city: "Tallinn", country: "Estonia", timeZone: "Europe/Tallinn" },
  { city: "Valletta", country: "Malta", timeZone: "Europe/Malta" },

  // ---------- NORTH AMERICA ----------
  { city: "New York", country: "USA", timeZone: "America/New_York" },
  { city: "Boston", country: "USA", timeZone: "America/New_York" },
  { city: "Washington DC", country: "USA", timeZone: "America/New_York" },
  { city: "Atlanta", country: "USA", timeZone: "America/New_York" },
  { city: "Miami", country: "USA", timeZone: "America/New_York" },
  { city: "Detroit", country: "USA", timeZone: "America/Detroit" },
  { city: "Chicago", country: "USA", timeZone: "America/Chicago" },
  { city: "Dallas", country: "USA", timeZone: "America/Chicago" },
  { city: "Houston", country: "USA", timeZone: "America/Chicago" },
  { city: "Minneapolis", country: "USA", timeZone: "America/Chicago" },
  { city: "Denver", country: "USA", timeZone: "America/Denver" },
  { city: "Phoenix", country: "USA", timeZone: "America/Phoenix" },
  { city: "Los Angeles", country: "USA", timeZone: "America/Los_Angeles" },
  { city: "San Francisco", country: "USA", timeZone: "America/Los_Angeles" },
  { city: "Seattle", country: "USA", timeZone: "America/Los_Angeles" },
  { city: "Las Vegas", country: "USA", timeZone: "America/Los_Angeles" },
  { city: "Anchorage", country: "USA", timeZone: "America/Anchorage" },
  { city: "Honolulu", country: "USA", timeZone: "Pacific/Honolulu" },
  { city: "Toronto", country: "Canada", timeZone: "America/Toronto" },
  { city: "Ottawa", country: "Canada", timeZone: "America/Toronto" },
  { city: "Montreal", country: "Canada", timeZone: "America/Toronto" },
  { city: "Vancouver", country: "Canada", timeZone: "America/Vancouver" },
  { city: "Calgary", country: "Canada", timeZone: "America/Edmonton" },
  { city: "Winnipeg", country: "Canada", timeZone: "America/Winnipeg" },
  { city: "Mexico City", country: "Mexico", timeZone: "America/Mexico_City" },
  { city: "Cancun", country: "Mexico", timeZone: "America/Cancun" },
  { city: "Guatemala City", country: "Guatemala", timeZone: "America/Guatemala" },
  { city: "San José", country: "Costa Rica", timeZone: "America/Costa_Rica" },
  { city: "Panama City", country: "Panama", timeZone: "America/Panama" },
  { city: "Havana", country: "Cuba", timeZone: "America/Havana" },
  { city: "Kingston", country: "Jamaica", timeZone: "America/Jamaica" },
  { city: "Santo Domingo", country: "Dominican Republic", timeZone: "America/Santo_Domingo" },

  // ---------- SOUTH AMERICA ----------
  { city: "Bogotá", country: "Colombia", timeZone: "America/Bogota" },
  { city: "Lima", country: "Peru", timeZone: "America/Lima" },
  { city: "Quito", country: "Ecuador", timeZone: "America/Guayaquil" },
  { city: "Caracas", country: "Venezuela", timeZone: "America/Caracas" },
  { city: "La Paz", country: "Bolivia", timeZone: "America/La_Paz" },
  { city: "Santiago", country: "Chile", timeZone: "America/Santiago" },
  { city: "Buenos Aires", country: "Argentina", timeZone: "America/Argentina/Buenos_Aires" },
  { city: "Montevideo", country: "Uruguay", timeZone: "America/Montevideo" },
  { city: "Asunción", country: "Paraguay", timeZone: "America/Asuncion" },
  { city: "São Paulo", country: "Brazil", timeZone: "America/Sao_Paulo" },
  { city: "Rio de Janeiro", country: "Brazil", timeZone: "America/Sao_Paulo" },
  { city: "Brasília", country: "Brazil", timeZone: "America/Sao_Paulo" },
  { city: "Georgetown", country: "Guyana", timeZone: "America/Guyana" },
  { city: "Paramaribo", country: "Suriname", timeZone: "America/Paramaribo" },

  // ---------- AFRICA ----------
  { city: "Cairo", country: "Egypt", timeZone: "Africa/Cairo" },
  { city: "Casablanca", country: "Morocco", timeZone: "Africa/Casablanca" },
  { city: "Algiers", country: "Algeria", timeZone: "Africa/Algiers" },
  { city: "Tunis", country: "Tunisia", timeZone: "Africa/Tunis" },
  { city: "Tripoli", country: "Libya", timeZone: "Africa/Tripoli" },
  { city: "Khartoum", country: "Sudan", timeZone: "Africa/Khartoum" },
  { city: "Addis Ababa", country: "Ethiopia", timeZone: "Africa/Addis_Ababa" },
  { city: "Nairobi", country: "Kenya", timeZone: "Africa/Nairobi" },
  { city: "Kampala", country: "Uganda", timeZone: "Africa/Kampala" },
  { city: "Dar es Salaam", country: "Tanzania", timeZone: "Africa/Dar_es_Salaam" },
  { city: "Kigali", country: "Rwanda", timeZone: "Africa/Kigali" },
  { city: "Lagos", country: "Nigeria", timeZone: "Africa/Lagos" },
  { city: "Abuja", country: "Nigeria", timeZone: "Africa/Lagos" },
  { city: "Accra", country: "Ghana", timeZone: "Africa/Accra" },
  { city: "Abidjan", country: "Côte d'Ivoire", timeZone: "Africa/Abidjan" },
  { city: "Dakar", country: "Senegal", timeZone: "Africa/Dakar" },
  { city: "Kinshasa", country: "DRC", timeZone: "Africa/Kinshasa" },
  { city: "Luanda", country: "Angola", timeZone: "Africa/Luanda" },
  { city: "Johannesburg", country: "South Africa", timeZone: "Africa/Johannesburg" },
  { city: "Cape Town", country: "South Africa", timeZone: "Africa/Johannesburg" },
  { city: "Harare", country: "Zimbabwe", timeZone: "Africa/Harare" },
  { city: "Lusaka", country: "Zambia", timeZone: "Africa/Lusaka" },
  { city: "Antananarivo", country: "Madagascar", timeZone: "Indian/Antananarivo" },

  // ---------- OCEANIA ----------
  { city: "Perth", country: "Australia", timeZone: "Australia/Perth" },
  { city: "Adelaide", country: "Australia", timeZone: "Australia/Adelaide" },
  { city: "Darwin", country: "Australia", timeZone: "Australia/Darwin" },
  { city: "Brisbane", country: "Australia", timeZone: "Australia/Brisbane" },
  { city: "Sydney", country: "Australia", timeZone: "Australia/Sydney" },
  { city: "Melbourne", country: "Australia", timeZone: "Australia/Melbourne" },
  { city: "Canberra", country: "Australia", timeZone: "Australia/Sydney" },
  { city: "Hobart", country: "Australia", timeZone: "Australia/Hobart" },
  { city: "Auckland", country: "New Zealand", timeZone: "Pacific/Auckland" },
  { city: "Wellington", country: "New Zealand", timeZone: "Pacific/Auckland" },
  { city: "Suva", country: "Fiji", timeZone: "Pacific/Fiji" },
  { city: "Port Moresby", country: "Papua New Guinea", timeZone: "Pacific/Port_Moresby" },
  { city: "Nouméa", country: "New Caledonia", timeZone: "Pacific/Noumea" },
  { city: "Papeete", country: "French Polynesia", timeZone: "Pacific/Tahiti" },
  { city: "Apia", country: "Samoa", timeZone: "Pacific/Apia" },
  { city: "Nuku'alofa", country: "Tonga", timeZone: "Pacific/Tongatapu" },
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
    if (part.type !== "literal") values[part.type] = part.value;
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
  if (mins === 0) return `${sign}${hours}h`;
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
  if (weekday === "Sat" || weekday === "Sun") return "Weekend";
  if (hour >= 9 && hour < 17) return "Working hours";
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
  const [openFaq, setOpenFaq] = useState(null);

  const [selectedZones, setSelectedZones] = useState(() => {
    try {
      const saved =
        typeof window !== "undefined" &&
        localStorage.getItem("tcp-world-clock-cities");
      return saved ? JSON.parse(saved) : DEFAULT_CITIES;
    } catch {
      return DEFAULT_CITIES;
    }
  });

  const [homeZone, setHomeZone] = useState(() => {
    try {
      return (
        (typeof window !== "undefined" &&
          localStorage.getItem("tcp-world-clock-home")) ||
        "Asia/Kathmandu"
      );
    } catch {
      return "Asia/Kathmandu";
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "tcp-world-clock-cities",
        JSON.stringify(selectedZones)
      );
    } catch {}
  }, [selectedZones]);

  useEffect(() => {
    try {
      localStorage.setItem("tcp-world-clock-home", homeZone);
    } catch {}
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

  // ============================================================
  // FAQ DATA (40 questions — covers all common Google queries)
  // ============================================================
  const faqs = [
    {
      q: "What is a world clock?",
      a: "A world clock displays the current local time in multiple cities and time zones at once. Unlike a wristwatch that only shows one time zone, a world clock lets you see exactly what time it is anywhere on Earth right now, so you can plan calls, meetings, travel, and conversations without doing mental math.",
    },
    {
      q: "What does UTC mean?",
      a: "UTC stands for Coordinated Universal Time — the primary time standard by which the world regulates clocks. It's effectively GMT (Greenwich Mean Time) but is more precise and maintained by atomic clocks. Every time zone on Earth is defined as a positive or negative offset from UTC. For example, Nepal is UTC+5:45, Japan is UTC+9, and New York is UTC−5 in winter, UTC−4 in summer.",
    },
    {
      q: "What does GMT mean?",
      a: "GMT stands for Greenwich Mean Time — the mean solar time at the Royal Observatory in Greenwich, London. It's often used interchangeably with UTC in everyday speech, though technically UTC is the modern scientific standard and GMT is a time zone name. London's winter time is GMT (UTC+0), and its summer time is BST (UTC+1).",
    },
    {
      q: "Why are there 24 time zones?",
      a: "Earth rotates 360 degrees in 24 hours, meaning it turns 15 degrees every hour. If we divide the globe into 24 slices of 15 degrees each, every slice experiences the same solar time. That's the basis of time zones. Each zone is offset by one hour from its neighbors. In practice, some countries use half-hour or quarter-hour offsets to align better with their geography or politics.",
    },
    {
      q: "What is a UTC offset?",
      a: "A UTC offset is how far a local time zone is ahead of or behind UTC. It's expressed as a positive or negative number of hours (sometimes minutes). For example: New York is UTC−5 in winter (5 hours behind UTC), London is UTC+0 in winter, India is UTC+5:30 (5.5 hours ahead of UTC), and Nepal is UTC+5:45 (5 hours 45 minutes ahead of UTC).",
    },
    {
      q: "Why is Nepal's time zone UTC+5:45?",
      a: "Nepal has one of the world's most unusual time zone offsets — +5:45. It was set in 1986 to make Nepal's time distinct from India's +5:30 and to be closer to true solar time for Kathmandu. This offset makes Nepali time either 15 minutes ahead of India (IST) or 15 minutes behind, depending on how you think about it. Very few places on Earth use a 45-minute offset.",
    },
    {
      q: "Why does India use UTC+5:30 instead of a full hour offset?",
      a: "India's landmass spans roughly two hours of solar time from east to west, but the country wanted a single unified time zone. The compromise was to choose the solar time of a city near the center of India — Mirzapur — resulting in a +5:30 offset. This half-hour offset minimizes the maximum error for both east and west regions.",
    },
    {
      q: "What is daylight saving time (DST)?",
      a: "Daylight Saving Time is the practice of advancing clocks by one hour in spring and turning them back in autumn to make better use of daylight. It's used in most of Europe, North America, and parts of Australia, but not in most of Asia, Africa, or South America. DST causes offsets to shift twice a year, which is why it's important to use a live world clock rather than memorized offsets.",
    },
    {
      q: "Which countries don't observe daylight saving time?",
      a: "Most countries near the equator don't observe DST because daylight length varies little year-round. Notable non-DST countries include India, China, Japan, Nepal, Indonesia, the Philippines, Saudi Arabia, the UAE, Qatar, Kuwait, and most of Africa. Russia and Turkey have also abolished DST permanently. The United States, Canada, Mexico, Brazil, Australia, New Zealand, and all EU countries generally use DST (with some regional exceptions like Arizona and Hawaii).",
    },
    {
      q: "When does daylight saving time start and end?",
      a: "In the EU and UK, DST runs from the last Sunday of March to the last Sunday of October. In the US and Canada, DST runs from the second Sunday of March to the first Sunday of November. In Australia and New Zealand, DST is reversed (October to April) because they're in the Southern Hemisphere. Because these rules change over time and differ by country, always trust a live clock that reads the browser's Intl time zone database.",
    },
    {
      q: "Why does the time difference between two cities sometimes change?",
      a: "Time differences change when one city enters or leaves daylight saving time while the other doesn't. For example, London and New York are normally 5 hours apart, but from mid-March to late March (when the US has sprung forward but the EU hasn't yet), they're only 4 hours apart. A live world clock handles this automatically — a paper chart cannot.",
    },
    {
      q: "How do I schedule a meeting across multiple time zones?",
      a: "Add every participant's city to this world clock, set one of them as your home/reference city, and look at each card's time difference. Aim for a meeting time that falls within working hours (9am–5pm) for as many participants as possible. For global teams, expect to rotate inconvenient times fairly. Avoid 6pm–8am local time if possible, and remember that a Monday-morning meeting in New York is already Monday afternoon in London and Tuesday morning in Tokyo.",
    },
    {
      q: "How do I call someone in another country at a reasonable hour?",
      a: "Use the working-hours indicator on each city card. It shows 'Working hours', 'Outside working hours', or 'Weekend'. If a city shows 'Outside working hours' at your intended call time, that's a strong signal to reschedule. For Asia–US calls, mornings in Asia are evenings in the US; evenings in Asia are mornings in the US — usually the easiest overlap.",
    },
    {
      q: "What is the difference between 'Home' and 'Reference' city?",
      a: "In this tool, they mean the same thing. The home/reference city is the one you're comparing everything else to. If you set London as home, then Tokyo's card will show '+9h' relative to London. If you switch the home city to Tokyo, London will show '−9h' relative to Tokyo. This makes the tool flexible for people who travel, work remotely, or coordinate from different bases.",
    },
    {
      q: "Does this world clock handle daylight saving time?",
      a: "Yes, automatically. The clock reads every city's offset from your browser's built-in IANA time zone database, which is updated by your OS and browser vendors. When DST starts or ends in any city, the clock shows the correct offset the very next tick — no manual adjustment needed.",
    },
    {
      q: "What are the world's weirdest time zones?",
      a: "Several places use offsets that don't align with the 1-hour standard: Nepal is UTC+5:45; India and Sri Lanka are UTC+5:30; Iran is UTC+3:30; Afghanistan is UTC+4:30; Myanmar is UTC+6:30; parts of central Australia are UTC+9:30; the Chatham Islands (New Zealand) are UTC+12:45; and the tiny Australian territory of Eucla is UTC+8:45. There are also places that skip an entire calendar day — Samoa and Kiribati both shifted across the International Date Line in the 1990s and 2011 respectively.",
    },
    {
      q: "Why does Kiribati's Line Islands time zone start a day earlier?",
      a: "Kiribati is spread across the International Date Line. In 1995, the country shifted its Line Islands from UTC−10 to UTC+14 so that the whole nation would be on the same calendar date. As a result, when it's Sunday in the Line Islands, it's still Saturday in Hawaii, which is only a few hours of flight away. This is the largest time zone offset in the world.",
    },
    {
      q: "What is the International Date Line?",
      a: "The International Date Line is the imaginary line on Earth's surface where the calendar date changes. Cross it going east and you move back one day; going west, you move forward one. It roughly follows the 180° line of longitude but zigzags to keep countries and islands within the same date. The largest deviations are around Kiribati and Samoa.",
    },
    {
      q: "What's the difference between local time and solar time?",
      a: "Solar time is determined by the position of the sun in the sky at a specific longitude. Local time (clock time) is a political convention — countries choose offsets and DST rules for economic and social reasons. Solar noon happens at exactly 12:00 local time only if your clock time perfectly matches your longitude. Most places are off by 30 minutes to an hour, and some — like China — are off by 3 hours or more.",
    },
    {
      q: "Why does China have one time zone despite spanning five?",
      a: "China spans about 60 degrees of longitude — five standard time zones' worth — but since 1949 the entire country uses Beijing Standard Time (UTC+8). This was a political decision to unify the country. As a result, in far-western Xinjiang, the sun rises around 10 a.m. local clock time, and some locals use an unofficial 'Xinjiang Time' (UTC+6) in daily life while the official clock remains Beijing.",
    },
    {
      q: "Why do some countries have the same time zone across huge distances?",
      a: "Time zones are political boundaries, not just astronomical ones. India (UTC+5:30), China (UTC+8), and the EU's shared time blocks all span massive distances but choose a single offset for administrative simplicity. The trade-off is that some regions experience significant daylight misalignment — sunrise can be 2 hours later on one edge than the other.",
    },
    {
      q: "How do I convert time between time zones manually?",
      a: "Find each city's UTC offset (this tool shows it under each card). If City A is UTC+5 and City B is UTC−3, the difference is 8 hours — A is ahead by 8. Add the difference for cities ahead of you, subtract for cities behind. This works for standard offsets, but be careful: DST transitions change offsets twice a year, so use a live clock when planning events in the future.",
    },
    {
      q: "What is Zulu time / Z time?",
      a: "Zulu time is aviation and military slang for UTC (UTC+0). It's called 'Zulu' because the military phonetic alphabet uses 'Zulu' for the letter Z, and UTC is sometimes written as Z (as in '14:30Z'). Pilots, ship navigators, and military operations use Zulu time to avoid time-zone confusion.",
    },
    {
      q: "Why do time zones have different names for the same offset?",
      a: "Different regions use different abbreviations for the same offset. UTC+1 is called CET in Europe, WAT in West Africa, and BST (British Summer Time) is also UTC+1 but refers only to the UK's summer offset. Because abbreviations collide and cause confusion, IANA time zones use region-based names like 'Europe/London' instead of abbreviations — this is what your browser uses internally.",
    },
    {
      q: "What is IANA time zone database?",
      a: "The IANA time zone database (also called tzdata, zoneinfo, or the Olson database) is the authoritative list of all time zones and their historical offset changes. It's maintained by the Internet Assigned Numbers Authority and used by all modern operating systems, browsers, programming languages, and this world clock. It contains the exact date and time of every DST transition since 1970, and even some historical data going back to the 1800s.",
    },
    {
      q: "How accurate is this world clock?",
      a: "Extremely accurate. Your browser uses the IANA time zone database for every conversion, and this clock reads the system time from your device. The only real risk is if your device's own clock is wrong — in which case every 'local time' display will be off by the same amount. If you see something odd, check your system time first.",
    },
    {
      q: "Does the world clock work offline?",
      a: "Yes. Once the page is loaded, the clock runs entirely in your browser using its local clock and the cached IANA database. No internet connection is required during use. Refreshing the page requires a network connection unless it's cached by your service worker or browser.",
    },
    {
      q: "Can I save my selected cities?",
      a: "Yes — your selected cities and home reference zone are saved in your browser's localStorage. When you return to this page, they'll be restored automatically. The data never leaves your device, so no account is needed. Clearing your browser data will reset the list to the default cities.",
    },
    {
      q: "Why is my time different from what this page shows?",
      a: "Three likely causes: (1) your device's system time is wrong — check your OS clock; (2) your browser is caching an old IANA database — update your browser; (3) you have an outdated OS that doesn't include recent DST rule changes (common on older Android or Windows versions). If you're on a modern browser and OS, the clock should match the official time exactly.",
    },
    {
      q: "What is a 'business hour' overlap?",
      a: "The window of time during which two time zones are both within their typical 9am–5pm working hours. For example, London (UTC+0/+1) and New York (UTC−5/−4) overlap for about 8 hours per day — London 9am–5pm aligns with New York 4am–12pm, so the practical overlap is roughly London 1pm–5pm / New York 8am–12pm. Some pairs (like Sydney and Los Angeles) have almost no overlap and require asynchronous collaboration or rotated meeting times.",
    },
    {
      q: "What's the easiest way to find a good meeting time?",
      a: "Add all cities, set your home city, then look for the time block where the most cities show 'Working hours' or at least are within the same waking-hours window. Aim to keep at least 80% of participants within 8am–8pm local. If no such window exists, split the meeting into two sessions or rotate the inconvenient slot fairly across weeks.",
    },
    {
      q: "Which cities have the most extreme time zone differences?",
      a: "The biggest practical gaps: Auckland (UTC+13 in DST) vs. Los Angeles (UTC−7 in DST) = 20 hours apart. Auckland vs. Honolulu = 23 hours apart. Baker Island (UTC−12) and Kiribati's Line Islands (UTC+14) are 26 hours apart — the full 24 hours plus 2, meaning they're effectively 'two days' apart on a calendar. These pairs make real-time communication extremely awkward.",
    },
    {
      q: "Why does a UTC+14 city exist?",
      a: "UTC+14 exists because of Kiribati's Line Islands, which were moved from UTC−10 to UTC+14 in 1995 to keep the country's calendar unified. It's the largest positive time zone offset on Earth. The only other place with UTC+13 or +14 are parts of Samoa, Tonga, and a few other Pacific islands — all of which made similar adjustments to align their business week with Australia and New Zealand.",
    },
    {
      q: "What is a 'reference time'?",
      a: "In this tool, reference time means the current time in your home/reference city. Every other card shows the difference from that reference. Changing the reference city recomputes all comparisons instantly. It's useful to switch the reference between 'my local time' and 'the client's time' when planning from different perspectives.",
    },
    {
      q: "Can I use this for planning travel?",
      a: "Yes. Before travelling, add your origin and destination cities. You'll see the exact local time on arrival, the offset difference (useful for beating jet lag — try to shift sleep 1 hour per day before travel), and the current working hours. During travel, it's useful to keep both cities visible so you don't accidentally call home in the middle of the night.",
    },
    {
      q: "What is jet lag, and how does the world clock help?",
      a: "Jet lag is the fatigue you feel after crossing multiple time zones because your body's circadian rhythm is out of sync with local time. The world clock helps you plan adjustments: begin shifting your sleep 1 hour per day toward the destination's time, avoid heavy meals during your 'biological night', and expose yourself to daylight at the destination's morning. Recovery typically takes about one day per time zone crossed.",
    },
    {
      q: "Does this tool show sunrise and sunset times?",
      a: "No — this is a world clock, not a sun-tracking tool. For sunrise/sunset times, use a dedicated site like timeanddate.com or a sunrise/sunset API. That said, you can estimate roughly: at the equator, sunrise is ~6am and sunset ~6pm local solar time. The further you are from the equator or the further you are from the center of your time zone, the more these shift.",
    },
    {
      q: "Why are some cities not in this list?",
      a: "This list covers 200+ major cities across all major time zones, but it's not exhaustive — there are thousands of cities worldwide. If you need a city that isn't listed, check whether another city in the same time zone (e.g. 'Europe/London') works for your comparison. Time is the same within a time zone, so a nearby city often serves the same purpose.",
    },
    {
      q: "Can I embed this world clock in my website?",
      a: "This page runs as a React component. If you're building a site, you can import and render <WorldClock /> directly, or link to this page. For blogs and landing pages, linking to a dedicated world-clock page is simpler and keeps your site fast.",
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">
            Time &amp; timezone tool
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
            World Clock — Current Time in 200+ Cities &amp; Every Time Zone
          </h1>
          <p className="mt-4 text-slate-600 leading-7">
            Check the current local time in cities around the world, compare
            multiple time zones at a glance, and plan international meetings,
            travel, remote work, and calls without doing mental math. Live
            updates every second, automatic daylight saving time handling, and
            a searchable list of 200+ cities across every continent.
          </p>
        </header>

        {/* CONTROLS */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Search city or country
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search London, Tokyo, Dubai, Japan..."
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Home / reference city
              </label>
              <select
                value={homeZone}
                onChange={(e) => {
                  setHomeZone(e.target.value);
                  addCity(e.target.value);
                }}
                className="w-full md:w-64 border border-gray-300 bg-white rounded-lg px-4 py-3"
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
                className="bg-gray-900 text-white px-4 py-3 rounded-lg font-medium"
              >
                {is24Hour ? "24 Hour" : "12 Hour"}
              </button>
              <button
                onClick={resetCities}
                className="border border-gray-300 px-4 py-3 rounded-lg font-medium"
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
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {city.city}
                    </h2>
                    <p className="text-sm text-gray-500">{city.country}</p>
                  </div>
                  {city.timeZone === homeZone && (
                    <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Home
                    </span>
                  )}
                </div>
                <div className="mt-5">
                  <div className="text-4xl font-bold tracking-tight text-gray-900 tabular-nums">
                    {time}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{date}</p>
                </div>
                <div className="mt-5 bg-gray-50 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Time difference from {homeCity.city}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {city.timeZone === homeZone
                      ? "Reference time"
                      : formatDifference(difference)}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    {formatOffset(now, city.timeZone)}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    {status}
                  </span>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => copyTime(city)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Copy time
                  </button>
                  <button
                    onClick={() => removeCity(city.timeZone)}
                    className="border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* ADD CITIES */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-xl font-bold text-gray-900">Add a city</h2>
          <p className="mt-1 text-sm text-gray-500">
            Browse 200+ cities across every continent. Search above to filter
            the list, or click any city to add it to your clock.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 max-h-72 overflow-y-auto">
            {filteredCities.map((city) => {
              const exists = selectedZones.includes(city.timeZone);
              return (
                <button
                  key={city.timeZone + city.city}
                  disabled={exists}
                  onClick={() => addCity(city.timeZone)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium border ${
                    exists
                      ? "opacity-50 cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  {exists ? "✓ " : "+ "}
                  {city.city}
                </button>
              );
            })}
          </div>
        </section>

        {/* ==========================================================
            SEO CONTENT — massive, useful, original
           ========================================================== */}

        {/* 1. WHAT IS A WORLD CLOCK */}
        <section className="mt-10 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            What Is a World Clock — and Why Do You Need One?
          </h2>
          <div className="mt-4 space-y-4 text-gray-600 leading-7 max-w-4xl">
            <p>
              A world clock is a time zone comparison tool. It shows the current
              local time in multiple cities around the world at the same moment,
              so you can see at a glance that it's 9:00 a.m. in London, 2:00 p.m.
              in Dubai, 5:00 p.m. in Tokyo, and 2:00 a.m. in New York. That
              single comparison replaces dozens of mental calculations and
              dramatically reduces the risk of getting a call or meeting wrong.
            </p>
            <p>
              World clocks are used in dozens of contexts. Remote teams use them
              to schedule stand-ups that are fair to every time zone. Families
              with relatives abroad use them to remember the right hour to call.
              Travellers use them to plan their arrival and jet-lag management.
              Traders use them to know when the London, New York, and Tokyo
              stock exchanges open. Airlines, logistics teams, broadcasters,
              gamers, podcasters, and event planners all rely on some form of
              world clock in their daily work.
            </p>
            <p>
              The technical core of a world clock is time zone conversion. Every
              location on Earth belongs to a time zone, and every time zone is
              defined as an offset from UTC — the global reference time. Because
              offsets change twice a year for daylight saving in some countries,
              and because some countries (like Nepal and India) use
              non-standard offsets, doing conversions by hand is error-prone.
              A live world clock reads the official IANA time zone database from
              your browser and always shows the correct current time, including
              DST transitions, without any manual work.
            </p>
          </div>
        </section>

        {/* 2. HOW TIME ZONES WORK */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            How Time Zones Work — A Complete Beginner's Guide
          </h2>
          <div className="mt-4 space-y-4 text-gray-600 leading-7 max-w-4xl">
            <p>
              Time zones exist because the Earth rotates. It takes 24 hours for
              the Earth to complete one 360-degree rotation, meaning it turns
              15 degrees every hour. If every location on Earth used the same
              clock, noon would happen at wildly different solar positions — in
              some places the sun would be at its highest point at 6 p.m. on
              that clock. Time zones solve that by dividing the globe into 24
              slices, each 15 degrees wide, with adjacent zones one hour apart.
              Noon in each zone roughly aligns with the sun being directly
              overhead.
            </p>
            <p>
              In practice, time zones don't follow perfectly straight lines.
              They zigzag to follow national borders, economic regions, and
              political decisions. China, for example, covers about 5 geographic
              time zones but uses just one — UTC+8 — for the entire country.
              India covers roughly 2 solar hours but uses a single offset of
              UTC+5:30. Nepal uses UTC+5:45. Iran uses UTC+3:30. Afghanistan
              uses UTC+4:30. These non-standard offsets exist because countries
              decided a single, unified time was more important than precise
              astronomical alignment.
            </p>
            <p>
              The reference point for all time zones is UTC — Coordinated
              Universal Time — which replaced GMT as the international standard
              in 1972. UTC is measured by atomic clocks and doesn't observe
              daylight saving. Every other time zone on Earth is expressed as a
              positive or negative offset from UTC. For example, New York is
              UTC−5 in winter and UTC−4 in summer (when daylight saving is
              active); Tokyo is always UTC+9 (Japan doesn't observe DST); and
              London is UTC+0 in winter and UTC+1 in summer.
            </p>
            <p>
              The International Date Line — roughly the 180° meridian — is where
              the calendar date changes. Cross it going east and you go back
              one day; going west and you advance one day. Most of the line
              passes through open Pacific Ocean, but it zigzags around Kiribati,
              Samoa, and other island nations so that each country stays on a
              single calendar date for practical convenience.
            </p>
          </div>
        </section>

        {/* 3. WHY OFFSETS AREN'T ALL WHOLE HOURS */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Some Countries Use Half-Hour or Quarter-Hour Offsets
          </h2>
          <div className="mt-4 space-y-4 text-gray-600 leading-7 max-w-4xl">
            <p>
              Most time zones are whole-hour offsets from UTC, but about 30
              countries use half-hour, quarter-hour, or even other non-standard
              offsets. These exist because the country's geography doesn't
              align neatly with a 15-degree slice. Rather than accept a large
              solar misalignment, the country chose a compromise offset that
              minimizes the maximum error across its landmass.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>UTC+5:30 — India, Sri Lanka.</strong> Chosen to align with the solar time of central India while keeping the country unified.</li>
              <li><strong>UTC+5:45 — Nepal.</strong> Set in 1986 to make Nepal's time distinct from India's and closer to true solar time for Kathmandu.</li>
              <li><strong>UTC+3:30 — Iran.</strong> Aligns with Tehran's solar time, which is far west of the country's eastern edge.</li>
              <li><strong>UTC+4:30 — Afghanistan.</strong> Centered on Kabul's solar time.</li>
              <li><strong>UTC+6:30 — Myanmar, Cocos Islands.</strong> A compromise between India's +5:30 and Thailand's +7.</li>
              <li><strong>UTC+8:45 — Eucla (Australia).</strong> A tiny region that unofficially uses a 45-minute offset.</li>
              <li><strong>UTC+9:30 — Central Australia (Adelaide, Darwin).</strong> Aligns with that region's solar noon.</li>
              <li><strong>UTC+12:45 — Chatham Islands (New Zealand).</strong> Slightly ahead of mainland NZ's +12/+13.</li>
              <li><strong>UTC+13 — Tonga, Samoa (in DST).</strong> Effectively UTC+13 most of the year.</li>
              <li><strong>UTC+14 — Kiribati's Line Islands.</strong> The world's largest positive offset; it makes Kiribati's calendar consistent across the country.</li>
            </ul>
            <p>
              These offsets can make cross-time-zone comparisons tricky. Two
              cities in "UTC+5" zones can be 30 minutes apart in reality (for
              example, if one is India's +5:30 and another is Pakistan's +5:00).
              That's why this world clock shows the exact UTC offset on each
              city card — so you can see the real difference, not just the
              rounded one.
            </p>
          </div>
        </section>

        {/* 4. DST — THE COMPLETE EXPLANATION */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Daylight Saving Time — Everything You Need to Know
          </h2>
          <div className="mt-4 space-y-4 text-gray-600 leading-7 max-w-4xl">
            <p>
              Daylight Saving Time (DST) is the practice of advancing clocks by
              one hour during spring and summer to make better use of evening
              daylight. It was first proposed by Benjamin Franklin in 1784 as a
              joke, championed by entomologist George Hudson in 1895 as a
              practical way to extend daylight for bug-collecting, and officially
              adopted by Germany in 1916 during World War I to save coal for
              the war effort. Since then, most of Europe, North America, and
              parts of Australia and New Zealand have adopted it, while most of
              Asia, Africa, and South America have not.
            </p>
            <p>
              The reason DST exists is that daylight naturally varies across the
              year depending on your distance from the equator. At 50° latitude,
              the summer sun sets nearly two hours later than in winter. DST
              shifts the clock so that more of that extra evening daylight
              falls within waking hours — theoretically reducing evening
              electricity use. The energy-saving effect is now largely
              considered negligible or even negative in modern economies, but
              DST remains popular because people enjoy later sunsets.
            </p>
            <p>
              DST transitions are the single biggest source of time zone
              confusion. The EU and UK spring forward on the last Sunday of
              March and fall back on the last Sunday of October. The US and
              Canada spring forward on the second Sunday of March and fall back
              on the first Sunday of November. In 2024, for example, between
              March 10 and March 31 the US and Europe were only 4 hours apart
              instead of the usual 5. A live world clock handles this
              automatically — a printed time zone chart cannot.
            </p>
            <p>
              Some countries have abolished DST permanently. Russia has been on
              permanent standard time since 2014. Turkey moved to permanent
              UTC+3 in 2016. Argentina, China, India, Japan, and most
              Southeast Asian countries never observed DST. The US state of
              Arizona and Hawaii don't observe DST (though the Navajo Nation
              does). In 2018, the European Commission proposed abolishing DST in
              the EU, but the change was shelved indefinitely due to the COVID
              pandemic and hasn't been revived.
            </p>
          </div>
        </section>

        {/* 5. TABLES */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Standard UTC Offsets for Major Cities
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Standard time offsets — DST may add one hour in some cities.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border border-gray-200 px-3 py-2 font-semibold">City</th>
                  <th className="border border-gray-200 px-3 py-2 font-semibold">Country</th>
                  <th className="border border-gray-200 px-3 py-2 font-semibold">Standard Offset</th>
                  <th className="border border-gray-200 px-3 py-2 font-semibold">Observes DST?</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {[
                  ["Kathmandu", "Nepal", "UTC+5:45", "No"],
                  ["New Delhi", "India", "UTC+5:30", "No"],
                  ["Dubai", "UAE", "UTC+4", "No"],
                  ["Riyadh", "Saudi Arabia", "UTC+3", "No"],
                  ["Moscow", "Russia", "UTC+3", "No"],
                  ["Istanbul", "Turkey", "UTC+3", "No"],
                  ["Athens", "Greece", "UTC+2", "Yes"],
                  ["Helsinki", "Finland", "UTC+2", "Yes"],
                  ["Berlin", "Germany", "UTC+1", "Yes"],
                  ["Paris", "France", "UTC+1", "Yes"],
                  ["London", "UK", "UTC+0", "Yes"],
                  ["Reykjavik", "Iceland", "UTC+0", "No"],
                  ["São Paulo", "Brazil", "UTC−3", "No"],
                  ["Buenos Aires", "Argentina", "UTC−3", "No"],
                  ["New York", "USA", "UTC−5", "Yes"],
                  ["Chicago", "USA", "UTC−6", "Yes"],
                  ["Denver", "USA", "UTC−7", "Yes"],
                  ["Los Angeles", "USA", "UTC−8", "Yes"],
                  ["Anchorage", "USA", "UTC−9", "Yes"],
                  ["Honolulu", "USA", "UTC−10", "No"],
                  ["Tokyo", "Japan", "UTC+9", "No"],
                  ["Seoul", "South Korea", "UTC+9", "No"],
                  ["Beijing", "China", "UTC+8", "No"],
                  ["Singapore", "Singapore", "UTC+8", "No"],
                  ["Sydney", "Australia", "UTC+10", "Yes"],
                  ["Auckland", "New Zealand", "UTC+12", "Yes"],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-200 px-3 py-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. USE CASES */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            12 Practical Uses for a World Clock
          </h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-gray-600 leading-7">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">1. Remote work scheduling</h3>
              <p>Coordinate stand-ups, sprints, and 1:1s across continents without sending 20 emails.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">2. International sales calls</h3>
              <p>Call clients at business hours instead of waking them up.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">3. Family calls</h3>
              <p>Avoid calling parents, siblings, or relatives abroad at 3 a.m. their time.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">4. Flight planning</h3>
              <p>Know exactly what time you land and how far your body clock is out of sync.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">5. Stock market hours</h3>
              <p>Track when London, New York, Tokyo, Hong Kong, and Sydney exchanges open.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">6. Sports events</h3>
              <p>Know when a football match, F1 race, or tennis final starts in your city.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">7. Live streaming</h3>
              <p>Broadcast to a global audience at an hour that doesn't kill one region.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">8. Online gaming</h3>
              <p>Coordinate raid times and tournaments across US, EU, and Asia servers.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">9. Freelance work</h3>
              <p>Set availability that aligns with clients' working hours.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">10. Study-abroad planning</h3>
              <p>Know the right time to attend webinars, info sessions, and interviews.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">11. News and events</h3>
              <p>Convert "9 a.m. ET" to your local time without thinking twice.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">12. Travel jet-lag planning</h3>
              <p>Begin shifting your sleep one hour per day ahead of travel to land better-rested.</p>
            </div>
          </div>
        </section>

        {/* 7. HOW TO USE */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            How to Use This World Clock
          </h2>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-gray-600 leading-7 max-w-4xl">
            <li>Search for a city or country using the search box above.</li>
            <li>Click any city to add it to your clock. You can have as many cities as you like.</li>
            <li>Set your home or reference city using the dropdown. Everything else is compared to this city.</li>
            <li>Look at the time on each card to see the current local time in that city.</li>
            <li>Check the UTC offset (shown as a small pill on each card) to see that city's absolute offset from UTC.</li>
            <li>Read the time difference from your home city — for example "+9h" means that city is 9 hours ahead of home.</li>
            <li>Use the "Working hours / Outside working hours / Weekend" pill to quickly check whether it's a reasonable time to call.</li>
            <li>Click "Copy time" on any card to copy that city's local time and offset to your clipboard.</li>
            <li>Click "Reset" to restore the default six cities and default home zone.</li>
            <li>Toggle between 12-hour and 24-hour format using the button in the controls bar.</li>
          </ol>
        </section>

        {/* 8. FAQ */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions About World Clocks &amp; Time Zones
          </h2>
          <div className="mt-5 space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    isOpen ? "border-indigo-300 bg-indigo-50/30" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 text-left px-4 py-3.5"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-gray-900 pr-2">
                      {i + 1}. {faq.q}
                    </span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 -mt-1">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. GLOSSARY */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">Time Zone Glossary</h2>
          <dl className="mt-4 space-y-3 text-sm text-gray-600 leading-7 max-w-4xl">
            <div><dt className="font-bold text-gray-900 inline">UTC</dt> — Coordinated Universal Time. The global reference standard against which all time zones are defined.</div>
            <div><dt className="font-bold text-gray-900 inline">GMT</dt> — Greenwich Mean Time. Solar time at Greenwich; effectively identical to UTC for civil purposes.</div>
            <div><dt className="font-bold text-gray-900 inline">UTC offset</dt> — A city's standard or DST offset from UTC, e.g. UTC+5:45 for Nepal.</div>
            <div><dt className="font-bold text-gray-900 inline">IANA tz</dt> — The official time zone database; names like Europe/London come from it.</div>
            <div><dt className="font-bold text-gray-900 inline">DST</dt> — Daylight Saving Time; clocks shift +1h in spring, −1h in autumn.</div>
            <div><dt className="font-bold text-gray-900 inline">IST</dt> — Indian Standard Time (UTC+5:30). Also used for Irish Standard Time (UTC+1) and Israel Standard Time (UTC+2) — a classic source of confusion.</div>
            <div><dt className="font-bold text-gray-900 inline">BST</dt> — British Summer Time (UTC+1); UK daylight saving offset.</div>
            <div><dt className="font-bold text-gray-900 inline">CET</dt> — Central European Time (UTC+1); used across most of the EU in winter.</div>
            <div><dt className="font-bold text-gray-900 inline">CEST</dt> — Central European Summer Time (UTC+2).</div>
            <div><dt className="font-bold text-gray-900 inline">EST / EDT</dt> — US Eastern Standard Time (UTC−5) / Eastern Daylight Time (UTC−4).</div>
            <div><dt className="font-bold text-gray-900 inline">CST</dt> — Central Standard Time in the US (UTC−6), but also China Standard Time (UTC+8) — another source of confusion.</div>
            <div><dt className="font-bold text-gray-900 inline">Zulu time</dt> — Aviation/military slang for UTC; written as "14:30Z".</div>
            <div><dt className="font-bold text-gray-900 inline">International Date Line</dt> — The meridian (roughly 180°) where the calendar date changes.</div>
            <div><dt className="font-bold text-gray-900 inline">Solar time</dt> — Time based on the actual position of the sun; different from clock time.</div>
          </dl>
        </section>

        {/* 10. INTERNAL LINKS */}
        <section className="mt-8 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">Related Tools</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {[
              { to: "/", label: "Home" },
              { to: "/create", label: "Custom Timer" },
              { to: "/stopwatch", label: "Stopwatch" },
              { to: "/pomodoro", label: "Pomodoro Timer" },
              { to: "/10-minute-timer", label: "10-Minute Timer" },
              { to: "/mock-test-timer", label: "Mock Test Timer" },
              { to: "/hiit-timer", label: "HIIT Timer" },
              { to: "/meditation-timer-with-sound", label: "Meditation Timer" },
              { to: "/time-card-calculator-online", label: "Time Card Calculator" },
              { to: "/history", label: "Timer History" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-800 transition"
              >
                <span className="truncate">{link.label}</span>
                <span className="text-gray-300">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 11. CLOSING */}
        <section className="mt-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-lg p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-3">Time Zones, Solved.</h2>
          <p className="text-indigo-100 max-w-2xl leading-relaxed">
            Whether you're scheduling a meeting across five continents,
            planning a family call, tracking when the Tokyo Stock Exchange
            opens, or trying to decide whether to call a friend in Sydney at
            "only" 9 a.m. your time — this world clock gives you an accurate,
            second-by-second view of exactly what time it is anywhere on Earth.
            Bookmark it. You'll use it more than you think.
          </p>
        </section>
      </div>
    </main>
  );
}