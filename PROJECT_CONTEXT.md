# TimeCounterPro — AI Project Context

## 1. Project Identity

Project Name: TimeCounterPro

GitHub Repository:
https://github.com/Bhavesh077code/timecounterpro

This is a React + Vite web application focused on timers, countdowns, stopwatch, Pomodoro, productivity, sharing, and time-management features.

The AI must understand the existing codebase BEFORE making any code changes.

---

# 2. IMPORTANT INSTRUCTION FOR AI

You are working on an EXISTING project.

DO NOT immediately rewrite files.

First:

1. Access and inspect the complete repository.
2. Understand the folder structure.
3. Read package.json.
4. Read all source files that are related to the requested change.
5. Understand how components communicate with Context, hooks, utilities, and pages.
6. Identify dependencies between files.
7. Understand existing functionality before modifying anything.
8. Never remove an existing feature unless it is clearly broken or I explicitly ask you to remove it.
9. Preserve the existing UI and design unless I ask for a redesign.
10. Prefer minimal, safe, production-quality changes.
11. Do not create duplicate functionality.
12. Do not introduce a second timer engine when one already exists.
13. Before replacing a file completely, explain why a full replacement is necessary.
14. Before deleting a file, explain what uses that file and why it is safe to delete.
15. Always check imports and exports after modifying files.
16. Always consider mobile and desktop behavior.
17. Always consider localStorage/state persistence.
18. Always consider browser refresh, tab switching, and browser throttling for timer-related features.
19. Do not guess how a function works. Read its implementation first.
20. If the repository has already implemented a feature, improve the existing implementation instead of creating another version.

---

# 3. CURRENT PROJECT GOAL

The goal is to turn TimeCounterPro into a polished, reliable, user-friendly productivity timer application.

The application should feel:

* Fast
* Simple
* Modern
* Reliable
* Mobile-friendly
* Professional
* Easy to understand
* Useful for daily productivity

---

# 4. IMPORTANT EXISTING FEATURES

The project already contains or is designed around features such as:

* Countdown timer
* Custom timer
* Quick timer presets
* Stopwatch
* Pomodoro timer
* Full-screen timer
* Timer history
* Statistics
* Timer sharing
* Shareable countdown URLs
* Themes
* Sounds
* LocalStorage persistence
* SEO timer pages
* Blog pages
* Embedded/shared countdown functionality
* Responsive UI

Do NOT remove these features without checking their dependencies.

---

# 5. IMPORTANT TIMER ARCHITECTURE

Timer functionality is the most important part of the application.

The AI must treat timer accuracy as a high priority.

Avoid relying on:

```js
remaining -= 1;
```

or assuming:

```js
setInterval(callback, 1000);
```

runs exactly every second.

JavaScript timers can be delayed by:

* Browser throttling
* Background tabs
* CPU load
* Laptop sleep
* Mobile browser behavior

Prefer timestamp-based calculations.

Example:

```js
const remaining = Math.max(
  0,
  Math.ceil((targetAt - Date.now()) / 1000)
);
```

For countdown timers, prefer:

```js
targetAt
```

as the source of truth.

For paused timers, preserve:

```js
remaining
```

and do not allow time to continue decreasing while paused.

---

# 6. TIMER STATE REQUIREMENTS

A timer may contain properties such as:

```js
{
  id,
  name,
  duration,
  remaining,
  type,
  status,
  isPaused,
  startTime,
  targetAt,
  targetDate,
  theme,
  createdAt,
  completedAt
}
```

Do not change the timer data structure randomly.

Before changing it, inspect all files that consume the timer object.

---

# 7. TIMER PERSISTENCE

TimeCounterPro uses browser storage/local persistence.

The AI must ensure:

### Running timer

When the page reloads:

* The timer should continue correctly.
* It should calculate remaining time from a timestamp.

### Paused timer

When the page reloads:

* The timer must remain paused.
* The remaining time must NOT decrease while the browser is closed.

