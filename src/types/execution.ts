import type { SourceFile } from './assignment'

/**
 * Backend execution & submission contracts (see api repo CONTRACT.md).
 * These shapes flow through the single API seams in src/lib.
 */

/** Outcome category returned by POST /api/execute and nested under submission.result. */
export type ExecuteStatus = 'success' | 'compile_error' | 'runtime_error'

/**
 * POST /api/execute request. `code` is single-file sugar (one `Main.java`);
 * `files` + `entryClass` are used for multi-file runs (class-authoring
 * assignments' `starterFiles` / mini-projects). `stdin` feeds interactive
 * programs. `code` and `files` are mutually exclusive.
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
 * POST /api/assignments/{assignmentId}/submissions → response.
 * `passed` is server-computed (`null` when there is no automated grader).
 * `result` mirrors execute's response for code/project; `null` for predict.
 */
export interface SubmissionResult {
  subId: string
  passed: boolean | null
  result: ExecuteResult | null
  submittedAt: string
}
