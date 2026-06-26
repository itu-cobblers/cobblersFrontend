import { Button, TextField } from '@components'
import { useTeacherSession } from './TeacherDashboard.hooks'
import { formatTimerEnds } from './TeacherDashboard.utils'
import {
  TEACHER_LAYOUT_CLASS,
  TEACHER_HEADER_CLASS,
  TEACHER_BRAND_CLASS,
  TEACHER_ROOM_CODE_CLASS,
  TEACHER_BODY_CLASS,
  TEACHER_CONTROLS_CLASS,
  TEACHER_SECTION_CLASS,
  TEACHER_SECTION_TITLE_CLASS,
  TEACHER_CODE_DISPLAY_CLASS,
  TEACHER_TIMER_ROW_CLASS,
  TEACHER_MINUTES_INPUT_CLASS,
  TEACHER_MINUTES_LABEL_CLASS,
  TEACHER_TIMER_STATUS_CLASS,
  TEACHER_ERROR_CLASS,
  TEACHER_HINT_CLASS,
  TEACHER_STUDENTS_CLASS,
  TEACHER_ROSTER_CLASS,
  TEACHER_ROSTER_ITEM_CLASS,
} from './TeacherDashboard.constants'

export default function TeacherDashboard() {
  const {
    sessionCode,
    isCreatingSession,
    sessionError,
    roster,
    minutes,
    isStartingTimer,
    timerEndsAt,
    timerError,
    handleCreateSession,
    handleStartTimer,
    handleMinutesChange,
    handleLogout,
  } = useTeacherSession()

  const hasSession = Boolean(sessionCode)
  const isTimerDisabled = !hasSession || isStartingTimer
  const createLabel = isCreatingSession ? 'Creating…' : 'Create session'
  const startLabel = isStartingTimer ? 'Starting…' : 'Start'

  return (
    <div className={TEACHER_LAYOUT_CLASS}>
      <header className={TEACHER_HEADER_CLASS}>
        <span className={TEACHER_BRAND_CLASS}>BootIT — Teacher</span>
        {sessionCode && (
          <span className={TEACHER_ROOM_CODE_CLASS}>
            Room: <strong>{sessionCode}</strong>
          </span>
        )}
        <Button variant="ghost" onClick={handleLogout}>
          Sign out
        </Button>
      </header>

      <div className={TEACHER_BODY_CLASS}>
        <aside className={TEACHER_CONTROLS_CLASS}>
          <section className={TEACHER_SECTION_CLASS}>
            <h2 className={TEACHER_SECTION_TITLE_CLASS}>Session</h2>
            {sessionCode ? (
              <div className={TEACHER_CODE_DISPLAY_CLASS}>{sessionCode}</div>
            ) : (
              <Button onClick={handleCreateSession} isLoading={isCreatingSession}>
                {createLabel}
              </Button>
            )}
            {sessionError && <p className={TEACHER_ERROR_CLASS}>{sessionError}</p>}
          </section>

          <section className={TEACHER_SECTION_CLASS}>
            <h2 className={TEACHER_SECTION_TITLE_CLASS}>Timer</h2>
            <div className={TEACHER_TIMER_ROW_CLASS}>
              <TextField
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                min={1}
                max={120}
                isDisabled={isTimerDisabled}
                className={TEACHER_MINUTES_INPUT_CLASS}
              />
              <span className={TEACHER_MINUTES_LABEL_CLASS}>min</span>
              <Button onClick={handleStartTimer} isLoading={isStartingTimer} isDisabled={isTimerDisabled}>
                {startLabel}
              </Button>
            </div>
            {timerEndsAt && (
              <p className={TEACHER_TIMER_STATUS_CLASS}>
                Timer running — ends at {formatTimerEnds(timerEndsAt)}
              </p>
            )}
            {timerError && <p className={TEACHER_ERROR_CLASS}>{timerError}</p>}
            {!sessionCode && (
              <p className={TEACHER_HINT_CLASS}>Create a session first to enable timer.</p>
            )}
          </section>
        </aside>

        <main className={TEACHER_STUDENTS_CLASS}>
          <h2 className={TEACHER_SECTION_TITLE_CLASS}>Students ({roster.length})</h2>
          {roster.length === 0 ? (
            <p className={TEACHER_HINT_CLASS}>
              No students connected yet.{' '}
              {sessionCode
                ? `Share the room code "${sessionCode}" with your class.`
                : 'Create a session to get a room code.'}
            </p>
          ) : (
            <div className={TEACHER_ROSTER_CLASS}>
              {roster.map((student) => (
                <span key={student.studentId} className={TEACHER_ROSTER_ITEM_CLASS}>
                  {student.displayName}
                </span>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
