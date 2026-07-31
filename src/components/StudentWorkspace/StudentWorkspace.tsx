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
import { useAssignmentSolutions } from './hooks/useAssignmentSolutions'
import { useWorkspaceMode } from './hooks/useWorkspaceMode'
import { useWorkspaceSubmit } from './hooks/useWorkspaceSubmit'
import type { AssignmentSet, SubmissionHistoryItem } from '@types'

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
    const progress = useWorkspaceProgress({
        assignmentSet: props.assignmentSet,
        submissionHistory: props.submissionHistory,
        teacherFocusedAssignmentId: props.teacherFocusedAssignmentId
    })
    const activeAssignment = progress.activeAssignment

    const drafts = useLocalDrafts(props.assignmentSet.assignments)
    const solutions = useAssignmentSolutions()

    const mode = useWorkspaceMode({
        activeAssignment,
        drafts,
        solutions
    })

    const submit = useWorkspaceSubmit({
        activeAssignment,
        sessionCode: props.sessionCode,
        currentContent: mode.currentContent,
        assignmentProgress: progress.assignmentProgress,
        solutions: solutions,
        onSubmissionMade: props.onSubmissionMade
    })

    const isCompleted = progress.assignmentProgress.completedAssignments.has(activeAssignment.id)
    const hasSubmitted = props.submissionHistory.some(item => item.assignmentId === activeAssignment.id)
    const isSolutionVisible = solutions.isSolutionVisible[activeAssignment.id] ?? false
    const isLoadingSolution = solutions.loadingId === activeAssignment.id

    const canRevealAnswer = hasSubmitted && !isCompleted
    const canMarkAsDone = isSolutionVisible && !isCompleted
    const submitStatus = submit.isSubmitting ? 'waiting' : submit.submitFlash ? (submit.submitFlash.passed ? 'success' : 'error') : 'idle'

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
                                    output={submit.outputState.output}
                                    status={submit.outputState.status}
                                    footer={{
                                        submitStatus,
                                        onSubmit: submit.handleSubmitCode,
                                        canRevealAnswer,
                                        isSolutionVisible,
                                        isLoadingSolution,
                                        onToggleSolution: () => solutions.toggleSolution(activeAssignment.id, activeAssignment.kind),
                                        canMarkAsDone,
                                        isMarkingDone: submit.isMarkingDone,
                                        onMarkAsDone: submit.handleMarkAsDone
                                    }}
                                />
                            )}
                            {activeAssignment.kind === 'predict' && (
                                <PredictPanel
                                    answer={drafts.state.predict[activeAssignment.id] ?? ''}
                                    status={submit.predictStatus}
                                    isSubmitting={submit.isSubmittingPredict}
                                    isMarkingDone={submit.isMarkingDone}
                                    lastAnswerCorrect={submit.submitFlash?.passed ?? null}
                                    expectedOutput={activeAssignment.expectedOutput}
                                    canRevealAnswer={canRevealAnswer}
                                    isSolutionVisible={isSolutionVisible}
                                    onToggleSolution={() => solutions.toggleSolution(activeAssignment.id, activeAssignment.kind)}
                                    canMarkAsDone={canMarkAsDone}
                                    onMarkAsDone={submit.handleMarkAsDone}
                                    onAnswerChange={(val) => drafts.updatePredict(activeAssignment.id, val)}
                                    onSubmit={submit.handlePredictSubmit}
                                />
                            )}
                            {activeAssignment.kind === 'project' && (
                                <ProjectPanel
                                    files={drafts.state.project[activeAssignment.id] ?? []}
                                    onFilesChange={(files) => drafts.updateProject(activeAssignment.id, files)}
                                    hasSubmitted={hasSubmitted}
                                    isSubmitting={submit.isSubmitting}
                                    lastSubmitPassed={submit.submitFlash?.passed ?? null}
                                    onSubmit={submit.handleProjectSubmit}
                                    isLoadingSolution={isLoadingSolution}
                                    isSolutionVisible={isSolutionVisible}
                                    onToggleSolution={() => solutions.toggleSolution(activeAssignment.id, activeAssignment.kind)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}