import { useEffect, useState } from 'react'
import type { SubmitButtonStatus } from './SubmitButton.types'
import { SUBMIT_BUTTON_RESET_DELAY_MS } from './SubmitButton.constants'

/**
 * Mirrors `status` for display, except a landed `success`/`error` relaxes
 * back to `idle` on its own after `SUBMIT_BUTTON_RESET_DELAY_MS` — the caller's
 * own result state (e.g. `lastResultPassed`) keeps tracking the real outcome
 * for everything else (FeedbackBanner, "show answer", …); this is purely the
 * button's own idle/hover/click affordance resetting itself.
 */
export function useSubmitButtonDisplayStatus(status: SubmitButtonStatus): SubmitButtonStatus {
  const [prevStatus, setPrevStatus] = useState(status)
  const [displayStatus, setDisplayStatus] = useState(status)

  // Adjust state during render (React's supported reset pattern) instead of
  // an effect, so a new `status` is reflected immediately — no extra frame
  // where the button still shows the previous state.
  if (status !== prevStatus) {
    setPrevStatus(status)
    setDisplayStatus(status)
  }

  useEffect(() => {
    if (status !== 'success' && status !== 'error') return
    const timer = setTimeout(() => setDisplayStatus('idle'), SUBMIT_BUTTON_RESET_DELAY_MS)
    return () => clearTimeout(timer)
  }, [status])

  return displayStatus
}
