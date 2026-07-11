import classNames from 'classnames'
import { ProgressBar } from '@components/ProgressBar'
import { TaskList } from '@components/TaskList'
import { TaskDetail } from '@components/TaskDetail'
import type { SidebarProps } from './Sidebar.types'
import {
  SIDEBAR_BASE_CLASS,
  SIDEBAR_OPEN_CLASS,
  SIDEBAR_FOLDED_CLASS,
  SIDEBAR_HEADER_CLASS,
  SIDEBAR_HEADING_CLASS,
  SIDEBAR_PROGRESS_LABEL_CLASS,
  SIDEBAR_SCROLL_CLASS,
  SIDEBAR_DAY_HEADER_CLASS,
} from './Sidebar.constants'

export default function Sidebar({ groups, detail, progress, isFolded, onSelect }: SidebarProps) {
  return (
    <aside
      className={classNames(SIDEBAR_BASE_CLASS, {
        [SIDEBAR_OPEN_CLASS]: !isFolded,
        [SIDEBAR_FOLDED_CLASS]: isFolded,
      })}
    >
      <div className={SIDEBAR_HEADER_CLASS}>
        <h2 className={SIDEBAR_HEADING_CLASS}>Tasks</h2>
        <ProgressBar value={progress.completed} max={progress.total} />
        <span className={SIDEBAR_PROGRESS_LABEL_CLASS}>
          {progress.completed}/{progress.total} completed
        </span>
      </div>
      <div className={SIDEBAR_SCROLL_CLASS}>
        {groups.map((group) => (
          <section key={group.label}>
            <h3 className={SIDEBAR_DAY_HEADER_CLASS}>{group.label}</h3>
            <TaskList items={group.items} onSelect={onSelect} />
          </section>
        ))}
      </div>
      <TaskDetail {...detail} />
    </aside>
  )
}
