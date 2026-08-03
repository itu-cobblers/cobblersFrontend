import { useState, useMemo } from 'react'
import {
    AttendanceList,
    TeacherAssignmentPanel,
    TeacherProblemsList,
    CodeFileTabs,
    CodeEditor,
    OutputPanel,
    PredictPanel,
} from '@components'
import {
    TEACHER_WORKSPACE_MAIN_CLASS,
    TEACHER_WORKSPACE_PANEL_COLUMN_CLASS,
    TEACHER_WORKSPACE_EDITOR_COLUMN_CLASS,
} from './TeacherWorkspace.constants'
import { getProjectIdentity } from '@lib/projectIdentity'

import { useTeacherHydration } from './hooks/useTeacherHydration'
import { useTeacherLiveSession } from './hooks/useTeacherLiveSession'
import { useTeacherSelection } from './hooks/useTeacherSelection'
import { useTeacherSubmissionDetail } from './hooks/useTeacherSubmissionDetail'
import { useTeacherSolution } from './hooks/useTeacherSolution'

import type { TeacherWorkspaceProps } from './TeacherWorkspace.types'
import { getEditorContent, getTabFiles } from "@components/TeacherWorkspace/TeacherWorkspace.utils.ts";
import {TeacherAssignmentFooter} from "@components/TeacherAssignmentFooter";

