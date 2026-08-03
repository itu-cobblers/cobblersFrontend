import type { TeacherFollowBannerProps } from '@/components'
import {
  FOLLOW_BANNER_CLASS,
  FOLLOW_BANNER_TEXT_CLASS,
  FOLLOW_BANNER_DOT_CLASS,
  FOLLOW_BANNER_BTN_CLASS,
} from './TeacherFollowBanner.constants'

/**
 * "Teacher moved to #N" nudge — shown when the teacher's live-focused
 * assignment (via the SignalR hub) differs from the one the student is
 * currently viewing. Purely a nudge: following is one click, never automatic.
 */
export default function TeacherFollowBanner({ assignmentId, assignmentTitle, onFollow }: TeacherFollowBannerProps) {
  return (
    <div className={FOLLOW_BANNER_CLASS} role="status">
      <span className={FOLLOW_BANNER_TEXT_CLASS}>
        <span className={FOLLOW_BANNER_DOT_CLASS} aria-hidden="true" />
        Teacher moved to{' '}
        <strong>
          #{assignmentId} · {assignmentTitle}
        </strong>
      </span>
      <button type="button" className={FOLLOW_BANNER_BTN_CLASS} onClick={onFollow}>
        Follow →
      </button>
    </div>
  )
}
