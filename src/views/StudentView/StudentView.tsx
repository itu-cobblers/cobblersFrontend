import { Spinner, StudentEntry, Toast } from '@components'
import { useStudentSession } from './useStudentSession'
import StudentIde from './StudentIde'
import { STUDENT_RESTORING_CLASS } from './StudentView.constants'

export default function StudentView() {
  const { assignmentSet, isRestoring, session, toast, dismissToast, entry } = useStudentSession()

  // Checking for a persisted join/solo session before deciding which screen to show.
  if (isRestoring) {
    return (
      <div className={STUDENT_RESTORING_CLASS}>
        <Spinner />
      </div>
    )
  }

  // No assignment set yet → entry screen (no IDE). Join a class or start solo practice.
  if (!assignmentSet) {
    return (
      <>
        <StudentEntry {...entry} />
        {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
      </>
    )
  }

  return (
    <StudentIde
      assignmentSet={assignmentSet}
      sessionLabel={session.label}
      sessionActionLabel={session.actionLabel}
      onLeaveSession={session.onLeave}
    />
  )
}
