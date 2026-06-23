# CLAUDE.md — src/lib (client-side Java tooling)

Framework-agnostic vanilla JS that powers the in-browser Java experience. **No React, no JSX here** — these modules take a `monaco` instance (or plain strings) and return data. Each file has a JSDoc header; keep it updated.

## Files

- **`tasks.js`** — `export const TASKS`, the single source of truth for the sidebar, plus `export const defaultStarter`. Each task: `{ id, title, difficulty: 'Easy'|'Medium'|'Hard', description, hint?, starter?, check? }`. `id` is the array index and is used directly as `activeTask`/`completedTasks` keys in `App.jsx` — keep them sequential from 0. **Passing criteria are self-contained per task** via `check(result)` (the "task boundary"): `result = { code, output, stderr, exitCode }`, return a verdict `{ passed, signals?, message? }`. `App.jsx` calls `TASKS[activeTask].check(...)` generically and never hardcodes task logic — to add a task or change grading, edit only this file. `signals` is a free-form, **theme-agnostic** bag broadcast on success (e.g. `{ cafeName }`); the core merges it into shared state and passes it to the active theme, which decides how to interpret each key. A task with no `check` simply never auto-completes.
- **`javaValidator.js`** — heuristic linter. `validateJava(code, monaco)` returns Monaco markers; `attachValidator(editor, monaco)` wires it to run on mount + debounced (300 ms) on every edit. Call `attachValidator` from the editor's `onMount`.
- **`javaCompletions.js`** — `registerJavaCompletions(monaco)` registers two completion providers. Call it from the editor's `beforeMount`.

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
