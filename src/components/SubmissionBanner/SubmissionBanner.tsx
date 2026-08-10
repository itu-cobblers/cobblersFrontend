import { StatusBadge } from '@components/StatusBadge'
import { formatAttemptTime } from '@components/ProblemsList'
import type { SubmissionBannerProps } from '@/components'
import { deriveSubmissionStatus } from './SubmissionBanner.utils'
import {
  SUBMISSION_BANNER_CLASS,
  SUBMISSION_BANNER_TITLE_CLASS,
  SUBMISSION_BANNER_META_CLASS,
} from './SubmissionBanner.constants'

/** Identifies the past submission currently filling the editor. */
export default function SubmissionBanner({ number, submittedAt, passed, result }: SubmissionBannerProps) {
  const status = deriveSubmissionStatus(passed, result)

  return (
    <div className={SUBMISSION_BANNER_CLASS}>
      <StatusBadge status={status} size="s" />
      <span className={SUBMISSION_BANNER_TITLE_CLASS}>Submission #{number}</span>
      <span className={SUBMISSION_BANNER_META_CLASS}>submitted on {formatAttemptTime(submittedAt)}</span>
    </div>
  )
}
