import { Spinner, Toast } from '@components'
import { EntryPortal } from '@views/EntryPortal'
import { useStudentSession } from './useStudentSession'
import StudentIde from './StudentIde'
import { STUDENT_RESTORING_CLASS } from './StudentView.constants'

export default function StudentView() {
  const { assignmentSet, isRestoring, session, toast, dismissToast, entry, progress } = useStudentSession()

  // Checking for a persisted join/solo session before deciding which screen to show.
  if (isRestoring) {
    return (
      <div className={STUDENT_RESTORING_CLASS}>
        <Spinner />
      </div>
    )
  }

  // No assignment set yet → entry screen (no IDE). Join today's session or start solo practice.
  if (!assignmentSet) {
    return (
      <>
        <EntryPortal {...entry} />
        {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
      </>
    )
  }

  return (
    <>
      <StudentIde
        assignmentSet={assignmentSet}
        sessionLabel={session.label}
        sessionActionLabel={session.actionLabel}
        onLeaveSession={session.onLeave}
        sessionCode={session.code}
        displayName={session.displayName}
        teacherFocusedAssignmentId={session.teacherFocusedAssignmentId}
        submissionHistory={progress.history}
        catalog={progress.catalog}
        isHistoryLoading={progress.isLoading}
        onSubmissionMade={progress.onRefresh}
      />
    </>
  )
}
