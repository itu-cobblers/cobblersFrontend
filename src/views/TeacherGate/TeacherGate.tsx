import classNames from 'classnames'
import { Button, TextField } from '@components'
import { PortalShell } from '@components/PortalShell'
import { TeacherDashboard } from '@views/TeacherDashboard'
import { useTeacherAuth } from './TeacherGate.hooks'
import { PORTAL_HEADING_CLASS, PORTAL_FIELD_ROW_CLASS } from '@components/PortalShell/PortalShell.constants'
import {
  GATE_TITLE_CLASS,
  GATE_SUBHEAD_CLASS,
  GATE_ERROR_CLASS,
  GATE_CTA_ROW_CLASS,
  GATE_TITLE,
  GATE_SUBHEAD,
  GATE_PLACEHOLDER,
} from './TeacherGate.constants'

export default function TeacherGate() {
  const { isAuthed, code, hasError, handleCodeChange, handleSubmit } = useTeacherAuth()

  if (isAuthed) return <TeacherDashboard />

  return (
    <PortalShell>
      <form onSubmit={handleSubmit}>
        <h1 className={GATE_TITLE_CLASS}>{GATE_TITLE}</h1>
        <h2 className={classNames(PORTAL_HEADING_CLASS, GATE_SUBHEAD_CLASS)}>{GATE_SUBHEAD}</h2>

        <div className={PORTAL_FIELD_ROW_CLASS}>
          <TextField
            type="password"
            value={code}
            onChange={handleCodeChange}
            placeholder={GATE_PLACEHOLDER}
            hasError={hasError}
            autoFocus
          />
          {hasError && <p className={GATE_ERROR_CLASS}>Incorrect code — try again.</p>}
        </div>

        <div className={GATE_CTA_ROW_CLASS}>
          <Button type="submit">Enter</Button>
        </div>
      </form>
    </PortalShell>
  )
}
