import { useState } from 'react'
import {
    AttendanceList,
    TeacherAssignmentPanel,
    TeacherCodeViewer,
    TeacherProblemsList,
    type CodeFileTab, type TeacherSubmissionItem, type AttendanceStudent, type TeacherProblemItem,
    type AssignmentPanelTab
} from '@components'
import { useLiveRoster } from './hooks/useLiveRoster'
import type { TeacherWorkspaceProps } from './TeacherWorkspace.types'

import { defaultStarter } from '@lib/defaultStarter'
import { getProjectIdentity } from '@lib/projectIdentity'
import {useTeacherUI} from "@components/TeacherWorkspace/hooks/useTesacherUI.ts";
import {TEACHER_BODY_CLASS} from "@components/TeacherWorkspace/TeacherWorkspace.constants.ts";

function starterFileTabs(files?: { name: string }[]): CodeFileTab[] {
    return files?.map((file) => ({ name: file.name })) ?? [{ name: 'Main.java' }]
}

export default function TeacherWorkspace({ sessionCode, assignmentData, session }: TeacherWorkspaceProps) {
    const roster = useLiveRoster(sessionCode, assignmentData.previewCount)
    const ui = useTeacherUI(assignmentData.previewAssignmentIds)

    const [isRailOpen, setIsRailOpen] = useState(true)
    const [activeTab, setActiveTab] = useState<AssignmentPanelTab>('description')
    const [activeSubId, setActiveSubId] = useState<string | null>(null)
    const [activeFileIndex, setActiveFileIndex] = useState(0)

    const { assignments, previewTitle } = assignmentData
    const { students, focusedAssignmentId, handleFocusAssignment } = roster
    const {
        selectedAssignmentId,
        selectedStudentId,
        handleSelectAssignment,
        handleSelectStudent,
        handleClearStudentFilter,
        solutionByAssignment,
        loadingSolutionAssignmentId,
        isSolutionVisibleByAssignment,
        isAnswerVisibleByAssignment,
        handleToggleSolution,
        handleToggleAnswer,
    } = ui
    const {
        minutes,
        isStartingTimer,
        timerEndsAt,
        timerError,
        isEndingSession,
        setMinutes: handleMinutesChange,
        handleStartTimer,
    } = session

    const problemItems: TeacherProblemItem[] =
        assignments.map((item) => ({
            id: item.id,
            title: item.title,
            kind: item.kind,
            passedNum: 0,
            totalNum: students.length,
            studentStatus: selectedStudentId ? 'untried' : undefined,
        })
    )

    const attendanceStudents: AttendanceStudent[] = students.map((s) => ({
        studentId: s.studentId,
        displayName: s.displayName,
        isActive: true,
        assignmentStatus: selectedAssignmentId ? 'untried' : undefined,
    }))

    const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId)
    const activeAssignmentItem = problemItems.find((p) => p.id === selectedAssignmentId) || problemItems[0]
    const activeStudent = students.find((s) => s.studentId === selectedStudentId)

    const submissions: TeacherSubmissionItem[] = []
    const activeSubmission = submissions.find((s) => s.subId === activeSubId)

    const starterTabs = activeAssignment?.kind === 'code' ? starterFileTabs(activeAssignment.starterFiles) : []
    const starterCode =
        activeAssignment?.kind === 'code'
            ? activeAssignment.starterFiles?.[activeFileIndex]?.content ?? activeAssignment.starter ?? defaultStarter
            : activeAssignment?.kind === 'predict'
                ? activeAssignment.snippet
                : ''

    const predictExpectedOutput = activeAssignment?.kind === 'predict' ? activeAssignment.expectedOutput : undefined
    const projectIdentity = activeAssignment?.kind === 'project' ? getProjectIdentity(activeAssignment.title) : undefined
    const editorKey = activeSubmission ? `sub-${activeSubmission.subId}` : `assignment-${selectedAssignmentId ?? 'none'}`

    async function handleEndSession() {
        await session.handleEndSession()
    }

    function handleSelectAssignmentAndResetFile(id: number) {
        setActiveFileIndex(0)
        setActiveSubId(null)
        handleSelectAssignment(id)
    }

    return (
        <div className={TEACHER_BODY_CLASS}>
            <TeacherProblemsList
                sessionCode={sessionCode}
                items={problemItems}
                activeId={selectedAssignmentId}
                onSelect={handleSelectAssignmentAndResetFile}
                teacherFocusId={focusedAssignmentId}
                isOpen={isRailOpen}
                onToggleOpen={() => setIsRailOpen(!isRailOpen)}
                minutes={minutes}
                isStartingTimer={isStartingTimer}
                timerEndsAt={timerEndsAt}
                timerError={timerError}
                onMinutesChange={handleMinutesChange}
                onStartTimer={handleStartTimer}
                onEndSession={handleEndSession}
                isEndingSession={isEndingSession}
            />

            <AttendanceList
                students={attendanceStudents}
                activeStudentId={selectedStudentId}
                onSelectStudent={handleSelectStudent}
                selectedAssignmentTitle={activeAssignmentItem?.title}
            />

            <div className="flex flex-[4] min-w-0 flex-col overflow-hidden">
                <TeacherAssignmentPanel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    title={activeAssignment?.title || activeAssignmentItem?.title || previewTitle || 'Assignments'}
                    lesson={activeAssignment?.lesson}
                    description={activeAssignment?.description ?? ''}
                    projectIdentity={projectIdentity}
                    hint={activeAssignment?.hint}
                    onFocusClick={() => selectedAssignmentId != null && handleFocusAssignment(selectedAssignmentId)}
                    isFocused={selectedAssignmentId != null && selectedAssignmentId === focusedAssignmentId}
                    selectedStudentName={activeStudent?.displayName}
                    onClearStudentFilter={handleClearStudentFilter}
                    submissions={submissions}
                    activeSubId={activeSubId}
                    onSelectSubmission={setActiveSubId}
                    onSelectStudentFilter={(studentId) => handleSelectStudent(studentId)}
                />
            </div>

            <TeacherCodeViewer
                assignmentKind={activeAssignment?.kind ?? 'code'}
                editorKey={editorKey}
                hasSubmission={Boolean(activeSubmission)}
                code={activeSubmission?.code ?? starterCode}
                fileTabs={starterTabs}
                activeFileIndex={activeFileIndex}
                onSelectFile={setActiveFileIndex}
                studentName={activeSubmission?.studentName}
                assignmentTitle={activeSubmission?.assignmentTitle}
                submittedAt={activeSubmission?.submittedAt}
                passed={activeSubmission?.passed}
                result={activeSubmission?.result}
                predictExpectedOutput={predictExpectedOutput}
                isAnswerVisible={selectedAssignmentId != null ? (isAnswerVisibleByAssignment[selectedAssignmentId] ?? false) : false}
                onToggleAnswer={() => {
                    if (selectedAssignmentId != null) handleToggleAnswer(selectedAssignmentId)
                }}
                solution={selectedAssignmentId != null ? solutionByAssignment[selectedAssignmentId] ?? null : null}
                isLoadingSolution={loadingSolutionAssignmentId === selectedAssignmentId}
                isSolutionVisible={selectedAssignmentId != null ? (isSolutionVisibleByAssignment[selectedAssignmentId] ?? false) : false}
                onToggleSolution={() => {
                    if (selectedAssignmentId != null) handleToggleSolution(selectedAssignmentId)
                }}
            />
        </div>
    )
}