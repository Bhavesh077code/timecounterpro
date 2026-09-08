import React from "react";
const MODES = [
  { id: "countdown", label: "Countdown" },
  { id: "pomodoro", label: "Pomodoro" },
  { id: "stopwatch", label: "Stopwatch" },
];
function ModeSelector({ mode, setMode }) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto items-center gap-1  bg-white border border-slate-200 p-1 shadow-sm">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`shrink-0 px-4 py-2  text-sm font-semibold transition ${mode === m.id ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
export default ModeSelector;
