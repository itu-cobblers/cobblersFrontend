/**
 * Task domain types — the "task boundary" contract (see src/lib/tasks.ts).
 * Tasks are self-contained: copy, starter code, and their own passing criteria.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/**
 * Free-form, theme-agnostic payload a task broadcasts on success (e.g.
 * `{ cafeName }`). The core never interprets it — the active theme decides
 * which keys it cares about, so values are intentionally `unknown`.
 */
export type Signals = Record<string, unknown>

/** Input handed to a task's `check()` — `code` is the editor text. */
export interface CheckResult {
  code: string
  output: string
  stderr: string
  exitCode: number
}

/** Verdict returned by a task's `check()`. */
export interface Verdict {
  passed: boolean
  signals?: Signals
  message?: string
}

export interface Task {
  /** Array index, sequential from 0 — used directly as the active/completed key. */
  id: number
  title: string
  difficulty: Difficulty
  description: string
  hint?: string
  /** Initial Java shown when this task is opened. */
  starter?: string
  /** Passing criteria. Omit ⇒ the task never auto-completes. */
  check?: (result: CheckResult) => Verdict
}
