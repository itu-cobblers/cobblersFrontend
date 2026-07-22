import type { MouseEvent } from 'react'
import classNames from 'classnames'
import type { AssignmentStepperProps } from './AssignmentStepper.types'
import {
  STEPPER_CLASS,
  STEPPER_STEP_WRAP_CLASS,
  STEPPER_NODE_BASE_CLASS,
  STEPPER_NODE_IDLE_CLASS,
  STEPPER_NODE_DONE_CLASS,
  STEPPER_NODE_ACTIVE_CLASS,
  STEPPER_PROGRESS_CLASS,
} from './AssignmentStepper.constants'

/**
 * The compact progress strip that replaces a full assignment list: one numbered
 * node per assignment (done / active state, clickable). Titles stay in tooltips
 * and aria-labels only — the circle shows the assignment number (1-based).
 */
export default function AssignmentStepper({ steps, onSelect }: AssignmentStepperProps) {
  function handleClick(event: MouseEvent<HTMLElement>) {
    const target = event.target
    if (!(target instanceof Element)) return
    const id = target.closest('[data-step-id]')?.getAttribute('data-step-id')
    if (id != null) onSelect(Number(id))
  }

  const completed = steps.filter((step) => step.isDone).length

  return (
    <nav aria-label="Assignments" className={STEPPER_CLASS} onClick={handleClick}>
      {steps.map((step, index) => (
        <span key={step.id} className={STEPPER_STEP_WRAP_CLASS} data-step-id={step.id}>
          <button
            type="button"
            title={step.title}
            aria-label={step.title}
            aria-current={step.isActive || undefined}
            className={classNames(STEPPER_NODE_BASE_CLASS, {
              [STEPPER_NODE_IDLE_CLASS]: !step.isDone && !step.isActive,
              [STEPPER_NODE_DONE_CLASS]: step.isDone && !step.isActive,
              [STEPPER_NODE_ACTIVE_CLASS]: step.isActive,
            })}
          >
            {index + 1}
          </button>
        </span>
      ))}
      <span className={STEPPER_PROGRESS_CLASS}>
        {completed}/{steps.length}
      </span>
    </nav>
  )
}
