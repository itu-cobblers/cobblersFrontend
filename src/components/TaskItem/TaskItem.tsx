import classNames from 'classnames'
import type { TaskItemProps } from './TaskItem.types'
import {
  TASK_ITEM_BASE_CLASS,
  TASK_ITEM_ACTIVE_CLASS,
  TASK_CHECK_BASE_CLASS,
  TASK_CHECK_DONE_CLASS,
  TASK_INFO_CLASS,
  TASK_TITLE_BASE_CLASS,
  TASK_TITLE_DONE_CLASS,
} from './TaskItem.constants'

export default function TaskItem({ id, title, isActive, isDone, onSelect }: TaskItemProps) {
  function handleClick() {
    onSelect(id)
  }

  return (
    <li
      className={classNames(TASK_ITEM_BASE_CLASS, { [TASK_ITEM_ACTIVE_CLASS]: isActive })}
      onClick={handleClick}
    >
      <span className={classNames(TASK_CHECK_BASE_CLASS, { [TASK_CHECK_DONE_CLASS]: isDone })}>
        {isDone && '✓'}
      </span>
      <div className={TASK_INFO_CLASS}>
        <span className={classNames(TASK_TITLE_BASE_CLASS, { [TASK_TITLE_DONE_CLASS]: isDone })}>
          {title}
        </span>
      </div>
    </li>
  )
}
