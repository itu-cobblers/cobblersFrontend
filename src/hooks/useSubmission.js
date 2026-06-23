import { useState } from 'react'
import { submitCode } from '../lib/submissionApi'

/**
 * Owns the submit-to-teacher flow: the confirm/result modal state and the
 * submit lifecycle. Cross-cutting effects (mirroring the result in the
 * terminal, grading the task) are injected via `onResult` so this hook stays
 * decoupled from the executor/tasks.
 *
 * @param {{ onResult?: (code: string, result: object) => void }} options
 * Returns: showSubmit, isSubmitting, result, open(), close(), confirm(code, taskId)
 */
export function useSubmission({ onResult } = {}) {
  const [showSubmit, setShowSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  function open() {
    setResult(null)
    setShowSubmit(true)
  }

  function close() {
    if (isSubmitting) return
    setShowSubmit(false)
    setResult(null)
  }

  async function confirm(code, taskId) {
    setIsSubmitting(true)
    try {
      // Contract response: { status, stdout, stderr, accepted, message }.
      const r = await submitCode({ taskId, code })
      setResult(r)
      onResult?.(code, r)
      return r
    } catch (err) {
      setResult({
        accepted: false,
        message: 'Something went wrong submitting. Please try again.',
        stderr: err.message,
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return { showSubmit, isSubmitting, result, open, close, confirm }
}
