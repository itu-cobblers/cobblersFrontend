import type { ExecuteResult } from '@types'

export interface SubmissionBannerProps {
  /** 1-based, oldest first — the same number a student would count to. */
  number: number
  submittedAt: string
  passed: boolean | null
  /** Null for `predict` (nothing executed). Present for `code` — a compile/runtime error here overrides `passed` to show "Error" instead of "Tried". */
  result: ExecuteResult | null
}
