# CLAUDE.md — app.bootIT

Frontend for **bootIT**, a browser-based Java learning environment for a 3-day pre-master CS bootcamp. Students have **no prior programming experience**; the camp teaches basic OOP in Java. Keep everything beginner-friendly: gentle copy, clear errors, no jargon in user-facing text.

This repo is the React frontend. The backend lives in the sibling repo `api.bootIT` (ASP.NET Core + SignalR). The code executor will eventually be a standalone Docker container the API calls.

## Stack

- **React 19** + **Vite 8** (ESM, `"type": "module"`)
- **TypeScript** (strict, `verbatimModuleSyntax`) — no `any`, no manual type casts anywhere
- **Tailwind CSS v4** (`@tailwindcss/vite`) — palette lives as `@theme` tokens in `src/index.css`
- **@monaco-editor/react** + **monaco-editor** — the code editor (same engine as VS Code)
- **three** — the 3D scene that reacts to student progress
- **classnames** — every `className` is computed with it (no ternaries/template literals for classes)
- **Vitest** + **@testing-library/react** (jsdom) — co-located `*.test.ts` per component
- **ESLint 10** (flat config: `js.recommended`, `typescript-eslint`, `react-hooks`, `react-refresh`)

## Commands

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # preview the build
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
npm run test       # vitest run
```

Run the backend separately: `dotnet run` in `api.bootIT`. Vite proxies `/api/*` to it (see `vite.config.ts`), so frontend code always calls `/api/...` relatively — never hardcode the port.

## Path aliases

Defined in both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`); keep them in sync. `@/*`→`src/*`, plus `@components`, `@views`, `@hooks`, `@lib`, `@themes`, `@types` (each works bare or as `/*`). Import across folders via aliases, not deep relative paths.

## Project structure

```
src/
  main.tsx                  # entry; picks TeacherGate (/teacher) or StudentView, mounts in StrictMode
  index.css                 # Tailwind import + @theme tokens (ITU palette) + base layer
  vite-env.d.ts             # ImportMetaEnv (VITE_TEACHER_CODE) + vite/client types
  types/                    # cross-cutting domain types (Assignment, ExecuteResult, Theme, …) + barrel
  components/               # PURE, reusable presentational components (visual props only)
    Button/ Spinner/ Icon/ Badge/ ProgressBar/ TextField/ Modal/ IconButton/
    OutputPanel/ CodeEditor/ Toolbar/ AssignmentPanel/ AssignmentStepper/ FeedbackBanner/ SubmitModal/
    PredictPanel/ FileUpload/ ProjectPanel/ StudentEntry/   # quiz, mini-project upload, entry screen
    index.ts                # barrel re-exporting every component + its types
  views/                    # page-level views — OWN state/business logic via co-located hooks
    StudentView/            # the IDE (was App.jsx); useStudentWorkspace orchestrates everything
    TeacherGate/            # code-entry gate; useTeacherAuth
    TeacherDashboard/       # session + timer; useTeacherSession
  hooks/                    # cross-cutting state hooks: useExecutor, useAssignments, useSubmission
  themes/                   # pluggable visual skins — the THEME BOUNDARY
    index.ts                # registry + ACTIVE_THEME + nullTheme
    cafe/                   # CafeScene.tsx + useCafeScene (Three.js) + utils/constants/types
  lib/                      # framework-agnostic client-side tooling — see src/lib/CLAUDE.md
    assignments.ts          # legacy local ASSIGNMENTS bundle (code|predict|project) — live data comes from assignmentSetApi
    assignmentSet.ts        # groups an assignment set's list for the teacher preview
    grade.ts / predict.ts   # stdout grading helpers + predict-quiz grading
    executeApi.ts / submissionApi.ts / sessionApi.ts / quizApi.ts / assignmentSetApi.ts / mockApi.ts   # REST seams
    sessionHub.ts           # SignalR seam: joinSession (student) / observeSession (teacher) / TimerStarted
    identity.ts / teacherAuth.ts   # anon studentId + displayName; teacher sessionStorage flag
    javaValidator.ts        # heuristic Java linter → Monaco markers
    javaCompletions.ts      # Monaco completion providers (members + snippets)
  test/setup.ts             # jest-dom matchers for Vitest
  assets/                   # images (hero.png, svgs)
```

### Component folder layout (the strict convention)

Each shared component is a folder: `ComponentName.tsx` + `index.ts` (barrel), with `.types.ts` / `.constants.ts` / `.utils.ts` / `.hooks.ts` / `.test.ts` **only when needed**. Class strings and variant→class maps (typed as `Record<…>`, no `as`) live in `.constants.ts`; data transforms in `.utils.ts`; effects/state in `.hooks.ts`. Tests are `.test.ts` (no JSX) using `createElement` from React.

## Components vs views

- **`src/components/` = pure presentational.** Props describe **visual** state only (`isDisabled`/`isLoading`, never `isAuthenticated`); no fetching, no app state; all class computation via `classnames`; event handlers passed as named refs (`handle*`), never inline arrows in JSX.
- **`src/views/` = pages.** They own state and business logic through their co-located hooks and pass display-ready props down to components. Cross-cutting state hooks live in `src/hooks/`.

## State & data flow

`StudentView` is the single source of truth for the IDE — **no state library, router, or context**. Its hook `useStudentWorkspace` (`src/views/StudentView/StudentView.hooks.ts`) composes `useExecutor` / `useAssignments` / `useSubmission`, holds per-assignment `code` + the check-feedback state, and shapes the props each component renders.

Layout is two columns under the Toolbar: **`AssignmentPanel`** (left, ~380px — `AssignmentStepper` progress strip on top, then the active assignment's `lesson` blocks, task `description`, `hint`, and a bottom-pinned `FeedbackBanner`) and the IDE column (Monaco `CodeEditor` over `OutputPanel`/`PredictPanel`; `ProjectPanel` replaces the IDE column for project assignments).

Run flow: Run → `executor.run(code)` → `executeCode(code)` (`@lib/executeApi`) → `POST /api/execute` → `{ status, stdout, stderr }` → terminal shows `stdout` (falls back to `stderr`, then `"(no output)"`). Then it grades **generically** via the active assignment's `check({ code, output, stderr, exitCode })` (contract mapped: `stdout`→`output`, `status`→`exitCode`). On a passing verdict the assignment completes and `verdict.signals` merge into `signals`, which is handed to the active theme's `Scene`. The returned verdict also drives the **FeedbackBanner**: `verdict.message` (a beginner-friendly hint on failure) renders in the assignment panel — deliberately separate from the terminal so students can tell classroom guidance from real program output. Feedback is replaced on each run and cleared on assignment switch. No assignment- or theme-specific logic lives in the view — see the two boundaries below.

## Boundaries (assignment ⟂ theme)

The IDE core (editor, assignment list, output) is decoupled from both *what the assignments are* and *which visual theme is shown*, so either can be added, changed, or removed without touching the views. Domain shapes (`Assignment`, `Verdict`, `ExecuteResult`, `Theme`, …) live in `src/types/`.

- **Assignment boundary — `src/types/assignment.ts` + `src/lib/assignmentSetApi.ts`.** `Assignment` is a **discriminated union on `kind`**; the stepper/progress/boundary use only the shared base fields (`id`, `title`, `description`, optional `lesson` — teaching content as `LessonBlock[]` of text/code blocks — and `hint`), and only render+grade branch on `kind`. Live assignments come from the backend (`GET /api/assignmentsets/:id/assignments`); `src/lib/assignments.ts` keeps the legacy local bundle:
  - `kind:'code'` — write & run Java; graded by `check(result)` (`result = { code, output, stderr, exitCode }` → `{ passed, signals?, message? }`; every failure path should return a beginner-friendly `message` — it renders in the FeedbackBanner). Structural code checks run on `stripCode(code)` (comments + string literals removed) so `// c2f(` can't fake a pass. Optional `stdin` (interactive, e.g. guess-the-number) and `harness` (`{ files, entryClass }` — grader code compiled with the student's `solutionFile`, used by the Day-3 `Container`/`FlightTicket` class assignments). API-served assignments carry no `check()` — grading is moving server-side.
  - `kind:'predict'` — read-only `snippet`; the student types the output. Graded by `predict.ts` against `expectedOutput` (+ `accept` for infinite-loop phrasings) through the `quizApi` seam.
  - `kind:'project'` — Day-3 mini-projects: a `brief` (shown in the assignment panel) + multi-file upload (scaffolded grading).
  Grading helpers live in `grade.ts`. A code assignment without `check` never auto-completes. `signals` is a free-form, theme-agnostic payload. `assignments.ts` also exports `defaultStarter`. See `src/lib/CLAUDE.md`.
- **Theme boundary — `src/themes/`.** A theme implements the `Theme` type (`@types`): `{ id, name, subtitle, Scene }`, where `Scene` is a React component (the right-hand panel) receiving `SceneProps` `{ signals, completedAssignments, activeAssignment }` — or `null` for no scene. It decides which `signals` keys it cares about. Swap themes by changing `ACTIVE_THEME` in `src/themes/index.ts`; `nullTheme` (the current default) runs the **plain IDE with no 3D scene at all**. The legacy café Three.js scene stays under `src/themes/cafe/` but is inactive. Add a theme by dropping a folder under `src/themes/`, exporting the `Theme` shape, and registering it in `THEMES`.

## Backend API contract

The frontend depends on these endpoints (proxied via `/api`), per `CONTRACT.md` in the api repo:

- `POST /api/execute` body `{ "code": "..." }` → `{ "status": "success" | "compile_error" | "runtime_error", "stdout": string, "stderr": string }`
- `GET /api/assignmentsets` / `GET /api/assignmentsets/:id/assignments` — assignment-set summaries + an assignment list (`assignmentSetApi.ts`)
- `POST /api/sessions`, `GET /api/sessions/:code`, `POST /api/sessions/:code/timer` — rooms + timer (`sessionApi.ts`)

**Naming:** the entity is **Assignment** everywhere — code, wire contract (URLs, `assignmentId`, `assignmentSetId`), and UI. The old "task"/"taskset" naming is fully retired on both sides (the backend renamed because of the clash with `System.Threading.Tasks.Task`); keep the seam URLs/fields in `src/lib` in lockstep with the api repo's `CONTRACT.md`.

All backend calls go through the seams in `src/lib`: **`executeApi.ts`** (run), **`submissionApi.ts`** (submit), **`sessionApi.ts`** (teacher session + timer).

**The backend may not be ready yet.** `executeApi.ts` / `submissionApi.ts` call the real endpoints and, on any failure, fall back to a **mock** (`src/lib/mockApi.ts`) that round-robins through canned success/error scenarios so every result-UI state can be previewed — it does **not** compile or run Java. The mock is designed to be deleted in one step once the backend is live: remove `mockApi.ts`, its imports, and the clearly-fenced fallback branches. Planned backend: a real dockerized Java executor (Piston), a SignalR hub for teacher→room broadcasts (e.g. a timer), and per-student progress persistence — see the api repo's `CONTRACT.md` / `STORIES.md`.

## Style — ITU

The product is styled after ITU (IT University of Copenhagen) — white volumes, glass-grey lines, near-black type, and the ITU crimson as the accent; assignments are themed around student life at ITU (Cafe Analog, ECTS points, the founding year 1999). The palette is defined as **Tailwind `@theme` tokens** in `src/index.css`:

- **Light chrome:** `canvas` (app bg) · `surface` (cards/toolbar) · `panel` (secondary bg) · `line` (borders) · `ink`/`ink-muted` (text) · `accent`/`accent-strong` (ITU red `#b01116`) · `ok`/`warn`/`error` (status).
- **Dark "glass" zone:** `terminal`/`terminal-line`/`terminal-ink`/`terminal-muted` + `term-ok`/`term-err` for the editor/output area — Monaco stays `theme="vs-dark"`, so the IDE sits like dark glass inside the white chrome. Lesson code cards in the assignment panel reuse the terminal tokens.

**Always use the tokens via utilities** (`bg-canvas`, `text-ink`, `border-line`, `bg-accent/10`) — never hardcode hex except the rare arbitrary value already in a constants file. Base font is 14px (set on `body` as an absolute size, kept off the root so Tailwind's rem spacing scale still equals the original pixels). The Toolbar brand is an ITU-style black block with a red square accent.

> **Note on `DESIGN.md`:** that file documents a *Mintlify* (light, mint-green) design system and does **not** match the app's ITU palette. Treat it as external reference material, not the spec for this app, unless the user says otherwise. Confirm intent before restyling to it.

## Conventions

- Functional components only, one per folder, **default export** (re-exported named from `index.ts`). Props destructured in the signature.
- **No semicolons**; 2-space indentation. (Monaco editor content uses `tabSize: 4` for the Java the *students* write — separate concern.)
- **No `any`, no manual casts** (`as`). Narrow with `instanceof`/`typeof`/null-checks; type constant maps as `Record<K, V>`.
- **State in hooks.** Components hold no `useState`/effects — those live in `*.hooks.ts` (component-local) or `src/hooks/` (cross-cutting). Views own logic via their hooks.
- **`classnames` for every `className`** — variant maps in `.constants.ts`, object syntax for conditionals; no ternaries/template literals for classes. No inline styles except dynamic values (e.g. progress-bar width).
- **Event handlers** are named `handle*` and passed as refs — never inline arrows in JSX.
- Style with Tailwind utilities + the `@theme` tokens. `lib/` modules are framework-agnostic (no React/JSX) with JSDoc headers.

## Roles

Two views selected by URL path in `src/main.tsx`: `/teacher` → `TeacherGate` (code-entry, `VITE_TEACHER_CODE`) → `TeacherDashboard`; anything else → `StudentView`. **No router** — just a `pathname.startsWith('/teacher')` check. Teacher auth is a sessionStorage flag (`src/lib/teacherAuth.ts`); set `VITE_TEACHER_CODE` in `.env.local` (see `.env.example`).

## Git / current state

Early-stage. `main` has only the initial scaffold commit; the actual app (components, lib, theme) is **uncommitted working-tree changes**. Expect to commit real work. POC throughout — favor simple, readable, beginner-clear solutions over premature abstraction.

## Related repos

- `api.bootIT` — ASP.NET Core (.NET 10) backend, SignalR planned, currently mocks `/api/run`.
- `bootIT slides` — the camp's teaching PDFs (bootIT-I/II/III); the source of truth for what students learn and the level to pitch assignments at.
