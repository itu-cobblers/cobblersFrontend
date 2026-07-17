# CLAUDE.md — src/lib (client-side tooling)

Framework-agnostic **TypeScript** that powers the in-browser Java experience and the API seams. **No React, no JSX here** — these modules take a `monaco` instance (typed `typeof import('monaco-editor')`) or plain data and return data. No `any`, no manual casts. Each file has a JSDoc header; keep it updated. Domain types come from `@types` (`src/types/`).

## Files

- **`assignments.ts`** — `export const ASSIGNMENTS: Assignment[]`, the legacy local bundle (live data comes from `assignmentSetApi.ts`), plus `export const defaultStarter`. `id` is the array index — keep them sequential from 0. **Passing criteria are self-contained per assignment** via `check(result)` (the "assignment boundary"): `result = { code, output, stderr, exitCode }`, return a `Verdict` `{ passed, signals?, message? }`. `useAssignments` calls the active assignment's `check(...)` generically and never hardcodes assignment logic. `signals` is a free-form, **theme-agnostic** bag broadcast on success (e.g. `{ cafeName }`). An assignment with no `check` simply never auto-completes (true of all API-served assignments — grading is moving server-side).
- **`assignmentSet.ts`** — `groupAssignments(assignments, label)` shapes an assignment set's list into the one labelled group the sidebar/preview render.
- **`javaValidator.ts`** — heuristic linter. `validateJava(code, monaco)` returns `editor.IMarkerData[]`; `attachValidator(editor, monaco)` wires it to run on mount + debounced on every edit. Called from `useCodeEditorSetup` (the editor's `onMount`).
- **`javaCompletions.ts`** — `registerJavaCompletions(monaco)` registers two completion providers. Called from `useCodeEditorSetup` (the editor's `beforeMount`).
- **API seams** — `executeApi.ts` (run), `submissionApi.ts` (submit), `sessionApi.ts` (session/room/timer), `assignmentSetApi.ts` (assignment sets), `quizApi.ts` (predict answers), with `mockApi.ts` as the deletable fallback. Plus `identity.ts` (anon student id) and `teacherAuth.ts` (sessionStorage flag). ⚠️ The wire contract still says "task"/"taskset" (URLs, `taskId`, `tasksetId`) — translate to Assignment naming only inside these seams.

## The validator is intentionally heuristic

It does **not** parse Java — it does line-by-line string scanning to catch the handful of mistakes absolute beginners make: missing semicolons, unbalanced `{}`, unbalanced `(`, and unterminated string literals. This is a teaching aid, not a compiler.

Guiding rules when editing:

- **Optimize for zero false positives over completeness.** A wrong red squiggle confuses a first-time programmer more than a missed error helps. Note it already refuses to flag stray `)` for this reason.
- Semicolon logic lives in `lineNeedsSemicolon` / `SKIP_PATTERNS` / `TRAILING_OK` / `isDeclarationLine`. These are deliberately conservative — extend the skip lists rather than making the rule aggressive.
- Brace/paren/string scanning skips characters inside string and char literals. Preserve that when touching the scan loop.
- Real syntax/compile errors are the backend's job (eventually). Don't try to reimplement a parser here.

## The completion providers

`registerJavaCompletions` registers:

1. **Dot-triggered** (`triggerCharacters: ['.']`): extracts the identifier chain before the dot and looks it up in `CHAIN_MAP` to return member completions. Keyed by exact name (`System`, `System.out`, `Math`, `Arrays`, `String`, `Integer`…) and by **lowercased common variable names** as type heuristics (`s`/`str`/`name` → String methods, `list`/`nums` → List, `map`/`hm` → Map, `sb` → StringBuilder, `sc` → Scanner…).
2. **Word-triggered**: returns top-level snippets (`sout`, `psvm`, `fori`, `foreach`, `while`, `try`, `Scanner`, `ArrayList`…).

Conventions:

- Build items with the `M` (method), `F` (field), `S` (snippet) helper factories — don't construct raw completion objects inline. They set `kind`, `insertTextRules` (snippet), and `sortText: '0'+label` to sort custom items above Monaco defaults.
- Snippet `insertText` uses Monaco placeholder syntax (`${1:x}`, `$2`). Match the existing alignment/columnar formatting in the tables for readability.
- To support a new type: add a `xxxCompletions(m)` table and register it in `CHAIN_MAP` (add lowercase variable-name aliases beginners are likely to use).
- Scope is the standard-library surface a beginner touches. Don't add exotic APIs the camp doesn't teach — check `bootIT slides` for the actual curriculum level.
