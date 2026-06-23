# CLAUDE.md — app.bootIT

Frontend for **bootIT**, a browser-based Java learning environment for a 3-day pre-master CS bootcamp. Students have **no prior programming experience**; the camp teaches basic OOP in Java. Keep everything beginner-friendly: gentle copy, clear errors, no jargon in user-facing text.

This repo is the React frontend. The backend lives in the sibling repo `api.bootIT` (ASP.NET Core + SignalR). The code executor will eventually be a standalone Docker container the API calls.

## Stack

- **React 19** + **Vite 8** (ESM, `"type": "module"`)
- **@monaco-editor/react** + **monaco-editor** — the code editor (same engine as VS Code)
- **three** — the 3D scene that reacts to student progress
- **ESLint 10** (flat config: `js.recommended`, `react-hooks`, `react-refresh`)
- No TypeScript, no test runner, no CSS framework — plain CSS with CSS variables.

## Commands

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the build
npm run lint     # eslint .
```

Run the backend separately: `dotnet run` in `api.bootIT` (listens on `http://localhost:5179`). Vite proxies `/api/*` to that port (see `vite.config.js`), so frontend code always calls `/api/...` relatively — never hardcode the port.

## Project structure

```
src/
  main.jsx                  # entry; mounts <App/> in StrictMode
  App.jsx                   # root component — owns ALL app state, calls /api/run
  App.css                   # layout + component styles (uses CSS vars)
  index.css                 # CSS variable palette ("Hygge Café") + resets
  components/               # theme-agnostic IDE chrome (work with any/no theme)
    Toolbar.jsx             # top bar: logo, themed subtitle, Submit/Run, sidebar toggle
    Sidebar.jsx             # foldable task list + progress bar + active task detail
    OutputPanel.jsx         # terminal-style stdout/stderr panel
  themes/                   # pluggable visual skins — the THEME BOUNDARY
    index.js                # registry + ACTIVE_THEME + nullTheme
    cafe/
      index.js              # cafe theme descriptor { id, name, subtitle, Scene }
      CafeScene.jsx         # Three.js 3D café; renders the shop-name board
  lib/                      # client-side Java tooling — see src/lib/CLAUDE.md
    tasks.js                # TASKS array + per-task check()/starter (task source of truth)
    javaValidator.js        # heuristic Java linter → Monaco markers
    javaCompletions.js      # Monaco completion providers (members + snippets)
  assets/                   # images (hero.png, svgs)
```

## State & data flow

`App.jsx` is the single source of truth — there is **no state library, router, or context**. State lives in `useState` hooks in `App` and flows down via props:

- `code`, `output`, `isRunning` — editor + run lifecycle
- `activeTask`, `completedTasks` (a `Set`), `sidebarFolded` — task UI
- `signals` — a theme-agnostic bag of values tasks broadcast on success (e.g. `{ cafeName }`); merged into shared state and handed to the active theme's `Scene`

Run flow: Submit → `executeCode(code)` (`src/lib/executeApi.js`) → `POST /api/execute { code }` → `{ status, stdout, stderr }` → render `stdout` (falls back to `stderr`, then `"(no output)"`). Then `App` grades the run **generically** via `TASKS[activeTask].check({ code, output, stderr, exitCode })` — the contract response is mapped onto that shape (`stdout`→`output`, `status`→`exitCode`) so `tasks.js` is untouched. On a passing verdict the task is marked complete and any `verdict.signals` are merged into `signals`. `App` contains **no task-specific or theme-specific logic** — see the two boundaries below.

## Boundaries (task ⟂ theme)

The IDE core (editor, task list, output) is decoupled from both *what the tasks are* and *which visual theme is shown*, so either can be added, changed, or removed without touching `App.jsx`.

