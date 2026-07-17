import { StudentEntry, Toast } from '@components'
import { useStudentSession } from './useStudentSession'
import StudentIde from './StudentIde'

export default function StudentView() {
  const { assignmentSet, toast, dismissToast, entry } = useStudentSession()

  // No assignment set yet → entry screen (no IDE). Join a class or start solo practice.
  if (!assignmentSet) {
    return (
      <>
        <StudentEntry {...entry} />
        {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
      </>
    )
  }

  return <StudentIde assignmentSet={assignmentSet} />
}
