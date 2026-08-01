import { useState } from 'react'
import {
    ProblemsList,
    TeacherFollowBanner,
    AssignmentPanel,
    CodeFileTabs,
    CodeEditor,
    OutputPanel,
    PredictPanel,
    ProjectPanel
} from '@components'
import {
    STUDENT_WORKSPACE_LAYOUT_CLASS,
    STUDENT_WORKSPACE_GRID_CLASS,
    STUDENT_WORKSPACE_GLOW_CLASS,
    STUDENT_WORKSPACE_MAIN_CLASS,
    STUDENT_WORKSPACE_CLASS,
    STUDENT_WORKSPACE_CONTENT_COLUMN_CLASS,
    STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS,
} from './StudentWorkspace.constants'

import { useWorkspaceProgress } from './hooks/useWorkspaceProgress'
import { useLocalDrafts } from './hooks/useLocalDrafts'
import { useAssignmentData } from './hooks/useAssignmentData.ts'
import { useWorkspaceMode } from './hooks/useWorkspaceMode'
import { useWorkspaceSubmit } from './hooks/useWorkspaceSubmit'
import type { AssignmentSet, SubmissionHistoryItem, SubmissionDetails, SourceFile } from '@types'
import {fetchSubmissionDetailsById} from "@lib/submissionApi.ts";

// Helper function to safely parse files from stringified content
const safeParseFiles = (content: string): SourceFile[] => {
    try {
        return JSON.parse(content) as SourceFile[]
    } catch {
        return []
    }
}

interface StudentWorkspaceProps {
    assignmentSet: AssignmentSet
    sessionLabel: string
    sessionActionLabel: string
    onLeaveSession: () => void
    sessionCode?: string
    displayName: string
    teacherFocusedAssignmentId: number | null
    submissionHistory: SubmissionHistoryItem[]
    isHistoryLoading: boolean
    onSubmissionMade: () => void
}

