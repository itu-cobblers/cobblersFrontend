import { Spinner, Toast } from '@components'
import { EntryPortal } from '@views/EntryPortal'
import { useStudentApp } from "@views/StudentView/StudentView.hooks.ts"
import StudentWorkspace from "@components/StudentWorkspace"
import { STUDENT_RESTORING_CLASS } from './StudentView.constants'

export default function StudentView() {
    const { isRestoring, toast, dismissToast, showToast, session, progress, entryActions } = useStudentApp()

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
        <>
            <StudentWorkspace
                assignmentSet={session.assignmentSet}

                sessionLabel={session.label}
                sessionActionLabel={session.actionLabel}
                onLeaveSession={session.onLeave}
                sessionCode={session.code}
                displayName={session.displayName}
                teacherFocusedAssignmentId={session.teacherFocusedAssignmentId}

                submissionHistory={progress.history}
                isHistoryLoading={progress.isLoading}
                onSubmissionMade={progress.onRefresh}
            />
            {toast && <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />}
        </>
    )
}