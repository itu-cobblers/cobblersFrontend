import { useAssignmentData } from './hooks/useAssignmentData'
import { useSessionLifecycle } from './hooks/useSessionLifecycle'
import {TeacherSessionCreator} from "@components/TeacherSessionCreator";
import {TeacherWorkspace} from "@components/TeacherWorkspace";
import {
  TEACHER_LAYOUT_CLASS,
  TEACHER_RESTORING_CLASS,
  TEACHER_SECTION_LABEL
} from "@views/TeacherDashboard/TeacherDashboard.constants.ts";
import {useState} from "react";
import {Spinner, AppHeader, TimerMenu, RoomCodeModal, PortalShell} from "@components";

export default function TeacherDashboard() {
  const assignmentData = useAssignmentData()
  const [isRoomCodeOpen, setIsRoomCodeOpen] = useState(false)

  const session = useSessionLifecycle(assignmentData.setSelectedAssignmentSetId)

  if (session.isRestoringSession) {
    return <div className={TEACHER_RESTORING_CLASS}><Spinner /></div>
  }

  if (!session.sessionCode) {
    return (
        <PortalShell>
          <TeacherSessionCreator assignmentData={assignmentData} session={session} />
        </PortalShell>
    )
  }

  return (
      <div className={TEACHER_LAYOUT_CLASS}>
        <AppHeader
            variant="bar"
            section={TEACHER_SECTION_LABEL}
            actions={
              session.sessionCode ? (
                  <TimerMenu
                      minutes={session.minutes}
                      onMinutesChange={session.setMinutes}
                      onStartTimer={session.handleStartTimer}
                      isStartingTimer={session.isStartingTimer}
                      timerEndsAt={session.timerEndsAt}
                      timerError={session.timerError}
                  />
              ) : undefined
            }
            sessionLabel={session.sessionCode ? `Room: ${session.sessionCode}` : undefined}
            onSessionLabelClick={session.sessionCode ? () => setIsRoomCodeOpen(true) : undefined}
            onLeaveSession={session.sessionCode ? session.handleEndSession : undefined}
            leaveLabel={session.isEndingSession ? 'Ending session…' : 'End session'}
        />

        {session.sessionCode && (
            <RoomCodeModal
                isOpen={isRoomCodeOpen}
                onClose={() => setIsRoomCodeOpen(false)}
                sessionCode={session.sessionCode}
            />
        )}

        <TeacherWorkspace
            sessionCode={session.sessionCode}
            assignmentData={assignmentData}
        />
      </div>
  )
}