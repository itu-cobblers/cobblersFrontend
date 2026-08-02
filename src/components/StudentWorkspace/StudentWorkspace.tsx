import {
    ProblemsList,
    TeacherFollowBanner,
    AssignmentPanel,
    Toolbar,
    CodeEditor,
    OutputPanel,
    PredictPanel,
    ProjectPanel
} from '@components'
import {
    STUDENT_WORKSPACE_LAYOUT_CLASS,
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
                            canRevealAnswer={canRevealAnswer}
                            isSolutionVisible={isSolutionVisible}
                            isLoadingSolution={isLoadingSolution}
                            onToggleSolution={() => solutions.toggleSolution(activeAssignment.id, activeAssignment.kind)}
                        />

                        <div className={STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS}>
                            <Toolbar
                                files={mode.tabFiles}
                                activeIndex={mode.activeTabIndex}
                                onSelectFile={mode.handleSelectFile}
                                {...(activeAssignment.kind === 'code'
                                    ? { isRunning: submit.isRunning, onRun: submit.handleRunCode }
                                    : {})}
                                submitStatus={submitStatus}
                                onSubmit={
                                    activeAssignment.kind === 'predict'
                                        ? submit.handlePredictSubmit
                                        : activeAssignment.kind === 'project'
                                            ? submit.handleProjectSubmit
                                            : submit.handleSubmitCode
                                }
                                canMarkAsDone={canMarkAsDone}
                                isMarkingDone={submit.isMarkingDone}
                                onMarkAsDone={submit.handleMarkAsDone}
                            />
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
                                />
                            )}
                            {activeAssignment.kind === 'predict' && (
                                <PredictPanel
                                    answer={drafts.state.predict[activeAssignment.id] ?? ''}
                                    status={submit.predictStatus}
                                    expectedOutput={activeAssignment.expectedOutput}
                                    isSolutionVisible={isSolutionVisible}
                                    onAnswerChange={(val) => drafts.updatePredict(activeAssignment.id, val)}
                                />
                            )}
                            {activeAssignment.kind === 'project' && (
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