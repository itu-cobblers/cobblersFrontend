import { type ChangeEvent } from 'react'
import classNames from 'classnames'
import { StatusBadge } from '@components/StatusBadge'
import { Icon } from '@components/Icon'
import { formatTimerEnds } from '@components/ProblemsList'

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
  LIST_ITEM_BASE_CLASS,
  LIST_ITEM_ACTIVE_CLASS,
  LIST_ITEM_IDLE_CLASS,
  LIST_ITEM_ACCENT_BAR_CLASS,
  LIST_ITEM_KIND_BADGE_CLASS,
  LIST_ITEM_TITLE_CLASS,
  KIND_LABEL,
} from '@components/ProblemsList/ProblemsList.constants'
import {
  ITEM_CONTENT_CLASS,
  ITEM_META_ROW_CLASS,
  ITEM_STATS_GROUP_CLASS,
  ITEM_PASSED_COUNT_CLASS,
  ITEM_LIVE_BADGE_CLASS,
  ITEM_NUMBER_BADGE_CLASS,
  TEACHER_LIST_CARD_CLASS,
  TIMER_SECTION_CLASS,
  TIMER_SECTION_COLLAPSED_CLASS,
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
    <aside className={classNames(LIST_CLASS_BASE, TEACHER_LIST_CARD_CLASS, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      {/* Header */}
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

      {/* Assignment Items */}
      <ul className={LIST_ITEMS_CLASS}>
        {items.map((item: TeacherProblemItem) => {
          const isActive = item.id === activeId
          const isTeacherFocus = item.id === teacherFocusId
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                title={item.title}
                className={classNames(
                  LIST_ITEM_BASE_CLASS,
                  isActive ? LIST_ITEM_ACTIVE_CLASS : LIST_ITEM_IDLE_CLASS,
                )}
              >
                {isActive && <span className={LIST_ITEM_ACCENT_BAR_CLASS} />}

                {item.studentStatus ? (
                  <StatusBadge status={item.studentStatus} />
                ) : (
                  <span className={ITEM_NUMBER_BADGE_CLASS}>#{item.id}</span>
                )}

                {isOpen && (
                  <div className={ITEM_CONTENT_CLASS}>
                    <div className={ITEM_META_ROW_CLASS}>
                      <span className={LIST_ITEM_KIND_BADGE_CLASS}>{KIND_LABEL[item.kind]}</span>
                      {item.passedNum !== undefined && item.totalNum !== undefined && (
                        <div className={ITEM_STATS_GROUP_CLASS}>
                          <span className={ITEM_PASSED_COUNT_CLASS}>
                            {item.passedNum}/{item.totalNum} passed
                          </span>
                          {isTeacherFocus && <span className={ITEM_LIVE_BADGE_CLASS}>live</span>}
                        </div>
                      )}
                    </div>
                    <div className={LIST_ITEM_TITLE_CLASS}>{item.title}</div>
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {isOpen ? (
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
      ) : (
        <div className={TIMER_SECTION_COLLAPSED_CLASS} title={timerEndsAt ? formatTimerEnds(timerEndsAt) : 'Timer'}>
          <Icon name="history" />
        </div>
      )}
    </aside>
  )
}
