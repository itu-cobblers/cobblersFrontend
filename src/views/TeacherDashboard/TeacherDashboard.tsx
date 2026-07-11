import { Button, TextField, TasksetPreview, StudentRoster } from '@components'
import { useTeacherSession } from './TeacherDashboard.hooks'
import { formatTimerEnds } from './TeacherDashboard.utils'
import {
  TEACHER_LAYOUT_CLASS,
  TEACHER_HEADER_CLASS,
  TEACHER_BRAND_CLASS,
  TEACHER_ROOM_CODE_CLASS,
  TEACHER_BODY_CLASS,
  TEACHER_SECTION_CLASS,
  TEACHER_SECTION_TITLE_CLASS,
  TEACHER_CODE_DISPLAY_CLASS,
  TEACHER_CODE_CAPTION_CLASS,
  TEACHER_TASKSET_ROW_CLASS,
  TEACHER_TASKSET_LABEL_CLASS,
  TEACHER_TASKSET_SELECT_CLASS,
  TEACHER_TIMER_ROW_CLASS,
  TEACHER_MINUTES_INPUT_CLASS,
  TEACHER_MINUTES_LABEL_CLASS,
  TEACHER_TIMER_STATUS_CLASS,
  TEACHER_ERROR_CLASS,
  TEACHER_HINT_CLASS,
  TEACHER_BROWSE_CLASS,
  TEACHER_BROWSE_HEAD_CLASS,
  TEACHER_BROWSE_TITLE_CLASS,
  TEACHER_BROWSE_SUBTITLE_CLASS,
  TEACHER_BROWSE_ACTIONS_CLASS,
  TEACHER_SESSION_ASIDE_CLASS,
  TEACHER_STUDENTS_CLASS,
} from './TeacherDashboard.constants'

export default function TeacherDashboard() {
  const {
    tasksets,
    selectedTasksetId,
    onTasksetChange,
    previewGroups,
    previewTitle,
    sessionCode,
    isCreatingSession,
    sessionError,
    students,
    minutes,
    isStartingTimer,
    timerEndsAt,
    timerError,
    handleCreateSession,
    handleStartTimer,
    handleMinutesChange,
    handleLogout,
  } = useTeacherSession()

  const createLabel = isCreatingSession ? 'Creating…' : 'Create session'
  const startLabel = isStartingTimer ? 'Starting…' : 'Start timer'

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

      {!sessionCode ? (
        // ── Browse: pick a task set and read through its tasks (read-only) ──────
        <div className={TEACHER_BROWSE_CLASS}>
          <div className={TEACHER_BROWSE_HEAD_CLASS}>
            <h1 className={TEACHER_BROWSE_TITLE_CLASS}>Start a session</h1>
            <p className={TEACHER_BROWSE_SUBTITLE_CLASS}>
              Pick a task set and preview its tasks. Create a session when you're ready to open the
              room to students.
            </p>
          </div>

          <div className={TEACHER_BROWSE_ACTIONS_CLASS}>
            <div className={TEACHER_TASKSET_ROW_CLASS}>
              <label className={TEACHER_TASKSET_LABEL_CLASS} htmlFor="teacher-taskset-select">
                Task set
              </label>
              <select
                id="teacher-taskset-select"
                className={TEACHER_TASKSET_SELECT_CLASS}
                value={selectedTasksetId}
                onChange={(event) => onTasksetChange(event.target.value)}
              >
                {tasksets.length === 0 && <option value="">Loading task sets…</option>}
                {tasksets.map((taskset) => (
                  <option key={taskset.tasksetId} value={taskset.tasksetId}>
                    {taskset.displayTitle}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleCreateSession}
              isLoading={isCreatingSession}
              isDisabled={!selectedTasksetId}
            >
              {createLabel}
            </Button>
          </div>
          {sessionError && <p className={TEACHER_ERROR_CLASS}>{sessionError}</p>}

          <TasksetPreview title={previewTitle} groups={previewGroups} />
        </div>
      ) : (
        // ── Active session: code + timer + taskset (left), student status (right) ─
        <div className={TEACHER_BODY_CLASS}>
          <aside className={TEACHER_SESSION_ASIDE_CLASS}>
            <section className={TEACHER_SECTION_CLASS}>
              <span className={TEACHER_CODE_CAPTION_CLASS}>Room code</span>
              <div className={TEACHER_CODE_DISPLAY_CLASS}>{sessionCode}</div>
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
                  isDisabled={isStartingTimer}
                  className={TEACHER_MINUTES_INPUT_CLASS}
                />
                <span className={TEACHER_MINUTES_LABEL_CLASS}>min</span>
                <Button onClick={handleStartTimer} isLoading={isStartingTimer}>
                  {startLabel}
                </Button>
              </div>
              {timerEndsAt && (
                <p className={TEACHER_TIMER_STATUS_CLASS}>
                  Timer running — ends at {formatTimerEnds(timerEndsAt)}
                </p>
              )}
              {timerError && <p className={TEACHER_ERROR_CLASS}>{timerError}</p>}
            </section>

            <section className={TEACHER_SECTION_CLASS}>
              <h2 className={TEACHER_SECTION_TITLE_CLASS}>Task set</h2>
              <TasksetPreview groups={previewGroups} />
            </section>
          </aside>

          <main className={TEACHER_STUDENTS_CLASS}>
            <h2 className={TEACHER_SECTION_TITLE_CLASS}>Students ({students.length})</h2>
            {students.length === 0 ? (
              <p className={TEACHER_HINT_CLASS}>
                No students connected yet. Share the room code "{sessionCode}" with your class.
              </p>
            ) : (
              <StudentRoster students={students} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}
