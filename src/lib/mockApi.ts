/**
 * ⚠️ TEMPORARY MOCKS — delete this whole file once the backend implements
 *    POST /api/execute, POST /api/submission, and the /api/assignmentsets
 *    routes. Then remove the fenced fallback branches in executeApi.ts,
 *    submissionApi.ts, and assignmentSetApi.ts. Nothing else imports this file.
 *
 * Each list below is a set of **200-OK** responses covering the different
 * success/failure shapes a student's code can produce. The mock walks the list
 * on each call (round-robin), so you can click Run / Submit repeatedly to
 * preview every result-UI state. Tweak the payloads freely.
 *
 * To pin one scenario while you style it, set PIN_EXECUTE / PIN_SUBMIT to its
 * 0-based index instead of null.
 *
 * The assignment-set mock serves the legacy local bundle (assignments.ts), so
 * the whole student UI — entry screen, sidebar, all three assignment kinds,
 * and local check() grading — works with no backend at all.
 */
import type { AssignmentSet, ExecuteResult, SubmissionResult } from '@types'
import type { AssignmentSetSummary } from './assignmentSetApi'
import { ASSIGNMENTS } from './assignments'

interface Scenario<T> {
  label: string
  payload: T
}

/** Responses for POST /api/execute → { status, stdout, stderr } */
export const EXECUTE_SCENARIOS: Scenario<ExecuteResult>[] = [
  {
    label: 'success — with output',
    payload: { status: 'success', stdout: 'Hello, World!\n', stderr: '' },
  },
  {
    label: 'success — no output',
    payload: { status: 'success', stdout: '', stderr: '' },
  },
  {
    label: 'compile error',
    payload: {
      status: 'compile_error',
      stdout: '',
      stderr:
        'Main.java:3: error: \';\' expected\n        System.out.println("Hello")\n                                   ^\n1 error',
    },
  },
  {
    label: 'runtime error',
    payload: {
      status: 'runtime_error',
      stdout: 'Starting up…\n',
      stderr:
        'Exception in thread "main" java.lang.ArithmeticException: / by zero\n\tat Main.main(Main.java:4)',
    },
  },
]

/** Responses for POST /api/submission → { status, stdout, stderr, accepted, message } */
export const SUBMIT_SCENARIOS: Scenario<SubmissionResult>[] = [
  {
    label: 'accepted',
    payload: {
      status: 'success',
      stdout: 'Hello, World!\n',
      stderr: '',
      accepted: true,
      message: 'Submitted! Your teacher can see this assignment is complete. ✅',
    },
  },
  {
    label: 'rejected — wrong output',
    payload: {
      status: 'success',
      stdout: 'helo wrld\n',
      stderr: '',
      accepted: false,
      message: "Your code runs, but the output doesn't match the assignment yet. Tweak it and resubmit.",
    },
  },
  {
    label: 'rejected — compile error',
    payload: {
      status: 'compile_error',
      stdout: '',
      stderr: 'Main.java:3: error: \';\' expected',
      accepted: false,
      message: "Your code didn't compile, so nothing was submitted. Fix the errors and try again.",
    },
  },
  {
    label: 'rejected — runtime error',
    payload: {
      status: 'runtime_error',
      stdout: '',
      stderr:
        'Exception in thread "main" java.lang.NullPointerException\n\tat Main.main(Main.java:5)',
      accepted: false,
      message: 'Your code crashed while running. Fix the error and resubmit.',
    },
  },
]

const PIN_EXECUTE: number | null = null // e.g. 2 to always return the compile-error scenario
const PIN_SUBMIT: number | null = null

let execIdx = 0
let submitIdx = 0

export function mockExecute(): ExecuteResult {
  const i = PIN_EXECUTE ?? execIdx++ % EXECUTE_SCENARIOS.length
  const s = EXECUTE_SCENARIOS[i]
  console.info(`[mock] /api/execute → "${s.label}"`)
  return s.payload
}

export function mockSubmit(): SubmissionResult {
  const i = PIN_SUBMIT ?? submitIdx++ % SUBMIT_SCENARIOS.length
  const s = SUBMIT_SCENARIOS[i]
  console.info(`[mock] /api/submission → "${s.label}"`)
  return s.payload
}

const MOCK_SET_TITLE = 'bootIT assignments (local mock)'

/** GET /api/assignmentsets — a single summary pointing at the local bundle. */
export function mockAssignmentSets(): AssignmentSetSummary[] {
  console.info('[mock] /api/assignmentsets → local bundle')
  return [{ assignmentSetId: 'local-mock', displayTitle: MOCK_SET_TITLE }]
}

/** GET /api/assignmentsets/:id/assignments — the legacy local bundle, whatever the id. */
export function mockAssignmentSet(assignmentSetId: string): AssignmentSet {
  console.info(`[mock] /api/assignmentsets/${assignmentSetId} → local bundle (${ASSIGNMENTS.length} assignments)`)
  return { assignmentSetId, displayTitle: MOCK_SET_TITLE, assignments: ASSIGNMENTS }
}
