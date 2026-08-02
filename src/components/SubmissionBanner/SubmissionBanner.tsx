import { StatusBadge } from '@components/StatusBadge'
import { formatAttemptTime } from '@components/ProblemsList'
import type { SubmissionBannerProps } from './SubmissionBanner.types'
import {
  SUBMISSION_BANNER_CLASS,
  SUBMISSION_BANNER_TITLE_CLASS,
  SUBMISSION_BANNER_META_CLASS,
} from './SubmissionBanner.constants'

/** Identifies the past submission currently filling the editor. */
export default function SubmissionBanner({ number, submittedAt, passed }: SubmissionBannerProps) {
  // `!== false` rather than truthiness, matching SubmissionRow: a submission
  // whose result is unknown (`null`) reads the same in the banner as it does
  // in the list, so the badge never changes colour when you click a row.
  const isPassed = passed !== false

  return (
    <div className={SUBMISSION_BANNER_CLASS}>
      <StatusBadge status={isPassed ? 'passed' : 'tried'} size="s" />
      <span className={SUBMISSION_BANNER_TITLE_CLASS}>Submission #{number}</span>
      <span className={SUBMISSION_BANNER_META_CLASS}>submitted at {formatAttemptTime(submittedAt)}</span>
    </div>
  )
}