### Completed timer

Completed timers should move into history only once.

Avoid duplicate completion records.

---

# 8. VERY IMPORTANT — SINGLE TIMER ENGINE

There should eventually be ONE source of truth for timer calculations.

Preferred architecture:

```text
TimerContext
      ↓
Timer Engine / Timer Hook
      ↓
 ┌────┴───────────┐
 ↓                ↓
TimerCard    FullScreenTimer
```

Do NOT create separate independent countdown engines in:

* TimerCard
* FullScreenTimer
* Dashboard
* Context

If multiple components need timer information, they should consume the same timer state.

This prevents:

* Double-speed timers
* Duplicate intervals
* Duplicate completion
* Wrong statistics
* Inconsistent pause/resume
* Fullscreen bugs

---

# 9. CURRENT IMPORTANT FILES

Before modifying timer functionality, inspect these files first:

```text
src/context/TimerContext.jsx

src/components/TimerCard.jsx

src/components/FullScreenTimer.jsx

src/components/TimerDashboard.jsx

src/components/Timer/CountdownCreator.jsx

src/components/Timer/Stopwatch.jsx

src/components/Timer/PomodoroTimer.jsx
```

Then inspect related:

```text
src/utils/helpers.js

src/utils/constants.js

src/hooks/

src/pages/

src/App.jsx
```

Do not assume these files have the same API as a new project.

Read the actual current code.

---

# 10. KNOWN PROBLEMS TO CHECK

The AI should verify whether these issues still exist before changing them.

## Countdown milliseconds problem

Check whether CountdownCreator calculates:

```js
targetDateTime - Date.now()
```

and passes the result as seconds.

The result of this calculation is milliseconds.

Correct conversion:

```js
Math.ceil(
  (targetDateTime - Date.now()) / 1000
)
```

Do not blindly apply this fix if the current implementation has already changed.

---

## Countdown addTimer API mismatch

Check that:

```js
addTimer()
```

accepts all required arguments.

For example:

```js
addTimer(
  name,
  duration,
  type,
  targetDate,
  theme
)
```

All callers and the Context implementation must have compatible APIs.

---

## Pause/resume persistence

Check whether paused timers store enough information to restore correctly after reload.

A paused timer must not continue counting while the browser is closed.

---

## Fullscreen duplicate timer engine

Check whether:

```text
TimerCard
```

and:

```text
FullScreenTimer
```

both independently run intervals.

If they do, move timer calculation toward a shared timer engine.

---

## Stopwatch accuracy

Do not rely on repeatedly incrementing:

```js
time += 1;
```

or similar interval-based counting as the source of truth.

Prefer timestamps.

---

## Hard-coded domain

Check for hard-coded domains such as:

```text
https://timecounterpro.com
```

Prefer:

```js
window.location.origin
```

when appropriate.

But do not blindly replace URLs if a canonical production domain is intentionally configured.

---

# 11. CODE CHANGE RULES

When I ask:

> "Fix this bug"

Do this:

### Step 1

Identify the exact file(s).

### Step 2

Explain the current problem briefly.

### Step 3

Explain why it happens.

### Step 4

Tell me whether to:

* Change code
* Replace file
* Create new file
* Delete file

### Step 5

Give the exact code.

### Step 6

Explain exactly where to put it.

### Step 7

Check related imports/exports.

### Step 8

Tell me how to test it.

---

# 12. NEVER DO THIS

Do NOT say:

"Replace everything with this new architecture"

without first understanding the existing project.

Do NOT:

* Delete files unnecessarily
* Rewrite the entire application
* Remove UI features
* Remove existing routes
* Remove existing styling
* Change package versions unnecessarily
* Add unnecessary dependencies
* Duplicate components
* Duplicate timer logic
* Change public APIs without checking callers
* Invent files that do not exist
* Assume a function exists
* Assume a component uses a particular prop
* Give code that conflicts with the current project

