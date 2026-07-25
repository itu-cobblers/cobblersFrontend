import { useState } from 'react'
import type { SourceFile, SubmissionResult } from '@types'
import { submitAssignment } from '@lib/submissionApi'

interface UseSubmissionOptions {
  /** Cross-cutting effects on a result (mirror in terminal, grade the assignment). */
  onResult?: (content: string | SourceFile[], result: SubmissionResult) => void
}

export interface UseSubmission {
  showSubmit: boolean
  isSubmitting: boolean
  result: SubmissionResult | null
  open: () => void
  close: () => void
  /** `content` is a single Java source string, or a `{ name, content }[]` file list for multi-file code assignments. */
  confirm: (content: string | SourceFile[], assignmentId: number | undefined) => Promise<SubmissionResult | null>
}

/**
 * Owns the submit-to-teacher flow: the confirm/result modal state and the
 * submit lifecycle. Cross-cutting effects are injected via `onResult` so this
 * hook stays decoupled from the executor/assignments.
 */
export function useSubmission({ onResult }: UseSubmissionOptions = {}): UseSubmission {
  const [showSubmit, setShowSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)

  function open() {
    setResult(null)
    setShowSubmit(true)
  }

  function close() {
    if (isSubmitting) return
    setShowSubmit(false)
    setResult(null)
  }

  async function confirm(
    content: string | SourceFile[],
    assignmentId: number | undefined,
  ): Promise<SubmissionResult | null> {
    if (assignmentId === undefined) return null
    setIsSubmitting(true)
    try {
      const r = await submitAssignment({ assignmentId, content })
      setResult(r)
      onResult?.(content, r)
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

  return { showSubmit, isSubmitting, result, open, close, confirm }
}