- **Task boundary — `src/lib/tasks.js`.** Each task is self-contained: `{ id, title, difficulty, description, hint?, starter?, check? }`. Passing criteria live in `check(result)` where `result = { code, output, stderr, exitCode }`, returning a verdict `{ passed, signals?, message? }`. To add a task or change grading, edit only this file. A task without `check` never auto-completes. `signals` is a free-form, theme-agnostic payload (the core never interprets it). Also exports `defaultStarter`. See `src/lib/CLAUDE.md`.
- **Theme boundary — `src/themes/`.** A theme is a pluggable skin implementing `{ id, name, subtitle, Scene }`, where `Scene` is a React component (the right-hand panel) receiving `{ signals, completedTasks, activeTask }` — or `null` for no scene. It decides which `signals` keys it cares about (the café theme uses `signals.cafeName` for the shop board). Swap themes by changing `ACTIVE_THEME` in `src/themes/index.js`; set it to `nullTheme` to run the **plain IDE with no 3D scene at all** (the editor, tasks, and output still work; the toolbar subtitle is theme-driven and disappears too). Add a theme by dropping a folder under `src/themes/`, exporting the shape, and registering it in `THEMES`.

## Backend API contract

The frontend depends on this endpoint (proxied via `/api`), per `CONTRACT.md` in the api repo:

- `POST /api/execute` body `{ "code": "..." }` → `{ "status": "success" | "compile_error" | "runtime_error", "stdout": string, "stderr": string }`

All backend calls go through **`src/lib/executeApi.js`** — the single seam to the API.

**The backend may not be ready yet.** `executeApi.js` calls the real endpoint and, on any failure, falls back to a **mock** (`src/lib/mockExecute.js`) that regex-extracts `System.out.println("...")` literals and echoes them — it does **not** compile or run Java. The mock is designed to be deleted in one step once the backend is live: remove `mockExecute.js`, its import, and the clearly-fenced fallback branch in `executeApi.js`. Planned backend: a real dockerized Java executor (Piston), a SignalR hub for teacher→room broadcasts (e.g. a timer), and per-student progress persistence — see the api repo's `CONTRACT.md` / `STORIES.md`.

## Theme — "Hygge Café"

The product is dressed as a cozy café. UI copy uses café language ("Submit" → "Brewing…", "brew your code"). The palette is defined as CSS variables in `src/index.css` (`--bg` dark roast, `--accent` caramel, etc.) — **always use these variables, never hardcode colors.** It's a dark theme; Monaco runs `theme="vs-dark"`. Tasks are themed around building a café (start by naming the shop).

The café is now **one pluggable theme** under `src/themes/cafe/` (see the theme boundary above), not hardcoded into `App`. Its 3D scene and panel chrome are self-contained in `CafeScene.jsx`; for now its CSS (`.cafe-panel`, `.cafe-header`, etc.) still lives in `App.css` rather than alongside the theme (POC — move it if you want a fully self-contained skin). Disabling the theme (`ACTIVE_THEME = nullTheme`) leaves a working, unbranded IDE.

> **Note on `DESIGN.md`:** that file documents a *Mintlify* (light, mint-green) design system and does **not** match the app's current Hygge Café dark palette. Treat it as external reference material, not the spec for this app, unless the user says otherwise. Confirm intent before restyling to it.

## Conventions

- Functional components only, one per file, **default export**. Props destructured in the signature.
- **No semicolons** in JS/JSX; 2-space indentation. (Monaco editor content uses `tabSize: 4` for the Java the *students* write — separate concern.)
- Keep new state in `App.jsx` and pass via props unless there's a strong reason to introduce context.
- Style with classes + CSS variables in `App.css`/`index.css`; nested `&:hover` syntax is used (native CSS nesting). No inline styles except dynamic values (e.g. progress-bar width).
- `lib/` modules are framework-agnostic vanilla JS with JSDoc headers — keep them React-free.

## Roles (planned, not yet built)

The product is intended to have **student** and **teacher** views selected by role. The current code is single-view (student-style) only — there is no auth, role switching, or routing yet. Build these out when asked; don't assume they exist.

## Git / current state

Early-stage. `main` has only the initial scaffold commit; the actual app (components, lib, theme) is **uncommitted working-tree changes**. Expect to commit real work. POC throughout — favor simple, readable, beginner-clear solutions over premature abstraction.

## Related repos

- `api.bootIT` — ASP.NET Core (.NET 10) backend, SignalR planned, currently mocks `/api/run`.
- `bootIT slides` — the camp's teaching PDFs (bootIT-I/II/III); the source of truth for what students learn and the level to pitch tasks at.
