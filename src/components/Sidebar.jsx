import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

/* ----------------------------------------------------------------
   Config
---------------------------------------------------------------- */

const SECTIONS = [
  {
    key: "timers",
    title: "Timers",
    hint: "T01–T05",
    items: [
      { to: "/hiit-timer", code: "T01", label: "HIIT / Tabata" },
      { to: "/stream-timer",     code: "T02", label: "stream-overlay" },
      { to: "/jungle-timer",  code: "T03", label: "Esports Jungle" },
      { to: "/gameplay-timer", code: "T04", label: "GamePlay Timer" },
    ],
  },
  {
    key: "workspace",
    title: "Workspace",
    hint: "T06–T08",
    items: [
      { to: "/mock-test-timer", code: "T06", label: "Mock Test Exam" },
      { to: "/fasting-tracker-timer",    code: "T07", label: "Fasting Tracker" },
      { to: "/presentation-timer", code: "T08", label: "Presentation Alert" },
    ],
  },
  {
    key: "collab",
    title: "Global",
    hint: "T09–T10",
    items: [
      { to: "/world-clock-board-timer", code: "T09", label: "World Clock Board" },
      { to: "/group-study-timer",  code: "T10", label: "Group Study Grid" },
    ],
  },
];

/* ----------------------------------------------------------------
   Small atoms
---------------------------------------------------------------- */

function SectionHeader({ title, hint, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-4 pt-5 pb-2 flex items-center justify-between group"
      aria-expanded={open}
    >
      <span className="flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 group-hover:text-slate-600 transition-colors">
          {title}
        </span>
        {hint && (
          <span className="text-[9px] font-mono text-slate-300 group-hover:text-slate-400 transition-colors">
            {hint}
          </span>
        )}
      </span>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        className={`text-slate-300 group-hover:text-slate-600 transition-transform duration-150 ${
          open ? "rotate-0" : "-rotate-90"
        }`}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

function NavItem({ to, code, label, onClose }) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3 pl-4 pr-3 py-2 text-sm font-medium",
          "border-l-2 transition-all duration-150",
          isActive
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 hover:pl-5",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`font-mono text-[10px] tabular-nums ${
              isActive
                ? "text-white/60"
                : "text-slate-400 group-hover:text-slate-600"
            }`}
          >
            {code}
          </span>
          <span className="flex-1 truncate">{label}</span>

          {isActive && (
            <span className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/20" />
          )}
        </>
      )}
    </NavLink>
  );
}

/* ----------------------------------------------------------------
   Sidebar
---------------------------------------------------------------- */

const Sidebar = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState({
    timers: false,
    workspace: false,
    collab: false,
  });

  const toggleSection = (key) =>
    setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const sectionsToRender = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q)
      ),
    })).filter((s) => s.items.length > 0);
  }, [query]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-14 xs:top-16 bottom-0 left-0 z-50 w-64
          bg-white/95 backdrop-blur-xl
          border-r border-slate-200/80
          flex flex-col
          transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Tools navigation"
      >
        {/* ── Header ───────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 bg-slate-900" />
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-700 truncate">
              workspace
            </span>
          </div>
          <p className="mt-1 text-[10px] font-mono text-slate-400 truncate">
            timecounterpro / tools
          </p>
        </div>

        {/* ── Search ───────────────────────────────────────── */}
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter tools…"
              className="w-full h-8 pl-7 pr-7 text-[12px] font-mono bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
            />
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                aria-label="Clear filter"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable nav ───────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto pb-2">
          {sectionsToRender.length === 0 && (
            <p className="px-4 py-6 text-[11px] font-mono text-slate-400 text-center">
              no tools match "{query}"
            </p>
          )}

          {sectionsToRender.map((section) => {
            const isCollapsed = collapsed[section.key];
            return (
              <div key={section.key}>
                <SectionHeader
                  title={section.title}
                  hint={section.hint}
                  open={!isCollapsed}
                  onToggle={() => toggleSection(section.key)}
                />
                {!isCollapsed && (
                  <div>
                    {section.items.map((item) => (
                      <NavItem
                        key={item.to}
                        {...item}
                        onClose={onClose}
                      />
                    ))}
                  </div>
                )}
                <div className="mx-4 border-t border-slate-200/70" />
              </div>
            );
          })}
        </nav>

        {/* ── Keyboard hints ───────────────────────────────── */}
        <div className="border-t border-slate-200/80 bg-slate-50/60 px-4 py-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-slate-300 bg-white text-slate-600">
                ⌘K
              </kbd>
              filter
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-slate-300 bg-white text-slate-600">
                S
              </kbd>
              sidebar
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export { SECTIONS };
export default Sidebar;