export default function StudentWorkspace(props: StudentWorkspaceProps) {
    const [viewingSubmission, setViewingSubmission] = useState<SubmissionDetails | null>(null)
    const [isLoadingHistoryDetail, setIsLoadingHistoryDetail] = useState(false)

    const assignmentData = useAssignmentData(
        props.assignmentSet,
        props.submissionHistory
    )

    const progress = useWorkspaceProgress({
        assignmentSet: props.assignmentSet,
        submissionHistory: props.submissionHistory,
        teacherFocusedAssignmentId: props.teacherFocusedAssignmentId,
        getAssignment: assignmentData.getAssignment
    })

    const activeAssignment = progress.activeAssignment
    const drafts = useLocalDrafts(props.assignmentSet.assignments)

    const mode = useWorkspaceMode({
        activeAssignment,
        drafts,
        solutions: assignmentData,
        viewingSubmission,
        onExitHistoryView: () => setViewingSubmission(null)
    })

    const submit = useWorkspaceSubmit({
        activeAssignment,
        sessionCode: props.sessionCode,
        currentContent: mode.currentContent,
        assignmentProgress: progress.assignmentProgress,
        solutions: assignmentData,
        onSubmissionMade: props.onSubmissionMade
    })

    // Fetch details when a history row is clicked
    const handleViewSubmission = async (item: SubmissionHistoryItem) => {
        if (isLoadingHistoryDetail) return

        setIsLoadingHistoryDetail(true)
        try {
            const details = await fetchSubmissionDetailsById(item.subId)
            if (details) {
                setViewingSubmission(details)
            }
        } catch (error) {
            console.error('Failed to fetch submission details', error)
        } finally {
            setIsLoadingHistoryDetail(false)
        }
    }

    const isCompleted = progress.assignmentProgress.completedAssignments.has(activeAssignment.id)
    const hasSubmitted = props.submissionHistory.some(item => item.assignmentId === activeAssignment.id)

    const isSolutionVisible = assignmentData.isSolutionVisible[activeAssignment.id] ?? false
    const isLoadingSolution = assignmentData.loadingId === activeAssignment.id

    const canRevealAnswer = hasSubmitted && !isCompleted
    const canMarkAsDone = isSolutionVisible && !isCompleted

    const defaultSubmitStatus = submit.isSubmitting ? 'waiting' : submit.submitFlash ? (submit.submitFlash.passed ? 'success' : 'error') : 'idle'
    const submitStatus = viewingSubmission ? (viewingSubmission.passed ? 'success' : 'error') : defaultSubmitStatus

    return (
        <div className={STUDENT_WORKSPACE_LAYOUT_CLASS}>
            <div className={STUDENT_WORKSPACE_GRID_CLASS} />
            <div className={STUDENT_WORKSPACE_GLOW_CLASS} />
            <div className={STUDENT_WORKSPACE_MAIN_CLASS}>

                <ProblemsList
                    {...progress.problemsListProps}
                    sessionLabel={props.sessionLabel}
                    displayName={props.displayName}
                    onLeaveSession={props.onLeaveSession}
                    leaveLabel={props.sessionActionLabel}
                    isHistoryLoading={props.isHistoryLoading}
                />

                <div className={STUDENT_WORKSPACE_CONTENT_COLUMN_CLASS}>
                    {progress.followBannerProps && <TeacherFollowBanner {...progress.followBannerProps} />}

                    <div className={STUDENT_WORKSPACE_CLASS}>
                        <AssignmentPanel
                            {...progress.assignmentPanelProps}
                            feedback={submit.feedback ?? undefined}
                            onViewSubmission={handleViewSubmission}
                            viewingSubmissionId={viewingSubmission?.subId}
                        />

                        <div className={STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS}>
                            {(activeAssignment.kind === 'code' || activeAssignment.kind === 'project') && (
                                <CodeFileTabs
                                    files={mode.tabFiles}
                                    activeIndex={mode.activeTabIndex}
                                    onSelectFile={mode.handleSelectFile}
                                    isRunning={submit.isRunning}
                                    onRun={submit.handleRunCode}
                                    viewStatusLabel={mode.viewStatusLabel}
                                    onExitView={mode.onExitView}
                                />
                            )}
                            {(activeAssignment.kind === 'code' ||
                                activeAssignment.kind === 'project' ||
                                activeAssignment.kind === 'predict') && (
                                <CodeEditor
                                    key={mode.editorRemountKey}
                                    value={mode.editorValue}
                                    onChange={mode.handleEditorChange}
                                    isReadOnly={mode.isReadOnly}
                                />
                            )}
                            {activeAssignment.kind === 'code' && (
                                <OutputPanel
                                    output={
                                        viewingSubmission
                                            ? (viewingSubmission.result?.stdout?.trim() || viewingSubmission.result?.stderr || '')
                                            : submit.outputState.output
                                    }
                                    status={viewingSubmission ? (viewingSubmission.result?.status ?? null ) : submit.outputState.status}
                                    footer={{
                                        submitStatus,
                                        onSubmit: submit.handleSubmitCode,
                                        canRevealAnswer,
                                        isSolutionVisible,
                                        isLoadingSolution,
                                        onToggleSolution: () => assignmentData.toggleSolution(activeAssignment.id, activeAssignment.kind),
                                        canMarkAsDone,
                                        isMarkingDone: submit.isMarkingDone,
                                        onMarkAsDone: submit.handleMarkAsDone
                                    }}
                                />
                            )}
                            {activeAssignment.kind === 'predict' && (
                                <PredictPanel
                                    answer={viewingSubmission ? viewingSubmission.content : (drafts.state.predict[activeAssignment.id] ?? '')}
                                    status={viewingSubmission ? (viewingSubmission.passed ? 'correct' : 'tried' ) : submit.predictStatus}
                                    isSubmitting={viewingSubmission ? false : submit.isSubmittingPredict}
                                    isMarkingDone={submit.isMarkingDone}
                                    lastAnswerCorrect={viewingSubmission ? viewingSubmission.passed : (submit.submitFlash?.passed ?? null)}
                                    expectedOutput={activeAssignment.expectedOutput}
                                    canRevealAnswer={canRevealAnswer}
                                    isSolutionVisible={isSolutionVisible}
                                    onToggleSolution={() => assignmentData.toggleSolution(activeAssignment.id, activeAssignment.kind)}
                                    canMarkAsDone={canMarkAsDone}
                                    onMarkAsDone={submit.handleMarkAsDone}
                                    onAnswerChange={(val) => drafts.updatePredict(activeAssignment.id, val)}
                                    onSubmit={submit.handlePredictSubmit}
                                />
                            )}
                            {activeAssignment.kind === 'project' && (
                                <ProjectPanel
                                    files={viewingSubmission ? safeParseFiles(viewingSubmission.content) : (drafts.state.project[activeAssignment.id] ?? [])}
                                    onFilesChange={(files) => drafts.updateProject(activeAssignment.id, files)}
                                    hasSubmitted={hasSubmitted}
                                    isSubmitting={viewingSubmission ? false : submit.isSubmitting}
                                    lastSubmitPassed={viewingSubmission ? viewingSubmission.passed : (submit.submitFlash?.passed ?? null)}
                                    onSubmit={submit.handleProjectSubmit}
                                    isLoadingSolution={isLoadingSolution}
                                    isSolutionVisible={isSolutionVisible}
                                    onToggleSolution={() => assignmentData.toggleSolution(activeAssignment.id, activeAssignment.kind)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}