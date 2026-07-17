import { AssignmentItem } from '@components/AssignmentItem'
import type { AssignmentListProps } from './AssignmentList.types'
import { ASSIGNMENT_LIST_CLASS } from './AssignmentList.constants'

export default function AssignmentList({ items, onSelect }: AssignmentListProps) {
  return (
    <ul className={ASSIGNMENT_LIST_CLASS}>
      {items.map((item) => (
        <AssignmentItem key={item.id} {...item} onSelect={onSelect} />
      ))}
    </ul>
  )
}
