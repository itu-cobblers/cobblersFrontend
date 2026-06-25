import { TaskItem } from '@components/TaskItem'
import type { TaskListProps } from './TaskList.types'
import { TASK_LIST_CLASS } from './TaskList.constants'

export default function TaskList({ items, onSelect }: TaskListProps) {
  return (
    <ul className={TASK_LIST_CLASS}>
      {items.map((item) => (
        <TaskItem key={item.id} {...item} onSelect={onSelect} />
      ))}
    </ul>
  )
}