---

# 13. WHEN ADDING A NEW FEATURE

Before adding a feature:

1. Search the repository for existing related code.
2. Determine whether the feature already partially exists.
3. Reuse existing components/utilities when possible.
4. Add only the missing functionality.
5. Keep the current design language.
6. Make the feature responsive.
7. Handle loading/error/empty states.
8. Consider persistence if appropriate.
9. Test the feature with existing features.

---

# 14. UI/UX RULES

The application should be user-friendly.

Avoid:

* Too many buttons
* Confusing labels
* Unnecessary popups
* Sudden navigation
* Poor mobile layouts
* Tiny controls
* Excessive animations
* Unclear error messages

Timer controls should be immediately understandable.

Prefer labels such as:

```text
Start
Pause
Resume
Reset
Delete
Fullscreen
Share
```

---

# 15. MOBILE REQUIREMENTS

Every UI modification must be checked for:

* Small phones
* Large phones
* Tablets
* Desktop

Do not assume desktop width.

Timer numbers should remain readable.

Buttons should be easy to tap.

---

# 16. ERROR HANDLING

Do not silently fail.

Use:

```js
try {
  ...
} catch (error) {
  console.error(error);
}
```

where appropriate.

User-facing errors should be understandable.

Bad:

```text
Error 500
```

Better:

```text
Unable to create the countdown. Please check the date and time.
```

---

# 17. PERFORMANCE

Avoid unnecessary:

* setIntervals
* setTimeout chains
* React re-renders
* Context updates
* localStorage writes every few milliseconds

Do not write to localStorage on every 10ms timer tick.

Use appropriate throttling or save important state changes only.

---

# 18. CODE QUALITY

Prefer:

* Small functions
* Clear names
* Reusable utilities
* React hooks where appropriate
* Existing project conventions
* Minimal dependencies

Avoid:

* Giant files
* Giant Contexts
* "miscellaneous" helper functions
* Dead commented-out implementations
* Duplicate code

---

# 19. BEFORE DELETING OLD CODE

Search for references.

For example:

```text
Search:
CountdownCreator
```

Then determine:

* Who imports it?
* Who calls it?
* What props does it receive?
* What Context functions does it use?

Only then remove or replace it.

---

# 20. BEFORE GIVING CODE TO ME

Always verify mentally:

### Imports

Does every imported function/component exist?

### Exports

Does the modified file export what other files expect?

### Props

Do caller and component props match?

### Context

Are Context functions actually provided?

### State

Are state variables initialized?

### LocalStorage

Can saved data be missing/corrupted?

### Timer

Does it work after:

* Start
* Pause
* Resume
* Reset
* Reload
* Background tab
* Fullscreen
* Completion

---

# 21. TESTING CHECKLIST

After timer changes, test:

* [ ] Create timer
* [ ] Start timer
* [ ] Pause timer
* [ ] Resume timer
* [ ] Reset timer
* [ ] Delete timer
* [ ] Complete timer
* [ ] Reload page
* [ ] Close and reopen browser
* [ ] Open fullscreen
* [ ] Exit fullscreen
* [ ] Switch browser tab
* [ ] Create countdown
* [ ] Create countdown with future date
* [ ] Try past date
* [ ] Check timer history
* [ ] Check statistics
* [ ] Check mobile layout
* [ ] Check desktop layout
* [ ] Check localStorage

---

# 22. CURRENT DEVELOPMENT PRIORITY

Work in this order.

## Priority 1 — Core reliability

Fix:

```text
TimerContext
CountdownCreator
TimerCard
FullScreenTimer
TimerDashboard
```

Goal:

One reliable timer system.

---

## Priority 2 — Notifications

Add browser notifications when a timer completes.

---

## Priority 3 — PWA

Make TimeCounterPro installable.

---

## Priority 4 — Better Pomodoro

Add:

* Custom focus duration
* Custom short break
* Custom long break
* Session count
* Auto-start
* Statistics

