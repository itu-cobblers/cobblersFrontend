import type { Taskset } from '@types'
import { Toolbar, Sidebar, CodeEditor, OutputPanel, PredictPanel, ProjectPanel, SubmitModal } from '@components'
import { useStudentWorkspace } from './StudentView.hooks'
import {
  STUDENT_LAYOUT_CLASS,
  STUDENT_MAIN_CLASS,
  STUDENT_EDITOR_COLUMN_CLASS,
} from './StudentView.constants'

interface StudentIdeProps {
  taskset: Taskset
}

export default function StudentIde({ taskset }: StudentIdeProps) {
  const { activePanel, toolbar, sidebar, submitModal, scene } = useStudentWorkspace(taskset)
  const { Scene } = scene

  return (
    <div className={STUDENT_LAYOUT_CLASS}>
      <Toolbar {...toolbar} />
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
