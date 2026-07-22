import type { AssignmentSet } from '@types'
import { Toolbar, AssignmentPanel, CodeEditor, OutputPanel, PredictPanel, ProjectPanel, SubmitModal } from '@components'
import { useStudentWorkspace } from './StudentView.hooks'
import {
  STUDENT_LAYOUT_CLASS,
  STUDENT_MAIN_CLASS,
  STUDENT_EDITOR_COLUMN_CLASS,
} from './StudentView.constants'

interface StudentIdeProps {
  assignmentSet: AssignmentSet
  sessionLabel: string
  sessionActionLabel: string
  onLeaveSession: () => void
}

export default function StudentIde({
  assignmentSet,
  sessionLabel,
  sessionActionLabel,
  onLeaveSession,
}: StudentIdeProps) {
  const { activePanel, toolbar, assignmentPanel, submitModal, scene } = useStudentWorkspace(assignmentSet)
  const { Scene } = scene

  return (
    <div className={STUDENT_LAYOUT_CLASS}>
      <Toolbar
        {...toolbar}
        sessionLabel={sessionLabel}
        sessionActionLabel={sessionActionLabel}
        onLeaveSession={onLeaveSession}
      />
      <div className={STUDENT_MAIN_CLASS}>
        <AssignmentPanel {...assignmentPanel} />
        {activePanel.kind === 'project' ? (
          <ProjectPanel {...activePanel.project} />
        ) : (
          <div className={STUDENT_EDITOR_COLUMN_CLASS}>
            <CodeEditor {...activePanel.editor} />
            {activePanel.kind === 'code' ? (
              <OutputPanel {...activePanel.output} />
            ) : (
              <PredictPanel {...activePanel.predict} />
            )}
          </div>
        )}
        {Scene && (
          <Scene
            signals={scene.signals}
            completedAssignments={scene.completedAssignments}
            activeAssignment={scene.activeAssignment}
          />
        )}
      </div>
      <SubmitModal {...submitModal} />
    </div>
  )
}
