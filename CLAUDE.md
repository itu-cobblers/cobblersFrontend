# CLAUDE.md — cobblersFrontend

Frontend for **bootIT**, a browser-based Java learning environment for a 3-day pre-master CS bootcamp. Students have **no prior programming experience**; the camp teaches basic OOP in Java. Keep everything beginner-friendly: gentle copy, clear errors, no jargon in user-facing text.

This repo is the React frontend. The backend lives in the sibling repo `cobblersBackend` (ASP.NET Core + SignalR + Postgres), which proxies code execution to a **Piston** container. Both are live.

## Stack

- **React 19** + **Vite 8** (ESM, `"type": "module"`)
- **TypeScript** (strict, `verbatimModuleSyntax`) — no `any`, no manual type casts anywhere
- **Tailwind CSS v4** (`@tailwindcss/vite`) — the design system lives in `src/index.css`
- **@monaco-editor/react** + **monaco-editor** — the code editor (same engine as VS Code)
- **three** — the café 3D scene (3 files, currently **inactive**; see Theme boundary)
- **classnames** — every `className` is computed with it (no ternaries/template literals for classes)
- **framer-motion** — used in exactly one component (`SubmitButton`)
- **Vitest** + **@testing-library/react** (jsdom) — 29 co-located `*.test.ts` files
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
  types/                    # cross-cutting domain types (Assignment, ExecuteResult, Theme, …) + barrel
  components/               # PURE, reusable presentational components (visual props only)
    Button/ Spinner/ Icon/ Badge/ ProgressBar/ TextField/ Modal/ IconButton/ Toast/
    CodeEditor/ Toolbar/ FileTabs/ OutputPanel/ AssignmentPanel/ AssignmentStepper/
    FeedbackBanner/ SubmitButton/ ShowAnswerButton/ PredictPanel/ FileUpload/ ProjectPanel/
    ProjectBrief/ ProblemsList/ AssignmentSetPreview/      # student side
    StudentWorkspace/       # the IDE itself — NOT pure; owns the workspace hooks (see below)
    TeacherAssignmentPanel/ TeacherProblemsList/ TeacherCodeViewer/ TeacherFollowBanner/
    AttendanceList/ StudentRoster/                         # teacher side
    index.ts                # barrel re-exporting every component + its types
  views/                    # page-level views — OWN state/business logic via co-located hooks
    EntryPortal/            # name + join/solo entry screen; rendered BY StudentView, not by main.tsx
    StudentView/            # StudentView.tsx (entry vs workspace) + StudentView.hooks.ts
                            #   useStudentSession = join/solo/rehydrate
    TeacherGate/            # code-entry gate; useTeacherAuth
    TeacherDashboard/       # session + timer + roster; useTeacherSession
  hooks/                    # cross-cutting state hooks: useExecutor, useAssignments, useSubmission
  themes/                   # pluggable visual skins — the THEME BOUNDARY
    index.ts                # registry + ACTIVE_THEME (= nullTheme) + nullTheme
    cafe/                   # CafeScene.tsx + useCafeScene (Three.js) — inactive
  lib/                      # framework-agnostic client-side tooling — see src/lib/CLAUDE.md
    assignmentSet.ts        # groups an assignment set's list for the teacher preview
    defaultStarter.ts       # fallback Java template when an assignment omits `starter`
    grade.ts / predict.ts   # stdout grading helpers + predict-quiz grading (helpers, not the runtime path)
    executeApi.ts / submissionApi.ts / studentApi.ts / sessionApi.ts / assignmentSetApi.ts   # REST seams
    sessionHub.ts           # SignalR seam: joinSession (student) / observeSession (teacher) / TimerStarted
    identity.ts / teacherAuth.ts   # anon studentId + displayName; teacher sessionStorage flag
    javaValidator.ts        # heuristic Java linter → Monaco markers
    javaCompletions.ts      # Monaco completion providers (members + snippets)
  test/setup.ts             # jest-dom matchers for Vitest
  assets/                   # images (hero.png, svgs)
