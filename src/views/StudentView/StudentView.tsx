import { StudentEntry, Toast } from '@components'
import { useStudentSession } from './useStudentSession'
import StudentIde from './StudentIde'

export default function StudentView() {
  const { taskset, toast, dismissToast, entry } = useStudentSession()

  // No taskset yet → entry screen (no IDE). Join a class or start solo practice.
  if (!taskset) {
    return (
      <>
        <StudentEntry {...entry} />
        {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
      </>
    )
  }

  return <StudentIde taskset={taskset} />
}
