import { TASKS } from '../lib/tasks'

const DIFF_CLASS = { Easy: 'diff-easy', Medium: 'diff-medium', Hard: 'diff-hard' }

export default function Sidebar({ activeTask, onSelectTask, completedTasks, folded }) {
  const completed = completedTasks.size
  const current = TASKS[activeTask]

  return (
    <aside className={`sidebar ${folded ? 'folded' : ''}`}>
      <div className="sidebar-header">
        <h2>Tasks</h2>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completed / TASKS.length) * 100}%` }}
          />
        </div>
        <span className="progress-label">
          {completed}/{TASKS.length} completed
        </span>
      </div>

      <ul className="task-list">
        {TASKS.map((task) => {
          const done = completedTasks.has(task.id)
          return (
            <li
              key={task.id}
              className={`task-item ${task.id === activeTask ? 'active' : ''} ${done ? 'done' : ''}`}
              onClick={() => onSelectTask(task.id)}
            >
              <span className="task-check">{done ? '✓' : ''}</span>
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className={`task-diff ${DIFF_CLASS[task.difficulty]}`}>
                  {task.difficulty}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="task-detail">
        <h3>{current.title}</h3>
        <p>{current.description}</p>
        {current.hint && (
          <div className="task-hint">
            💡 Hint: <code>{current.hint}</code>
          </div>
        )}
      </div>
    </aside>
  )
}
