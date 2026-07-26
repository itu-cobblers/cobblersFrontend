import { useEffect, useState } from 'react'
import type { SubmitButtonStatus } from './SubmitButton.types'
import { SUBMIT_BUTTON_RESET_DELAY_MS } from './SubmitButton.constants'

/**
 * Mirrors `status` for display, except a landed `success`/`error` relaxes
 * back to `idle` on its own after `SUBMIT_BUTTON_RESET_DELAY_MS` — the caller's
 * own result state (e.g. `lastResultPassed`) keeps tracking the real outcome
 * for everything else (FeedbackBanner, "show answer", …); this is purely the
 * button's own idle/hover/click affordance resetting itself.
 *
 * This hook trusts `status` completely — it has no notion of "assignment" or
 * "switching". Callers must only ever pass `success`/`error` for the instant
 * a submission's own result lands, not a de-facto/persisted correctness flag
 * that's also read for other UI (badges, checkmarks, "show answer", …) — see
 * `SubmitButton.constants.ts` / the panels that pass `status` in for how that
 * separation is kept.
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
