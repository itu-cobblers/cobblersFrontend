import { useState } from 'react'
import type { SourceFile, SubmissionResult } from '@types'
import { submitAssignment } from '@/api/submissionApi.ts'

interface UseSubmissionOptions {
  /** Cross-cutting effects on a result (mirror in terminal, grade the assignment). */
  onResult?: ( result: SubmissionResult) => void
}

export interface UseSubmission {
  isSubmitting: boolean
  result: SubmissionResult | null
  confirm: (
    content: string | SourceFile[],
    assignmentId: number | undefined,
    sessionCode: string | undefined,
  ) => Promise<SubmissionResult | null>
  /** Clears the last result — called on assignment switch so a stale "well done"/"not quite" hold doesn't bleed into the next assignment's fresh Submit button. */
  reset: () => void
}

/**
 * Owns the submit-to-teacher flow: the submit lifecycle behind the shared
 * SubmitButton (isSubmitting drives its "waiting" frames, result its
 * "well done"/"not quite" hold). Cross-cutting effects are injected via
 * `onResult` so this hook stays decoupled from the executor/assignments.
 */
export function useSubmission({ onResult }: UseSubmissionOptions = {}): UseSubmission {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)

  async function confirm(
    content: string | SourceFile[],
    assignmentId: number | undefined,
    sessionCode: string | undefined,
  ): Promise<SubmissionResult | null> {
    if (assignmentId === undefined) return null
    setIsSubmitting(true)
    try {
      const r = await submitAssignment({ assignmentId, content, sessionCode })
      setResult(r)
      onResult?.(r)
      return r
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setResult({
        subId: '',
        passed: false,
        result: { status: 'runtime_error', stdout: '', stderr: reason },
        submittedAt: new Date().toISOString(),
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  function reset() {
    setResult(null)
  }

  return { isSubmitting, result, confirm, reset }
}