export default function TeacherWorkspace({ sessionCode, assignmentData, session }: TeacherWorkspaceProps) {
    const [isRailOpen, setIsRailOpen] = useState(true)

    const { attendanceList, allSubmissions, addSubmission, mergeLiveStudents } = useTeacherHydration(sessionCode)

    const { liveStudentIds, focusedAssignmentId, handleFocusAssignment } = useTeacherLiveSession({
        sessionCode,
        onSubmissionRecorded: addSubmission,
        onLiveStudents: mergeLiveStudents
    })

    const {
        selectedAssignmentId,
        activeAssignment,
        selectedStudentId,
        activeTab,
        setActiveTab,
        activeSubId,
        setActiveSubId,
        activeFileIndex,
        setActiveFileIndex,
        problemItems,
        attendanceStudents,
        filteredSubmissions,
        handleSelectAssignment,
        handleSelectStudent,
        handleClearStudentFilter
    } = useTeacherSelection({
        assignments: assignmentData.assignments,
        attendanceList,
        allSubmissions,
        liveStudentIds
    })

    const { submissionDetail, isLoadingDetail } = useTeacherSubmissionDetail(activeSubId)

    const {
        solutionData,
        isLoadingSolution,
        isSolutionVisible,
        isAnswerVisible,
        handleToggleSolution,
        handleToggleAnswer
    } = useTeacherSolution(selectedAssignmentId)

    const isCode = activeAssignment?.kind === 'code'
    const isPredict = activeAssignment?.kind === 'predict'
    const isProject = activeAssignment?.kind === 'project'

    const tabFiles = useMemo(() => {
        return getTabFiles(activeAssignment, submissionDetail, activeSubId, solutionData, isSolutionVisible)
    }, [activeAssignment, submissionDetail, activeSubId, solutionData, isSolutionVisible])

    const editorValue = useMemo(() => {
        return getEditorContent(activeAssignment, submissionDetail, tabFiles, activeFileIndex, solutionData, isSolutionVisible)
    }, [activeAssignment, submissionDetail, tabFiles, activeFileIndex, solutionData, isSolutionVisible])

    const currentFileName = isPredict
        ? 'Snippet.java'
        : (tabFiles[activeFileIndex]?.name ?? 'Main.java')

    const modeString = isSolutionVisible ? 'solution' : activeSubId ? `sub-${activeSubId}` : 'starter'

    const editorRemountKey = `teacher-assignment-${selectedAssignmentId ?? 'none'}-${modeString}-${activeFileIndex}-${currentFileName}`

    const activeSubmission = filteredSubmissions.find(s => s.subId === activeSubId)
    const projectIdentity = isProject && activeAssignment ? getProjectIdentity(activeAssignment.title) : undefined

    const viewStatusLabel = isSolutionVisible
        ? 'Viewing reference solution'
        : activeSubmission
            ? `Viewing: ${activeSubmission.studentName}'s submission from ${new Date(activeSubmission.submittedAt).toLocaleString()}`
            : null

    return (
        <div className={TEACHER_WORKSPACE_MAIN_CLASS}>
            <TeacherProblemsList
                items={problemItems}
                activeId={selectedAssignmentId}
                onSelect={handleSelectAssignment}
                teacherFocusId={focusedAssignmentId}
                isOpen={isRailOpen}
                onToggleOpen={() => setIsRailOpen(!isRailOpen)}
                timerMinutes={session.minutes}
                onTimerMinutesChange={session.setMinutes}
                onStartTimer={session.handleStartTimer}
                isStartingTimer={session.isStartingTimer}
                timerEndsAt={session.timerEndsAt}
                timerError={session.timerError}
            />

            <AttendanceList
                students={attendanceStudents}
                activeStudentId={selectedStudentId}
                onSelectStudent={handleSelectStudent}
                selectedAssignmentTitle={activeAssignment?.title}
            />

            <div className={TEACHER_WORKSPACE_PANEL_COLUMN_CLASS}>
                <TeacherAssignmentPanel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    title={activeAssignment?.title || assignmentData.previewTitle || 'Assignments'}
                    lesson={activeAssignment?.lesson}
                    description={activeAssignment?.description ?? ''}
                    projectIdentity={projectIdentity}
                    hint={activeAssignment?.hint}
                    onFocusClick={() => selectedAssignmentId != null && handleFocusAssignment(selectedAssignmentId)}
                    isFocused={selectedAssignmentId != null && selectedAssignmentId === focusedAssignmentId}
                    selectedStudentName={attendanceStudents.find(s => s.studentId === selectedStudentId)?.displayName}
                    onClearStudentFilter={handleClearStudentFilter}
                    submissions={filteredSubmissions}
                    activeSubId={activeSubId}
                    onSelectSubmission={setActiveSubId}
                    onSelectStudentFilter={(studentId) => handleSelectStudent(studentId)}
                />
            </div>

            <div className={TEACHER_WORKSPACE_EDITOR_COLUMN_CLASS}>
                {(isCode || isProject) && tabFiles.length > 0 && (
                    <CodeFileTabs
                        files={tabFiles.map(f => ({ name: f.name }))}
                        activeIndex={activeFileIndex}
                        onSelectFile={setActiveFileIndex}
                    />
                )}
                <CodeEditor
                    key={editorRemountKey}
                    value={editorValue}
                    onChange={() => {}}
                    isReadOnly={true}
                />
                {isCode && (
                    <OutputPanel
                        output={activeSubId ? (submissionDetail?.result?.stdout || submissionDetail?.result?.stderr || '') : ''}
                        status={activeSubId ? (submissionDetail?.result?.status ?? null) : null}
                        placeHolder={activeSubId ? (isLoadingDetail ? 'Loading execution result...' : 'No output recorded.') : 'Select a submission to view output.'}
                    />
                )}
                {isPredict && activeAssignment && (
                    <PredictPanel
                        answer={activeSubId ? (submissionDetail?.content ?? '') : ''}
                        status={activeSubId ? (submissionDetail?.passed ? 'correct' : 'tried') : 'idle'}
                        expectedOutput={activeAssignment.expectedOutput}
                        isSolutionVisible={isAnswerVisible}
                        onAnswerChange={() => {}}
                    />
                )}
                <TeacherAssignmentFooter
                    isPredict={isPredict}
                    isCode={isCode}
                    isProject={isProject}
                    isAnswerVisible={isAnswerVisible}
                    isSolutionVisible={isSolutionVisible}
                    isLoadingSolution={isLoadingSolution}
                    onToggleAnswer={handleToggleAnswer}
                    onToggleSolution={handleToggleSolution}
                    viewStatusLabel={viewStatusLabel}
                />
            </div>
        </div>
    )
}