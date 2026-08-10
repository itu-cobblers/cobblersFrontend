import { Icon } from '@components/Icon'
import {
  SCREEN_SIZE_BLOCKER_CLASS,
  SCREEN_SIZE_BLOCKER_ICON_CLASS,
  SCREEN_SIZE_BLOCKER_TITLE_CLASS,
  SCREEN_SIZE_BLOCKER_BODY_CLASS,
  SCREEN_SIZE_BLOCKER_TITLE,
  SCREEN_SIZE_BLOCKER_BODY,
} from './ScreenSizeBlocker.constants'

/**
 * Full-screen stand-in rendered by `ScreenSizeGate` in place of the app when
 * the viewport is narrower than an iPad in landscape — the editor, tabs and
 * terminal have no readable layout below that width.
 */
export default function ScreenSizeBlocker() {
  return (
    <div className={SCREEN_SIZE_BLOCKER_CLASS}>
      <span className={SCREEN_SIZE_BLOCKER_ICON_CLASS}>
        <Icon name="alert" />
      </span>
      <h1 className={SCREEN_SIZE_BLOCKER_TITLE_CLASS}>{SCREEN_SIZE_BLOCKER_TITLE}</h1>
      <p className={SCREEN_SIZE_BLOCKER_BODY_CLASS}>{SCREEN_SIZE_BLOCKER_BODY}</p>
    </div>
  )
}
