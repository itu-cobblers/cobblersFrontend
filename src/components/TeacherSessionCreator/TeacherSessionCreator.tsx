import { Button } from '@components'

import { revokeTeacher } from '@lib/teacherAuth'
import { clearPersistedTeacherSession } from '@lib/teacherSession'
import type { TeacherSessionCreatorProps } from './TeacherSessionCreator.types'
import {
    TEACHER_ASSIGNMENT_SET_ROW_CLASS,
    TEACHER_BROWSE_ACTIONS_CLASS,
    TEACHER_BROWSE_CLASS,
    TEACHER_BROWSE_HEAD_CLASS,
    TEACHER_BROWSE_SUBTITLE_CLASS,
    TEACHER_BROWSE_TITLE_CLASS,
    TEACHER_ASSIGNMENT_SET_LABEL_CLASS,
    TEACHER_ASSIGNMENT_SET_SELECT_CLASS,
    TEACHER_ERROR_CLASS
} from "@components/TeacherSessionCreator/TeacherSessionCreator.constants.ts";

export default function TeacherSessionCreator({ assignmentData, session }: TeacherSessionCreatorProps) {
    const {
        assignmentSets,
        selectedAssignmentSetId,
        setSelectedAssignmentSetId
    } = assignmentData

    const {
        isCreatingSession,
        sessionError,
        handleCreateSession: baseHandleCreateSession
    } = session

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
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
            <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-md">
                <span className="text-sm font-bold text-foreground">BootIT Teacher Portal</span>
                <Button variant="ghost" onClick={handleLogout}>
                    Sign out
                </Button>
            </header>

            <div className={TEACHER_BROWSE_CLASS}>
                <div className={TEACHER_BROWSE_HEAD_CLASS}>
                    <h1 className={TEACHER_BROWSE_TITLE_CLASS}>Start a session</h1>
                    <p className={TEACHER_BROWSE_SUBTITLE_CLASS}>
                        Select an assignment set below to preview tasks, then create a session room for your students.
                    </p>
                </div>

                <div className={TEACHER_BROWSE_ACTIONS_CLASS}>
                    <div className={TEACHER_ASSIGNMENT_SET_ROW_CLASS}>
                        <label className={TEACHER_ASSIGNMENT_SET_LABEL_CLASS} htmlFor="teacher-assignmentSet-select">
                            Assignment set
                        </label>
                        <select
                            id="teacher-assignmentSet-select"
                            className={TEACHER_ASSIGNMENT_SET_SELECT_CLASS}
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
                    <Button
                        onClick={handleCreateSession}
                        isLoading={isCreatingSession}
                        isDisabled={!selectedAssignmentSetId}
                    >
                        {createLabel}
                    </Button>
                </div>
                {sessionError && <p className={TEACHER_ERROR_CLASS}>{sessionError}</p>}
            </div>
        </div>
    )
}