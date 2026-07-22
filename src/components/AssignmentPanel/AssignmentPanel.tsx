import { AssignmentStepper } from '@components/AssignmentStepper'
import { FeedbackBanner } from '@components/FeedbackBanner'
import type { AssignmentPanelProps } from './AssignmentPanel.types'
import {
  PANEL_CLASS,
  PANEL_SCROLL_CLASS,
  PANEL_TITLE_CLASS,
  PANEL_LESSON_TEXT_CLASS,
  PANEL_LESSON_CODE_CLASS,
  PANEL_TASK_LABEL_CLASS,
  PANEL_TASK_CLASS,
  PANEL_BODY_CLASS,
  PANEL_HINT_CLASS,
  PANEL_HINT_CODE_CLASS,
} from './AssignmentPanel.constants'

/**
 * The left column of the IDE: progress stepper on top, then the active
 * assignment — teaching content (lesson blocks), the task itself, an optional
 * hint — with check feedback pinned at the bottom, outside the scroll region.
 */
export default function AssignmentPanel({
  steps,
  onSelectStep,
  title,
  lesson,
  description,
  body,
  hint,
  feedback,
}: AssignmentPanelProps) {
  return (
    <section className={PANEL_CLASS}>
      <AssignmentStepper steps={steps} onSelect={onSelectStep} />
      <div className={PANEL_SCROLL_CLASS}>
        <h2 className={PANEL_TITLE_CLASS}>{title}</h2>
        {lesson?.map((block, index) =>
          block.kind === 'code' ? (
            <pre key={index} className={PANEL_LESSON_CODE_CLASS}>
              {block.code}
            </pre>
          ) : (
            <p key={index} className={PANEL_LESSON_TEXT_CLASS}>
              {block.text}
            </p>
          ),
        )}
        <h3 className={PANEL_TASK_LABEL_CLASS}>Your task</h3>
        <p className={PANEL_TASK_CLASS}>{description}</p>
        {body && <p className={PANEL_BODY_CLASS}>{body}</p>}
        {hint && (
          <div className={PANEL_HINT_CLASS}>
            💡 Hint: <code className={PANEL_HINT_CODE_CLASS}>{hint}</code>
          </div>
        )}
      </div>
      {feedback && <FeedbackBanner {...feedback} />}
    </section>
  )
}
