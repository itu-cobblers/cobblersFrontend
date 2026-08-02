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
    ProjectBrief/ ProblemsList/ SubmissionRow/ AssignmentSetPreview/       # student side
    StudentWorkspace/       # the IDE itself — NOT pure; owns the workspace hooks (see below)
    TeacherWorkspace/ TeacherSessionCreator/                # teacher side, post-#28
    TeacherAssignmentPanel/ TeacherProblemsList/ TeacherCodeViewer/ TeacherFollowBanner/
    AttendanceList/ StudentRoster/
    index.ts                # barrel re-exporting every component + its types
  views/                    # page-level views — OWN state/business logic via co-located hooks
    EntryPortal/            # name + join/solo entry screen; rendered BY StudentView, not by main.tsx
    StudentView/            # StudentView.tsx (entry vs workspace) + StudentView.hooks.ts
                            #   useStudentSession = join/solo/rehydrate
    TeacherGate/            # code-entry gate; useTeacherAuth
    TeacherDashboard/       # thin shell since #28 — useAssignmentData + useSessionLifecycle,
                            #   then TeacherSessionCreator or TeacherWorkspace
  hooks/                    # cross-cutting state hooks: useExecutor, useAssignments, useSubmission
  lib/                      # framework-agnostic client-side tooling — see src/lib/CLAUDE.md
    assignmentSet.ts        # groups an assignment set's list for the teacher preview
    defaultStarter.ts       # fallback Java template when an assignment omits `starter`
    predict.ts              # predict-quiz comparison helper (unit-tested; NOT the runtime path)
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

Run flow: Run → `executor.run(code)` → `executeCode(code)` (`@lib/executeApi`) → `POST /api/execute` → `{ status, stdout, stderr }` → terminal shows `stdout` (falls back to `stderr`, then `"(no output)"`). **Running does not grade.** Grading happens only on Submit, server-side: `POST /api/assignments/{id}/submissions` returns `passed`, which drives the assignment's status in `ProblemsList` and the `StatusBadge` on each `SubmissionRow`.

## Boundary (assignment)

The IDE core (editor, assignment list, output) is decoupled from *what the assignments are*, so content can be added or changed without touching the views. Domain shapes (`Assignment`, `ExecuteResult`, `SubmissionDetails`, …) live in `src/types/`.

- **Assignment boundary — `src/types/assignment.ts` + `src/lib/assignmentSetApi.ts`.** `Assignment` is a **discriminated union on `kind`**; shared code uses only the base fields (`id`, `title`, `description`, optional `lesson` — teaching content as `LessonBlock[]` of text/code blocks — and `hint`), and only rendering branches on `kind`. Assignments come from the backend only (`GET /api/assignmentsets/:id/assignments`); the old local `src/lib/assignments.ts` bundle is deleted:
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

> **In flux (branch `design-ITU-style`).** The app is being restyled from the dark
> purple/violet look to a reduced, technical, ITU-like light one. Already done: the whole
> app runs light (the hardcoded `dark` class is gone from every view root), `--foreground`
> / `--border` / `--input` / `--ring` / `--primary` are black, `--terminal` is white, all
> shadows and `backdrop-blur` are removed, every `bg-card/NN` translucency is flat
> `bg-card`, and all the `bootit-*` decorative layers (grid, glow, scanline, title
> gradient, fake caret, teacher pulse) are deleted from the TSX. Still to do: fold the raw
> `bg-black/NN` values into semantic tokens, decide on `--radius`, and restyle whatever
> arrives from upstream unstyled.
>
> **Reverted, to be redone:** commit `31dac15` moved Submit up beside Run in the toolbar,
> moved the reveal toggle into `AssignmentPanel`, and deleted `AssignmentFooter`. It was
> reverted before merging #28 (which reworked both of those components and added history
> view) and is to be reapplied on top once history view's behaviour is understood. The
> hand-matched Submit scale (`h-[29px] text-xs font-medium gap-1.5`, replacing the
> `TYPOGRAPHY_LEVELS` interpolation) went with it — it lives in `cbd0455`.
>
> **Upstream's new `Button.constants.ts` is built on tokens this app doesn't have.**
> `BUTTON_VARIANT_CLASS` uses `bg-action`, `bg-action-strong`, `text-ink-muted`, `text-ink`
> and `border-line` — pre-#21 names, absent from `index.css`, so those utilities generate
> nothing and the `primary`/`ghost` variants render unstyled. It also stacks a literal
> `text-[13px]` in `BUTTON_BASE_CLASS` against `BUTTON_BASE_TYPOGRAPHY`
> (= `TYPOGRAPHY_LEVELS.bodyStrong` = `text-sm`) — two font sizes on one element.
> `SUBMIT_BUTTON_CLASS` imports that base, so both problems reach the Submit button.

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
now dead code.** It's deliberately left in place rather than deleted.

Note this is a **recurring merge chore, not a one-off**: `upstream/main` still ships the
literal `dark` class on its view roots, so every upstream merge reintroduces it. It came back
in #28 on `STUDENT_WORKSPACE_LAYOUT_CLASS` and `TEACHER_LAYOUT_CLASS` (along with the
`bootit-grid` / `bootit-glow` layers) and was stripped again by hand. After any merge, sweep
with `grep -rn "bootit-\|'dark " src` before trusting the result.

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
