import { Button } from '@components'

import { revokeTeacher } from '@lib/teacherAuth'
import { clearPersistedTeacherSession } from '@lib/teacherSession'
import type { TeacherSessionCreatorProps } from './TeacherSessionCreator.types'
import {
    PORTAL_HEADING_CLASS,
    PORTAL_FIELD_CLASS,
} from '@components/PortalShell/PortalShell.constants'
import {
    CREATOR_COLUMN_CLASS,
    CREATOR_FIELD_ROW_CLASS,
    CREATOR_LABEL_CLASS,
    CREATOR_ERROR_CLASS,
    CREATOR_CTA_ROW_CLASS,
    CREATOR_TITLE,
} from './TeacherSessionCreator.constants'

export default function TeacherSessionCreator({ assignmentData, session }: TeacherSessionCreatorProps) {
    const { assignmentSets, selectedAssignmentSetId, setSelectedAssignmentSetId } = assignmentData
    const { isCreatingSession, sessionError, handleCreateSession: baseHandleCreateSession } = session

    const createLabel = isCreatingSession ? 'Creating…' : 'Create session'

    function handleLogout() {
        clearPersistedTeacherSession()
        revokeTeacher()
        window.location.reload()
    }

    function handleCreateSession() {
        baseHandleCreateSession(selectedAssignmentSetId)
    }

    return (
        <>
            <div className={CREATOR_COLUMN_CLASS}>
                <h2 className={PORTAL_HEADING_CLASS}>{CREATOR_TITLE}</h2>

                <div className={CREATOR_FIELD_ROW_CLASS}>
                <label className={CREATOR_LABEL_CLASS} htmlFor="teacher-assignmentSet-select">
                    Assignment set
                </label>
                <select
                    id="teacher-assignmentSet-select"
                    className={PORTAL_FIELD_CLASS}
                    value={selectedAssignmentSetId}
                    onChange={(event) => setSelectedAssignmentSetId(event.target.value)}
                >
                    {assignmentSets.length === 0 && <option value="">Loading assignment sets…</option>}
                    {assignmentSets.map((assignmentSet) => (
                        <option key={assignmentSet.assignmentSetId} value={assignmentSet.assignmentSetId}>
                            {assignmentSet.displayTitle}
                        </option>
                    ))}
                </select>
                </div>
            </div>

            {sessionError && <p className={CREATOR_ERROR_CLASS}>{sessionError}</p>}

            <div className={CREATOR_CTA_ROW_CLASS}>
                <Button variant="ghost" onClick={handleLogout}>
                    Sign out
                </Button>
                <Button
                    onClick={handleCreateSession}
                    isLoading={isCreatingSession}
                    isDisabled={!selectedAssignmentSetId}
                >
                    {createLabel}
                </Button>
            </div>
        </>
    )
}
