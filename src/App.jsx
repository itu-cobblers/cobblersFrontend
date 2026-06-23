import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import OutputPanel from './components/OutputPanel'
import SubmitModal from './components/SubmitModal'
import EditorWindow from './components/EditorWindow'

import { useExecutor } from './hooks/useExecutor'
import { useTasks } from './hooks/useTasks'
import { useSubmission } from './hooks/useSubmission'
import { TASKS, defaultStarter } from './lib/tasks'
import { ACTIVE_THEME } from './themes'

import './App.css'

const STARTER = TASKS[0]?.starter ?? defaultStarter

export default function App() {
  const [code, setCode] = useState(STARTER)
  const [sidebarFolded, setSidebarFolded] = useState(false)

  const executor = useExecutor()
  const tasks = useTasks()
  const submission = useSubmission({
    // When a submission comes back: mirror it in the terminal, and if the
    // backend accepted it, complete the active task.
    onResult: (submittedCode, result) => {
      executor.showResult(result)
      if (result.accepted) tasks.grade(submittedCode, result, { forceComplete: true })
    },
  })

  const Scene = ACTIVE_THEME.Scene

  async function handleRun() {
    const data = await executor.run(code)
    if (data) tasks.grade(code, data)
  }

  return (
    <div className="app">
      <Toolbar
        onRun={handleRun}
        isRunning={executor.isRunning}
        onSubmit={submission.open}
        isSubmitting={submission.isSubmitting}
        onToggleSidebar={() => setSidebarFolded((f) => !f)}
        subtitle={ACTIVE_THEME.subtitle}
      />
      <div className="main">
        <Sidebar
          activeTask={tasks.activeTask}
          onSelectTask={tasks.setActiveTask}
          completedTasks={tasks.completedTasks}
          folded={sidebarFolded}
        />
        <div className="editor-column">
          <EditorWindow code={code} onChange={setCode} />
          <OutputPanel output={executor.output} status={executor.status} />
        </div>
        {Scene && (
          <Scene
            signals={tasks.signals}
            completedTasks={tasks.completedTasks}
            activeTask={tasks.activeTask}
          />
        )}
      </div>
      <SubmitModal
        open={submission.showSubmit}
        isSubmitting={submission.isSubmitting}
        result={submission.result}
        onConfirm={() => submission.confirm(code, tasks.activeTaskId)}
        onCancel={submission.close}
        onClose={submission.close}
      />
    </div>
  )
}
