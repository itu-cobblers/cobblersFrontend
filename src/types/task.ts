/**
 * Task domain types — the "task boundary" contract (see src/lib/tasks.ts).
 *
 * Tasks are a discriminated union on `kind`:
 *   - 'code'    — the student writes/runs Java; graded by check() on the run result.
 *   - 'predict' — the student reads a read-only snippet and predicts its output.
 *   - 'project' — a multi-file mini-project uploaded from VS Code (scaffolded grading).
 *
 * The IDE core (sidebar, progress, day grouping) only ever touches the shared
 * base fields; only rendering + grading branch on `kind`.
 */

/** Which day of the 3-day camp a task belongs to. */
export type Day = 1 | 2 | 3

export type TaskKind = 'code' | 'predict' | 'project'

/** One Java source file (name + contents) for multi-file execution. */
export interface SourceFile {
  name: string
  content: string
}

/**
 * Free-form, theme-agnostic payload a task broadcasts on success (e.g.
 * `{ cafeName }`). The core never interprets it — values are `unknown`.
 */
export type Signals = Record<string, unknown>

/** Input handed to a code task's `check()` — `output` is stdout, `code` the editor text. */
export interface CheckResult {
  code: string
  output: string
  stderr: string
  exitCode: number
}

/** Verdict returned by a code task's `check()`. */
export interface Verdict {
  passed: boolean
  signals?: Signals
  message?: string
}

interface TaskBase {
  /** Server-assigned task id — used as the active/completed key. */
  id: number
  /**
   * Legacy day tag. Tasks fetched from the API don't carry it (day is
   * expressed by which taskset a task belongs to — see the api repo's
   * SCHEMA.md); only the old local bundle in tasks.ts still sets it.
   */
  day?: Day
  title: string
  description: string
  hint?: string
  kind: TaskKind
}

/** A grader harness: extra files compiled WITH the student's code, run via `entryClass`. */
export interface Harness {
  files: SourceFile[]
  entryClass: string
}

/** Write-and-run Java task (Day 1–3 coding exercises, incl. class-authoring). */
export interface CodeTask extends TaskBase {
  kind: 'code'
  /** Initial Java shown when the task is opened. */
  starter?: string
  /** Canned stdin for interactive programs (e.g. the guess game). */
  stdin?: string
  /** Hidden grader code compiled with the student's file (e.g. a Main that drives a class). */
  harness?: Harness
  /** Filename for the student's code when a harness is used (e.g. `Container.java`). Default `Main.java`. */
  solutionFile?: string
  /** Passing criteria. Omit ⇒ never auto-completes. */
  check?: (result: CheckResult) => Verdict
}

/** Predict-the-output quiz: read-only snippet, student types the expected output. */
export interface PredictTask extends TaskBase {
  kind: 'predict'
  /** Read-only code shown in the editor. */
  snippet: string
  /** The canonical expected printed output. */
  expectedOutput: string
  /** Extra accepted answers (e.g. infinite-loop phrasings), matched after normalization. */
  accept?: string[]
}

/** Multi-file mini-project uploaded from the student's IDE (scaffolded grading). */
export interface ProjectTask extends TaskBase {
  kind: 'project'
  /** Long-form project brief. */
  brief: string
  /** Class names the project is expected to contain (for future test-case grading). */
  requiredClasses?: string[]
  /** The class whose `main` is run when the uploaded files are executed. */
  entryClass?: string
}

export type Task = CodeTask | PredictTask | ProjectTask
