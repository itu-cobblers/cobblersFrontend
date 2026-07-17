/**
 * ⚠️ TEMPORARY MOCKS — delete this whole file once the backend implements
 *    POST /api/execute and POST /api/submission. Then remove the fenced
 *    fallback branches in executeApi.ts and submissionApi.ts. Nothing else
 *    imports this file.
 *
 * Each list below is a set of **200-OK** responses covering the different
 * success/failure shapes a student's code can produce. The mock walks the list
 * on each call (round-robin), so you can click Run / Submit repeatedly to
 * preview every result-UI state. Tweak the payloads freely.
 *
 * To pin one scenario while you style it, set PIN_EXECUTE / PIN_SUBMIT to its
 * 0-based index instead of null.
 */
import type { ExecuteResult, SubmissionResult } from '@types'

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
