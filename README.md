# bootIT — frontend

Browser-based Java learning environment for a 3-day pre-master CS bootcamp. Students write and run Java directly in the browser: a Monaco editor (the engine behind VS Code), an assignment/progress sidebar, and code execution via the backend API.

This repo is the **React frontend**. The backend lives in the sibling repo [`cobblersBackend`](../cobblersBackend) (ASP.NET Core + SignalR + PostgreSQL + Piston).

## Tech stack

- React 19 + Vite 8 + TypeScript (strict)
- Tailwind CSS v4 — the whole design system is `src/index.css`
- @monaco-editor/react (code editor); three (the café 3D scene, currently switched off)
- Vitest + Testing Library

> `package.json` also carries the full shadcn/ui + Radix dependency set from an earlier
> direction. None of it is imported — components are hand-rolled and styled with
> `classnames`. See [CLAUDE.md](CLAUDE.md#stack).

## Prerequisites

- **Node.js 20.19+ or 22.12+** (Vite 8 requirement) and npm
- The **backend running locally** — see [First-time setup](#first-time-setup) step 3. There is no mock fallback any more (`mockApi.ts` was deleted in #15): without a backend the app boots to the entry screen and every data call fails visibly.

## First-time setup

Run these once after cloning:

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file (gitignored — never commit it)
cp .env.example .env.local
```

Then edit `.env.local` and set the teacher access code (any string you choose; teachers type it at `/teacher`):

```
VITE_TEACHER_CODE=your-secret-code
```

> Vite only reads env files at startup — if you change `.env.local` later, restart `npm run dev`.

```bash
# 3. Start the backend (in the sibling repo — it has its own first-time
#    setup: PostgreSQL, migrations, seed, Piston. See cobblersBackend/README.md)
cd ../cobblersBackend
dotnet run --project cobblersBackend      # serves http://localhost:5046

# 4. Start the frontend (back in this repo)
npm run dev                               # serves http://localhost:5173
```

Open http://localhost:5173 for the student IDE, or http://localhost:5173/teacher for the teacher dashboard (enter the `VITE_TEACHER_CODE` you set).

### How frontend ↔ backend are wired

The dev server **proxies** API calls, so frontend code always calls relative URLs (`/api/...`, `/hub`) and never hardcodes a port:

| Frontend path | Proxied to | What it is |
|---|---|---|
| `/api/*` | `http://localhost:5046` | REST (execute, assignment sets, sessions) |
| `/hub` | `http://localhost:5046` (WebSocket) | SignalR hub (teacher↔student rooms, timer) |

The proxy targets live in [vite.config.ts](vite.config.ts). `5046` is the backend's default `http` launch profile — if your backend runs on a different port, change the two `target` values there (and nowhere else).

### Verify it works

1. `npm run dev` and open http://localhost:5173.
2. Click **Run** on the starter code — you should see real program output in the terminal panel. Nothing at all means the backend (or Piston behind it) isn't reachable: check it's running on 5046.
3. The sidebar should list assignments loaded from `GET /api/assignmentsets` — an error there also means the backend (or its database seed) isn't up.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # preview the production build
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
npm run test       # vitest run
```

## Troubleshooting

- **Run does nothing / errors** → backend not reachable, or Piston isn't up behind it. Start the backend (`dotnet run --project cobblersBackend` in `../cobblersBackend`) and make sure it's on port 5046 (or update `vite.config.ts`).
- **Assignments don't load** → backend is up but its database is empty; run the migrations + seed script (see the backend README's first-time setup).
- **Teacher code rejected at `/teacher`** → `.env.local` missing or `VITE_TEACHER_CODE` changed without restarting the dev server.
- **`ECONNREFUSED` in the Vite terminal** → same as the first point: nothing is listening on the proxy target port.

## More docs

- [CLAUDE.md](CLAUDE.md) — architecture, conventions, project structure (the detailed developer guide)
- `../cobblersBackend/CONTRACT.md` — the frontend↔backend API contract (source of truth for endpoints)
