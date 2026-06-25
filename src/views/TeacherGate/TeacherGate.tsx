import { Button, TextField } from '@components'
import { TeacherDashboard } from '@views/TeacherDashboard'
import { useTeacherAuth } from './TeacherGate.hooks'
import {
  GATE_SCREEN_CLASS,
  GATE_FORM_CLASS,
  GATE_TITLE_CLASS,
  GATE_SUBTITLE_CLASS,
  GATE_ERROR_CLASS,
} from './TeacherGate.constants'

export default function TeacherGate() {
  const { isAuthed, code, hasError, handleCodeChange, handleSubmit } = useTeacherAuth()

  if (isAuthed) return <TeacherDashboard />

  return (
    <div className={GATE_SCREEN_CLASS}>
      <form className={GATE_FORM_CLASS} onSubmit={handleSubmit}>
        <h1 className={GATE_TITLE_CLASS}>BootIT</h1>
        <p className={GATE_SUBTITLE_CLASS}>Teacher access</p>
        <TextField
          type="password"
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter teacher code"
          hasError={hasError}
          autoFocus
        />
        {hasError && <p className={GATE_ERROR_CLASS}>Incorrect code — try again.</p>}
        <Button type="submit">Enter</Button>
      </form>
    </div>
  )
}