---

## Priority 5 — History & Statistics

Improve:

* Daily statistics
* Weekly statistics
* Monthly statistics
* Category filtering
* Total focus time
* Completed sessions
* Average session

---

## Priority 6 — Recurring timers

Allow:

```text
Every day
Every week
Custom schedule
```

---

# 23. IMPORTANT COMMUNICATION STYLE

I am learning the codebase.

Do not give me overly complicated explanations.

When explaining a change, use:

```text
FILE:
src/example/file.jsx

ACTION:
Replace / Edit / Create / Delete

WHY:
Simple explanation.

CODE:
Exact code.

WHERE:
Exactly where to put it.

TEST:
How I can verify it.
```

Explain difficult programming concepts in simple language.

Use simple English or Nepali/Hinglish when I ask.

Do not assume I already understand advanced architecture.

---

# 24. MOST IMPORTANT RULE

Before changing ANY file:

Understand how that file connects to the rest of the project.

Before deleting ANY file:

Check whether anything imports or depends on it.

Before replacing ANY file:

Make sure the replacement preserves existing functionality.

Before adding a new system:

Check whether the project already has one.

The goal is NOT to make the code look completely different.

The goal is to make the EXISTING TimeCounterPro project:

* More reliable
* Easier to maintain
* More user-friendly
* More accurate
* More professional

while preserving its existing features.

---

# 25. FIRST RESPONSE AFTER READING THIS FILE

When you receive this context, do NOT immediately modify code.

First respond with:

1. Repository structure understood
2. Main architecture understood
3. Important timer flow understood
4. Current problems found
5. Files that need changes
6. Recommended order of changes

Then wait for my instruction unless I explicitly ask you to implement the changes.

---

# END OF PROJECT CONTEXT














# Second Changed file 

# TimeCounterPro — AI Project Context

## 1. Project Identity

Project Name: TimeCounterPro

GitHub Repository:
https://github.com/Bhavesh077code/timecounterpro

This is a React + Vite web application focused on timers, countdowns, stopwatch, Pomodoro, productivity, sharing, and time-management features.

The AI must understand the existing codebase BEFORE making any code changes.

---

# 2. IMPORTANT INSTRUCTION FOR AI

You are working on an EXISTING project.

DO NOT immediately rewrite files.

First:

1. Access and inspect the complete repository.
2. Understand the folder structure.
3. Read package.json.
4. Read all source files that are related to the requested change.
5. Understand how components communicate with Context, hooks, utilities, and pages.
6. Identify dependencies between files.
7. Understand existing functionality before modifying anything.
8. Never remove an existing feature unless it is clearly broken or I explicitly ask you to remove it.
9. Preserve the existing UI and design unless I ask for a redesign.
10. Prefer minimal, safe, production-quality changes.
11. Do not create duplicate functionality.
12. Do not introduce a second timer engine when one already exists.
13. Before replacing a file completely, explain why a full replacement is necessary.
14. Before deleting a file, explain what uses that file and why it is safe to delete.
15. Always check imports and exports after modifying files.
16. Always consider mobile and desktop behavior.
17. Always consider localStorage/state persistence.
18. Always consider browser refresh, tab switching, and browser throttling for timer-related features.
19. Do not guess how a function works. Read its implementation first.
20. If the repository has already implemented a feature, improve the existing implementation instead of creating another version.

---

# 3. CURRENT PROJECT GOAL

The goal is to turn TimeCounterPro into a polished, reliable, user-friendly productivity timer application.

The application should feel:

* Fast
* Simple
* Modern
* Reliable
* Mobile-friendly
* Professional
* Easy to understand
* Useful for daily productivity

---

# 4. IMPORTANT EXISTING FEATURES

The project already contains or is designed around features such as:

