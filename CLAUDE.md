# CLAUDE.md — cobblersFrontend

Frontend for **bootIT**, a browser-based Java learning environment for a 3-day pre-master CS bootcamp. Students have **no prior programming experience**; the camp teaches basic OOP in Java. Keep everything beginner-friendly: gentle copy, clear errors, no jargon in user-facing text.

This repo is the React frontend. The backend lives in the sibling repo `cobblersBackend` (ASP.NET Core + SignalR + Postgres), which proxies code execution to a **Piston** container. Both are live.

## Stack

- **React 19** + **Vite 8** (ESM, `"type": "module"`)
- **TypeScript** (strict, `verbatimModuleSyntax`) — no `any`, no manual type casts anywhere
- **Tailwind CSS v4** (`@tailwindcss/vite`) — the design system lives in `src/index.css`
- **@monaco-editor/react** + **monaco-editor** — the code editor (same engine as VS Code)
- **three** — **orphaned.** The café scene it powered was deleted in #28; nothing imports it.
- **classnames** — every `className` is computed with it (no ternaries/template literals for classes)
- **framer-motion** — used in exactly one component (`SubmitButton`)
- **Vitest** + **@testing-library/react** (jsdom) — co-located `*.test.ts` files
- **ESLint 10** (flat config: `js.recommended`, `typescript-eslint`, `react-hooks`, `react-refresh`)

> **`package.json` lies about this app.** It carries ~25 `@radix-ui/*` packages plus
> `clsx`, `tailwind-merge`, `class-variance-authority`, `cmdk`, `vaul`, `sonner`,
> `lucide-react`, `recharts`, `zod`, `react-hook-form`, `react-day-picker`, `embla-carousel`,
> `input-otp`, `react-resizable-panels`, `date-fns` — the full shadcn/ui starter set. **None
> of them are imported by a single file.** There is no `components/ui/` folder and no `cn()`
> helper. Components here are hand-rolled and styled with `classnames`. Don't reach for a
> Radix primitive or a shadcn pattern because the dependency is present; match the
> surrounding code instead.

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

Run the backend separately: `dotnet run --project cobblersBackend` in the sibling repo. Vite proxies `/api/*` to it (see `vite.config.ts`), so frontend code always calls `/api/...` relatively — never hardcode the port.

## Path aliases

