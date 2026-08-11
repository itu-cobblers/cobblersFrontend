import type { TeacherFollowBannerProps } from '@/components'
import {
  FOLLOW_BANNER_CLASS,
  FOLLOW_BANNER_TEXT_CLASS,
  FOLLOW_BANNER_DOT_CLASS,
  FOLLOW_BANNER_BTN_CLASS,
} from './TeacherFollowBanner.constants'

/**
 * "Teacher moved to X" nudge — shown when the teacher's live focus (via the
 * SignalR hub) points somewhere other than what the student is currently
 * looking at, whether that's a different assignment or a Slides page. Purely
 * a nudge: following is one click, never automatic.
 */
export default function TeacherFollowBanner({ label, onFollow }: TeacherFollowBannerProps) {
  return (
    <div className={FOLLOW_BANNER_CLASS} role="status">
      <span className={FOLLOW_BANNER_TEXT_CLASS}>
        <span className={FOLLOW_BANNER_DOT_CLASS} aria-hidden="true" />
        Teacher moved to <strong>{label}</strong>
      </span>
      <button type="button" className={FOLLOW_BANNER_BTN_CLASS} onClick={onFollow}>
        Follow →
      </button>
    </div>
  )
}