* Countdown timer
* Custom timer
* Quick timer presets
* Stopwatch
* Pomodoro timer
* Full-screen timer
* Timer history
* Statistics
* Timer sharing
* Shareable countdown URLs
* Themes
* Sounds
* LocalStorage persistence
* SEO timer pages
* Blog pages
* Embedded/shared countdown functionality
* Responsive UI

Do NOT remove these features without checking their dependencies.

---

# 5. IMPORTANT TIMER ARCHITECTURE

Timer functionality is the most important part of the application.

The AI must treat timer accuracy as a high priority.

Avoid relying on:

```js
remaining -= 1;
```

or assuming:

```js
setInterval(callback, 1000);
```

runs exactly every second.

JavaScript timers can be delayed by:

* Browser throttling
* Background tabs
* CPU load
* Laptop sleep
* Mobile browser behavior

Prefer timestamp-based calculations.

Example:

```js
const remaining = Math.max(
  0,
  Math.ceil((targetAt - Date.now()) / 1000)
);
```

For countdown timers, prefer:

```js
targetAt
```

as the source of truth.

For paused timers, preserve:

```js
remaining
```

and do not allow time to continue decreasing while paused.

---

# 6. TIMER STATE REQUIREMENTS

A timer may contain properties such as:

```js
{
  id,
  name,
  duration,
  remaining,
  type,
  status,
  isPaused,
  startTime,
  targetAt,
  targetDate,
  theme,
  createdAt,
  completedAt
}
```

Do not change the timer data structure randomly.

Before changing it, inspect all files that consume the timer object.

---

# 7. TIMER PERSISTENCE

TimeCounterPro uses browser storage/local persistence.

The AI must ensure:

### Running timer

When the page reloads:

* The timer should continue correctly.
* It should calculate remaining time from a timestamp.

### Paused timer

When the page reloads:

* The timer must remain paused.
* The remaining time must NOT decrease while the browser is closed.

### Completed timer

Completed timers should move into history only once.

Avoid duplicate completion records.

---

# 8. VERY IMPORTANT — SINGLE TIMER ENGINE

There should eventually be ONE source of truth for timer calculations.

Preferred architecture:

```text
TimerContext
      ↓
Timer Engine / Timer Hook
      ↓
 ┌────┴───────────┐
 ↓                ↓
TimerCard    FullScreenTimer
```

Do NOT create separate independent countdown engines in:

* TimerCard
* FullScreenTimer
* Dashboard
* Context

If multiple components need timer information, they should consume the same timer state.

This prevents:

* Double-speed timers
* Duplicate intervals
* Duplicate completion
* Wrong statistics
* Inconsistent pause/resume
* Fullscreen bugs

---

# 9. CURRENT IMPORTANT FILES

Before modifying timer functionality, inspect these files first:

```text
src/context/TimerContext.jsx

src/components/TimerCard.jsx

src/components/FullScreenTimer.jsx

src/components/TimerDashboard.jsx

src/components/Timer/CountdownCreator.jsx

src/components/Timer/Stopwatch.jsx

src/components/Timer/PomodoroTimer.jsx
```

Then inspect related:

```text
src/utils/helpers.js

src/utils/constants.js

src/hooks/

src/pages/

src/App.jsx
```

Do not assume these files have the same API as a new project.

Read the actual current code.

---

# 10. KNOWN PROBLEMS TO CHECK

The AI should verify whether these issues still exist before changing them.

## Countdown milliseconds problem

Check whether CountdownCreator calculates:

```js
targetDateTime - Date.now()
```

and passes the result as seconds.

The result of this calculation is milliseconds.

Correct conversion:

```js
Math.ceil(
  (targetDateTime - Date.now()) / 1000
)
```

Do not blindly apply this fix if the current implementation has already changed.

---

## Countdown addTimer API mismatch

Check that:

```js
addTimer()
```

accepts all required arguments.

For example:

```js
addTimer(
  name,
  duration,
  type,
  targetDate,
  theme
)
```

All callers and the Context implementation must have compatible APIs.

---

## Pause/resume persistence

