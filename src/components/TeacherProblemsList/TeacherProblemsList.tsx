import { type ChangeEvent } from 'react'
import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { formatTimerEnds, ProblemsListRow } from '@components/ProblemsList'

import type { TeacherProblemsListProps, TeacherProblemItem } from './TeacherProblemsList.types'
import {
  LIST_CLASS_BASE,
  LIST_CLASS_OPEN,
  LIST_CLASS_CLOSED,
  LIST_HEADER_CLASS,
  LIST_HEADER_RIGHT_CLASS,
  LIST_COUNT_CLASS,
  LIST_TOGGLE_CLASS,
  LIST_ITEMS_CLASS,
  LIST_CARD_BODY_CLASS,
} from '@components/ProblemsList/ProblemsList.constants'
import {
  TIMER_SECTION_CLASS,
  TIMER_LABEL_ROW_CLASS,
  TIMER_LABEL_CLASS,
  TIMER_ENDS_BADGE_CLASS,
  TIMER_INPUT_ROW_CLASS,
  TIMER_INPUT_CLASS,
  TIMER_UNIT_LABEL_CLASS,
  TIMER_START_CLASS,
  TIMER_ERROR_CLASS,
} from './TeacherProblemsList.constants'

export default function TeacherProblemsList({
  items,
  activeId,
  onSelect,
  teacherFocusId,
  isOpen,
  onToggleOpen,
  timerMinutes,
  onTimerMinutesChange,
  onStartTimer,
  isStartingTimer = false,
  timerEndsAt,
  timerError,
}: TeacherProblemsListProps) {

  function handleTimerMinutesInput(event: ChangeEvent<HTMLInputElement>) {
    onTimerMinutesChange(Number(event.target.value))
  }

  return (
    <aside className={classNames(LIST_CLASS_BASE, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      {/* Header — no rounding/border of its own, same flat-top treatment as the student rail's tab row above LIST_CARD_BODY_CLASS. */}
      <div className={LIST_HEADER_CLASS}>
        {isOpen && 'Assignments'}
        <span className={LIST_HEADER_RIGHT_CLASS}>
          {isOpen && <span className={LIST_COUNT_CLASS}>{items.length}</span>}
          <button
            type="button"
            onClick={onToggleOpen}
            className={LIST_TOGGLE_CLASS}
            aria-label={isOpen ? 'Collapse list' : 'Expand list'}
          >
            <Icon name={isOpen ? 'chevronsLeft' : 'chevronsRight'} />
          </button>
        </span>
      </div>

      <div className={LIST_CARD_BODY_CLASS}>
        <ul className={LIST_ITEMS_CLASS}>
          {items.map((item: TeacherProblemItem) => (
            <ProblemsListRow
              key={item.id}
              id={item.id}
              title={item.title}
              kind={item.kind}
              status={item.status}
              isActive={item.id === activeId}
              isLive={item.id === teacherFocusId}
              isOpen={isOpen}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </ul>

        {isOpen && (
          <div className={TIMER_SECTION_CLASS}>
            <div className={TIMER_LABEL_ROW_CLASS}>
              <span className={TIMER_LABEL_CLASS}>
                <Icon name="history" />
                Timer
              </span>
              {timerEndsAt && <span className={TIMER_ENDS_BADGE_CLASS}>{formatTimerEnds(timerEndsAt)}</span>}
            </div>
            <div className={TIMER_INPUT_ROW_CLASS}>
              <input
                type="number"
                min={1}
                max={120}
                value={timerMinutes}
                onChange={handleTimerMinutesInput}
                aria-label="Timer minutes"
                className={TIMER_INPUT_CLASS}
              />
              <span className={TIMER_UNIT_LABEL_CLASS}>min</span>
              <button
                type="button"
                onClick={onStartTimer}
                disabled={isStartingTimer}
                className={TIMER_START_CLASS}
              >
                {isStartingTimer ? 'Starting…' : 'Start'}
              </button>
            </div>
            {timerError && <p className={TIMER_ERROR_CLASS}>{timerError}</p>}
          </div>
        )}
      </div>
    </aside>
  )
}
