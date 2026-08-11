import { useAssignmentData } from './hooks/useAssignmentData'
import { useSessionLifecycle } from './hooks/useSessionLifecycle'
import { useTeacherHydration } from '@components/TeacherWorkspace/hooks/useTeacherHydration'
import { useTeacherLiveSession } from '@components/TeacherWorkspace/hooks/useTeacherLiveSession'
import {TeacherSessionCreator} from "@components/TeacherSessionCreator";
import {TeacherWorkspace} from "@components/TeacherWorkspace";
import {SlidesWorkspace} from "@components/SlidesWorkspace";
import {
  TEACHER_LAYOUT_CLASS,
  TEACHER_RESTORING_CLASS,
  TEACHER_SECTION_LABEL
} from "@views/TeacherDashboard/TeacherDashboard.constants.ts";
import {useEffect, useState} from "react";
import {Spinner, AppHeader, RoomCodeModal, PortalShell, AppColophon, ViewModeToggle} from "@components";
import type {ViewMode} from "@components";
import { getPersistedTeacherWorkspaceUI, setPersistedTeacherWorkspaceUI } from '@lib/teacherWorkspaceUI'

export default function TeacherDashboard() {
  const assignmentData = useAssignmentData()
  const [isRoomCodeOpen, setIsRoomCodeOpen] = useState(false)

  const session = useSessionLifecycle(assignmentData.setSelectedAssignmentSetId)

  // Hoisted above the Slides/Practice tab swap (rather than living inside
  // `TeacherWorkspace`, which unmounts when the teacher switches to Slides) so
  // the roster, submissions and live focus state survive switching tabs.
  const hydration = useTeacherHydration(session.sessionCode)
  const liveSession = useTeacherLiveSession({
    sessionCode: session.sessionCode,
    onSubmissionRecorded: hydration.addSubmission,
    onLiveStudents: hydration.mergeLiveStudents,
  })

  // Only a genuinely fresh session (nothing persisted yet) defaults to
  // Slides; a refresh mid-session restores whichever tab/page was last open.
  const [viewMode, setViewMode] = useState<ViewMode>(() => getPersistedTeacherWorkspaceUI()?.viewMode ?? 'slides')
  const [lastSlideId, setLastSlideId] = useState<number | null>(() => getPersistedTeacherWorkspaceUI()?.lastSlideId ?? null)
  const [pendingSlideId, setPendingSlideId] = useState<number | null>(null)

  useEffect(() => {
    setPersistedTeacherWorkspaceUI({ viewMode, lastSlideId })
  }, [viewMode, lastSlideId])

  function navigateToSlide(slideId: number) {
    setPendingSlideId(slideId)
    setLastSlideId(slideId)
    setViewMode('slides')
  }

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
            tabs={<ViewModeToggle viewMode={viewMode} onChange={setViewMode} />}
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

        {viewMode === 'slides' ? (
            <SlidesWorkspace
                assignmentSet={{
                    assignmentSetId: assignmentData.selectedAssignmentSetId,
                    displayTitle: assignmentData.previewTitle,
                    assignments: assignmentData.assignments,
                }}
                onNavigateToAssignment={() => setViewMode('practice')}
                pendingSlideId={pendingSlideId}
                onConsumedPendingSlide={() => setPendingSlideId(null)}
                initialSlideId={lastSlideId}
                onActiveSlideChange={setLastSlideId}
                focusedSlideId={liveSession.teacherFocus?.kind === 'slide' ? liveSession.teacherFocus.id : null}
                onToggleFocusSlide={liveSession.handleToggleFocusSlide}
            />
        ) : (
            <TeacherWorkspace
                sessionCode={session.sessionCode}
                assignmentData={assignmentData}
                session={session}
                hydration={hydration}
                liveSession={liveSession}
                onNavigateToSlide={navigateToSlide}
            />
        )}

        <AppColophon />
      </div>
  )
}
