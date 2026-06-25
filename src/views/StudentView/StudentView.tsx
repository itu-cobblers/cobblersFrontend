import { Toolbar, Sidebar, CodeEditor, OutputPanel, SubmitModal } from '@components'
import { useStudentWorkspace } from './StudentView.hooks'
import {
  STUDENT_LAYOUT_CLASS,
  STUDENT_MAIN_CLASS,
  STUDENT_EDITOR_COLUMN_CLASS,
} from './StudentView.constants'

export default function StudentView() {
  const { editor, output, toolbar, sidebar, submitModal, scene } = useStudentWorkspace()
  const { Scene } = scene

  return (
    <div className={STUDENT_LAYOUT_CLASS}>
      <Toolbar {...toolbar} />
      <div className={STUDENT_MAIN_CLASS}>
        <Sidebar {...sidebar} />
        <div className={STUDENT_EDITOR_COLUMN_CLASS}>
          <CodeEditor {...editor} />
          <OutputPanel {...output} />
        </div>
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
