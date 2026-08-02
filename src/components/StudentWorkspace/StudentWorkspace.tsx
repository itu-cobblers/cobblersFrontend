import { useState } from 'react'
import type { AssignmentPanelTab } from '@components/AssignmentPanel/AssignmentPanel.types'
import { getSubmissionNumber } from '@components/SubmissionBanner'
import {
    AppHeader,
    SubmissionBanner,
    ProblemsList,
    TeacherFollowBanner,
    AssignmentPanel,
    CodeFileTabs,
    CodeEditor,
    OutputPanel,
    PredictPanel,
    ProjectPanel,
    AssignmentFooter
} from '@components'
import {
    STUDENT_WORKSPACE_LAYOUT_CLASS,
    STUDENT_WORKSPACE_MAIN_CLASS,
    STUDENT_WORKSPACE_CLASS,
    STUDENT_WORKSPACE_CONTENT_COLUMN_CLASS,
    STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS,
    WORKSPACE_SECTION_LABEL,
} from './StudentWorkspace.constants'

import { useWorkspaceProgress } from './hooks/useWorkspaceProgress'
import { useLocalDrafts } from './hooks/useLocalDrafts'
import { useAssignmentData } from './hooks/useAssignmentData.ts'
import { useWorkspaceMode } from './hooks/useWorkspaceMode'
import { useWorkspaceSubmit } from './hooks/useWorkspaceSubmit'
import type { AssignmentSet, SubmissionHistoryItem, SubmissionDetails } from '@types'
import {fetchSubmissionDetailsById} from "@lib/submissionApi.ts";

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

    const actualContent = activeAssignment.kind === 'predict'
        ? drafts.state.predict[activeAssignment.id] ?? ''
        : (activeAssignment.kind === 'project' || (activeAssignment.kind === 'code' && activeAssignment.starterFiles))
            ? mode.currentStudentFiles
            : mode.currentContent

    const submit = useWorkspaceSubmit({
        activeAssignment,
        sessionCode: props.sessionCode,
        currentContent: actualContent,
        assignmentProgress: progress.assignmentProgress,
        solutions: assignmentData,
        onSubmissionMade: props.onSubmissionMade,
        viewingSubmissionId: viewingSubmission?.subId
    })

    const handleToggleSolution = () => {
        if (viewingSubmission) {
            setViewingSubmission(null);
        }
        assignmentData.toggleSolution(activeAssignment.id, activeAssignment.kind);
    }

    const handleGlobalSubmit = async () => {
        let submitResult = null;

        try {
            if (activeAssignment.kind === 'code') {
                submitResult = await submit.handleSubmitCode();
            } else if (activeAssignment.kind === 'predict') {
                submitResult = await submit.handlePredictSubmit();
            } else if (activeAssignment.kind === 'project') {
                submitResult = await submit.handleProjectSubmit();
            }
        } catch (error) {
            console.error("Submit failed:", error);
            return;
        }

        if (submitResult && submitResult.subId) {
            props.onSubmissionMade();
            progress.assignmentPanelProps.onTabChange('submissions');
            setViewingSubmission({
                sessionId: props.sessionCode ?? "",
                studentId: localStorage.getItem('bootit.studentId') ?? "",
                subId: submitResult.subId,
                assignmentId: activeAssignment.id,
                passed: submitResult.passed,
                result: submitResult.result,
                content: activeAssignment.kind === 'predict'
                    ? drafts.state.predict[activeAssignment.id] ?? ''
                    : (activeAssignment.kind === 'project' || (activeAssignment.kind === 'code' && activeAssignment.starterFiles))
                        ? JSON.stringify(mode.currentStudentFiles)
                        : mode.currentContent,
                submittedAt: submitResult.submittedAt
        });
        }
    }

    const handleBackToEditor = () => {
        if(mode.onExitView) mode.onExitView();
        progress.assignmentPanelProps.onTabChange('description');
    }

    // Going back to Description is the same intent as Back to Editor: leave the
    // past submission behind. Without this the editor stays stuck on it while
    // the panel shows the current assignment, which reads as a bug.
    const handlePanelTabChange = (tab: AssignmentPanelTab) => {
        if (tab === 'description' && viewingSubmission) {
            handleBackToEditor()
            return
        }
        progress.assignmentPanelProps.onTabChange(tab)
    }

    // Fetch details when a history row is clicked
    const handleViewSubmission = async (item: SubmissionHistoryItem) => {
        if (isLoadingHistoryDetail) return

        setIsLoadingHistoryDetail(true)
        try {
            const details = await fetchSubmissionDetailsById(item.subId)
            if (details) {
                if (typeof details.content !== 'string') {
                    details.content = JSON.stringify(details.content);
                }
                setViewingSubmission(details)
            }
        } catch (error) {
            console.error('Failed to fetch submission details', error)
        } finally {
            setIsLoadingHistoryDetail(false)
        }
    }

    const hasSubmitted = props.submissionHistory.some(item => item.assignmentId === activeAssignment.id)

    const isSolutionVisible = assignmentData.isSolutionVisible[activeAssignment.id] ?? false
    const isLoadingSolution = assignmentData.loadingId === activeAssignment.id

    // Rendered inside the tab rail for code/project; on predict there is no
    // rail, so it stands alone above the editor.
    const assignmentActions = (
        <AssignmentFooter
            submitStatus={submit.isSubmitting ? 'waiting' : 'idle'}
            onSubmit={handleGlobalSubmit}
            isSubmitDisabled={submit.isRunning || submit.isSubmitting || submit.isSubmittingPredict}

            canRevealAnswer={hasSubmitted}
            isSolutionVisible={isSolutionVisible}
            isLoadingSolution={isLoadingSolution}
            onToggleSolution={handleToggleSolution}
            historyStatus={
                viewingSubmission
                    ? (viewingSubmission.passed ? 'success' : 'error')
                    : null
            }
                onExitView={handleBackToEditor}
        />
    )

    return (
        <div className={STUDENT_WORKSPACE_LAYOUT_CLASS}>
            <AppHeader
                variant="bar"
                section={WORKSPACE_SECTION_LABEL}
                sessionLabel={props.sessionLabel}
                displayName={props.displayName}
                onLeaveSession={props.onLeaveSession}
                leaveLabel={props.sessionActionLabel}
            />

            <div className={STUDENT_WORKSPACE_MAIN_CLASS}>

                <ProblemsList
                    {...progress.problemsListProps}
                    isHistoryLoading={props.isHistoryLoading}
                />

                <div className={STUDENT_WORKSPACE_CONTENT_COLUMN_CLASS}>
                    {progress.followBannerProps && <TeacherFollowBanner {...progress.followBannerProps} />}

                    <div className={STUDENT_WORKSPACE_CLASS}>
                        <AssignmentPanel
                            {...progress.assignmentPanelProps}
                            onTabChange={handlePanelTabChange}
                            onViewSubmission={handleViewSubmission}
                            viewingSubmissionId={viewingSubmission?.subId}
                        />

                        <div className={STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS}>
                            {activeAssignment.kind === 'code' || activeAssignment.kind === 'project' ? (
                                <CodeFileTabs
                                    files={mode.tabFiles}
                                    activeIndex={mode.activeTabIndex}
                                    onSelectFile={mode.handleSelectFile}
                                    isRunning={submit.isRunning}
                                    onRun={submit.handleRunCode}
                                    actions={assignmentActions}
                                />
                            ) : (
                                assignmentActions
                            )}
                            {viewingSubmission && (
                                <SubmissionBanner
                                    number={getSubmissionNumber(
                                        props.submissionHistory,
                                        activeAssignment.id,
                                        viewingSubmission.subId,
                                    )}
                                    submittedAt={viewingSubmission.submittedAt}
                                    passed={viewingSubmission.passed}
                                />
                            )}
                            <CodeEditor
                                key={mode.editorRemountKey}
                                value={mode.editorValue}
                                onChange={mode.handleEditorChange}
                                isReadOnly={mode.isReadOnly}
                            />
                            {activeAssignment.kind === 'code' && (
                                <OutputPanel
                                    output={
                                        viewingSubmission
                                            ? (viewingSubmission.result?.stdout?.trim() || viewingSubmission.result?.stderr || '')
                                            : submit.outputState.output
                                    }
                                    status={viewingSubmission ? (viewingSubmission.result?.status ?? null ) : submit.outputState.status}
                                    placeHolder={mode.isReadOnly ? 'Back to Editor to run your code…' : 'Press Run to see your output…'}
                                />
                            )}
                            {activeAssignment.kind === 'predict' && (
                                <PredictPanel
                                    answer={viewingSubmission ? viewingSubmission.content : (drafts.state.predict[activeAssignment.id] ?? '')}
                                    status={viewingSubmission ? (viewingSubmission.passed ? 'correct' : 'tried' ) : submit.predictStatus}
                                    expectedOutput={activeAssignment.expectedOutput}
                                    isSolutionVisible={isSolutionVisible}
                                    onAnswerChange={(val) => drafts.updatePredict(activeAssignment.id, val)}
                                />
                            )}
                            {activeAssignment.kind === 'project' && !viewingSubmission && !isSolutionVisible && (
                                <ProjectPanel
                                    files={drafts.state.project[activeAssignment.id] ?? []}
                                    onFilesChange={(files) => drafts.updateProject(activeAssignment.id, files)}
                                    hasSubmitted={hasSubmitted}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}