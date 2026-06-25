import type { TaskDetailProps } from './TaskDetail.types'
import {
  TASK_DETAIL_CLASS,
  TASK_DETAIL_TITLE_CLASS,
  TASK_DETAIL_DESC_CLASS,
  TASK_HINT_CLASS,
  TASK_HINT_CODE_CLASS,
} from './TaskDetail.constants'

export default function TaskDetail({ title, description, hint }: TaskDetailProps) {
  return (
    <div className={TASK_DETAIL_CLASS}>
      <h3 className={TASK_DETAIL_TITLE_CLASS}>{title}</h3>
      <p className={TASK_DETAIL_DESC_CLASS}>{description}</p>
      {hint && (
        <div className={TASK_HINT_CLASS}>
          💡 Hint: <code className={TASK_HINT_CODE_CLASS}>{hint}</code>
        </div>
      )}
    </div>
  )
}
