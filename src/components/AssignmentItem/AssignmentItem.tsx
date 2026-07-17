import classNames from 'classnames'
import type { AssignmentItemProps } from './AssignmentItem.types'
import {
  ASSIGNMENT_ITEM_BASE_CLASS,
  ASSIGNMENT_ITEM_ACTIVE_CLASS,
  ASSIGNMENT_CHECK_BASE_CLASS,
  ASSIGNMENT_CHECK_DONE_CLASS,
  ASSIGNMENT_INFO_CLASS,
  ASSIGNMENT_TITLE_BASE_CLASS,
  ASSIGNMENT_TITLE_DONE_CLASS,
} from './AssignmentItem.constants'

export default function AssignmentItem({ id, title, isActive, isDone, onSelect }: AssignmentItemProps) {
  function handleClick() {
    onSelect(id)
  }

  return (
    <li
      className={classNames(ASSIGNMENT_ITEM_BASE_CLASS, { [ASSIGNMENT_ITEM_ACTIVE_CLASS]: isActive })}
      onClick={handleClick}
    >
      <span className={classNames(ASSIGNMENT_CHECK_BASE_CLASS, { [ASSIGNMENT_CHECK_DONE_CLASS]: isDone })}>
        {isDone && '✓'}
      </span>
      <div className={ASSIGNMENT_INFO_CLASS}>
        <span className={classNames(ASSIGNMENT_TITLE_BASE_CLASS, { [ASSIGNMENT_TITLE_DONE_CLASS]: isDone })}>
          {title}
        </span>
      </div>
    </li>
  )
}
