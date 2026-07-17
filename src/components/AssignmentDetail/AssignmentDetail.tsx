import type { AssignmentDetailProps } from './AssignmentDetail.types'
import {
  ASSIGNMENT_DETAIL_CLASS,
  ASSIGNMENT_DETAIL_TITLE_CLASS,
  ASSIGNMENT_DETAIL_DESC_CLASS,
  ASSIGNMENT_HINT_CLASS,
  ASSIGNMENT_HINT_CODE_CLASS,
} from './AssignmentDetail.constants'

export default function AssignmentDetail({ title, description, hint }: AssignmentDetailProps) {
  return (
    <div className={ASSIGNMENT_DETAIL_CLASS}>
      <h3 className={ASSIGNMENT_DETAIL_TITLE_CLASS}>{title}</h3>
      <p className={ASSIGNMENT_DETAIL_DESC_CLASS}>{description}</p>
      {hint && (
        <div className={ASSIGNMENT_HINT_CLASS}>
          💡 Hint: <code className={ASSIGNMENT_HINT_CODE_CLASS}>{hint}</code>
        </div>
      )}
    </div>
  )
}
