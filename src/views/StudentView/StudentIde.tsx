import type { Assignment, AssignmentSet, SubmissionHistoryItem } from '@types'
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
import { useStudentWorkspace } from './StudentView.hooks'
import {
  STUDENT_LAYOUT_CLASS,
  STUDENT_GRID_CLASS,
  STUDENT_GLOW_CLASS,
  STUDENT_MAIN_CLASS,
  STUDENT_WORKSPACE_CLASS,
  STUDENT_CONTENT_COLUMN_CLASS,
  STUDENT_EDITOR_COLUMN_CLASS,
} from './StudentView.constants'

interface StudentIdeProps {
  assignmentSet: AssignmentSet
  sessionLabel: string
  sessionActionLabel: string
  onLeaveSession: () => void
  /** The room's join code when in one — tags submissions; omitted for solo. */
  sessionCode?: string
  displayName: string
  /** The assignment id the teacher is currently focused on (join-mode only, via the hub); `null` otherwise. */
  teacherFocusedAssignmentId: number | null
  /** This student's full history, across all days — seeds "already passed" and backs the rail's History tab. */
  submissionHistory: SubmissionHistoryItem[]
  /** The full cross-day catalog — backs the rail's History tab alongside `submissionHistory`. */
  catalog: Assignment[]
  /** True while `submissionHistory`/`catalog` are (re)loading. */
  isHistoryLoading: boolean
  /** Called after every submit attempt so the caller can refresh `submissionHistory`. */
  onSubmissionMade: () => void
}

export default function StudentIde({
  assignmentSet,
  sessionLabel,
  sessionActionLabel,
  onLeaveSession,
  sessionCode,
  displayName,
  teacherFocusedAssignmentId,
  submissionHistory,
  catalog,
  isHistoryLoading,
  onSubmissionMade,
}: StudentIdeProps) {
  const { activePanel, problemsList, followBanner, codeFileTabs, assignmentPanel} =
    useStudentWorkspace({
      assignmentSet,
      sessionCode,
      submissionHistory,
      teacherFocusedAssignmentId,
      catalog,
      isHistoryLoading,
      onSubmissionMade,
    })
  return (
    <div className={STUDENT_LAYOUT_CLASS}>
      <div className={STUDENT_GRID_CLASS} />
      <div className={STUDENT_GLOW_CLASS} />
      <div className={STUDENT_MAIN_CLASS}>
        <ProblemsList
          {...problemsList}
          sessionLabel={sessionLabel}
          displayName={displayName}
          onLeaveSession={onLeaveSession}
          leaveLabel={sessionActionLabel}
        />
        <div className={STUDENT_CONTENT_COLUMN_CLASS}>
          {followBanner && <TeacherFollowBanner {...followBanner} />}
          <div className={STUDENT_WORKSPACE_CLASS}>
            <AssignmentPanel {...assignmentPanel} />
            <div className={STUDENT_EDITOR_COLUMN_CLASS}>
              {(activePanel.kind === 'code' || activePanel.kind === 'project') && codeFileTabs && (
                <CodeFileTabs {...codeFileTabs} />
              )}
              <CodeEditor {...activePanel.editor} />
              {activePanel.kind === 'code' && <OutputPanel {...activePanel.output} />}
              {activePanel.kind === 'predict' && <PredictPanel {...activePanel.predict} />}
              {activePanel.kind === 'project' && <ProjectPanel {...activePanel.project} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