```

**Gone, despite what older notes say:** `lib/mockApi.ts` (deleted in #15 — every seam now
calls the real API and a failure surfaces as a failure), `lib/assignments.ts` (the legacy
local bundle; content comes from the backend), `StudentIde.tsx` (the workspace moved into
`components/StudentWorkspace/`), and the `SubmitModal` / `StudentEntry` components
(replaced by `SubmitButton` and `EntryPortal`).

**`AssignmentFooter/` was deleted on `design-ITU-style`.** It used to sit under every panel
carrying Submit, mark-as-done and reveal-answer. Submit + mark-as-done moved up into
`Toolbar`; the reveal toggle moved into `AssignmentPanel` under the hint. Note `Toolbar` is
a *different* component from the long-dead original of that name — it's `CodeFileTabs`
renamed, since it now carries the actions as well as the tabs.

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

`StudentWorkspace` splits its own concerns across four co-located hooks:
`useLocalDrafts` (per-assignment draft persistence), `useWorkspaceMode` (which files the tabs
show, what the editor holds, and whether it's read-only), `useWorkspaceProgress`, and
`useWorkspaceSubmit`. `useAssignmentSolutions` fetches + caches reference answers and owns the
per-assignment `isSolutionVisible` flag.

**Layout (`StudentWorkspace.tsx`), left to right:** a full-height `ProblemsList` rail, then a
content column holding an optional `TeacherFollowBanner` above a workspace split **4:6** —
`AssignmentPanel` (lesson blocks, description, hint, the reveal-answer toggle, pinned
`FeedbackBanner`) against the editor column (`Toolbar`, `CodeEditor`, then `OutputPanel` or
`PredictPanel`). `ProjectPanel` replaces the terminal slot for `project` assignments. The
`bootit-grid` / `bootit-glow` decorative layers are deleted from the TSX.

**`Toolbar` renders for every assignment kind** — tabs on the left, actions on the right. Run
appears only for `kind:'code'`; Submit always does. While a reference answer is open, Submit
rebinds to "Mark As Done" (`onMarkAsDone`) and reuses its own status animation. Its `files` /
`activeIndex` / `onSelectFile` / `onRun` props are all optional, so `predict` and `project`
render Submit alone.

Run flow: Run → `executor.run(code)` → `executeCode(code)` (`@lib/executeApi`) → `POST /api/execute` → `{ status, stdout, stderr }` → terminal shows `stdout` (falls back to `stderr`, then `"(no output)"`). Then it grades **generically** via the active assignment's `check({ code, output, stderr, exitCode })` (contract mapped: `stdout`→`output`, `status`→`exitCode`). On a passing verdict the assignment completes and `verdict.signals` merge into `signals`, which is handed to the active theme's `Scene`. The returned verdict also drives the **FeedbackBanner**: `verdict.message` (a beginner-friendly hint on failure) renders in the assignment panel — deliberately separate from the terminal so students can tell classroom guidance from real program output. Feedback is replaced on each run and cleared on assignment switch. No assignment- or theme-specific logic lives in the view — see the two boundaries below.

## Boundaries (assignment ⟂ theme)

The IDE core (editor, assignment list, output) is decoupled from both *what the assignments are* and *which visual theme is shown*, so either can be added, changed, or removed without touching the views. Domain shapes (`Assignment`, `Verdict`, `ExecuteResult`, `Theme`, …) live in `src/types/`.

- **Assignment boundary — `src/types/assignment.ts` + `src/lib/assignmentSetApi.ts`.** `Assignment` is a **discriminated union on `kind`**; the stepper/progress/boundary use only the shared base fields (`id`, `title`, `description`, optional `lesson` — teaching content as `LessonBlock[]` of text/code blocks — and `hint`), and only render+grade branch on `kind`. Assignments come from the backend only (`GET /api/assignmentsets/:id/assignments`) — the old local `src/lib/assignments.ts` bundle is deleted:
  - `kind:'code'` — write & run Java; graded by `check(result)` (`result = { code, output, stderr, exitCode }` → `{ passed, signals?, message? }`; every failure path should return a beginner-friendly `message` — it renders in the FeedbackBanner). Structural code checks run on `stripCode(code)` (comments + string literals removed) so `// c2f(` can't fake a pass. Optional `stdin` (interactive, e.g. guess-the-number) and `starterFiles` + `entryClass` — multiple editable files rendered as tabs (`FileTabs`, above the `CodeEditor`) for the Day-3 class-authoring assignments (`person-class`, `container-class`, `flight-ticket-class`: a driver `Main.java` + a stubbed class file, e.g. `Person.java`). File names are fixed — students only edit contents, never rename tabs. Run sends `{ files, entryClass }`; submit sends `content` as a `{ name, content }[]` matching every tab (see `submissionApi.ts`). API-served assignments carry no `check()` — grading is moving server-side.
  - `kind:'predict'` — read-only `snippet`; the student types the output. Submit answer → `POST /api/assignments/{id}/submissions` (`submissionApi`); server grades from `GradingJson` `{ predict: { compare, expectedOutput, accept? } }`. `content.expectedOutput` is still sent for the post-submit reveal UI. Client `predict.ts` remains as a unit-tested helper, not the runtime path.
  - `kind:'project'` — Day-3 mini-projects: a `brief` (shown in the assignment panel) + multi-file upload (scaffolded grading).
  Grading helpers live in `grade.ts`; the editor fallback template is `defaultStarter.ts`. `signals` is a free-form, theme-agnostic payload. See `src/lib/CLAUDE.md`.