Check whether paused timers store enough information to restore correctly after reload.

A paused timer must not continue counting while the browser is closed.

---

## Fullscreen duplicate timer engine

Check whether:

```text
TimerCard
```

and:

```text
FullScreenTimer
```

both independently run intervals.

If they do, move timer calculation toward a shared timer engine.

---

## Stopwatch accuracy

Do not rely on repeatedly incrementing:

```js
time += 1;
```

or similar interval-based counting as the source of truth.

Prefer timestamps.

---

## Hard-coded domain

Check for hard-coded domains such as:

```text
https://timecounterpro.com
```

Prefer:

```js
window.location.origin
```

when appropriate.

But do not blindly replace URLs if a canonical production domain is intentionally configured.

---

# 11. CODE CHANGE RULES

When I ask:

> "Fix this bug"

Do this:

### Step 1

Identify the exact file(s).

### Step 2

Explain the current problem briefly.

### Step 3

Explain why it happens.

### Step 4

Tell me whether to:

* Change code
* Replace file
* Create new file
* Delete file

### Step 5

Give the exact code.

### Step 6

Explain exactly where to put it.

### Step 7

Check related imports/exports.

### Step 8

Tell me how to test it.

---

# 12. NEVER DO THIS

Do NOT say:

"Replace everything with this new architecture"

without first understanding the existing project.

Do NOT:

* Delete files unnecessarily
* Rewrite the entire application
* Remove UI features
* Remove existing routes
* Remove existing styling
* Change package versions unnecessarily
* Add unnecessary dependencies
* Duplicate components
* Duplicate timer logic
* Change public APIs without checking callers
* Invent files that do not exist
* Assume a function exists
* Assume a component uses a particular prop
* Give code that conflicts with the current project

---

# 13. WHEN ADDING A NEW FEATURE

Before adding a feature:

1. Search the repository for existing related code.
2. Determine whether the feature already partially exists.
3. Reuse existing components/utilities when possible.
4. Add only the missing functionality.
5. Keep the current design language.
6. Make the feature responsive.
7. Handle loading/error/empty states.
8. Consider persistence if appropriate.
9. Test the feature with existing features.

---

# 14. UI/UX RULES

The application should be user-friendly.

Avoid:

* Too many buttons
* Confusing labels
* Unnecessary popups
* Sudden navigation
* Poor mobile layouts
* Tiny controls
* Excessive animations
* Unclear error messages

Timer controls should be immediately understandable.

Prefer labels such as:

```text
Start
Pause
Resume
Reset
Delete
Fullscreen
Share
```

---

# 15. MOBILE REQUIREMENTS

Every UI modification must be checked for:

* Small phones
* Large phones
* Tablets
* Desktop

Do not assume desktop width.

Timer numbers should remain readable.

Buttons should be easy to tap.

---

# 16. ERROR HANDLING

Do not silently fail.

Use:

```js
try {
  ...
} catch (error) {
  console.error(error);
}
```

where appropriate.

User-facing errors should be understandable.

Bad:

```text
Error 500
```

Better:

```text
Unable to create the countdown. Please check the date and time.
```

---

# 17. PERFORMANCE

Avoid unnecessary:

* setIntervals
* setTimeout chains
* React re-renders
* Context updates
* localStorage writes every few milliseconds

Do not write to localStorage on every 10ms timer tick.

Use appropriate throttling or save important state changes only.

---

# 18. CODE QUALITY

Prefer:

* Small functions
* Clear names
* Reusable utilities
* React hooks where appropriate
* Existing project conventions
* Minimal dependencies

Avoid:

* Giant files
* Giant Contexts
* "miscellaneous" helper functions
* Dead commented-out implementations
* Duplicate code

---

# 19. BEFORE DELETING OLD CODE

Search for references.

For example:

```text
Search:
CountdownCreator
```

Then determine:

* Who imports it?
* Who calls it?
* What props does it receive?
* What Context functions does it use?