Defined in both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`); keep them in sync. `@/*`→`src/*`, plus `@components`, `@views`, `@hooks`, `@lib`, `@themes`, `@types`, `@constants` (each works bare or as `/*`). Import across folders via aliases, not deep relative paths.

## Project structure

```
src/
  main.tsx                  # entry; picks TeacherGate (/teacher) or StudentView, mounts in StrictMode
  index.css                 # THE design system — tokens, :root/.dark blocks, keyframes (see Style)
  vite-env.d.ts             # ImportMetaEnv (VITE_TEACHER_CODE) + vite/client types
  constants/                # palette.ts — hex+oklch mirror of the tokens, DOCUMENTATION ONLY
  types/                    # cross-cutting domain types (Assignment, ExecuteResult, …) + barrel
  components/               # PURE, reusable presentational components (visual props only)
    Button/ Spinner/ Icon/ StatusBadge/ ProgressBar/ TextField/ Modal/ IconButton/ Toast/
    CodeEditor/ CodeFileTabs/ OutputPanel/ AssignmentPanel/ AssignmentFooter/
    SubmitButton/ ShowAnswerButton/ PredictPanel/ FileUpload/ ProjectPanel/
    ProjectBrief/ ProblemsList/ SubmissionRow/ SubmissionBanner/ RunMenu/   # student side
    AppHeader/ AppFooter/ AppColophon/ PortalShell/ RoomCodeModal/         # chrome
    StudentWorkspace/       # the IDE itself — NOT pure; owns the workspace hooks (see below)
    TeacherWorkspace/ TeacherSessionCreator/ TeacherAssignmentFooter/      # teacher side
    TeacherAssignmentPanel/ TeacherProblemsList/ TeacherFollowBanner/
    AttendanceList/ StudentRoster/
    index.ts                # barrel re-exporting every component + its types
  views/                    # page-level views — OWN state/business logic via co-located hooks
    EntryPortal/            # name + join/solo entry screen; rendered BY StudentView, not by main.tsx
    StudentView/            # StudentView.tsx (entry vs workspace) + StudentView.hooks.ts
                            #   useStudentSession = join/solo/rehydrate
    TeacherGate/            # code-entry gate; useTeacherAuth
    TeacherDashboard/       # thin shell since #28 — useAssignmentData + useSessionLifecycle,
                            #   then TeacherSessionCreator or TeacherWorkspace
  hooks/                    # cross-cutting state hooks: useExecutor, useAssignments,
                            #   useSubmission, useTheme, useMenuDisclosure
  api/                      # REST + SignalR seams (moved out of lib/ in #29)
    executeApi.ts / submissionApi.ts / studentApi.ts / sessionApi.ts / assignmentSetApi.ts
    sessionHub.ts           # joinSession (student) / observeSession (teacher) / TimerStarted
  lib/                      # framework-agnostic client-side tooling — see src/lib/CLAUDE.md
    theme.ts                # light/dark preference, system lookup, applies `.dark` to <html>
    defaultStarter.ts       # fallback Java template when an assignment omits `starter`
    predict.ts              # predict-quiz comparison helper (unit-tested; NOT the runtime path)
    identity.ts / teacherAuth.ts   # anon studentId + displayName; teacher sessionStorage flag
    javaValidator.ts / javaSource.ts / javaLocalTypes.ts   # Java linting + local-type decoration
    javaCompletions.ts      # Monaco completion providers (members + snippets)
  test/setup.ts             # jest-dom matchers for Vitest
  assets/                   # images (hero.png, svgs)
```

**Gone, despite what older notes say:** `lib/mockApi.ts` (deleted in #15 — every seam now
calls the real API and a failure surfaces as a failure), `lib/assignments.ts` (the legacy
local bundle; content comes from the backend), `StudentIde.tsx` (the workspace moved into
`components/StudentWorkspace/`), and the `SubmitModal` / `StudentEntry` components
(replaced by `SubmitButton` and `EntryPortal`).

**Deleted by upstream in #29 — do not reintroduce:** `AssignmentSetPreview/` and
`TeacherCodeViewer/` (the teacher now reuses the student's `CodeFileTabs` + `CodeEditor` +
`OutputPanel`, with a new `TeacherAssignmentFooter`).

**Deleted by upstream in #28 — do not reintroduce:** `AssignmentStepper/`, `Badge/`
(superseded by `StatusBadge/`), `FeedbackBanner/`, `FileTabs/`, **all of `src/themes/`**
(the café Three.js scene, the registry, `ACTIVE_THEME`) plus `src/types/theme.ts`, and
`src/lib/grade.ts`. `Signals` / `CheckResult` / `Verdict` are gone from `src/types`.

> **The theme boundary no longer exists.** Older notes describe a pluggable `Theme` seam with
> a `Scene` component fed by `signals`. That is all deleted. `three` is still in
> `package.json` with **no importer left** — it can go whenever someone prunes deps.
>
> **Client-side grading no longer exists.** `grade.ts` and every assignment's `check()` are
> gone; the server grades and returns `passed`. `lib/predict.ts` survives as a unit-tested
> helper but is *not* on the runtime path. `FeedbackBanner` was deleted with them, since its
> only job was rendering `verdict.message`.

### Component folder layout (the strict convention)

Each shared component is a folder: `ComponentName.tsx` + `index.ts` (barrel), with `.types.ts` / `.constants.ts` / `.utils.ts` / `.hooks.ts` / `.test.ts` **only when needed**. Class strings and variant→class maps (typed as `Record<…>`, no `as`) live in `.constants.ts`; data transforms in `.utils.ts`; effects/state in `.hooks.ts`. Tests are `.test.ts` (no JSX) using `createElement` from React.

## Components vs views

- **`src/components/` = pure presentational.** Props describe **visual** state only (`isDisabled`/`isLoading`, never `isAuthenticated`); no fetching, no app state; all class computation via `classnames`; event handlers passed as named refs (`handle*`), never inline arrows in JSX.
- **`src/views/` = pages.** They own state and business logic through their co-located hooks and pass display-ready props down to components. Cross-cutting state hooks live in `src/hooks/`.

## State & data flow

**No state library, router, or context.** The student side splits across two hooks, and the
distinction matters:

- **`useStudentSession`** (`useStudentSession.ts`) — who you are and where: name, join-a-class
  vs solo, the SignalR join, rehydrating a persisted session. It decides whether
  `StudentView.tsx` renders `EntryPortal` or `StudentWorkspace`.
- **`useStudentWorkspace`** (`StudentView.hooks.ts`) — the IDE itself. Composes `useExecutor` /
  `useAssignments` / `useSubmission`, holds per-assignment `code` + feedback state, and shapes
  the props each component renders.

`StudentWorkspace` splits its own concerns across co-located hooks: `useLocalDrafts`
(per-assignment draft persistence), `useWorkspaceMode` (which files the tabs show, what the
editor holds, and whether it's read-only), `useWorkspaceProgress`, `useWorkspaceSubmit`, and
`useAssignmentData` (fetches + caches reference answers *and* submission history; owns the
per-assignment `isSolutionVisible` flag).

**Layout (`StudentWorkspace.tsx`), left to right:** a full-height `ProblemsList` rail, then a
content column holding an optional `TeacherFollowBanner` above a workspace split **4:6** —
`AssignmentPanel` (lesson blocks, description, hint, and the Submissions tab listing past
attempts as `SubmissionRow`s) against the editor column (`CodeFileTabs`, `CodeEditor`, then
`OutputPanel` or `PredictPanel`), with `AssignmentFooter` underneath carrying Submit,
mark-as-done and the reveal toggle. `ProjectPanel` replaces the terminal slot for `project`
assignments. The `bootit-grid` / `bootit-glow` decorative layers are deleted from the TSX.

### Three viewing modes, one editor

`useWorkspaceMode` collapses student / reference-solution / submission-history into one set of
props. Two things follow from that and are easy to break:

- **`isReadOnly`** is true for `predict`, for solution view, for history view, and for an empty
  `project`. `CodeFileTabs` uses it to hide Run and show a `pencilOff` "Read Only" chip instead.
- **`viewStatusLabel` + `onExitView`** are the *only* way out of both non-student modes —
  "Viewing reference solution" exits via `hideSolution`, "Viewing historical submission from
  &lt;date&gt;" via `onExitHistoryView`. Switching assignments also clears both. Anything that
  relocates or restyles that control has to keep both exits reachable.

Run flow: Run → `executor.run(code)` → `executeCode(code)` (`@/api/executeApi`) → `POST /api/execute` → `{ status, stdout, stderr }` → terminal shows `stdout` (falls back to `stderr`, then `"(no output)"`). **Running does not grade.** Grading happens only on Submit, server-side: `POST /api/assignments/{id}/submissions` returns `passed`, which drives the assignment's status in `ProblemsList` and the `StatusBadge` on each `SubmissionRow`.

## Boundary (assignment)

The IDE core (editor, assignment list, output) is decoupled from *what the assignments are*, so content can be added or changed without touching the views. Domain shapes (`Assignment`, `ExecuteResult`, `SubmissionDetails`, …) live in `src/types/`.

- **Assignment boundary — `src/types/assignment.ts` + `src/api/assignmentSetApi.ts`.** `Assignment` is a **discriminated union on `kind`**; shared code uses only the base fields (`id`, `title`, `description`, optional `lesson` — teaching content as `LessonBlock[]` of text/code blocks — and `hint`), and only rendering branches on `kind`. Assignments come from the backend only (`GET /api/assignmentsets/:id/assignments`); the old local `src/lib/assignments.ts` bundle is deleted:
  - `kind:'code'` — write & run Java. Optional `stdin` (interactive, e.g. guess-the-number) and `starterFiles` + `entryClass` — multiple editable files rendered as tabs (`CodeFileTabs`, above the `CodeEditor`) for the Day-3 class-authoring assignments (`person-class`, `container-class`, `flight-ticket-class`: a driver `Main.java` + a stubbed class file, e.g. `Person.java`). File names are fixed — students only edit contents, never rename tabs. `useWorkspaceMode` enforces this: an edit that declares a class name not matching the tab's filename is **silently discarded**. Run sends `{ files, entryClass }`; submit sends `content` as a `{ name, content }[]` matching every tab (see `submissionApi.ts`).
  - `kind:'predict'` — read-only `snippet`; the student types the output. Submit answer → `POST /api/assignments/{id}/submissions` (`submissionApi`); server grades from `GradingJson` `{ predict: { compare, expectedOutput, accept? } }`. `content.expectedOutput` is still sent for the post-submit reveal UI. Client `predict.ts` remains as a unit-tested helper, not the runtime path.
  - `kind:'project'` — Day-3 mini-projects: a `brief` (shown in the assignment panel) + multi-file upload (scaffolded grading).
  The editor fallback template is `defaultStarter.ts`. See `src/lib/CLAUDE.md`.

## Backend API contract

The frontend depends on these endpoints (proxied via `/api`), per `CONTRACT.md` in the api repo:

- `POST /api/execute` body `{ "code": "..." }` → `{ "status": "success" | "compile_error" | "runtime_error", "stdout": string, "stderr": string }`
- `GET /api/assignmentsets` / `GET /api/assignmentsets/:id/assignments` — assignment-set summaries + an assignment list (`assignmentSetApi.ts`)
- `POST /api/assignments/:id/submissions` body `{ studentId, sessionId?, content }` — `content` is a Java source string for single-file `code`/`predict`, or a `{ name, content }[]` file list (one per tab) for multi-file `code` assignments (`starterFiles`) → `{ subId, passed, result, submittedAt }` (`submissionApi.ts`)
- `POST /api/sessions`, `GET /api/sessions/:code`, `GET /api/sessions/today-latest`, `POST /api/sessions/:code/timer`, `POST /api/sessions/:code/end` — rooms + timer (`sessionApi.ts`)
- `PUT /api/students/:studentId` (register a display name — **required before any submission**) and `GET /api/students/:studentId/submissions` (thin own-history list) — `studentApi.ts` / `submissionApi.ts`

**Built on the backend but not yet called from here** — all of S10's teacher-dashboard data:
`GET /api/sessions/:code/attendance` (the ever-joined roll), `GET /api/sessions/:code/submissions`
(every thin attempt in the room), `GET /api/submissions/:subId` (one attempt's code + result),
`GET /api/assignments/:id/solution` (reference answer; the reveal gate is *ours*, the backend
hands it over unconditionally), and the `SubmissionRecorded` SignalR event. Wiring these into
the dashboard is the open frontend work.

Session lookups treat an **ended** room as not-found (404) — `GET /api/sessions/:code`,
`/attendance`, `/submissions` and `/timer` all do. The student/history endpoints keep serving
that room's rows.

**Naming:** the entity is **Assignment** everywhere — code, wire contract (URLs, `assignmentId`, `assignmentSetId`), and UI. The old "task"/"taskset" naming is fully retired on both sides (the backend renamed because of the clash with `System.Threading.Tasks.Task`); keep the seam URLs/fields in `src/lib` in lockstep with the api repo's `CONTRACT.md`.

All backend calls go through the seams in `src/lib`: **`executeApi.ts`** (run), **`submissionApi.ts`** (submit), **`sessionApi.ts`** (teacher session + timer).

**The backend is live and the mock is gone.** `src/lib/mockApi.ts` and its fenced fallback
branches were deleted in #15 — every seam calls the real API and a failure surfaces as a
failure. Piston executes Java for real, the SignalR hub carries roster/timer/focus broadcasts,
and submissions persist per student.

Two seams still degrade deliberately rather than throwing, and this is by design, not
leftover mock behaviour: `fetchSubmissionHistory` resolves to an empty result and
`fetchTodayLatestSession` resolves to `null` on any failure, because "no history yet" and
"no session today" are ordinary states the UI must render calmly.

## Style — the design system

> **The ITU restyle is merged** (#30) and is the app's look: white, flat, squared,
> dense, after itustudent.itu.dk. A dark theme now sits alongside it — see
> "Two themes" below. Nothing about the light theme is provisional any more.

**`src/index.css` (334 lines) is the entire design system.** Nothing else defines a colour.
It was rebuilt in #21/#22 into a shadcn-style token set; the old `canvas`/`surface`/`panel`/
`line`/`ink`/`accent-strong` names and the ITU crimson `#b01116` are **gone**.

### How a colour reaches the screen

1. **`:root` (line ~79) and `.dark` (line ~139)** declare the same variable names with light
   and dark values, all in `oklch(L C H)`.
2. **`@theme inline`** (top of the file) maps each `--x` to a Tailwind utility: `--background`
   → `bg-background`, `--foreground` → `text-foreground`, `--border` → `border-border`.
   A token not registered there generates no utility.
3. **`*.constants.ts`** holds every class string in the app.
4. **`.tsx`** is structure only.

So: *to restyle anything, find its component folder and open the `.constants.ts` — not the
`.tsx`.* To change a colour globally, edit `index.css`.

**Token families:** `background`/`foreground`, `card`, `popover`, `primary` (CTA blue
`#427BAB`), `secondary`, `muted`, `accent` (purple `#5C2482`), `destructive`, `border`,
`input`, `ring`, `chart-1..5`, `sidebar-*`, plus two BootIT-specific groups —
`terminal`/`terminal-line`/`terminal-ink`/`terminal-muted`/`term-ok`/`term-err`, and
`status-{success,error,warning}` each with `-bg`/`-text` variants.

### Two themes

`@custom-variant dark (&:is(.dark *))` styles **descendants** of an element
carrying the class `dark`, so the flag has to sit above everything the app
renders. `src/lib/theme.ts` puts it on `<html>` and is the only place that
writes it. Putting it on a view root — as this app once did — leaves anything
portalled outside that root (a Modal, a Monaco overlay) stranded in light.

- **`src/lib/theme.ts`** — preference storage (`bootit.theme`), system-preference
  lookup, and `applyTheme`. `'system'` is the default and is stored as *absence*
  of the key, so it can't be confused with a stale explicit choice.
- **`useTheme()`** (`src/hooks/useTheme.ts`) — returns `{ theme, preference,
  setPreference }`. `theme` is the *resolved* value and is derived, not stored;
  holding it in state would mean setting state from an effect on every change.
- **`main.tsx`** applies the theme *before* React mounts. After mounting, the
  first paint is light and then snaps.

There is deliberately **no toggle UI yet** — placement is waiting on user
stories. Until then the app follows the OS and reacts live to it, so switching
system appearance is enough to see both themes.

### The wash scale

The `--wash-*` tokens are translucent neutral over whatever surface is beneath:
black in `:root`, white in `.dark`. Every `bg-black/N` literal in the app maps to
one, because a literal cannot invert — and `bg-black/6` on a near-black canvas
is invisible. **That exact bug has shipped here twice**: submission rows that
looked unclickable, and an untried badge that rendered as nothing. If you need a
translucent fill, take a wash token; don't write the literal.

`--scrim` is the exception that stays dark in both — it's shadow, not surface.

### Brand chrome does not invert

`--brand-surface` / `--brand-surface-hover` / `--brand-ink` are declared in
`:root` and **deliberately absent from `.dark`**, which is what pins them. They
carry everything that is black-on-white by identity rather than by theme:

- `AppHeader` — the band, the `ITU | BootIT` lockup, the chips, the section
  label and the action hover
- `AppFooter` — the "IT University of Copenhagen" mark and its address line
- `AppColophon` — the whole credit band
- `RunMenu` — the split control and its dropdown
- `SubmitButton` — it fills the same slot in the editor rail that `RunMenu`
  does on `code` assignments, so the two kinds must not disagree

`APP_HEADER_BAR_CLASS` (`bg-black/70`) and `APP_FOOTER_CLASS` (`bg-black/80`)
stay literal for the same reason: both are translucent over a fixed-dark band.

Reach for `--brand-*` — not `--foreground` / `--background` / `--primary` —
whenever a surface has to look identical in both themes.

### Things the tokens do NOT control

- **Monaco.** `EDITOR_THEME` in `CodeEditor.constants.ts` maps the app's two themes onto
  Monaco's own built-ins (`vs` / `vs-dark`). These are theme *names*, not CSS — a `.dark`
  class on `<html>` cannot reach inside the editor, so `CodeEditor` reads `useTheme()` and
  passes the right one. The same applies to `.java-local-type`, which has a light and a
  dark rule in `index.css`.
- **The terminal/output slab.** `--terminal*` now differs per theme: white in light,
  `#121314` in dark — VS Code Dark 2026 makes the editor the *darkest* surface, with the
  chrome above it, which is the opposite of most dark UIs and is what puts the code first.
- **The entry-page effects** (`.bootit-grid`, `.bootit-title`, `.bootit-glow`,
  `.bootit-scanline`, `.bootit-caret`, `.bootit-teacher-glow`, ~lines 210–300). These assume a
  dark canvas — white-alpha grid lines and a white→accent→white text gradient. On a light
  background they don't merely look wrong, they become invisible.
- **`--radius: 0.5rem`** (line ~80) feeds every `radius-sm|md|lg|xl|2xl|3xl|4xl`. Setting it
  to `0` squares off the entire app in one line.

### Two traps

- **`src/constants/palette.ts`** restates the same colours as hex *and* oklch, is exported from
  a barrel, and is imported by **no component**. It's documentation, and a second source of
  truth that can silently drift. Edit `index.css`; treat `palette.ts` as a comment.
- **`DESIGN.md` (852 lines) documents a *Mintlify* mint-green system this app does not use.**
  Not the spec. Confirm intent before taking anything from it.

**Always use tokens via utilities** (`bg-background`, `text-foreground`, `border-border`) —
never hardcode hex outside `index.css`. No inline styles except genuinely dynamic values
(e.g. a progress-bar width).

## Conventions

- Functional components only, one per folder, **default export** (re-exported named from `index.ts`). Props destructured in the signature.
- **No semicolons**; 2-space indentation. (Monaco editor content uses `tabSize: 4` for the Java the *students* write — separate concern.)
- **No `any`, no manual casts** (`as`). Narrow with `instanceof`/`typeof`/null-checks; type constant maps as `Record<K, V>`.
- **State in hooks.** Components hold no `useState`/effects — those live in `*.hooks.ts` (component-local) or `src/hooks/` (cross-cutting). Views own logic via their hooks.
- **`classnames` for every `className`** — variant maps in `.constants.ts`, object syntax for conditionals; no ternaries/template literals for classes. No inline styles except dynamic values (e.g. progress-bar width).
- **Event handlers** are named `handle*` and passed as refs — never inline arrows in JSX.
- Style with Tailwind utilities + the `@theme` tokens. `lib/` modules are framework-agnostic (no React/JSX) with JSDoc headers.

## Roles

Two views selected by URL path in `src/main.tsx`: `/teacher` → `TeacherGate` (code-entry, `VITE_TEACHER_CODE`) → `TeacherDashboard`; anything else → `StudentView`, which itself renders `EntryPortal` until a session is chosen and `StudentWorkspace` after. **No router** — just a `pathname.startsWith('/teacher')` check. Teacher auth is a sessionStorage flag (`src/lib/teacherAuth.ts`); set `VITE_TEACHER_CODE` in `.env.local` (see `.env.example`).

## Git / current state

The app is committed and shipping. `main` deploys to `cobblerscoders.tech` on every push via `.github/workflows/deploy.yml` (test → build image → push to GHCR → SSH redeploy). Work on branches, PR into `main`. POC throughout — favor simple, readable, beginner-clear solutions over premature abstraction.

`VITE_TEACHER_CODE` is inlined by Vite at **build** time, so it must be passed as a Docker `build-arg` in the deploy workflow, not just set in `.env.local` — otherwise the shipped bundle compares the entered code against `undefined` and the teacher gate can never open (this was a real bug, fixed in #23/#24). Obfuscation, not a secret: the value is readable in the bundle.

## Related repos

- `cobblersBackend` — ASP.NET Core (.NET 10) backend: Piston proxy, SignalR hub, EF Core + Postgres. `CONTRACT.md` there is the source of truth for the wire format.
- `cobblersDevOps` — Docker Compose, nginx, Postgres, Prometheus + Grafana across two VMs.
- `bootIT slides` — the camp's teaching PDFs (bootIT-I/II/III); the source of truth for what students learn and the level to pitch assignments at.
