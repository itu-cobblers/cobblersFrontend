import type { SourceFile } from './task'

/**
 * Backend execution & submission contracts (see api repo CONTRACT.md).
 * These shapes flow through the single API seams in src/lib.
 */

/** Outcome category returned by POST /api/execute and /api/submission. */
export type ExecuteStatus = 'success' | 'compile_error' | 'runtime_error'

/**
 * POST /api/execute request. `code` is single-file sugar (one `Main.java`);
 * `files` + `entryClass` are used for multi-file runs (harness / mini-projects).
 * `stdin` feeds interactive programs. `code` and `files` are mutually exclusive.
 */
export interface ExecuteRequest {
  code?: string
  files?: SourceFile[]
  entryClass?: string
  stdin?: string
}

/** POST /api/execute → response. */
export interface ExecuteResult {
  status: ExecuteStatus
  stdout: string
  stderr: string
}

/** POST /api/submission → response (execute result + teacher-facing verdict). */
export interface SubmissionResult extends ExecuteResult {
  /** Did the submission satisfy the task? */
  accepted: boolean
  /** Beginner-friendly feedback to show in the submit modal. */
  message: string
}
