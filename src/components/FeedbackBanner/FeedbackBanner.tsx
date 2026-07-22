import classNames from 'classnames'
import type { FeedbackBannerProps } from './FeedbackBanner.types'
import {
  FEEDBACK_BANNER_BASE_CLASS,
  FEEDBACK_BANNER_TONE_CLASS,
  FEEDBACK_LABEL_BASE_CLASS,
  FEEDBACK_LABEL_TONE_CLASS,
  FEEDBACK_LABEL_TEXT,
  FEEDBACK_MESSAGE_CLASS,
  FEEDBACK_DEFAULT_MESSAGE,
} from './FeedbackBanner.constants'

/**
 * Classroom-style guidance from an assignment's check — deliberately styled
 * unlike the terminal so students can tell a hint from real program output.
 */
export default function FeedbackBanner({ tone, message }: FeedbackBannerProps) {
  return (
    <div role="status" className={classNames(FEEDBACK_BANNER_BASE_CLASS, FEEDBACK_BANNER_TONE_CLASS[tone])}>
      <span className={classNames(FEEDBACK_LABEL_BASE_CLASS, FEEDBACK_LABEL_TONE_CLASS[tone])}>
        {FEEDBACK_LABEL_TEXT[tone]}
      </span>
      <p className={FEEDBACK_MESSAGE_CLASS}>{message ?? FEEDBACK_DEFAULT_MESSAGE[tone]}</p>
    </div>
  )
}
