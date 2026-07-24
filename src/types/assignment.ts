/**
 * Assignment domain types — the "assignment boundary" contract (see src/lib/assignmentSetApi.ts).
 *
 * Assignments are a discriminated union on `kind`:
 *   - 'code'    — the student writes/runs Java; graded by check() on the run result.
 *   - 'predict' — the student reads a read-only snippet and predicts its output.
 *   - 'project' — a multi-file mini-project uploaded from VS Code (scaffolded grading).
 *
 * The IDE core (stepper, progress) only ever touches the shared base fields;
 * only rendering + grading branch on `kind`.
 */

export type AssignmentKind = 'code' | 'predict' | 'project'

/**
 * One block of teaching content shown above the task in the assignment panel.
 * Kept structured (no markdown) so code examples render as real code cards.
 */
export type LessonBlock =
  | { kind: 'text'; text: string }
  | { kind: 'code'; code: string }

/** One Java source file (name + contents) for multi-file execution. */
export interface SourceFile {
  name: string
  content: string
}

/**
 * Free-form, theme-agnostic payload an assignment broadcasts on success (e.g.
 * `{ studentName }`). The core never interprets it — values are `unknown`.
 */
export type Signals = Record<string, unknown>

/** Input handed to a code assignment's `check()` — `output` is stdout, `code` the editor text. */
export interface CheckResult {
  code: string
  output: string
  stderr: string
  exitCode: number
}

/** Verdict returned by a code assignment's `check()`. */
export interface Verdict {
  passed: boolean
  signals?: Signals
  message?: string
}

interface AssignmentBase {
  /** Server-assigned assignment id — used as the active/completed key. */
  id: number
  title: string
  /** The actual task the student must solve — shown under "Your task". */
  description: string
  /** Teaching content (concept + example code) shown above the task. */
  lesson?: LessonBlock[]
  hint?: string
  kind: AssignmentKind
}

/** A grader harness: extra files compiled WITH the student's code, run via `entryClass`. */
export interface Harness {
  files: SourceFile[]
  entryClass: string
}

/** Write-and-run Java assignment (coding exercises, incl. class-authoring). */
export interface CodeAssignment extends AssignmentBase {
  kind: 'code'
  /** Initial Java shown when the assignment is opened. */
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
export interface PredictAssignment extends AssignmentBase {
  kind: 'predict'
  /** Read-only code shown in the editor. */
  snippet: string
  /** The canonical expected printed output. */
  expectedOutput: string
  /** Extra accepted answers (e.g. infinite-loop phrasings), matched after normalization. */
  accept?: string[]
}

/** Multi-file mini-project uploaded from the student's IDE (scaffolded grading). */
export interface ProjectAssignment extends AssignmentBase {
  kind: 'project'
  /** Long-form project brief. */
  brief: string
  /** Class names the project is expected to contain (for future test-case grading). */
  requiredClasses?: string[]
  /** The class whose `main` is run when the uploaded files are executed. */
  entryClass?: string
}

export type Assignment = CodeAssignment | PredictAssignment | ProjectAssignment
