import { useState } from 'react'
import type { SubmissionResult } from '@types'
import { submitCode } from '@lib/submissionApi'

interface UseSubmissionOptions {
  /** Cross-cutting effects on a result (mirror in terminal, grade the task). */
  onResult?: (code: string, result: SubmissionResult) => void
}

export interface UseSubmission {
  showSubmit: boolean
  isSubmitting: boolean
  result: SubmissionResult | null
  open: () => void
  close: () => void
  confirm: (code: string, taskId: number | undefined) => Promise<SubmissionResult | null>
}

/**
 * Owns the submit-to-teacher flow: the confirm/result modal state and the
 * submit lifecycle. Cross-cutting effects are injected via `onResult` so this
 * hook stays decoupled from the executor/tasks.
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

  async function confirm(code: string, taskId: number | undefined): Promise<SubmissionResult | null> {
    if (taskId === undefined) return null
    setIsSubmitting(true)
    try {
      const r = await submitCode({ taskId, code })
      setResult(r)
      onResult?.(code, r)
      return r
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setResult({
        status: 'runtime_error',
        stdout: '',
        stderr: reason,
        accepted: false,
        message: 'Something went wrong submitting. Please try again.',
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return { showSubmit, isSubmitting, result, open, close, confirm }
}