- **Theme boundary — `src/themes/`.** A theme implements the `Theme` type (`@types`): `{ id, name, subtitle, Scene }`, where `Scene` is a React component (the right-hand panel) receiving `SceneProps` `{ signals, completedAssignments, activeAssignment }` — or `null` for no scene. It decides which `signals` keys it cares about. Swap themes by changing `ACTIVE_THEME` in `src/themes/index.ts`; `nullTheme` (the current default) runs the **plain IDE with no 3D scene at all**. The legacy café Three.js scene stays under `src/themes/cafe/` but is inactive. Add a theme by dropping a folder under `src/themes/`, exporting the `Theme` shape, and registering it in `THEMES`.

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

> **In flux (branch `design-ITU-style`).** The app is being restyled from the dark
> purple/violet look to a reduced, technical, ITU-like light one. Already done: the whole
> app runs light (the hardcoded `dark` class is gone from every view root), `--foreground`
> / `--border` / `--input` / `--ring` / `--primary` are black, `--terminal` is white, all
> shadows and `backdrop-blur` are removed, every `bg-card/NN` translucency is flat
> `bg-card`, and all the `bootit-*` decorative layers (grid, glow, scanline, title
> gradient, fake caret, teacher pulse) are deleted from the TSX. The editor toolbar's Run
> and Submit buttons were matched to each other by hand — both `h-[29px]`, `text-xs
> font-medium`, `gap-1.5` — so `SUBMIT_BUTTON_CLASS` no longer derives its type scale from
> `TYPOGRAPHY_LEVELS`. Still to do: fold the raw `bg-black/NN` values into semantic tokens,
> decide on `--radius`, and restyle whatever arrives from upstream unstyled.
>
> **`TYPOGRAPHY_LEVELS` (in `palette.ts`) now has zero consumers app-wide.** `SubmitButton`
> was its last one. Worth knowing before the next upstream merge: upstream's new
> `Button.constants.ts` reintroduces it as `BUTTON_BASE_TYPOGRAPHY` *alongside* a literal
> `text-[13px]` in `BUTTON_BASE_CLASS` — two competing font-size utilities on one element.

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

### There is no dark-mode toggle — and the `.dark` block is currently unreachable

`@custom-variant dark (&:is(.dark *))` means the dark values apply to anything inside an
element carrying the literal class `dark`. There is no toggle: that word used to be baked
into all four view root class strings (`EntryPortal`, `StudentView` ×2, `TeacherDashboard`,
`TeacherGate`), which is the only reason the app rendered dark while `:root` was pure white.

**Those have been removed on `design-ITU-style`, so the whole `.dark` block (~35 lines) is
now dead code.** It's deliberately left in place rather than deleted: `upstream/main` still
ships those `dark` classes, so it will come back in the next merge and has to be resolved
per-file. Decide its fate *after* that merge — either delete it, or keep it as the seed for
a real theme toggle.

### Things the tokens do NOT control

- **Monaco.** `EDITOR_THEME = 'vs-dark'` in `CodeEditor.constants.ts` — a Monaco theme name,
  not CSS. The code pane ignores the token system entirely.
- **The terminal/output slab.** `--terminal*` is deliberately *identical* in `:root` and
  `.dark`, so that zone stays dark in light mode by design.
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
