import type { SourceFile } from './assignment'

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

/**
 * POST /api/assignments/{assignmentId}/submissions → response (CONTRACT.md
 * "Submission"). `passed` is the server-computed verdict — `null` when the
 * assignment has no automated grader. `result` mirrors `execute`'s response
 * for `code`; `null` for `predict` (nothing is executed).
 */
export interface SubmissionResult {
  subId: string
  passed: boolean | null
  result: ExecuteResult | null
  submittedAt: string
}

/**
 * One row of `GET /api/students/{studentId}/submissions` (CONTRACT.md
 * "Submission history"). Lightweight by design — no `content`/`result`, just
 * enough to derive "has this assignment ever passed?" and list attempts.
 * `sessionId` here is the room *code* (e.g. `"ABCD"`), not an internal id —
 * `null` for a solo/practice submission.
 */
export interface SubmissionHistoryItem {
  subId: string
  assignmentId: number
  sessionId: string | null
  passed: boolean | null
  submittedAt: string
}

/**
 * `GET /api/assignments/{assignmentId}/solution` → response (CONTRACT.md
 * "Solution"). Shape mirrors `Assignment.SampleSolutionJson` for the
 * assignment's kind: a single Java source string for `code`, a file list for
 * `project`. The frontend gates when the reveal button is shown; the backend
 * just returns the stored reference answer.
 */
export interface SolutionResult {
  solution: string | SourceFile[] | null
}
