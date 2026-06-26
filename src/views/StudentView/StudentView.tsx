import {
  Toolbar,
  JoinRoomBar,
  Sidebar,
  CodeEditor,
  OutputPanel,
  PredictPanel,
  ProjectPanel,
  SubmitModal,
} from '@components'
import { useStudentWorkspace } from './StudentView.hooks'
import { useStudentSession } from './useStudentSession'
import {
  STUDENT_LAYOUT_CLASS,
  STUDENT_MAIN_CLASS,
  STUDENT_EDITOR_COLUMN_CLASS,
} from './StudentView.constants'

export default function StudentView() {
  const { activePanel, toolbar, sidebar, submitModal, scene } = useStudentWorkspace()
  const session = useStudentSession()
  const { Scene } = scene

  return (
    <div className={STUDENT_LAYOUT_CLASS}>
      <Toolbar {...toolbar} />
      <JoinRoomBar {...session} />
      <div className={STUDENT_MAIN_CLASS}>
        <Sidebar {...sidebar} />
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
            completedTasks={scene.completedTasks}
            activeTask={scene.activeTask}
          />
        )}
      </div>
      <SubmitModal {...submitModal} />
    </div>
  )
}
