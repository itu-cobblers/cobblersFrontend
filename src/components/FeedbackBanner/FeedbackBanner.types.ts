/**
 * success — the check passed
 * hint    — the check failed; `message` guides the student
 */
export type FeedbackTone = 'success' | 'hint'

export interface FeedbackBannerProps {
  tone: FeedbackTone
  /** Guidance from the assignment's check; omitted ⇒ the tone's default label body. */
  message?: string
}
