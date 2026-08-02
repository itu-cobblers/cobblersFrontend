import { useAssignmentData } from './hooks/useAssignmentData'
import { useSessionLifecycle } from './hooks/useSessionLifecycle'
import {TeacherSessionCreator} from "@components/TeacherSessionCreator";
import {TeacherWorkspace} from "@components/TeacherWorkspace";
import {
  TEACHER_LAYOUT_CLASS,
  TEACHER_RESTORING_CLASS
} from "@views/TeacherDashboard/TeacherDashboard.constants.ts";
import {Spinner} from "@components";

export default function TeacherDashboard() {
  const assignmentData = useAssignmentData()

  const session = useSessionLifecycle(assignmentData.setSelectedAssignmentSetId)

  if (session.isRestoringSession) {
    return <div className={TEACHER_RESTORING_CLASS}><Spinner /></div>
  }

  return (
      <div className={TEACHER_LAYOUT_CLASS}>

        {!session.sessionCode ? (
            <TeacherSessionCreator
                assignmentData={assignmentData}
                session={session}
            />
        ) : (
            <TeacherWorkspace
                sessionCode={session.sessionCode}
                assignmentData={assignmentData}
                session={session}
            />
        )}
      </div>
  )
}