import { Button } from '@components/Button'
import type { WelcomeBackBannerProps } from './WelcomeBackBanner.types'
import {
  BANNER_WRAP_CLASS,
  BANNER_ICON_CLASS,
  BANNER_BODY_CLASS,
  BANNER_TITLE_CLASS,
  BANNER_TEXT_CLASS,
  BANNER_ACTIONS_CLASS,
  BANNER_DISMISS_CLASS,
} from './WelcomeBackBanner.constants'

/**
 * The "resume suggestion" prompt (CONTRACT.md "Resume suggestion"): a
 * returning student is offered today's room instead of having to ask the
 * teacher for the code again. Purely a confirm-or-dismiss nudge — never
 * auto-joins on its own.
 */
export default function WelcomeBackBanner({
  displayName,
  code,
  assignmentSetDisplayTitle,
  isJoining,
  onJoin,
  onDismiss,
}: WelcomeBackBannerProps) {
  return (
    <div className={BANNER_WRAP_CLASS} role="status">
      <span className={BANNER_ICON_CLASS} aria-hidden="true">
        👋
      </span>
      <div className={BANNER_BODY_CLASS}>
        <p className={BANNER_TITLE_CLASS}>Welcome back{displayName ? `, ${displayName}` : ''}!</p>
        <p className={BANNER_TEXT_CLASS}>
          Continue in today&rsquo;s session — <strong>{assignmentSetDisplayTitle}</strong> (code {code})?
        </p>
        <div className={BANNER_ACTIONS_CLASS}>
          <Button onClick={onJoin} isLoading={isJoining}>
            Join today&rsquo;s session
          </Button>
          <Button variant="ghost" onClick={onDismiss} isDisabled={isJoining}>
            Not now
          </Button>
        </div>
      </div>
      <button
        type="button"
        className={BANNER_DISMISS_CLASS}
        onClick={onDismiss}
        disabled={isJoining}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
