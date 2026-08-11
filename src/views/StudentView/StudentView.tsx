import { Spinner, Toast, AppHeader, AppColophon, ViewModeToggle } from '@components'
import { EntryPortal } from '@views/EntryPortal'
import { useStudentApp } from "@views/StudentView/StudentView.hooks.ts"
import StudentWorkspace from "@components/StudentWorkspace"
import { SlidesWorkspace } from "@components/SlidesWorkspace"
import { STUDENT_RESTORING_CLASS, STUDENT_WORKSPACE_LAYOUT_CLASS, WORKSPACE_SECTION_LABEL } from './StudentView.constants'

export default function StudentView() {
    const { isRestoring, toast, dismissToast, showToast, session, progress, entryActions, view } = useStudentApp()

    if (isRestoring) {
        return (
            <div className={STUDENT_RESTORING_CLASS}>
                <Spinner />
            </div>
        )
    }

    if (!session.assignmentSet) {
        return (
            <>
                <EntryPortal
                    onJoinSuccess={entryActions.onJoinSuccess}
                    onSoloSuccess={entryActions.onSoloSuccess}
                    onError={(msg) => showToast(msg, 'error')}
                />
                {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
            </>
        )
    }

    return (
        <div className={STUDENT_WORKSPACE_LAYOUT_CLASS}>
            <AppHeader
                variant="bar"
                section={WORKSPACE_SECTION_LABEL}
                tabs={<ViewModeToggle viewMode={view.mode} onChange={view.onModeChange} />}
                sessionLabel={session.label}
                displayName={session.displayName}
                onLeaveSession={session.onLeave}
                leaveLabel={session.actionLabel}
            />

            {view.mode === 'slides' ? (
                <SlidesWorkspace
                    assignmentSet={session.assignmentSet}
                    pendingSlideId={view.pendingSlideId}
                    onConsumedPendingSlide={view.onConsumedPendingSlide}
                    onNavigateToAssignment={view.navigateToAssignment}
                    initialSlideId={view.lastSlideId}
                    onActiveSlideChange={view.onActiveSlideChange}
                    teacherFocus={session.teacherFocus}
                />
            ) : (
                <StudentWorkspace
                    assignmentSet={session.assignmentSet}
                    sessionCode={session.code}
                    teacherFocus={session.teacherFocus}
                    timerEndsAt={session.timerEndsAt}
                    isHandRaised={session.isHandRaised}
                    onToggleHand={session.onToggleHand}

                    submissionHistory={progress.history}
                    isHistoryLoading={progress.isLoading}
                    onSubmissionMade={progress.onRefresh}

                    pendingAssignmentId={view.pendingAssignmentId}
                    onConsumedPendingAssignment={view.onConsumedPendingAssignment}
                    onNavigateToSlide={view.navigateToSlide}
                />
            )}

            <AppColophon />
            {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
        </div>
    )
}