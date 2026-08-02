export interface SubmissionBannerProps {
  /** 1-based, oldest first — the same number a student would count to. */
  number: number
  submittedAt: string
  passed: boolean | null
}
