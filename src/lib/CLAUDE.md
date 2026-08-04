# CLAUDE.md — src/lib (client-side tooling)

Framework-agnostic **TypeScript** that powers the in-browser Java experience and the API seams. **No React, no JSX here** — these modules take a `monaco` instance (typed `typeof import('monaco-editor')`) or plain data and return data. No `any`, no manual casts. Each file has a JSDoc header; keep it updated. Domain types come from `@types` (`src/types/`).

## Files

- **`defaultStarter.ts`** — fallback Java editor template when a code assignment omits `starter` from the API.
- **`assignmentSet.ts`** — `groupAssignments(assignments, label)` shapes an assignment set's list into the one labelled group the teacher preview renders.
- **`grade.ts`** — output helpers (`normalizeOutput`, `outputLines`, `includesLine`, `includesAll`, `matches`) plus code-inspection helpers (`stripComments`, `stripStrings`, `stripCode`, `printlnArgs`, `callArgs`). Heuristic by design — regex over stripped source, not an AST (same philosophy as `javaValidator.ts`).
- **`javaSource.ts`** — shared single-pass lexer for the Java tooling. `sanitizeJava(code)` blanks comments and string/char *contents* with spaces (delimiters kept, so line lengths and columns survive), reports unterminated literals, and returns the lexer state at the end of the text. Both `javaValidator` and `javaCompletions` build on it; extend the lexer here, never re-scan strings/comments locally.
- **`javaValidator.ts`** — heuristic linter. `collectJavaIssues(code)` is the pure, unit-tested core (`JavaIssue[]`, no Monaco); `validateJava(code, monaco)` maps it to `editor.IMarkerData[]`; `attachValidator(editor, monaco)` wires it up with a two-stage cadence — all *other* lines re-check ~300ms after the last keystroke, the line being typed on holds its markers until a ~1.2s pause or the caret leaves it (then they show immediately). Called from `useCodeEditorSetup` (the editor's `onMount`); safe across editor remounts (timers cleared on dispose).
- **`javaCompletions.ts`** — `registerJavaCompletions(monaco)` registers two completion providers; idempotent per Monaco instance (the editor remounts per file via React `key`, and re-registering would duplicate every suggestion). Called from `useCodeEditorSetup` (the editor's `beforeMount`). `inferVariableTypes` and `resolveChainKey` are exported pure helpers with unit tests.
- **API seams** — `../api/executeApi.ts` (run), `../api/submissionApi.ts` (submit for code + predict, plus `fetchSubmissionHistory`), `../api/studentApi.ts` (upsert student before submit), `../api/sessionApi.ts` (session/room/timer, plus `endSession` and `fetchTodayLatestSession`), `../api/assignmentSetApi.ts` (assignment sets). Plus `identity.ts` (anon student id) and `teacherAuth.ts` (sessionStorage flag). The wire contract uses Assignment naming end to end (`/api/assignmentsets`, `assignmentId`, `assignmentSetId`) — keep these seams in lockstep with the api repo's `CONTRACT.md`. Both `fetchSubmissionHistory` and `fetchTodayLatestSession` degrade on failure (to an empty result and to `null` respectively) rather than throwing — deliberate, because "no history yet" and "no session today" are ordinary states the UI must render calmly. Both underlying endpoints **are** implemented now (S5 shipped in the backend's #31).

## The validator is intentionally heuristic

It does **not** parse Java — it runs line-level checks over the sanitized source from `javaSource.ts` to catch the handful of mistakes absolute beginners make: missing semicolons, unbalanced `{}`, `(` left open at end of file, and unterminated string/char literals. This is a teaching aid, not a compiler.

Guiding rules when editing:

- **Optimize for zero false positives over completeness.** A wrong red squiggle confuses a first-time programmer more than a missed error helps. Note it already refuses to flag stray `)` for this reason.
- Semicolon logic lives in `lineNeedsSemicolon` / `NO_SEMICOLON_PATTERNS` / `TRAILING_OK` / `isDeclarationLine`, plus two statement-continuation escapes: a line inside an open `(...)` is never flagged, and neither is a line whose next line starts mid-statement (`.`, `+`, `)`, …). All deliberately conservative — extend the skip lists rather than making the rule aggressive.
- Comments and string/char contents are already blanked by `sanitizeJava` before any check runs — that's what makes `int x = 5; // note` safe. Don't add per-check string/comment special-casing; fix the lexer instead.
- Real syntax/compile errors are the backend's job (eventually). Don't try to reimplement a parser here.

## The completion providers

`registerJavaCompletions` registers:

1. **Dot-triggered** (`triggerCharacters: ['.']`): extracts the receiver chain before the dot (call segments included) and resolves it via `resolveChainKey`, in priority order: **declared variable types** scanned from the document by `inferVariableTypes` (`Scanner reader = …` → Scanner members; a declared type we don't know — a student class, a primitive — deliberately yields *nothing*), exact **static class names** (`System`, `System.out`, `Math`…), then **lowercased common variable names** as a fallback heuristic (`s`/`str`/`name` → String, `sb` → StringBuilder, `sc` → Scanner…). Chained calls keep resolving through `MEMBER_RETURNS` (`sb.append(x).` → StringBuilder, `sc.nextLine().` → String), string literals work as receivers (`"abc".`), and a bare `.append(x).` at line start continues the statement above via `BARE_CALL_RETURNS`.
2. **Word-triggered**: classes, keywords, and top-level snippets (`sout`, `psvm`, `fori`, `foreach`, `while`, `try`, `Scanner`, `ArrayList`…) keyed by the current word prefix; after `new ` it offers class names only. Items are cached per Monaco instance.

Both providers stay silent inside strings, chars and comments (checked with `sanitizeJava(...).endState`).

Conventions:

- Build items with the `M` (method), `F` (field), `S` (snippet) helper factories — don't construct raw completion objects inline. They set `kind`, `insertTextRules` (snippet), and `sortText: '0'+label` to sort custom items above Monaco defaults.
- Snippet `insertText` uses Monaco placeholder syntax (`${1:x}`, `$2`). Match the existing alignment/columnar formatting in the tables for readability.
- To support a new type: add a `xxxCompletions(m)` table, a `TableKey`, and entries in `TABLES` + `DECLARED_TYPE_TO_KEY` (and lowercase variable-name aliases in `NAME_HEURISTICS` if beginners are likely to use them). Add return-type entries to `MEMBER_RETURNS` only where the method name is unambiguous for that receiver.
- Scope is the standard-library surface a beginner touches. Don't add exotic APIs the camp doesn't teach — check `bootIT slides` for the actual curriculum level.
