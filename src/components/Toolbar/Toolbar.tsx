import { IconButton } from '@components/IconButton'
import { Icon } from '@components/Icon'
import { Badge } from '@components/Badge'
import { Button } from '@components/Button'
import type { ToolbarProps } from './Toolbar.types'
import {
  TOOLBAR_CLASS,
  TOOLBAR_SIDE_CLASS,
  TOOLBAR_RIGHT_CLASS,
  TOOLBAR_LOGO_CLASS,
  TOOLBAR_SUBTITLE_CLASS,
  TOOLBAR_SESSION_LABEL_CLASS,
} from './Toolbar.constants'

export default function Toolbar({
  subtitle,
  isRunning,
  isSubmitting,
  isRunDisabled = false,
  isSubmitDisabled = false,
  onToggleSidebar,
  onRun,
  onSubmit,
  sessionLabel,
  sessionActionLabel,
  onLeaveSession,
}: ToolbarProps) {
  const isBusy = isRunning || isSubmitting
  const submitLabel = isSubmitting ? 'Submitting…' : 'Submit'

  return (
    <header className={TOOLBAR_CLASS}>
      <div className={TOOLBAR_SIDE_CLASS}>
        <IconButton label="Toggle assignment panel" onClick={onToggleSidebar}>
          <Icon name="menu" />
        </IconButton>
        <span className={TOOLBAR_LOGO_CLASS}>bootIT</span>
        {subtitle && <span className={TOOLBAR_SUBTITLE_CLASS}>{subtitle}</span>}
        <Badge tone="lang">Java</Badge>
        {sessionLabel && onLeaveSession && (
          <>
            <span className={TOOLBAR_SESSION_LABEL_CLASS}>{sessionLabel}</span>
            <Button variant="ghost" onClick={onLeaveSession}>
              {sessionActionLabel ?? 'Leave'}
            </Button>
          </>
        )}
      </div>
      <div className={TOOLBAR_RIGHT_CLASS}>
        <IconButton
          label="Run code"
          onClick={onRun}
          isLoading={isRunning}
          isDisabled={isBusy || isRunDisabled}
        >
          <Icon name="play" />
        </IconButton>
        <Button onClick={onSubmit} isLoading={isSubmitting} isDisabled={isBusy || isSubmitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </header>
  )
}
