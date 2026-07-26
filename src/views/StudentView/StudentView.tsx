import { Spinner, Toast, WelcomeBackBanner } from '@components'
import { EntryPortal } from '@views/EntryPortal'
import { useStudentSession } from './useStudentSession'
import StudentIde from './StudentIde'
import { STUDENT_RESTORING_CLASS } from './StudentView.constants'

export default function StudentView() {
  const { assignmentSet, isRestoring, session, toast, dismissToast, entry, resume, progress } = useStudentSession()

  // The resume prompt is independent of which screen is showing (entry or
  // IDE) — a returning student can be nudged before ever picking join/solo.
  // Their history now lives inline as the IDE rail's History tab, so it has
  // nothing to show before an assignment set is loaded.
  const overlays = resume && <WelcomeBackBanner {...resume} />

  // Checking for a persisted join/solo session before deciding which screen to show.
  if (isRestoring) {
    return (
      <div className={STUDENT_RESTORING_CLASS}>
        <Spinner />
        {overlays}
      </div>
    )
  }

  // No assignment set yet → entry screen (no IDE). Join a class or start solo practice.
  if (!assignmentSet) {
    return (
      <>
        <EntryPortal {...entry} />
        {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
        {overlays}
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
      {overlays}
    </>
  )
}