Only then remove or replace it.

---

# 20. BEFORE GIVING CODE TO ME

Always verify mentally:

### Imports

Does every imported function/component exist?

### Exports

Does the modified file export what other files expect?

### Props

Do caller and component props match?

### Context

Are Context functions actually provided?

### State

Are state variables initialized?

### LocalStorage

Can saved data be missing/corrupted?

### Timer

Does it work after:

* Start
* Pause
* Resume
* Reset
* Reload
* Background tab
* Fullscreen
* Completion

---

# 21. TESTING CHECKLIST

After timer changes, test:

* [ ] Create timer
* [ ] Start timer
* [ ] Pause timer
* [ ] Resume timer
* [ ] Reset timer
* [ ] Delete timer
* [ ] Complete timer
* [ ] Reload page
* [ ] Close and reopen browser
* [ ] Open fullscreen
* [ ] Exit fullscreen
* [ ] Switch browser tab
* [ ] Create countdown
* [ ] Create countdown with future date
* [ ] Try past date
* [ ] Check timer history
* [ ] Check statistics
* [ ] Check mobile layout
* [ ] Check desktop layout
* [ ] Check localStorage

---

# 22. CURRENT DEVELOPMENT PRIORITY

Work in this order.

## Priority 1 — Core reliability

Fix:

```text
TimerContext
CountdownCreator
TimerCard
FullScreenTimer
TimerDashboard
```

Goal:

One reliable timer system.

---

## Priority 2 — Notifications

Add browser notifications when a timer completes.

---

## Priority 3 — PWA

Make TimeCounterPro installable.

---

## Priority 4 — Better Pomodoro

Add:

* Custom focus duration
* Custom short break
* Custom long break
* Session count
* Auto-start
* Statistics

---

## Priority 5 — History & Statistics

Improve:

* Daily statistics
* Weekly statistics
* Monthly statistics
* Category filtering
* Total focus time
* Completed sessions
* Average session

---

## Priority 6 — Recurring timers

Allow:

```text
Every day
Every week
Custom schedule
```

---

# 23. IMPORTANT COMMUNICATION STYLE

I am learning the codebase.

Do not give me overly complicated explanations.

When explaining a change, use:

```text
FILE:
src/example/file.jsx

ACTION:
Replace / Edit / Create / Delete

WHY:
Simple explanation.

CODE:
Exact code.

WHERE:
Exactly where to put it.

TEST:
How I can verify it.
```

Explain difficult programming concepts in simple language.

Use simple English or Nepali/Hinglish when I ask.

Do not assume I already understand advanced architecture.

---

# 24. MOST IMPORTANT RULE

Before changing ANY file:

Understand how that file connects to the rest of the project.

Before deleting ANY file:

Check whether anything imports or depends on it.

Before replacing ANY file:

Make sure the replacement preserves existing functionality.

Before adding a new system:

Check whether the project already has one.

The goal is NOT to make the code look completely different.

The goal is to make the EXISTING TimeCounterPro project:

* More reliable
* Easier to maintain
* More user-friendly
* More accurate
* More professional

while preserving its existing features.

---

# 25. FIRST RESPONSE AFTER READING THIS FILE

When you receive this context, do NOT immediately modify code.

First respond with:

1. Repository structure understood
2. Main architecture understood
3. Important timer flow understood
4. Current problems found
5. Files that need changes
6. Recommended order of changes

Then wait for my instruction unless I explicitly ask you to implement the changes.

---

# END OF PROJECT CONTEXT


## Phase 4 production web
- Improved global SEO/social metadata in `index.html`.
- Fixed the timer SEO page Close action in `TimerSlugPage.jsx`.
- Sitemap generation now reads real `BlogData.js` entries instead of a stale hard-coded blog list.
- Simplified `robots.txt` to one sitemap and standard directives.
- Fixed the Pomodoro route typo from `/pomodro` to `/pomodoro`.







