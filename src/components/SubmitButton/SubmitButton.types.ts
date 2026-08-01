/**
 * idle    — not submitted yet, shows the up-arrow "Submit" affordance
 * waiting — a submission is in flight, spins and blocks re-clicks
 * success — the submission passed, holds a green check "Well Done"
 * error   — the submission failed, holds an amber "!" "Not Quite"
 *
 * `success`/`error` relax back to `idle` on their own a couple seconds after
 * landing — see `useSubmitButtonDisplayStatus` in `SubmitButton.hooks.ts`.
 */
export type SubmitButtonStatus = 'idle' | 'waiting'

export interface SubmitButtonProps {
  status: SubmitButtonStatus
  onClick: () => void
  isDisabled?: boolean
  /** Overrides the status-derived accessible name (e.g. for a translated label). */
  label?: string
}
